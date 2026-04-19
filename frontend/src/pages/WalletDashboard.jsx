import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCountUp } from '../hooks/useCountUp';
import { useToast } from '../contexts/ToastContext';
import { formatPKR } from '../utils/formatPKR';

const API_URL = 'http://localhost:5000/api';

const WalletDashboard = () => {
  const [wallet, setWallet] = useState({ balance: 0 });
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [balanceChange, setBalanceChange] = useState(null);
  const { showToast } = useToast();
  
  const countedBalance = useCountUp(wallet.balance, 1000);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await axios.get(`${API_URL}/wallet`);
      setWallet(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching wallet:', error);
      setIsLoading(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    
    if (amount <= 0) {
      showToast('Amount must be greater than 0', 'error');
      return;
    }
    
    try {
      const response = await axios.post(`${API_URL}/wallet/deposit`, { amount });
      setWallet({ ...wallet, balance: response.data.balance });
      setBalanceChange('positive');
      setTimeout(() => setBalanceChange(null), 300);
      showToast(`Successfully deposited ${formatPKR(amount)}`, 'success');
      setDepositAmount('');
    } catch (error) {
      showToast(error.response?.data?.error || 'Deposit failed', 'error');
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    
    if (amount <= 0) {
      showToast('Amount must be greater than 0', 'error');
      return;
    }
    
    try {
      const response = await axios.post(`${API_URL}/wallet/withdraw`, { amount });
      setWallet({ ...wallet, balance: response.data.balance });
      setBalanceChange('negative');
      setTimeout(() => setBalanceChange(null), 300);
      showToast(`Successfully withdrew ${formatPKR(amount)}`, 'success');
      setWithdrawAmount('');
    } catch (error) {
      showToast(error.response?.data?.error || 'Withdrawal failed', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="skeleton h-48 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <div
          className={`rounded-lg p-8 text-center transition-all duration-300 ${
            balanceChange === 'positive'
              ? 'bg-green-100 dark:bg-green-900'
              : balanceChange === 'negative'
              ? 'bg-red-100 dark:bg-red-900'
              : 'bg-gradient-to-r from-blue-500 to-blue-600'
          } ${balanceChange ? 'scale-pulse' : ''}`}
        >
          <h2 className="text-white text-lg mb-2">Current Balance</h2>
          <p className="text-white text-4xl font-bold">
            {formatPKR(countedBalance)}
          </p>
          <p className="text-white text-sm mt-2">{wallet.currency} • {wallet.owner}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Deposit Form */}
        <form onSubmit={handleDeposit} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Deposit</h3>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          <button
            type="submit"
            className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
          >
            Deposit
          </button>
        </form>

        {/* Withdraw Form */}
        <form onSubmit={handleWithdraw} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Withdraw</h3>
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          <button
            type="submit"
            className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            Withdraw
          </button>
        </form>
      </div>
    </div>
  );
};

export default WalletDashboard;