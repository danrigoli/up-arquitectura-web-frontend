'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { User } from '@/types/user';
import { saveUserCookies, clearCookies, saveAuthCookies } from '@/lib/cookies';
import { decodeTokenExpiration } from '@/lib/jwt';
import apiService from '@/services/api.service';
import authService from '@/services/auth.service';
import { LoginResponse } from '@/types/auth/login';

interface IAuthContext {
isLoggedIn: boolean;
  user: User | null | undefined;
  setUser: (user: User | null) => void;
  loading: boolean;
  refreshUser: () => void;
  logout: () => void;
}

export const AuthContext = React.createContext<IAuthContext>(
  {} as IAuthContext
);

export default function AuthProvider({
  user: loadedUser,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!loadedUser);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(loadedUser);
  const isInitialRender = useRef(0);

  const router = useRouter();

  function setAuthData(authUser?: User | null) {
    setLoading(false);
    setUser(authUser || null);
    setIsLoggedIn(!!authUser);
    saveUserCookies(authUser);
  }

  async function initializeUser() {
    setLoading(true);

    await setToken(true);

    if (!apiService.authToken) {
      setAuthData();
      clearCookies();
      return;
    }

    if (!user || !isLoggedIn) {
      const { error, data } = await authService.getMe();
      setAuthData(data);
      if (error) {
        clearCookies();
        router.push('/login');
        return;
      }
    }
    setLoading(false);
  }

  async function setToken(initial = false) {
    let token = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');
    const userEmail = Cookies.get('email');

    // no session found
    if (!token && !refreshToken) {
      setAuthData();
      return;
    }

    if (token) {
      const exp = decodeTokenExpiration(token);
      // if it's expiring in 5 minutes, refresh it
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      const timeUntilExpiration = (exp || 0) - currentTime;
      if (timeUntilExpiration < 60 * 5) {
        token = undefined;
      }
    }

    // sesion must be refreshed
    if (!token && refreshToken) {
      token = await generateToken(userEmail!, refreshToken);
      if (initial && token) {
        window.location.reload();
      }
    }

    apiService.authToken = token;
  }

  async function generateToken(email: string, refreshToken: string) {
    const { data: refreshedSessionData, error: refreshSessionError } =
      await apiService.post<LoginResponse>('auth/refresh-session', {
        email,
        refreshToken,
      });

    if (refreshSessionError) {
      setAuthData();
      clearCookies();
      sessionStorage.clear();
      router.push('/login');
      return;
    }

    saveAuthCookies(refreshedSessionData!);
    return refreshedSessionData?.accessToken
  }

  async function logout() {
    setLoading(true);
    Cookies.remove('user');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('email');
    setIsLoggedIn(false);
    sessionStorage.clear();
    apiService.authToken = undefined;
    setLoading(false);
  }

  useEffect(() => {
    // call only on initial load
    if (isInitialRender.current === 0) {
      setInterval(
        () => {
          if (user) {
            setToken();
          }
        },
        1000 * 60 * 4.5
      );
      if (user && apiService.authToken) {
        setToken();
      } else {
        initializeUser();
      }
      isInitialRender.current++;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        loading,
        refreshUser: () => initializeUser(),
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Use app hook
export const useAuthContext = () => {
  return React.useContext(AuthContext);
};
