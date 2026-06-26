import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth as firebaseAuth, 
  googleProvider, 
  isMockMode 
} from '../lib/firebaseClient';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to normalize user object structure for backwards compatibility
  const formatUser = (rawUser) => {
    if (!rawUser) return null;
    return {
      uid: rawUser.uid,
      email: rawUser.email,
      displayName: rawUser.displayName,
      user_metadata: {
        full_name: rawUser.displayName || rawUser.email?.split('@')[0] || 'User'
      }
    };
  };

  useEffect(() => {
    if (isMockMode) {
      // Mock Auth State Observer
      const storedMockUser = localStorage.getItem('cardio_mock_user');
      if (storedMockUser) {
        try {
          setUser(formatUser(JSON.parse(storedMockUser)));
        } catch (e) {
          localStorage.removeItem('cardio_mock_user');
        }
      }
      setLoading(false);
      return;
    }

    // Real Firebase Auth State Observer
    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      setUser(formatUser(firebaseUser));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (isMockMode) {
      // Simulate Mock Login
      await new Promise(resolve => setTimeout(resolve, 600));
      const mockUser = {
        uid: 'mock-user-id-' + email.replace(/[^a-zA-Z0-9]/g, ''),
        email: email,
        displayName: email.split('@')[0],
      };
      localStorage.setItem('cardio_mock_user', JSON.stringify(mockUser));
      setUser(formatUser(mockUser));
      return mockUser;
    }

    // Real Firebase Login
    const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    return credential.user;
  };

  const register = async (email, password, fullName) => {
    if (isMockMode) {
      // Simulate Mock Registration
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockUser = {
        uid: 'mock-user-id-' + email.replace(/[^a-zA-Z0-9]/g, ''),
        email: email,
        displayName: fullName,
      };
      localStorage.setItem('cardio_mock_user', JSON.stringify(mockUser));
      setUser(formatUser(mockUser));
      return mockUser;
    }

    // Real Firebase Registration
    const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    await updateProfile(credential.user, { displayName: fullName });
    // Force user update after setting profile name
    setUser(formatUser({ ...credential.user, displayName: fullName }));
    return credential.user;
  };

  const logout = async () => {
    if (isMockMode) {
      localStorage.removeItem('cardio_mock_user');
      setUser(null);
      return;
    }

    // Real Firebase Logout
    await signOut(firebaseAuth);
  };

  const loginWithGoogle = async () => {
    if (isMockMode) {
      // Simulate Mock Google OAuth popup
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockGoogleUser = {
        uid: 'mock-google-user-id',
        email: 'google.user@example.com',
        displayName: 'Google Account User',
      };
      localStorage.setItem('cardio_mock_user', JSON.stringify(mockGoogleUser));
      setUser(formatUser(mockGoogleUser));
      return mockGoogleUser;
    }

    // Real Firebase Google Login
    const credential = await signInWithPopup(firebaseAuth, googleProvider);
    return credential.user;
  };

  const value = {
    user,
    login,
    register,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
