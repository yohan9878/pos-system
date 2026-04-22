"use client";

import { useEffect, useEffectEvent, useState } from "react";
import Form from "next/form";
import Button from "./Button";
import { addStock, StockRequest } from "../services/stockService";

export default function ProductForm({
  isOpen,
  onClose,
  onAddSuccess,
  heading,
}: {
  onAddSuccess?: () => void;
  isOpen: boolean;
  onClose: () => void;
  heading: string;
}) {
  const [formData, setFormData] = useState<StockRequest>({
    barcode: "",
    lowStockThresholdQty: "",
    lowStockThresholdWeight: "",
    outletId: "",
    quantity: "",
    weight: "",
  });

  const [product, setProduct] = useState<{
    name: string;
    weighted: boolean;
  } | null>(null);

  const [isClient, setIsClient] = useState(false);

  //Determine if barcode is enterd, if product is weighted
  const isBarcodeEntered = formData.barcode !== "";
  const weighted = product?.weighted ?? false;

  // hydration fix
  const updateIsClient = useEffectEvent((val: boolean) => {
    setIsClient(val);
  });

  useEffect(() => {
    updateIsClient(true);
  }, []);

  const updateFormData = useEffectEvent((data: StockRequest) => {
    setFormData(data);
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // if (id === "barcode") {
    //   setBarcodeInput(value);
    // }
  };

  const handleAddStock = async (data: FormData) => {
    const stock: StockRequest = {
      barcode: data.get("barcode") as number | "",
      lowStockThresholdQty:
        parseInt(data.get("lowStockThresholdQty") as string) || 0,
      lowStockThresholdWeight:
        parseFloat(data.get("lowStockThresholdWeight") as string) || 0,
      outletId: (data.get("outletId") as string) || "",
      quantity: parseFloat(data.get("quantity") as string) || 0,
      weight: parseFloat(data.get("weight") as string) || 0,
    };
    if (
      !stock.barcode || !stock.outletId 
    ) {
      alert("Please fill in all required fields with valid values.");
      return;
    }

    const newStock = {
      barcode: stock.barcode,
      lowStockThresholdQty: stock.lowStockThresholdQty,
      lowStockThresholdWeight: stock.lowStockThresholdWeight,
      outletId: stock.outletId,
      quantity: stock.quantity,
      weight: stock.weight,
    };

    try {
      await addStock(newStock);

      setFormData({
        barcode: "",
        lowStockThresholdQty: 0,
        lowStockThresholdWeight: 0,
        outletId: "",
        quantity: 0,
        weight: 0,
      });
      alert("Stock added successfully!");
      onAddSuccess?.();
      onClose();
    } catch (err) {
      console.error("Failed to add stock:", err);
      alert("Failed to add Stock");
    }
  };
  useEffect(() => {
    if (isOpen)
      updateFormData({
        barcode: "",
        lowStockThresholdQty: "",
        lowStockThresholdWeight: "",
        outletId: "",
        quantity: "",
        weight: "",
      });
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    isClient && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div
          className="bg-white px-6 py-4 rounded-lg shadow-lg w-100"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-red-950 text-xl font-bold mb-4">{heading}</h2>
          <Form
            action={handleAddStock}
            className="flex rounded font-medium text-red-950 flex-col gap-2 flex-wrap text-xs"
          >
            {/* barcode */}
            <label htmlFor="barcode">Barcode *</label>
            <input
              id="barcode"
              name="barcode"
              placeholder="Barcode"
              value={formData.barcode}
              onChange={handleChange}
              className="w-full bg-red-50 p-2 text-md text-gray-700 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
            />
            {/* Outlet Id */}
            <label htmlFor="outletId">Outlet Id *</label>
            <input
              id="outletId"
              name="outletId"
              placeholder="Outlet Id"
              value={formData.outletId}
              onChange={handleChange}
              className="w-full bg-red-50 p-2 text-gray-700 text-md border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
            />
            {/* Quantity */}
            <label htmlFor="quantity">Quantity *</label>
            <input
              id="quantity"
              type="number"
              name="quantity"
              placeholder="Quantity"
              disabled={!isBarcodeEntered || weighted}
              value={formData.quantity}
              min={0}
              onChange={handleChange}
              className={`w-full ${!isBarcodeEntered || weighted ? "bg-gray-200" : "bg-red-50"} p-2 text-gray-700 text-md border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800`}
            />
            {/* Weight */}
            <label htmlFor="weight">Weight *</label>
            <input
              id="weight"
              type="number"
              name="weight"
              placeholder="Weight"
              disabled={!isBarcodeEntered || !weighted}
              step={0.01}
              min={0}
              value={formData.weight}
              onChange={handleChange}
              className={`w-full ${!isBarcodeEntered || !weighted ? "bg-gray-200" : "bg-red-50"} p-2 text-gray-700 text-md border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800`}
            />
            {/* Low Stock Threshold (Qty) */}
            <label htmlFor="lowStockThresholdQty">
              Low Stock Threshold (Qty) *
            </label>
            <input
              id="lowStockThresholdQty"
              type="number"
              name="lowStockThresholdQty"
              placeholder="Low Stock Threshold (Qty)"
              disabled={!isBarcodeEntered || weighted}
              step={0.01}
              min={0}
              value={formData.lowStockThresholdQty}
              onChange={handleChange}
              className={`w-full ${!isBarcodeEntered || weighted ? "bg-gray-200" : "bg-red-50"} p-2 text-gray-700 text-md border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800`}
            />
            {/* Low Stock Threshold (Weight) */}
            <label htmlFor="lowStockThresholdWeight">
              Low Stock Threshold (Weight) *
            </label>
            <input
              id="lowStockThresholdWeight"
              type="number"
              name="lowStockThresholdWeight"
              placeholder="Low Stock Threshold (Weight)"
              step={0.01}
              min={0}
              value={formData.lowStockThresholdWeight}
              disabled={!isBarcodeEntered || !weighted}
              onChange={handleChange}
              className={`w-full ${!isBarcodeEntered || !weighted ? "bg-gray-200" : "bg-red-50"} p-2 text-gray-700 text-md border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800`}
            />
            <div className="flex justify-center gap-2 mt-4">
              <button
                type="submit"
                className="px-8 py-2 w-1/2 text-white rounded transition bg-green-900 hover:bg-green-700"
              >
                Add
              </button>
              <Button
                onClick={onClose}
                className="w-1/2 bg-red-500 hover:bg-red-600 rounded"
              >
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
    )
  );
}
