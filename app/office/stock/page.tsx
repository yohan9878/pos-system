"use client";

import Button from "@/app/components/Button";
import { useEffect, useEffectEvent, useState } from "react";
import { getStock, addStock, updateStock, deleteStock, StockItem } from "@/app/services/stockService";

export default function StockPage() {
  const [stockList, setStockList] = useState<StockItem[]>([]);
  const [search, setSearch] = useState("");

  const [productName, setProductName] = useState("");
  const [productId, setProductId] = useState("");
  const [outletId, setOutletId] = useState("");
  const [qty, setQty] = useState("");

  // Load stock from backend
  const loadStock = async () => {
    try {
      const data = await getStock();
      setStockList(data);
    } catch (err) {
      console.error("Failed to fetch stock:", err);
    }
  };

  const updateLoadStock = useEffectEvent(() => {
    loadStock();
  });


  useEffect(() => {
    updateLoadStock();
  }, []);

  // Add new stock
  const handleAddStock = async () => {
    if (!productName || !productId || !outletId || !qty) return;

    const newStock = {
      productName,
      productId,
      outletId,
      quantity: parseInt(qty),
    };

    try {
      await addStock(newStock);
      await loadStock(); // refresh list
      setProductName("");
      setProductId("");
      setOutletId("");
      setQty("");
    } catch (err) {
      console.error("Failed to add stock:", err);
      alert("Failed to add stock");
    }
  };

  // Update quantity
  const handleUpdateQty = async (id: number, newQty: number) => {
    if (newQty <= 0) return;
    try {
      await updateStock(id, newQty);
      await loadStock();
    } catch (err) {
      console.error("Failed to update quantity:", err);
      alert("Failed to update stock quantity");
    }
  };

  // Delete stock
  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure to delete this stock?");
    if (!confirmDelete) return;

    try {
      await deleteStock(id);
      await loadStock();
    } catch (err) {
      console.error("Failed to delete stock:", err);
      alert("Failed to delete stock");
    }
  };

const filteredStock = stockList.filter((item) =>
  item.productId?.toString().includes(search) ||
  item.productName?.toLowerCase().includes(search.toLowerCase())
);


  return (
    <div>
      <h1 className="text-2xl text-red-950 font-bold mb-4">Stock Management</h1>

      {/* Search */}
      <input
        placeholder="Search by barcode or product name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border mb-4 w-90 border-gray-300 text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
      />

      {/* Add Stock */}
      <div className="rounded mb-6 flex gap-2 flex-wrap">
        <input
          placeholder="Barcode"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="text-gray-700 w-50 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
        />
        <input
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="text-gray-700 w-88 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
        />
        <input
          placeholder="Outlet ID"
          value={outletId}
          onChange={(e) => setOutletId(e.target.value)}
          className="text-gray-700 w-50 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="text-gray-700 p-2 border border-gray-300 rounded w-32 focus:outline-none focus:ring-2 focus:ring-red-800"
        />
        <Button
          onClick={handleAddStock}
          className="bg-green-900 hover:bg-green-700 text-white px-4 rounded"
        >
          Add Stock
        </Button>
      </div>

      {/* Stock Table */}
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border border-gray-800 text-red-900 w-50 p-2">Barcode</th>
            <th className="border border-gray-800 text-red-900 w-90 p-2">Product</th>
            <th className="border border-gray-800 text-red-900 w-40 p-2">Quantity</th>
            <th className="border border-gray-800 text-red-900 p-2 w-60">Outlet</th>
            <th className="border border-gray-800 text-red-900 w-30 p-2 mx-auto">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredStock.map((item) => (
            <tr
              key={item.id}
              className={`text-center ${item.quantity < 5 ? "bg-red-100" : ""}`}
            >
              <td className="border text-left border-gray-800 text-gray-900 font-medium p-2">{item.productId}</td>
              <td className="border text-left border-gray-800 text-gray-900 font-medium p-2">{item.productName}</td>

              {/* Editable Quantity */}
              <td className="border border-gray-800 p-2">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleUpdateQty(item.id, parseInt(e.target.value))}
                  className="w-20 text-center border text-gray-900 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                />
              </td>

              <td className="border border-gray-800 text-gray-900 font-medium w-60 p-2">{item.outletId}</td>

              <td className="border border-gray-800 p-2">
                <Button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-800 text-white px-2 py-1 ml-4 rounded hover:bg-red-700"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
