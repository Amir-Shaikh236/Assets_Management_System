# KT Telematic - Asset Management System

A full-stack **Asset Management System** built as part of the **KT Telematic Full Stack Assessment**. The application helps organizations efficiently track and manage company assets (laptops, mobile phones, tools, modems, etc.) assigned to employees throughout their entire lifecycle—from procurement to retirement.

The project follows a clean **Model-View-Controller (MVC)** architecture with a strong focus on maintainability, scalability, security, and production-ready development practices.

---

## 🚀 Features

### Employee Management
- Add new employees
- Edit employee details
- View employee records
- Search employees
- Filter active/inactive employees

### Asset Management
- Add new assets
- Edit asset information
- View asset inventory
- Search assets by make/model
- Unique asset identification using Serial Number and Asset ID

### Asset Categories *(In Progress)*
- Manage hardware categories
- Categorize assets such as:
  - Laptop
  - Mobile Phone
  - Modem
  - Tools
  - Drill Machine
  - Screw Driver
  - etc.

### Asset Lifecycle *(Planned)*
- Issue assets to employees
- Return assets with return reasons
- Scrap obsolete assets
- Maintain complete asset history
- Stock availability dashboard

---

# 🛠 Tech Stack

This application strictly follows the required enterprise architecture:
* **Backend:** Node.js with Express.js
* **Database:** PostgreSQL (Cloud-hosted via Neon DB)
* **ORM:** Sequelize ORM (with strict validation and data sanitization)
* **Frontend:** Jade (Pug) for server-side HTML rendering
* **Styling & UI:** Bootstrap & Custom CSS
* **Data Grid:** DataTables.net for dynamic, searchable UI tables
* **Testing:** Vitest & Supertest

---

# 📂 Project Structure

```text
Assets_Management/
│
├── config/                 # Database configuration & Sequelize initialization
├── controllers/            # Business logic
├── middlewares/            # Authentication & Error handling
├── models/                 # Sequelize Models
├── routes/                 # Express Routes
├── tests/                  # Unit & Integration Tests
├── utils/                  # Helper Classes & Utilities
├── views/                  # Jade (Pug) Templates
│
├── .env.example
├── package.json
├── server.js
└── README.md
```

---

# ⚙️ Getting Started

## Prerequisites

Before running the project, make sure you have:

- Node.js (v18 or later recommended)
- npm
- PostgreSQL Database (Neon or Local)
- Git

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Amir-Shaikh236/Assets_Management_System.git
```

Navigate into the project:

```bash
cd Assets_Management
```

Install dependencies:

```bash
npm install
```

# ▶️ Running the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will start on:

```
http://localhost:5000
```

---

# 🧪 Running Tests

Run all backend tests:

```bash
npm test
```

Run tests in watch/UI mode:

```bash
npm run test:ui
```

Current testing stack:

- Vitest
- Supertest

**Current Test Coverage:**

- ✅ Authentication (Login flow)
- 🚧 Remaining backend modules are under development and will be covered with automated tests as implementation progresses.

---

# 📈 Development Progress

| Module | Status |
|---------|--------|
| Project Setup | ✅ Completed |
| Express Server | ✅ Completed |
| PostgreSQL Integration | ✅ Completed |
| Sequelize ORM Setup | ✅ Completed |
| Authentication (JWT) | ✅ Completed |
| Employee Master CRUD | ✅ Completed |
| Asset Master CRUD | ✅ Completed |
| Asset Category Master | 🚧 In Progress |
| Issue Asset | ⏳ Planned |
| Return Asset | ⏳ Planned |
| Scrap Asset | ⏳ Planned |
| Asset History | ⏳ Planned |
| Stock Dashboard | ⏳ Planned |
| Jade Frontend | ⏳ Planned |

---

# 🏗 Architecture

The application follows the **Model-View-Controller (MVC)** design pattern.

- **Models** handle database schemas and validation.
- **Controllers** contain business logic.
- **Routes** define API endpoints.
- **Views** render server-side pages using Jade (Pug).
- **Middlewares** handle authentication, authorization, validation, and error handling.
- **Utilities** provide reusable helper functions.

This architecture promotes:

- Separation of concerns
- Maintainability
- Scalability
- Testability
- Clean code practices

---

# 🔒 Security Features

- JWT Authentication
- HTTP Only Cookies
- Password Hashing using bcrypt
- Sequelize ORM to help prevent SQL Injection
- Environment Variable Configuration
- Centralized Error Handling
- Input Validation & Data Sanitization

---

# 👨‍💻 Author

**Mohammed Amer**

- GitHub: https://github.com/Amir-Shaikh236
- LinkedIn: https://www.linkedin.com/in/amir-shaikh2410

---