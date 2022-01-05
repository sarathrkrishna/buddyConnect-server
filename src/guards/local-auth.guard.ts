import {
  BadRequestException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { localAuthRequestSchema } from './validation/local-auth.joi';
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    // validate the credential here.
    const request = context.switchToHttp().getRequest();
    const {
      body: { username, password },
    } = request;

    const { error } = localAuthRequestSchema.validate({
      username,
      password,
    });

    if (error) {
      throw new BadRequestException(error.details[0].message);
    }

    return super.canActivate(context);
  }
}
