/**
 * 接口角色设置装发射器
 */

import {SetMetadata} from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
