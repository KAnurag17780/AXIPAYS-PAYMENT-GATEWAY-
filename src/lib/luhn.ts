export function validateLuhn(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "");

  if (digits.length < 13 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  let isDoubled = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isDoubled) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isDoubled = !isDoubled;
  }

  return sum % 10 === 0;
}

export function extractDigits(cardNumber: string): string {
  return cardNumber.replace(/\D/g, "");
}

export function formatCardInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join(" ") : "";
}

export function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 10) return digits;

  const first6 = digits.substring(0, 6);
  const last4 = digits.substring(digits.length - 4);
  const masked = "••••••".slice(0, digits.length - 10) || "••";
  return `${first6}${masked}${last4}`;
}

export function detectCardBrand(
  cardNumber: string
): "visa" | "mastercard" | "amex" | "unknown" {
  const digits = cardNumber.replace(/\D/g, "");
  if (!digits) return "unknown";

  if (digits.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";

  return "unknown";
}
