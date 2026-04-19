import express from 'express';
import cors from 'cors';
import walletRoutes from './routes/wallet.js';
import loansRoutes from './routes/loans.js';

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: [
    'https://fintechflow-seven.vercel.app',
    'https://fintechflow.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', walletRoutes);
app.use('/api', loansRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'FintechFlow API is running' });
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});