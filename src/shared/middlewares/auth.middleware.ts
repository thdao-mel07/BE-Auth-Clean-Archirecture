import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { AuthService } from '../../infrastructure/services/auth.service';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('[JWT] Authorization Header:', authHeader); //  debug log

    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const authService = container.resolve(AuthService);
    const payload = authService.verifyAccessToken(token);

    console.log('[JWT] Payload:', payload); //  debug log

    req.user = payload;
    next();
    return;
  } catch (error) {
    console.error('[JWT] Error:', error); //  debug log
    return res.status(401).json({ error: 'Invalid token' });
  }
};