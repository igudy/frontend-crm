import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Briefcase, User, Plus, Calendar } from "lucide-react";
import { useCreateJobMutation, useGetCustomersQuery } from "../services/crmApi";

const jobSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  customerId: yup.string().required("Customer is required"),
});

const CreateJob = () => {
  const navigate = useNavigate();
  const [createJob, { isLoading: isCreatingJob }] = useCreateJobMutation();

  const {
    data: customersResponse,
    isLoading: isLoadingCustomers,
    error: customersError,
  } = useGetCustomersQuery({
    limit: 100,
    page: 1,
  });

  const customers = customersResponse?.data || customersResponse || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(jobSchema),
  });

  useEffect(() => {
    if (customersError) {
      toast.error("Failed to load customers");
      console.error("Failed to load customers:", customersError);
    }
  }, [customersError]);

  const onSubmit = async (data: any) => {
    try {
      const jobData = {
        customer: data.customerId,
        title: data.title,
        description: data.description,
      };

      await createJob(jobData).unwrap();

      toast.success("Job created successfully! 🎉", {
        position: "top-right",
        autoClose: 3000,
      });

      navigate("/");
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to create job";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
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
          Back to Jobs Board
        </button>

        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Create New Job
            </h1>
            <p className="text-slate-600 mt-1">
              Set up a new job for your customer
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <Plus className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">
              Job Details
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
          {/* Job Title Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("title")}
              className={`block w-full px-4 py-3 rounded-lg border ${
                errors.title
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              } shadow-sm transition-all duration-200 focus:ring-2 focus:ring-opacity-20`}
              placeholder="Enter job title (e.g., Website Redesign, Plumbing Repair)"
            />
            {errors.title && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              {...register("description")}
              className={`block w-full px-4 py-3 rounded-lg border ${
                errors.description
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              } shadow-sm transition-all duration-200 focus:ring-2 focus:ring-opacity-20 resize-none`}
              placeholder="Describe the job requirements, scope, and any special instructions..."
            />
            {errors.description && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Customer Selection Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Customer <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                {...register("customerId")}
                className={`block w-full px-4 py-3 rounded-lg border appearance-none ${
                  errors.customerId
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                } shadow-sm transition-all duration-200 focus:ring-2 focus:ring-opacity-20 bg-white`}
                disabled={isLoadingCustomers}
              >
                <option value="">Select a customer</option>
                {customers.map((customer: any) => (
                  <option
                    key={customer._id || customer.id}
                    value={customer._id || customer.id}
                  >
                    {customer.name} - {customer.email}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <User className="w-4 h-4" />
              </div>
            </div>
            {errors.customerId && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                {errors.customerId.message}
              </p>
            )}
            {isLoadingCustomers && (
              <p className="text-sm text-slate-500 flex items-center mt-1">
                <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                Loading customers...
              </p>
            )}
            {customers.length === 0 && !isLoadingCustomers && (
              <p className="text-sm text-amber-600 flex items-center mt-1">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                No customers found. Please create a customer first.
              </p>
            )}
          </div>

          {/* Additional Info */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-start space-x-3">
              <Calendar className="w-4 h-4 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-700">Job Status</p>
                <p className="text-sm text-slate-600 mt-1">
                  New jobs are automatically set to "Pending" status. You can
                  update the status later from the jobs board.
                </p>
              </div>
            </div>
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
              disabled={isCreatingJob || customers.length === 0}
              className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-600 border border-transparent rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-700 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isCreatingJob ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Job
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

export default CreateJob;
