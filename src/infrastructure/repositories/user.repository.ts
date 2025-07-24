//import { PrismaClient } from '../../../generated/prisma';
import { PrismaClient } from "@prisma/client";
import { injectable } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { User, CreateUserDTO } from '../../domain/entities/user.entity';

@injectable()
export class UserRepository implements IUserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: CreateUserDTO): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        resetToken: undefined,
        resetTokenExp: undefined
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateResetToken(userId: string, token: string | null, expiry: Date | null): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        resetToken: token,
        resetTokenExp: expiry,
      },
    });
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: newPassword,
        resetToken: undefined,
        resetTokenExp: undefined,
      },
    });
  }
  async findByResetToken(token: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        refreshTokens: {
          some: {
            expiresAt: {
              gte: new Date(), // Token chưa hết hạn
            }
          }
        },
      },
    });

    return user ? (user as User) : null;
  }
}