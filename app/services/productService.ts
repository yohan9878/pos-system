import { Product } from "../types";

const products: Record<string, Product> = {
  "1001": { barcode: "1001", name: "Chicken 1kg", price: 1200.00 },
  "1002": { barcode: "1002", name: "Sausage Pack 1kg", price: 800.00 },
  "1003": { barcode: "1003", name: "Chese and Onion Sausage 500g", price: 650.00 },
  "1004": { barcode: "1004", name: "Chicken Meat Balls 500g ", price: 750.00 },
  "1005": { barcode: "1005", name: "Chandi Sausage", price: 250.00 },
};

export const fetchProduct = (barcode: string): Product | null => {
  return products[barcode] || null;
};
