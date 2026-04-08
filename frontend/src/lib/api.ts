import { CreateInvoicePayload, Invoice } from "@/types/invoice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const fallback = `Request failed with status ${response.status}`;
    try {
      const data = (await response.json()) as { detail?: string };
      throw new Error(data.detail ?? fallback);
    } catch {
      throw new Error(fallback);
    }
  }

  return (await response.json()) as T;
}

export function getInvoices() {
  return request<Invoice[]>("/invoices/");
}

export function getInvoice(id: string | number) {
  return request<Invoice>(`/invoices/${id}/`);
}

export function createInvoice(payload: CreateInvoicePayload) {
  return request<Invoice>("/invoices/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
