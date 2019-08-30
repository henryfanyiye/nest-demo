/**
 * 基于角色的认证
 */
import {Injectable, CanActivate, ExecutionContext, Inject} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import { Logger } from 'winston';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        @Inject('winston') private readonly logger: Logger,
        private readonly reflector: Reflector
    ) {
    }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        this.logger.info(`Roles : ${JSON.stringify(roles)}`);
        const {headers: {role}} = context.switchToHttp().getRequest();
        return role && roles[0] == role ? true : false;
    }
}
