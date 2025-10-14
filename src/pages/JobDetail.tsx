// JobDetail.tsx - Fix the status flow and action buttons
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import StatusTimeline from "../components/StatusTimeline";
import {
  Calendar,
  ArrowLeft,
  CreditCard,
  DollarSign,
  FileText,
  Clock,
  PlayCircle,
  CheckCircle,
} from "lucide-react";
import type { JobStatus } from "../types";
import { useGetJobQuery, useUpdateJobStatusMutation } from "../services/crmApi";
import InvoiceTab from "../components/JobDetails/InvoiceTab";
import DetailsTab from "../components/JobDetails/DetailsTab";
import ScheduleTab from "../components/JobDetails/ScheduleTab";
import PaymentsTab from "../components/JobDetails/PaymentTab";

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "details" | "schedule" | "invoice" | "payments"
  >("details");

  const {
    data: jobResponse,
    isLoading: jobLoading,
    error: jobError,
    refetch: refetchJob,
  } = useGetJobQuery(id!);

  const [updateJobStatus, { isLoading: isUpdatingStatus }] =
    useUpdateJobStatusMutation();

  const job = jobResponse?.data || jobResponse;

  const updateStatus = async (newStatus: JobStatus): Promise<void> => {
    if (!id) return;

    try {
      await updateJobStatus({ id, status: newStatus }).unwrap();
      toast.success(`Job status updated to ${newStatus}`);
      refetchJob();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Failed to update job status";
      toast.error(errorMessage);
    }
  };

  const statusConfig: Record<string, { color: string; bg: string }> = {
    new: { color: "text-blue-700", bg: "bg-blue-50" },
    scheduled: { color: "text-amber-700", bg: "bg-amber-50" },
    in_progress: { color: "text-orange-700", bg: "bg-orange-50" },
    done: { color: "text-emerald-700", bg: "bg-emerald-50" },
    invoiced: { color: "text-purple-700", bg: "bg-purple-50" },
    paid: { color: "text-slate-700", bg: "bg-slate-50" },
  };

  if (jobLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (jobError || !job) {
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
        <button
          onClick={() => navigate("/")}
          className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  const status = statusConfig[job.status] || statusConfig.new;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/")}
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

        <StatusTimeline currentStatus={job.status} job={job} />

        <div className="flex space-x-3 mt-8">
          {job.status === "new" && (
            <button
              onClick={() => setActiveTab("schedule")}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-indigo-700 hover:shadow-md transition-all duration-200"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Technician
            </button>
          )}
          {job.status === "scheduled" && (
            <button
              onClick={() => updateStatus("in_progress")}
              disabled={isUpdatingStatus}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-orange-600 to-amber-600 rounded-lg shadow-sm hover:from-orange-700 hover:to-amber-700 hover:shadow-md transition-all duration-200 disabled:opacity-50"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              {isUpdatingStatus ? "Updating..." : "Start Work"}
            </button>
          )}
          {job.status === "in_progress" && (
            <button
              onClick={() => updateStatus("done")}
              disabled={isUpdatingStatus}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg shadow-sm hover:from-emerald-700 hover:to-green-700 hover:shadow-md transition-all duration-200 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isUpdatingStatus ? "Updating..." : "Mark as Done"}
            </button>
          )}
          {job.status === "done" && (
            <button
              onClick={() => setActiveTab("invoice")}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg shadow-sm hover:from-purple-700 hover:to-violet-700 hover:shadow-md transition-all duration-200"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Invoice
            </button>
          )}
          {job.status === "invoiced" && job.invoice && (
            <button
              onClick={() => setActiveTab("payments")}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-slate-600 to-gray-600 rounded-lg shadow-sm hover:from-slate-700 hover:to-gray-700 hover:shadow-md transition-all duration-200"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Record Payment
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
            <ScheduleTab job={job} onUpdate={refetchJob} />
          )}
          {activeTab === "invoice" && (
            <InvoiceTab job={job} onUpdate={refetchJob} />
          )}
          {activeTab === "payments" && (
            <PaymentsTab job={job} onUpdate={refetchJob} />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
