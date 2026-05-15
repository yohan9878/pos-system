export interface reportData {
  date: string;
  outletId: string;
  discountAmount: number,
  totalSales: number;
  totalTransactions: number;
}

export interface SoldItemReport {
  barcode: string;
  itemName: string;
  saleQty: number;
  salePrice: number;
  saleValue: number;
}