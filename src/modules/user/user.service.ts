import {Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {UserDto} from './dto/user.dto';
import {User} from './interfaces/user.interface';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {
    }

    async findOrCreate(userDto: UserDto) {
        const data = await this.userModel.find({username: userDto.username}).exec();
        if (data.length > 0) {
            return {
                message: 'User is exist.',
            };
        } else {
            const createdUser = new this.userModel(userDto);
            await createdUser.save();
            return {
                message: 'Create user success.',
            };
        }
    }

    async login(username, password) {
        return await this.userModel.find({username, password}).exec();
    }

    async detail(id) {
        return await this.userModel.find({id}).exec();
    }

}
