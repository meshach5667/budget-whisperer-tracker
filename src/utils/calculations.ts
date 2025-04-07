
import { Transaction } from "../context/TransactionContext";

export const calculateBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((acc, transaction) => {
    if (transaction.type === "income") {
      return acc + transaction.amount;
    } else {
      return acc - transaction.amount;
    }
  }, 0);
};

export const calculateIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter(transaction => transaction.type === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);
};

export const calculateExpense = (transactions: Transaction[]): number => {
  return transactions
    .filter(transaction => transaction.type === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);
};

export const calculateCategoryTotals = (transactions: Transaction[], type: "income" | "expense") => {
  const filteredTransactions = transactions.filter(t => t.type === type);
  
  const categoryTotals = filteredTransactions.reduce((acc, transaction) => {
    const { category, amount } = transaction;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value
  }));
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};
