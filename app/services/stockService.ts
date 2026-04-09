const API_URL = "http://localhost:8080/api/stock";

export interface StockItem {
  id: number;
  productName: string;
  barcode: string;
  quantity: number;
  outletId: string;
}

export interface StockHistoryItem {
  id: number;
  barcode: string;
  productName: string;
  oldQuantity: number;
  updatedQty: number;
  newQuantity: number;
  changedBy: string;
  changedAt: string;
}

export interface StockRequest {
  barcode: number;
  outletId: string;
  quantity: number;
}

// Get all stock
export const getStock = async (): Promise<StockItem[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch stock");
  return res.json();
};

// Add stock Omit<StockItem, "id"
export const addStock = async (stock: StockRequest ) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stock),
  });
  if (!res.ok) throw new Error("Failed to add stock");
  return res.json();
};

// Update stock quantity
export const updateStock = async (id: number, quantity: number) => {
  const res = await fetch(`${API_URL}/${id}?quantity=${quantity}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quantity: quantity,
      user: "Admin", // 🔥 later from login
    }),
  });
  if (!res.ok) throw new Error("Failed to update stock");
  return res.json();
};

// Delete stock
export const deleteStock = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete stock");
};
