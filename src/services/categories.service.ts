import { GetListParameters } from '@/types/parameters/list-parameters';
import apiService from './api.service';
import { Category, CreateCategory, UpdateCategory } from '@/types/category';

class CategoryService {
  async getCategories(params: GetListParameters = {}) {
    const queryParams: Record<string, string> = {};
    if (params.offset !== undefined) queryParams.offset = params.offset.toString();
    if (params.limit !== undefined) queryParams.limit = params.limit.toString();
    if (params.search !== undefined) queryParams.search = params.search;
    if (params.sort !== undefined && params.sort !== '') queryParams.sort = params.sort;
    if (params.order !== undefined) queryParams.order = params.order;
    return await apiService.get<Category[]>('categories', queryParams);
  }

  async getCategoriesCount(params: GetListParameters = {}) {
    const queryParams: Record<string, string> = {};
    if (params.search !== undefined) queryParams.search = params.search;
    return await apiService.get<{ count: number }>('categories/count', queryParams);
  }

  async getCategory(id: number) {
    return await apiService.get<Category>(`categories/${id}`);
  }

  async createCategory(data: CreateCategory) {
    return await apiService.post<Category>('categories', data);
  }

  async updateCategory(id: number, data: Partial<UpdateCategory>) {
    return await apiService.put<Category>(`categories/${id}`, data);
  }

  async deleteCategory(id: number) {
    return await apiService.delete<Category>(`categories/${id}`);
  }
}

const categoryService = new CategoryService();
export default categoryService;
