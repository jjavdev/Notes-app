export interface Note {
  id: number;
  title: string;
  content: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  categories: Category[];
}

export interface Category {
  id: number;
  name: string;
}
