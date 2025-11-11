import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Use relative path so Vite proxy works for both local and mobile access
const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
})

export const recipesApi = createApi({
  reducerPath: 'recipesApi',
  baseQuery,
  tagTypes: ['Recipe'],
  endpoints: (builder) => ({
    getRecipes: builder.query({
      query: () => '/recipes/',
      providesTags: ['Recipe'],
    }),
    generateRecipe: builder.mutation({
      query: (ingredients) => ({
        url: '/recipes/generate/',
        method: 'POST',
        body: { ingredients },
      }),
      invalidatesTags: ['Recipe'],
    }),
  }),
})

export const {
  useGetRecipesQuery,
  useGenerateRecipeMutation,
} = recipesApi

