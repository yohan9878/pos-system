const BASE_URL = "http://localhost:8080/api";



export const processSale = async (saleData: any) => {
  const res = await fetch(`${BASE_URL}/sales`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(saleData),
  });

  if (!res.ok) {
    throw new Error("Failed to process sale");
  }

  return res.text();
};