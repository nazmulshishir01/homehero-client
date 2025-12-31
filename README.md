# HomeHero — Local Household Service Finder 🏠✨ (Client)

A modern web application that connects users with trusted local service providers. Browse services, book appointments, and leave ratings/reviews — while providers can manage their own services with full CRUD operations.

🌐 **Live Site:** https://homehero-bd.web.app  
💻 **Client Repo:** https://github.com/nazmulshishir01/homehero-client  
⚙️ **Server Repo:** https://github.com/nazmulshishir01/homehero  
🔌 **API Base URL (Vercel):** https://homehero-five.vercel.app  

---

## 📌 Project Overview
**HomeHero** helps users quickly find local household services (plumbers, electricians, cleaners, etc.), compare options, and book services easily. The project focuses on clean UI, responsive design, and a smooth booking experience.

---

## 🖼️ Screenshots
> Add 1–3 screenshots for a more professional README.

**How to add screenshots**
1. Create a folder named `screenshots/` in the repo root  
2. Put screenshots there (example names: `home.png`, `details.png`, `dashboard.png`)  
3. Update the image links below

![HomeHero Preview](./screenshots/home.png)

<!-- Optional -->
<!-- ![Service Details](./screenshots/details.png) -->
<!-- ![Dashboard](./screenshots/dashboard.png) -->

---

## 🧰 Technologies Used

### Frontend
- **React**
- **React Router DOM**
- **Tailwind CSS**
- **Firebase Authentication** (Email/Password + Google OAuth)
- **Vite**
- JavaScript (ES6+)

### Backend (Connected API)
- **Node.js**
- **Express.js**
- **MongoDB**
- **JWT (fundamentals / protected routes)**

---

## ⭐ Core Features
- ✅ **User Authentication** — Secure login/registration with Firebase (Email/Password + Google OAuth)
- ✅ **Service Discovery** — Browse & search services with filtering (category, price range, keywords)
- ✅ **Service Booking System** — Book services with date selection
- ✅ **Booking Restrictions** — Users cannot book their own services
- ✅ **Rating & Review System** — Submit ratings and reviews for booked services
- ✅ **Service Management (CRUD)** — Providers can add, edit, and delete their own services
- ✅ **Advanced Filtering** — Real-time results with server-side filtering (when API is connected)
- ✅ **Dark/Light Theme** — Theme toggle with `localStorage` persistence
- ✅ **Fully Responsive UI** — Optimized for mobile, tablet, and desktop

---

## 📦 Dependencies Used (Notable)
> Your complete dependency list is in `package.json`.  
Below are common/important dependencies used in this project type (update if needed):

- `react`, `react-dom`
- `react-router-dom`
- `firebase`
- `tailwindcss`
- `vite`
- `axios` (API calls)
- `react-hot-toast` / `sweetalert2` (alerts/toasts)
- `aos` / `swiper` (UI animations/sliders) *(if used)*

---

## 🔑 Test Credentials (Demo)
Email: `nazmulshishir28@gmail.com`  
Password: `Admin@123`

---

## 🚀 Run Locally (Step-by-Step)

### ✅ Prerequisites
- Node.js (LTS recommended)
- npm (comes with Node)
- Firebase Project (for Auth)

### 1) Clone the client repo
```bash
git clone https://github.com/nazmulshishir01/homehero-client.git
cd homehero-client
