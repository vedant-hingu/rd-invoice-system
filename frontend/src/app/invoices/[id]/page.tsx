"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { InvoiceDetailCard } from "@/components/InvoiceDetailCard";
import { getInvoice } from "@/lib/api";
import { Invoice } from "@/types/invoice";

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const data = await getInvoice(id);
        setInvoice(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load invoice.");
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [id]);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="mb-4">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Back to invoices
        </Link>
      </div>
      {loading ? <p className="card text-sm text-slate-500">Loading invoice...</p> : null}
      {error ? <p className="card text-sm text-red-600">{error}</p> : null}
      {invoice ? <InvoiceDetailCard invoice={invoice} /> : null}
    </main>
  );
}
