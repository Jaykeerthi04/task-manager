import { User } from 'firebase/auth';
import { create } from 'zustand';
import { loginWithEmail, logout, observeAuth, registerWithEmail } from '../services/authService';
import { getAuthErrorMessage } from '../utils/authErrors';
import { useTaskStore } from './taskStore';

interface AuthState {
  user: User | null;
  /** True until Firebase reports the persisted session (or lack of one). */
  initializing: boolean;
  /** True while a sign in / sign up request is in flight. */
  loading: boolean;
  error: string | null;

  /** Starts observing auth state. Returns the unsubscribe function. */
  init: () => () => void;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initializing: true,
  loading: false,
  error: null,

  init: () =>
    observeAuth((user) => {
      set({ user, initializing: false });
      // Keep the task listener in lockstep with the signed-in user.
      if (user) useTaskStore.getState().subscribe(user.uid);
      else useTaskStore.getState().reset();
    }),

  signUp: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await registerWithEmail(email, password);
      set({ loading: false });
    } catch (e) {
      set({ loading: false, error: getAuthErrorMessage(e) });
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await loginWithEmail(email, password);
      set({ loading: false });
    } catch (e) {
      set({ loading: false, error: getAuthErrorMessage(e) });
    }
  },

  signOut: async () => {
    try {
      await logout();
    } catch (e) {
      set({ error: getAuthErrorMessage(e) });
    }
  },

  clearError: () => set({ error: null }),
}));
