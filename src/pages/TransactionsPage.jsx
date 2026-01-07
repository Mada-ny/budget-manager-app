import TransactionList from "@/components/transactions/TransactionList"
import { FAB } from "@/components/ui/FAB"

export default function TransactionsPage() {
    return (
        <>
            <h1>Transactions</h1>
            <TransactionList variant={"mobile"} detailed />
            <FAB />
        </>
    )
}