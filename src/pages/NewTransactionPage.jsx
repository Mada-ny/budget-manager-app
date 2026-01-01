import { useNavigate } from "react-router-dom"
import TransactionForm from "@/components/transactions/TransactionForm"

export default function NewTransactionPage() {
    const navigate = useNavigate();

    return (
        <TransactionForm
            mode="create"
            onSuccess={() => navigate(-1)}
        />
    )
}