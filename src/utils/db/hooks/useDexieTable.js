import { useLiveQuery } from "dexie-react-hooks";

export function useDexieTable(table) {
    return useLiveQuery(() => table.toArray(), []) ?? [];
}