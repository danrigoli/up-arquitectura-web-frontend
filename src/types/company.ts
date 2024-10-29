export type Company = {
  id: number;
  name: string;
  address: string;
}

export type CreateCompany = {
  name: string;
  address: string;
}

export interface UpdateCompany extends Partial<CreateCompany> {
  id: number;
}