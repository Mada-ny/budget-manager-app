import { compareDesc } from "date-fns";
import { useAccounts, useTransactions, useCategories } from ".";

export function useEnrichedTransactions({ limit } = {}) {
    const transactions = useTransactions();
    const categories = useCategories();
    const accounts = useAccounts();

    const categoryMap = Object.fromEntries(
        categories.map((cat) => [cat.id, cat])
    );

    const accountMap = Object.fromEntries(
        accounts.map((acc) => [acc.id, acc])
    );

    return transactions.map((t) => ({
        ...t,
        date: new Date(t.date),
    }))
    .toSorted((a, b) => compareDesc(a.date, b.date))
    .slice(0, limit)
    .map((t) => {
        const category = categoryMap[t.categoryId];
        const account = accountMap[t.accountId]

        return {
            ...t,
            category,
            account,
            isIncome: category?.type === 'income',
        };
    });
}