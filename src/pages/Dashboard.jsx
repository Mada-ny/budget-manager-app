import TransactionList from "@/components/transactions/TransactionList"
import TransactionForm from "@/components/transactions/TransactionForm"

export default function Dashboard() {

    return (
        <>
            <h1>Hello</h1>
            <TransactionList variant={"mobile"} />
            <TransactionForm />
        </>
    )
}