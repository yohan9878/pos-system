"use client";

import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (qty: number) => void;
  initialQty: number;
  productName: string;
}

export default function QuantityModal({
  isOpen,
  onClose,
  onConfirm,
  initialQty,
  productName,
}: Props) {
  const [qty, setQty] = useState<number>(initialQty);

  // Reset qty when modal opens
  useEffect(() => {
    if (isOpen) setQty(initialQty);
  }, [isOpen, initialQty]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-black text-xl font-bold mb-4">Update Quantity</h2>

        <p className="mb-2 text-gray-900">{productName}</p>

        <input
          type="number"
          value={qty}
          onChange={(e) => setQty(parseInt(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (!qty || qty <= 0) return;
              onConfirm(qty);
              onClose();
            }

            // Optional: ESC to close
            if (e.key === "Escape") {
              onClose();
            }
          }}
          autoFocus
          className="w-full p-2 border rounded mb-4 text-gray-900"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              if (!qty || qty <= 0) return;
              onConfirm(qty);
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
