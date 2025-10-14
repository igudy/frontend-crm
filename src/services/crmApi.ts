import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const crmApi = createApi({
  reducerPath: "crmApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/",
    prepareHeaders: (headers, { getState }: any) => {
      return headers;
    },
  }),
  tagTypes: ["User", "Customer", "Jobs", "Messages", "Invoice", "Payments"],
  endpoints: (builder) => ({
    // Customer endpoints
    createCustomer: builder.mutation<any, any>({
      query: (customerData) => ({
        url: "customer",
        method: "POST",
        body: customerData,
      }),
      invalidatesTags: ["Customer"],
    }),

    getCustomers: builder.query<any, { limit?: number; page?: number }>({
      query: ({ limit, page } = {}) => ({
        url: "customer",
        params: { limit, page },
      }),
      providesTags: ["Customer"],
    }),

    getCustomer: builder.query<any, string>({
      query: (id) => `customer/${id}`,
      providesTags: ["Customer"],
    }),

    // Jobs endpoints
    createJob: builder.mutation<any, any>({
      query: (jobData) => ({
        url: "jobs",
        method: "POST",
        body: jobData,
      }),
      invalidatesTags: ["Jobs"],
    }),

    getJobs: builder.query<
      any,
      {
        limit?: number;
        page?: number;
        status?:
          | "new"
          | "in_progress"
          | "scheduled"
          | "done"
          | "invoiced"
          | "paid";
      }
    >({
      query: ({ limit, page, status } = {}) => ({
        url: "jobs",
        params: { limit, page, status },
      }),
      providesTags: ["Jobs"],
    }),

    getJob: builder.query<any, string>({
      query: (id) => `jobs/${id}`,
      providesTags: ["Jobs"],
    }),

    updateJobStatus: builder.mutation<
      any,
      {
        id: string;
        status:
          | "new"
          | "in_progress"
          | "scheduled"
          | "done"
          | "invoiced"
          | "paid";
      }
    >({
      query: ({ id, status }) => ({
        url: `jobs/${id}/status?status=${status}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Jobs"],
    }),

    scheduleAppointment: builder.mutation<
      any,
      {
        id: string;
        technician_id: string;
        start_date: string;
        end_date: string;
      }
    >({
      query: ({ id, ...appointmentData }) => ({
        url: `jobs/${id}/schedule-appointment`,
        method: "POST",
        body: appointmentData,
      }),
      invalidatesTags: ["Jobs"],
    }),

    createInvoice: builder.mutation<any, any>({
      query: ({ jobId, ...invoiceData }) => ({
        url: `jobs/${jobId}/invoice`,
        method: "POST",
        body: invoiceData,
      }),
      invalidatesTags: ["Jobs", "Invoice"],
    }),

    // Invoice endpoints
    getInvoices: builder.query<any, { limit?: number; page?: number }>({
      query: ({ limit, page } = {}) => ({
        url: "invoice",
        params: { limit, page },
      }),
      providesTags: ["Invoice"],
    }),

    getInvoice: builder.query<any, string>({
      query: (id) => `invoice/${id}`,
      providesTags: ["Invoice"],
    }),

    createInvoicePayment: builder.mutation<
      any,
      {
        id: string;
        amount: number;
        payment_method: string;
      }
    >({
      query: ({ id, ...paymentData }) => ({
        url: `invoice/${id}/payment`,
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["Invoice", "Payments"],
    }),

    // Payments endpoints
    createPayment: builder.mutation<
      any,
      {
        invoiceId: string;
        amount: number;
        payment_method: string;
      }
    >({
      query: ({ invoiceId, ...paymentData }) => ({
        url: `payments/${invoiceId}`,
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["Payments", "Invoice"],
    }),

    getPayments: builder.query<any, { limit?: number; page?: number }>({
      query: ({ limit, page } = {}) => ({
        url: "payments",
        params: { limit, page },
      }),
      providesTags: ["Payments"],
    }),

    getPayment: builder.query<any, string>({
      query: (id) => `payments/${id}`,
      providesTags: ["Payments"],
    }),

    // Technician endpoint
    getTechnicians: builder.query<any, { limit?: number; page?: number }>({
      query: ({ limit, page } = {}) => ({
        url: "user/all",
        params: { limit, page },
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useCreateCustomerMutation,
  useGetCustomersQuery,
  useGetCustomerQuery,
  useCreateJobMutation,
  useGetJobsQuery,
  useGetJobQuery,
  useUpdateJobStatusMutation,
  useScheduleAppointmentMutation,
  useCreateInvoiceMutation,
  useGetInvoicesQuery,
  useGetInvoiceQuery,
  useCreateInvoicePaymentMutation,
  useCreatePaymentMutation,
  useGetPaymentsQuery,
  useGetPaymentQuery,
  useGetTechniciansQuery,
} = crmApi;
