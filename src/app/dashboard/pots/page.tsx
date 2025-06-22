"use client";

import Header from "@/components/Header";
import dataJson from "@/data.json";
import PotCard from "@/components/pots/PotCard";

export default function Pots() {
  return (
    <>
      <Header title="Pots" buttonLabel="+ Add New Pot" />

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {dataJson.pots.map((pot, index) => (
          <PotCard
            key={index}
            name={pot.name}
            total={pot.total}
            target={pot.target}
            theme={pot.theme}
          />
        ))}
      </section>
    </>
  );
}
