import {
  useCreatePaymentMutation,
  useGetInvoiceQuery,
} from "../../services/crmApi";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { CreditCard } from "lucide-react";
import React from "react";

const paymentSchema = yup.object({
  amount: yup
    .number()
    .required("Amount is required")
    .positive("Must be positive"),
  payment_method: yup.string().required("Payment method is required"),
});

type PaymentFormData = yup.InferType<typeof paymentSchema>;

interface PaymentsTabProps {
  job: any;
  onUpdate: () => void;
}

const PaymentsTab: React.FC<PaymentsTabProps> = ({ job, onUpdate }) => {
  const [createPayment, { isLoading: isCreatingPayment }] =
    useCreatePaymentMutation();

  // Get invoice ID from localStorage or job
  const invoiceId = React.useMemo(() => {
    return job.invoice?._id || localStorage.getItem(`invoice_${job._id}`);
  }, [job]);

  // Fetch invoice data using the invoice ID
  const { data: invoiceResponse, isLoading: isLoadingInvoice } =
    useGetInvoiceQuery(invoiceId!, {
      skip: !invoiceId,
    });

  const invoice = invoiceResponse?.data || invoiceResponse;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: yupResolver(paymentSchema),
  });

  React.useEffect(() => {
    console.log("Job data in PaymentsTab:", job);
    console.log("Invoice ID:", invoiceId);
    console.log("Fetched invoice:", invoice);
    console.log("Job status:", job?.status);
  }, [job, invoiceId, invoice]);

  const onSubmit = async (data: PaymentFormData) => {
    if (!invoiceId) {
      toast.error("No invoice found for this job");
      return;
    }

    try {
      console.log("Submitting payment:", {
        invoiceId: invoiceId,
        ...data,
      });

      await createPayment({
        invoiceId: invoiceId,
        ...data,
      }).unwrap();

      toast.success("Payment recorded successfully!");
      onUpdate();
    } catch (error: any) {
      console.error("Payment error:", error);
      const errorMessage = error?.data?.message || "Failed to record payment";
      toast.error(errorMessage);
    }
  };

  // Check if we have invoice data
  const hasInvoice = invoice && invoice._id;

  if (!hasInvoice) {
    if (isLoadingInvoice) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading invoice data...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center py-8">
        <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          No Invoice Generated
        </h3>
        <p className="text-slate-600 mb-4">
          Generate an invoice first to record payments.
        </p>
        <div className="text-sm text-slate-500">
          <p>
            Current job status: <strong>{job.status}</strong>
          </p>
          <p>Job ID: {job._id}</p>
          <p>Invoice ID: {invoiceId || "Not found"}</p>
        </div>
      </div>
    );
  }

  const remainingBalance =
    invoice.total -
    (invoice.payments?.reduce(
      (sum: number, payment: any) => sum + payment.amount,
      0
    ) || 0);

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
              ${invoice.total?.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-emerald-200">
            <span className="text-slate-700">Paid:</span>
            <span className="text-lg font-semibold text-slate-900">
              ${(invoice.total - remainingBalance).toFixed(2)}
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
                {...register("amount", { valueAsNumber: true })}
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
                {...register("payment_method")}
                className={`block w-full px-4 py-3 rounded-lg border ${
                  errors.payment_method
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
              {errors.payment_method && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                  {errors.payment_method.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isCreatingPayment}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg shadow-sm hover:from-emerald-700 hover:to-green-700 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreatingPayment ? (
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
      {invoice.payments && invoice.payments.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-slate-900 mb-4">
            Payment History
          </h4>
          <div className="space-y-3">
            {invoice.payments.map((payment: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 bg-slate-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    ${payment.amount?.toFixed(2)}
                  </p>
                  <p className="text-sm text-slate-600 capitalize">
                    {payment.payment_method?.replace("_", " ")}
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

export default PaymentsTab;
