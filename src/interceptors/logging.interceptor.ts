/**
 * 拦截请求，在请求前后定制输出日志
 */

import {Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject} from '@nestjs/common';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Logger} from 'winston';

export interface Response<T> {
    data: T;
}

@Injectable()
export class LoggingInterceptor<T> implements NestInterceptor<T, Response<T>> {
    constructor(
        @Inject('winston') private readonly logger: Logger,
    ) {
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        this.logger.info(`Before ${context.getArgs()[0].method} ${context.getArgs()[0].originalUrl} ${JSON.stringify(context.getArgs()[0].headers)} ${JSON.stringify(context.getArgs()[0].body)}`);

        const now = Date.now();
        return next
            .handle()
            .pipe(
                tap((data) => this.logger.info(`After ${context.getArgs()[0].method} ${context.getArgs()[0].originalUrl} ${JSON.stringify(data)} ${Date.now() - now}ms`)),
            );
    }
}
