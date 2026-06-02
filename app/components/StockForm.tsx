"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import Form from "next/form";
import Button from "./Button";
import { addStock } from "../services/stockService";
import { fetchProduct } from "../services/productService";
import { getUserFromToken } from "../services/userService";
import { StockRequest } from "../types/Stock";

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
    user: "",
  });

  const [product, setProduct] = useState<{
    name: string;
    weighted: boolean;
  } | null>(null);

  const [isClient, setIsClient] = useState(false);

  const [loadingProduct, setLoadingProduct] = useState(false);
  const [productError, setProductError] = useState("");
  const fetchRequestId = useRef(0);
  const barcodeDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  //Determine if barcode is enterd, if product is weighted
  const isBarcodeEntered = formData.barcode !== "";
  const isProductLoaded = product !== null;
  const weighted = product?.weighted;
  const disableQty = !isBarcodeEntered || !isProductLoaded || weighted;
  const disableWeight = !isBarcodeEntered || !isProductLoaded || !weighted;

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

  const loadProduct = async (barcode: string) => {
    if (!barcode || barcode.length < 13) return;

    const requestId = ++fetchRequestId.current;

    try {
      setLoadingProduct(true);
      setProductError("");
      setProduct(null);
      const data = await fetchProduct(barcode);

      if (requestId !== fetchRequestId.current) return;

      setProduct({
        name: data.name,
        weighted: data.weighted,
      });
    } catch (err) {
      if (requestId !== fetchRequestId.current) return;
      console.error(err);
      setProductError("Product not found");
      setProduct(null);
    } finally {
      if (requestId === fetchRequestId.current) {
        setLoadingProduct(false);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (id === "barcode") {
      setProduct(null);
      setProductError("");
      fetchRequestId.current++;

      if (barcodeDebounceRef.current) {
        clearTimeout(barcodeDebounceRef.current);
      }

      if (value.length >= 13) {
        barcodeDebounceRef.current = setTimeout(() => {
          loadProduct(value);
        }, 400);
      }
    }
  };

  const handleAddStock = async (data: FormData) => {
    const user = getUserFromToken();

    if (!user || !user.role) {
      alert("User not logged in");
      return;
    }
    const stock: StockRequest = {
      barcode: data.get("barcode") as number | "",
      lowStockThresholdQty:
        parseInt(data.get("lowStockThresholdQty") as string) || 0,
      lowStockThresholdWeight:
        parseFloat(data.get("lowStockThresholdWeight") as string) || 0,
      outletId: (data.get("outletId") as string) || "",
      quantity: parseFloat(data.get("quantity") as string) || 0,
      weight: parseFloat(data.get("weight") as string) || 0,
      user: user.role,
    };
    if (!stock.barcode || !stock.outletId) {
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
      user: stock.user,
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
        user: stock.user,
      });
      alert("Stock added successfully!");
      onAddSuccess?.();
      setProduct(null);
      setProductError("");
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
        user: "",
      });
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (barcodeDebounceRef.current) {
        clearTimeout(barcodeDebounceRef.current);
      }
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    isClient && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div
          className="bg-white px-4 sm:px-6 py-4 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
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
            {loadingProduct && (
              <p className="text-blue-500 text-xs">Loading product info...</p>
            )}
            {productError && (
              <p className="text-red-500 text-xs">{productError}</p>
            )}
            {product && (
              <p className="text-green-600 text-xs">
                {product.name} ({product.weighted ? "Weighted" : "Unit"})
              </p>
            )}
            {/* Outlet Id */}
            {/* <label htmlFor="outletId">Outlet Id *</label>
            <input
              id="outletId"
              name="outletId"
              placeholder="Outlet Id"
              value={formData.outletId}
              onChange={handleChange}
              className="w-full bg-red-50 p-2 text-gray-700 text-md border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
            /> */}
            <label htmlFor="outletId">Select Outlet*</label>
            <select
              id="outletId"
              name="outletId"
              value={formData.outletId === "" ? "" : String(formData.outletId)}
              onChange={handleChange}
              className="w-full bg-red-50 p-2 text-gray-700 text-md border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
            >
              <option value="" hidden>
                Select Outlet
              </option>
              <option value="Katunayake">Katunayake</option>
              {/* <option value="outlet2">Outlet 2</option> */}
            </select>
            {/* Quantity */}
            <label htmlFor="quantity">Quantity *</label>
            <input
              id="quantity"
              type="number"
              name="quantity"
              placeholder="Quantity"
              disabled={disableQty}
              value={formData.quantity}
              min={0}
              onChange={handleChange}
              className={`w-full ${disableQty ? "bg-gray-200" : "bg-red-50"} p-2 text-gray-700 text-md border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800`}
            />
            {/* Weight */}
            <label htmlFor="weight">Weight *</label>
            <input
              id="weight"
              type="number"
              name="weight"
              placeholder="Weight"
              disabled={disableWeight}
              step={0.01}
              min={0}
              value={formData.weight}
              onChange={handleChange}
              className={`w-full ${disableWeight ? "bg-gray-200" : "bg-red-50"} p-2 text-gray-700 text-md border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800`}
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
              disabled={disableQty}
              step={0.01}
              min={0}
              value={formData.lowStockThresholdQty}
              onChange={handleChange}
              className={`w-full ${disableQty ? "bg-gray-200" : "bg-red-50"} p-2 text-gray-700 text-md border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800`}
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
              disabled={disableWeight}
              onChange={handleChange}
              className={`w-full ${disableWeight ? "bg-gray-200" : "bg-red-50"} p-2 text-gray-700 text-md border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800`}
            />
            <div className="flex justify-center gap-2 mt-4">
              <button
                type="submit"
                className="px-8 py-2 w-1/2 text-white rounded transition bg-green-900 hover:bg-green-800"
              >
                Add
              </button>
              <Button
                onClick={() => {
                  setProduct(null);
                  setProductError("");
                  onClose();
                }}
                className="w-1/2 bg-red-600 hover:bg-red-500 rounded"
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
