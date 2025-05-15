import { UsersService } from '../users.service';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private UsersService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    let userId = undefined;
    if (request.session?.userId) {
      userId = request.session.userId;
    } else {
      return handler.handle();
    }

    console.log('intercept', userId);

    if (userId) {
      //   console.log('this.UsersService', this.UsersService);

      const user = await this.UsersService.findOne(userId);
      request.currentUser = user;
    }

    return handler.handle();
  }
}
