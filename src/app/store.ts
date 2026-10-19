import { configureStore } from '@reduxjs/toolkit';
import booksReducer from '../features/books/booksSlice';
import { borrowLimitMiddleware } from './middleware';

export const store = configureStore({
  reducer: {
    books: booksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(borrowLimitMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
