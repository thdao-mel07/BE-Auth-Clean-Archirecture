import { container } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { ITokenRepository } from '../../domain/repositories/token.repository';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { TokenRepository } from '../../infrastructure/repositories/token.repository';
import { AuthService } from '../../infrastructure/services/auth.service';
import { EmailService } from '../../infrastructure/services/email.service';
import { AuthUseCase } from '../../application/usecases/auth.usecase';
import { AuthController } from '../../presentation/controllers/auth.controller';

container.registerSingleton<IUserRepository>('IUserRepository', UserRepository);
container.registerSingleton<ITokenRepository>('ITokenRepository', TokenRepository);
container.registerSingleton(AuthService);
container.registerSingleton(EmailService);
container.registerSingleton(AuthUseCase);
container.registerSingleton(AuthController);

export { container };