## Công nghệ sử dụng

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white" alt="Node.js" height="30"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" height="30"/>
  <img src="https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white" alt="Express.js" height="30"/>
  <img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white" alt="Prisma" height="30"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white" alt="MySQL" height="30"/>
  <img src="https://img.shields.io/badge/Nodemailer-0B3D91?logo=gmail&logoColor=white" alt="Nodemailer" height="30"/>
  <img src="https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white" alt="JWT" height="30"/>
  <img src="https://img.shields.io/badge/CORS-00599C?logo=cors&logoColor=white" alt="CORS" height="30"/>
  <img src="https://img.shields.io/badge/Bcrypt-FFCA28?logo=security&logoColor=black" alt="Bcrypt" height="30"/>
  <img src="https://img.shields.io/badge/tsyringe-3178C6?logo=typescript&logoColor=white" alt="tsyringe" height="30"/>
</p>

---

# Hướng dẫn khởi tạo và chạy dự án

## 1. Tạo thư mục dự án và khởi tạo Node.js

```sh
mkdir my-auth-backend
cd my-auth-backend
npm init -y
```

## 2. Cài đặt TypeScript và khởi tạo cấu hình

```sh
npm install -D typescript ts-node-dev @types/node
npx tsc --init
```

## 3. Cài đặt các thư viện backend

```sh
npm install express cors dotenv bcrypt jsonwebtoken prisma tsyringe
npm install -D @types/express @types/bcrypt @types/jsonwebtoken
```

## 4. Cài đặt Prisma và khởi tạo cấu hình

```sh
npm install prisma@6.12.0 @prisma/client@6.12.0
npx prisma init
```

## 5. Cấu hình database trong file `.env`

Ví dụ:
```
DATABASE_URL="mysql://root:password@localhost:3306/auth_db"
```

## 6. Chạy migration để tạo bảng

```sh
npx prisma migrate dev --name init
npx prisma migrate dev --name update_token_length
```

## 7. Sinh Prisma Client

```sh
npm run prisma:generate
# hoặc
npx prisma generate
```

## 8. Cài đặt các thư viện bổ sung

```sh
npm install nodemailer
```

## 9. Khởi động Prisma Studio (tùy chọn)

```sh
npx prisma studio
```

## 10. Chạy dự án

```sh
npm run start
# hoặc nếu dùng ts-node-dev:
npm run dev
```

---

**Lưu ý:**  
- Đảm bảo đã cài đặt MySQL và tạo database trước khi migrate.
- Cấu hình đúng file `.env` trước khi chạy dự án.