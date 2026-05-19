import { create } from 'zustand';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export type UserRole = 'non-member' | 'member' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  generate_count: number;
  created_at: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  authModalOpen: boolean;
  authModalMode: 'login' | 'register';

  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setAuthModal: (open: boolean, mode?: 'login' | 'register') => void;

  initialize: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  incrementGenerateCount: () => Promise<void>;

  isMember: () => boolean;
  isAdmin: () => boolean;
  canGenerate: () => boolean;
  canExportDxf: () => boolean;
  canExportHighRes: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,
  initialized: false,
  authModalOpen: false,
  authModalMode: 'login',

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),
  setAuthModal: (open, mode) => set((state) => ({ authModalOpen: open, authModalMode: mode || state.authModalMode })),

  initialize: async () => {
    try {
      const supabase = getSupabaseBrowser();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        set({ user: session.user, session });
        await get().fetchProfile();
      }
      supabase.auth.onAuthStateChange(async (event: any, session: any) => {
        set({ user: session?.user ?? null, session });
        if (session?.user) {
          await get().fetchProfile();
        } else {
          set({ profile: null });
        }
      });
    } catch (err) {
      console.error('Auth init error:', err);
    } finally {
      set({ loading: false, initialized: true });
    }
  },

  signUp: async (email, password) => {
    try {
      const supabase = getSupabaseBrowser();
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return { error: error.message };
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email,
          role: 'non-member',
          generate_count: 0,
        });
      }
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Sign up failed' };
    }
  },

  signIn: async (email, password) => {
    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Sign in failed' };
    }
  },

  signInWithGoogle: async () => {
    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/generate`,
        },
      });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Google sign in failed' };
    }
  },

  signOut: async () => {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    set({ user: null, session: null, profile: null });
  },

  fetchProfile: async () => {
    const { user } = get();
    if (!user) return;
    try {
      const supabase = getSupabaseBrowser();
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error) {
        if (error.code === 'PGRST116') {
          const { data: newProfile } = await supabase.from('profiles').insert({
            id: user.id, email: user.email, role: 'non-member', generate_count: 0,
          }).select().single();
          set({ profile: newProfile as UserProfile });
        }
        return;
      }
      set({ profile: data as UserProfile });
    } catch (err) {
      console.error('Fetch profile error:', err);
    }
  },

  incrementGenerateCount: async () => {
    const { user, profile } = get();
    if (!user || !profile) return;
    try {
      const supabase = getSupabaseBrowser();
      const newCount = (profile.generate_count || 0) + 1;
      await supabase.from('profiles').update({ generate_count: newCount }).eq('id', user.id);
      set({ profile: { ...profile, generate_count: newCount } });
    } catch (err) {
      console.error('Increment generate count error:', err);
    }
  },

  isMember: () => {
    const { profile } = get();
    return profile?.role === 'member' || profile?.role === 'admin';
  },
  isAdmin: () => {
    const { profile } = get();
    return profile?.role === 'admin';
  },
  canGenerate: () => {
    const { profile } = get();
    if (!profile) return false;
    if (profile.role === 'member' || profile.role === 'admin') return true;
    return (profile.generate_count || 0) < 1;
  },
  canExportDxf: () => {
    const { profile } = get();
    if (!profile) return false;
    return profile.role === 'member' || profile.role === 'admin';
  },
  canExportHighRes: () => {
    const { profile } = get();
    if (!profile) return false;
    return profile.role === 'member' || profile.role === 'admin';
  },
}));

