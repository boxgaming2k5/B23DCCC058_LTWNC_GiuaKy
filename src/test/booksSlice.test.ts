import { describe, expect, it } from 'vitest';
import booksReducer, {
  borrowBook,
  clearBorrowWarning,
  fetchBooks,
  initialBooksState,
  returnBook,
  setBorrowWarning,
  type BooksState,
} from '../features/books/booksSlice';
import type { Book } from '../features/books/types';

describe('booksSlice reducer tests (Tối thiểu 4 tests)', () => {
  const sampleBook: Book = {
    id: 'b1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'CNTT',
    publishYear: 2008,
    availableCopies: 2,
    totalCopies: 3,
  };

  // Test 1: Khởi tạo state mặc định
  it('1. Phải trả về state ban đầu khi truyền action không xác định', () => {
    expect(booksReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialBooksState
    );
  });

  // Test 2: Xử lý fetchBooks.pending
  it('2. Phải chuyển status sang "loading" khi fetchBooks.pending', () => {
    const nextState = booksReducer(initialBooksState, {
      type: fetchBooks.pending.type,
    });
    expect(nextState.status).toBe('loading');
    expect(nextState.error).toBeNull();
  });

  // Test 3: Xử lý fetchBooks.fulfilled
  it('3. Phải cập nhật items và status "succeeded" khi fetchBooks.fulfilled', () => {
    const books: Book[] = [sampleBook];
    const nextState = booksReducer(initialBooksState, {
      type: fetchBooks.fulfilled.type,
      payload: books,
    });
    expect(nextState.status).toBe('succeeded');
    expect(nextState.items).toEqual(books);
    expect(nextState.error).toBeNull();
  });

  // Test 4: Xử lý fetchBooks.rejected
  it('4. Phải cập nhật error và status "failed" khi fetchBooks.rejected', () => {
    const errorMsg = 'Lỗi kết nối máy chủ';
    const nextState = booksReducer(initialBooksState, {
      type: fetchBooks.rejected.type,
      payload: errorMsg,
    });
    expect(nextState.status).toBe('failed');
    expect(nextState.error).toBe(errorMsg);
  });

  // Test 5: Xử lý borrowBook (giảm số lượng còn lại, thêm vào borrowedBooks)
  it('5. Phải giảm số bản còn lại và thêm sách vào danh sách đang mượn khi borrowBook', () => {
    const previousState: BooksState = {
      ...initialBooksState,
      items: [{ ...sampleBook, availableCopies: 2 }],
      borrowedBooks: [],
    };

    const nextState = booksReducer(previousState, borrowBook('b1'));
    expect(nextState.items[0].availableCopies).toBe(1);
    expect(nextState.borrowedBooks).toHaveLength(1);
    expect(nextState.borrowedBooks[0].id).toBe('b1');
  });

  // Test 6: Xử lý returnBook (tăng số lượng còn lại, xóa khỏi borrowedBooks)
  it('6. Phải tăng số bản còn lại và loại bỏ khỏi danh sách đang mượn khi returnBook', () => {
    const previousState: BooksState = {
      ...initialBooksState,
      items: [{ ...sampleBook, availableCopies: 1 }],
      borrowedBooks: [
        {
          id: 'b1',
          title: sampleBook.title,
          author: sampleBook.author,
          category: sampleBook.category,
          publishYear: sampleBook.publishYear,
          availableCopies: 1,
          borrowedAt: '2026-10-19',
        },
      ],
    };

    const nextState = booksReducer(previousState, returnBook('b1'));
    expect(nextState.items[0].availableCopies).toBe(2);
    expect(nextState.borrowedBooks).toHaveLength(0);
  });

  // Test 7: Cảnh báo mượn sách
  it('7. Phải cập nhật và xóa cảnh báo mượn sách với setBorrowWarning và clearBorrowWarning', () => {
    const warningMsg = 'Bạn đã đạt giới hạn 3 cuốn sách!';
    let state = booksReducer(initialBooksState, setBorrowWarning(warningMsg));
    expect(state.borrowWarning).toBe(warningMsg);

    state = booksReducer(state, clearBorrowWarning());
    expect(state.borrowWarning).toBeNull();
  });
});
