#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// Out-of-process skill-outcome fold cadence driver.
// ───────────────────────────────────────────────────────────────
// Folds the durable skill-outcome store on a clock and writes a snapshot.
// Idempotent: a back-to-back tick over unchanged data is a no-op, and a tick
// that finds the lock held does nothing. Run from cron/maintenance only — it
// must never be wired to the prompt-time advisor recommend path.
//
//   node scripts/skill-outcome-fold-tick.mjs [workspaceRoot]
//
// Requires the server to be built (npm run build) so the compiled fold core is
// present under dist/.

import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const distModule = resolve(here, '../dist/mcp_server/lib/scorer/skill-outcome-store.js');

if (!existsSync(distModule)) {
  console.error(`[skill-outcome-fold-tick] compiled module not found: ${distModule}\nRun "npm run build" first.`);
  process.exit(2);
}

const workspaceRoot = resolve(
  process.argv[2] ?? process.env.SPECKIT_WORKSPACE_ROOT ?? process.cwd(),
);

const { tickSkillOutcomeFold } = await import(pathToFileURL(distModule).href);

try {
  const result = await tickSkillOutcomeFold(workspaceRoot);
  console.log(JSON.stringify({
    workspaceRoot,
    changed: result.changed,
    locked: result.locked,
    recordCount: result.fold?.recordCount ?? null,
    snapshotPath: result.snapshotPath,
  }));
  process.exit(0);
} catch (error) {
  console.error(`[skill-outcome-fold-tick] tick failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
