import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import Navbar from './components/Navbar';
import WalletDashboard from './pages/WalletDashboard';
import TransactionHistory from './pages/TransactionHistory';
import LoanApplication from './pages/LoanApplication';
import LoanStatus from './pages/LoanStatus';
import EMICalculator from './pages/EMICalculator';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
          <Navbar />
          <main className="container mx-auto py-8">
            <Routes>
              <Route path="/" element={<WalletDashboard />} />
              <Route path="/transactions" element={<TransactionHistory />} />
              <Route path="/apply-loan" element={<LoanApplication />} />
              <Route path="/loans" element={<LoanStatus />} />
              <Route path="/emi-calculator" element={<EMICalculator />} />
            </Routes>
          </main>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;