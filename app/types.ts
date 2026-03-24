export interface Product {
  barcode: string;
  name: string;
  price: number;
}

export interface CartItem extends Product {
  qty: number;
}
