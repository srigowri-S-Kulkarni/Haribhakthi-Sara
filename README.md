# Haribhakthi Sara (Hari Bhakthi Sara)

Devotional Music Streaming Platform with decoupled Spring Boot backend, React Vite frontend, and PostgreSQL database.

## 🚀 Quick Start (Local Development)

### Prerequisites
- Java 17+
- Node.js 18+ & npm
- PostgreSQL 16+ running on port 5432

### Running Locally

1. **Database Setup**:
   Create a PostgreSQL database named `haribhakthi_sara` with user `postgres` and password `postgres`.

2. **Backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   The backend API will start at `http://localhost:8080`.

3. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The React frontend will start at `http://localhost:3000`.

---

## 🐳 Production Deployment (Docker Compose)

### 1. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` and set secure values for `DB_PASSWORD` and `JWT_SECRET`.

### 2. Launch the Stack
Run Docker Compose to build and start all containers (PostgreSQL, Backend API, Frontend Nginx):
```bash
docker-compose up -d --build
```

### 3. Verify Deployment
- **Frontend App**: `http://localhost` (Port 80)
- **Backend API**: `http://localhost:8080/api`
- **PostgreSQL**: Port 5432

To stop the deployment:
```bash
docker-compose down
```

---

## 🏗️ Architecture

- **Backend**: Java 17, Spring Boot 3.2, Spring Security (JWT), Spring Data JPA, Flyway DB Migrations.
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Axios.
- **Storage**: Modular Strategy pattern (`StorageService` interface) supporting Local Disk storage and future AWS S3 storage (`APP_STORAGE_TYPE=s3`).
