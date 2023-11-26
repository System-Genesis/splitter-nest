import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { DataAccess } from 'src/data-access/dataAccess';
import { User } from './user.schema';
import { Cron } from '@nestjs/schedule';
import config from 'src/config/env.config';

// TODO: Remove return await
@Injectable()
export class UserService implements OnApplicationBootstrap {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly dataAccess: DataAccess,
  ) {}

  onApplicationBootstrap() {
    void this.updateAll();
  }

  // Finds all and insert to the DB
  async updateAll(): Promise<User[]> {
    const updatedData = await this.dataAccess.getData();

    if (updatedData?.length && updatedData.length > 1) {
      try {
        await this.userRepository.insetMany(updatedData as User[]);
        await this.userRepository.deleteAll();
      } catch (err: any) {
        console.log(err.message);
      }
      return updatedData;
    }

    return [];
  }

  findAllDB(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  findByPersonalNumber(personalNumber: string): Promise<User> {
    return this.userRepository.findByPersonalNumber(personalNumber);
  }

  findByIdentityCard(identityCard: string): Promise<User> {
    return this.userRepository.findByIdentityCard(identityCard);
  }

  findByUser(user: string): Promise<User> {
    return this.userRepository.findByUser(user.split('@')[0]);
  }

  @Cron(config.service.updateCron, {
    timeZone: 'Asia/Jerusalem',
  })
  async updateAllCron() {
    console.log('Cron starting, Getting Data');
    const data = await this.updateAll();
    console.log(`Got ${data.length} records`);
  }
}
