import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../schema";

export function useTransaction(id) {
    return useLiveQuery(
        () => {
            if (!id) return null;

            return db.transactions.get(id);
        },
        [id]
    );
}