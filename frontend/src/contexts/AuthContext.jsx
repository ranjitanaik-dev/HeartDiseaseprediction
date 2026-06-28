import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if env is placeholder mock mode
  const isMockMode = 
    !import.meta.env.VITE_SUPABASE_URL || 
    import.meta.env.VITE_SUPABASE_URL.includes('placeholder') ||
    !import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY.includes('placeholder');

  // Normalize user metadata format for frontend compatibility
  const formatUser = (supabaseUser) => {
    if (!supabaseUser) return null;
    return {
      uid: supabaseUser.id,
      email: supabaseUser.email,
      displayName: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
      user_metadata: {
        full_name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
        role: supabaseUser.user_metadata?.role || 'Student'
      }
    };
  };

  useEffect(() => {
    if (isMockMode) {
      const stored = localStorage.getItem('cardio_mock_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          localStorage.removeItem('cardio_mock_user');
        }
      }
      setLoading(false);
      return;
    }

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(formatUser(session?.user));
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(formatUser(session?.user));
      setLoading(false);
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    if (isMockMode) {
      await new Promise(r => setTimeout(r, 600));
      const mockUser = {
        uid: 'mock-user-id-' + email.replace(/[^a-zA-Z0-9]/g, ''),
        email: email,
        displayName: email.split('@')[0],
        user_metadata: { full_name: email.split('@')[0], role: 'Student' }
      };
      localStorage.setItem('cardio_mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return formatUser(data.user);
  };

  const register = async (email, password, fullName) => {
    if (isMockMode) {
      await new Promise(r => setTimeout(r, 800));
      const mockUser = {
        uid: 'mock-user-id-' + email.replace(/[^a-zA-Z0-9]/g, ''),
        email: email,
        displayName: fullName,
        user_metadata: { full_name: fullName, role: 'Student' }
      };
      localStorage.setItem('cardio_mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'Student' // Default role
        }
      }
    });
    if (error) throw error;
    return formatUser(data.user);
  };

  const logout = async () => {
    if (isMockMode) {
      localStorage.removeItem('cardio_mock_user');
      setUser(null);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const loginWithGoogle = async () => {
    if (isMockMode) {
      await new Promise(r => setTimeout(r, 1000));
      const mockUser = {
        uid: 'mock-google-id',
        email: 'ranjitanaik062@gmail.com',
        displayName: 'Ranjita Naik',
        user_metadata: { full_name: 'Ranjita Naik', role: 'Student' }
      };
      localStorage.setItem('cardio_mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          prompt: 'select_account' // Forces Google Account Picker selection dialog
        }
      }
    });
    if (error) throw error;
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, session, login, register, logout, loginWithGoogle, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
