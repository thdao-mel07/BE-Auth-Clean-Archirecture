import { User, CreateUserDTO } from '../entities/user.entity';

export interface IUserRepository {
  create(data: CreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  updateResetToken(userId: string, token: string | null, expiry: Date | null): Promise<void>;
  updatePassword(userId: string, newPassword: string): Promise<void>;
  findByResetToken(resetToken: string): Promise<User | null>;
}