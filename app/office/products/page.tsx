"use client";

import Button from "@/app/components/Button";
import { useState } from "react";

export default function ProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [price, setPrice] = useState("");

  const addProduct = () => {
    const newProduct = {
      id: Date.now(),
      name,
      barcode,
      price: parseFloat(price),
    };

    setProducts([...products, newProduct]);

    setName("");
    setBarcode("");
    setPrice("");
  };

  return (
    <div className="text-white rounded">
      <h1 className="text-xl text-gray-950 font-bold">Product Management</h1>
      <div className="rounded mb-6 flex gap-2 flex-wrap mt-8">
        <input
          placeholder="Barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          className="w-50 p-2 text-md text-gray-700 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
        />
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-96 p-2 text-gray-700 text-md border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
        />
        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-50 p-2 text-gray-700 text-md border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
        />
        <Button
          onClick={addProduct}
          className=" bg-red-900 hover:bg-red-700"
        >
          Add Product
        </Button>
      </div>

      {/* <ul className="mt-4">
        {products.map((p) => (
          <li key={p.id}>
            {p.id} - {p.name} - {p.barcode} - Rs {p.price}
          </li>
        ))}
      </ul> */}

      <table className=" w-fit mt-5 border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border text-red-900 border-gray-800 p-2 w-50">
              Barcode
            </th>
            <th className="border text-red-900 border-gray-800 p-2 w-100">
              Name
            </th>
            <th className="border text-red-900 border-gray-800 p-2 w-50">
              Price (Rs.)
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="border text-gray-950 border-gray-300 p-2">
                {p.barcode}
              </td>
              <td className="border text-gray-950 border-gray-300 p-2">
                {p.name}
              </td>
              <td className="border text-gray-950 border-gray-300 p-2 text-right">
                {p.price.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
