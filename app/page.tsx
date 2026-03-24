"use client";

import { useState, useContext, useEffect } from "react";
import { CartContext } from "./context/CartContext";
import BarcodeInput from "./components/BarcodeInput";
import CartTable from "./components/CartTable";
import TotalDisplay from "./components/TotalDisplay";
import Button from "./components/Button";
import { fetchProduct } from "./services/productService";
import { CartItem } from "./types";

export default function Home() {
  const [barcode, setBarcode] = useState<string>("");
  const { cart, setCart } = useContext(CartContext)!;

  useEffect(() => {
  setCart([
    { barcode: "1001", name: "Chicken 1kg", price: 1200, qty: 2 },
    { barcode: "1002", name: "Sausage Pack", price: 800, qty: 3 },
  ]);
}, []);

  const handleAdd = () => {
    const product = fetchProduct(barcode);
    if (!product) return alert("Product not found");

    const existing = cart.find((item) => item.barcode === barcode);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.barcode === barcode ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 } as CartItem]);
    }

    setBarcode("");
  };

  const handlePay = () => {
    alert("Payment Done");
    setCart([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-5">POS System - Next.js + Tailwind + TS</h1>

      <BarcodeInput barcode={barcode} setBarcode={setBarcode} handleAdd={handleAdd} />

      <CartTable cart={cart} />

      <TotalDisplay cart={cart} />

      <div className="mt-4">
        <Button onClick={handlePay}>Pay</Button>
        <Button onClick={() => setCart([])} className="bg-red-500 hover:bg-red-600">Clear</Button>
      </div>
    </div>
  );
}