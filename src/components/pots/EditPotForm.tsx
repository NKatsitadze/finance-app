"use client"
import { useEffect, useState } from "react";
import Select from "../DesignSystem/Select";
import Input from "../DesignSystem/Input";
import Button from "../DesignSystem/Button";
import { getThemeOptions } from "@/utils/budgets/getAddFormOptions";
import { useDashboardData } from "@/contexts/DashboardContext";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";

type FormProps = {
  onSubmit: () => void;
  targetPot: string;
};

export default function EditPotForm({ onSubmit, targetPot }: FormProps) {
  const { pots, refetchData } = useDashboardData();
  const potObj = pots.find((p) => p.name === targetPot);

  const [potName, setPotName] = useState(potObj?.name ?? "");
  const [target, setTarget] = useState(potObj?.target?.toString() ?? "");
  const [theme, setTheme] = useState(potObj?.theme ?? "#277C78");

  const themeOptions = getThemeOptions(pots); // updated from real pots

  useEffect(() => {
    // In case props or context updates
    setPotName(potObj?.name ?? "");
    setTarget(potObj?.target?.toString() ?? "");
    setTheme(potObj?.theme ?? "#277C78");
  }, [potObj]);

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user || !potObj) return;

    try {
      const potsRef = collection(db, "users", user.uid, "pots");
      const q = query(potsRef, where("name", "==", targetPot));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.warn("Pot not found for editing.");
        return;
      }

      const potDocRef = snapshot.docs[0].ref;

      await updateDoc(potDocRef, {
        name: potName,
        target: Number(target),
        theme,
      });

      await refetchData(); // refresh UI
      onSubmit();
    } catch (err) {
      console.error("Failed to update pot:", err);
    }
  };

  return (
    <>
      <p className="text-preset-4 text-grey-500">
        Choose a name, savings target, and theme for your pot.
      </p>

      <Input
        label="Pot Name"
        value={potName}
        placeholder="e.g. Travel Fund"
        fullWidth
        onChange={(val) => setPotName(val)}
      />

      <Input
        label="Target"
        value={target}
        placeholder="e.g. 2000"
        fullWidth
        onChange={(val) => setTarget(val)}
      />

      <Select
        label="Theme"
        selectedValue={theme}
        fullWidth
        options={themeOptions}
        onChange={setTheme}
      />

      <Button label="Save Changes" onButtonClick={handleSubmit} />
    </>
  );
}
