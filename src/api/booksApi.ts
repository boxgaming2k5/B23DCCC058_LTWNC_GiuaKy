import type { ApiResponse, Book } from '../features/books/types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'b1',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    category: 'CNTT',
    publishYear: 2008,
    availableCopies: 3,
    totalCopies: 5,
    description: 'Cẩm nang kinh điển về nghệ thuật viết mã sạch, dễ bảo trì cho lập trình viên chuyên nghiệp.',
    coverColor: '#4f46e5',
  },
  {
    id: 'b2',
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
    category: 'CNTT',
    publishYear: 1994,
    availableCopies: 2,
    totalCopies: 4,
    description: '23 mẫu thiết kế hướng đối tượng kinh điển định hình ngành công nghệ phần mềm.',
    coverColor: '#6366f1',
  },
  {
    id: 'b3',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    category: 'CNTT',
    publishYear: 2017,
    availableCopies: 1,
    totalCopies: 3,
    description: 'Kiến trúc hệ thống dữ liệu phân tán quy mô lớn, tính nhất quán và độ tin cậy cao.',
    coverColor: '#3b82f6',
  },
  {
    id: 'b4',
    title: 'You Don\'t Know JS Yet: Scope & Closures',
    author: 'Kyle Simpson',
    category: 'CNTT',
    publishYear: 2020,
    availableCopies: 0, // Hết sách - để test disable nút Mượn
    totalCopies: 2,
    description: 'Hiểu sâu về cơ chế Scope, Hoisting và Closures trong ngôn ngữ JavaScript hiện đại.',
    coverColor: '#0ea5e9',
  },
  {
    id: 'b5',
    title: 'Kinh Tế Học Vi Mô (Principles of Microeconomics)',
    author: 'N. Gregory Mankiw',
    category: 'Kinh tế',
    publishYear: 2020,
    availableCopies: 4,
    totalCopies: 6,
    description: 'Giáo trình chuẩn mực quốc tế về cung cầu, thị trường và hành vi người tiêu dùng.',
    coverColor: '#10b981',
  },
  {
    id: 'b6',
    title: 'Chiến Lược Đại Dương Xanh (Blue Ocean Strategy)',
    author: 'W. Chan Kim, Renée Mauborgne',
    category: 'Kinh tế',
    publishYear: 2015,
    availableCopies: 2,
    totalCopies: 4,
    description: 'Tạo lập khoảng trống thị trường không có cạnh tranh và mở rộng giới hạn kinh doanh.',
    coverColor: '#059669',
  },
  {
    id: 'b7',
    title: 'Nhà Đầu Tư Thông Minh (The Intelligent Investor)',
    author: 'Benjamin Graham',
    category: 'Kinh tế',
    publishYear: 2006,
    availableCopies: 0, // Hết sách
    totalCopies: 3,
    description: 'Triết lý đầu tư giá trị bền vững và quản trị rủi ro của người thầy Warren Buffett.',
    coverColor: '#14b8a6',
  },
  {
    id: 'b8',
    title: 'English Grammar in Use',
    author: 'Raymond Murphy',
    category: 'Ngoại ngữ',
    publishYear: 2019,
    availableCopies: 5,
    totalCopies: 8,
    description: 'Cuốn sách ngữ pháp tiếng Anh tự học bán chạy nhất thế giới cho trình độ trung cấp.',
    coverColor: '#f59e0b',
  },
  {
    id: 'b9',
    title: 'Oxford Collocations Dictionary for Students of English',
    author: 'Colin McIntosh',
    category: 'Ngoại ngữ',
    publishYear: 2009,
    availableCopies: 2,
    totalCopies: 3,
    description: 'Từ điển kết hợp từ vựng tự nhiên chuẩn học thuật dành cho người học tiếng Anh.',
    coverColor: '#d97706',
  },
  {
    id: 'b10',
    title: 'IELTS Academic Writing Task 1 & 2 Masterclass',
    author: 'Marc Roche',
    category: 'Ngoại ngữ',
    publishYear: 2021,
    availableCopies: 3,
    totalCopies: 5,
    description: 'Chiến thuật nâng band điểm phần thi viết học thuật với từ vựng chuyên sâu và cấu trúc câu.',
    coverColor: '#e11d48',
  },
];

/**
 * API giả lập lấy danh sách sách
 * Trả về Generic ApiResponse<Book[]>
 * Trễ 500ms theo yêu cầu (có tham số shouldFail để kiểm thử trạng thái lỗi)
 */
export function fetchBooksApi(shouldFail: boolean = false): Promise<ApiResponse<Book[]>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({
          ok: false,
          error: 'Không thể kết nối đến máy chủ thư viện. Vui lòng thử lại sau!',
        });
      } else {
        // Trả về bản sao của mảng INITIAL_BOOKS
        resolve({
          ok: true,
          data: JSON.parse(JSON.stringify(INITIAL_BOOKS)),
        });
      }
    }, 500);
  });
}
