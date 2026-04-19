import express from 'express';
const router = express.Router();

// In-memory storage
let wallet = {
  balance: 12500,
  currency: 'PKR',
  owner: 'FintechFlow User'
};

let transactions = [];
let transactionId = 1;

// Helper to add transaction
const addTransaction = (type, amount, description) => {
  const transaction = {
    id: transactionId++,
    type,
    amount,
    timestamp: new Date().toISOString(),
    description
  };
  transactions.unshift(transaction);
  return transaction;
};

// GET /api/wallet
router.get('/wallet', (req, res) => {
  res.json(wallet);
});

// POST /api/wallet/deposit
router.post('/wallet/deposit', (req, res) => {
  const { amount } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be greater than 0' });
  }
  
  wallet.balance += amount;
  addTransaction('credit', amount, `Deposit of PKR ${amount}`);
  res.json({ balance: wallet.balance, message: 'Deposit successful' });
});

// POST /api/wallet/withdraw
router.post('/wallet/withdraw', (req, res) => {
  const { amount } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be greater than 0' });
  }
  
  if (wallet.balance < amount) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }
  
  wallet.balance -= amount;
  addTransaction('debit', amount, `Withdrawal of PKR ${amount}`);
  res.json({ balance: wallet.balance, message: 'Withdrawal successful' });
});

// GET /api/transactions
router.get('/transactions', (req, res) => {
  const { type } = req.query;
  
  let filteredTransactions = [...transactions];
  
  if (type === 'credit') {
    filteredTransactions = filteredTransactions.filter(t => t.type === 'credit');
  } else if (type === 'debit') {
    filteredTransactions = filteredTransactions.filter(t => t.type === 'debit');
  }
  
  res.json(filteredTransactions);
});

export default router;