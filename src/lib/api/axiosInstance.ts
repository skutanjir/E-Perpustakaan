import axios, {
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosError,
} from 'axios';

const API_BASE_URL: string =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Request Interceptor ---
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
        // Do something with request error
        return Promise.reject(error);
    }
);

// --- Response Interceptor ---
// axiosInstance.interceptors.response.use(
//     (response: AxiosResponse): AxiosResponse => {
//         // Any status code that lie within the range of 2xx cause this function to trigger
//         // You can transform response data here if needed
//         return response;
//     },
//     (error: AxiosError<{ message?: string; errors?: any[] }>): Promise<AxiosError> => { // Type for error.response.data
//         // Any status codes that falls outside the range of 2xx cause this function to trigger
//         if (error.response) {
//             // The request was made and the server responded with a status code
//             // that falls out of the range of 2xx
//             console.error('API Error Response:', error.response.data);
//             console.error('Status:', error.response.status);
//             console.error('Headers:', error.response.headers);
//
//             // Example: Handle specific error statuses
//             if (error.response.status === 401) {
//                 // Handle unauthorized errors, e.g., redirect to login
//                 console.error('Unauthorized. Redirecting to login or refreshing token...');
//                 // if (typeof window !== 'undefined') {
//                 //   // window.location.href = '/login';
//                 // }
//             } else if (error.response.status === 403) {
//                 console.error('Forbidden. You do not have permission.');
//             }
//             // You might want to throw a more structured error or handle it globally
//         } else if (error.request) {
//             // The request was made but no response was received
//             console.error('API No Response:', error.request);
//         } else {
//             // Something happened in setting up the request that triggered an Error
//             console.error('API Setup Error:', error.message);
//         }
//         // It's important to return a Promise.reject to propagate the error
//         // so that the .catch() block in your service/component can handle it.
//         return Promise.reject(error);
//     }
// );

export default axiosInstance;