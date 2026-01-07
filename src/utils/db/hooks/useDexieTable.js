import { useLiveQuery } from "dexie-react-hooks";

export function useDexieTable(table) {
    return useLiveQuery(
        async () => await table.toArray(), 
        []
    ) || [];
}