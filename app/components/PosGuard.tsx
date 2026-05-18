"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "../services/userService";

export default function PosGuard({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const user = getUserFromToken();

    if (!user ||(user.role !== "ADMIN" && user.role !== "STAFF" && user.role !== "CASHIER")
    ) {
      router.push("/auth/login");
    }
  }, [router]);

  return <>{children}</>;
}
