import apiService from './api.service';
import { LoginResponse } from '@/types/auth/login';
import { SignUpResponse } from '@/types/auth/signup';
import { User } from '@/types/user';

interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

class AuthService {
  async login(email: string, password: string) {
    return await apiService.post<LoginResponse>('auth/login', {
      email,
      password,
    });
  }

  async register({
    firstName,
    lastName,
    email,
    password,
  }: SignUpRequest) {
    return await apiService.post<SignUpResponse>('auth/register', {
      firstName,
      lastName,
      email,
      password,
    });
  }

  async getMe() {
    return await apiService.get<User>('auth/profile');
  }
}

const authService = new AuthService();
export default authService;
