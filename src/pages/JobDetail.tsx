import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import StatusTimeline from "../components/StatusTimeline";
import { api } from "../lib/api";
import { Calendar, User, MapPin, Phone, Mail } from "lucide-react";
import type {
  CreateAppointmentData,
  CreateInvoiceData,
  Job,
  JobStatus,
} from "../types";

const appointmentSchema = yup.object({
  technician: yup.string().required("Technician is required"),
  startTime: yup.string().required("Start time is required"),
  endTime: yup
    .string()
    .required("End time is required")
    .test(
      "is-after-start",
      "End time must be after start time",
      function (value) {
        const { startTime } = this.parent;
        return !startTime || !value || new Date(value) > new Date(startTime);
      }
    ),
});

const invoiceLineItemSchema = yup.object({
  description: yup.string().required("Description is required"),
  quantity: yup
    .number()
    .required("Quantity is required")
    .positive("Must be positive"),
  unitPrice: yup
    .number()
    .required("Unit price is required")
    .positive("Must be positive"),
});

const invoiceSchema = yup.object({
  lineItems: yup.array().of(invoiceLineItemSchema),
  taxRate: yup.number().required("Tax rate is required").min(0).max(100),
});

const paymentSchema = yup.object({
  amount: yup
    .number()
    .required("Amount is required")
    .positive("Must be positive"),
  method: yup.string().required("Payment method is required"),
});

type AppointmentFormData = yup.InferType<typeof appointmentSchema>;
type InvoiceFormData = yup.InferType<typeof invoiceSchema>;
type PaymentFormData = yup.InferType<typeof paymentSchema>;

interface DetailsTabProps {
  job: Job;
}

interface ScheduleTabProps {
  job: Job;
  onUpdate: () => void;
}

interface InvoiceTabProps {
  job: Job;
  onUpdate: () => void;
}

interface PaymentsTabProps {
  job: Job;
  onUpdate: () => void;
}

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [activeTab, setActiveTab] = useState<
    "details" | "schedule" | "invoice" | "payments"
  >("details");

  useEffect(() => {
    if (id) {
      loadJob();
    }
  }, [id]);

  const loadJob = async (): Promise<void> => {
    try {
      const response = await api.get<Job>(`/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      console.error("Failed to load job:", error);
    }
  };

  const updateStatus = async (newStatus: JobStatus): Promise<void> => {
    try {
      await api.patch(`/jobs/${id}/status`, { status: newStatus });
      loadJob();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-600 mt-1">{job.description}</p>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              job.status === "New"
                ? "bg-blue-100 text-blue-800"
                : job.status === "Scheduled"
                ? "bg-yellow-100 text-yellow-800"
                : job.status === "Done"
                ? "bg-green-100 text-green-800"
                : job.status === "Invoiced"
                ? "bg-purple-100 text-purple-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {job.status}
          </span>
        </div>

        <StatusTimeline currentStatus={job.status} />

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          {job.status === "New" && (
            <button
              onClick={() => setActiveTab("schedule")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Schedule Technician
            </button>
          )}
          {job.status === "Scheduled" && (
            <button
              onClick={() => updateStatus("Done")}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Mark as Completed
            </button>
          )}
          {job.status === "Done" && (
            <button
              onClick={() => setActiveTab("invoice")}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
            >
              Generate Invoice
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {["details", "schedule", "invoice", "payments"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "details" && <DetailsTab job={job} />}
          {activeTab === "schedule" && (
            <ScheduleTab job={job} onUpdate={loadJob} />
          )}
          {activeTab === "invoice" && (
            <InvoiceTab job={job} onUpdate={loadJob} />
          )}
          {activeTab === "payments" && (
            <PaymentsTab job={job} onUpdate={loadJob} />
          )}
        </div>
      </div>
    </div>
  );
};

const DetailsTab: React.FC<DetailsTabProps> = ({ job }) => (
  <div className="space-y-6">
    {/* Customer Info */}
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Customer Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center">
          <User className="w-5 h-5 text-gray-400 mr-3" />
          <span>{job.customer.name}</span>
        </div>
        <div className="flex items-center">
          <Phone className="w-5 h-5 text-gray-400 mr-3" />
          <span>{job.customer.phone}</span>
        </div>
        <div className="flex items-center">
          <Mail className="w-5 h-5 text-gray-400 mr-3" />
          <span>{job.customer.email}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="w-5 h-5 text-gray-400 mr-3" />
          <span>{job.customer.address}</span>
        </div>
      </div>
    </div>

    {/* Job Details */}
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Job Details</h3>
      <div className="space-y-2">
        <div>
          <strong>Title:</strong> {job.title}
        </div>
        <div>
          <strong>Description:</strong> {job.description}
        </div>
        <div>
          <strong>Created:</strong>{" "}
          {new Date(job.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>

    {/* Appointment */}
    {job.appointment && (
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Appointment</h3>
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <span>
            {new Date(job.appointment.startTime).toLocaleDateString()} •
            {new Date(job.appointment.startTime).toLocaleTimeString()} -
            {new Date(job.appointment.endTime).toLocaleTimeString()}
          </span>
        </div>
        <div className="mt-2">
          <strong>Technician:</strong> {job.appointment.technician}
        </div>
      </div>
    )}
  </div>
);

const ScheduleTab: React.FC<ScheduleTabProps> = ({ job, onUpdate }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: yupResolver(appointmentSchema),
  });

  const onSubmit = async (data: AppointmentFormData): Promise<void> => {
    try {
      await api.post<CreateAppointmentData>(
        `/jobs/${job.id}/appointments`,
        data
      );
      onUpdate();
    } catch (error) {
      console.error("Failed to schedule appointment:", error);
      alert(error.response?.data?.message || "Failed to schedule appointment");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Technician
        </label>
        <select
          {...register("technician")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a technician</option>
          <option value="Taylor">Taylor</option>
        </select>
        {errors.technician && (
          <p className="mt-1 text-sm text-red-600">
            {errors.technician.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Start Time
        </label>
        <input
          type="datetime-local"
          {...register("startTime")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.startTime && (
          <p className="mt-1 text-sm text-red-600">
            {errors.startTime.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          End Time
        </label>
        <input
          type="datetime-local"
          {...register("endTime")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.endTime && (
          <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Schedule Appointment
      </button>
    </form>
  );
};

const InvoiceTab: React.FC<InvoiceTabProps> = ({ job, onUpdate }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: yupResolver(invoiceSchema),
    defaultValues: {
      lineItems: [{ description: "", quantity: 1, unitPrice: 0 }],
      taxRate: 8.5,
    },
  });

  const onSubmit = async (data: InvoiceFormData): Promise<void> => {
    try {
      await api.post<CreateInvoiceData>(`/jobs/${job.id}/invoice`, data);
      onUpdate();
    } catch (error) {
      console.error("Failed to create invoice:", error);
      alert(error.response?.data?.message || "Failed to create invoice");
    }
  };

  if (job.invoice) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Invoice Details
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${job.invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({job.invoice.taxRate}%):</span>
              <span>${job.invoice.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${job.invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {job.invoice.lineItems && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Line Items</h4>
            {job.invoice.lineItems.map((item, index) => (
              <div key={index} className="flex justify-between py-2 border-b">
                <span>{item.description}</span>
                <span>${(item.quantity * item.unitPrice).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tax Rate (%)
        </label>
        <input
          type="number"
          step="0.01"
          {...register("taxRate")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.taxRate && (
          <p className="mt-1 text-sm text-red-600">{errors.taxRate.message}</p>
        )}
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-2">Line Items</h4>
        <div className="space-y-4">
          {[0, 1, 2].map((index) => (
            <div key={index} className="flex space-x-4">
              <input
                type="text"
                placeholder="Description"
                {...register(`lineItems.${index}.description`)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Qty"
                {...register(`lineItems.${index}.quantity`)}
                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                {...register(`lineItems.${index}.unitPrice`)}
                className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
      >
        Generate Invoice
      </button>
    </form>
  );
};

const PaymentsTab: React.FC<PaymentsTabProps> = ({ job, onUpdate }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: yupResolver(paymentSchema),
  });

  const onSubmit = async (data: PaymentFormData): Promise<void> => {
    try {
      if (!job.invoice) return;
      await api.post<CreatePaymentData>(
        `/invoices/${job.invoice.id}/payments`,
        data
      );
      onUpdate();
    } catch (error) {
      console.error("Failed to record payment:", error);
      alert(error.response?.data?.message || "Failed to record payment");
    }
  };

  if (!job.invoice) {
    return <div>No invoice generated yet.</div>;
  }

  const remainingBalance =
    job.invoice.total -
    (job.invoice.payments?.reduce((sum, payment) => sum + payment.amount, 0) ||
      0);

  return (
    <div className="space-y-6">
      {/* Invoice Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Invoice Summary
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total Amount:</span>
            <span>${job.invoice.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Paid:</span>
            <span>${(job.invoice.total - remainingBalance).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Remaining Balance:</span>
            <span>${remainingBalance.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      {remainingBalance > 0 && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              max={remainingBalance}
              {...register("amount")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              {...register("method")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select method</option>
              <option value="credit_card">Credit Card</option>
              <option value="cash">Cash</option>
              <option value="check">Check</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
            {errors.method && (
              <p className="mt-1 text-sm text-red-600">
                {errors.method.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Record Payment
          </button>
        </form>
      )}

      {/* Payment History */}
      {job.invoice.payments && job.invoice.payments.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Payment History</h4>
          <div className="space-y-2">
            {job.invoice.payments.map((payment, index) => (
              <div key={index} className="flex justify-between py-2 border-b">
                <div>
                  <span className="font-medium">
                    ${payment.amount.toFixed(2)}
                  </span>
                  <span className="text-gray-600 ml-2">
                    via {payment.method}
                  </span>
                </div>
                <span className="text-gray-500">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
