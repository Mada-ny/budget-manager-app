import { useLiveQuery } from "dexie-react-hooks";

export function useEntity(table, id) {
    return useLiveQuery(
        async () => {
            if (id == null) return undefined;
            const entity = await table.get(id);
            return entity ?? null;
        },
        [id]
    );
}
