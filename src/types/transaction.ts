export type TransactionStatus = "success" | "failed" | "pending";

export interface Transaction {
  _id?: string;
  orderId: string;
  cardNumber: string;
  email: string;
  expiryMonth: string;
  expiryYear: string;
  cardCVC: string;
  amount: number;
  currency: string;
  country: string;
  cardHolderName: string;
  address: string;
  phone: string;
  status: TransactionStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface TransactionsResponse {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
  message: string;
  status: string;
}

export interface DashboardSummary {
  totalTransactions: number;
  successVolume: number;
  successCount: number;
  failedCount: number;
}

export interface StatusChartData {
  name: string;
  value: number;
  color: string;
}

export interface VolumeOverTimeData {
  date: string;
  volume: number;
  count: number;
}

export interface CurrencyDistributionData {
  currency: string;
  value: number;
  color: string;
}
