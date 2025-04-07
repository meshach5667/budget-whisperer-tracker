
import React, { createContext, useContext, useReducer } from "react";
import { toast } from "sonner";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

interface TransactionState {
  transactions: Transaction[];
}

type TransactionAction = 
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "EDIT_TRANSACTION"; payload: Transaction }
  | { type: "DELETE_TRANSACTION"; payload: string };

const initialState: TransactionState = {
  transactions: [
    {
      id: "1",
      description: "Salary",
      amount: 5000,
      type: "income",
      category: "Salary",
      date: "2023-04-05"
    },
    {
      id: "2",
      description: "Rent",
      amount: 1200,
      type: "expense",
      category: "Housing",
      date: "2023-04-03"
    },
    {
      id: "3",
      description: "Groceries",
      amount: 150,
      type: "expense",
      category: "Food",
      date: "2023-04-04"
    },
    {
      id: "4",
      description: "Freelance Work",
      amount: 1000,
      type: "income",
      category: "Freelance",
      date: "2023-04-02"
    }
  ]
};

const transactionReducer = (state: TransactionState, action: TransactionAction): TransactionState => {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [...state.transactions, action.payload]
      };
    case "EDIT_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map(transaction => 
          transaction.id === action.payload.id ? action.payload : transaction
        )
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction.id !== action.payload)
      };
    default:
      return state;
  }
};

interface TransactionContextProps {
  state: TransactionState;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  editTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
}

const TransactionContext = createContext<TransactionContextProps | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString()
    };
    dispatch({ type: "ADD_TRANSACTION", payload: newTransaction });
    toast.success("Transaction added successfully");
  };

  const editTransaction = (transaction: Transaction) => {
    dispatch({ type: "EDIT_TRANSACTION", payload: transaction });
    toast.success("Transaction updated successfully");
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: "DELETE_TRANSACTION", payload: id });
    toast.success("Transaction deleted successfully");
  };

  return (
    <TransactionContext.Provider
      value={{
        state,
        addTransaction,
        editTransaction,
        deleteTransaction
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
};
