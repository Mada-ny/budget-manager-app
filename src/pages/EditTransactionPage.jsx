import { useParams, useNavigate } from "react-router-dom"
import TransactionForm from "@/components/transactions/TransactionForm"

export default function EditTransactionPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <TransactionForm 
            mode="edit"
            transactionId={id}
            onSuccess={() => navigate(-1)}
        />
    )
}