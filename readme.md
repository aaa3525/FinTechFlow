# FintechFlow - Personal Finance Management Application

## Project Description

FintechFlow is a comprehensive personal finance management web application that allows users to manage a digital wallet, apply for micro-loans, and track transaction history. The application features a modern React frontend with smooth animations and a Node.js/Express backend with RESTful API.

### Features
- 💰 **Digital Wallet**: Deposit/withdraw funds with animated balance updates
- 📊 **Transaction History**: Searchable and filterable transaction log with running balance
- 🏦 **Loan Management**: Apply for loans with multi-step form, approve/reject applications
- 📈 **EMI Calculator**: Calculate monthly installments with detailed amortization schedule
- 🌓 **Dark/Light Mode**: Theme toggle with localStorage persistence
- 📱 **Responsive Design**: Works on mobile, tablet, and desktop

## Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios
- **Backend**: Node.js, Express.js, CORS
- **Deployment**: Vercel (Frontend + Backend)
- **Storage**: In-memory (no database required)

## How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Step 1: Clone the Repository
```bash
git clone https://github.com/aaa3525/FinTechFlow.git
cd FinTechFlow
```

### Step 2: Setup Backend
```bash
cd backend
npm install
npm run dev
```
Backend will run on `http://localhost:5000`

### Step 3: Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:3000`

### Step 4: Access the Application
Open your browser and navigate to `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/wallet` | Get wallet balance | None | `{ balance, currency, owner }` |
| POST | `/api/wallet/deposit` | Add money to wallet | `{ amount }` | `{ balance, message }` |
| POST | `/api/wallet/withdraw` | Withdraw money | `{ amount }` | `{ balance, message }` |
| GET | `/api/transactions` | Get all transactions | None (query: `?type=credit/debit`) | `[{ id, type, amount, timestamp, description }]` |
| POST | `/api/loans/apply` | Apply for a loan | `{ applicant, amount, purpose, tenure }` | `{ id, status, ... }` |
| GET | `/api/loans` | Get all loan applications | None | `[{ id, applicant, amount, purpose, tenure, status }]` |
| PATCH | `/api/loans/:id/status` | Update loan status | `{ status }` | `{ id, status, ... }` |
| GET | `/api/emi-calculator` | Calculate EMI | None (query: `?principal=&annualRate=&months=`) | `{ emi, totalPayable, totalInterest }` |

### Example API Responses

**GET /api/wallet**
```json
{
  "balance": 12500,
  "currency": "PKR",
  "owner": "FintechFlow User"
}
```

**POST /api/wallet/deposit**
```json
{
  "balance": 17500,
  "message": "Deposit successful"
}
```

**GET /api/emi-calculator?principal=100000&annualRate=12&months=12**
```json
{
  "emi": 8884.88,
  "totalPayable": 106618.56,
  "totalInterest": 6618.56
}
```

## Live Demo

- **Frontend**: https://fintechflow-seven.vercel.app
- **Backend API**: https://fintechflow-backend.vercel.app

## Project Structure

```
FinTechFlow/
├── backend/
│   ├── routes/
│   │   ├── wallet.js
│   │   └── loans.js
│   ├── api/
│   │   └── index.js
│   ├── server.js
│   ├── package.json
│   └── vercel.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## Key Features Implementation

### Animations
- **Count-up animation** for wallet balance using custom `useCountUp` hook
- **Staggered card animations** for transaction history
- **Flip card animations** for loan applications
- **Slide-in toast notifications** for success/error messages
- **Skeleton loaders** for all API calls

### Multi-Step Loan Form
- Step 1: Personal Information (Name, CNIC, Contact)
- Step 2: Loan Details (Amount, Purpose, Tenure)
- Step 3: Review & Submit
- Client-side validation with CNIC regex pattern: `XXXXX-XXXXXXX-X`

### EMI Calculator
- Server-side EMI calculation using formula: `EMI = [P × r × (1+r)^n] / [(1+r)^n – 1]`
- Amortization table showing principal and interest components for each month
- Visual breakdown bar for principal vs interest

## Environment Variables

### Frontend (.env.production)
```env
VITE_API_URL=https://fintechflow-backend.vercel.app/api
```

### Backend (Set in Vercel Dashboard)
```env
FRONTEND_URL=https://fintechflow-seven.vercel.app
```

## Deployment

The application is deployed on:
- **Frontend**: Vercel (serverless deployment)
- **Backend**: Vercel (serverless functions)

### Deployment Commands
```bash
# Deploy backend
cd backend
vercel --prod --force

# Deploy frontend
cd frontend
vercel --prod --force
```

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure the backend has proper CORS configuration:
```javascript
const corsOptions = {
  origin: ['https://fintechflow-seven.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
};
```

### Local Development
Make sure both backend and frontend are running simultaneously:
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

## Author

**Name**: Amnah Asrar   
**Roll Number**: 23i-5550  
**Course**: BS Fintech - Web Programming  
**Instructor**: Arsalan Khan  
**University**: FAST-NUCES Islamabad

## License

This project was developed as part of the Web Programming course at FAST-NUCES Islamabad.

## Acknowledgments

- Tailwind CSS for utility-first styling
- Vercel for free hosting
- React Router for navigation
- Axios for HTTP requests

---

**Live URL**: https://fintechflow-seven.vercel.app  
**GitHub Repository**: https://github.com/aaa3525/FinTechFlow