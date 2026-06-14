import type { Note, Category } from '../types';

const BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${url}`, {
    headers,
    ...options,
  });
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw new Error(`HTTP ${res.status}`);
  }
  try {
    return await res.json();
  } catch {
    return undefined as T;
  }
}

export const notesApi = {
  list: (archived?: boolean, categoryId?: number) => {
    const params = new URLSearchParams();
    if (archived !== undefined) params.set('archived', String(archived));
    if (categoryId !== undefined) params.set('categoryId', String(categoryId));
    const qs = params.toString();
    return request<Note[]>(`/notes${qs ? `?${qs}` : ''}`);
  },
  get: (id: number) => request<Note>(`/notes/${id}`),
  create: (data: { title: string; content: string; categoryIds?: number[] }) =>
    request<Note>('/notes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Note>) =>
    request<Note>(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggleArchive: (id: number) =>
    request<Note>(`/notes/${id}/archive`, { method: 'PATCH' }),
  delete: (id: number) =>
    request<void>(`/notes/${id}`, { method: 'DELETE' }),
  addCategory: (noteId: number, categoryId: number) =>
    request<Note>(`/notes/${noteId}/categories`, {
      method: 'POST',
      body: JSON.stringify({ categoryId }),
    }),
  removeCategory: (noteId: number, categoryId: number) =>
    request<Note>(`/notes/${noteId}/categories/${categoryId}`, { method: 'DELETE' }),
};

export const categoriesApi = {
  list: () => request<Category[]>('/categories'),
  create: (name: string) =>
    request<Category>('/categories', { method: 'POST', body: JSON.stringify({ name }) }),
  delete: (id: number) =>
    request<void>(`/categories/${id}`, { method: 'DELETE' }),
};
