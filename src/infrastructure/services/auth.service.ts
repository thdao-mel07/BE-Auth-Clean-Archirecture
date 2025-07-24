import { injectable } from 'tsyringe';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { TokenPayload, TokenPair } from '../../domain/entities/token.entity';

@injectable()
export class AuthService {
  private readonly accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'access-secret';
  private readonly refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';
  private readonly accessTokenExpiration = '15m';
  private readonly refreshTokenExpiration = '7d';

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateTokenPair(payload: TokenPayload): TokenPair {
    const accessToken = jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiration,
    });

    const refreshToken = jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiration,
    });

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, this.accessTokenSecret) as TokenPayload;
  }

  verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, this.refreshTokenSecret) as TokenPayload;
  }

  getRefreshTokenExpiration(): Date {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  }

  generateResetToken(): string {
    return jwt.sign({}, this.accessTokenSecret, { expiresIn: '1h' });
  }

  verifyResetToken(token: string): boolean {
    try {
      jwt.verify(token, this.accessTokenSecret);
      return true;
    } catch {
      return false;
    }
  }
}