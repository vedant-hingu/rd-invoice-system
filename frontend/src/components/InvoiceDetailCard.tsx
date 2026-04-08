"use client";

import { Invoice } from "@/types/invoice";

export function InvoiceDetailCard({ invoice }: { invoice: Invoice }) {
  return (
    <article className="card fade-in print:shadow-none print:border-0">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-indigo-700 via-violet-700 to-fuchsia-700 bg-clip-text text-2xl font-semibold text-transparent">
            Invoice #{invoice.id}
          </h1>
          <p className="text-sm text-slate-500">Date: {invoice.invoice_date}</p>
        </div>
        <button onClick={() => window.print()} className="btn-primary print:hidden">
          Download / Print PDF
        </button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
          <h2 className="font-medium">Customer</h2>
          <p>{invoice.customer.name}</p>
          <p>{invoice.customer.email}</p>
          <p>{invoice.customer.phone}</p>
          <p>{invoice.customer.address}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-left md:text-right">
          <p>Status: {invoice.status}</p>
          <p>Tax Rate: {invoice.tax_rate}%</p>
        </div>
      </div>

      <table className="mb-6 min-w-full overflow-hidden rounded-xl border border-indigo-100 text-left text-sm">
        <thead className="bg-indigo-50/80 text-slate-500">
          <tr>
            <th className="px-3 py-2">Item</th>
            <th className="px-3 py-2">Qty</th>
            <th className="px-3 py-2">Price</th>
            <th className="px-3 py-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id} className="row-hover border-t border-slate-100">
              <td className="px-3 py-2">{item.item_name}</td>
              <td className="px-3 py-2">{item.quantity}</td>
              <td className="px-3 py-2">${Number(item.price).toFixed(2)}</td>
              <td className="px-3 py-2">${Number(item.subtotal).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ml-auto w-full max-w-xs space-y-1 rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${Number(invoice.subtotal).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>${Number(invoice.tax_amount).toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold">
          <span>Total</span>
          <span>${Number(invoice.total_amount).toFixed(2)}</span>
        </div>
      </div>
    </article>
  );
}
