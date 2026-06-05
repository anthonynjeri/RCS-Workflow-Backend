import { Injectable } from '@nestjs/common';
import { SmsmodeRcsClient } from '@smsmode/rcs';
import { ConfigService } from '@nestjs/config';
import {
  EnvironmentVariables,
  SmsModeConfig,
} from '../_utils/config/env.config';

@Injectable()
export class WebhooksRepository {
  private rcsClient: SmsmodeRcsClient;
  constructor(
    private readonly configServices: ConfigService<EnvironmentVariables, true>,
  ) {
    this.rcsClient = new SmsmodeRcsClient({
      apiKey:
        configServices.get<SmsModeConfig>('SMSMODE').SMS_MODE_CLIENT_API_KEY,
    });
  }

  // async getAllCallBackMessages(s) {
  //   const messages = this.rcsClient.list({});
  // }
}
