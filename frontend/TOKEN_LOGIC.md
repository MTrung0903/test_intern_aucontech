# Token Management Logic - Updated

## Vấn đề đã được giải quyết

**Trước đây**: Mỗi lần F5 (refresh page) đều xóa token → User phải login lại
**Bây giờ**: Chỉ xóa token khi restart project (npm start), giữ nguyên token khi F5

## Cơ chế hoạt động

### 1. Phân biệt Restart vs Refresh

**SessionStorage** được sử dụng để theo dõi:
- `sessionStorage.getItem('app_loaded')` = null → Lần đầu load (restart project)
- `sessionStorage.getItem('app_loaded')` = 'true' → Refresh page (F5)

### 2. Logic trong AuthContext.jsx

```javascript
const [token, setToken] = useState(() => {
  const isFirstLoad = !sessionStorage.getItem('app_loaded');
  
  if (isFirstLoad) {
    // RESTART PROJECT: Xóa token cũ
    const existingToken = localStorage.getItem('token');
    if (existingToken) {
      localStorage.removeItem('token');
      console.log('Project restarted - cleared old token');
    }
    sessionStorage.setItem('app_loaded', 'true');
    return null;
  } else {
    // REFRESH PAGE: Giữ nguyên token
    return localStorage.getItem('token');
  }
});
```

## Luồng hoạt động

### Khi restart project (npm start):
1. **Lần đầu load page** → `sessionStorage` trống
2. **Phát hiện restart** → Xóa token cũ khỏi localStorage
3. **Đánh dấu loaded** → Set `sessionStorage.app_loaded = 'true'`
4. **Hiển thị login** → User cần login lại

### Khi refresh page (F5):
1. **Lần đầu load page** → `sessionStorage` đã có `app_loaded = 'true'`
2. **Phát hiện refresh** → Giữ nguyên token
3. **Load token** → Lấy token từ localStorage
4. **Giữ trạng thái** → User vẫn đăng nhập

## Lợi ích

- ✅ **Restart project**: Tự động xóa token cũ, tránh xung đột
- ✅ **Refresh page**: Giữ nguyên token, user không cần login lại
- ✅ **Better UX**: User experience mượt mà hơn
- ✅ **Development friendly**: Dễ dàng test và develop

## Testing

### Test Restart Project:
1. **Login** → Tạo token
2. **Stop server** → `Ctrl+C`
3. **Start server** → `npm start`
4. **Kết quả**: Token bị xóa, hiển thị login page

### Test Refresh Page:
1. **Login** → Tạo token
2. **F5** → Refresh page
3. **Kết quả**: Token vẫn còn, user vẫn đăng nhập

### Test Multiple Refresh:
1. **Login** → Tạo token
2. **F5** → Vẫn đăng nhập
3. **F5** → Vẫn đăng nhập
4. **F5** → Vẫn đăng nhập
5. **Restart project** → Token bị xóa

## SessionStorage vs LocalStorage

- **LocalStorage**: Lưu token (persistent across browser sessions)
- **SessionStorage**: Theo dõi app state (chỉ trong tab hiện tại)
- **Khi đóng tab**: SessionStorage bị xóa, lần mở tab mới sẽ được coi là restart
