"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem("token");
      // const user = localStorage.getItem("user");

      if (!token) {
        router.push("/auth/login");
      } else {
        setLoading(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]); // The dependency array includes router to ensure the effect runs when the component mounts and when the router changes.

  if (loading) {
    return <p className="text-center mt-10">Checking authentication...</p>;
  }
  return children;
}
