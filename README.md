# Credentials for sign in added below

<div align="center">
# 📚 StudyFlow

**Study Smarter. Score Higher.**

An open-source, AI-driven adaptive learning platform that builds a personalized study path for every learner — adjusting difficulty in real time, gamifying progress, and keeping accessibility at the core.

[![MIT License](https://img.shields.io/badge/License-MIT-7C3AED.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-A78BFA.svg?style=for-the-badge)](http://makeapullrequest.com)
[![Made with FastAPI](https://img.shields.io/badge/Made%20with-FastAPI-6366F1.svg?style=for-the-badge)](https://fastapi.tiangolo.com/)

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

---

## ✨ What is StudyFlow?

StudyFlow is a self-hostable learning platform that adapts to the person using it. Instead of a fixed syllabus, an adaptive engine continuously tunes question difficulty to keep each learner in the productive zone — challenged, but never overwhelmed. Progress is gamified with XP, streaks, and achievements, and the whole experience is designed to be usable by everyone.

It ships as a containerized FastAPI backend, a PostgreSQL database, and a lightweight static frontend — so you can run the full stack locally in a few minutes.

---

## 🚀 Key Features

| Feature | Description |
|---------|-------------|
| **🧠 Adaptive Engine** | Question difficulty adjusts in real time based on performance, keeping every learner appropriately challenged. |
| **🎮 Gamified Progress** | Earn XP, build streaks, and unlock achievements to stay motivated session after session. |
| **🤖 Semantic Answer Evaluation** | Sentence-Transformers grade answers by meaning, not exact string matches — flexible and forgiving. |
| **♿ Accessibility First** | High-contrast surfaces, keyboard navigation, and clear typography are built in, not bolted on. |
| **🛡️ Admin Dashboard** | Manage users, content, and platform settings from a dedicated, secured instructor panel. |
| **📦 Fully Containerized** | One `docker-compose up` brings up the API and database — reproducible everywhere. |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Backend** | Python · FastAPI · SQLAlchemy |
| **Database** | PostgreSQL |
| **AI / ML** | scikit-learn · Hugging Face Transformers (Sentence-Transformers) |
| **Frontend** | HTML5 · CSS3 · Vanilla JavaScript |
| **Infra** | Docker · Docker Compose |

---

## ⚡ Getting Started

### Prerequisites

- **Docker & Docker Compose** — [Install Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Git** — for cloning the repository

### 1. Clone the repository

```bash
git clone https://github.com/100axe001/studyflow.git
cd studyflow
```

### 2. Build and start the stack

```bash
docker-compose up --build
```

This starts the StudyFlow API and a PostgreSQL database.

### 3. Seed the database

```bash
docker-compose run --rm backend python scripts/seed_db.py
```

### 4. Launch the frontend

The frontend is a set of static pages in `studyflow-frontend/`. Serve them with any static server — for example, the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) VS Code extension:

- Right-click `studyflow-frontend/index.html` → **Open with Live Server**

### Local URLs & demo credentials

| Service | URL | Credentials |
|---------|-----|-------------|
| **Learner App** | `http://127.0.0.1:5500/` | `testuser` / `testpass` |
| **Admin Panel** | `http://127.0.0.1:5500/admin-login.html` | `admin` / `adminpassword` |

> The API documentation is available at `http://127.0.0.1:8000/docs` once the backend is running.

---

## 🗺️ Roadmap

**Near term**

- [ ] Additional learning modules (Reading Comprehension, Science, History)
- [ ] Progress dashboards for parents and educators
- [ ] Collaborative "study group" challenges

**Later**

- [ ] Internationalization (i18n)
- [ ] Smarter topic recommendations and learning-gap detection
- [ ] CI/CD pipeline for automated testing and deployment
- [ ] Native mobile apps and voice interaction

---

## 🤝 Contributing

Contributions of all kinds are welcome — code, design, content, docs, and bug reports.

1. Fork the repository and create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Commit your changes with a clear message:

   ```bash
   git commit -m "feat: add your feature"
   ```

3. Push and open a Pull Request:

   ```bash
   git push origin feature/your-feature-name
   ```

If a `CONTRIBUTING.md` is present, please skim it for project-specific guidelines.

---

## 📜 License

StudyFlow is released under the **MIT License** — free to use, modify, and distribute. See [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ for learners everywhere.**

*"Education is the most powerful weapon which you can use to change the world." — Nelson Mandela*

</div>
