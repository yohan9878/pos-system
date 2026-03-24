import { Product } from "../types";

const products: Record<string, Product> = {
  "1001": { barcode: "1001", name: "Chicken 1kg", price: 1200 },
  "1002": { barcode: "1002", name: "Sausage Pack 1kg", price: 800 },
};

export const fetchProduct = (barcode: string): Product | null => {
  return products[barcode] || null;
};