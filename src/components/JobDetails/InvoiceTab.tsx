import { FileText } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useCreateInvoiceMutation,
  useGetInvoiceQuery,
} from "../../services/crmApi";
import { useForm, useFieldArray } from "react-hook-form";

interface InvoiceTabProps {
  job: any;
  onUpdate: () => void;
}

const invoiceLineItemSchema = yup.object({
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Must be positive"),
  quantity: yup
    .number()
    .typeError("Quantity must be a number")
    .required("Quantity is required")
    .positive("Must be positive"),
});

const invoiceSchema = yup.object({
  items: yup
    .array()
    .of(invoiceLineItemSchema)
    .min(1, "At least one line item is required"),
  tax: yup
    .number()
    .typeError("Tax must be a number")
    .required("Tax is required")
    .min(0, "Tax cannot be negative"),
  subTotal: yup.number().required("Subtotal is required").min(0),
  total: yup.number().required("Total is required").min(0),
});

type InvoiceFormData = yup.InferType<typeof invoiceSchema>;

const InvoiceTab: React.FC<InvoiceTabProps> = ({ job, onUpdate }) => {
  const [createInvoice, { isLoading: isCreatingInvoice }] =
    useCreateInvoiceMutation();

  // Store the created invoice ID
  const [createdInvoiceId, setCreatedInvoiceId] = useState<string | null>(null);

  // Fetch the invoice data if we have an invoice ID
  const { data: invoiceResponse } = useGetInvoiceQuery(createdInvoiceId!, {
    skip: !createdInvoiceId,
  });

  const invoice = invoiceResponse?.data || invoiceResponse;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm({
    resolver: yupResolver(invoiceSchema),
    defaultValues: {
      items: [{ description: "", price: 0, quantity: 1 }],
      tax: 0,
      subTotal: 0,
      total: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Watch all form values to calculate totals
  const watchedItems = watch("items");
  const watchedTax = watch("tax");

  // Calculate totals based on watched values
  const subTotal = React.useMemo(() => {
    return (watchedItems || []).reduce(
      (sum, item) =>
        sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
      0
    );
  }, [watchedItems]);

  const total = subTotal + (Number(watchedTax) || 0);

  // Update calculated fields whenever dependencies change
  React.useEffect(() => {
    setValue("subTotal", subTotal);
    setValue("total", total);
  }, [subTotal, total, setValue]);

  const addLineItem = () => {
    append({ description: "", price: 0, quantity: 1 });
  };

  const removeLineItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async (data: InvoiceFormData): Promise<void> => {
    if (!job._id) return;

    try {
      console.log("Submitting invoice data:", data);

      if (!data.items || data.items.length === 0) {
        toast.error("At least one line item is required");
        return;
      }

      const invoicePayload = {
        items: data.items.map((item) => ({
          description: item.description,
          price: Number(item.price),
          quantity: Number(item.quantity),
        })),
        subTotal: Number(data.subTotal),
        tax: Number(data.tax),
        total: Number(data.total),
      };

      console.log("Final payload:", invoicePayload);

      const result = await createInvoice({
        jobId: job._id,
        ...invoicePayload,
      }).unwrap();

      console.log("Invoice creation response:", result);

      // Save the invoice ID to localStorage and state
      if (result.data?._id) {
        const invoiceId = result.data._id;
        setCreatedInvoiceId(invoiceId);

        // Save to localStorage for persistence
        localStorage.setItem(`invoice_${job._id}`, invoiceId);

        toast.success("Invoice created successfully!");
        onUpdate();
      } else {
        toast.error("Invoice created but no ID returned");
      }
    } catch (error: any) {
      console.error("Invoice creation error:", error);
      const errorMessage = error?.data?.message || "Failed to create invoice";
      toast.error(errorMessage);
    }
  };

  // Check if we have an invoice (either from props or from our query)
  const hasInvoice = job.invoice || invoice;

  if (hasInvoice) {
    const displayInvoice = invoice || job.invoice;

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
                ${displayInvoice.subTotal?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-purple-200">
              <span className="text-slate-700">Tax:</span>
              <span className="text-lg font-semibold text-slate-900">
                ${displayInvoice.tax?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-xl font-bold text-slate-900">Total:</span>
              <span className="text-2xl font-bold text-purple-600">
                ${displayInvoice.total?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {displayInvoice.items && (
          <div>
            <h4 className="text-lg font-medium text-slate-900 mb-4">
              Line Items
            </h4>
            <div className="space-y-3">
              {displayInvoice.items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {item.description}
                    </p>
                    <p className="text-sm text-slate-600">
                      {item.quantity} × ${item.price?.toFixed(2)}
                    </p>
                  </div>
                  <span className="font-semibold text-slate-900">
                    ${((item.quantity || 0) * (item.price || 0)).toFixed(2)}
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
            Tax Amount <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            {...register("tax", { valueAsNumber: true })}
            className={`block w-full px-4 py-3 rounded-lg border ${
              errors.tax
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-slate-300 focus:border-purple-500 focus:ring-purple-500"
            } shadow-sm transition-all duration-200 focus:ring-2 focus:ring-opacity-20`}
          />
          {errors.tax && (
            <p className="text-sm text-red-600 flex items-center mt-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
              {errors.tax.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-slate-900">Line Items</h4>
            <button
              type="button"
              onClick={addLineItem}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
            >
              + Add Item
            </button>
          </div>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start p-4 bg-slate-50 rounded-lg"
              >
                <div className="md:col-span-5 space-y-2">
                  <input
                    type="text"
                    placeholder="Item description"
                    {...register(`items.${index}.description`)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-all duration-200"
                  />
                  {errors.items?.[index]?.description && (
                    <p className="text-sm text-red-600">
                      {errors.items[index]?.description?.message}
                    </p>
                  )}
                </div>
                <div className="md:col-span-3 space-y-2">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    {...register(`items.${index}.price`, {
                      valueAsNumber: true,
                    })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-all duration-200"
                  />
                  {errors.items?.[index]?.price && (
                    <p className="text-sm text-red-600">
                      {errors.items[index]?.price?.message}
                    </p>
                  )}
                </div>
                <div className="md:col-span-3 space-y-2">
                  <input
                    type="number"
                    placeholder="Quantity"
                    {...register(`items.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-all duration-200"
                  />
                  {errors.items?.[index]?.quantity && (
                    <p className="text-sm text-red-600">
                      {errors.items[index]?.quantity?.message}
                    </p>
                  )}
                </div>
                <div className="md:col-span-1 space-y-2">
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLineItem(index)}
                      className="w-full px-3 py-3 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {errors.items && !Array.isArray(errors.items) && (
            <p className="text-sm text-red-600 mt-2">{errors.items.message}</p>
          )}
        </div>

        {/* Totals Display */}
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">Subtotal:</span>
              <span className="font-medium">${subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Tax:</span>
              <span className="font-medium">
                ${(watchedTax || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold text-purple-600">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isCreatingInvoice}
          className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg shadow-sm hover:from-purple-700 hover:to-violet-700 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreatingInvoice ? (
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

export default InvoiceTab;
