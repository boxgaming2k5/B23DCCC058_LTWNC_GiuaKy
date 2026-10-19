import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  borrowBook,
  clearBorrowWarning,
  fetchBooks,
  returnBook,
} from '../features/books/booksSlice';
import { BookCard } from '../features/books/components/BookCard';
import type { Book, BorrowedBookRecord } from '../features/books/types';
import { useDebounce } from '../hooks/useDebounce';
import { useFilterStore, type CategoryFilterType } from '../store/useFilterStore';

const CATEGORIES: CategoryFilterType[] = ['Tất cả', 'CNTT', 'Kinh tế', 'Ngoại ngữ'];

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { items: books, borrowedBooks, status, error, borrowWarning } = useAppSelector(
    (state) => state.books
  );

  // Zustand state
  const { searchQuery, selectedCategory, setSearchQuery, setSelectedCategory } =
    useFilterStore();

  // Custom hook debounce 300ms (Yêu cầu kỹ thuật 5 & Chức năng 3)
  const debouncedSearch = useDebounce<string>(searchQuery, 300);

  // Danh sách sau khi lọc được tính bằng useMemo (Yêu cầu kỹ thuật 6)
  const filteredBooks = useMemo(() => {
    return books.filter((book: Book) => {
      // 1. Lọc theo thể loại
      const matchesCategory =
        selectedCategory === 'Tất cả' || book.category === selectedCategory;

      // 2. Tìm kiếm theo tên sách hoặc tác giả (không phân biệt hoa thường)
      const query = debouncedSearch.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [books, selectedCategory, debouncedSearch]);

  // Các handler truyền xuống bọc bằng useCallback (Yêu cầu kỹ thuật 6)
  const handleBorrow = useCallback(
    (bookId: string) => {
      dispatch(borrowBook(bookId));
    },
    [dispatch]
  );

  const handleReturn = useCallback(
    (bookId: string) => {
      dispatch(returnBook(bookId));
    },
    [dispatch]
  );

  const handleRetry = useCallback(() => {
    dispatch(fetchBooks({ shouldFail: false }));
  }, [dispatch]);

  const handleSimulateError = useCallback(() => {
    dispatch(fetchBooks({ shouldFail: true }));
  }, [dispatch]);

  return (
    <div className="home-page">
      {/* Cảnh báo khi vượt quá giới hạn mượn 3 cuốn */}
      {borrowWarning && (
        <div className="alert-banner warning">
          <span>{borrowWarning}</span>
          <button
            type="button"
            className="btn-close-alert"
            onClick={() => dispatch(clearBorrowWarning())}
          >
            &times;
          </button>
        </div>
      )}

      {/* Thanh tìm kiếm và bộ lọc */}
      <section className="filter-section">
        <div className="search-bar-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm theo tên sách hoặc tác giả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => setSearchQuery('')}
            >
              &times;
            </button>
          )}
        </div>

        <div className="category-filter-bar">
          <span className="filter-label">Thể loại:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Nút giả lập trường hợp lỗi để kiểm tra theo yêu cầu 1 */}
        <div className="api-test-actions">
          <button
            type="button"
            className="btn-test-action"
            onClick={handleSimulateError}
            title="Kiểm tra trạng thái báo lỗi của API"
          >
            Giả lập lỗi API
          </button>
          <button
            type="button"
            className="btn-test-action reload"
            onClick={handleRetry}
            title="Tải lại danh sách sách thành công"
          >
            Tải lại sách
          </button>
        </div>
      </section>

      {/* Section sách đang mượn */}
      <section className="borrowed-section">
        <div className="borrowed-header">
          <h3>
            Sách Bạn Đang Mượn ({borrowedBooks.length} / 3 cuốn)
          </h3>
          {borrowedBooks.length >= 3 && (
            <span className="max-reached-badge">Đã đạt giới hạn tối đa</span>
          )}
        </div>

        {borrowedBooks.length === 0 ? (
          <p className="borrowed-empty">Bạn chưa mượn cuốn sách nào.</p>
        ) : (
          <div className="borrowed-chips">
            {borrowedBooks.map((item: BorrowedBookRecord) => (
              <div key={item.id} className="borrowed-chip">
                <div className="chip-info">
                  <span className="chip-title">{item.title}</span>
                  <span className="chip-meta">({item.category} - {item.author})</span>
                </div>
                <button
                  type="button"
                  className="btn-return"
                  onClick={() => handleReturn(item.id)}
                >
                  Trả sách
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Danh sách sách */}
      <section className="books-list-section">
        <div className="books-list-header">
          <h3>
            Kho Sách ({filteredBooks.length} kết quả)
          </h3>
        </div>

        {/* Trạng thái Đang tải... (Yêu cầu 1) */}
        {status === 'loading' && (
          <div className="status-container loading-state">
            <div className="spinner" />
            <p>Đang tải danh sách sách từ thư viện...</p>
          </div>
        )}

        {/* Trạng thái Lỗi API (Yêu cầu 1) */}
        {status === 'failed' && (
          <div className="status-container error-state">
            <p className="error-text">{error}</p>
            <button type="button" className="btn-retry" onClick={handleRetry}>
              Thử lại
            </button>
          </div>
        )}

        {/* Danh sách sách đã tải */}
        {status === 'succeeded' && (
          <>
            {filteredBooks.length === 0 ? (
              <div className="empty-results">
                <p>Không tìm thấy cuốn sách nào phù hợp với bộ lọc hiện tại.</p>
              </div>
            ) : (
              <div className="books-grid">
                {/* Key không dùng index theo yêu cầu kỹ thuật 6 */}
                {filteredBooks.map((book: Book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onBorrow={handleBorrow}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
