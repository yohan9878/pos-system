"use client";

import { useState, useContext, useRef } from "react";
import { CartContext } from "@/app/context/CartContext";
import BarcodeInput from "@/app/components/BarcodeInput";
import CartTable from "@/app/components/CartTable";
import TotalDisplay from "@/app/components/TotalDisplay";
import Button from "@/app/components/Button";
import { fetchProduct } from "@/app/services/productService";
import { Product } from "@/app/types";
import QuantityModal from "@/app/components/QuantityModal";
import Receipt from "@/app/components/Receipt";
import DiscountModal from "@/app/components/DiscountModal";
import { calculateTotal } from "@/app/utils/calculateTotal";
import generateInvoiceNumber from "@/app/utils/generateInvoiceNumber";

export default function ScanPage() {
  const [barcode, setBarcode] = useState<string>("");
  const { cart, setCart } = useContext(CartContext)!;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
    "percentage",
  );
  const [invoiceNo, setInvoiceNo] = useState<string>("");
  const { subtotal, total, discountAmount } = calculateTotal(
    cart,
    discount,
    discountType,
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    const product = fetchProduct(barcode);
    if (!product) return alert("Product not found");

    // Open modal for ANY scan
    setSelectedProduct(product);
    setModalOpen(true);

    setBarcode("");
  };

  const handlePay = () => {
    const newInvoice = generateInvoiceNumber();
    setInvoiceNo(newInvoice);

    alert(`Payment Done\nInvoice: ${newInvoice}`);
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

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleDelete = (barcode: string) => {
    setCart(cart.filter((item) => item.barcode !== barcode));
  };

  const handleApplyDiscount = (value: number, type: "percentage" | "fixed") => {
    setDiscount(value);
    setDiscountType(type);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-poppins">
      <h1 className="text-3xl text-red-950 text-center font-popins font-semibold mb-5">
        Weehena Farm Shop
      </h1>

      <BarcodeInput
        barcode={barcode}
        setBarcode={setBarcode}
        handleAdd={handleAdd}
        inputRef={inputRef}
      />

      <CartTable cart={cart} onDelete={handleDelete} />

      <TotalDisplay
        discountAmount={discountAmount}
        subtotal={subtotal}
        total={total}
        discount={discount}
        discountType={discountType}
      />

      <div className="mt-4">
        <Button onClick={handlePay}>Pay</Button>

        <button
          className="mr-3 mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded text-white"
          onClick={() => setDiscountModalOpen(true)}
        >
          Discount
        </button>
        <Button
          onClick={() => window.print()}
          className=" mt-4 px-4 py-2 bg-green-800 hover:bg-green-700 text-white print:hidden"
        >
          Print Invoice
        </Button>
        <Button
          onClick={() => {
            setCart([]);
            setInvoiceNo("");
            setDiscount(0);
          }}
          className="bg-red-800 hover:bg-red-700"
        >
          Clear Cart
        </Button>
      </div>
      <div className="flex items-center my-10 border-t">
        <QuantityModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setTimeout(() => {
              inputRef.current?.focus();
            }, 0);
          }}
          onConfirm={handleConfirmQty}
          initialQty={1}
          productName={selectedProduct?.name || ""}
        />
      </div>
      <DiscountModal
        isOpen={discountModalOpen}
        onClose={() => setDiscountModalOpen(false)}
        onApply={handleApplyDiscount}
      />

      <div className=" flex flex-col items-center invoice-print">
        <Receipt
          cart={cart}
          invoiceNo={invoiceNo}
          subtotal={subtotal}
          discount={discount}
          discountType={discountType}
          discountAmount={discountAmount}
          total={total}
        />
      </div>
    </div>
  );
}