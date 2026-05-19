import { SaleData } from "../types/Sale";

const BASE_URL = "http://localhost:8080/api/sales";

// export interface SaleData {
//   date: string;
//   invoiceNo:string;
//   outletId: string;
//   discountAmount: number;
//   items: {
//     barcode: string;
//     value: number;
//     priceType: string;
//   }[];
// }

export const processSale = async (saleData: SaleData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(saleData),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Sale failed");
  }

  return response.text();
};
