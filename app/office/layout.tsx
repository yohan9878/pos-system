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
      <aside className="w-64 bg-white  shadow-2xl">
        <h1 className="text-xl text-center text-red-950  p-2 font-semibold  mx-auto">
          Office Dashboard
        </h1>

        <nav className="flex flex-col gap-0">
          {navItems.map((item) => {
            const isActive = pathname.includes(item.path);

            return (
              <Link
                key={item.name}
                href={`/office${item.path}`}
                className={`p-2 text-center text-red-900 transition ${
                  isActive
                    ? "bg-red-900 text-white font-semibold"
                    : "hover:bg-gray-200 hover:text-red-900 font-semibold"
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
        <div className="bg-white p-6 rounded-lg shadow-2xl">
          {children}
        </div>
      </main>
    </div>
  );
}