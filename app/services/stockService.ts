const API_URL = "http://localhost:8080/api/stock";

export interface StockItem {
  id: number;
  productName: string;
  productId: string;
  quantity: number;
  outletId: string;
}

// Get all stock
export const getStock = async (): Promise<StockItem[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch stock");
  return res.json();
};

// Add stock
export const addStock = async (stock: Omit<StockItem, "id">) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stock),
  });
  if (!res.ok) throw new Error("Failed to add stock");
  return res.json();
};

// Update stock quantity (optional: create an endpoint in backend for this)
export const updateStock = async (id: number, quantity: number) => {
  const res = await fetch(`${API_URL}/${id}?quantity=${quantity}`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to update stock");
  return res.json();
};

// Delete stock
export const deleteStock = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete stock");
};
