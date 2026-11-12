// ───────────────────────────────────────────────────────────────────
// MODULE: Skip Fsync
// ───────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import path from 'node:path';

const preload = path.resolve(import.meta.dirname, 'skip-fsync-preload.cjs');

// Patch this worker, then hand the same preload to every child a test spawns.
createRequire(import.meta.url)(preload);

const flag = `--require ${JSON.stringify(preload)}`;
const current = process.env.NODE_OPTIONS ?? '';
if (!current.includes(flag)) {
  process.env.NODE_OPTIONS = current ? `${current} ${flag}` : flag;
}
