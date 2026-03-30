import { CartItem } from "../types";

export const calculateTotal = (
  cart: CartItem[],
  discount: number,
  discountType: "percentage" | "fixed"
) => {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  let total = subtotal;

  if (discountType === "percentage") {
    total = subtotal - (subtotal * discount) / 100;
  } else {
    total = subtotal - discount;
  }

  if (total < 0) total = 0;

  return { subtotal, total };
};