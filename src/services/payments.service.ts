import { GetListParameters } from '@/types/parameters/list-parameters';
import apiService from './api.service';
import { Payment, UpdatePayment } from '@/types/payment';

class PaymentService {
  async getPayments(params: GetListParameters = {}) {
    const queryParams: Record<string, string> = {};
    if (params.offset !== undefined) queryParams.offset = params.offset.toString();
    if (params.limit !== undefined) queryParams.limit = params.limit.toString();
    if (params.search !== undefined) queryParams.search = params.search;
    return await apiService.get<Payment[]>('payments', queryParams);
  }

  async getPaymentsCount(params: GetListParameters = {}) {
    const queryParams: Record<string, string> = {};
    if (params.search !== undefined) queryParams.search = params.search;
    return await apiService.get<{ count: number }>('payments/count', queryParams);
  }

  async getPayment(id: number) {
    return await apiService.get<Payment>(`payments/${id}`);
  }

  async createPayment(data: UpdatePayment) {
    return await apiService.post<Payment>('payments', data);
  }

  async updatePayment(id: number, data: Partial<UpdatePayment>) {
    return await apiService.patch<Payment>(`payments/${id}`, data);
  }

  async deletePayment(id: number) {
    return await apiService.delete<Payment>(`payments/${id}`);
  }
}

const paymentService = new PaymentService();
export default paymentService;
