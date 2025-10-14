import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import type { CreateCustomerData } from "../types";
import { ArrowLeft, UserPlus, Building } from "lucide-react";

const customerSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  address: yup.string().required("Address is required"),
});

type CustomerFormData = yup.InferType<typeof customerSchema>;

const CreateCustomer: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({
    resolver: yupResolver(customerSchema),
  });

  const onSubmit = async (data: CustomerFormData): Promise<void> => {
    try {
      await api.post<CreateCustomerData>("/customers", data);
      navigate("/");
    } catch (error) {
      console.error("Failed to create customer:", error);
      alert("Failed to create customer");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200 mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </button>

        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Create Customer
            </h1>
            <p className="text-slate-600 mt-1">
              Add a new customer to your CRM system
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <Building className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">
              Customer Information
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("name")}
              className={`block w-full px-4 py-3 rounded-lg border ${
                errors.name
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              } shadow-sm transition-all duration-200 focus:ring-2 focus:ring-opacity-20`}
              placeholder="Enter customer's full name"
            />
            {errors.name && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register("email")}
              className={`block w-full px-4 py-3 rounded-lg border ${
                errors.email
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              } shadow-sm transition-all duration-200 focus:ring-2 focus:ring-opacity-20`}
              placeholder="customer@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              {...register("phone")}
              className={`block w-full px-4 py-3 rounded-lg border ${
                errors.phone
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              } shadow-sm transition-all duration-200 focus:ring-2 focus:ring-opacity-20`}
              placeholder="+1 (555) 000-0000"
            />
            {errors.phone && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Address Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              {...register("address")}
              className={`block w-full px-4 py-3 rounded-lg border ${
                errors.address
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              } shadow-sm transition-all duration-200 focus:ring-2 focus:ring-opacity-20 resize-none`}
              placeholder="Enter complete address"
            />
            {errors.address && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 hover:shadow-md transition-all duration-200 hover:border-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-lg shadow-sm hover:from-blue-700 hover:to-indigo-700 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Customer
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Help Text */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500">
          All fields marked with <span className="text-red-500">*</span> are
          required
        </p>
      </div>
    </div>
  );
};

export default CreateCustomer;
