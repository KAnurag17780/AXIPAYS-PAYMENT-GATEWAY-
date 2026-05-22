import CryptoJS from "crypto-js";

export function generatePaymentHash(
  cardNumber: string,
  email: string
): string {
  const digits = cardNumber.replace(/\D/g, "");
  const first6 = digits.slice(0, 6);
  const last4 = digits.slice(-4);
  const combined = first6 + last4;

  const reversedCard = combined.split("").reverse().join("");
  const reversedEmail = email.split("").reverse().join("");

  const message = (reversedEmail + "AXIPAYS" + reversedCard).toUpperCase();

  const hash = CryptoJS.HmacSHA256(message, "AXI2026")
    .toString(CryptoJS.enc.Hex)
    .toUpperCase();

  return hash;
}
