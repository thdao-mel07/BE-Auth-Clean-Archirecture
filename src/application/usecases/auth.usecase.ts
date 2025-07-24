import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { ITokenRepository } from "../../domain/repositories/token.repository";
import { AuthService } from "../../infrastructure/services/auth.service";
import { EmailService } from "../../infrastructure/services/email.service";
import {
  CreateUserDTO,
  LoginUserDTO,
  ResetPasswordDTO,
} from "../../domain/entities/user.entity";
import { TokenPair, RefreshTokenDTO } from "../../domain/entities/token.entity";
import {
  ValidationError,
  AuthenticationError,
  NotFoundError,
} from "../../shared/errors/app-error";

@injectable()
export class AuthUseCase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("ITokenRepository") private tokenRepository: ITokenRepository,
    private authService: AuthService,
    private emailService: EmailService
  ) {}

  async register(data: CreateUserDTO): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ValidationError("Email already registered");
    }

    const hashedPassword = await this.authService.hashPassword(data.password);
    await this.userRepository.create({
      email: data.email,
      password: hashedPassword,
    });
  }

  async login(data: LoginUserDTO): Promise<TokenPair> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AuthenticationError("Invalid credentials");
    }

    const isPasswordValid = await this.authService.comparePasswords(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid credentials");
    }

    const tokenPair = this.authService.generateTokenPair({
      userId: user.id,
      email: user.email,
    });

    // GHI ĐÈ refresh token cũ (nếu có)
    await this.tokenRepository.deleteAllUserRefreshTokens(user.id);

    // Tạo refresh token mới
    await this.tokenRepository.createRefreshToken(
      user.id,
      tokenPair.refreshToken,
      this.authService.getRefreshTokenExpiration()
    );

    return tokenPair;
  }

  async logout(refreshToken: string): Promise<void> {
    const token = await this.tokenRepository.findRefreshToken(refreshToken);
    if (!token) {
      throw new ValidationError("Invalid refresh token");
    }
    await this.tokenRepository.deleteRefreshToken(refreshToken);
  }

  async refreshToken(data: RefreshTokenDTO): Promise<TokenPair> {
    const refreshTokenDoc = await this.tokenRepository.findRefreshToken(
      data.refreshToken
    );
    if (!refreshTokenDoc) {
      throw new AuthenticationError("Invalid refresh token");
    }

    if (new Date() > refreshTokenDoc.expiresAt) {
      await this.tokenRepository.deleteRefreshToken(data.refreshToken);
      throw new AuthenticationError("Refresh token expired");
    }

    try {
      const payload = this.authService.verifyRefreshToken(data.refreshToken);
      const user = await this.userRepository.findById(payload.userId);
      if (!user) {
        throw new NotFoundError("User not found");
      }

      await this.tokenRepository.deleteRefreshToken(data.refreshToken);

      const tokenPair = this.authService.generateTokenPair({
        userId: user.id,
        email: user.email,
      });

      await this.tokenRepository.createRefreshToken(
        user.id,
        tokenPair.refreshToken,
        this.authService.getRefreshTokenExpiration()
      );

      return tokenPair;
    } catch (error) {
      throw new AuthenticationError("Invalid refresh token");
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return; // Don't reveal if email exists
    }

    const resetToken = this.authService.generateResetToken();
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.userRepository.updateResetToken(
      user.id,
      resetToken,
      resetTokenExpiry
    );
    await this.emailService.sendPasswordResetEmail(email, resetToken);
  }

  async resetPassword(data: ResetPasswordDTO): Promise<void> {
    this.authService.verifyResetToken(data.token);
    const user = await this.userRepository.findByResetToken(data.token);
    if (!user) {
      throw new ValidationError("Invalid reset token");
    }

    const hashedPassword = await this.authService.hashPassword(
      data.newPassword
    );
    // Cập nhật password
    await this.userRepository.updatePassword(user.id, hashedPassword);

    // Xóa reset token
    await this.userRepository.updateResetToken(user.id, null, null);
  }
}
