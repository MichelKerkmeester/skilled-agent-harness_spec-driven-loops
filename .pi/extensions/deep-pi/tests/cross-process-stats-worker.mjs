// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ MODULE: Cross-Process Statistics Worker                                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// Real child-process worker for the cross-process stats-lock test.
// Stats.test.ts spawns it as an OS process.
// The lock must serialize against a genuinely separate process.
// It must not merely coordinate another async task in one event loop.
import { createRequire } from 'node:module';

const [, , statsPath, sessionId, responses] = process.argv;

const require = createRequire(import.meta.url);
const { createJiti } = require(
  '../node_modules/@earendil-works/pi-coding-agent/node_modules/jiti',
);
const jiti = createJiti(import.meta.url, { interopDefault: false, moduleCache: false });
const { updateStatsForSession } = await jiti.import(
  new URL('../extensions/deeppi/stats.ts', import.meta.url).pathname,
);

const totals = {
  responses: Number(responses),
  hitTokens: 0,
  missTokens: 0,
  cacheWriteTokens: 0,
  actualInputCost: 0,
  noCacheCounterfactualSavings: 0,
};

await updateStatsForSession(statsPath, sessionId, {
  'deepseek-v4-flash': { ...totals },
  'deepseek-v4-pro': { ...totals },
});
