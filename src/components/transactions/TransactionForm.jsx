import { useAccounts, useCategories, useTransaction } from "@/utils/db/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DatePicker from "../date/DatePicker";
import { buildDateTime } from "@/utils/date/buildDateTime";
import { db } from "@/utils/db/schema";
import { isFuture, format } from "date-fns";

const getCreateDefaultValues = () => ({
    amount: "",
    description: "",
    date: new Date(),
    time: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    }).slice(0, 5),
    accountId: "",
    categoryId: "",
});

const formSchema = z.object({
    amount: z.coerce.number().min(1, "Le montant doit être supérieur à 0."),
    description: z.string().trim().min(5, "Veuillez préciser la dépense (ex: Burger, courses, taxi)."),
    date: z.date(),
    time: z.string().regex(/^\d{2}:\d{2}$/, "Heure non valide."),
    accountId: z.string().min(1, "Vous devez sélectionner un compte."),
    categoryId: z.string().min(1, "Vous devez sélectionner une catégorie."),
}).superRefine((data, ctx) => {
    const dateTime = buildDateTime(data.date, data.time);
    if (isFuture(dateTime)) {
        ctx.addIssue({ 
            code: "custom", 
            path: ["time"],
            message: "La date et l'heure ne peuvent pas être dans le futur.", 
        });
    }
});

export default function TransactionForm({ 
    mode = "create",
    transactionId = null,
    onSuccess 
}) {
    const existingTransaction = useTransaction(
        mode === "edit" ? Number(transactionId) : null
    );
    
    const accounts = useAccounts();
    const categories = useCategories();

    const isLoading =
        (mode === "edit" && !transactionId) ||
        !accounts.length ||
        !categories.length;
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: getCreateDefaultValues(),
    });

    const [localCategory, setLocalCategory] = useState("");
    const [localAccount, setLocalAccount] = useState("");

    
    useEffect(() => {
        if (mode === "edit" && existingTransaction && accounts.length && categories.length) {
            const cat = String(existingTransaction.categoryId);
            const acc = String(existingTransaction.accountId);
        
            form.reset({
                amount: Math.abs(existingTransaction.amount),
                description: existingTransaction.description,
                categoryId: cat,
                accountId: acc,
                date: existingTransaction.date,
                time: format(existingTransaction.date, "HH:mm"),
            });
        
            setTimeout(() => {
                setLocalCategory(cat);
                setLocalAccount(acc);
            }, 0);
        }
    }, [mode, existingTransaction, form, accounts, categories]);

    const onSubmit = async (data) => {
        const category = categories.find(
            (c) => String(c.id) === data.categoryId
        );

        if (!category) {
            toast.error("Catégorie invalide.");
            return;
        }

        const signedAmount = category.type === 'income' 
            ? data.amount 
            : -data.amount;

        const transactionData = {
            date: buildDateTime(data.date, data.time),
            accountId: Number(data.accountId),
            categoryId: Number(data.categoryId),
            amount: signedAmount,
            description: data.description,
        }

        if (mode === "create") {
            await db.transactions.add(transactionData);
            toast.success("Transaction ajoutée avec succès.");
        } else {
            await db.transactions.update(Number(transactionId), transactionData);
            toast.success("Transaction modifiée avec succès.");
        }

        if (mode === "create") {
            form.reset(getCreateDefaultValues());
        }
        onSuccess?.();
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-norway-600" />
            </div>
        );
    }

    return (
        <div className="w-full h-screen p-4 bg-white">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold">
                    {mode === "create" ? "Nouvelle transaction" : "Modifier la transaction"}
                </h2>
                <p className="text-sm text-muted-foreground">
                {mode === "create" 
                    ? "Ajoutez une nouvelle transaction (dépense ou revenu) à votre compte."
                    : "Modifiez les détails de votre transaction."
                }
                </p>
            </div>

            {/* Form */}
            <form
                id="transaction-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <FieldGroup>
                    {/* Montant */}
                    <Controller
                        name="amount"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="transaction-form-title">
                                    Montant
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="transaction-form-title"
                                    aria-invalid={fieldState.invalid}
                                    className="placeholder:text-sm"
                                    placeholder="Entrez la somme de la transaction"
                                    autoComplete="off"
                                    type="number"
                                    inputMode="decimal"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {/* Catégorie */}
                    <Controller
                        name="categoryId"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="transaction-form-category">
                                    Catégorie
                                </FieldLabel>
                                <Select
                                    value={localCategory}
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        setLocalCategory(value);
                                    }}
                                    disabled={!categories.length}
                                >
                                    <SelectTrigger id="transaction-form-category">
                                        <SelectValue placeholder="Choisissez une catégorie" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={category.id.toString()}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {/* Compte */}
                    <Controller
                        name="accountId"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="transaction-form-account">
                                    Compte
                                </FieldLabel>
                                <Select
                                    value={localAccount}
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        setLocalAccount(value);
                                    }}
                                    disabled={!accounts.length}
                                >
                                    <SelectTrigger id="transaction-form-account">
                                        <SelectValue placeholder="Choisissez un compte" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {accounts.map((account) => (
                                            <SelectItem
                                                key={account.id}
                                                value={account.id.toString()}
                                            >
                                                {account.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <Controller
                            name="date"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="transaction-form-date">
                                        Date
                                    </FieldLabel>
                                    <DatePicker
                                        id="transaction-form-date"
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </Field>
                            )}
                        />

                        <Controller
                            name="time"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="transaction-form-time">
                                        Heure
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="transaction-form-time"
                                        type="time"
                                        step="60"
                                        className="bg-background appearance-none
                                            [&::-webkit-calendar-picker-indicator]:hidden
                                            [&::-webkit-calendar-picker-indicator]:appearance-none
                                            text-sm"
                                    />
                                </Field>
                            )}
                        />

                        {(form.formState.errors.date ||
                            form.formState.errors.time) && (
                            <FieldError
                                className="col-span-2"
                                errors={[
                                    form.formState.errors.date,
                                    form.formState.errors.time,
                                ].filter(Boolean)}
                            />
                        )}

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full col-span-2 text-muted-foreground"
                            onClick={() =>
                                form.setValue("time", "00:00", {
                                    shouldValidate: true,
                                })
                            }
                        >
                            Heure inconnue
                        </Button>
                    </div>

                    {/* Description */}
                    <Controller
                        name="description"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="transaction-form-description">
                                    Description
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="transaction-form-description"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Burger chez Paul..."
                                    autoComplete="off"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                                <FieldDescription>
                                    Une courte description aide à mieux suivre vos
                                    dépenses.
                                </FieldDescription>
                            </Field>
                        )}
                    />
                </FieldGroup>
            </form>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={
                        () => {
                            form.reset(getCreateDefaultValues());
                            setLocalAccount("");
                            setLocalCategory("");
                        }
                    }
                >
                    Réinitialiser
                </Button>

                <Button
                    type="submit"
                    form="transaction-form"
                    className="bg-norway-600"
                    disabled={
                        !form.formState.isValid ||
                        form.formState.isSubmitting
                    }
                >
                    {form.formState.isSubmitting
                        ? "Enregistrement..."
                        : mode === "create" ? "Ajouter" : "Enregistrer"
                    }
                </Button>
            </div>
        </div>
    )
}