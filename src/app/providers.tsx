"use client";

import { type ReactNode, useState } from "react";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/ui/Navbar";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 30 * 1000,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <div className="flex-1">{children}</div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#13131f",
            border: "1px solid #1e1e2e",
            color: "#ffffff",
            borderRadius: "12px",
            fontSize: "14px",
          },
        }}
        richColors
        closeButton
      />
    </QueryClientProvider>
  );
}
