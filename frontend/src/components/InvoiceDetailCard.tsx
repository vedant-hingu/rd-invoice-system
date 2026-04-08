"use client";

import { Invoice } from "@/types/invoice";

export function InvoiceDetailCard({ invoice }: { invoice: Invoice }) {
  return (
    <article className="card print:shadow-none print:border-0">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Invoice #{invoice.id}</h1>
          <p className="text-sm text-slate-500">Date: {invoice.invoice_date}</p>
        </div>
        <button onClick={() => window.print()} className="btn-primary print:hidden">
          Download / Print PDF
        </button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div>
          <h2 className="font-medium">Customer</h2>
          <p>{invoice.customer.name}</p>
          <p>{invoice.customer.email}</p>
          <p>{invoice.customer.phone}</p>
          <p>{invoice.customer.address}</p>
        </div>
        <div className="text-left md:text-right">
          <p>Status: {invoice.status}</p>
          <p>Tax Rate: {invoice.tax_rate}%</p>
        </div>
      </div>

      <table className="mb-6 min-w-full text-left text-sm">
        <thead className="text-slate-500">
          <tr>
            <th className="pb-2">Item</th>
            <th className="pb-2">Qty</th>
            <th className="pb-2">Price</th>
            <th className="pb-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id} className="border-t border-slate-100">
              <td className="py-2">{item.item_name}</td>
              <td className="py-2">{item.quantity}</td>
              <td className="py-2">${Number(item.price).toFixed(2)}</td>
              <td className="py-2">${Number(item.subtotal).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ml-auto w-full max-w-xs space-y-1 text-sm">
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
