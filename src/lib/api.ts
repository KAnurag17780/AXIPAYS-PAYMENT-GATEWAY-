import axios from "axios";
import type { PaymentPayload, PaymentResponse } from "@/types/payment";
import type { TransactionsResponse } from "@/types/transaction";
import { generatePaymentHash } from "./hash";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://payment-assignment.onrender.com";

// Helpful runtime notice for deployments (e.g., Vercel): if the env var
// isn't explicitly set in the environment, warn so deploys don't silently use
// the public default backend which might be unreachable or blocked by CORS.
if (typeof window !== "undefined") {
  if (process.env.NEXT_PUBLIC_API_BASE_URL === undefined) {
    // eslint-disable-next-line no-console
    console.warn(
      "NEXT_PUBLIC_API_BASE_URL is not set — using the default API base URL. Configure this in your Vercel environment variables if needed."
    );
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log response details to aid debugging (status, data)
    // eslint-disable-next-line no-console
    console.error("API response error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

export async function initiatePayment(
  payload: PaymentPayload
): Promise<PaymentResponse> {
  const rawCard = payload.cardNumber.replace(/\s/g, "");
  const hash = generatePaymentHash(rawCard, payload.email);

  const response = await apiClient.post<PaymentResponse>(
    "/initiate-payment",
    // include both `cardCVC` and `cvv` to match different backend expectations
    {
      orderId: payload.orderId,
      cardHolderName: payload.cardHolderName,
      email: payload.email,
      cardNumber: rawCard,
      expiryMonth: payload.expiryMonth,
      expiryYear: payload.expiryYear,
      cardCVC: payload.cvv,
      cvv: payload.cvv,
      amount: payload.amount,
      currency: payload.currency,
      country: payload.country,
      address: payload.address,
      phone: payload.phone,
    },
    {
      headers: {
        Hash: hash,
      },
    }
  );

  return response.data;
}

export async function getTransactions(
  page: number = 1,
  limit: number = 100
): Promise<TransactionsResponse> {
  const response = await apiClient.get<TransactionsResponse>("/transactions", {
    params: { page, limit },
  });
  return response.data;
}
