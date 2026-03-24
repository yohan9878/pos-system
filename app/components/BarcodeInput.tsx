"use client";

type BarcodeInputProps = {
  barcode: string;
  setBarcode: (value: string) => void;
  handleAdd: () => void;
};

export default function BarcodeInput({ barcode, setBarcode, handleAdd }: BarcodeInputProps) {
  return (
    <input
      type="text"
      value={barcode}
      onChange={(e) => setBarcode(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleAdd()}
      placeholder="Scan or enter barcode"
      className="w-72 p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}