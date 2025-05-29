import axios, {
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosError,
} from 'axios';
import Cookies from "js-cookie";

const API_BASE_URL: string = 'http://localhost:3000/api';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor untuk menambahkan access token ke setiap permintaan
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = Cookies.get('accessToken');
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
        return Promise.reject(error);
    }
);

// Interceptor untuk menangani token yang kedaluwarsa secara otomatis
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = Cookies.get('refreshToken');
                if (!refreshToken) {
                    return Promise.reject(new Error("Sesi tidak valid, refresh token tidak ada."));
                }
                
                const response = await axios.post(`${API_BASE_URL}/users/token`, {
                    refreshToken: refreshToken
                });
                
                const { accessToken: newAccessToken } = response.data.data;
                Cookies.set('accessToken', newAccessToken);
                
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                // Jika refresh token gagal, teruskan error agar ditangani komponen
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;