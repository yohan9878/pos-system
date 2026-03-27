"use client";

import { useEffect, useEffectEvent, useState } from "react";

interface Item {
  name: string;
  qty: number;
  price: number;
}

interface Props {
  items: Item[];
}

export default function Invoice({ items }: Props) {

const [isClient, setIsClient] = useState(false);

// hydration fix: only render on client side
const updateIsClient = useEffectEvent((isClient: boolean) => {
  setIsClient(isClient);
});

useEffect(() => {
  updateIsClient(true);
}, []);

  const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  return ( isClient &&
    <div className="p-6 bg-white text-black w-100 mt-20 max-w-sm mx-auto border rounded shadow">
      <h1 className="text-xl font-bold text-center">Weehena Farm Shop</h1>
      <p className="text-center text-sm font-semibold">Customer Invoice</p>

      <hr className="my-3" />

      <div className="mt-4">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between ">
            <span>
              {item.name} x {item.qty} 
            </span>
            <span>{item.price * item.qty}</span>
          </div>
        ))}
      </div>

      <hr className="my-3" />

      <div className="flex justify-between font-bold">
        <span>Total</span>
        <span>{total}</span>
      </div>

      <p className="text-center font-semibold mt-4 text-xs">Thank you! Come again</p>
    </div>
  );
}
