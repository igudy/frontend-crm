import React from "react";
import type { JobStatus } from "../types";

interface StatusTimelineProps {
  currentStatus: JobStatus;
  job?: any;
}

const StatusTimeline: React.FC<StatusTimelineProps> = ({
  currentStatus,
  job,
}) => {
  const statuses: { status: JobStatus; label: string; description: string }[] =
    [
      { status: "new", label: "New", description: "Job created" },
      {
        status: "scheduled",
        label: "Scheduled",
        description: "Technician assigned",
      },
      {
        status: "in_progress",
        label: "In Progress",
        description: "Work started",
      },
      { status: "done", label: "Completed", description: "Work finished" },
      {
        status: "invoiced",
        label: "Invoiced",
        description: "Invoice generated",
      },
      { status: "paid", label: "Paid", description: "Payment received" },
    ];

  const currentIndex = statuses.findIndex((s) => s.status === currentStatus);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {statuses.map((status, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={status.status}
              className="flex flex-col items-center flex-1"
            >
              {/* Connection line */}
              {index > 0 && (
                <div
                  className={`h-0.5 w-full absolute top-4 -translate-y-1/2 -z-10 ${
                    isCompleted ? "bg-blue-500" : "bg-slate-300"
                  }`}
                  style={{ left: `-50%`, right: `50%` }}
                />
              )}

              {/* Status circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  isCompleted
                    ? "bg-blue-500 border-blue-500 text-white"
                    : isCurrent
                    ? "border-blue-500 bg-white text-blue-500"
                    : "border-slate-300 bg-white text-slate-400"
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>

              {/* Status label */}
              <div className="mt-2 text-center">
                <p
                  className={`text-sm font-medium ${
                    isCompleted || isCurrent
                      ? "text-slate-900"
                      : "text-slate-500"
                  }`}
                >
                  {status.label}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {status.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusTimeline;
