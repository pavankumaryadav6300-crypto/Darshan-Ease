# DarshanEase 🙏

DarshanEase is India's leading digital platform for online temple entry slots, VIP poojas, and direct devotee contributions. It bridges the gap between devotees and sacred shrines by providing a seamless, secure, and user-friendly booking experience.

## ✨ Features

### For Devotees (Users)
* **Explore Temples**: Browse historical shrines, view presiding deities, location, and opening hours.
* **Book Darshan Slots**: Reserve General, VIP, or Special Pooja entry passes. Track live slot availability.
* **Make Donations**: Offer digital seva/contributions (Annadanam, Temple Development, General Donation) directly to the temples.
* **Manage Bookings**: View active darshan passes, print QR tickets, or cancel reservations directly from the dashboard.

### For Temple Trustees (Organizers)
* **Generate Slots**: Schedule daily entry windows and control slot capacities/pricing for the temples they manage.
* **View Logs**: Monitor pilgrim reservations and manage crowd control.

### For System Administrators
* **Register Shrines**: Add new temples to the platform with historical descriptions and images.
* **System Ledgers**: Access system-wide devotee contribution logs and complete booking histories.

## 🛠️ Technology Stack

**Frontend:**
* React 18 (Vite)
* React Router v6
* Axios
* Lucide React (Icons)
* React Toastify (Notifications)
* Custom CSS (Glassmorphism, Premium Dark UI)

**Backend:**
* Node.js & Express.js
* MongoDB (Mongoose)
* JSON Web Tokens (JWT) for Role-Based Authentication
* Express Rate Limit & Helmet (Security)

## 🚀 Getting Started

### Prerequisites
* Node.js (v16+)
* MongoDB installed locally or MongoDB Atlas URI

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder with the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/darshanease
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   ```
4. (Optional) Seed the database with initial temples, users, and slots:
   ```bash
   node seed.js
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

## 🔐 Default Seed Accounts (if seeded)

If you ran the `seed.js` script, you can log in using the following test accounts:

* **User (Devotee)**: `user@darshanease.com` | `user123@Password`
* **Organizer**: `organizer@darshanease.com` | `organizer123@Password`
* **Admin**: `admin@darshanease.com` | `admin123@Password`

## 📁 Project Structure

```text
DarshanEase/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route logic (Auth, Bookings, Temples, Slots, Donations)
│   ├── middleware/      # Authentication & Validation checks
│   ├── models/          # Mongoose Schemas
│   ├── routes/          # Express API routes
│   ├── server.js        # Entry point
│   └── seed.js          # Database seeder script
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI (Navbar, ProtectedRoute, Loader)
    │   ├── context/     # React Context (AuthContext)
    │   ├── pages/       # Views (Home, Login, Register, Dashboard, Bookings, etc.)
    │   ├── App.jsx      # Main application routing
    │   └── index.css    # Global styles and theming
    └── package.json
```
