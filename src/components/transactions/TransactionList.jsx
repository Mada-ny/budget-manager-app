import { useEnrichedTransactions } from "@/utils/db/hooks/useEnrichedTransactions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { db } from "@/utils/db/schema";
import { toast } from "sonner";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
} from "../ui/drawer";  
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";
import { getRelativeDate } from "@/utils/date/getRelativeDate";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { ChevronRight, TrendingUp, TrendingDown, Calendar, CreditCard, Tag, Edit3, Trash2 } from "lucide-react";

export default function TransactionList({
    detailed = false,
    limit,
    variant = "mobile"
}) {
    const navigate = useNavigate();
    const location = useLocation();

    const displayedTransactions = useEnrichedTransactions({ limit });

    const [open, setOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const handleClick = (transaction) => {
        if (!detailed) return;

        setSelectedTransaction(transaction);
        setOpen(true);
    }

    const getTransactionDate = (date) => {
        return detailed
            ? format(date, "dd MMM yyyy", { locale: fr })
            : getRelativeDate(date);
    };

    if (variant === "mobile") {
        return (
            <>
                <div>
                    <div className="space-y-2">
                        {displayedTransactions.map((transaction) => (
                            <div 
                                key={transaction.id}
                                className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-zinc-800 active:scale-[0.98] transition-transform duration-150 cursor-pointer"
                                onClick={() => { handleClick(transaction) }}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                                            transaction.isIncome 
                                                ? 'bg-emerald-50 dark:bg-emerald-950/30' 
                                                : 'bg-rose-50 dark:bg-rose-950/30'
                                        }`}>
                                            {transaction.isIncome ? (
                                                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                            ) : (
                                                <TrendingDown className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
                                                {transaction.description}
                                            </h3>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge 
                                                    variant="secondary" 
                                                    className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-medium rounded-md"
                                                >
                                                    {transaction.category?.name}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <div className="text-right">
                                            <div className={`font-bold text-base ${
                                                transaction.isIncome 
                                                    ? "text-emerald-600 dark:text-emerald-400" 
                                                    : "text-red-600 dark:text-red-400"
                                            }`}>
                                                {transaction.isIncome ? '+' : '-'}{Math.abs(transaction.amount).toLocaleString()} F
                                            </div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                {getTransactionDate(transaction.date)}
                                            </span>
                                        </div>
                                        {detailed && (
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerContent className="px-4 pb-8">
                        {selectedTransaction && (
                            <>
                                <DrawerHeader className="pt-6 pb-2 text-center space-y-0">
                                    
                                    <DrawerTitle className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        {selectedTransaction.description}
                                    </DrawerTitle>
                                    
                                    <DrawerDescription
                                        className={`text-3xl font-bold flex items-center justify-center ${
                                        selectedTransaction.isIncome
                                            ? "text-emerald-600 dark:text-emerald-400"
                                            : "text-red-600 dark:text-red-400"
                                        }`}
                                    >
                                        {selectedTransaction.isIncome ? '+' : '-'}
                                        {Math.abs(selectedTransaction.amount).toLocaleString()}
                                        <span className="text-xl text-gray-500 dark:text-gray-400 ml-1.5">FCFA</span>
                                    </DrawerDescription>
                                </DrawerHeader>

                                <div className="px-6 py-6 space-y-4">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-900">
                                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center shrink-0">
                                            <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Date</div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {format(selectedTransaction.date, "EEEE d MMMM yyyy", { locale: fr })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-900">
                                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center shrink-0">
                                            <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Compte</div>
                                            <div className="font-medium text-gray-900 dark:text-white truncate">
                                                {selectedTransaction.account?.name}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-900">
                                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center shrink-0">
                                            <Tag className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Catégorie</div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {selectedTransaction.category?.name}
                                                </span>
                                                <Badge 
                                                    variant="secondary" 
                                                    className={
                                                        selectedTransaction.isIncome
                                                            ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                                                            : 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                                                    }
                                                >
                                                    {selectedTransaction.isIncome ? "Revenu" : "Dépense"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <DrawerFooter className="px-6 pb-8 pt-2 gap-3">
                                    <Button
                                        size="lg"
                                        className="w-full"
                                        onClick={() => {
                                            navigate(`/transactions/${selectedTransaction.id}/edit`, {
                                                state: { from: location.pathname }
                                            });
                                            setOpen(false);
                                        }}
                                    >
                                        <Edit3 className="w-4 h-4 mr-2" />
                                        Modifier la transaction
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                size="lg"
                                                className="w-full"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Supprimer
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Cette action est irréversible et supprimera la transaction.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                <AlertDialogAction onClick={async () => {
                                                        try {
                                                            await db.transactions.delete(selectedTransaction.id);
                                                            toast.success("Transaction supprimée avec succès");
                                                            setOpen(false);
                                                        } catch (error) {
                                                            toast.error("Erreur lors de la suppression");
                                                            console.error(error);
                                                        }
                                                }}>
                                                    Supprimer
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    
                                    <DrawerClose asChild>
                                        <Button variant="outline" size="lg" className="w-full">
                                            Fermer
                                        </Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </>
                        )}
                    </DrawerContent>
                </Drawer>
            </>
            
        )
    } else if (variant === "desktop") {
        return (
            <ul className="px-1">
                {displayedTransactions.map((transaction) => 
                    !detailed ? (
                        <li key={transaction.id} className="flex gap-12 items-center py-2">
                            <div className="flex flex-col">
                                <span className="font-semibold">{ transaction.description }</span>
                                <span className="text-sm text-gray-500 font-medium">
                                    { detailed 
                                        ? format(transaction.date, "dd MMMM yyyy", { locale: fr }) 
                                        : getRelativeDate(transaction.date) 
                                    }
                                </span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`font-semibold ${transaction.isIncome ? "text-green-400" : "text-red-400" } `}>
                                    {transaction.isIncome ? '+' : '-'}{transaction.amount}
                                </span>
                                <span className="text-sm font-medium text-gray-500">
                                    {transaction.category?.name}
                                </span>
                            </div>
                        </li>
                    ) : (
                        <h1 key={transaction.id}>Ha</h1>
                    ))}
            </ul>
        )
    }
}