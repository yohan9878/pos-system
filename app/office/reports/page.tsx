"use client";

import { useEffect, useState } from "react";

export default function ReportPage() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    fetch(
      "http://localhost:8080/api/reports/daily?outletId=111K&date=2026-04-02",
    )
      .then((res) => res.json())
      .then((data) => setReport(data));
  }, []);

  if (!report) return <p className="text-gray-900 font-semibold">Loading...</p>;

  return (
    <div id="report" className="p-6 text-black">
      <h1 className="text-xl font-bold">Daily Sales Report</h1>
      <p>Date: {report.date}</p>
      <p>Outlet: {report.outletId}</p>
      <p>Total Sales: LKR {report.totalSales}</p>
      <p>Total Transactions: {report.totalTransactions}</p>

      <button
        onClick={() => window.print()}
        className="mt-4 print:hidden bg-black text-white px-4 py-2"
      >
        Print Report
      </button>
    </div>
  );
}
