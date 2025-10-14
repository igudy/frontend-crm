import React from "react";
import { Check, Clock } from "lucide-react";
import type { JobStatus } from "../types";

interface StatusTimelineProps {
  currentStatus: JobStatus;
}

const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus }) => {
  const statuses = [
    { key: "New" as JobStatus, label: "New Job" },
    { key: "Scheduled" as JobStatus, label: "Scheduled" },
    { key: "Done" as JobStatus, label: "Completed" },
    { key: "Invoiced" as JobStatus, label: "Invoiced" },
    { key: "Paid" as JobStatus, label: "Paid" },
  ];

  const currentIndex = statuses.findIndex(
    (status) => status.key === currentStatus
  );

  return (
    <div className="flex items-center justify-between max-w-2xl">
      {statuses.map((status, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = status.key === currentStatus;

        return (
          <div key={status.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-400"
                } ${
                  isCurrent && !isCompleted ? "border-2 border-blue-600" : ""
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </div>
              <span
                className={`text-xs mt-1 ${
                  isCompleted ? "text-blue-600 font-medium" : "text-gray-500"
                }`}
              >
                {status.label}
              </span>
            </div>
            {index < statuses.length - 1 && (
              <div
                className={`w-16 h-1 ${
                  index < currentIndex ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StatusTimeline;
