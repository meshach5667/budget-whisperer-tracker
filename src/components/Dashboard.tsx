
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SummaryCard } from "./SummaryCard";
import { TransactionList } from "./TransactionList";
import { TransactionForm } from "./TransactionForm";
import { ExpenseChart } from "./ExpenseChart";
import { IncomeChart } from "./IncomeChart";
import { useTransactions, Transaction } from "@/context/TransactionContext";
import { calculateBalance, calculateIncome, calculateExpense, formatCurrency } from "@/utils/calculations";
import { ArrowDown, ArrowUp, Plus, Wallet } from "lucide-react";

export function Dashboard() {
  const { state, addTransaction } = useTransactions();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const totalBalance = calculateBalance(state.transactions);
  const totalIncome = calculateIncome(state.transactions);
  const totalExpense = calculateExpense(state.transactions);

  const handleAddTransaction = (data: Omit<Transaction, "id">) => {
    addTransaction(data);
  };

  return (
    <div className="container py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Budget Tracker</h1>
          <p className="text-muted-foreground">Managge your finnance annd track your expnses.</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Transaction 
          
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      
        <SummaryCard
          title="Current Balance"
          amount={formatCurrency(totalBalance)}
          icon={<Wallet className="h-5 w-5 text-primary" />}
          className={totalBalance >= 0 ? "border-l-4 border-l-income" : "border-l-4 border-l-expense"}
        />
        <SummaryCard
          title="Total Income"
          amount={formatCurrency(totalIncome)}
          icon={<ArrowUp className="h-5 w-5 text-income" />}
          className="border-l-4 border-l-income"
        />
        <SummaryCard
          title="Total Expenses"
          amount={formatCurrency(totalExpense)}
          icon={<ArrowDown className="h-5 w-5 text-expense" />}
          className="border-l-4 border-l-expense"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ExpenseChart />
        <IncomeChart />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <TransactionList />
      </div>

      <TransactionForm
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddTransaction}
        mode="add"
      />
    </div>
  );
}
