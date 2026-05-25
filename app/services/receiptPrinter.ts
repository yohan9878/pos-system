import qz, { CreatePrinterInput} from "qz-tray";
import { ReceiptData } from "../types/Receipt";
import { getUserFromToken } from "./userService";

function normalizePrinterName(rawPrinterName: string | CreatePrinterInput) {
  if (Array.isArray(rawPrinterName)) {
    return rawPrinterName[0];
  }
  return rawPrinterName;
}

// Wrap long item names
function wrapText(text: string, width: number) {
  const lines: string[] = [];

  for (let i = 0; i < text.length; i += width) {
    lines.push(text.substring(i, i + width));
  }

  return lines;
}

export async function printReceipt(
  data: ReceiptData,
  rawPrinterName: string | CreatePrinterInput,
) {
  const user = getUserFromToken();
  try {
    // connect to QZ
    if (!qz.websocket.isActive()) {
      await qz.websocket.connect();
    }

    const printerName = normalizePrinterName(rawPrinterName);

    if (!printerName) {
      throw new Error("Printer name is required");
    }

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
    receipt += "\n\n";

    receipt += GS + "!" + "\x10";
    receipt += "WEEHENA FARM SHOP\n";

    receipt += GS + "!" + "\x00";
    receipt += BOLD_OFF;

    receipt += "Katunayake\n";
    receipt += "Tel: 077-1234567\n\n";

    // Invoice
    receipt += "------------------------------------------------\n";
    receipt += LEFT;

    receipt += `Invoice : ${data.invoiceNo}\n`;
    receipt += `Date    : ${date}\n`;
    receipt += `Cashier : ${user?.username}\n`;

    receipt += "------------------------------------------------\n";

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

      const ITEM_WIDTH = 22;

      // Split long item names
      const itemLines = wrapText(item.name, ITEM_WIDTH);

      itemLines.forEach((line, index) => {
        const itemCol = line.padEnd(ITEM_WIDTH);

        // show values only on first line
        const qtyCol = index === 0 ? qty.padStart(7) : "".padStart(7);

        const priceCol = index === 0 ? price.padStart(9) : "".padStart(9);

        const totalCol =
          index === 0 ? lineTotal.toFixed(2).padStart(9) : "".padStart(9);

        receipt += `${itemCol}${qtyCol}${priceCol}${totalCol}\n`;
      });

      receipt += "\n";
    });

    receipt += "------------------------------------------------\n";

    // Totals
    receipt += GS + "!" + "\x10";

    receipt +=
      "SUBTOTAL".padEnd(13) + data.subtotal.toFixed(2).padStart(10) + "\n";

    receipt +=
      "DISCOUNT".padEnd(13) +
      data.discountAmount.toFixed(2).padStart(10) +
      "\n";

    receipt += "TOTAL".padEnd(13) + data.total.toFixed(2).padStart(10) + "\n";

    receipt += GS + "!" + "\x00";

    receipt += "------------------------------------------------\n\n";

    // Footer
    receipt += CENTER;

    receipt += GS + "!" + "\x00";
    receipt += "Thank You! Come Again\n\n";
    receipt += "www.weehena.lk | 0322254209\n\n\n\n";

    // Cut
    receipt += CUT;

    await qz.print(config, [receipt]).catch(function (e) {
      console.error(e);
    });

    console.log("Printed successfully");
  } catch (error) {
    console.error(error);
  }
}
