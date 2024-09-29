import { LoginResponse } from '@/types/auth/login';
import Cookies from 'js-cookie';
import { addDays } from './dates';
import jwt from 'jsonwebtoken';
import { User } from '@/types/user';
import { decodeTokenExpiration } from './jwt';

export function saveAuthCookies(data: LoginResponse) {
  const accessToken = data.accessToken;
  const accessTokenDecoded = jwt.decode(accessToken) as jwt.JwtPayload;
  if (!accessTokenDecoded) return;
  const accessTokenExpires = accessTokenDecoded.exp ?? 0;
  const expirationDate = new Date(accessTokenExpires * 1000);

  Cookies.set('email', accessTokenDecoded.email, {
    expires: addDays(expirationDate, 30),
  });
  Cookies.set('accessToken', data.accessToken, {
    expires: expirationDate,
  });
  Cookies.set('refreshToken', data.refreshToken, {
    expires: addDays(expirationDate, 30),
  });
}

export function clearCookies() {
  Cookies.remove('email');
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
  Cookies.remove('user');
}

export function saveUserCookies(user?: User | null) {
  if (user) {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      const expiration = decodeTokenExpiration(accessToken);
      if (!expiration) return;
      Cookies.set('user', JSON.stringify(user), {
        expires: new Date(expiration * 1000),
      });
    }
  } else {
    Cookies.remove('user');
  }
}
