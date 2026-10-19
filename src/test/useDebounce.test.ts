import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebounce } from '../hooks/useDebounce';

describe('useDebounce custom hook test (Dùng fake timers)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Chỉ cập nhật giá trị debounced sau đúng khoảng thời gian delay 300ms', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'clean code', delay: 300 },
      }
    );

    // Giá trị khởi tạo
    expect(result.current).toBe('clean code');

    // Người dùng thay đổi input liên tục
    rerender({ value: 'clean code javascript', delay: 300 });

    // Giá trị chưa thay đổi ngay
    expect(result.current).toBe('clean code');

    // Giả lập trôi qua 200ms (chưa đủ 300ms)
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('clean code');

    // Giả lập trôi qua tiếp 100ms (tổng cộng 300ms)
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('clean code javascript');
  });
});
