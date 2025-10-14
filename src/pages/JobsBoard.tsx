import React, { useState, useEffect } from "react";
import JobCard from "../components/JobCard";
import type { Job, JobStatus } from "../types";
import { Filter, Search, Grid, List, Plus } from "lucide-react";
import { dummyJobs } from "../data";

const JobsBoard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<"all" | JobStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, [filter]);

  const loadJobs = async (): Promise<void> => {
    try {
      setIsLoading(true);
      // Simulate API call delay
      //   await new Promise((resolve) => setTimeout(resolve, 1000));

      const url = filter === "all" ? "/jobs" : `/jobs?status=${filter}`;
      let filteredJobs = dummyJobs;
      if (filter !== "all") {
        filteredJobs = dummyJobs.filter((job: any) => job.status === filter);
      }

      setJobs(filteredJobs);
    } catch (error) {
      console.error("Failed to load jobs:", error);
      // Fallback to dummy data on error
      setJobs(dummyJobs);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {} as Record<JobStatus, number>);

  const columns = [
    {
      status: "New" as JobStatus,
      title: "New",
      color: "bg-blue-500",
      count: statusCounts["New"] || 0,
    },
    {
      status: "Scheduled" as JobStatus,
      title: "Scheduled",
      color: "bg-amber-500",
      count: statusCounts["Scheduled"] || 0,
    },
    {
      status: "Done" as JobStatus,
      title: "Completed",
      color: "bg-emerald-500",
      count: statusCounts["Done"] || 0,
    },
    {
      status: "Invoiced" as JobStatus,
      title: "Invoiced",
      color: "bg-purple-500",
      count: statusCounts["Invoiced"] || 0,
    },
    {
      status: "Paid" as JobStatus,
      title: "Paid",
      color: "bg-slate-500",
      count: statusCounts["Paid"] || 0,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading jobs...</p>
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
          <button className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-indigo-700 hover:shadow-md transition-all duration-200">
            <Plus className="w-4 h-4 mr-2" />
            New Job
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">
              Total Jobs
            </span>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {jobs.length}
          </p>
        </div>
        {columns.map((column) => (
          <div
            key={column.status}
            className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200"
            onClick={() => setFilter(column.status)}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">
                {column.title}
              </span>
              <div className={`w-2 h-2 ${column.color} rounded-full`}></div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {column.count}
            </p>
          </div>
        ))}
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
                  ? "text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              style={{
                backgroundColor:
                  filter === column.status
                    ? getComputedStyle(
                        document.documentElement
                      ).getPropertyValue(
                        `--color-${column.color.split("-")[1]}-500`
                      ) || column.color
                    : "",
              }}
            >
              {column.title} ({column.count})
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            : "grid grid-cols-1 gap-4"
        }
      >
        {filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} viewMode={viewMode} />
        ))}
      </div>

      {/* Empty State */}
      {filteredJobs.length === 0 && (
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
              : `No jobs found with the status "${filter}".`}
          </p>
        </div>
      )}
    </div>
  );
};

export default JobsBoard;
