import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  timeout: 30000,
});

export interface Application {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  income: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  id_card_url: string | null;
  employment_contract_url: string | null;
  payslip1_url: string | null;
  payslip2_url: string | null;
  payslip3_url: string | null;
  tax_return_url: string | null;
  lease_pdf_url: string | null;
}

export const submitApplication = (formData: FormData) =>
  api.post<{ message: string; application: Application }>('/api/applications', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const fetchApplications = () =>
  api.get<Application[]>('/api/applications');

export const approveApplication = (id: string) =>
  api.patch<{ message: string; application: Application }>(`/api/applications/${id}/approve`);
