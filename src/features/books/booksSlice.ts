import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchBooksApi } from '../../api/booksApi';
import {
  isSuccessResponse,
  type Book,
  type BorrowedBookRecord,
} from './types';

export interface BooksState {
  items: Book[];
  borrowedBooks: BorrowedBookRecord[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  borrowWarning: string | null;
}

export const initialBooksState: BooksState = {
  items: [],
  borrowedBooks: [],
  status: 'idle',
  error: null,
  borrowWarning: null,
};

/**
 * Async Thunk lấy danh sách sách từ API giả lập
 * Xử lý đầy đủ 3 trạng thái: pending, fulfilled, rejected
 * Sử dụng custom Type Guard `isSuccessResponse` để kiểm tra kết quả
 */
export const fetchBooks = createAsyncThunk<
  Book[],
  { shouldFail?: boolean } | undefined,
  { rejectValue: string }
>('books/fetchBooks', async (params, { rejectWithValue }) => {
  const shouldFail = params?.shouldFail ?? false;
  const response = await fetchBooksApi(shouldFail);

  if (isSuccessResponse(response)) {
    return response.data;
  }

  return rejectWithValue(response.error);
});

export const booksSlice = createSlice({
  name: 'books',
  initialState: initialBooksState,
  reducers: {
    borrowBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      const book = state.items.find((b) => b.id === bookId);

      if (book && book.availableCopies > 0) {
        book.availableCopies -= 1;
        const borrowedRecord: BorrowedBookRecord = {
          id: book.id,
          title: book.title,
          author: book.author,
          category: book.category,
          publishYear: book.publishYear,
          availableCopies: book.availableCopies,
          description: book.description,
          coverColor: book.coverColor,
          borrowedAt: new Date().toLocaleDateString('vi-VN'),
        };
        state.borrowedBooks.push(borrowedRecord);
        state.borrowWarning = null;
      }
    },
    returnBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      const index = state.borrowedBooks.findIndex((b) => b.id === bookId);

      if (index !== -1) {
        state.borrowedBooks.splice(index, 1);
        const book = state.items.find((b) => b.id === bookId);
        if (book) {
          book.availableCopies += 1;
        }
      }
    },
    setBorrowWarning: (state, action: PayloadAction<string>) => {
      state.borrowWarning = action.payload;
    },
    clearBorrowWarning: (state) => {
      state.borrowWarning = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload || 'Không thể kết nối đến máy chủ thư viện.';
      });
  },
});

export const {
  borrowBook,
  returnBook,
  setBorrowWarning,
  clearBorrowWarning,
} = booksSlice.actions;

export default booksSlice.reducer;
