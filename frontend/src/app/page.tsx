"use client";

import { useEffect, useState } from "react";

import { InvoiceForm } from "@/components/InvoiceForm";
import { InvoiceTable } from "@/components/InvoiceTable";
import { createInvoice, getInvoices } from "@/lib/api";
import { Invoice } from "@/types/invoice";

export default function Home() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await getInvoices();
      setInvoices(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load invoices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadInvoices();
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-6">
      <header className="fade-in rounded-2xl border border-indigo-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
        <h1 className="bg-gradient-to-r from-indigo-700 via-violet-700 to-fuchsia-700 bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
          Simple Invoice System
        </h1>
        <p className="mt-2 text-slate-600">Modern invoice flow with backend-computed totals via Django REST API.</p>
      </header>
      <section className="grid gap-6 lg:grid-cols-5">
        <div className="fade-in lg:col-span-2">
          <InvoiceForm
            onSubmit={createInvoice}
            onCreated={(invoice) => {
              setInvoices((prev) => [invoice, ...prev]);
            }}
          />
        </div>
        <div className="fade-in lg:col-span-3 space-y-3">
          <h2 className="text-lg font-semibold text-slate-800">Invoices</h2>
          {loading ? <p className="card text-sm text-slate-500">Loading invoices...</p> : null}
          {error ? <p className="card border-red-200 text-sm text-red-600">{error}</p> : null}
          {!loading && !error ? <InvoiceTable invoices={invoices} /> : null}
        </div>
      </section>
    </main>
  );
}
