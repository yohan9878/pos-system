"use client";

import { useEffect, useState } from "react";
import {
  getDailyReport,
  getSoldItems,
  reportData,
  SoldItemReport,
} from "@/app/services/reportService";
import Button from "@/app/components/Button";
import { getStock } from "@/app/services/stockService";

export default function ReportPage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [outlet, setOutlet] = useState("");
  const [outlets, setOutlets] = useState<string[]>([]);
  const [reports, setReports] = useState<reportData[]>([]);
  const [salesItems, setSalesItems] = useState<SoldItemReport[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFetchDailyReport = async () => {
    try {
      setLoading(true);
      const dailyReportData = await getDailyReport(date, outlet);
      const soldItemsData = await getSoldItems(date, outlet);
      setReports(dailyReportData);
      setSalesItems(soldItemsData);
      console.log("Report data:", dailyReportData);
      console.log("Sales data:", soldItemsData);
    } catch (err) {
      console.error("Failed to load report:", err);
      alert("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadOutlets() {
      const stock = await getStock();
      const unique = Array.from(new Set(stock.map((item) => item.outletId)));
      setOutlets(unique);
      setOutlet(unique[0] ?? "");
    }
    loadOutlets().catch(console.error);
  }, []);

  return (
    <div className=" text-black ">
      <h1 className="text-xl text-red-950 font-bold mb-4">Daily Reports</h1>

      {/* Controls */}
      <div className="flex gap-2 mb-10">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border-2 border-red-900 text-red-900 font-medium rounded p-2 "
        />

        <select
          value={outlet}
          onChange={(e) => setOutlet(e.target.value)}
          className="border-2 border-red-900 text-red-900 font-medium rounded p-2 "
        >
          {outlets.map((id) => (
            <option key={id} value={id} className="bg-red-50 text-gray-800">
              {id}
            </option>
          ))}
        </select>

        <Button
          onClick={handleFetchDailyReport}
          className="bg-red-700 hover:bg-red-600 text-white px-4 py-2"
        >
          Generate Daily Report
        </Button>
      </div>

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* Table */}
      {!loading && reports.length > 0 && salesItems.length > 0 && (
        <div id="report">
          <div className="text-red-950 my-5 font-semibold">
            <h1 className="text-xl">
              Daily Report of {outlet || "All Outlets"}
            </h1>
            <h4 className="text-lg">{date}</h4>
          </div>
          <table className="w-1/2 border">
            <thead>
              <tr>
                <th className=" border-gray-800 text-left text-red-900 w-40 p-2">
                  Date
                </th>
                <th className="border border-gray-800 text-center text-red-900 w-10 p-2">
                  Outlet
                </th>
                <th className="border border-gray-800 text-center text-red-900 w-10 p-2">
                  Transactions
                </th>
                <th className="border border-gray-800 text-right text-red-900 w-30 p-2">
                  Discount Amount (LKR)
                </th>
                <th className="border border-gray-800 text-right text-red-900 w-30 p-2">
                  Total Sales (LKR)
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <tr key={i} className="text-center border">
                  <td className="text-left border-gray-800 text-gray-900 font-medium p-2">
                    {r.date}
                  </td>
                  <td className="border text-center border-gray-800 text-gray-900 font-medium p-2">
                    {r.outletId}
                  </td>
                  <td className="border text-center border-gray-800 text-gray-900 font-medium p-2">
                    {r.totalTransactions}
                  </td>
                  <td className="border text-right border-gray-800 text-gray-900 font-medium p-2">
                    {r.discountAmount.toFixed(2)}
                  </td>
                  <td className="border text-right border-gray-800 text-gray-900 font-medium p-2">
                    {r.totalSales.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <table className="w-1/2 border mt-4">
            <thead>
              <tr>
                <th className=" border-gray-800 text-left text-red-900 w-40 p-2">
                  Barcode
                </th>
                <th className="border border-gray-800 text-center text-red-900 w-10 p-2">
                  Item Name
                </th>
                <th className="border border-gray-800 text-center text-red-900 w-10 p-2">
                  Qty
                </th>
                <th className="border border-gray-800 text-center text-red-900 w-10 p-2">
                  Price
                </th>
                <th className="border border-gray-800 text-right text-red-900 w-30 p-2">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {salesItems.map((item, index) => (
                <tr key={index}>
                  <td className="border text-left border-gray-800 text-gray-900 font-medium p-2">
                    {item.barcode}
                  </td>
                  <td className="border text-center border-gray-800 text-gray-900 font-medium p-2">
                    {item.itemName}
                  </td>
                  <td className="border text-center border-gray-800 text-gray-900 font-medium p-2">
                    {item.saleQty}
                  </td>
                  <td className="border text-center border-gray-800 text-gray-900 font-medium p-2">
                    {item.salePrice}
                  </td>
                  <td className="border text-right border-gray-800 text-gray-900 font-medium p-2">
                    {item.saleValue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No Data */}
      {!loading && (reports.length === 0 || salesItems.length === 0) && (
        <p className="mt-4 text-red-700 font-medium">No data available</p>
      )}

      {/* Print */}
      {reports.length > 0 && salesItems.length > 0 && (
        <Button
          onClick={() => window.print()}
          className="mt-4 print:hidden bg-green-800 hover:bg-green-700 text-white px-4 py-2"
        >
          Print Report
        </Button>
      )}
    </div>
  );
}
