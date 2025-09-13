# Posts Management Application

Ứng dụng web quản lý bài viết được xây dựng với Spring Boot (Backend) và React (Frontend).

## Tổng quan

Ứng dụng cho phép người dùng:
- Đăng ký tài khoản mới
- Đăng nhập với JWT authentication
- Tạo, xem, chỉnh sửa và xóa bài viết
- Xem danh sách tất cả bài viết hoặc chỉ bài viết của mình
- Tìm kiếm bài viết theo tiêu đề 


## Công nghệ sử dụng

### Backend
- **Java Spring Boot 3.5.5** - Framework chính
- **Spring Security** - Bảo mật và xác thực
- **Spring Data JPA** - ORM và quản lý database
- **MySQL** - Cơ sở dữ liệu
- **JWT (JSON Web Token)** - Xác thực 
- **BCrypt** - Mã hóa mật khẩu
- **Maven** - Quản lý dependencies

### Frontend
- **React 19.1.1** - Framework UI
- **React Router DOM** - Điều hướng
- **Axios** - HTTP client
- **JWT Decode** - Xử lý JWT token
- **React Icons** - Icons

## Cấu trúc dự án

```
├── backend/                 # Spring Boot Backend
│   ├── src/main/java/
│   │   └── posts_management/backend/
│   │       ├── config/      # Cấu hình Security, JWT
│   │       ├── controller/  # REST Controllers
│   │       ├── dto/         # Data Transfer Objects
│   │       ├── entity/      # JPA Entities
│   │       ├── repository/  # Data Repositories
│   │       └── service/     # Business Logic
│   └── src/main/resources/
│       └── application.properties
└── frontend/               # React Frontend
    ├── src/
    │   ├── api/           # API client functions
    │   ├── auth/          # Authentication context
    │   ├── pages/         # React components/pages
    │   └── App.js         # Main app component
    └── package.json
```

## Hướng dẫn cài đặt và chạy

### Yêu cầu hệ thống
- Java 21+
- Node.js 16+
- MySQL 8.0+
- Maven 3.6+

### 1. Cài đặt Backend

#### Cấu hình Database
1. Tạo database MySQL:
```sql
CREATE DATABASE posts;
```

2. Cập nhật thông tin kết nối trong `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost/posts
spring.datasource.username=your_username
spring.datasource.password=your_password
```

#### Chạy Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend sẽ chạy trên: `http://localhost:8080`

### 2. Cài đặt Frontend

```bash
cd frontend
npm install
npm start
```

Frontend sẽ chạy trên: `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập

### Posts (Yêu cầu JWT token)
- `GET /api/posts` - Lấy bài viết của user hiện tại (có phân trang)
- `GET /api/posts/get-posts` - Lấy tất cả bài viết (có phân trang)
- `GET /api/posts/{id}` - Lấy chi tiết bài viết
- `POST /api/posts` - Tạo bài viết mới
- `PUT /api/posts/{id}` - Cập nhật bài viết
- `DELETE /api/posts/{id}` - Xóa bài viết
- `GET /api/posts/search?title={title}` - Tìm kiếm bài viết

## Tính năng chính

### Backend Features
✅ **Đăng ký/Đăng nhập**: API đầy đủ với validation
✅ **JWT Authentication**: Token có thời hạn 1 giờ
✅ **Password Encryption**: Sử dụng BCrypt
✅ **CRUD Posts**: Đầy đủ các thao tác Create, Read, Update, Delete
✅ **Authorization**: User chỉ có thể sửa/xóa bài viết của mình
✅ **Pagination**: Hỗ trợ phân trang cho danh sách bài viết
✅ **Search**: Tìm kiếm bài viết theo tiêu đề
✅ **CORS Configuration**: Cấu hình cho React frontend
✅ **Error Handling**: Xử lý lỗi với HTTP status codes phù hợp

### Frontend Features
✅ **Responsive UI**: Giao diện thân thiện, dễ sử dụng
✅ **Authentication Flow**: Đăng ký, đăng nhập, logout
✅ **Protected Routes**: Bảo vệ các trang yêu cầu đăng nhập
✅ **Post Management**: Tạo, xem, sửa, xóa bài viết
✅ **Form Validation**: Kiểm tra dữ liệu đầu vào
✅ **Password Strength**: Hiển thị độ mạnh mật khẩu
✅ **Pagination**: Phân trang cho danh sách bài viết
✅ **Search**: Tìm kiếm bài viết
✅ **Error Handling**: Hiển thị thông báo lỗi
✅ **Loading States**: Hiển thị trạng thái loading

## Kiểm tra chức năng

### 1. Đăng ký tài khoản
1. Truy cập `http://localhost:3000/register`
2. Điền thông tin: username, email, password
3. Kiểm tra validation (email format, password strength)
4. Sau khi đăng ký thành công, chuyển đến trang login

### 2. Đăng nhập
1. Truy cập `http://localhost:3000/login`
2. Nhập username và password
3. Sau khi đăng nhập thành công, chuyển đến trang posts
4. JWT token được lưu trong localStorage

### 3. Quản lý bài viết
1. **Xem danh sách**: Chuyển đổi giữa "My Posts" và "All Posts"
2. **Tạo bài viết**: Click "New Post", điền title và content
3. **Chỉnh sửa**: Click "Edit" trên bài viết của mình
4. **Xóa**: Click "Delete" và xác nhận
5. **Xem chi tiết**: Click vào bài viết để xem full content

### 4. Kiểm tra bảo mật
1. Thử truy cập `/posts` khi chưa đăng nhập → redirect to login
2. Thử sửa/xóa bài viết của user khác → báo lỗi "Not authorized"
3. Kiểm tra JWT token trong Developer Tools → Network tab

## Cấu trúc Database

### Bảng Users
```sql
CREATE TABLE user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
```

### Bảng Posts
```sql
CREATE TABLE post (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);
```

## Lưu ý kỹ thuật

### Backend
- Sử dụng Spring Boot 3.5.5 với Java 21
- JWT secret được cấu hình trong application.properties
- CORS được cấu hình cho localhost:3000
- Database schema tự động tạo với `hibernate.ddl-auto=update`

### Frontend
- Sử dụng React 19.1.1 với hooks
- Axios interceptor tự động thêm JWT token vào requests
- Local storage để lưu trữ token
- Proxy configuration trong package.json cho API calls

## Troubleshooting

### Lỗi thường gặp

1. **Database connection error**
   - Kiểm tra MySQL đang chạy
   - Kiểm tra thông tin kết nối trong application.properties

2. **CORS error**
   - Đảm bảo backend đang chạy trên port 8080
   - Kiểm tra CORS configuration trong SecurityConfig

3. **JWT token expired**
   - Token có thời hạn 1 giờ, cần đăng nhập lại

4. **Frontend không kết nối được API**
   - Kiểm tra proxy configuration trong package.json
   - Đảm bảo backend đang chạy



