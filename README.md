# Haribhakthi Sara 🎵

A full-stack devotional audio streaming platform designed for discovering, streaming, and managing devotional music and literature. Built with **Spring Boot 3**, **React**, and **PostgreSQL**, and containerized with **Docker**.

---

## ✨ Features

- **Audio Streaming**: Stream tracks with a responsive global player (play/pause, seek, volume control).
- **Playlists & Favorites**: Create custom personal playlists and bookmark favorite songs.
- **Artist & Album Discovery**: Browse artists, explore their discography, and discover related compositions.
- **Multilingual Support**: Seamless language toggle between **English** and **Kannada (ಕನ್ನಡ)**.
- **Admin Dashboard**: Secure management portal to upload songs, add artists, and manage lyrics with **SHA-256 audio deduplication** to prevent duplicate uploads.
- **Secure Authentication**: Stateless **JWT-based authentication** with Role-Based Access Control (RBAC: User & Admin).

---

## 🏗️ Architecture & Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Axios, i18next |
| **Backend** | Java 17, Spring Boot 3.2, Spring Security (JWT), Spring Data JPA, Flyway |
| **Database** | PostgreSQL 16 (Relational Schema & Migration-versioned) |
| **Storage** | Modular Strategy Pattern (`StorageService` interface supporting Local disk & AWS S3) |
| **DevOps** | Docker, Multi-Stage Dockerfiles (Alpine JRE & Nginx), Docker Compose |

---

## 🚀 Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) **OR**
- Java 17+, Node.js 18+, and PostgreSQL 16+ (for running without Docker).

---

### Quick Start with Docker Compose (Recommended)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/srigowri-S-Kulkarni/Haribhakthi-Sara.git
   cd Haribhakthi-Sara
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   *(Update `.env` with your desired database credentials and JWT secret key)*

3. **Launch the entire stack**:
   ```bash
   docker compose up -d --build
   ```

4. **Access the application**:
   - **Web Application**: `http://localhost` (Port 80)
   - **Backend REST API**: `http://localhost:8080/api`

5. **Stop the containers**:
   ```bash
   docker compose down
   ```

---

### Local Development (Manual Setup)

#### 1. Database Setup
Create a PostgreSQL database named `haribhakthi_sara`. Flyway will automatically run schema migrations on startup.

#### 2. Backend Setup
```bash
cd backend
mvn spring-boot:run
```
Backend runs on `http://localhost:8080`.

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend development server runs on `http://localhost:3000`.

---

## 🔒 Security & Privacy
- Sensitive configurations, secrets, and database passwords are parameterized and strictly loaded via environment variables (`.env`).
- Never commit private `.env` files, `.pem` keys, or production credentials to source control.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
