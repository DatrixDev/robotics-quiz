# Robotics Study Lab

Website luyện thi song ngữ Anh–Việt, gồm 5 chương × 50 câu, chạy bằng HTML/CSS/JavaScript thuần và không cần cài thư viện để sử dụng.

## Chạy trên máy

Trong thư mục này, chạy `python -m http.server 4173 --bind 127.0.0.1 --directory dist`, rồi truy cập http://127.0.0.1:4173. Cũng có thể mở trực tiếp `dist/index.html`; nên sử dụng địa chỉ HTTP cố định để lịch sử trình duyệt ổn định.

## Chức năng

- Practice: chọn đáp án → hiện ngay đúng/sai, đáp án đúng và lời giải → Next. Khóa lựa chọn sau khi chọn.
- Exam: có thể đổi đáp án và chuyển giữa các câu; chỉ chấm khi đã trả lời hết và nộp bài.
- Chọn ngẫu nhiên 10/20/50 câu không lặp; trộn độc lập thứ tự lựa chọn nhưng lưu đáp án bằng mã gốc.
- Đồng hồ đếm thời gian học thực tế khi đang mở màn hình làm bài; tạm dừng khi về trang đầu hoặc chuyển sang tab khác.
- Lưu tự động bài đang làm, lịch sử điểm, kết quả sai và tiến độ từng chương bằng localStorage. Dữ liệu gắn với trình duyệt và địa chỉ website, không đồng bộ giữa thiết bị. Xóa dữ liệu trình duyệt sẽ xóa lịch sử.
- Làm lại riêng câu sai từ kết quả của từng bài, kể cả từ lịch sử.

## Dữ liệu và nguồn

`source/questions-original.txt` là bản sao nguyên văn tài liệu được cung cấp. Chọn đúng 5 bộ #1–#5, mỗi bộ 50 câu. Bộ #1 là Chương 1; Robot Perception & Control là Chương 2.

`scripts/import-questions.mjs` tách câu hỏi, đáp án và giải thích thành `dist/questions.js`. Đáp án đúng tham chiếu mã A/B/C/D trong tài liệu gốc, không phụ thuộc thứ tự hiển thị.

Các bản dịch có sẵn được giữ nguyên. `source/translations.json` bổ sung bản dịch Việt cho các lựa chọn chỉ có tiếng Anh; các lựa chọn gốc chỉ có tiếng Việt được bổ sung bản dịch Anh và giữ tiếng Việt ở dòng dưới. Trường `original` luôn giữ nội dung lựa chọn gốc. Bản dịch bổ sung chỉ phục vụ hiển thị và không thay đổi đáp án đúng.

71 câu không có giải thích trong tài liệu (Sensor & Motion Control: 17; Computer Vision: 21; Autonomous Navigation: 33). Website ghi rõ không có giải thích gốc, không tự sáng tác. Các tiêu đề phần và phần tổng kết bên ngoài câu hỏi không được đưa vào lời giải.

Tái tạo dữ liệu: `node scripts/import-questions.mjs`. Kiểm tra cú pháp: `node --check dist/app.js`. Kịch bản kiểm thử trình duyệt trong `scripts/verify.cjs` dùng Playwright có sẵn trong môi trường phát triển, bao gồm chấm điểm sau đảo đáp án, giữ kín đáp án ở Exam, tiếp tục bài, luyện câu sai, lịch sử và màn hình nhỏ.

## Cấu trúc

- `dist/index.html`: trang chính.
- `dist/styles.css`: giao diện desktop/mobile.
- `dist/app.js`: trạng thái bài thi, chấm điểm, lưu tiến độ.
- `dist/questions.js`: 250 câu song ngữ.
- `source/`: tài liệu gốc và bản dịch bổ sung.
- `scripts/`: nhập dữ liệu và kiểm tra chức năng.

Website dùng phông Be Vietnam Pro từ Google Fonts, có phông hệ thống dự phòng khi ngoại tuyến. Công cụ WebMCP đọc tiến độ được đăng ký khi trình duyệt hỗ trợ.

