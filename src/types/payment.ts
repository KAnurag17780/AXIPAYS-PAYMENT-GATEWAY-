export interface PaymentPayload {
  orderId: string;
  cardHolderName: string;
  email: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  amount: number;
  currency: string;
  country: string;
  address: string;
  phone: string;
}

export interface PaymentResponse {
  redirect_url?: string;
  redirection_url?: string;
  status?: string;
  message?: string;
}

export type PaymentStatusType = "success" | "failed" | "pending" | null;
