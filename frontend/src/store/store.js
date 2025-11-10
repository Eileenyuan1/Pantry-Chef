import { configureStore } from '@reduxjs/toolkit'
import { recipesApi } from '../api/recipesApi'

export const store = configureStore({
  reducer: {
    [recipesApi.reducerPath]: recipesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(recipesApi.middleware),
})

