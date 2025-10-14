import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import StatusTimeline from "../components/StatusTimeline";
import {
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  CreditCard,
  DollarSign,
  FileText,
  Clock,
} from "lucide-react";
import type { Job, JobStatus } from "../types";
import { dummyJobs2 } from "../data";

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
  const [job, setJob] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "details" | "schedule" | "invoice" | "payments"
  >("details");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadJob();
    }
  }, [id]);

  const loadJob = async (): Promise<void> => {
    try {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Use dummy data instead of API call
      const foundJob = dummyJobs2[id as keyof typeof dummyJobs2];
      setJob(foundJob || null);
    } catch (error) {
      console.error("Failed to load job:", error);
      setJob(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (newStatus: JobStatus): Promise<void> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update local state
      if (job) {
        setJob({
          ...job,
          status: newStatus,
        });
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const statusConfig: Record<string, { color: string; bg: string }> = {
    New: { color: "text-blue-700", bg: "bg-blue-50" },
    Scheduled: { color: "text-amber-700", bg: "bg-amber-50" },
    Done: { color: "text-emerald-700", bg: "bg-emerald-50" },
    Invoiced: { color: "text-purple-700", bg: "bg-purple-50" },
    Paid: { color: "text-slate-700", bg: "bg-slate-50" },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Job not found
        </h3>
        <p className="text-slate-600">
          The job you're looking for doesn't exist. ID: {id}
        </p>
      </div>
    );
  }

  const status = statusConfig[job.status] || statusConfig.New;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Jobs
            </button>
          </div>
          <span
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${status.bg} ${status.color}`}
          >
            {job.status}
          </span>
        </div>

        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {job.title}
            </h1>
            <p className="text-slate-600 text-lg">{job.description}</p>
          </div>
        </div>

        <StatusTimeline currentStatus={job.status} />

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-8">
          {job.status === "New" && (
            <button
              onClick={() => setActiveTab("schedule")}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-indigo-700 hover:shadow-md transition-all duration-200"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Technician
            </button>
          )}
          {job.status === "Scheduled" && (
            <button
              onClick={() => updateStatus("Done")}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg shadow-sm hover:from-emerald-700 hover:to-green-700 hover:shadow-md transition-all duration-200"
            >
              <Clock className="w-4 h-4 mr-2" />
              Mark as Completed
            </button>
          )}
          {job.status === "Done" && (
            <button
              onClick={() => setActiveTab("invoice")}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg shadow-sm hover:from-purple-700 hover:to-violet-700 hover:shadow-md transition-all duration-200"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Invoice
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="flex -mb-px">
            {[
              { id: "details", label: "Details", icon: FileText },
              { id: "schedule", label: "Schedule", icon: Calendar },
              { id: "invoice", label: "Invoice", icon: DollarSign },
              { id: "payments", label: "Payments", icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center py-4 px-6 text-sm font-medium border-b-2 transition-all duration-200 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-8">
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

const DetailsTab: React.FC<DetailsTabProps> = ({ job }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-8">
      {/* Customer Info */}
      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-6 pb-2 border-b border-slate-200">
          Customer Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center p-4 bg-slate-50 rounded-lg">
            <User className="w-5 h-5 text-slate-500 mr-4" />
            <div>
              <p className="text-sm text-slate-600">Customer Name</p>
              <p className="font-medium text-slate-900">{job.customer.name}</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-slate-50 rounded-lg">
            <Phone className="w-5 h-5 text-slate-500 mr-4" />
            <div>
              <p className="text-sm text-slate-600">Phone</p>
              <p className="font-medium text-slate-900">{job.customer.phone}</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-slate-50 rounded-lg">
            <Mail className="w-5 h-5 text-slate-500 mr-4" />
            <div>
              <p className="text-sm text-slate-600">Email</p>
              <p className="font-medium text-slate-900">{job.customer.email}</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-slate-50 rounded-lg">
            <MapPin className="w-5 h-5 text-slate-500 mr-4" />
            <div>
              <p className="text-sm text-slate-600">Address</p>
              <p className="font-medium text-slate-900">
                {job.customer.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-6 pb-2 border-b border-slate-200">
          Job Details
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
            <span className="text-slate-600">Title</span>
            <span className="font-medium text-slate-900">{job.title}</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-slate-600 mb-2">Description</p>
            <p className="font-medium text-slate-900">{job.description}</p>
          </div>
          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
            <span className="text-slate-600">Created Date</span>
            <span className="font-medium text-slate-900">
              {formatDate(job.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Appointment */}
      {job.appointment && (
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-6 pb-2 border-b border-slate-200">
            Appointment Details
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-600">Technician</span>
              <span className="font-medium text-slate-900">
                {job.appointment.technician}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-600">Date</span>
              <span className="font-medium text-slate-900">
                {formatDate(job.appointment.startTime)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-600">Time</span>
              <span className="font-medium text-slate-900">
                {formatTime(job.appointment.startTime)} -{" "}
                {formatTime(job.appointment.endTime)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ScheduleTab: React.FC<ScheduleTabProps> = ({ job, onUpdate }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormData>({
    resolver: yupResolver(appointmentSchema),
  });

  const onSubmit = async (data: AppointmentFormData): Promise<void> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Scheduling appointment:", data);

      // In a real app, you would call your API here
      // await api.post<CreateAppointmentData>(`/jobs/${job.id}/appointments`, data);

      onUpdate();
    } catch (error) {
      console.error("Failed to schedule appointment:", error);
      alert("Failed to schedule appointment");
    }
  };

  return (
    <div className="max-w-2xl">
      <h3 className="text-xl font-semibold text-slate-900 mb-6">
        Schedule Appointment
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Technician <span className="text-red-500">*</span>
          </label>
          <select
            {...register("technician")}
            className={`block w-full px-4 py-3 rounded-lg border ${
              errors.technician
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            } shadow-sm transition-all duration-200 focus:ring-2 focus:ring-opacity-20`}
          >
            <option value="">Select a technician</option>
            <option value="Taylor">Taylor</option>
            <option value="Jordan">Jordan</option>
            <option value="Alex">Alex</option>
            <option value="Morgan">Morgan</option>
          </select>
          {errors.technician && (
            <p className="text-sm text-red-600 flex items-center mt-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
              {errors.technician.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              {...register("startTime")}
              className={`block w-full px-4 py-3 rounded-lg border ${
                errors.startTime
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              } shadow-sm transition-all duration-200 focus:ring-2 focus:ring-opacity-20`}
            />
            {errors.startTime && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                {errors.startTime.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              {...register("endTime")}
              className={`block w-full px-4 py-3 rounded-lg border ${
                errors.endTime
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              } shadow-sm transition-all duration-200 focus:ring-2 focus:ring-opacity-20`}
            />
            {errors.endTime && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                {errors.endTime.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-indigo-700 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Scheduling...
            </>
          ) : (
            <>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Appointment
            </>
          )}
        </button>
      </form>
    </div>
  );
};

const InvoiceTab: React.FC<InvoiceTabProps> = ({ job, onUpdate }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    //   } = useForm<InvoiceFormData>({
  } = useForm({
    resolver: yupResolver(invoiceSchema),
    defaultValues: {
      lineItems: [{ description: "", quantity: 1, unitPrice: 0 }],
      taxRate: 8.5,
    },
  });

  const onSubmit = async (data: any): Promise<void> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Generating invoice:", data);

      // In a real app, you would call your API here
      // await api.post<CreateInvoiceData>(`/jobs/${job.id}/invoice`, data);

      onUpdate();
    } catch (error) {
      console.error("Failed to create invoice:", error);
      alert("Failed to create invoice");
    }
  };

  if (job.invoice) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-900">
          Invoice Details
        </h3>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-purple-200">
              <span className="text-slate-700">Subtotal:</span>
              <span className="text-lg font-semibold text-slate-900">
                ${job.invoice.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-purple-200">
              <span className="text-slate-700">
                Tax ({job.invoice.taxRate}%):
              </span>
              <span className="text-lg font-semibold text-slate-900">
                ${job.invoice.tax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-xl font-bold text-slate-900">Total:</span>
              <span className="text-2xl font-bold text-purple-600">
                ${job.invoice.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {job.invoice.lineItems && (
          <div>
            <h4 className="text-lg font-medium text-slate-900 mb-4">
              Line Items
            </h4>
            <div className="space-y-3">
              {job.invoice.lineItems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {item.description}
                    </p>
                    <p className="text-sm text-slate-600">
                      {item.quantity} × ${item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <span className="font-semibold text-slate-900">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h3 className="text-xl font-semibold text-slate-900 mb-6">
        Generate Invoice
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Tax Rate (%) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            {...register("taxRate")}
            className={`block w-full px-4 py-3 rounded-lg border ${
              errors.taxRate
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-slate-300 focus:border-purple-500 focus:ring-purple-500"
            } shadow-sm transition-all duration-200 focus:ring-2 focus:ring-opacity-20`}
          />
          {errors.taxRate && (
            <p className="text-sm text-red-600 flex items-center mt-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
              {errors.taxRate.message}
            </p>
          )}
        </div>

        <div>
          <h4 className="text-lg font-medium text-slate-900 mb-4">
            Line Items
          </h4>
          <div className="space-y-4">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start"
              >
                <div className="md:col-span-6 space-y-2">
                  <input
                    type="text"
                    placeholder="Item description"
                    {...register(`lineItems.${index}.description`)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-all duration-200"
                  />
                </div>
                <div className="md:col-span-3 space-y-2">
                  <input
                    type="number"
                    placeholder="Quantity"
                    {...register(`lineItems.${index}.quantity`)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-all duration-200"
                  />
                </div>
                <div className="md:col-span-3 space-y-2">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Unit Price"
                    {...register(`lineItems.${index}.unitPrice`)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-all duration-200"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg shadow-sm hover:from-purple-700 hover:to-violet-700 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Generating...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Generate Invoice
            </>
          )}
        </button>
      </form>
    </div>
  );
};

const PaymentsTab: React.FC<PaymentsTabProps> = ({ job, onUpdate }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    //   } = useForm<PaymentFormData>({/
  } = useForm({
    resolver: yupResolver(paymentSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      if (!job.invoice) return;

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Recording payment:", data);

      // In a real app, you would call your API here
      // await api.post(`/invoices/${job.invoice.id}/payments`, data);

      onUpdate();
    } catch (error) {
      console.error("Failed to record payment:", error);
      alert("Failed to record payment");
    }
  };

  if (!job.invoice) {
    return (
      <div className="text-center py-8">
        <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          No Invoice Generated
        </h3>
        <p className="text-slate-600">
          Generate an invoice first to record payments.
        </p>
      </div>
    );
  }

  const remainingBalance =
    job.invoice.total -
    (job.invoice.payments?.reduce((sum, payment) => sum + payment.amount, 0) ||
      0);

  return (
    <div className="space-y-6">
      {/* Invoice Summary */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Invoice Summary
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-emerald-200">
            <span className="text-slate-700">Total Amount:</span>
            <span className="text-lg font-semibold text-slate-900">
              ${job.invoice.total.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-emerald-200">
            <span className="text-slate-700">Paid:</span>
            <span className="text-lg font-semibold text-slate-900">
              ${(job.invoice.total - remainingBalance).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-xl font-bold text-slate-900">
              Remaining Balance:
            </span>
            <span
              className={`text-2xl font-bold ${
                remainingBalance > 0 ? "text-amber-600" : "text-emerald-600"
              }`}
            >
              ${remainingBalance.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      {remainingBalance > 0 && (
        <div className="max-w-md">
          <h4 className="text-lg font-medium text-slate-900 mb-4">
            Record Payment
          </h4>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                max={remainingBalance}
                {...register("amount")}
                className={`block w-full px-4 py-3 rounded-lg border ${
                  errors.amount
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                } shadow-sm transition-all duration-200 focus:ring-2 focus:ring-opacity-20`}
              />
              {errors.amount && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <select
                {...register("method")}
                className={`block w-full px-4 py-3 rounded-lg border ${
                  errors.method
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                } shadow-sm transition-all duration-200 focus:ring-2 focus:ring-opacity-20`}
              >
                <option value="">Select method</option>
                <option value="credit_card">Credit Card</option>
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
              {errors.method && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                  {errors.method.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg shadow-sm hover:from-emerald-700 hover:to-green-700 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Record Payment
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Payment History */}
      {job.invoice.payments && job.invoice.payments.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-slate-900 mb-4">
            Payment History
          </h4>
          <div className="space-y-3">
            {job.invoice.payments.map((payment, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 bg-slate-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    ${payment.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-slate-600 capitalize">
                    {payment.method.replace("_", " ")}
                  </p>
                </div>
                <span className="text-slate-500">
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
