import { db } from "../schema";
import { useDexieTable } from "./useDexieTable";

export const useAccounts = () => useDexieTable(db.accounts);
export const useCategories = () => useDexieTable(db.categories);
export const useTransactions = () => useDexieTable(db.transactions);