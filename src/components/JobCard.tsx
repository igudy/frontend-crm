import React from "react";
import { Link } from "react-router-dom";
import { Calendar, User, MapPin } from "lucide-react";
import type { Job } from "../types";

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const statusColors: Record<string, string> = {
    New: "bg-blue-100 text-blue-800",
    Scheduled: "bg-yellow-100 text-yellow-800",
    Done: "bg-green-100 text-green-800",
    Invoiced: "bg-purple-100 text-purple-800",
    Paid: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <p className="text-gray-600 mt-1">{job.description}</p>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusColors[job.status]
          }`}
        >
          {job.status}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2" />
          <span>{job.customer.name}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{job.customer.address}</span>
        </div>
        {job.appointment && (
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {new Date(job.appointment.startTime).toLocaleDateString()} •
              {new Date(job.appointment.startTime).toLocaleTimeString()} -
              {new Date(job.appointment.endTime).toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <Link
          to={`/jobs/${job.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
