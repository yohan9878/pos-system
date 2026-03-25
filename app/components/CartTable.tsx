"use client";

import { CartItem } from "../types";

interface Props {
  cart: CartItem[];
  onDelete: (barcode: string) => void;
}

export default function CartTable({ cart, onDelete }: Props) {
 
  return (
    <table className="w-full mt-5 border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="border border-gray-300 p-2">Barcode</th>
          <th className="border border-gray-300 p-2">Name</th>
          <th className="border border-gray-300 p-2">Qty</th>
          <th className="border border-gray-300 p-2">Price</th>
          <th className="border border-gray-300 p-2">Total</th>
          <th className="border border-gray-300 p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {cart.map((item, idx) => (
          <tr key={idx}>
            <td className="border border-gray-300 p-2">{item.barcode}</td>
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
            <td className="border p-2 text-center">
              <button
                onClick={() => onDelete(item.barcode)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
