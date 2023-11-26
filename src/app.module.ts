import { MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { MorganInterceptor } from './interceptor/morgan.interceptor';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import envConfig from './config/env.config';
import { RabbitModule } from './rabbit/rabbit.module';

@Module({
  imports: [ScheduleModule.forRoot(), MongooseModule.forRoot(envConfig.mongo.uri), UserModule, RabbitModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: MorganInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*');
  }
}
