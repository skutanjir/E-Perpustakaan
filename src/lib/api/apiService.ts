// lib/api/apiService.ts (Simplified relevant part)
import axiosInstance from './axiosInstance';
import { AxiosRequestConfig, AxiosError } from 'axios';

export interface ApiErrorResponse {
    message: string;
    errors?: Array<{ field?: string; message: string }>;
    statusCode?: number;
}

const apiRequest = async <T = any, D = any>(
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
        console.error(
            `API request failed: ${method.toUpperCase()} ${url}`,
            axiosError.response?.data || axiosError.message
        );
        if (axiosError.response && axiosError.response.data) {
            const errData = axiosError.response.data;
            if (typeof errData === 'object' && errData !== null) {
                (errData as ApiErrorResponse).statusCode = axiosError.response.status;
            }
            throw errData;
        } else {
            throw new Error(axiosError.message || 'An unknown API error occurred') as ApiErrorResponse;
        }
    }
};

export const post = <T = any, D = any>(
    url: string,
    data: D,    config?: AxiosRequestConfig
): Promise<T> => {
    return apiRequest<T, D>('post', url, data, config);
};
