import { Dexie } from 'dexie';

export const db = new Dexie('BudgetManagerDB');

db.version(1).stores({
    accounts: "++id, &name, initialBalance",
    categories: "++id, &name",
    transactions: "++id, date, accountId, categoryId, amount, description, [accountId+date], [date+categoryId], [accountId+categoryId]"
})

db.on("populate", function(transaction) {
    transaction.categories.bulkAdd([
        { name: "Alimentation" },
        { name: "Transport" },
        { name: "Logement" },
        { name: "Loisirs" },
        { name: "Revenus" },
        { name: "Abonnements" },
        { name: "Santé" },
        { name: "Éducation" }
    ]);

    transaction.accounts.bulkAdd([
        { name: "Espèces", initialBalance: 0 },
        { name: "Carte Bancaire", initialBalance: 0 },
        { name: "Wave", initialBalance: 0 },
        { name: "Mobile Money", initialBalance: 0 }
    ])
});

db.open();