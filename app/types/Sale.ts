export interface SaleData {
  date: string;
  invoiceNo: string;
  outletId: string;
  discountAmount: number;
  items: {
    barcode: string;
    value: number;
    priceType: string;
  }[];
}
