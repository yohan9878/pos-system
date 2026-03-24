"use client";

import { CartItem } from "../types";

interface Props {
  cart: CartItem[];
}

export default function CartTable({ cart }: Props) {
  return (
    <table className="w-full mt-5 border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="border border-gray-300 p-2">Name</th>
          <th className="border border-gray-300 p-2">Qty</th>
          <th className="border border-gray-300 p-2">Price</th>
          <th className="border border-gray-300 p-2">Total</th>
        </tr>
      </thead>
      <tbody>
        {cart.map((item, idx) => (
          <tr key={idx} className="even:bg-gray-50">
            <td className="border border-gray-300 p-2">{item.name}</td>
            <td className="border border-gray-300 p-2 text-center">
              {item.qty}
            </td>
            <td className="border border-gray-300 p-2 text-right">
              {item.price}
            </td>
            <td className="border border-gray-300 p-2 text-right">
              {item.price * item.qty}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
