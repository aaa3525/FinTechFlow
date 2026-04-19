import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatPKR } from '../utils/formatPKR';
import { TransactionSkeleton } from '../components/SkeletonLoader';

import API_URL from '../config/api.js';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, typeFilter]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API_URL}/transactions`);
      setTransactions(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setIsLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];
    
    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredTransactions(filtered);
  };

  const getSummary = () => {
    const totalCredits = filteredTransactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalDebits = filteredTransactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netBalance = totalCredits - totalDebits;
    
    return { totalCredits, totalDebits, netBalance };
  };

  const summary = getSummary();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <TransactionSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Credits</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatPKR(summary.totalCredits)}
          </p>
        </div>
        <div className="bg-red-100 dark:bg-red-900 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Debits</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatPKR(summary.totalDebits)}
          </p>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">Net Balance</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatPKR(summary.netBalance)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Transactions</option>
            <option value="credit">Credits Only</option>
            <option value="debit">Debits Only</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.map((transaction, index) => (
          <div
            key={transaction.id}
            className="stagger-card bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-lg transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`text-2xl ${transaction.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                  {transaction.type === 'credit' ? 'â†‘' : 'â†“'}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(transaction.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'credit' ? '+' : '-'} {formatPKR(transaction.amount)}
                </p>
                <span className={`text-xs px-2 py-1 rounded ${
                  transaction.type === 'credit' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {transaction.type.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
