import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  User,
  MapPin,
  Clock,
  ArrowRight,
  MoreVertical,
  Eye,
  Edit,
  FileText,
} from "lucide-react";

interface JobTableProps {
  jobs: any[];
}

const JobTable: React.FC<JobTableProps> = ({ jobs }) => {
  // Safe status configuration with fallbacks
  const statusConfig: Record<
    string,
    { color: string; bg: string; dot: string }
  > = {
    New: { color: "text-blue-700", bg: "bg-blue-50", dot: "bg-blue-500" },
    Scheduled: {
      color: "text-amber-700",
      bg: "bg-amber-50",
      dot: "bg-amber-500",
    },
    Done: {
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      dot: "bg-emerald-500",
    },
    Invoiced: {
      color: "text-purple-700",
      bg: "bg-purple-50",
      dot: "bg-purple-500",
    },
    Paid: { color: "text-slate-700", bg: "bg-slate-50", dot: "bg-slate-500" },
  };

  // Safe date formatting with fallback
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "Invalid date";
    }
  };

  // Safe data access with fallbacks
  const safeJobs = jobs.map((job) => ({
    id: job?.id || "unknown",
    title: job?.title || "Untitled Job",
    description: job?.description || "No description available",
    status: job?.status || "New",
    customer: {
      name: job?.customer?.name || "Unknown Customer",
      email: job?.customer?.email || "No email",
      phone: job?.customer?.phone || "No phone",
      address: job?.customer?.address || "No address provided",
    },
    appointment: job?.appointment
      ? {
          startTime: job.appointment.startTime,
          endTime: job.appointment.endTime,
          technician: job.appointment.technician || "Unassigned",
        }
      : null,
    createdAt: job?.createdAt || new Date().toISOString(),
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Job Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Schedule
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {safeJobs.map((job) => {
              const status = statusConfig[job.status] || statusConfig.New;

              return (
                <tr
                  key={job.id}
                  className="hover:bg-slate-50 transition-colors duration-150 group"
                >
                  {/* Job Details */}
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-2 h-2 mt-2 rounded-full ${status.dot}`}
                      ></div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-semibold text-slate-900 truncate">
                            {job.title}
                          </h4>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {job.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-900">
                          {job.customer.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600 truncate max-w-[200px]">
                          {job.customer.address}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Schedule */}
                  <td className="px-6 py-4">
                    {job.appointment ? (
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-900">
                            {formatDateTime(job.appointment.startTime)}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 ml-6">
                          {job.appointment.technician}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Not scheduled</span>
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${status.dot}`}
                      ></div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}
                      >
                        {job.status}
                      </span>
                    </div>
                  </td>

                  {/* Created Date */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">
                      {formatDate(job.createdAt)}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="inline-flex items-center p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        className="inline-flex items-center p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {safeJobs.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            No jobs found
          </h3>
          <p className="text-slate-600">
            Get started by creating your first job.
          </p>
        </div>
      )}

      {/* Table Footer */}
      {safeJobs.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Showing {safeJobs.length} of {safeJobs.length} jobs
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200">
                Previous
              </button>
              <button className="px-3 py-1 text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200">
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobTable;
