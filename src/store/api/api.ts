import { api as rtkApi } from './rtkApi';

// Types for saveChat
export interface SaveChatRequest {
  userMessage: string;
  aiResponse: string;
}

export interface SaveChatResponse {
  userId: string;
  userMessage: string;
  aiResponse: string;
  _id: string;
  timestamp: string;
}

export const api = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<any[], void>({
      query: () => ({
        url: '/products',
        method: 'GET',
      }),
    }),

    getStrains: build.query<any[], void>({
      query: () => ({
        url: '/strains',
        method: 'GET',
      }),
    }),
   
    getChatHistory: build.query<SaveChatResponse[], void>({
      query: () => ({
        url: '/chat/history',
        method: 'GET',
      }),
    }),
    saveChat: build.mutation<SaveChatResponse, SaveChatRequest>({
      query: (body) => ({
        url: '/chat/save',
        method: 'POST',
        data: body,
      }),
    }),
  }),
});

export const { useGetProductsQuery, useGetStrainsQuery, useGetChatHistoryQuery, useSaveChatMutation } = api;

