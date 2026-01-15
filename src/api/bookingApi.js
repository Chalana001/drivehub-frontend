import axiosInstance from "./axiosInstance";

export const createBooking = (data) => axiosInstance.post("/bookings", data);

export const getMyBookings = () => axiosInstance.get("/bookings/my");

export const cancelBooking = (bookingId) =>
  axiosInstance.put(`/bookings/${bookingId}/cancel`);
