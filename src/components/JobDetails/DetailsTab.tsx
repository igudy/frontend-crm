import { Mail, MapPin, Phone, User } from "lucide-react";

interface DetailsTabProps {
  job: any;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ job }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-8">
      {/* Customer Info */}
      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-6 pb-2 border-b border-slate-200">
          Customer Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center p-4 bg-slate-50 rounded-lg">
            <User className="w-5 h-5 text-slate-500 mr-4" />
            <div>
              <p className="text-sm text-slate-600">Customer Name</p>
              <p className="font-medium text-slate-900">
                {job.customer?.name || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-slate-50 rounded-lg">
            <Phone className="w-5 h-5 text-slate-500 mr-4" />
            <div>
              <p className="text-sm text-slate-600">Phone</p>
              <p className="font-medium text-slate-900">
                {job.customer?.phone || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-slate-50 rounded-lg">
            <Mail className="w-5 h-5 text-slate-500 mr-4" />
            <div>
              <p className="text-sm text-slate-600">Email</p>
              <p className="font-medium text-slate-900">
                {job.customer?.email || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-slate-50 rounded-lg">
            <MapPin className="w-5 h-5 text-slate-500 mr-4" />
            <div>
              <p className="text-sm text-slate-600">Address</p>
              <p className="font-medium text-slate-900">
                {job.customer?.address || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-6 pb-2 border-b border-slate-200">
          Job Details
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
            <span className="text-slate-600">Title</span>
            <span className="font-medium text-slate-900">{job.title}</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-slate-600 mb-2">Description</p>
            <p className="font-medium text-slate-900">{job.description}</p>
          </div>
          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
            <span className="text-slate-600">Created Date</span>
            <span className="font-medium text-slate-900">
              {formatDate(job.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Appointment */}
      {job.appointment && (
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-6 pb-2 border-b border-slate-200">
            Appointment Details
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-600">Technician</span>
              <span className="font-medium text-slate-900">
                {job.appointment.technician_id}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-600">Date</span>
              <span className="font-medium text-slate-900">
                {formatDate(job.appointment.start_date)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-600">Time</span>
              <span className="font-medium text-slate-900">
                {formatTime(job.appointment.start_date)} -{" "}
                {formatTime(job.appointment.end_date)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsTab;
