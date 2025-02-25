import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, auth } from '../lib/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      setUser: (user) => set({ user }),
      signIn: async (email, password) => {
        const result = await auth.signIn(email, password);
        if ('message' in result) {
          throw new Error(result.message);
        }
        set({ user: result });
      },
      signUp: async (email, password) => {
        const result = await auth.signUp(email, password);
        if ('message' in result) {
          throw new Error(result.message);
        }
        set({ user: result });
      },
      signOut: async () => {
        await auth.signOut();
        set({ user: null });
      },
      checkAuth: async () => {
        try {
          const user = await auth.getCurrentUser();
          set({ user, loading: false });
        } catch (error) {
          set({ user: null, loading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);