import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import axiosInstance from '../../lib/axios';

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axiosInstance({ url: baseUrl + url, method, data, params });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const api = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '/api' }),
  endpoints: () => ({}),
});
