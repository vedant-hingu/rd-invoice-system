export type InvoiceStatus = "Pending" | "Paid";

export interface Customer {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface InvoiceItem {
  id?: number;
  item_name: string;
  quantity: number;
  price: string;
  subtotal?: string;
}

export interface Invoice {
  id: number;
  customer: Customer;
  invoice_date: string;
  tax_rate: string;
  subtotal: string;
  tax_amount: string;
  total_amount: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  created_at: string;
}

export interface CreateInvoicePayload {
  customer: Customer;
  items: InvoiceItem[];
  tax_rate?: string;
  status: InvoiceStatus;
}
