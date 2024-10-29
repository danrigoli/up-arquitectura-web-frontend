import { cookies } from 'next/headers';
import apiService from '../services/api.service';
import { User } from '@/types/user';
import { LoginResponse } from '@/types/auth/login';

export default async function initializeUser() {
  const store = cookies();

  let token = store.get('accessToken')?.value;
  const refreshToken = store.get('refreshToken')?.value;
  const email = store.get('email')?.value;
  const user = store.get('user')?.value;

  if (refreshToken && email && !token) {
    token = (await generateToken(email, refreshToken)) ?? undefined;
    apiService.authToken = token;
  }

  if (token && !user) {
    apiService.authToken = token;
    const { error, data } = await apiService.get<User>('auth/profile');
    if (error) {
      apiService.authToken = '';
      return;
    }
    return data;
  } else if (user) {
    return JSON.parse(user);
  }
}

async function generateToken(email: string, refreshToken: string) {
  const { data: refreshedSessionData, error: refreshSessionError } =
    await apiService.post<LoginResponse>('auth/refresh', {
      email,
      refreshToken,
    });

  if (refreshSessionError || !refreshedSessionData) {
    return null;
  }

  return refreshedSessionData?.accessToken;
}
