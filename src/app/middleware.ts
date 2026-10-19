import type { Middleware } from '@reduxjs/toolkit';
import {
  borrowBook,
  setBorrowWarning,
  type BooksState,
} from '../features/books/booksSlice';

interface StoreStateWithBooks {
  books: BooksState;
}

/**
 * Redux Middleware tự viết để kiểm tra giới hạn mượn sách (Yêu cầu kỹ thuật 3)
 * Giới hạn mỗi sinh viên chỉ được mượn tối đa 3 cuốn sách cùng lúc.
 * Nếu vượt quá 3 cuốn, chặn action borrowBook và phát cảnh báo.
 */
export const borrowLimitMiddleware: Middleware<{}, StoreStateWithBooks> =
  (storeApi) => (next) => (action) => {
    if (borrowBook.match(action)) {
      const state = storeApi.getState();
      const currentBorrowedCount = state.books.borrowedBooks.length;

      if (currentBorrowedCount >= 3) {
        storeApi.dispatch(
          setBorrowWarning(
            'Cảnh báo: Bạn chỉ được mượn tối đa 3 cuốn sách cùng một lúc!'
          )
        );
        // Chặn action không cho đi tiếp vào reducer
        return;
      }
    }

    return next(action);
  };
