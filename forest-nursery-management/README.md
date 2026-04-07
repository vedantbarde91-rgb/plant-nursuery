# 🌲 Forest Nursery Management System

A full-stack web application for managing plant inventory, delivery operations, staff communication, and attendance in a forest department.

---

## 📁 Project Structure

```
forest-nursery-management/
├── backend/                  ← Node.js + Express API
│   ├── config/db.js          ← MongoDB connection
│   ├── models/               ← Mongoose schemas
│   ├── controllers/          ← Business logic
│   ├── routes/               ← API endpoints
│   ├── middleware/           ← Auth middleware
│   ├── utils/                ← Excel & PDF export
│   ├── seed.js               ← Demo data seeder
│   ├── .env                  ← Environment variables
│   └── server.js             ← Entry point
│
└── frontend/                 ← React.js app
    ├── public/index.html
    └── src/
        ├── components/       ← Navbar, Sidebar, Tables, Forms
        ├── pages/            ← Dashboard, Inventory, etc.
        ├── services/api.js   ← Axios API calls
        └── App.js
```

---

## ⚙️ Setup Instructions

### Step 1 — Install Prerequisites
- Node.js v16+ → https://nodejs.org
- MongoDB (local) OR MongoDB Atlas (cloud, free)

---

### Step 2 — Configure MongoDB URL

Open `backend/.env` and set your MongoDB URL:

```env
# Option A: Local MongoDB
MONGO_URI=mongodb://localhost:27017/forest-nursery

# Option B: MongoDB Atlas (cloud)
MONGO_URI=mongodb+srv://username:password@cluster0.abcde.mongodb.net/forest-nursery

JWT_SECRET=forestnursery_super_secret_key_2024
PORT=5000
```

**How to get MongoDB Atlas URL:**
1. Go to https://cloud.mongodb.com → Create free account
2. Create a new Cluster (free M0 tier)
3. Click "Connect" → "Connect your application"
4. Copy the connection string and replace `<password>` with your password

---

### Step 3 — Install Backend Dependencies

```bash
cd forest-nursery-management/backend
npm install
```

---

### Step 4 — Seed Demo Data

```bash
node seed.js
```

This creates:
- 3 demo plants (Neem, Tulsi, Rose)
- 2 demo sites (City School, Green Park Project)
- 3 demo employees (Manager, Driver, Supervisor)
- 2 demo users:
  - **Admin:** admin@nursery.com / admin123
  - **Staff:** staff@nursery.com / staff123

---

### Step 5 — Start Backend Server

```bash
npm run dev
```

Backend runs at: http://localhost:5000

---

### Step 6 — Install Frontend Dependencies

Open a new terminal:

```bash
cd forest-nursery-management/frontend
npm install
```

---

### Step 7 — Start Frontend

```bash
npm start
```

Frontend runs at: http://localhost:3000

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/inventory | Get all plants |
| POST | /api/inventory | Add plant |
| GET | /api/inward | Get inward entries |
| POST | /api/inward | Add inward (auto increases stock) |
| GET | /api/outward | Get outward entries |
| POST | /api/outward | Add outward (auto decreases stock) |
| GET | /api/sites | Get all sites |
| POST | /api/sites | Add site |
| GET | /api/deliveries | Get deliveries |
| POST | /api/deliveries | Create delivery (auto-sends notifications) |
| PUT | /api/deliveries/:id | Update delivery status |
| GET | /api/attendance | Get attendance records |
| POST | /api/attendance | Mark attendance |
| GET | /api/attendance/employees | Get all employees |
| POST | /api/attendance/employees | Add employee |
| GET | /api/reports/dashboard | Dashboard stats |
| GET | /api/reports/export/inventory/excel | Export inventory to Excel |
| GET | /api/reports/export/inventory/pdf | Export inventory to PDF |

---

## 🔑 Features

- ✅ **Login + Register** with JWT authentication
- ✅ **Dashboard** with charts (monthly inward/outward)
- ✅ **Inventory** — add/delete plants, auto-update stock
- ✅ **Inward** — record stock received, auto-increase inventory
- ✅ **Outward** — record dispatches, auto-decrease inventory
- ✅ **Delivery** — schedule deliveries with multiple plant species
- ✅ **Auto-notifications** — created in-app when delivery is scheduled
- ✅ **Attendance** — mark daily attendance with check-in/out times
- ✅ **Employee Management** — add/remove employees
- ✅ **Reports** — inward, outward, funding reports with date filter
- ✅ **Export** — Excel download & PDF print
- ✅ **Responsive** — works on mobile and desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Excel | SheetJS (xlsx) |
| PDF | Server-side HTML → Browser print |
| Notifications | In-app (polling every 30s) |

---

## 📌 Notes

- All API routes except `/api/auth/login` and `/api/auth/register` are protected by JWT
- Stock auto-updates: inward entries increase inventory, outward entries decrease it
- Deleting inward/outward entries automatically reverses the stock change
- Delivery creation auto-creates a notification visible to all logged-in users
- Demo data uses small quantities (2-3 units) as requested
