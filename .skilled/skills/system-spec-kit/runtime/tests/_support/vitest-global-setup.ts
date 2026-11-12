// ───────────────────────────────────────────────────────────────────
// MODULE: Vitest Global Setup
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// The per-file setup removes its scratch database dir in an afterAll hook, and
// vitest runs no such hook for a file whose tests are all skipped. Every scratch
// dir is therefore created inside one root made here, which the returned teardown
// removes when the whole run ends. Worker processes start after this function
// returns, so they inherit the variable.
export default function setup(): () => void {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-test-db-root-'));
  process.env.SPECKIT_TEST_DB_ROOT = root;
  return () => {
    fs.rmSync(root, { recursive: true, force: true });
    delete process.env.SPECKIT_TEST_DB_ROOT;
  };
}
