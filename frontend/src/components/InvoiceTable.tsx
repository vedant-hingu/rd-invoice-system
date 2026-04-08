"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Invoice } from "@/types/invoice";

type SortKey = "invoice_date" | "customer_name" | "total_amount";

export function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  const [filter, setFilter] = useState("");
  const [date, setDate] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("invoice_date");

  const rows = useMemo(() => {
    const filtered = invoices.filter((invoice) => {
      const byName = invoice.customer.name.toLowerCase().includes(filter.toLowerCase());
      const byDate = date ? invoice.invoice_date === date : true;
      return byName && byDate;
    });

    return filtered.sort((a, b) => {
      if (sortKey === "customer_name") return a.customer.name.localeCompare(b.customer.name);
      if (sortKey === "total_amount") return Number(b.total_amount) - Number(a.total_amount);
      return new Date(b.invoice_date).getTime() - new Date(a.invoice_date).getTime();
    });
  }, [invoices, filter, date, sortKey]);

  if (!invoices.length) return <p className="card text-sm text-slate-500">No invoices yet.</p>;

  return (
    <section className="card">
      <div className="mb-4 grid gap-2 md:grid-cols-3">
        <input
          className="input"
          placeholder="Filter by customer name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        <select className="input" value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}>
          <option value="invoice_date">Sort by date</option>
          <option value="customer_name">Sort by customer</option>
          <option value="total_amount">Sort by total</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="pb-3">Invoice ID</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Total</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((invoice) => (
              <tr key={invoice.id} className="border-t border-slate-100">
                <td className="py-3">
                  <Link href={`/invoices/${invoice.id}`} className="text-blue-600 hover:underline">
                    #{invoice.id}
                  </Link>
                </td>
                <td className="py-3">{invoice.customer.name}</td>
                <td className="py-3">{invoice.invoice_date}</td>
                <td className="py-3">${Number(invoice.total_amount).toFixed(2)}</td>
                <td className="py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      invoice.status === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
