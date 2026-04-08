"use client";

import { useState } from "react";

import { CreateInvoicePayload, Invoice, InvoiceItem, InvoiceStatus } from "@/types/invoice";

type Props = {
  onSubmit: (payload: CreateInvoicePayload) => Promise<Invoice>;
  onCreated: (invoice: Invoice) => void;
};

const defaultItem: InvoiceItem = { item_name: "", quantity: 1, price: "0.00" };

export function InvoiceForm({ onSubmit, onCreated }: Props) {
  const [form, setForm] = useState<CreateInvoicePayload>({
    customer: { name: "", email: "", phone: "", address: "" },
    items: [{ ...defaultItem }],
    tax_rate: "18.00",
    status: "Pending",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateItem = (idx: number, patch: Partial<InvoiceItem>) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === idx ? { ...item, ...patch } : item)),
    }));
  };

  const addItem = () => {
    setForm((prev) => ({ ...prev, items: [...prev.items, { ...defaultItem }] }));
  };

  const removeItem = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  const validate = () => {
    if (!form.customer.name || !form.customer.email || !form.customer.phone || !form.customer.address) {
      return "Please complete all customer fields.";
    }
    if (form.items.length === 0) return "At least one item is required.";
    if (form.items.some((i) => !i.item_name || i.quantity < 1 || Number(i.price) <= 0)) {
      return "Each item requires name, quantity >= 1 and price > 0.";
    }
    return null;
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const invoice = await onSubmit(form);
      onCreated(invoice);
      setForm({
        customer: { name: "", email: "", phone: "", address: "" },
        items: [{ ...defaultItem }],
        tax_rate: "18.00",
        status: "Pending",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create invoice.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">Create Invoice</h2>
        <p className="text-sm text-slate-500">Line totals, tax, and invoice total are computed on the backend.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {["name", "email", "phone", "address"].map((field) => (
          <input
            key={field}
            className="input md:first:col-span-2"
            placeholder={`Customer ${field}`}
            value={form.customer[field as keyof typeof form.customer]}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                customer: { ...prev.customer, [field]: e.target.value },
              }))
            }
          />
        ))}
      </div>

      <div className="space-y-3">
        {form.items.map((item, idx) => (
          <div key={idx} className="grid gap-2 rounded-xl border border-slate-100 bg-slate-50/70 p-2 transition hover:border-indigo-100 hover:bg-indigo-50/50 md:grid-cols-12">
            <input
              className="input md:col-span-5"
              placeholder="Item name"
              value={item.item_name}
              onChange={(e) => updateItem(idx, { item_name: e.target.value })}
            />
            <input
              type="number"
              min={1}
              className="input md:col-span-2"
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })}
            />
            <input
              type="number"
              min="0.01"
              step="0.01"
              className="input md:col-span-3"
              placeholder="Price"
              value={item.price}
              onChange={(e) => updateItem(idx, { price: e.target.value })}
            />
            <button
              type="button"
              onClick={() => removeItem(idx)}
              disabled={form.items.length === 1}
              className="md:col-span-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addItem} className="btn-soft">
          + Add Item
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <input
          type="number"
          min="0"
          step="0.01"
          className="input"
          placeholder="Tax rate"
          value={form.tax_rate}
          onChange={(e) => setForm((prev) => ({ ...prev, tax_rate: e.target.value }))}
        />
        <select
          className="input"
          value={form.status}
          onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as InvoiceStatus }))}
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </select>
      </div>

      {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      <button className="btn-primary w-full" disabled={submitting}>
        {submitting ? "Creating..." : "Create Invoice"}
      </button>
    </form>
  );
}
