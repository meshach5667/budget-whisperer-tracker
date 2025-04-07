
import { useState } from "react";
import { useForm } from "react-hook-form";
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Transaction } from "@/context/TransactionContext";

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Transaction, "id">) => void;
  defaultValues?: Transaction;
  mode: "add" | "edit";
}

type FormData = Omit<Transaction, "id">;

const expenseCategories = [
  "Food", "Housing", "Transportation", "Entertainment", "Utilities", "Healthcare", "Personal", "Education", "Debt", "Other"
];

const incomeCategories = [
  "Salary", "Freelance", "Investments", "Gift", "Other"
];

export function TransactionForm({ 
  open, 
  onOpenChange, 
  onSubmit, 
  defaultValues, 
  mode 
}: TransactionFormProps) {
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    defaultValues?.type || "expense"
  );
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    defaultValues: defaultValues || {
      description: "",
      amount: 0,
      type: "expense",
      category: "",
      date: new Date().toISOString().split("T")[0]
    }
  });

  const handleFormSubmit = (data: FormData) => {
    onSubmit({
      ...data,
      amount: Number(data.amount)
    });
    onOpenChange(false);
    reset();
  };

  const handleTypeChange = (value: "income" | "expense") => {
    setTransactionType(value);
    setValue("type", value);
    setValue("category", "");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Transaction" : "Edit Transaction"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transactionType">Type</Label>
              <Select
                defaultValue={defaultValues?.type || "expense"}
                onValueChange={(value) => handleTypeChange(value as "income" | "expense")}
              >
                <SelectTrigger id="transactionType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" {...register("type")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                defaultValue={defaultValues?.category}
                onValueChange={(value) => setValue("category", value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {(transactionType === "expense" ? expenseCategories : incomeCategories).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register("category", { required: "Category is required" })} />
              {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                {...register("amount", { 
                  required: "Amount is required",
                  min: {
                    value: 0.01,
                    message: "Amount must be greater than 0"
                  }
                })}
              />
              {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...register("date", { required: "Date is required" })}
              />
              {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{mode === "add" ? "Add" : "Update"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
