// import axiosInstance from "./axiosInstance";

// export const addCar = (data) => axiosInstance.post("/admin/cars", data);
// export const updateCar = (id, data) => axiosInstance.put(`/admin/cars/${id}`, data);
// export const deleteCar = (id) => axiosInstance.delete(`/admin/cars/${id}`);
// export const updateCarStatus = (id, status) =>
//   axiosInstance.put(`/admin/cars/${id}/status?status=${status}`);

import axiosInstance from "./axiosInstance";

export const getAllCarsAdmin = () => axiosInstance.get("/cars"); // admin can also use /cars

export const addCarAdmin = (data) => axiosInstance.post("/admin/cars", data);

export const updateCarAdmin = (id, data) =>
  axiosInstance.put(`/admin/cars/${id}`, data);

export const deleteCarAdmin = (id) => axiosInstance.delete(`/admin/cars/${id}`);

export const updateCarStatusAdmin = (id, status) =>
  axiosInstance.put(`/admin/cars/${id}/status?status=${status}`);
