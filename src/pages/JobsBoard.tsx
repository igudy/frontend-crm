import React, { useState, useEffect } from "react";
import JobCard from "../components/JobCard";
import { api } from "../lib/api";
import type { Job, JobStatus } from "../types";

const JobsBoard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<"all" | JobStatus>("all");

  useEffect(() => {
    loadJobs();
  }, [filter]);

  const loadJobs = async (): Promise<void> => {
    try {
      const url = filter === "all" ? "/jobs" : `/jobs?status=${filter}`;
      const response = await api.get<Job[]>(url);
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to load jobs:", error);
    }
  };

  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {} as Record<JobStatus, number>);

  const columns = [
    { status: "New" as JobStatus, title: "New Jobs", color: "border-blue-200" },
    {
      status: "Scheduled" as JobStatus,
      title: "Scheduled",
      color: "border-yellow-200",
    },
    {
      status: "Done" as JobStatus,
      title: "Completed",
      color: "border-green-200",
    },
    {
      status: "Invoiced" as JobStatus,
      title: "Invoiced",
      color: "border-purple-200",
    },
    { status: "Paid" as JobStatus, title: "Paid", color: "border-gray-200" },
  ];

  return (
    <div>
      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border"
            }`}
          >
            All Jobs ({jobs.length})
          </button>
          {columns.map((column) => (
            <button
              key={column.status}
              onClick={() => setFilter(column.status)}
              className={`px-4 py-2 rounded-lg ${
                filter === column.status
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border"
              }`}
            >
              {column.title} ({statusCounts[column.status] || 0})
            </button>
          ))}
        </div>
      </div>

      {filter === "all" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {jobs
            .filter((job) => job.status === filter)
            .map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
        </div>
      )}
    </div>
  );
};

export default JobsBoard;
