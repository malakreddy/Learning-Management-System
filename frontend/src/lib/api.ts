import axios from 'axios';

const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If we're on a LAN IP, point to the same IP on port 5000
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:5000/api`;
    }
  }
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // Crucial for sending/receiving secure cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    // In a real app, you might want to retrieve the token synchronously 
    // from a store or localStorage. For simplicity, we assume the Zustand
    // store will set this default header when it hydrates, or we grab it here.
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Interceptor to handle 401s and automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          'http://localhost:5000/api/auth/refresh',
          {},
          { withCredentials: true }
        );
        const newToken = res.data.token;
        // The store logic should ideally handle this update, 
        // but passing it globally to axios for immediate retry
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, user needs to re-login.
        // Zustand store will need to be cleared, or redirect to /login
        if (typeof window !== 'undefined') {
             window.dispatchEvent(new Event('auth-logout'));
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
