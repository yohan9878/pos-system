"use client";

import Button from "@/app/components/Button";
import {
  addProduct,
  deleteProduct,
  getProducts,
  ProductItems,
} from "@/app/services/productService";
import { useEffect, useEffectEvent, useState } from "react";

export default function ProductPage() {
  const [products, setProducts] = useState<ProductItems[]>([]);
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [bulkPrice, setBulkPrice] = useState("");
  const [retailPrice, setRetailPrice] = useState("");
  const [packPrice, setPackPrice] = useState("");
  // const [packWeight, setPackWeight] = useState("");
  const [pricePerKg, setPricePerKg] = useState("");
  const [weighted, setWeighted] = useState("false");

  const [search, setSearch] = useState("");

  // Load products from backend
  const loadProducts = async () => {
    try {
      const data = await getProducts();
      const sortedData = data.sort((a: ProductItems, b: ProductItems) =>
        a.barcode.toString().localeCompare(b.barcode.toString()),
      );
      setProducts(sortedData);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const updateLoadProducts = useEffectEvent(() => {
    loadProducts();
  });

  useEffect(() => {
    updateLoadProducts();
  }, []);

  const handleAddProduct = async () => {
    if (
      !name ||
      !barcode ||
      !bulkPrice ||
      !retailPrice ||
      !packPrice ||
      // !packWeight ||
      !pricePerKg
    )
      return;

    const newProduct = {
      name,
      barcode,
      bulkPrice: parseFloat(bulkPrice),
      retailPrice: parseFloat(retailPrice),
      packPrice: parseFloat(packPrice),
      // packWeight: parseFloat(packWeight),
      pricePerKg: parseFloat(pricePerKg),
      weighted: weighted === "true",
    };

    try {
      await addProduct(newProduct);
      await loadProducts(); // refresh list
      setName("");
      setBarcode("");
      setBulkPrice("");
      setRetailPrice("");
      setPackPrice("");
      // setPackWeight("");
      setPricePerKg("");
      setWeighted("false");
    } catch (err) {
      console.error("Failed to add product:", err);
      alert("Failed to add product");
    }
  };

  // Delete product
  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure to delete this product?");
    if (!confirmDelete) return;

    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product");
    }
  };

  const filteredProducts = products.filter(
    (item) =>
      item.barcode?.toString().includes(search) ||
      item.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="text-white rounded">
      <h1 className="text-xl text-red-950 font-bold mb-4">
        Product Management
      </h1>

      <div className="rounded mb-4 flex gap-2 flex-wrap text-xs">
        <input
          id="search"
          placeholder="Search by barcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 mb-2 border w-full bg-blue-50 border-gray-300 text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
        />
        <input
          id="barcode"
          placeholder="Barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          className="w-50 bg-green-50 p-2 text-md text-gray-700 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
        />
        <input
          id="productName"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-96 bg-green-50 p-2 text-gray-700 text-md border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
        />
        <input
          id="bulkPrice"
          placeholder="Bulk Price"
          value={bulkPrice}
          onChange={(e) => setBulkPrice(e.target.value)}
          className="w-40 bg-green-50 p-2 text-gray-700 text-md border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
        />
        <input
          id="retailPrice"
          placeholder="Retail Price"
          value={retailPrice}
          onChange={(e) => setRetailPrice(e.target.value)}
          className="w-40 bg-green-50 p-2 text-gray-700 text-md border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
        />
        <input
          id="packPrice"
          placeholder="Pack Price"
          value={packPrice}
          onChange={(e) => setPackPrice(e.target.value)}
          className="w-40 bg-green-50 p-2 text-gray-700 text-md border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
        />
        {/* <input
          id="packWeight"
          placeholder="Pack Weight"
          value={packWeight}
          onChange={(e) => setPackWeight(e.target.value)}
          className="w-40 bg-green-50 p-2 text-gray-700 text-md border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
        /> */}
        <input
          id="pricePerKg"
          placeholder="Price per Kg"
          value={pricePerKg}
          onChange={(e) => setPricePerKg(e.target.value)}
          className="w-40 bg-green-50 p-2 text-gray-700 text-md border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
        />
        <select
          id="weighted"
          value={weighted}
          onChange={(e) => setWeighted(e.target.value)}
          className="w-40 bg-green-50 p-2 text-gray-700 text-md border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
        >
          <option value="false">Not Weighted</option>
          <option value="true">Weighted</option>
        </select>
        <Button
          onClick={handleAddProduct}
          className=" bg-green-900 hover:bg-green-700"
        >
          Add Product
        </Button>
      </div>

      <table className="w-full border border-gray-200 text-xs">
        <thead>
          <tr>
            <th className="text-red-900 text-left border-gray-800 p-2 w-50">
              Barcode
            </th>
            <th className="text-red-900 text-left border-gray-800 p-2 w-100">
              Name
            </th>
            <th className="text-red-900 text-right border-gray-800 p-2 w-30">
              Bulk Price
            </th>
            <th className="text-red-900 text-right border-gray-800 p-2 w-30">
              Retail Price
            </th>
            <th className="text-red-900 text-right border-gray-800 p-2 w-30">
              Pack Price
            </th>
            {/* <th className="text-red-900 text-right border-gray-800 p-2 w-30">
              Pack Weight
            </th> */}
            <th className="text-red-900 text-right border-gray-800 p-2 w-30">
              Price per Kg
            </th>
            <th className="text-red-900 border-gray-800 p-2 w-38">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) => (
            <tr key={p.id} className="odd:bg-gray-200 even:bg-white">
              <td className=" text-gray-950 border-gray-500 font-medium p-2">
                {p.barcode}
              </td>
              <td className="text-gray-950 border-gray-500 font-medium p-2">
                {p.name}
              </td>
              <td className="text-gray-950 border-gray-500 p-2 text-right">
                {p.bulkPrice.toFixed(2)}
              </td>
              <td className="text-gray-950 border-gray-500 p-2 text-right">
                {p.retailPrice.toFixed(2)}
              </td>
              <td className="text-gray-950 border-gray-500 p-2 text-right">
                {p.packPrice ? p.packPrice.toFixed(2) : "N/A"}
              </td>
              {/* <td className="text-gray-950 border-gray-500 p-2 text-right">
                {p.packWeight ? p.packWeight.toFixed(2) : "N/A"}
              </td> */}
              <td className="text-gray-950 border-gray-500 p-2 text-right">
                {p.pricePerKg ? p.pricePerKg.toFixed(2) : "N/A"}
              </td>
              <td className="text-gray-950 border-gray-500 p-2 text-center w-fit">
                <Button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-900 hover:bg-red-700 text-white ml-4"
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
