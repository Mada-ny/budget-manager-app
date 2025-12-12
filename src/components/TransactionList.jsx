import { useTransactions, useAccounts, useCategories } from "@/utils/db/hooks";
import { compareDesc } from "date-fns";
import { getRelativeDate } from "@/utils/date/getRelativeDate";

export default function TransactionList() {
    const transactions = useTransactions().map(t => ({
        ...t,
        date: new Date(t.date)
    }));
    const accounts = useAccounts();
    const categories = useCategories();

    const accountMap = Object.fromEntries(accounts.map((acc) => [acc.id, acc]));
    const categoryMap = Object.fromEntries(categories.map((cat) => [cat.id, cat]));
    

    return (
        <ul>
            {transactions.sort((a, b) => compareDesc(a.date, b.date)).map((transaction) => (
                <li key={transaction.id} className="flex justify-around">
                    <div className="flex flex-col">
                        <p>{ transaction.description }</p>
                        <p>{ getRelativeDate(transaction.date) }</p>
                    </div>
                    <div className="flex flex-col">
                        <p>{ transaction.amount }</p>
                        <p>{ categoryMap[transaction.categoryId]?.name }</p>
                    </div>
                    
                    <p>{ accountMap[transaction.accountId]?.name }</p>
                </li>
            ))}
        </ul>
    )
}