# Finecho
FinEcho is an AI-powered personal finance assistant that helps users manage expenses, set gamified savings goals, forecast spending with ML, and scan receipts using OCR. Built with React, Django, and MongoDB, it delivers smart financial insights through a sleek and modern interface.
## 🚀 Features

### 1. 🎯 Spending Goal Gamification
- Set and track savings goals with visual progress
- Streak system to reward consistent saving behavior
- AI-adjusted targets based on user habits

### 2. 💱 Multi-Currency Support
- Automatically detects foreign currencies in transactions
- Real-time currency conversion and summary in home currency

### 3. 📈 AI Forecast Graph
- Predict future expenses using XGBoost/LSTM models
- Visual forecast graphs to assist budgeting

### 4. 🤖 Ask FinEcho (Chatbot)
- GPT-powered financial assistant
- Ask questions about your habits, budgeting tips, or spending summaries

### 5. 🧾 Receipt Scanner
- Upload images of receipts
- OCR technology (Tesseract/Google Vision) to extract and log data

### 6. 📆 Smart Calendar Reminders
- Integration with Google Calendar API
- Automatic event creation for bill due dates, goal check-ins, and more

---

## 🛠 Tech Stack

| Frontend      | Backend        | AI/ML          | DevOps/Other         |
|---------------|----------------|----------------|----------------------|
| React + Tailwind | Django (REST API) | XGBoost / LSTM | MongoDB, Firebase Auth |
| Vite          | Python          | Tesseract OCR  | Google Calendar API  |

---

## 🧑‍💻 Getting Started

```bash
# Clone the repo
git clone https://github.com/Guruprasath-Annadurai/Finecho.git
cd Finecho

# Install dependencies
npm install
cd server
pip install -r requirements.txt

# Start frontend and backend
npm run dev
python manage.py runserver
