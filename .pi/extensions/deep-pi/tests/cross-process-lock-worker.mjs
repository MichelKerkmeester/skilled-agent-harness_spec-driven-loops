// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ MODULE: Cross-Process Lock Worker                                         ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// Real child-process worker proving withCrossProcessLock's mutual exclusion.
// The fixed hold time makes the race deterministic rather than timing-dependent.
// Each worker acquires the same lock and appends markers to a shared log.
// The test detects impossible marker ordering when sections overlap.
import { appendFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const [, , logPath, workerId, holdMs] = process.argv;

const require = createRequire(import.meta.url);
const { createJiti } = require(
  '../node_modules/@earendil-works/pi-coding-agent/node_modules/jiti',
);
const jiti = createJiti(import.meta.url, { interopDefault: false, moduleCache: false });
const { withCrossProcessLock } = await jiti.import(
  new URL('../extensions/deeppi/stats.ts', import.meta.url).pathname,
);

const lockTarget = `${logPath}.target`;

await withCrossProcessLock(lockTarget, async () => {
  await appendFile(logPath, `${workerId} start ${Date.now()}\n`);
  await new Promise((resolve) => setTimeout(resolve, Number(holdMs)));
  await appendFile(logPath, `${workerId} end ${Date.now()}\n`);
});
