[🇹🇷 Türkçe](#türkçe) | [🇬🇧 English](#english)

---

# Türkçe

# 📝 Todo App

Kullanıcı kayıt/giriş sistemi, kategori yönetimi, alt görevler ve üye atama özelliklerine sahip full-stack bir görev takip uygulaması.

---

## 🚀 Teknolojiler

**Backend**
- .NET 8 (ASP.NET Core Web API)
- Entity Framework Core
- PostgreSQL
- JWT Authentication
- BCrypt şifreleme
- Mailtrap (e-posta doğrulama)

**Frontend**
- React + TypeScript
- Axios
- React Beautiful DnD (sürükle-bırak)

---

## ✨ Özellikler

- 🔐 Kullanıcı kaydı ve girişi (JWT tabanlı)
- 📧 E-posta doğrulama (kayıt sonrası mail onayı)
- ✅ Görev oluşturma, silme ve tamamlama
- 📋 Alt görev (SubTask) desteği
- 👤 Alt görevlere üye atama
- 🗂️ Kategori oluşturma ve filtreleme
- 🔢 Öncelik seviyesi (Priority)
- 📅 Son tarih (Due Date) belirleme
- ↕️ Sürükle-bırak ile görev sıralama
- 🔍 Filtreleme ve toolbar araçları

---

## ⚙️ Kurulum

### Gereksinimler
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/)

### 1. Veritabanı

```sql
CREATE DATABASE TodoBasicDb;
```

### 2. Backend

```bash
cd backend
```

`appsettings.json` içindeki bağlantı dizesini güncelle:
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=TodoBasicDb;Username=postgres;Password=SIFREN"
}
```

```bash
dotnet ef database update
dotnet run --launch-profile http
```

Backend: `http://localhost:5121` | Swagger: `http://localhost:5121/swagger`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/Auth/register` | Kayıt ol |
| GET | `/api/Auth/verify-email?token=` | E-posta doğrula |
| POST | `/api/Auth/login` | Giriş yap |
| GET | `/api/Auth/me` | Oturum bilgisi |

### Todo
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/Todo` | Görevleri listele |
| POST | `/api/Todo` | Yeni görev ekle |
| DELETE | `/api/Todo/{id}` | Görev sil |
| PUT | `/api/Todo/{id}/toggle` | Tamamla / geri al |
| PUT | `/api/Todo/reorder` | Sıralamayı güncelle |
| POST | `/api/Todo/{id}/subtask` | Alt görev ekle |
| PUT | `/api/Todo/subtask/{id}/toggle` | Alt görevi tamamla |

### Category
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/Category` | Kategorileri listele |
| POST | `/api/Category` | Kategori oluştur |

---

# English

# 📝 Todo App

A full-stack task tracking application with user authentication, category management, subtasks and member assignment features.

---

## 🚀 Technologies

**Backend**
- .NET 8 (ASP.NET Core Web API)
- Entity Framework Core
- PostgreSQL
- JWT Authentication
- BCrypt password hashing
- Mailtrap (email verification)

**Frontend**
- React + TypeScript
- Axios
- React Beautiful DnD (drag & drop)

---

## ✨ Features

- 🔐 User registration and login (JWT-based)
- 📧 Email verification (confirmation mail after registration)
- ✅ Create, delete and complete tasks
- 📋 SubTask support
- 👤 Assign members to subtasks
- 🗂️ Category creation and filtering
- 🔢 Priority levels
- 📅 Due date support
- ↕️ Drag & drop task reordering
- 🔍 Filtering and toolbar tools

---

## ⚙️ Setup

### Requirements
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/)

### 1. Database

```sql
CREATE DATABASE TodoBasicDb;
```

### 2. Backend

```bash
cd backend
```

Update the connection string in `appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=TodoBasicDb;Username=postgres;Password=YOUR_PASSWORD"
}
```

```bash
dotnet ef database update
dotnet run --launch-profile http
```

Backend: `http://localhost:5121` | Swagger: `http://localhost:5121/swagger`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/Auth/register` | Register |
| GET | `/api/Auth/verify-email?token=` | Verify email |
| POST | `/api/Auth/login` | Login |
| GET | `/api/Auth/me` | Get current user |

### Todo
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/Todo` | List todos |
| POST | `/api/Todo` | Create todo |
| DELETE | `/api/Todo/{id}` | Delete todo |
| PUT | `/api/Todo/{id}/toggle` | Toggle complete |
| PUT | `/api/Todo/reorder` | Reorder todos |
| POST | `/api/Todo/{id}/subtask` | Add subtask |
| PUT | `/api/Todo/subtask/{id}/toggle` | Toggle subtask |

### Category
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/Category` | List categories |
| POST | `/api/Category` | Create category |
