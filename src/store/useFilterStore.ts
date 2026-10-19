import { create } from 'zustand';
import type { BookCategory } from '../features/books/types';

export type CategoryFilterType = 'Tất cả' | BookCategory;

interface FilterState {
  searchQuery: string;
  selectedCategory: CategoryFilterType;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: CategoryFilterType) => void;
  resetFilter: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  selectedCategory: 'Tất cả',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  resetFilter: () => set({ searchQuery: '', selectedCategory: 'Tất cả' }),
}));
