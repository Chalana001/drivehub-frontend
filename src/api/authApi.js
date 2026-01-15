import axiosInstance from "./axiosInstance";

export const registerCustomer = (data) => {
  return axiosInstance.post("/auth/register", data);
};

export const loginUser = (data) => {
  return axiosInstance.post("/auth/login", data);
};

export const refreshToken = () => axiosInstance.post("/auth/refresh");
export const logoutUser = () => axiosInstance.post("/auth/logout");
export const getMe = () => axiosInstance.get("/auth/me");
