import {Body, Controller, Get, Headers, Inject, Post, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import * as uuid from 'uuid/v1';
import { Logger } from 'winston';
import {UserService} from './user.service';
import {Roles} from '../../guards/roles.decorator';
import {AuthService} from '../auth/auth.service';
import {UserDto} from './dto/user.dto';

@Controller('user') // 定义请求路径
export class UserController {
    constructor(
        @Inject('winston') private readonly logger: Logger,
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {
    }

    @Post('create')
    @Roles('admin') // 定义接口角色权限
    async create(@Body() userDto: UserDto) {
        try {
            userDto.id = uuid();
            return await this.userService.findOrCreate(userDto);
        } catch (err) {
            return err;
        }
    }

    @Post('login') // 定义接口
    async login(@Body() userDto: UserDto) {
        try {
            const {username, password} = userDto;
            const user = await this.userService.login(username, password);
            if (user.length == 1) {
                const token = await this.authService.createToken(username);
                return {
                    id: user[0].id,
                    ...token,
                };
            } else {
                return {
                    message: 'User dose not exist.',
                };
            }
        } catch (error) {
            return error;
        }
    }

    @Get('detail')
    @Roles('user') // 定义接口角色权限
    @UseGuards(AuthGuard()) // JWT认证
    async detail(
        @Headers('id') id: string,
    ) {
        return await this.userService.detail(id);
    }

}
