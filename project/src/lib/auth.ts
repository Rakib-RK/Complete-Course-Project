import { supabase } from './supabase';
import { toast } from 'react-hot-toast';

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

export interface AuthError {
  message: string;
}

export const auth = {
  async signUp(email: string, password: string): Promise<User | AuthError> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        return {
          id: data.user.id,
          email: data.user.email!,
          isAdmin: false,
        };
      }
      
      return { message: 'Signup failed' };
    } catch (error: any) {
      return { message: error.message };
    }
  },

  async signIn(email: string, password: string): Promise<User | AuthError> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', data.user.id)
          .single();

        return {
          id: data.user.id,
          email: data.user.email!,
          isAdmin: profile?.is_admin || false,
        };
      }

      return { message: 'Login failed' };
    } catch (error: any) {
      return { message: error.message };
    }
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Failed to sign out');
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email!,
      isAdmin: profile?.is_admin || false,
    };
  }
};