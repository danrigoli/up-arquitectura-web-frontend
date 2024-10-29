export type Category = {
  id: number;
  name: string;
}

export type CreateCategory = {
  name: string;
}

export interface UpdateCategory extends Partial<CreateCategory> {
  id: number;
}