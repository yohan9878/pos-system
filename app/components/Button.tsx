"use client";
import { ReactNode } from "react";

interface Props {
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

export default function Button({ onClick, children, className }: Props) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 mr-3 bg-blue-700 text-white rounded hover:bg-blue-600 transition ${className}`}
    >
      {children}
    </button>
  );
}