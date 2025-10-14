import * as yup from "yup";

export const customerSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  address: yup.string().required("Address is required"),
});

export const jobSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  customerId: yup.string().required("Customer is required"),
});

export const appointmentSchema = yup.object({
  technician: yup.string().required("Technician is required"),
  startTime: yup.date().required("Start time is required"),
  endTime: yup
    .date()
    .required("End time is required")
    .min(yup.ref("startTime"), "End time must be after start time"),
});

export const invoiceSchema = yup.object({
  lineItems: yup.array().of(
    yup.object({
      description: yup.string().required("Description is required"),
      quantity: yup
        .number()
        .required("Quantity is required")
        .positive("Must be positive"),
      unitPrice: yup
        .number()
        .required("Unit price is required")
        .positive("Must be positive"),
    })
  ),
  taxRate: yup.number().required("Tax rate is required").min(0).max(100),
});

export const paymentSchema = yup.object({
  amount: yup
    .number()
    .required("Amount is required")
    .positive("Must be positive"),
  method: yup.string().required("Payment method is required"),
});
