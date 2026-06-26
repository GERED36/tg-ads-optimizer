import { getConfig } from './config';
import { createTelegramClient } from './api/telegram';
import { Engine } from './engine';
import { Reporter } from './reporter';
import { createServer } from './server';

async function main() {
  const config = getConfig();

  const reporter = new Reporter();
  const telegramClient = createTelegramClient(config);
  const engine = new Engine(config, telegramClient, (metrics) => reporter.updateMetrics(metrics));

  createServer(config, reporter);

  await engine.start();

  const shutdown = () => {
    console.log('Shutting down...');
    engine.stop();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
