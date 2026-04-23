const BASE_URL = "http://localhost:8080/api/sales";

interface SaleData {
  date: string;
  invoiceNo: string;
  outletId: string;
  discountAmount: number;
  items: {
    barcode: string;
    value: number;
    priceType: string;
  }[];
}

export const processSale = async (saleData: SaleData) => {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(saleData),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Sale failed");
  }

  return response.text();
};

export const getSales = async (date: string, outletId?: string) => {
  let url = `${BASE_URL}/daily?date=${date}&outletId=${outletId}`;

  if (outletId && outletId !== "") {
    url += `&outletId=${outletId}`;
  }

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch sales");
  }

  return res.json();
};
