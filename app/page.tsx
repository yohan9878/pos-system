import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl text-red-950 font-bold mb-4">Weehena Farm Shop</h1>

      <Link
        href="/outlet/katunayake/scan"
        className="bg-red-900 hover:bg-red-800 font-semibold text-white px-6 py-3 rounded"
      >
        Go to POS (Katunayake)
      </Link>

      <Link
        href="/office/products"
        className="bg-red-900 hover:bg-red-800 font-semibold text-white px-6 py-3 rounded"
      >
        Office Panel
      </Link>
    </div>
  );
}
