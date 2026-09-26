import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { RootsListChangedNotificationSchema } from '@modelcontextprotocol/sdk/types.js';
import { registerJevTools } from '../adapters/tools/index.js';
import { ClientRoots } from './client-roots.js';
import { loadConfig, type Config } from './config.js';
import { FsSourceReader } from './fs-source-reader.js';
import { TypeSafeJev } from './typesafe-jev.js';

const NAME = 'jev';
const VERSION = '0.1.0';

function build(config: Config): McpServer {
  const server = new McpServer({ name: NAME, version: VERSION });
  const roots = new ClientRoots(server.server);
  server.server.setNotificationHandler(RootsListChangedNotificationSchema, () => {
    roots.invalidate();
  });
  registerJevTools(server, {
    jev: new TypeSafeJev({ apiKey: config.apiKey, model: config.model }),
    reader: new FsSourceReader({
      roots: () => roots.list(),
      allowReading: config.allowSourceReading,
      maxFileBytes: config.maxFileBytes,
      maxFilesPerCall: config.maxFilesPerCall,
    }),
    maxRequests: config.maxRequests,
  });
  return server;
}

/** Proves the key, the endpoint and the answer shape without starting a server. */
async function check(config: Config): Promise<void> {
  const jev = new TypeSafeJev({ apiKey: config.apiKey, model: config.model });
  const models = await jev.models();
  for (const model of models) {
    process.stdout.write(`${model.name}  ${model.release_date}  ${model.description}\n`);
  }
  const reply = await jev.ask('const total = items.length + 1;', {
    off_by_one: {
      type: 'noul',
      instructions: 'The expression in the state adds one to a length, which is a common off-by-one mistake.',
    },
  });
  const answer = reply.answers['off_by_one'];
  const value = answer?.type === 'noul' ? answer.noul.toFixed(2) : 'unreadable';
  process.stdout.write(
    `\n${reply.model} answered off_by_one = ${value} for ${reply.usage.inputTokens} input tokens\n`,
  );
}

async function main(): Promise<void> {
  const config = loadConfig(process.env);
  if (process.argv.includes('--check')) {
    await check(config);
    return;
  }
  await build(config).connect(new StdioServerTransport());
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
