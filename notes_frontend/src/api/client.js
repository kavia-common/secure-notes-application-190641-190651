import axios from "axios";
import { getAccessToken, clearAccessToken } from "../utils/tokenStorage";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";

let onUnauthorized = null;

// PUBLIC_INTERFACE
export function setUnauthorizedHandler(handler) {
  /** Registers a callback invoked when a 401 response is received. */
  onUnauthorized = handler;
}

function createClient() {
  const instance = axios.create({
    baseURL: API_BASE,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (resp) => resp,
    (error) => {
      const status = error?.response?.status;
      if (status === 401) {
        // Clear token and notify app so it can redirect to login.
        clearAccessToken();
        if (typeof onUnauthorized === "function") onUnauthorized();
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

export const api = createClient();

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns resolved API base URL for debugging. */
  return API_BASE;
}
