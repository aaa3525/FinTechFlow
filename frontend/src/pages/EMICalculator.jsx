import React, { useState } from 'react';
import axios from 'axios';
import { useCountUp } from '../hooks/useCountUp';
import { formatPKR } from '../utils/formatPKR';

import API_URL from '../config/api.js';

const EMICalculator = () => {
  const [principal, setPrincipal] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [months, setMonths] = useState('');
  const [result, setResult] = useState(null);
  const [amortization, setAmortization] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const countedEMI = useCountUp(result?.emi || 0, 800);
  const countedTotal = useCountUp(result?.totalPayable || 0, 800);
  const countedInterest = useCountUp(result?.totalInterest || 0, 800);

  const calculateEMI = async () => {
    const p = parseFloat(principal);
    const r = parseFloat(annualRate);
    const n = parseInt(months);

    if (!p || !r || !n || p <= 0 || r < 0 || n <= 0) {
      alert('Please enter valid values');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/emi-calculator`, {
        params: { principal: p, annualRate: r, months: n }
      });
      setResult(response.data);
      calculateAmortization(p, r, n, response.data.emi);
    } catch (error) {
      console.error('Error calculating EMI:', error);
      alert(error.response?.data?.error || 'Calculation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAmortization = (principal, annualRate, months, emi) => {
    const monthlyRate = annualRate / 100 / 12;
    let remainingBalance = principal;
    const table = [];

    for (let i = 1; i <= months; i++) {
      const interest = remainingBalance * monthlyRate;
      const principalComponent = emi - interest;
      remainingBalance -= principalComponent;

      table.push({
        month: i,
        principalComponent: principalComponent,
        interest: interest,
        remainingBalance: Math.max(0, remainingBalance)
      });
    }
    setAmortization(table);
  };

  const totalPrincipal = parseFloat(principal) || 0;
  const totalInterest = result?.totalInterest || 0;
  const interestPercentage = totalPrincipal + totalInterest > 0 
    ? (totalInterest / (totalPrincipal + totalInterest)) * 100 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">EMI Calculator</h2>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Principal Amount (PKR)
            </label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="e.g., 100000"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Annual Interest Rate (%)
            </label>
            <input
              type="number"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
              placeholder="e.g., 12"
              step="0.1"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Tenure (Months)
            </label>
            <input
              type="number"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              placeholder="e.g., 12"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
        
        <button
          onClick={calculateEMI}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Calculating...' : 'Calculate EMI'}
        </button>
      </div>

      {result && (
        <>
          {/* Result Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-center text-white transform hover:scale-105 transition-transform">
              <p className="text-sm mb-2">Monthly EMI</p>
              <p className="text-3xl font-bold">{formatPKR(countedEMI)}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-center text-white transform hover:scale-105 transition-transform">
              <p className="text-sm mb-2">Total Payable</p>
              <p className="text-3xl font-bold">{formatPKR(countedTotal)}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-center text-white transform hover:scale-105 transition-transform">
              <p className="text-sm mb-2">Total Interest</p>
              <p className="text-3xl font-bold">{formatPKR(countedInterest)}</p>
            </div>
          </div>

          {/* Principal vs Interest Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Payment Breakdown</h3>
            <div className="relative h-8 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-500"
                style={{ width: `${100 - interestPercentage}%` }}
              >
                <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-semibold">
                  Principal
                </span>
              </div>
              <div
                className="absolute right-0 top-0 h-full bg-purple-500 transition-all duration-500"
                style={{ width: `${interestPercentage}%` }}
              >
                <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-semibold">
                  Interest
                </span>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-green-600">Principal: {formatPKR(totalPrincipal)}</span>
              <span className="text-purple-600">Interest: {formatPKR(totalInterest)}</span>
            </div>
          </div>

          {/* Amortization Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <h3 className="text-xl font-bold p-6 pb-0 text-gray-800 dark:text-white">Amortization Schedule</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Month</th>
                    <th className="px-4 py-3 text-left">Principal Component</th>
                    <th className="px-4 py-3 text-left">Interest Component</th>
                    <th className="px-4 py-3 text-left">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {amortization.map((row, index) => (
                    <tr
                      key={row.month}
                      className={`border-t dark:border-gray-700 animate-fade-in ${
                        index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900' : ''
                      }`}
                      style={{ animationDelay: `${index * 0.02}s` }}
                    >
                      <td className="px-4 py-2">{row.month}</td>
                      <td className="px-4 py-2">{formatPKR(row.principalComponent)}</td>
                      <td className="px-4 py-2">{formatPKR(row.interest)}</td>
                      <td className="px-4 py-2">{formatPKR(row.remainingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EMICalculator;
