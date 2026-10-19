// ==========================================
// Types & Interfaces for Mini Library
// Buổi 1: TypeScript nâng cao (generic, utility types, type guard)
// ==========================================

export type BookCategory = 'CNTT' | 'Kinh tế' | 'Ngoại ngữ';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  publishYear: number;
  availableCopies: number;
  totalCopies: number;
  description?: string;
  coverColor?: string;
}

// ------------------------------------------
// Utility Types (Yêu cầu kỹ thuật 1: dùng ít nhất 2 Utility Types)
// ------------------------------------------

// 1. Pick: Chọn lọc một số trường để hiển thị tóm tắt
export type BookSummary = Pick<Book, 'id' | 'title' | 'author' | 'category' | 'availableCopies'>;

// 2. Omit: Loại bỏ trường totalCopies khi lưu thông tin sách đang mượn
export type BorrowedBookRecord = Omit<Book, 'totalCopies'> & {
  borrowedAt: string;
};

// 3. Record: Thống kê số lượng sách theo từng thể loại
export type CategoryBookCount = Record<BookCategory, number>;

// 4. Readonly: Dữ liệu sách bất biến khi render
export type ImmutableBook = Readonly<Book>;

// ------------------------------------------
// Generic API Response & Type Guards
// ------------------------------------------

export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/**
 * Custom Type Guard để kiểm tra kết quả API thành công
 * Giúp TypeScript tự động thu hẹp kiểu về { ok: true; data: T }
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is { ok: true; data: T } {
  return response.ok === true;
}

/**
 * Custom Type Guard để kiểm tra kết quả API thất bại
 */
export function isErrorResponse<T>(
  response: ApiResponse<T>
): response is { ok: false; error: string } {
  return response.ok === false;
}
