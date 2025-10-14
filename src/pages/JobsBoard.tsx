import React, { useState, useEffect } from "react";
import type { Job, JobStatus } from "../types";
import {
  Filter,
  Search,
  Grid,
  List,
  Plus,
  TrendingUp,
  Minus,
  TrendingDown,
  Clock,
  Calendar,
  CheckCircle,
  FileText,
  CreditCard,
  Briefcase,
  ArrowRight,
  PlayCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import JobTable from "../components/JobCard";
import { useGetJobsQuery } from "../services/crmApi";

interface ApiJob {
  _id: string;
  customer: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  status: JobStatus;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface JobsResponse {
  success: boolean;
  message: string;
  data: ApiJob[];
  total: number;
  page: number;
  limit: number;
}

// Helper function to format status for display
const formatStatus = (status: JobStatus): string => {
  const statusMap: Record<JobStatus, string> = {
    new: "New",
    in_progress: "In Progress",
    scheduled: "Scheduled",
    done: "Completed",
    invoiced: "Invoiced",
    paid: "Paid",
  };
  return statusMap[status] || status;
};

const JobsBoard: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | JobStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    data: jobsResponse,
    isLoading: jobsLoading,
    error: jobsError,
  } = useGetJobsQuery({
    limit: 100,
    page: 1,
    status: filter === "all" ? undefined : filter,
  });

  // Transform API data to match your Job type
  const jobs: Job[] = React.useMemo(() => {
    if (!jobsResponse?.data) return [];

    return jobsResponse.data.map((apiJob: ApiJob) => ({
      id: apiJob._id,
      title: apiJob.title || "N/A",
      description: apiJob.description || "N/A",
      status: apiJob.status,
      customer: {
        id: apiJob.customer._id,
        name: apiJob.customer.name || "N/A",
        email: apiJob.customer.email || "N/A",
        phone: apiJob.customer.phone || "N/A",
        address: apiJob.customer.address || "N/A",
      },
      createdAt: apiJob.createdAt || new Date().toISOString(),
      updatedAt: apiJob.updatedAt || new Date().toISOString(),
    }));
  }, [jobsResponse]);

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate status counts
  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {} as Record<JobStatus, number>);

  const columns = [
    {
      status: "new" as JobStatus,
      title: "New",
      color: "bg-blue-500",
      count: statusCounts["new"] || 0,
    },
    {
      status: "scheduled" as JobStatus,
      title: "Scheduled",
      color: "bg-amber-500",
      count: statusCounts["scheduled"] || 0,
    },
    {
      status: "in_progress" as JobStatus,
      title: "In Progress",
      color: "bg-orange-500",
      count: statusCounts["in_progress"] || 0,
    },
    {
      status: "done" as JobStatus,
      title: "Completed",
      color: "bg-emerald-500",
      count: statusCounts["done"] || 0,
    },
    {
      status: "invoiced" as JobStatus,
      title: "Invoiced",
      color: "bg-purple-500",
      count: statusCounts["invoiced"] || 0,
    },
    {
      status: "paid" as JobStatus,
      title: "Paid",
      color: "bg-slate-500",
      count: statusCounts["paid"] || 0,
    },
  ];

  const getIcon = (status: JobStatus) => {
    switch (status) {
      case "new":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "scheduled":
        return <Calendar className="w-5 h-5 text-amber-600" />;
      case "in_progress":
        return <PlayCircle className="w-5 h-5 text-orange-600" />;
      case "done":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case "invoiced":
        return <FileText className="w-5 h-5 text-purple-600" />;
      case "paid":
        return <CreditCard className="w-5 h-5 text-slate-600" />;
      default:
        return <Briefcase className="w-5 h-5 text-slate-600" />;
    }
  };

  const getTrend = (status: JobStatus) => {
    const trends = {
      new: {
        icon: TrendingUp,
        color: "text-green-600",
        bg: "bg-green-50",
        value: "+8%",
      },
      scheduled: {
        icon: TrendingUp,
        color: "text-green-600",
        bg: "bg-green-50",
        value: "+15%",
      },
      in_progress: {
        icon: TrendingUp,
        color: "text-green-600",
        bg: "bg-green-50",
        value: "+12%",
      },
      done: {
        icon: TrendingDown,
        color: "text-red-600",
        bg: "bg-red-50",
        value: "-3%",
      },
      invoiced: {
        icon: TrendingUp,
        color: "text-green-600",
        bg: "bg-green-50",
        value: "+22%",
      },
      paid: {
        icon: TrendingUp,
        color: "text-green-600",
        bg: "bg-green-50",
        value: "+5%",
      },
    };
    return (
      trends[status] || {
        icon: Minus,
        color: "text-slate-600",
        bg: "bg-slate-50",
        value: "0%",
      }
    );
  };

  if (jobsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (jobsError) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Failed to load jobs
          </h3>
          <p className="text-slate-600 max-w-md mx-auto">
            There was an error loading the jobs. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Jobs Board</h1>
          <p className="text-slate-600 mt-1">
            Manage and track all your jobs in one place
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/jobs/new"
            className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-indigo-700 hover:shadow-md transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Job
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-7 gap-3">
        {/* Total Jobs Card */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded-full">
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                <span className="text-[11px] font-medium text-green-600">
                  +12%
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-slate-600">Total Jobs</p>
                <p className="text-2xl font-bold text-slate-900">
                  {jobs.length}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100">
            <p className="text-[11px] text-slate-500">
              All active and completed jobs
            </p>
          </div>
        </div>

        {/* Status Cards */}
        {columns.map((column) => {
          const TrendIcon = getTrend(column.status).icon;
          const trend = getTrend(column.status);

          return (
            <div
              key={column.status}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer hover:border-slate-300"
              onClick={() => setFilter(column.status)}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-2.5 ${column.color
                    .replace("bg-", "bg-")
                    .replace("500", "100")} rounded-lg`}
                >
                  {getIcon(column.status)}
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <div
                    className={`flex items-center gap-1 ${trend.bg} px-1.5 py-0.5 rounded-full`}
                  >
                    <TrendIcon className={`w-3.5 h-3.5 ${trend.color}`} />
                    <span className={`text-[11px] font-medium ${trend.color}`}>
                      {trend.value}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-600">
                      {column.title}
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {column.count}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-slate-500">Click to view</p>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs, customers, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as "all" | JobStatus)}
                className="appearance-none bg-white pl-4 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="all">All Jobs</option>
                {columns.map((column) => (
                  <option key={column.status} value={column.status}>
                    {column.title}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              filter === "all"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Jobs
          </button>

          {columns.map((column) => (
            <button
              key={column.status}
              onClick={() => setFilter(column.status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === column.status
                  ? `${column.color} text-white shadow-sm`
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {column.title} ({column.count})
            </button>
          ))}
        </div>
      </div>

      <JobTable jobs={filteredJobs} />

      {/* Empty State */}
      {filteredJobs.length === 0 && !jobsLoading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            No jobs found
          </h3>
          <p className="text-slate-600 max-w-md mx-auto">
            {searchTerm
              ? `No jobs match "${searchTerm}". Try adjusting your search terms.`
              : `No jobs found with the status "${formatStatus(
                  filter as JobStatus
                )}".`}
          </p>
        </div>
      )}
    </div>
  );
};

export default JobsBoard;
