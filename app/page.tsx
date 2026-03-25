"use client";

import { useState, useContext } from "react";
import { CartContext } from "./context/CartContext";
import BarcodeInput from "./components/BarcodeInput";
import CartTable from "./components/CartTable";
import TotalDisplay from "./components/TotalDisplay";
import Button from "./components/Button";
import { fetchProduct } from "./services/productService";
import { Product } from "./types";
import QuantityModal from "./components/QuantityModal";

export default function Home() {
  const [barcode, setBarcode] = useState<string>("");
  const { cart, setCart } = useContext(CartContext)!;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAdd = () => {
    const product = fetchProduct(barcode);
    if (!product) return alert("Product not found");

    // Open modal for ANY scan
    setSelectedProduct(product);
    setModalOpen(true);

    setBarcode("");
  };

  const handlePay = () => {
    alert("Payment Done");
    setCart([]);
  };

  const handleConfirmQty = (qty: number) => {
    if (!selectedProduct) return;

    const existing = cart.find(
      (item) => item.barcode === selectedProduct.barcode,
    );

    if (existing) {
      // Add to existing quantity
      setCart(
        cart.map((item) =>
          item.barcode === selectedProduct.barcode
            ? { ...item, qty: item.qty + qty }
            : item,
        ),
      );
    } else {
      // Add new item with entered qty
      setCart([...cart, { ...selectedProduct, qty }]);
    }
  };

  const handleDelete = (barcode: string) => {
  setCart(cart.filter((item) => item.barcode !== barcode));
};

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl text-center font-sans font-bold mb-5">
        Weehena farm Shop
      </h1>

      <BarcodeInput
        barcode={barcode}
        setBarcode={setBarcode}
        handleAdd={handleAdd}
      />

      <CartTable cart={cart} onDelete={handleDelete} />
      {/* <CartTable cart={sampleCart} /> */}

      <TotalDisplay cart={cart} />

      <div className="mt-4">
        <Button onClick={handlePay}>Pay</Button>
        <Button
          onClick={() => setCart([])}
          className="bg-red-500 hover:bg-red-600"
        >
          Clear
        </Button>
      </div>

      <QuantityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmQty}
        initialQty={1}
        productName={selectedProduct?.name || ""}
      />
    </div>
  );
}
