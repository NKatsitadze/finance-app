"use client";

import { useState, useRef, useEffect } from "react";
import IconEllipsis from "../IconComponents/IconEllipsis";

type DropdownOption = {
  key: string;
  label: string;
  onClick: () => void;
  color?: string; // optional custom color class (e.g. "text-red-500")
};

type DropdownProps = {
  options: DropdownOption[];
};

export function Dropdown({ options }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };

  return (
    <div className="relative flex items-center justify-center" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="py-3 px-2 pointer"
      >
        <IconEllipsis />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[100%] mt-4 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-10 p-2 text-sm">
          {options.map(({ key, label, onClick, color }) => (
            <button
              key={key}
              onClick={() => handleOptionClick(onClick)}
              className={`w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-preset-4 pointer`}
              style={{ color: color ?? 'text-grey-900' }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
