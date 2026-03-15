import { create } from 'zustand';
import api from '@/lib/api';

export interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>; // To be called on app load if we store token
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Initially true while we might check local storage or refresh
  
  setAuth: (user, token) => {
    // Save to localStorage so it survives hard reloads
    localStorage.setItem('lms_token', token);
    localStorage.setItem('lms_user', JSON.stringify(user));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    set({ user, token, isAuthenticated: true, isLoading: false });
  },
  
  logout: () => {
    localStorage.removeItem('lms_token');
    localStorage.removeItem('lms_user');
    delete api.defaults.headers.common['Authorization'];
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    // Tell backend to clear refresh cookie (fire and forget)
    api.post('/auth/logout').catch(() => {});
  },
  
  checkAuth: async () => {
    try {
      const token = localStorage.getItem('lms_token');
      const userStr = localStorage.getItem('lms_user');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        // Attempt silent refresh via cookie if token is missing but maybe cookie exists
        try {
            const res = await api.post('/auth/refresh');
            const newToken = res.data.token;
            // Since we don't have user details from the refresh endpoint directly,
            // a real production app should have a /auth/me endpoint.
            // For now, we'll mark as authenticated but let the user re-login to get details if needed, 
            // or we decode the JWT if it contains user info.
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            localStorage.setItem('lms_token', newToken);
            // Decode simple JWT payload manually
            const payload = JSON.parse(atob(newToken.split('.')[1]));
            const user = { id: payload.userId, email: payload.email };
            set({ user, token: newToken, isAuthenticated: true, isLoading: false });
        } catch(e) {
            set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      }
    } catch (e) {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  }
}));

// Setup global listener for token refresh failures from interceptor
if (typeof window !== 'undefined') {
  window.addEventListener('auth-logout', () => {
    useAuthStore.getState().logout();
  });
}
