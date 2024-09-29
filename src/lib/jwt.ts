import jwt from 'jsonwebtoken';

export function decodeTokenExpiration(token: string) {
  const decoded = jwt.decode(token);
  if (typeof decoded !== 'string') return decoded?.exp;
  return null;
}
