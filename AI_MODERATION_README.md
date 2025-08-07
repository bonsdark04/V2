# Hướng dẫn sử dụng chức năng AI Moderation cho Comment

## Tổng quan

Chức năng AI Moderation tự động kiểm duyệt comment bằng AI để phát hiện nội dung vi phạm và ẩn chúng đi.

## Cài đặt

### 1. Cài đặt dependencies
```bash
npm install axios
```

### 2. Cấu hình OpenAI API Key
Thêm vào file `.env`:
```
OPENAI_API_KEY=your_openai_api_key_here
```

## Cách hoạt động

### 1. Tự động kiểm duyệt khi tạo comment
- Khi user tạo comment mới, hệ thống sẽ tự động gửi nội dung đến OpenAI Moderation API
- Nếu phát hiện vi phạm, comment sẽ được đặt status = "inactive"
- Nếu không vi phạm, comment sẽ được đặt status = "active"

### 2. Các loại vi phạm được kiểm tra
- Hate speech (ngôn từ thù địch)
- Sexual content (nội dung khiêu dâm)
- Violence (bạo lực)
- Self-harm (tự hại)
- Inappropriate language (từ ngữ không phù hợp)

### 3. Fallback moderation
Nếu không có OpenAI API key hoặc lỗi kết nối, hệ thống sẽ sử dụng fallback moderation với danh sách từ khóa cấm cơ bản.

## Quản lý comment trong Admin

### Trang Comment vi phạm
- URL: `/admin/comments/violations`
- Hiển thị comment có vi phạm AI (aiModeration.isViolation: true)
- Chức năng:
  - Duyệt comment (chuyển status thành active)
  - Từ chối comment (chuyển status thành inactive)
  - Kiểm duyệt lại bằng AI
  - Xóa comment

## API Endpoints

### Admin Comment Management
- `GET /admin/comments/violations` - Danh sách comment vi phạm
- `PUT /admin/comments/:id/approve` - Duyệt comment
- `PUT /admin/comments/:id/reject` - Từ chối comment
- `DELETE /admin/comments/:id/delete-permanent` - Xóa vĩnh viễn
- `POST /admin/comments/:id/remoderate` - Kiểm duyệt lại

## Cấu trúc dữ liệu

### Comment Model - AI Moderation Fields
```javascript
aiModeration: {
  isChecked: Boolean,        // Đã kiểm tra chưa
  isViolation: Boolean,      // Có vi phạm không
  violationType: String,     // Loại vi phạm
  flagged: Boolean,          // Có bị đánh dấu không
  categories: Object,        // Chi tiết các loại vi phạm
  scores: Object,           // Điểm số từng loại
  moderatedAt: Date         // Thời gian kiểm duyệt
}
```

## Tùy chỉnh

### 1. Thay đổi danh sách từ khóa cấm
Chỉnh sửa trong file `helper/aiModeration.js`:
```javascript
const bannedWords = [
  'fuck', 'shit', 'bitch', 'asshole', 'dick', 'pussy',
  'địt', 'đụ', 'lồn', 'cặc', 'đcm', 'đcm', 'đéo',
  'spam', 'scam', 'lừa đảo', 'lừa gạt'
  // Thêm từ khóa cấm mới vào đây
];
```

### 2. Thay đổi loại vi phạm kiểm tra
Chỉnh sửa trong file `helper/aiModeration.js`:
```javascript
const violationTypes = [
  'hate', 'hate/threatening', 'self-harm', 'sexual', 
  'sexual/minors', 'violence', 'violence/graphic'
  // Thêm loại vi phạm mới vào đây
];
```

## Lưu ý

1. **OpenAI API Key**: Cần có API key hợp lệ để sử dụng tính năng AI moderation đầy đủ
2. **Rate Limiting**: OpenAI có giới hạn số lượng request, cần theo dõi usage
3. **Privacy**: Nội dung comment sẽ được gửi đến OpenAI để kiểm tra
4. **Fallback**: Hệ thống sẽ hoạt động ngay cả khi không có API key, nhưng chỉ với kiểm tra từ khóa cơ bản

## Troubleshooting

### Lỗi thường gặp

1. **"Error in AI moderation"**
   - Kiểm tra OpenAI API key
   - Kiểm tra kết nối internet
   - Kiểm tra rate limit của OpenAI

2. **Comment không được kiểm duyệt**
   - Kiểm tra xem có lỗi trong console không
   - Đảm bảo helper/aiModeration.js được import đúng

3. **Trang admin không hiển thị**
   - Kiểm tra routes đã được thêm vào index.route.js chưa
   - Kiểm tra middleware auth 