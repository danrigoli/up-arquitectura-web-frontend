import apiService from '@/services/api.service';
import { User } from '@/types/user';
import { cookies } from 'next/headers';

const loadServerSideCookies = () => {
  const store = cookies();
  apiService.authToken = store.get('accessToken')?.value ?? '';
};

export const getUserFromCookies = (): User | null => {
  const store = cookies();
  const hasAccessToken = store.get('accessToken')?.value;
  const user = hasAccessToken ? store.get('user')?.value ?? '' : '';
  if (!user) return null;
  return JSON.parse(user);
};

export default loadServerSideCookies;
