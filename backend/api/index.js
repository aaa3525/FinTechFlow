import express from 'express';
import walletRoutes from '../routes/wallet.js';
import loansRoutes from '../routes/loans.js';

const app = express();

app.use(express.json());

// Routes
app.use('/api', walletRoutes);
app.use('/api', loansRoutes);

// Export for Vercel serverless
export default app;