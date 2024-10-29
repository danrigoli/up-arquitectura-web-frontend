import { GetListParameters } from '@/types/parameters/list-parameters';
import apiService from './api.service';
import { Company, CreateCompany, UpdateCompany } from '@/types/company';

class CompanyService {
  async getCompanies(params: GetListParameters = {}) {
    const queryParams: Record<string, string> = {};
    if (params.offset !== undefined) queryParams.offset = params.offset.toString();
    if (params.limit !== undefined) queryParams.limit = params.limit.toString();
    if (params.search !== undefined) queryParams.search = params.search;
    if (params.sort !== undefined && params.sort !== '') queryParams.sort = params.sort;
    if (params.order !== undefined) queryParams.order = params.order;
    return await apiService.get<Company[]>('companies', queryParams);
  }

  async getCompaniesCount(params: GetListParameters = {}) {
    const queryParams: Record<string, string> = {};
    if (params.search !== undefined) queryParams.search = params.search;
    return await apiService.get<{ count: number }>('companies/count', queryParams);
  }

  async getCompany(id: number) {
    return await apiService.get<Company>(`companies/${id}`);
  }

  async createCompany(data: CreateCompany) {
    return await apiService.post<Company>('companies', data);
  }

  async updateCompany(id: number, data: Partial<UpdateCompany>) {
    return await apiService.put<Company>(`companies/${id}`, data);
  }

  async deleteCompany(id: number) {
    return await apiService.delete<Company>(`companies/${id}`);
  }
}

const companyService = new CompanyService();
export default companyService;
