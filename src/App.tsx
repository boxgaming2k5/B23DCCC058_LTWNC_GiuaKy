import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAppDispatch } from './app/hooks';
import { Navbar } from './components/Navbar';
import { fetchBooks } from './features/books/booksSlice';
import HomePage from './pages/HomePage';
import './App.css';

// Lazy loading trang Thống kê theo yêu cầu kỹ thuật 6
const StatsPage = lazy(() => import('./pages/StatsPage'));

function AppContent() {
  const dispatch = useAppDispatch();

  // Khi khởi động app, lấy danh sách sách từ API giả lập (Yêu cầu 1)
  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Suspense
          fallback={
            <div className="lazy-loading">
              <div className="spinner" />
              <p>Đang tải trang thống kê...</p>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="app-footer">
        <p>Mini Library &copy; Khoa CNTT - Kiểm tra giữa kỳ Lập trình Web Nâng Cao</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
