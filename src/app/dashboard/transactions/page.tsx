"use client"

import Header from "@/components/Header";
import Pagination from "@/components/DesignSystem/Pagination";

export default function Home() {
  const pageChangeHandler = () => {
    console.log('ait')
  }

  return (
    <>
      <Header title="Transactions"/>
      <article className="bg-white w-full h-full rounded-xl">

        <Pagination totalPages={20} currentPage={1} onPageChange={pageChangeHandler}/>
      </article>
    </>
  );
}
