import { plainToClass } from 'class-transformer';
import { IsOptional, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  POSTGRES_USER!: string;

  @IsString()
  POSTGRES_PASSWORD!: string;

  @IsString()
  POSTGRES_DATABASE!: string;

  @IsString()
  POSTGRES_HOST!: string;

  @IsString()
  POSTGRES_PORT!: string;

  @IsString()
  UNIQUE_CHAIN_GQL_API!: string;

  @IsString()
  QUARTZ_CHAIN_GQL_API!: string;

  @IsOptional()
  @IsString()
  OPAL_CHAIN_GQL_API?: string;
}

export function envValidate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(error.value, error.property);
    }

    throw new Error(errors.toString());
  }

  return validatedConfig;
}
