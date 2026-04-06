import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ScanLayout({ children }: Props) {
  return (
    <div className="min-h-screen">
      {/* Optional Header */}
      <div className="bg-red-950 text-white p-4 font-bold">POS System</div>

      {/* Page Content */}
      <div className="p-4 bg-white">{children}</div>
    </div>
  );
}
