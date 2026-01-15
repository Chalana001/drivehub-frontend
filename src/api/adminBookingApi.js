import axiosInstance from "./axiosInstance";

export const getAllBookingsAdmin = () => axiosInstance.get("/admin/bookings");

export const approveBookingAdmin = (id) =>
  axiosInstance.put(`/admin/bookings/${id}/approve`);

export const rejectBookingAdmin = (id) =>
  axiosInstance.put(`/admin/bookings/${id}/reject`);
