export interface User {
  id: string;
  email: string;
  password: string;
  resetToken: string | null;
  resetTokenExp: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  email: string;
  password: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}