import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagingModule } from './messaging/messaging.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './_utils/config/env.config';
import { WebhooksModule } from './webhooks/webhooks.module';
import { WorkFlowModule } from './work-flow/work-flow.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MessagingModule,
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'rcs_workflow.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ConfigModule.forRoot({ validate: validateEnv, isGlobal: true }),
    WebhooksModule,
    WorkFlowModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
