import { Product } from "../types";

const BASE_URL = "http://localhost:8080/api/products";

export interface ProductItems {
  id: number;
  name: string;
  barcode: number;
  bulkPrice: number;
  retailPrice: number;
  packPrice: number;
  pricePerKg: number;
  weighted: boolean;
}

export interface ProductRequest {
  name: string;
  barcode: number | "";
  bulkPrice: number | "";
  retailPrice: number | "";
  packPrice: number | "";
  pricePerKg: number | "";
  weighted: boolean | "";
}

// Get all products
export const getProducts = async (): Promise<ProductItems[]> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
};

// Add product
export const addProduct = async (product: ProductRequest) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to add product");
  return res.json();
};

// Delete product
export const deleteProduct = async (id: number) => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete product");
};

// Fetch product by barcode
export const fetchProduct = async (barcode: string): Promise<Product> => {
  try {
    const res = await fetch(`${BASE_URL}/${barcode}`);

    if (!res.ok) throw new Error("Product not found");

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);

    alert("Product not found");
    throw new Error("Failed to fetch product");
  }
};
