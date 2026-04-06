"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { timeStyle: "medium" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center">
      <div className="flex flex-col mx-aut items-center gap-2">
        <Image
          src="/weehenaLogo.png"
          alt="Weehena Farm Shop Logo"
          width={150}
          height={150}
          className="size-18"
        />
        <h1 className="text-2xl text-black font-bold">Weehena Farm Shop</h1>
        <p className="text-md text-gray-800 font-sans font-normal">
          {new Date().toLocaleDateString("en-US", { dateStyle: "full" })}
        </p>
        <p className="text-md text-gray-800 font-sans font-normal">{time}</p>
      </div>

      <div className="flex flex-col gap-4 mt-6">
        <Link
          href="/outlet/katunayake/scan"
          className="w-56 text-center shadow drop-shadow-xl shadow-gray-500 bg-red-700 text-sm hover:bg-red-600 font-medium text-white px-6 py-3 rounded-xl"
        >
          Go to POS (Katunayake)
        </Link>
        <Link
          href="/office/products"
          className="w-56 text-center shadow drop-shadow-lg shadow-gray-600 bg-red-700 text-sm hover:bg-red-600 font-medium text-white px-6 py-3 rounded-xl"
        >
          Office Dashboard
        </Link>
      </div>
    </div>
  );
}
