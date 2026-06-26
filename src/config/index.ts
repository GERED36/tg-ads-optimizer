import { z } from 'zod';
import path from 'path';
import fs from 'fs';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  TELEGRAM_ADS_API_TOKEN: z.string().min(1),
  TELEGRAM_ADS_API_BASE_URL: z.string().url().default('https://api.telegram.org/ads/v1'),
  OPTIMIZATION_INTERVAL_MS: z.coerce.number().positive().default(900000),
  CPC_TARGET: z.coerce.number().positive().default(0.5),
  CPO_TARGET: z.coerce.number().positive().default(10.0),
  MIN_CTR_PERCENT: z.coerce.number().min(0).max(100).default(0.5),
  PID_KP: z.coerce.number().default(0.1),
  PID_KI: z.coerce.number().default(0.01),
  PID_KD: z.coerce.number().default(0.05),
  PORT: z.coerce.number().positive().default(3001),
  DASHBOARD_URL: z.string().url().default('http://localhost:5173'),
});

export type Config = z.infer<typeof envSchema>;

function loadEnv(): Record<string, string> {
  const result: Record<string, string> = {};
  const envFile = path.resolve(__dirname, '../../.env');

  try {
    const content = fs.readFileSync(envFile, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const sepIndex = trimmed.indexOf('=');
      if (sepIndex === -1) continue;
      const key = trimmed.slice(0, sepIndex).trim();
      const value = trimmed.slice(sepIndex + 1).trim();
      result[key] = value;
    }
  } catch {
    // .env file not found, use process.env
  }

  return { ...result, ...process.env } as Record<string, string>;
}

export function getConfig(): Config {
  const env = loadEnv();
  const parsed = envSchema.safeParse(env);

  if (!parsed.success) {
    console.error('Invalid configuration:', parsed.error.flatten().fieldErrors);
    process.exit(1);
  }

  return parsed.data;
}
