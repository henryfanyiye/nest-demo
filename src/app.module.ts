import {Module, Global} from '@nestjs/common';
import {APP_GUARD, APP_INTERCEPTOR} from '@nestjs/core';
import {UserModule} from './modules/user/user.module';
import {RolesGuard} from './guards/roles.guard';
import {AuthModule} from './modules/auth/auth.module';
import {MysqlDatabase} from './databases/mysql.database';
import {PhotoModule} from './modules/photo/photo.module';
import {MongoDatabase} from './databases/mongo.database';
import {WinstonModule} from 'nest-winston';
import * as winston from 'winston';
import {LoggingInterceptor} from './interceptors/logging.interceptor';
import {TransformInterceptor} from './interceptors/transform.interceptor';

@Global()
@Module({
    imports: [
        WinstonModule.forRoot({
            level: 'info',
            format: winston.format.json(),
            transports: [
                //
                // - Write to all logs with level `info` and below to `combined.log`
                // - Write all logs error (and below) to `error.log`.
                //
                new winston.transports.File({filename: './logs/error.log', level: 'error'}),
                new winston.transports.File({filename: './logs/combined.log'}),
                new winston.transports.Console({format: winston.format.json()})
            ]
        }),

        // Auth认证
        AuthModule,

        // 数据库连接
        MysqlDatabase,
        MongoDatabase,

        // Modules
        UserModule,
        PhotoModule,
    ],
    providers: [
        // 角色认证
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
        // Request&Response拦截
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
        // Response格式化
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },
    ],
    exports: [
        AuthModule
    ]
})
export class AppModule {
}
