"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { CartItem } from "../types";

interface Props {
  cart: CartItem[];
}

export default function TotalDisplay({ cart }: Props) {
  const [isClient, setIsClient] = useState(false);

 const updateIsClient = useEffectEvent((isClient: boolean ) => {
     setIsClient(isClient);
    });
 
   useEffect(() => {
     updateIsClient(true)
   }, [])

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2);
  return (isClient &&
    <div>
      <h2 className="text-2xl font-bold mt-4"> Sub Total: Rs. {total}</h2>
    </div>
  );
}
