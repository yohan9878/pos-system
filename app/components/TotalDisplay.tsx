"use client";
import { CartItem } from "../types";

interface Props {
  cart: CartItem[];
}

export default function TotalDisplay({ cart }: Props) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  return <h2 className="text-2xl font-bold mt-4">Total: Rs. {total}</h2>;
}