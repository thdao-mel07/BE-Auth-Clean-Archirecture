import { Router } from 'express';
import { container } from 'tsyringe';
import { AuthController } from '../controllers/auth.controller';
import {
  validateAuthRequest,
  validateForgotPassword,
  validateRefreshToken,
  validateResetPassword,
} from '../../shared/middlewares/validation.middleware';
import { authenticateJWT } from '../../shared/middlewares/auth.middleware';
import { Request, Response, NextFunction } from 'express';

const router = Router();
const authController = container.resolve(AuthController);

// Public routes
router.post('/register', validateAuthRequest, (req, res, next) => authController.register(req, res, next));
router.post('/login', validateAuthRequest, (req, res, next) => authController.login(req, res, next));
router.post('/refresh-token', validateRefreshToken, (req, res, next) => authController.refreshToken(req, res, next));
router.post('/forgot-password', validateForgotPassword, (req, res, next) => authController.forgotPassword(req, res, next));
router.post('/reset-password', validateResetPassword, (req, res, next) => authController.resetPassword(req, res, next));

// Protected routes
router.post('/logout', [authenticateJWT, validateRefreshToken], 
  (req: Request, res: Response, next: NextFunction) => authController.logout(req, res, next)
);
export default router;