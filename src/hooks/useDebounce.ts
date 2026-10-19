import { useEffect, useState } from 'react';

/**
 * Custom hook generic useDebounce<T> (Yêu cầu kỹ thuật 5)
 * Trì hoãn việc cập nhật giá trị cho đến khi người dùng ngừng thao tác trong khoảng delay (ms)
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
