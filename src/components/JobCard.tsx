import React from "react";
import { Link } from "react-router-dom";
import { Calendar, User, MapPin, Clock, ArrowRight } from "lucide-react";

interface JobCardProps {
  job: any;
  viewMode: "grid" | "list";
}

const JobCard: React.FC<JobCardProps> = ({ job, viewMode }) => {
  // Safe status configuration with fallbacks
  const statusConfig: Record<string, { color: string; bg: string }> = {
    New: { color: "text-blue-700", bg: "bg-blue-50" },
    Scheduled: { color: "text-amber-700", bg: "bg-amber-50" },
    Done: { color: "text-emerald-700", bg: "bg-emerald-50" },
    Invoiced: { color: "text-purple-700", bg: "bg-purple-50" },
    Paid: { color: "text-slate-700", bg: "bg-slate-50" },
  };

  // Safe date formatting with fallback
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "No date";
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

  // Safe time formatting with fallback
  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "";
    }
  };

  // Safe data access with fallbacks
  const safeJob = {
    id: job?.id || "unknown",
    title: job?.title || "Untitled Job",
    description: job?.description || "No description available",
    status: job?.status || "New",
    customer: {
      name: job?.customer?.name || "Unknown Customer",
      address: job?.customer?.address || "No address provided",
      ...job?.customer,
    },
    appointment: job?.appointment
      ? {
          startTime: job.appointment.startTime,
          endTime: job.appointment.endTime,
          ...job.appointment,
        }
      : null,
    createdAt: job?.createdAt || new Date().toISOString(),
  };

  const status = statusConfig[safeJob.status] || statusConfig.New;

  // Debug: Log the job data to see what's actually coming through
  console.log("JobCard received:", safeJob);

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex-shrink-0">
              <div
                className={`w-3 h-12 rounded-full ${
                  status.bg
                } ${status.color.replace("text", "bg")}`}
              ></div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-slate-900 truncate">
                  {safeJob.title}
                </h3>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}
                >
                  {safeJob.status}
                </span>
              </div>
              <p className="text-slate-600 mb-3 line-clamp-2">
                {safeJob.description}
              </p>

              <div className="flex items-center space-x-6 text-sm text-slate-500">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>{safeJob.customer.name}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="truncate max-w-40">
                    {safeJob.customer.address.split(",")[0]}
                  </span>
                </div>
                {safeJob.appointment && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(safeJob.appointment.startTime)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Link
            to={`/jobs/${safeJob.id}`}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 group-hover:translate-x-1"
          >
            View Details
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 mb-1 line-clamp-2">
            {safeJob.title}
          </h3>
          <p className="text-slate-600 text-sm line-clamp-2">
            {safeJob.description}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ml-3 flex-shrink-0 ${status.bg} ${status.color}`}
        >
          {safeJob.status}
        </span>
      </div>

      {/* Customer Info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-slate-700">
          <User className="w-4 h-4 mr-3 text-slate-400" />
          <span className="text-sm font-medium">{safeJob.customer.name}</span>
        </div>
        <div className="flex items-center text-slate-600">
          <MapPin className="w-4 h-4 mr-3 text-slate-400" />
          <span className="text-sm">{safeJob.customer.address}</span>
        </div>
      </div>

      {/* Appointment */}
      {safeJob.appointment && (
        <div className="bg-slate-50 rounded-lg p-3 mb-4 border border-slate-200">
          <div className="flex items-center text-slate-700 mb-1">
            <Calendar className="w-4 h-4 mr-2 text-slate-500" />
            <span className="text-sm font-medium">Scheduled</span>
          </div>
          <div className="flex items-center text-slate-600 text-sm">
            <Clock className="w-4 h-4 mr-2 text-slate-400" />
            <span>
              {formatDate(safeJob.appointment.startTime)} •{" "}
              {formatTime(safeJob.appointment.startTime)} -{" "}
              {formatTime(safeJob.appointment.endTime)}
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <span className="text-sm text-slate-500">
          Created {formatDate(safeJob.createdAt)}
        </span>
        <Link
          to={`/jobs/${safeJob.id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-all duration-200 group-hover:translate-x-1"
        >
          View Details
          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
