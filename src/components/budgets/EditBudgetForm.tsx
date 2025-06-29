"use client";

import { useState, useEffect } from "react";
import Select from "../DesignSystem/Select";
import Input from "../DesignSystem/Input";
import Button from "../DesignSystem/Button";
import { getCategoryOptions, getThemeOptions } from "@/utils/budgets/getEditFormOptions";
import { db, auth } from "@/lib/firebase";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";

type Budget = {
  id: string;
  category: string;
  theme: string;
  maximum: number;
};

type FormProps = {
  onSubmit: () => void;
  targetBudget: string;
  budgets: Budget[];
  spentAmount: number;
};

export default function EditBudgetForm({ onSubmit, targetBudget, budgets, spentAmount }: FormProps) {
  const targetedBudgetObj = budgets.find((b) => b.category === targetBudget);
  const [selectedCategory, setSelectedCategory] = useState(targetedBudgetObj?.category || "");
  const [theme, setTheme] = useState(targetedBudgetObj?.theme || "");
  const [maximum, setMaximum] = useState(targetedBudgetObj?.maximum?.toString() || "");
  const [error, setError] = useState("")
  const [maxInputState, setMaxInputState] = useState('initial')

  const categoryOptions = getCategoryOptions(budgets);
  const themeOptions = getThemeOptions(budgets);

  const selectCategory = (value: string) => setSelectedCategory(value);
  const inputHandler = (value: string) => {
    setMaximum(value);
    if (Number(value) >= spentAmount) {
      setMaxInputState('initial')
      setError("");
    }
  };
  const selectTheme = (value: string) => setTheme(value);

  const saveChanges = async () => {
    if (isNaN(Number(maximum)) || maximum.trim() === "") {
      setError("Maximum limit must be a valid number");
      setMaxInputState("error");
      return;
    }
    if (Number(maximum) < spentAmount) {
      setError(`Maximum limit cannot be less than already spent: $${spentAmount}`);
      setMaxInputState('error')
      return;
    }
    const user = auth.currentUser;
    if (!user) return;

    try {
      const colRef = collection(db, "users", user.uid, "budgets");
      const q = query(colRef, where("category", "==", targetBudget));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const docRef = snapshot.docs[0].ref;
        await updateDoc(docRef, {
          category: selectedCategory,
          theme,
          maximum: Number(maximum),
        });
      }

      onSubmit();
    } catch (err) {
      console.error("Failed to update budget:", err);
    }
  };

  return (
    <>
      <p className="text-preset-4 text-grey-500">
        As your budgets change, feel free to update your spending limits.
      </p>
      <Select
        label="Budget Category"
        selectedValue={selectedCategory}
        options={categoryOptions}
        onChange={selectCategory}
        fullWidth
      />
      <Input
        label="Maximum Spend"
        placeholder="e.g. 2000"
        fullWidth
        value={maximum}
        onChange={inputHandler}
        errorMessage={error}
        state={maxInputState}
      />
      <Select
        label="Theme"
        options={themeOptions}
        onChange={selectTheme}
        fullWidth
      />
      <Button label="Save Changes" onButtonClick={saveChanges} />
    </>
  );
}
