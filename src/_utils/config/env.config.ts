import {
  IsNumber,
  IsString,
  ValidateNested,
  validateSync,
} from 'class-validator';
import { plainToInstance, Type } from 'class-transformer';
import { exit } from 'process';
import { Logger } from '@nestjs/common';

export class ServerConfig {
  @IsNumber()
  PORT: number;

  @IsString()
  SESSION_SECRET: string;
}

export class SmsModeConfig {
  @IsString()
  SMS_MODE_CLIENT_API_KEY: string;
}

export class DatabaseConfig {
  @IsString()
  DATABASE_URL: string;
}

export class EnvironmentVariables {
  @ValidateNested()
  @Type(() => ServerConfig)
  SERVER: ServerConfig;

  @ValidateNested()
  @Type(() => SmsModeConfig)
  SMSMODE: SmsModeConfig;
}

export function validateEnv(config: Record<string, unknown>) {
  const structuredConfig = {
    SERVER: {
      PORT: config.PORT,
      SESSION_SECRET: config.SESSION_SECRET,
    },
    SMSMODE: {
      SMS_MODE_CLIENT_API_KEY: config.SMS_MODE_CLIENT_API_KEY,
    },
    DATABASE: {
      DATABASE_URL: config.DATABASE_URL,
    },
  };

  const validatedConfig = plainToInstance(
    EnvironmentVariables,
    structuredConfig,
    {
      enableImplicitConversion: true,
    },
  );

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    new Logger(validateEnv.name).error(errors.toString());
    exit();
  }

  return validatedConfig;
}
