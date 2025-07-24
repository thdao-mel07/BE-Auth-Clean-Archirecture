import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors/app-error';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateAuthRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw new ValidationError('Email is required');
    }

    if (!validateEmail(email)) {
      throw new ValidationError('Invalid email format');
    }

    if (req.path !== '/forgot-password') {
      if (!password) {
        throw new ValidationError('Password is required');
      }

      if (!validatePassword(password)) {
        throw new ValidationError('Password must be at least 6 characters long');
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const validateRefreshToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    console.log('[Validation] Body:', req.body); //  debug log
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    next();
  } catch (error) {
    console.error('[Validation] Error:', error); //  debug log
    next(error);
  }
};


export const validateResetPassword = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { token, newPassword } = req.body;

    if (!token) {
      throw new ValidationError('Reset token is required');
    }

    if (!newPassword) {
      throw new ValidationError('New password is required');
    }

    if (!validatePassword(newPassword)) {
      throw new ValidationError('New password must be at least 6 characters long');
    }

    next();
  } catch (error) {
    next(error);
  }

};

export const validateForgotPassword = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ValidationError('Email is required');
    }

    if (!validateEmail(email)) {
      throw new ValidationError('Invalid email format');
    }

    next();
  } catch (error) {
    next(error);
  }
};
