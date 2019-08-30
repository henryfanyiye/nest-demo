import {NestFactory} from '@nestjs/core';
import {Logger} from '@nestjs/common';
import {AppModule} from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: false
    });

    await app.listen(3000);
    Logger.log('Server listening at: http://localhost:3000');
}

bootstrap();
