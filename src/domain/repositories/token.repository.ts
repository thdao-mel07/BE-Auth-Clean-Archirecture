import { RefreshToken } from '../entities/token.entity';

export interface ITokenRepository {
  createRefreshToken(userId: string, token: string, expiresAt: Date): Promise<RefreshToken>;
  findRefreshToken(token: string): Promise<RefreshToken | null>;
  deleteRefreshToken(token: string): Promise<void>;
  deleteAllUserRefreshTokens(userId: string): Promise<void>;
  clearResetToken(userId: string): Promise<void>;

}