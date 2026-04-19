import express from 'express';
const router = express.Router();

// In-memory storage
let loanApplications = [];
let loanId = 1;

// Helper to calculate EMI
const calculateEMI = (principal, annualRate, months) => {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
              (Math.pow(1 + monthlyRate, months) - 1);
  return emi;
};

// POST /api/loans/apply
router.post('/loans/apply', (req, res) => {
  const { applicant, amount, purpose, tenure } = req.body;
  
  // Validation
  if (!applicant || !amount || !purpose || !tenure) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (amount < 5000 || amount > 5000000) {
    return res.status(400).json({ error: 'Amount must be between PKR 5,000 and PKR 5,000,000' });
  }
  
  if (tenure < 3 || tenure > 60) {
    return res.status(400).json({ error: 'Tenure must be between 3 and 60 months' });
  }
  
  const loan = {
    id: loanId++,
    applicant,
    amount,
    purpose,
    tenure,
    status: 'pending',
    appliedDate: new Date().toISOString()
  };
  
  loanApplications.unshift(loan);
  res.status(201).json(loan);
});

// GET /api/loans
router.get('/loans', (req, res) => {
  res.json(loanApplications);
});

// PATCH /api/loans/:id/status
router.patch('/loans/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (status !== 'approved' && status !== 'rejected') {
    return res.status(400).json({ error: 'Status must be "approved" or "rejected"' });
  }
  
  const loan = loanApplications.find(l => l.id === parseInt(id));
  
  if (!loan) {
    return res.status(404).json({ error: 'Loan application not found' });
  }
  
  loan.status = status;
  res.json(loan);
});

// GET /api/emi-calculator
router.get('/emi-calculator', (req, res) => {
  const { principal, annualRate, months } = req.query;
  
  const p = parseFloat(principal);
  const r = parseFloat(annualRate);
  const n = parseInt(months);
  
  if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || r < 0 || n <= 0) {
    return res.status(400).json({ error: 'Invalid parameters. Please provide valid principal, annualRate, and months' });
  }
  
  const emi = calculateEMI(p, r, n);
  const totalPayable = emi * n;
  const totalInterest = totalPayable - p;
  
  res.json({
    emi: Math.round(emi * 100) / 100,
    totalPayable: Math.round(totalPayable * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100
  });
});

export default router;