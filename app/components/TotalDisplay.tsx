"use client";

import { useEffect, useEffectEvent, useState } from "react";

interface Props {
  subtotal: number;
  total: number;
  discount: number;
  discountType: "percentage" | "fixed";
}

export default function TotalDisplay({
  subtotal,
  total,
  discount,
  discountType,
}: Props) {
  const [isClient, setIsClient] = useState(false);

  const updateIsClient = useEffectEvent((isClient: boolean) => {
    setIsClient(isClient);
  });

  useEffect(() => {
    updateIsClient(true);
  }, []);

  return (
    isClient && (
      <div className="mt-4">
        <h2>Subtotal: Rs. {subtotal}</h2>
        <h2>
          Discount: {discount} {discountType === "percentage" ? "%" : "Rs"}
        </h2>
        <h2 className="text-2xl font-bold">Total: Rs. {total}</h2>
      </div>
    )
  );
}
