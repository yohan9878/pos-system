"use client";

import { useEffect, useEffectEvent, useState } from "react";

interface Item {
  name: string;
  qty: number;
  price: number;
}

interface Props {
  items: Item[];
  invoiceNo: string;
}

export default function Receipt({ items, invoiceNo }: Props) {
  const total = items.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  const [isClient, setIsClient] = useState(false);
  
  // hydration fix: only render on client side
  const updateIsClient = useEffectEvent((isClient: boolean) => {
    setIsClient(isClient);
  });
  
  useEffect(() => {
    updateIsClient(true);
  }, []);
  

  const date = new Date().toLocaleString();

  return (isClient &&
    <div id="invoice" className="receipt mx-auto bg-white w-100 max-w-sm text-black text-[12px] font-mono p-2 border rounded shadow">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-bold text-sm">Weehena Farm Shop</h1>
        <p>Katunayake, Sri Lanka</p>
        <p>Tel: 077-1234567</p>
      </div>

      <div className="border-t border-dashed my-2" />

      {/* Invoice Info */}
      <div>
        <p>Invoice: {invoiceNo}</p>
        <p>Date: {date}</p>
      </div>

      <div className="border-t border-dashed my-2" />

      {/* Items */}
      <div>
        {items.map((item, i) => (
          <div key={i} className="flex justify-between">
            <span>
              {item.name} x{item.qty}
            </span>
            <span>{(item.qty * item.price).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed my-2" />

      {/* Total */}
      <div className="flex justify-between font-bold">
        <span>TOTAL</span>
        <span>LKR {total.toFixed(2)}</span>
      </div>

      <div className="border-t border-dashed my-2" />

      {/* Footer */}
      <div className="text-center">
        <p>Thank You!</p>
        <p>Come Again 🙏</p>
      </div>
    </div>
  );
}