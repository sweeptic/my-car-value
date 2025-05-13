import { UsersService } from '../users.service';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';

export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private UsersService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session;

    if (userId) {
      const user = await this.UsersService.findOne(userId);
      request.currentUser = user;
    }

    return handler.handle();
  }
}
