"use client";

import { useState } from "react";
import Select from "../DesignSystem/Select";
import Input from "../DesignSystem/Input";
import Button from "../DesignSystem/Button";
import { getCategoryOptions, getThemeOptions } from "@/utils/budgets/getAddFormOptions";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

type Budget = {
  category: string;
  theme: string;
  maximum: number;
};

type FormProps = {
  onSubmit: () => void;
  budgets: Budget[];
};

export default function AddBudgetForm({ onSubmit, budgets }: FormProps) {
  const [category, setSelectedCategory] = useState("General");
  const [maximum, setMaximum] = useState("");
  const [theme, setTheme] = useState("#277C78");

  const categoryOptions = getCategoryOptions(budgets);
  const themeOptions = getThemeOptions(budgets);

  const selectCategory = (value: string) => setSelectedCategory(value);
  const inputHandler = (value: string) => setMaximum(value);
  const selectTheme = (value: string) => setTheme(value);

  const addBudget = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await addDoc(collection(db, "users", user.uid, "budgets"), {
        category,
        theme,
        maximum: Number(maximum),
      });

      onSubmit();
    } catch (error) {
      console.error("Failed to add budget:", error);
    }
  };

  return (
    <>
      <p className="text-preset-4 text-grey-500">
        Choose a category to set a spending budget. These categories can help you monitor spending.
      </p>
      <Select label="Budget Category" options={categoryOptions} onChange={selectCategory} fullWidth />
      <Input label="Maximum Spend" placeholder="e.g. 2000" fullWidth onChange={inputHandler} />
      <Select label="Theme" fullWidth options={themeOptions} onChange={selectTheme} />
      <Button label="Add Budget" onButtonClick={addBudget} />
    </>
  );
}
