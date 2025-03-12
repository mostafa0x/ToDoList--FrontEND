"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const Query = new QueryClient();

export default function ReactQuery({ children }) {
  return (
    <QueryClientProvider client={Query}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
