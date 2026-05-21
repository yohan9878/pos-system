import { SoldItemReport } from "../types/Report";

const API_URL = "http://localhost:8080/api/reports";

export const getDailyReport = async (date: string, outletId: string) => {
  let url = `${API_URL}/daily?date=${date}&outletId=${outletId}`;

  if (outletId && outletId !== "") {
    url += `&outletId=${outletId}`;
  }

  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch report");
  }

  return res.json();
};

export const getSoldItems = async (
  date: string,
  outletId: string,
): Promise<SoldItemReport[]> => {
  let url = `${API_URL}/items?date=${date}`;

  if (outletId && outletId !== "") {
    url += `&outletId=${outletId}`;
  }

  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch sold items");
  }

  return res.json();
};

//Day End Stock Report
export const getDayEndStockReport = async (date: string, outletId: string) => {
  let url = `${API_URL}/day-end-stock?date=${date}`;

  if (outletId && outletId !== "") {
    url += `&outletId=${outletId}`;
  }

  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch day-end stock report");
  }

  return res.json();
};
