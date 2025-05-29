// Lokasi file: types/index.ts

export interface Author {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Book {
  isbn: string;
  title: string;
  year: number;
  cover: string;
  author: Author;
  description?: string;
  pages?: number;
  language?: string;
  category?: Category;
  is_available?: boolean;
}