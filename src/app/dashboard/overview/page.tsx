"use client"
import { useState } from "react";

import Pagination from "@/components/DesignSystem/Pagination";

export default function Home() {
  const [page, setPage] = useState(1)

  const pageHandler = (page:number) => {
    console.log(page)
    setPage(page)
  }

  return (
    <Pagination
  totalPages={20}
  currentPage={page}
  onPageChange={(page) => pageHandler(page)}
/>

);
}
