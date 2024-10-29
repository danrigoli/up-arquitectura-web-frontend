import { Category } from './category';
import { Company } from './company';

export type Payment = {
  id: number;
  amount: number;
  date: Date;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  category: Category;
  company: Company;
}

export type UpdatePayment = {
  id: number;
  amount: number;
  date: Date;
  description: string;
  categoryId: number;
  companyId: number;
}