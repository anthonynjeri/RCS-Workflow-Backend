import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { MessagingController } from './messaging.controller';
import { MessagingRepository } from './messaging.repository';

@Module({
  providers: [MessagingService, MessagingRepository],
  controllers: [MessagingController],
  exports: [MessagingService, MessagingRepository],
})
export class MessagingModule {}
