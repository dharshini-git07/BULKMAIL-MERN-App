# Bulk Mail App 📧

A full-stack web application built to send bulk emails efficiently to multiple recipients at once — featuring CSV upload support, manual recipient input, real-time Nodemailer Gmail SMTP transmission, mail history logging, and a clean, responsive UI.

Live Demo Deployment Architecture: **Vercel Serverless + MongoDB Atlas**

---

## ✨ Features

- 🔐 **Secure Credential Management**: Environment variables for sensitive Gmail SMTP credentials and MongoDB Atlas connection string.
- 📨 **Bulk Email Sending**: Send emails to multiple recipients in one click via Nodemailer with Gmail SMTP.
- 📁 **CSV Upload Support**: Drag and drop or browse `.csv` files to extract email addresses automatically.
- ✍️ **Manual Email Input**: Paste or type multiple email addresses (one per line).
- 🔢 **Smart Deduplication & Validation**: Filters invalid email formats and merges CSV & manual emails without duplicates.
- 📋 **Email Logs & History**: View history of all sent and failed email campaigns with timestamps.
- 📱 **Responsive UI**: Clean, blue-themed student project design suitable for mobile and desktop screens.

---

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Vanilla CSS

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Nodemailer (Gmail SMTP)

### Deployment
- Frontend + Backend → Vercel (Serverless Monorepo)
- Database → MongoDB Atlas

---

## 📁 Repository Structure

```
Bulk-Mail-App/
├── api/
│   ├── index.js            # Express backend (Vercel serverless)
│   └── models/
│       └── Mail.js         # Mongoose schema for email logs
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── main.jsx        # React entry point
│   │   └── index.css       # Styling & theme rules
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .env.example            # Environment variable template
├── .gitignore              # Git ignore rules
├── package.json            # Root monorepo configuration
├── vercel.json             # Vercel deployment config
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Gmail account with an **App Password** enabled

---

### 1. Clone the repository
```bash
git clone https://github.com/your-username/Bulk-Mail-App.git
cd Bulk-Mail-App
```

---

### 2. Install dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

---

### 3. Set up environment variables

Create a `.env` file in the project root:
```env
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.acgvndw.mongodb.net/bulkmail?retryWrites=true&w=majority
```

---

### 4. Run Locally

#### Start Backend
```bash
node api/index.js
```

#### Start Frontend (in a new terminal)
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🌐 Deploying to Vercel

1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "Complete Bulk Mail App"
   git push origin main
   ```

2. Go to **[Vercel Dashboard](https://vercel.com)** → Click **Add New...** → **Project**.
3. Import your GitHub repository.
4. Leave **Root Directory** as default (`./`).
5. Add your environment variables under **Vercel Project Settings**:
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `MONGO_URI`
6. Click **Deploy** — done!

---

## 🔑 How to Generate a Gmail App Password

1. Go to your **[Google Account Settings](https://myaccount.google.com/)**.
2. Navigate to **Security** and ensure **2-Step Verification** is turned ON.
3. Search for **App passwords** in the search bar.
4. Generate a new App Password for **Mail** and copy the 16-character string into `EMAIL_PASS` in your environment variables.

---

## 📌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/send-mail` | Validates input, sends emails via Nodemailer, and records logs in MongoDB Atlas |
| `GET` | `/api/mail-history` | Fetches all stored email logs sorted newest first |

---

## 📜 License
This project is open-source and available for educational purposes as part of the Full Stack Web Development (FSWD) curriculum.
