"use client";

import { useEffect, useRef, ReactNode } from "react";
import IconCloseModal from "../IconComponents/IconCloseModal";
import { useState } from "react";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ title, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mouseOver, setMouseOver] = useState(false)

  // Handle outside click and Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-xl p-8 w-full max-w-[560px] flex flex-col gap-5"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-preset-1 bold text-grey-900">{title}</h2>
          <button onMouseEnter={() => setMouseOver(true)} onMouseLeave={() => setMouseOver(false)} onClick={onClose} className="text-gray-500 pointer hover:text-gray-800 text-xl">
            <IconCloseModal color={mouseOver ? 'var(--grey-500)' : undefined}/>
          </button>
        </div>

        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
}
