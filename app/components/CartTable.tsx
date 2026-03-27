"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { CartItem } from "../types";

interface Props {
  cart: CartItem[];
  onDelete: (barcode: string) => void;
}

export default function CartTable({ cart, onDelete }: Props) {
   const [isClient, setIsClient] = useState(false)

   const updateIsClient = useEffectEvent((isClient: boolean ) => {
    setIsClient(isClient);
   });

  useEffect(() => {
    updateIsClient(true)
  }, [])
 
  return ( isClient &&
    <table className=" w-full mt-5 border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="border border-gray-300 p-2 w-30">Barcode</th>
          <th className="border border-gray-300 p-2 w-100">Name</th>
          <th className="border border-gray-300 p-2">Qty</th>
          <th className="border border-gray-300 p-2 w-30">Price (Rs.)</th>
          <th className="border border-gray-300 p-2 w-30">Total (Rs.)</th>
          <th className="border border-gray-300 p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {cart.map((item, idx) => (
          <tr key={idx}>
            <td className="border border-gray-300 p-2 text-center">{item.barcode}</td>
            <td className="border border-gray-300 p-2">{item.name}</td>
            <td className="border border-gray-300 p-2 text-center">
              {item.qty}
            </td>
            <td className="border border-gray-300 p-2 text-right">
              {item.price.toFixed(2)}
            </td>
            <td className="border border-gray-300 p-2 text-right">
              {(item.price * item.qty).toFixed(2)}
            </td>
            <td className="border border-gray-300 p-2 text-center">
              <button
                onClick={() => onDelete(item.barcode)}
                className=" text-white px-3 py-1 rounded hover:bg-red-600"
              >
                ❌
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
 );
}
