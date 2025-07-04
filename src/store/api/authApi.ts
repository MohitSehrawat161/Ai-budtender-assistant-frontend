import { api } from './rtkApi';

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<{ token: string,data:{name:string,email:string} }, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login', // adjust to your backend route
        method: 'POST',
        data: credentials,
      }),
    }),
    signup: build.mutation<{ success: boolean, message: string }, { name: string; email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/signup', // adjust to your backend route
        method: 'POST',
        data: credentials,
      }),
    }),
    // Add more endpoints as needed
  }),
});

export const { useLoginMutation, useSignupMutation } = authApi;
