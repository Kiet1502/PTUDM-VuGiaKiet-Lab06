# Hướng dẫn Kiểm Tra API trong Postman

## 1. LOCAL URL

```
http://localhost:3000/api/v1/auth
```

## 2. KIỂM TRA LOGIN ENDPOINT

### Request:

- **Method:** POST
- **URL:** `http://localhost:3000/api/v1/auth/login`
- **Body (raw JSON):**

```json
{
  "username": "testuser",
  "password": "123456"
}
```

### Expected Response:

```json
{
  "message": "dang nhap thanh cong",
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "testuser",
    "email": "test@example.com",
    "fullName": "..."
  }
}
```

---

## 3. KIỂM TRA /ME ENDPOINT (Yêu cầu đăng nhập)

### Request:

- **Method:** GET
- **URL:** `http://localhost:3000/api/v1/auth/me`
- **Headers:**
  - Key: `Authorization`
  - Value: `Bearer {YOUR_TOKEN_FROM_LOGIN}`

### Expected Response:

```json
{
    "message": "thong tin nguoi dung",
    "user": {
        "_id": "...",
        "username": "testuser",
        "email": "test@example.com",
        "fullName": "...",
        ...
    }
}
```

---

## 4. KIỂM TRA CHANGEPASSWORD ENDPOINT

### Request:

- **Method:** POST
- **URL:** `http://localhost:3000/api/v1/auth/changepassword`
- **Headers:**
  - Key: `Authorization`
  - Value: `Bearer {YOUR_TOKEN_FROM_LOGIN}`
- **Body (raw JSON):**

```json
{
  "oldPassword": "123456",
  "newPassword": "newpassword123"
}
```

### Validation Rules:

- Password phải có ít nhất 6 ký tự
- Password mới phải khác password cũ
- Password cũ phải đúng

### Expected Response (Success):

```json
{
  "message": "Thay doi mat khau thanh cong"
}
```

---

## JWT RS256 Implementation Details

### Public Key Location:

```
keys/public.pem
```

### Private Key Location:

```
keys/private.pem
```

### Algorithm:

- **Trước:** HS256 (HMAC with SHA-256)
- **Hiện tại:** RS256 (RSA with SHA-256)
- **Token Expiry:** 30 days

---

## Files Modified:

1. ✅ `utils/JwtRS256Handler.js` - NEW (JWT with RS256)
2. ✅ `utils/authHandler.js` - UPDATED (Use RS256 verification)
3. ✅ `routes/auth.js` - UPDATED (login, /me, changepassword)
4. ✅ `keys/public.pem` - NEW (RSA Public Key)
5. ✅ `keys/private.pem` - NEW (RSA Private Key)

---

## Commands to Test

### Register User:

```
POST /api/v1/auth/register
Body: {
    "username": "testuser",
    "password": "123456",
    "email": "test@example.com"
}
```

### Login:

```
POST /api/v1/auth/login
Body: {
    "username": "testuser",
    "password": "123456"
}
```

### Get Current User:

```
GET /api/v1/auth/me
Header: Authorization: Bearer {token}
```

### Change Password:

```
POST /api/v1/auth/changepassword
Header: Authorization: Bearer {token}
Body: {
    "oldPassword": "123456",
    "newPassword": "newpassword123"
}
```
