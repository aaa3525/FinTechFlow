import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCountUp } from '../hooks/useCountUp';
import { useToast } from '../contexts/ToastContext';
import { formatPKR } from '../utils/formatPKR';
import { LoanCardSkeleton } from '../components/SkeletonLoader';

const API_URL = 'http://localhost:5000/api';

const LoanStatus = () => {
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('amount-desc');
  const { showToast } = useToast();

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await axios.get(`${API_URL}/loans`);
      setLoans(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching loans:', error);
      setIsLoading(false);
    }
  };

  const updateLoanStatus = async (id, status) => {
    try {
      const response = await axios.patch(`${API_URL}/loans/${id}/status`, { status });
      setLoans(loans.map(loan => loan.id === id ? response.data : loan));
      showToast(`Loan ${status} successfully!`, 'success');
    } catch (error) {
      showToast(error.response?.data?.error || 'Update failed', 'error');
    }
  };

  const getStatusCounts = () => {
    const counts = { pending: 0, approved: 0, rejected: 0 };
    loans.forEach(loan => {
      counts[loan.status]++;
    });
    return counts;
  };

  const getSortedLoans = () => {
    const sorted = [...loans];
    switch (sortBy) {
      case 'amount-desc':
        return sorted.sort((a, b) => b.amount - a.amount);
      case 'amount-asc':
        return sorted.sort((a, b) => a.amount - b.amount);
      case 'status':
        return sorted.sort((a, b) => a.status.localeCompare(b.status));
      default:
        return sorted;
    }
  };

  const counts = getStatusCounts();
  const sortedLoans = getSortedLoans();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <LoanCardSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-yellow-100 dark:bg-yellow-900 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {counts.pending}
          </p>
        </div>
        <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">Approved</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {counts.approved}
          </p>
        </div>
        <div className="bg-red-100 dark:bg-red-900 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">Rejected</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {counts.rejected}
          </p>
        </div>
      </div>

      {/* Sort Control */}
      <div className="mb-6 flex justify-end">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <option value="amount-desc">Amount: High to Low</option>
          <option value="amount-asc">Amount: Low to High</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      {/* Loan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedLoans.map(loan => (
          <div key={loan.id} className="relative h-64 cursor-pointer group">
            <div className="card-flip w-full h-full">
              {/* Front of card */}
              <div className={`card-front absolute w-full h-full rounded-lg p-4 shadow-lg ${
                loan.status === 'pending' ? 'animate-pulse-glow' : ''
              } ${
                loan.status === 'approved' 
                  ? 'bg-green-100 dark:bg-green-900'
                  : loan.status === 'rejected'
                  ? 'bg-red-100 dark:bg-red-900'
                  : 'bg-yellow-100 dark:bg-yellow-900'
              }`}>
                <h3 className="font-bold text-lg mb-2">{loan.applicant}</h3>
                <p className="text-2xl font-bold mb-2">{formatPKR(loan.amount)}</p>
                <p className="text-sm mb-1">Purpose: {loan.purpose}</p>
                <p className="text-sm mb-1">Tenure: {loan.tenure} months</p>
                <p className="text-sm">Applied: {new Date(loan.appliedDate).toLocaleDateString()}</p>
                <div className={`absolute top-4 right-4 px-2 py-1 rounded text-xs font-semibold ${
                  loan.status === 'approved'
                    ? 'bg-green-500 text-white'
                    : loan.status === 'rejected'
                    ? 'bg-red-500 text-white'
                    : 'bg-yellow-500 text-white'
                }`}>
                  {loan.status.toUpperCase()}
                </div>
              </div>
              
              {/* Back of card */}
              <div className="card-back absolute w-full h-full rounded-lg bg-gray-800 dark:bg-gray-700 p-4 shadow-lg flex flex-col justify-center items-center space-y-3">
                <h3 className="text-white font-bold mb-4">Update Status</h3>
                {loan.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateLoanStatus(loan.id, 'approved')}
                      className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateLoanStatus(loan.id, 'rejected')}
                      className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}
                {loan.status !== 'pending' && (
                  <p className="text-white text-center">
                    This application has been {loan.status}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {loans.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No loan applications found
        </div>
      )}
    </div>
  );
};

export default LoanStatus;