export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  jobId: string;
  technician: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  jobId: string;
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  lineItems: InvoiceLineItem[];
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}

export type JobStatus = "New" | "Scheduled" | "Done" | "Invoiced" | "Paid";

export interface Job {
  id: string;
  title: string;
  description: string;
  status: JobStatus;
  customerId: string;
  customer: Customer;
  appointment?: Appointment;
  invoice?: Invoice;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface CreateJobData {
  title: string;
  description: string;
  customerId: string;
}

export interface CreateAppointmentData {
  technician: string;
  startTime: string;
  endTime: string;
}

export interface CreateInvoiceData {
  lineItems: InvoiceLineItem[];
  taxRate: number;
}

export interface CreatePaymentData {
  amount: number;
  method: string;
}

export interface UpdateJobStatusData {
  status: JobStatus;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
