import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BookCard } from '../features/books/components/BookCard';
import type { Book } from '../features/books/types';

describe('BookCard component tests (Tối thiểu 3 tests)', () => {
  const mockBook: Book = {
    id: 'test-1',
    title: 'Clean Architecture',
    author: 'Robert C. Martin',
    category: 'CNTT',
    publishYear: 2017,
    availableCopies: 3,
    totalCopies: 5,
  };

  // Test 1: Hiển thị đúng thông tin sách
  it('1. Hiển thị đúng thông tin sách (tên, tác giả, thể loại, năm XB, số bản còn lại)', () => {
    const handleBorrow = vi.fn();
    render(<BookCard book={mockBook} onBorrow={handleBorrow} />);

    expect(screen.getByText('Clean Architecture')).toBeInTheDocument();
    expect(screen.getByText(/Robert C. Martin/i)).toBeInTheDocument();
    expect(screen.getByText('CNTT')).toBeInTheDocument();
    expect(screen.getByText(/Năm: 2017/i)).toBeInTheDocument();
    expect(screen.getByText(/3 \/ 5 bản/i)).toBeInTheDocument();
  });

  // Test 2: Click "Mượn" gọi đúng hàm với đúng id
  it('2. Click nút "Mượn" gọi đúng hàm onBorrow với đúng book id', async () => {
    const user = userEvent.setup();
    const handleBorrow = vi.fn();
    render(<BookCard book={mockBook} onBorrow={handleBorrow} />);

    const borrowButton = screen.getByRole('button', { name: /Mượn sách Clean Architecture/i });
    expect(borrowButton).toBeEnabled();

    await user.click(borrowButton);
    expect(handleBorrow).toHaveBeenCalledTimes(1);
    expect(handleBorrow).toHaveBeenCalledWith('test-1');
  });

  // Test 3: Nút bị vô hiệu hoá khi hết bản (availableCopies === 0)
  it('3. Nút "Mượn" bị vô hiệu hoá (disabled) khi sách đã hết bản', () => {
    const outOfStockBook: Book = {
      ...mockBook,
      id: 'test-2',
      availableCopies: 0,
    };
    const handleBorrow = vi.fn();
    render(<BookCard book={outOfStockBook} onBorrow={handleBorrow} />);

    const borrowButton = screen.getByRole('button', { name: /Mượn sách Clean Architecture/i });
    expect(borrowButton).toBeDisabled();
    expect(borrowButton).toHaveTextContent('Hết sách');
  });
});
