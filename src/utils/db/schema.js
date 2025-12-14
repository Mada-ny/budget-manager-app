import { Dexie } from 'dexie';

export const db = new Dexie('BudgetManagerDB');

db.version(1).stores({
    accounts: "++id, &name, initialBalance",
    categories: "++id, &name, type",
    transactions: "++id, date, accountId, categoryId, amount, description, [accountId+date], [date+categoryId], [accountId+categoryId]"
})

db.on("populate", function(transaction) {
    transaction.categories.bulkAdd([
        { name: "Alimentation", type: "expense" },
        { name: "Transport", type: "expense"  },
        { name: "Logement", type: "expense" },
        { name: "Loisirs", type: "expense" },
        { name: "Salaire", type: "income" },
        { name: "Abonnements", type: "expense" },
        { name: "Santé", type: "expense" },
        { name: "Éducation", type: "expense" }
    ]);

    transaction.accounts.bulkAdd([
        { name: "Espèces", initialBalance: 0 },
        { name: "Carte Bancaire", initialBalance: 0 },
        { name: "Wave", initialBalance: 0 },
        { name: "Mobile Money", initialBalance: 0 }
    ])
});

db.open();