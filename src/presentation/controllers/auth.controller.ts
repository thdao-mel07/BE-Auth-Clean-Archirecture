import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { AuthUseCase } from '../../application/usecases/auth.usecase';
import { CreateUserDTO, LoginUserDTO, ResetPasswordDTO } from '../../domain/entities/user.entity';
import { RefreshTokenDTO } from '../../domain/entities/token.entity';

@injectable()
export class AuthController {
  constructor(private authUseCase: AuthUseCase) {}

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: CreateUserDTO = req.body;
      await this.authUseCase.register(userData);
      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loginData: LoginUserDTO = req.body;
      const tokens = await this.authUseCase.login(loginData);
      res.json({
        status: 'success',
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  }

async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    console.log('[Controller] Logout called'); // 👈 log để xác nhận đã gọi
    const { refreshToken } = req.body;
    await this.authUseCase.logout(refreshToken);
    res.json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('[Controller] Logout error:', error); // 👈 log lỗi
    next(error);
  }
}


  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshTokenData: RefreshTokenDTO = req.body;
      const tokens = await this.authUseCase.refreshToken(refreshTokenData);
      res.json({
        status: 'success',
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      await this.authUseCase.forgotPassword(email);
      res.json({
        status: 'success',
        message: 'If the email exists, a password reset link has been sent',
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resetData: ResetPasswordDTO = req.body;
      await this.authUseCase.resetPassword(resetData);
      res.json({
        status: 'success',
        message: 'Password reset successfully',
      });
      console.log('[resetPassword] req.body:', req.body);
    } catch (error) {
      next(error);
    }
  }
}