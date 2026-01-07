import { db } from "../schema";
import { useDexieTable } from "./useDexieTable";
import { useEntity } from "./useEntity";

// List data hooks
export const useAccounts = () => useDexieTable(db.accounts);
export const useCategories = () => useDexieTable(db.categories);
export const useTransactions = () => useDexieTable(db.transactions);

// Single data hooks
export const useAccount = (id) => useEntity(db.accounts, id);
export const useCategory = (id) => useEntity(db.categories, id);
export const useTransaction = (id) => useEntity(db.transactions, id);