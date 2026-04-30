"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getUser } from "@/app/services/authService";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await getUser(username, password);
      router.push("/office/stock/stockList");
    } catch (err) {
      alert("Invalid login credentials");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center  bg-red-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80">
        <Image
          src="/weehenaLogo.png"
          alt="Weehena Farm Shop Logo"
          width={100}
          height={100}
          className="mx-auto mb-2 size-16 bg-white rounded-full"
        />

        <h1 className="text-xl text-center text-red-700 font-semibold mb-4">
          Weehena Farm Shop
        </h1>

        <form
          action={handleLogin}
          className="flex flex-col px-4 my-4 gap-2 text-xs"
        >
          <label
            htmlFor="username"
            className="font-medium text-sm text-gray-800"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Enter username"
            className="border-0 bg-gray-200 rounded  text-sm text-gray-800 w-full mb-2 p-2"
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="true"

          />

          <label
            htmlFor="password"
            className="font-medium text-sm text-gray-800"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter password"
            className="border-0 bg-gray-200 rounded text-sm text-gray-800 w-full mb-4 p-2"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="mx-auto text-sm w-full flex flex-col gap-1">
            <button
              type="submit"
              className="bg-red-700 hover:bg-red-600 rounded-lg font-semibold text-white w-full py-2"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="hover:text-red-700 hover:bg-red-50 text-red-600 font-semibold w-full py-2 mt-2 rounded-lg"
            >
              back to home
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
