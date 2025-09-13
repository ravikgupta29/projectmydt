import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { useQuery, useMutation, UseMutationOptions, QueryKey } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { enqueueSnackbar } from 'notistack';
import { loginRoute } from '../constant/router';
import { ApiClientConfig, ApiErrorResponse, UseApiQueryOptions } from '../type/type';

const getApiConfig = (): { baseURL: string } => {
  const environment = process.env.NEXT_PUBLIC_ENV || 'development';
  const baseURL = process.env[`NEXT_PUBLIC_${environment.toUpperCase()}_API_URL`];

  if (!baseURL) {
    throw new Error(`Invalid environment configuration: ${environment}`);
  }

  return { baseURL };
};


const MAX_RETRIES = 3;
const RETRYABLE_STATUS_CODES = [408, 429, 502, 503, 504];

const api: AxiosInstance = axios.create({
  ...getApiConfig(),
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
  timeout: 30000,
});

let refreshPromise: Promise<string> | null = null;

const handleTokenRefresh = async (): Promise<string> => {
  try {
    const { data } = await api.post<{ accessToken: string }>('/auth/refresh', {
      refreshToken: Cookies.get('refreshToken'),
    });

    Cookies.set('accessToken', data.accessToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return data.accessToken;
  } catch (error) {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    window.location.href = loginRoute;
    throw error;
  }
};

api.interceptors.request.use(config => {
  const token = Cookies.get('accessToken');
  if (token) {
    config.headers = config.headers ?? new axios.AxiosHeaders();
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as ApiClientConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        refreshPromise = refreshPromise || handleTokenRefresh();
        const newToken = await refreshPromise;
        refreshPromise = null;

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    if (originalRequest.retry !== false && error.response && RETRYABLE_STATUS_CODES.includes(error.response.status)) {
      const retryCount = Number(originalRequest.headers?.['x-retry-count']) || 0;
      if (retryCount < MAX_RETRIES) {
        await new Promise(res => setTimeout(res, 1000 * (retryCount + 1)));
        return api({
          ...originalRequest,
          headers: { ...originalRequest.headers, 'x-retry-count': String(retryCount + 1) },
        });
      }
    }

    if (!originalRequest.skipErrorHandling) {
      const message = error.response?.data?.message || 'An unexpected error occurred';
      enqueueSnackbar(message, { variant: 'error' });
    }

    return Promise.reject(error);
  }
);

export const apiPaginationRequest = async <T>(
  config: ApiClientConfig,
  page: number,
  limit: number
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.request<T>({
      ...config,
      params: {
        ...config.params,
        page,
        limit,
      },
    });

    return response.data;
  } catch (error: any) {
    enqueueSnackbar(error?.response?.data?.message || 'Something went wrong', {
      variant: 'error',
    });
    throw error;
  }
};



const apiRequest = async <T>(config: ApiClientConfig): Promise<T> => {
  const response: AxiosResponse<T> = await api.request<T>(config);
  return response.data;
};

export const useApiQuery = <T>(
  queryKey: QueryKey,
  config: ApiClientConfig,
  options?: UseApiQueryOptions<T>
) => {
  const queryFn = () => apiRequest<T>(config);

  const query = useQuery<T, AxiosError<ApiErrorResponse>>({
    queryKey,
    queryFn,
    retry: (failureCount, error) =>
      failureCount < 2 && error.response?.status !== 401,
    refetchInterval: options?.pollingInterval,
    refetchIntervalInBackground: options?.enableBackgroundPolling,
    ...options,
  });

  if (query.isError && !options?.suppressError) {
    enqueueSnackbar(
      (query.error?.response?.data?.message || query.error?.message) as string,
      { variant: 'error' }
    );
  }

  return query;
};

export const useApiMutation = <T, V = unknown>(
  config: ApiClientConfig,
  options?: UseMutationOptions<T, AxiosError<ApiErrorResponse>, V> & { suppressError?: boolean; enableBackgroundPolling?: boolean }
) => {
  return useMutation<T, AxiosError<ApiErrorResponse>, V>({
    mutationFn: (variables) => apiRequest<T>({ ...config, data: variables }),
    onError: (error, variables, context) => {
      if (!options?.suppressError) {
        enqueueSnackbar(error.response?.data?.message || error.message, { variant: 'error' });
      }
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};


export const usePaginationQuery = <T>(
  queryKey: (string | number)[],
  config: ApiClientConfig,
  page: number,
  limit: number,
  enabled: boolean = true
) => {
  const query = useQuery<T>({
    queryKey: [...queryKey, page],
    queryFn: () => apiPaginationRequest<T>(config, page, limit),
    enabled,
    retry: false,
    placeholderData: (previousData) => previousData, // Keep previous data
    gcTime: Infinity, // Prevent cache garbage collection
  });
  if (query.error) {
    const error = query.error as AxiosError<ApiErrorResponse>;
    enqueueSnackbar(
      error.response?.data?.message || error.message || 'Failed to fetch data',
      { variant: 'error' }
    );
  }

  return query;
};







/**
 * const { data, error, isLoading } = useApiQuery(
  ['fetchData'],
  { url: '/api/data', method: 'GET' }
);
 */

/**
 * const mutation = useApiMutation(
  { url: '/api/data', method: 'POST' },
  {
    onSuccess: () => console.log('Data successfully submitted'),
    suppressError: true
  }
);

mutation.mutate({ name: 'John Doe', age: 30 });

 */
