import { Module } from '@nestjs/common';
import { UserService } from './user.service';

import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserRepository } from 'src/user/user.repository';
import { DataAccess } from 'src/data-access/dataAccess';
import { UserController } from './user.controller';
import { RabbitModule } from 'src/rabbit/rabbit.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), RabbitModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, DataAccess],
})
export class UserModule {}
