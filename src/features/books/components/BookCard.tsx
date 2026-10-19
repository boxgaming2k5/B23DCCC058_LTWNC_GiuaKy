import React from 'react';
import type { Book } from '../types';

interface BookCardProps {
  book: Book;
  onBorrow: (bookId: string) => void;
}

/**
 * Component hiển thị 1 cuốn sách
 * Tối ưu hiệu năng: được bọc bằng React.memo (Yêu cầu kỹ thuật 6)
 */
export const BookCard = React.memo(function BookCard({
  book,
  onBorrow,
}: BookCardProps) {
  const isOutOfStock = book.availableCopies <= 0;

  return (
    <div
      className="book-card"
      data-testid={`book-card-${book.id}`}
      style={{ borderLeftColor: book.coverColor || '#4f46e5' }}
    >
      <div className="book-card-header">
        <span className={`category-tag category-${book.category}`}>
          {book.category}
        </span>
        <span className="publish-year">Năm: {book.publishYear}</span>
      </div>

      <h3 className="book-title" title={book.title}>
        {book.title}
      </h3>
      <p className="book-author">Tác giả: {book.author}</p>

      {book.description && (
        <p className="book-desc">{book.description}</p>
      )}

      <div className="book-card-footer">
        <div className="copies-info">
          <span>Còn lại: </span>
          <strong
            className={`copies-count ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}
          >
            {book.availableCopies} / {book.totalCopies} bản
          </strong>
        </div>

        <button
          type="button"
          className="btn-borrow"
          disabled={isOutOfStock}
          onClick={() => onBorrow(book.id)}
          aria-label={`Mượn sách ${book.title}`}
        >
          {isOutOfStock ? 'Hết sách' : 'Mượn sách'}
        </button>
      </div>
    </div>
  );
});
