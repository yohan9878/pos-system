"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface Props {
  children: ReactNode;
}

export default function OfficeLayout({ children }: Props) {
  const pathname = usePathname();

  const navItems = [
    { name: "Products", path: "/products" },
    { name: "Stock", path: "/stock" },
    { name: "Reports", path: "/reports" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white drop-shadow-gray-400  drop-shadow-xl/50">
        <h1 className="text-xl text-center mb-4 bg-red-800 text-white p-3  mx-auto">
          Office Dashboard
        </h1>

        <nav className="flex flex-col gap-0 mt-4">
          {navItems.map((item) => {
            const isActive = pathname.includes(item.path);

            return (
              <Link
                key={item.name}
                href={`/office${item.path}`}
                className={`px-5 py-2 w-54 ml-4 rounded-md text-smd text-left text-red-900 transition ${
                  isActive
                    ? "bg-red-200 text-red-600 font-semibold"
                    : "hover:bg-gray-100 hover:text-red-900 font-semibold"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-red-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-2xl">{children}</div>
      </main>
    </div>
  );
}
