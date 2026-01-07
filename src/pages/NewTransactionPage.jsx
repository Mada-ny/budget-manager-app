import { useNavigate, useLocation } from "react-router-dom"
import TransactionForm from "@/components/transactions/TransactionForm"

export default function NewTransactionPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from || "/transactions";

    return (
        <TransactionForm
            mode="create"
            onSuccess={() => navigate(from)}
        />
    )
}