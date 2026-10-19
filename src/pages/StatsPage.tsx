import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import type {
  Book,
  BookCategory,
  BorrowedBookRecord,
  CategoryBookCount,
} from '../features/books/types';

/**
 * Trang Thống Kê (Route /stats)
 * Yêu cầu 9: Hiển thị số đầu sách theo từng thể loại và số sách đang mượn
 * Được tải bằng React.lazy + Suspense (Yêu cầu 6)
 */
export default function StatsPage() {
  const { items: books, borrowedBooks } = useAppSelector((state) => state.books);

  // Thống kê số đầu sách theo từng thể loại (Sử dụng Record<BookCategory, number> từ types)
  const categoryStats = useMemo(() => {
    const stats: CategoryBookCount = {
      'CNTT': 0,
      'Kinh tế': 0,
      'Ngoại ngữ': 0,
    };

    books.forEach((book: Book) => {
      if (stats[book.category] !== undefined) {
        stats[book.category] += 1;
      }
    });

    return stats;
  }, [books]);

  // Thống kê tổng số bản sách và tổng số bản còn lại
  const totalStats = useMemo(() => {
    const totalCopies = books.reduce((acc: number, b: Book) => acc + b.totalCopies, 0);
    const availableCopies = books.reduce((acc: number, b: Book) => acc + b.availableCopies, 0);
    return {
      totalTitles: books.length,
      totalCopies,
      availableCopies,
      borrowedCount: borrowedBooks.length,
    };
  }, [books, borrowedBooks]);

  const categories: BookCategory[] = ['CNTT', 'Kinh tế', 'Ngoại ngữ'];

  return (
    <div className="stats-page">
      <div className="stats-header">
        <div>
          <h2>Báo Cáo & Thống Kê Thư Viện</h2>
          <p className="subtitle">Tổng quan dữ liệu kho sách và tình trạng mượn trả của sinh viên</p>
        </div>
        <Link to="/" className="btn-secondary">
          &larr; Quay lại danh sách sách
        </Link>
      </div>

      <div className="stats-summary-grid">
        <div className="stat-card highlight">
          <span className="stat-label">Sách Đang Mượn</span>
          <span className="stat-value">{totalStats.borrowedCount} / 3</span>
          <span className="stat-hint">Giới hạn tối đa 3 cuốn / sinh viên</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Tổng Số Đầu Sách</span>
          <span className="stat-value">{totalStats.totalTitles}</span>
          <span className="stat-hint">Phân bổ trên 3 chuyên ngành chính</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Tổng Số Bản Sách Còn Lại</span>
          <span className="stat-value">{totalStats.availableCopies}</span>
          <span className="stat-hint">Trên tổng số {totalStats.totalCopies} bản</span>
        </div>
      </div>

      <div className="stats-category-section">
        <h3>Số Đầu Sách Theo Từng Thể Loại</h3>
        <div className="category-stats-grid">
          {categories.map((cat) => {
            const count = categoryStats[cat];
            const percent = totalStats.totalTitles > 0
              ? Math.round((count / totalStats.totalTitles) * 100)
              : 0;

            return (
              <div key={cat} className="category-stat-box">
                <div className="cat-title-row">
                  <span className={`category-tag category-${cat}`}>{cat}</span>
                  <span className="cat-count">{count} đầu sách</span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="cat-percent">{percent}% tổng đầu sách</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="borrowed-detail-section">
        <h3>Danh Sách Sinh Viên Đang Mượn ({borrowedBooks.length} cuốn)</h3>
        {borrowedBooks.length === 0 ? (
          <p className="empty-notice">Hiện tại bạn chưa mượn cuốn sách nào.</p>
        ) : (
          <div className="borrowed-list-table">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên sách</th>
                  <th>Tác giả</th>
                  <th>Thể loại</th>
                  <th>Ngày mượn</th>
                </tr>
              </thead>
              <tbody>
                {borrowedBooks.map((item: BorrowedBookRecord, index: number) => (
                  <tr key={`${item.id}-${index}`}>
                    <td>{index + 1}</td>
                    <td className="bold">{item.title}</td>
                    <td>{item.author}</td>
                    <td>
                      <span className={`category-tag category-${item.category}`}>
                        {item.category}
                      </span>
                    </td>
                    <td>{item.borrowedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
