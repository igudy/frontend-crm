import React from "react";
import {
  useScheduleAppointmentMutation,
  useGetTechniciansQuery,
} from "../../services/crmApi";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Calendar, User } from "lucide-react";
import { useForm } from "react-hook-form";

interface ScheduleTabProps {
  job: any;
  onUpdate: () => void;
}

const appointmentSchema = yup.object({
  technician_id: yup.string().required("Technician is required"),
  start_date: yup.string().required("Start time is required"),
  end_date: yup
    .string()
    .required("End time is required")
    .test(
      "is-after-start",
      "End time must be after start time",
      function (value) {
        const { start_date } = this.parent;
        return !start_date || !value || new Date(value) > new Date(start_date);
      }
    ),
});

type AppointmentFormData = yup.InferType<typeof appointmentSchema>;

const ScheduleTab: React.FC<ScheduleTabProps> = ({ job, onUpdate }) => {
  const [scheduleAppointment, { isLoading: isScheduling }] =
    useScheduleAppointmentMutation();

  // Fetch technicians from API
  const {
    data: techniciansResponse,
    isLoading: isLoadingTechnicians,
    error: techniciansError,
  } = useGetTechniciansQuery({
    limit: 50, // Fetch all technicians
    page: 1,
  });

  const technicians = techniciansResponse?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: yupResolver(appointmentSchema),
  });

  const onSubmit = async (data: AppointmentFormData): Promise<void> => {
    if (!job._id) return;

    try {
      await scheduleAppointment({
        id: job._id,
        ...data,
      }).unwrap();

      toast.success("Appointment scheduled successfully!");
      onUpdate();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Failed to schedule appointment";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-2xl">
      <h3 className="text-xl font-semibold text-slate-900 mb-6">
        Schedule Appointment
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Technician <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              {...register("technician_id")}
              disabled={isLoadingTechnicians}
              className={`block w-full px-4 py-3 rounded-lg border appearance-none ${
                errors.technician_id
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              } shadow-sm transition-all duration-200 focus:ring-2 focus:ring-opacity-20 bg-white disabled:bg-slate-50 disabled:cursor-not-allowed`}
            >
              <option value="">Select a technician</option>
              {technicians.map((technician: any) => (
                <option key={technician._id} value={technician._id}>
                  {technician.name} - {technician.phone}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <User className="w-4 h-4" />
            </div>
          </div>
          {errors.technician_id && (
            <p className="text-sm text-red-600 flex items-center mt-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
              {errors.technician_id.message}
            </p>
          )}
          {isLoadingTechnicians && (
            <p className="text-sm text-slate-500 flex items-center mt-1">
              <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mr-2"></div>
              Loading technicians...
            </p>
          )}
          {techniciansError && (
            <p className="text-sm text-red-600 flex items-center mt-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
              Failed to load technicians
            </p>
          )}
          {technicians.length === 0 && !isLoadingTechnicians && (
            <p className="text-sm text-amber-600 flex items-center mt-1">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
              No technicians available
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              {...register("start_date")}
              className={`block w-full px-4 py-3 rounded-lg border ${
                errors.start_date
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              } shadow-sm transition-all duration-200 focus:ring-2 focus:ring-opacity-20`}
            />
            {errors.start_date && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                {errors.start_date.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              {...register("end_date")}
              className={`block w-full px-4 py-3 rounded-lg border ${
                errors.end_date
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              } shadow-sm transition-all duration-200 focus:ring-2 focus:ring-opacity-20`}
            />
            {errors.end_date && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                {errors.end_date.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={
            isScheduling || isLoadingTechnicians || technicians.length === 0
          }
          className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-indigo-700 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isScheduling ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Scheduling...
            </>
          ) : (
            <>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Appointment
            </>
          )}
        </button>
      </form>

      {/* Technicians Info */}
      {technicians.length > 0 && (
        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="text-sm font-medium text-slate-900 mb-3">
            Available Technicians ({technicians.length})
          </h4>
          <div className="space-y-2">
            {technicians.slice(0, 3).map((technician: any) => (
              <div
                key={technician._id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-slate-700">{technician.name}</span>
                <span className="text-slate-500">{technician.phone}</span>
              </div>
            ))}
            {technicians.length > 3 && (
              <p className="text-xs text-slate-500">
                +{technicians.length - 3} more technicians available
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleTab;
