import express from 'express';
import cors from 'cors';
import walletRoutes from './routes/wallet.js';
import loansRoutes from './routes/loans.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', walletRoutes);
app.use('/api', loansRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});