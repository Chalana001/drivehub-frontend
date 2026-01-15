import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let queue = [];

const runQueue = (err) => {
  queue.forEach((p) => (err ? p.reject(err) : p.resolve()));
  queue = [];
};

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (!err.response) return Promise.reject(err);

    const status = err.response.status;

    // ✅ handle 401 + 403
    if (status !== 401 && status !== 403) return Promise.reject(err);

    // avoid infinite loop
    if (original.url.includes("/auth/refresh")) return Promise.reject(err);
    if (original._retry) return Promise.reject(err);

    original._retry = true;

    // if already refreshing, wait
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: () => resolve(axiosInstance(original)),
          reject,
        });
      });
    }

    try {
      isRefreshing = true;

      // ✅ refresh cookie
      await refreshClient.post("/auth/refresh");

      isRefreshing = false;
      runQueue(null);

      // ✅ retry original request
      return axiosInstance(original);
    } catch (refreshErr) {
      isRefreshing = false;
      runQueue(refreshErr);
      return Promise.reject(refreshErr);
    }
  }
);

export default axiosInstance;
