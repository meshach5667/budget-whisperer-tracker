
import { Dashboard } from "@/components/Dashboard";
import { TransactionProvider } from "@/context/TransactionContext";

const Index = () => {
  return (
    <TransactionProvider>
      <Dashboard />
    </TransactionProvider>
  );
};

export default Index;
