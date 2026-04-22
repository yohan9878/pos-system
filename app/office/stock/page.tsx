"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  getStock,
  updateStock,
  deleteStock,
  StockItem,
} from "@/app/services/stockService";
import QuantityModal from "@/app/components/QuantityModal";
import Button from "@/app/components/Button";
import WeightModal from "@/app/components/WeightModal";
import StockForm from "@/app/components/StockForm";

export default function StockPage() {
  const [stockList, setStockList] = useState<StockItem[]>([]);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);

  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  const [weightModalOpen, setWeightModalOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Load stock from backend
  const loadStock = async () => {
    try {
      const data = await getStock();
      //SORT BY BARCODE (ASCENDING)
      const sortedData = data.sort((a: StockItem, b: StockItem) =>
        a.barcode.toString().localeCompare(b.barcode.toString()),
      );

      setStockList(sortedData);
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

  // Quantity Modal opens when click on update stock quantity
  const handleQtyClick = (item: StockItem) => {
    setSelectedStock(item);
    setModalOpen(true);
  };

  // Weight Modal opens when click on update Stock weight
  const handleWeightClick = (item: StockItem) => {
    setSelectedStock(item);
    setWeightModalOpen(true);
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

  const filteredStock = stockList.filter(
    (item) =>
      item.barcode?.toString().includes(search) ||
      item.productName?.toLowerCase().includes(search.toLowerCase()) ||
      item.outletId?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleConfirmValue = async (value: number) => {
    if (!selectedStock) return;

    try {
      await updateStock(selectedStock.id, {
        value: value,
        user: "admin",
      });

      setModalOpen(false);
      setSelectedStock(null);
      await loadStock();
    } catch (err) {
      console.error("Failed to update stock:", err);
      alert("Failed to update stock");
    }
  };
  const handleConfirmValueforWeight = async (value: number) => {
    if (!selectedStock) return;

    try {
      await updateStock(selectedStock.id, {
        value: value,
        user: "admin",
      });

      setWeightModalOpen(false);
      setSelectedStock(null);
      await loadStock();
    } catch (err) {
      console.error("Failed to update stock:", err);
      alert("Failed to update stock");
    }
  };

  return (
    <div className="relative text-xs">
      <h1 className="text-xl text-red-950 font-bold mb-4">Stock Management</h1>

      {/* Search */}
      <input
        placeholder="Search by barcode, product name or outlet ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border mb-4 w-74 bg-blue-50 border-gray-300 text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
      />
      <Button
        onClick={() => setFormOpen(true)}
        className="absolute right-0 bg-green-900 hover:bg-green-700 text-white px-4 rounded"
      >
        Add Stock
      </Button>

      {/* Add Stock */}
      <div className="rounded mb-6 flex gap-2 flex-wrap">
        <StockForm
          onClose={() => {
            setFormOpen(false);
            setTimeout(() => {
              inputRef.current?.focus();
            }, 0);
          }}
          onAddSuccess={() => loadStock()}
          isOpen={formOpen}
          heading="Add New Stock"
        />
      </div>

      {/* Stock Table */}
      <table className="w-fit border text-xs">
        <thead>
          <tr>
            <th className=" border-gray-800 text-left text-red-900 w-40 p-2">
              Barcode
            </th>
            <th className=" border-gray-800 text-left text-red-900 w-90 p-2">
              Product
            </th>
            <th className=" border-gray-800 text-center text-red-900 w-40 p-2">
              Quantity
            </th>
            <th className=" border-gray-800 text-center text-red-900 w-30 p-2 mx-auto">
              Weight
            </th>
            <th className=" border-gray-800 text-center text-red-900 p-2 w-60">
              Outlet
            </th>
            <th className=" border-gray-800 text-center text-red-900 w-30 p-2 mx-auto">
              Low Stock Threshold Qty
            </th>
            <th className=" border-gray-800 text-center text-red-900 w-30 p-2 mx-auto">
              Low Stock Threshold Weight
            </th>

            <th className=" border-gray-800 text-center text-red-900 w-30 p-2 mx-auto">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredStock.map((item) => (
            <tr
              key={item.id}
              className={`${item.quantity < 5 ? "bg-red-100" : ""} odd:bg-blue-50 even:bg-white`}
            >
              <td className="text-left border-gray-800 text-gray-900 font-medium p-2">
                {item.barcode}
              </td>
              <td className=" border-gray-800 text-gray-900 font-medium p-2">
                {item.productName}
              </td>

              {/* Editable Quantity */}
              <td className=" border-gray-800 p-2">
                <div
                  onClick={() => {
                    if (!item.weighted) {
                      handleQtyClick(item);
                    }
                  }}
                  className={`text-center px-3 py-1 rounded font-semibold ${
                    item.weighted
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-red-200 hover:bg-red-100 cursor-pointer text-red-900"
                  }`}
                >
                  {item.quantity ? item.quantity : "N/A"}
                </div>
              </td>
              <td className=" border-gray-800 p-2">
                <div
                  onClick={() => {
                    if (item.weighted) {
                      handleWeightClick(item);
                    }
                  }}
                  className={`text-center px-3 py-1 rounded font-semibold ${
                    item.weighted
                      ? "bg-red-200 hover:bg-red-100 cursor-pointer text-red-900"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {item.weight ? item.weight.toFixed(2) : "N/A"}
                </div>
              </td>

              <td className=" border-gray-800 text-center text-gray-900 font-medium w-60 p-2">
                {item.outletId}
              </td>
              <td className=" border-gray-800 text-center text-gray-900 font-medium w-30 p-2">
                {item.lowStockThresholdQty ? item.lowStockThresholdQty : "N/A"}
              </td>
              <td className=" border-gray-800 text-center text-gray-900 font-medium w-30 p-2">
                {item.lowStockThresholdWeight
                  ? item.lowStockThresholdWeight.toFixed(2)
                  : "N/A"}
              </td>

              <td className=" border-gray-800 w-30 p-2">
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
      {selectedStock ? (
        selectedStock.weighted ? (
          <WeightModal
            isOpen={weightModalOpen}
            onClose={() => {
              setWeightModalOpen(false);
              setSelectedStock(null);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            }}
            onConfirm={handleConfirmValueforWeight}
            initialWeight={null}
            productName={selectedStock ? selectedStock.productName : ""}
            heading="Update Stock Weight (Kg)"
          />
        ) : (
          <QuantityModal
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setSelectedStock(null);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            }}
            onConfirm={handleConfirmValue}
            initialQty={null}
            productName={selectedStock ? selectedStock.productName : ""}
            heading="Update Stock Quantity"
          />
        )
      ) : (
        ""
      )}
      {/* <QuantityModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedStock(null);
        }}
        onConfirm={handleConfirmValue}
        initialQty={null}
        productName={
          selectedStock
            ? selectedStock.weighted
              ? `${selectedStock.productName} (Enter Weight)`
              : `${selectedStock.productName} (Enter Quantity)`
            : ""
        }
      /> */}
    </div>
  );
}
