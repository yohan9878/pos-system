import qz, { CreatePrinterInput } from "qz-tray";
import { ReceiptData } from "../types/Receipt";

// interface CartItem {
//   name: string;
//   value: number;
//   weighted: boolean;
//   pricePerKg: number;
//   packPrice: number;
// }

// interface ReceiptData {
//   cart: CartItem[];
//   subtotal: number;
//   discountAmount: number;
//   total: number;
//   invoiceNo: string;
// }

function normalizePrinterName(rawPrinterName: string | CreatePrinterInput) {
  if (Array.isArray(rawPrinterName)) {
    return rawPrinterName[0];
  }
  return rawPrinterName;
}

export async function printReceipt(
  data: ReceiptData,
  rawPrinterName: string | CreatePrinterInput,
) {
  try {
    // connect to QZ
    if (!qz.websocket.isActive()) {
      await qz.websocket.connect();
    }

    const printerName = normalizePrinterName(rawPrinterName);

    if (!printerName) {
      throw new Error("Printer name is required");
    }

    // const printers = await qz.printers.find();
    // console.log("Available printers:", printers);

    let printer = await qz.printers.find(printerName);

    if (Array.isArray(printer)) {
      printer = printer[0];
    }

    const config = qz.configs.create(printer);

    const ESC = "\x1B";
    const CENTER = ESC + "a" + "\x01";
    const LEFT = ESC + "a" + "\x00";
    const BOLD_ON = ESC + "E" + "\x01";
    const BOLD_OFF = ESC + "E" + "\x00";
    const CUT = "\x1D\x56\x41";
    const GS = "\x1D";

    const date = new Date().toLocaleString();

    let receipt = "";

    // Header
    receipt += CENTER;
    receipt += BOLD_ON;
    receipt += "\n\n\n";
   
    receipt += GS + "!" + "\x10";
    receipt += "WEEHENA FARM SHOP\n";
    receipt += BOLD_OFF;

    receipt += GS + "!" + "\x00";

    receipt += "Katunayake\n";
    receipt += "Tel: 077-1234567\n\n\n";
    

    // Invoice
    receipt += "------------------------------------------------\n\n";
    receipt += LEFT;
    receipt += `Invoice: ${data.invoiceNo}\n\n`;
    receipt += `Date: ${date}\n\n`;
    receipt += "------------------------------------------------\n\n\n\n";

    receipt += "ITEM                     QTY     PRICE   TOTAL\n";
    receipt += "------------------------------------------------\n\n";

    // Items
    data.cart.forEach((item) => {
      const qty = item.weighted
        ? `${item.value.toFixed(2)}Kg`
        : `${item.value}`;

      const price = item.weighted
        ? item.pricePerKg.toFixed(2)
        : item.packPrice.toFixed(2);

      const lineTotal = item.weighted
        ? item.pricePerKg * item.value
        : item.packPrice * item.value;

      // column widths
      const itemCol = item.name.substring(0, 22).padEnd(22);
      const qtyCol = qty.padStart(7);
      const priceCol = price.padStart(9);
      const totalCol = lineTotal.toFixed(2).padStart(9);

      receipt += `${itemCol}${qtyCol}${priceCol}${totalCol}\n\n`;
    });

    receipt += "------------------------------------------------\n\n";

    // Totals
    receipt += GS + "!" + "\x10";

    receipt += LEFT;

    receipt +=
      "SUBTOTAL".padEnd(13) +
      data.subtotal.toFixed(2).padStart(10) +
      "\n";

    receipt +=
      "DISCOUNT".padEnd(13) +
      data.discountAmount.toFixed(2).padStart(10) +
      "\n";

    receipt +=
      "TOTAL".padEnd(13) + data.total.toFixed(2).padStart(10) + "\n\n";

    receipt += GS + "!" + "\x00";
    receipt += "------------------------------------------------\n\n\n";

    // Footer
    receipt += GS + "!" + "\x01";
    receipt += CENTER;
    receipt += "Thank You!\n";
    receipt += "Come Again\n\n\n\n\n";

    // Cut
    receipt += CUT;

    await qz.print(config, [receipt]);

    console.log("Printed successfully");
  } catch (error) {
    console.error(error);
  }
}
