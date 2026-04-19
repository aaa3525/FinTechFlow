import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../contexts/ToastContext';
import { formatPKR } from '../utils/formatPKR';

import API_URL from '../config/api.js';

const LoanApplication = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    applicant: '',
    cnic: '',
    contact: '',
    amount: '',
    purpose: '',
    tenure: ''
  });
  const [errors, setErrors] = useState({});
  const [submittedLoan, setSubmittedLoan] = useState(null);
  const { showToast } = useToast();

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.applicant) newErrors.applicant = 'Name is required';
    if (!formData.cnic) newErrors.cnic = 'CNIC is required';
    else if (!/^\d{5}-\d{7}-\d$/.test(formData.cnic)) {
      newErrors.cnic = 'CNIC must be in format XXXXX-XXXXXXX-X';
    }
    if (!formData.contact) newErrors.contact = 'Contact number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    const amount = parseFloat(formData.amount);
    if (!formData.amount) newErrors.amount = 'Amount is required';
    else if (amount < 5000 || amount > 5000000) {
      newErrors.amount = 'Amount must be between PKR 5,000 and PKR 5,000,000';
    }
    if (!formData.purpose) newErrors.purpose = 'Purpose is required';
    if (!formData.tenure) newErrors.tenure = 'Tenure is required';
    else if (formData.tenure < 3 || formData.tenure > 60) {
      newErrors.tenure = 'Tenure must be between 3 and 60 months';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API_URL}/loans/apply`, {
        applicant: formData.applicant,
        amount: parseFloat(formData.amount),
        purpose: formData.purpose,
        tenure: parseInt(formData.tenure)
      });
      setSubmittedLoan(response.data);
      showToast('Loan application submitted successfully!', 'success');
    } catch (error) {
      showToast(error.response?.data?.error || 'Application failed', 'error');
    }
  };

  if (submittedLoan) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-green-100 dark:bg-green-900 rounded-lg p-8 text-center animate-fade-in">
          <div className="text-6xl mb-4">ðŸŽ‰</div>
          <h2 className="text-2xl font-bold mb-4 text-green-800 dark:text-green-200">
            Application Submitted Successfully!
          </h2>
          <p className="text-lg mb-2">Your Loan ID: <strong>{submittedLoan.id}</strong></p>
          <p className="text-gray-600 dark:text-gray-300">
            Status: <span className="font-semibold">{submittedLoan.status.toUpperCase()}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm">Personal Info</span>
          <span className="text-sm">Loan Details</span>
          <span className="text-sm">Review</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg step-transition">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.applicant}
                  onChange={(e) => setFormData({ ...formData, applicant: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.applicant && <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.applicant}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  CNIC (XXXXX-XXXXXXX-X)
                </label>
                <input
                  type="text"
                  value={formData.cnic}
                  onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                  placeholder="12345-1234567-1"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.cnic && <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.cnic}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.contact && <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.contact}</p>}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Loan Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Loan Amount (PKR)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="Min: 5,000 | Max: 5,000,000"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.amount && <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.amount}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Purpose
                </label>
                <select
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Select purpose</option>
                  <option value="Business">Business</option>
                  <option value="Education">Education</option>
                  <option value="Medical">Medical</option>
                  <option value="Personal">Personal</option>
                </select>
                {errors.purpose && <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.purpose}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Tenure (Months)
                </label>
                <input
                  type="number"
                  value={formData.tenure}
                  onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
                  placeholder="3 to 60 months"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.tenure && <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.tenure}</p>}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Review Application</h2>
            <div className="space-y-3 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p><strong>Name:</strong> {formData.applicant}</p>
              <p><strong>CNIC:</strong> {formData.cnic}</p>
              <p><strong>Contact:</strong> {formData.contact}</p>
              <p><strong>Amount:</strong> {formatPKR(parseFloat(formData.amount) || 0)}</p>
              <p><strong>Purpose:</strong> {formData.purpose}</p>
              <p><strong>Tenure:</strong> {formData.tenure} months</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-auto"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ml-auto"
            >
              Submit Application
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;
