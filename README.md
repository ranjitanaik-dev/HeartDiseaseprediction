# ❤️ CardioSense AI - Heart Disease Prediction & Health Analytics

CardioSense AI is a premium, machine-learning-powered preventive healthcare platform designed to analyze cardiovascular biomarkers, predict heart disease risks, and help patients manage their health through active goal tracking.

---

## 🌟 Key Features

* **Clinical Heart Risk Predictor**: Dual-tier evaluation modes (Basic and Advanced clinical checks) backed by a machine learning prediction pipeline.
* **Personal Health Management System**: Advanced cardiovascular goals tracker featuring streaks, daily fitness challenges, calendar targets, and automated recommendations.
* **Clinical PDF Report Generator**: Exports multi-page, high-contrast, structured clinical summaries matching official doctor lab prints.
* **Settings & Profiles Center**: Tabbed account management with AMOLED dark/light toggles, device session security logs, and local database backup tools.
* **Unified Notifications System**: Real-time alerts for drinking water, tracking steps, and meeting goal deadlines.
* **Fully Responsive Design**: Optimized layouts supporting mobile, tablet, and desktop screens.

---

## 💻 Tech Stack

### Frontend Client
* **Core**: React 18 (Vite, SPA Routing)
* **Styling**: Vanilla CSS Variables, TailwindCSS utilities, Framer Motion (animations)
* **Icons**: Lucide React
* **Document Rendering**: jsPDF & html2canvas

### Backend API
* **Core**: Python FastAPI, Uvicorn Server
* **Machine Learning**: Scikit-Learn, Pandas, NumPy
* **CORS**: Dynamic Origin Checking

### Database & Auth
* **Provider**: Supabase Cloud
* **Authentication**: Google OAuth (Social Login with Account Chooser)

---

## ⚙️ Project Structure

```
├── backend/                  # FastAPI Application
│   ├── main.py               # API Entry Point & ML Pipeline
│   └── requirements.txt      # Python Dependencies
├── frontend/                 # React Client
│   ├── src/
│   │   ├── components/       # Layouts, Modals, Shared UI
│   │   ├── contexts/         # Authentication and Contexts
│   │   ├── lib/              # PDF Generator and Utilities
│   │   └── pages/            # Dashboard, Predictors, Settings, History
│   ├── package.json          # Node Dependencies
│   └── vite.config.js        # Vite Build Configuration
└── README.md                 # Main Documentation
```

---

## 🚀 Local Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/ranjitanaik-dev/HeartDiseaseprediction.git
cd HeartDiseaseprediction
```

### 2. Configure the Backend
Ensure you have Python 3.10+ installed.
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
The backend API will run on `http://127.0.0.1:8000`.

### 3. Configure the Frontend
Ensure you have Node.js 18+ installed.
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create a .env file and set these variables:
# VITE_SUPABASE_URL=your_supabase_project_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# VITE_API_URL=http://127.0.0.1:8000

# Start the local development server
npm run dev
```
The frontend client will run on `http://localhost:5173`.

---

## 📋 Deployment Summary

* **Frontend**: Deploy to Vercel/Netlify. Set environment variables `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_API_URL` to point to the hosted backend.
* **Backend**: Deploy to Render/Railway. Set environment variables `SUPABASE_URL`, `SUPABASE_KEY`, and `CORS_ORIGINS` to point to the hosted frontend.
* **OAuth**: Register the production URL under your **Supabase Project -> Authentication -> URL Configuration** redirects.

For details, refer to the full [Deployment Guide](frontend/src/pages/Settings.jsx) or local documentation logs.

---

## 📄 License
This project is licensed for personal tracking and clinical evaluation purposes. Developed by **Ranjita Naik**.
