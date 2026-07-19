// ───────────────────────────────────────────────────────────────────
// MODULE: Vitest Setup
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

function ensureAbsoluteTempEnv(): void {
  const currentTmp = os.tmpdir();
  const absoluteTmp = path.isAbsolute(currentTmp) ? currentTmp : path.resolve(currentTmp);

  fs.mkdirSync(absoluteTmp, { recursive: true });

  for (const key of ['TMPDIR', 'TMP', 'TEMP'] as const) {
    const currentValue = process.env[key];
    if (!currentValue || !path.isAbsolute(currentValue)) {
      process.env[key] = absoluteTmp;
    }
  }
}

ensureAbsoluteTempEnv();

// ───────────────────────────────────────────────────────────────────
// PRODUCTION DATABASE ISOLATION
// The memory-DB path resolves to <mcp_server>/database/context-index.sqlite when
// neither MEMORY_DB_PATH nor SPEC_KIT_DB_DIR is set. A test that opens the default
// path therefore opens the LIVE production DB; writing to it while the daemon holds
// it open corrupts the SQLite file. Force a throwaway DB dir for the whole suite so
// the resolver can never fall back to production, and fail closed if any env var
// explicitly targets the production database.
// ───────────────────────────────────────────────────────────────────
function isolateProductionDatabase(): void {
  // This setup file lives at <mcp_server>/tests/_support/, so two levels up is
  // <mcp_server>; the production DB is <mcp_server>/database/context-index.sqlite.
  const productionDir = path.resolve(import.meta.dirname, '..', '..', 'database');
  const productionDb = path.join(productionDir, 'context-index.sqlite');

  const memEnv = process.env.MEMORY_DB_PATH;
  if (memEnv && path.resolve(memEnv) === productionDb) {
    throw new Error(
      `[vitest-setup] refusing to run: MEMORY_DB_PATH points at the production memory DB (${productionDb}). Tests must use a throwaway DB.`,
    );
  }
  const dirEnv = process.env.SPEC_KIT_DB_DIR;
  if (dirEnv && path.resolve(dirEnv) === productionDir) {
    throw new Error(
      `[vitest-setup] refusing to run: SPEC_KIT_DB_DIR points at the production database dir (${productionDir}). Tests must use a throwaway dir.`,
    );
  }

  // Default-safe: with no explicit override, derive a per-file scratch dir so the
  // resolver lands on throwaway storage instead of the production file.
  if (!memEnv && !dirEnv) {
    const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-test-db-'));
    process.env.SPEC_KIT_DB_DIR = scratch;
  }
}

isolateProductionDatabase();
