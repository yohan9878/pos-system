const BASE_URL = "http://localhost:8080/api/reports";

export interface reportData{
    date: string,
    outletId: string,
    discountAmount: number,
    totalSales: number,
    totalTransactions: number
}

export const getDailyReport = async (
  date: string,
  outletId?: string
) => {
  let url = `${BASE_URL}/daily?date=${date}`;

  if (outletId && outletId !== "") {
    url += `&outletId=${outletId}`;
  }

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch report");
  }

  return res.json();
};