import { useParams, useNavigate, useLocation } from "react-router-dom"
import TransactionForm from "@/components/transactions/TransactionForm"

export default function EditTransactionPage() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const from = location.state?.from || "/transactions";

    return (
        <TransactionForm 
            mode="edit"
            transactionId={id}
            onSuccess={() => navigate(from)}
        />
    )
}