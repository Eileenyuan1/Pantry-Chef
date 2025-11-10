import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8000/api',
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
  }),
})

export const {
  useGetRecipesQuery,
} = recipesApi

