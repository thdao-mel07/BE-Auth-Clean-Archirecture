import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import './shared/config/container';
import authRoutes from './presentation/routes/auth.routes';
import { errorHandler } from './shared/middlewares/error.middleware';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.get('/reset-password', (req, res) => {
  const token = req.query.token;
  res.send(`
    <form method="POST" action="/api/auth/reset-password">
      <input type="hidden" name="token" value="${token}" />
      <input type="password" name="newPassword" placeholder="Enter new password" required />
      <button type="submit">Reset Password</button>
    </form>
  `);
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      name: 'NotFoundError',
      message: 'Route not found',
    },
  });
});

export default app;