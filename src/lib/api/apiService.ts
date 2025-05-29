import axiosInstance from './axiosInstance';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { Book } from '@/types'; // Pastikan tipe Book sudah didefinisikan

export interface ApiErrorResponse {
    message: string;
    error?: string;
    errors?: Array<{ field?: string; message:string }>;
    statusCode?: number;
}

// PERUBAHAN: Tambahkan 'export' di sini
export const apiRequest = async <T = any, D = any>(
    method: string,
    url: string,
    data?: D,
    config?: AxiosRequestConfig
): Promise<T> => {
    try {
        const response = await axiosInstance.request<T>({
            method,
            url,
            data,
            ...config,
        });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        if (axiosError.response && axiosError.response.data) {
            throw axiosError.response.data;
        } else {
            throw { message: axiosError.message || 'An unknown API error occurred' } as ApiErrorResponse;
        }
    }
};

export const get = <T = any>(
    url: string, 
    config?: AxiosRequestConfig
): Promise<T> => {
    return apiRequest<T>('get', url, undefined, config);
};

export const post = <T = any, D = any>(
    url: string, 
    data: D, 
    config?: AxiosRequestConfig
): Promise<T> => {
    return apiRequest<T, D>('post', url, data, config);
};

// Contoh fungsi yang sudah ada, pastikan tipe Book ada di @/types
export const getBookByIsbn = async (isbn: string): Promise<Book | null> => {
    const response = await get<{ data: Book[] }>('/books/search', {
        params: {
            bookId: isbn,
            pageSize: '1'
        }
    });
    return response.data[0] || null;
};