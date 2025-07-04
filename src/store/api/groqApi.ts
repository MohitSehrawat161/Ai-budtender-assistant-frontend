import { api } from './rtkApi';

export interface GroqChatHistoryItem {
  role: 'user' | 'system';
  content: string;
}

export const groqApi = api.injectEndpoints({
  endpoints: (build) => ({
    recommendProducts: build.mutation<{ recommendations: { products: any[]; strains: any[] } }, { preferences: { goals: string[]; experience: string; productType: string } }>(
      {
        query: (body) => ({
          url: '/groq/recommend-products',
          method: 'POST',
          data: body,
        }),
      }
    ),
    chatWithGroq: build.mutation<{ reply: string }, { message: string, history: GroqChatHistoryItem[] }>(
      {
        query: (body) => ({
          url: '/groq/chat',
          method: 'POST',
          data: body,
        }),
      }
    ),
   
  }),
});

export const { useRecommendProductsMutation, useChatWithGroqMutation } = groqApi;
