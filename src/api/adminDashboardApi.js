import axiosInstance from "./axiosInstance";

export const getCarsCount = async () => {
  const res = await axiosInstance.get("/cars");
  return res.data?.length || 0;
};

export const getBookingsAdmin = async () => {
  const res = await axiosInstance.get("/admin/bookings");
  return res.data || [];
};
