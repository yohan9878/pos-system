"use client";

import Button from "@/app/components/Button";
import { useEffect, useEffectEvent, useState } from "react";
import { getStock, addStock, updateStock } from "@/app/services/stockService";
import { deleteStock } from "@/app/services/stockService";

interface StockItem {
  id: number;
  productName: string;
  barcode: string;
  quantity: number;
  outlet: string;
}
export default function StockPage() {
  const [stockList, setStockList] = useState<StockItem[]>([]);
  const [search, setSearch] = useState("");

  // const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [qty, setQty] = useState("");

  // const handleAddStock = () => {
  //   console.log("Stock Added:", {
  //     productId,
  //     qty,
  //     outlet: "katunayake",
  //   });

  //   setQty("");
  // };

  const loadStock = async () => {
    const data = await getStock();
    setStockList(data);
  };

  const updateLoadStock = useEffectEvent(() => {
    loadStock();
  });

  useEffect(() => {
    updateLoadStock();
  }, []);

  const handleAddStock = async () => {
    if (!productName || !barcode || !qty) return;

    const newStock: StockItem = {
      id: Date.now(),
      productName,
      barcode,
      quantity: parseInt(qty),
      outlet: "katunayake",
    };

    // await addStock({
    //   productName,
    //   barcode,
    //   quantity: parseInt(qty),
    //   outlet: "katunayake",
    // });

    setStockList([...stockList, newStock]);

    // clear inputs
    setProductName("");
    setBarcode("");
    setQty("");

    // alert("Stock Added: " + JSON.stringify(newStock));
    loadStock();
  };

  const handleUpdateQty = async (id: number, newQty: number) => {
    if (newQty <= 0) return;

    await updateStock(id, newQty);
    loadStock();
  };

  const handleDelete = (id: number) => {
    const confirmDelete = confirm("Are you sure to delete this stock?");
    if (!confirmDelete) return;
    setStockList(stockList.filter((item) => item.id !== id));
  };

  //   const handleDelete = async (id: number) => {
  //   const confirmDelete = confirm("Are you sure to delete this stock?");

  //   if (!confirmDelete) return;

  //   await deleteStock(id);

  //   loadStock(); // refresh table
  // };

  const filteredStock = stockList.filter((item) =>
    item.barcode.includes(search),
  );

  return (
    <div>
      <h1 className="text-xl text-gray-950 font-bold mb-4">
        Stock Management
      </h1>

      {/* Search */}
      <input
        placeholder="Search by barcode..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border mt-4 mb-4 w-ful border-gray-300 text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
      />

      {/* Add Stock */}
      <div className="rounded mb-6 flex gap-2 flex-wrap">
        <input
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="text-gray-700 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
        />

        <input
          placeholder="Barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          className="text-gray-700 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
        />

        <input
          type="number"
          placeholder="Quantity"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="text-gray-700 p-2 border border-gray-300 rounded w-32 focus:outline-none focus:ring-2 focus:ring-red-800 "
        />

        <Button
          onClick={handleAddStock}
          className="bg-red-900 hover:bg-red-700 text-white px-4 rounded"
        >
          Add Stock
        </Button>
      </div>

      {/* Stock Table */}
      <table className="w-full border">
        <thead className=" ">
          <tr>
            <th className="border border-gray-800 text-red-900 w-90 p-2">Product</th>
            <th className="border border-gray-800 text-red-900 w-50 p-2">Barcode</th>
            <th className="border border-gray-800 text-red-900 w-40 p-2">Quantity</th>
            <th className="border border-gray-800 text-red-900 p-2">Outlet</th>
            <th className="border border-gray-800 text-red-900 w-30 p-2 mx-auto">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredStock.map((item) => (
            <tr
              key={item.id}
              className={`text-center ${item.quantity < 5 ? "bg-red-100" : ""}`}
            >
              <td className="border text-left border-gray-800 text-gray-900 font-medium p-2">{item.productName}</td>
              <td className="border border-gray-800 text-gray-900 font-medium p-2">{item.barcode}</td>

              {/* ✏ Editable Quantity */}
              <td className="border border-gray-800 p-2">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleUpdateQty(item.id, parseInt(e.target.value))
                  }
                  className="w-20 text-center border text-gray-900 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                />
              </td>

              <td className="border border-gray-800 text-gray-900 font-medium p-2">{item.outlet}</td>
              <td className="border border-gray-800 p-2">
                <Button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-2 py-1 ml-4 rounded hover:bg-red-600"
                >
                  {/* ❌ */} X
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
