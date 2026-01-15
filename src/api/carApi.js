import axiosInstance from "./axiosInstance";

export const getAllCars = () => axiosInstance.get("/cars");
export const getCarById = (id) => axiosInstance.get(`/cars/${id}`);
