import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
console.log(__dirname)
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '123456',
            database: 'demo',
            entities: [join(__dirname, '../**/**/**.entity{.ts,.js}')],
            synchronize: true,
        }),
    ],
})
export class MysqlDatabase {}
