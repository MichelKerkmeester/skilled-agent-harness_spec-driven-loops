// ───────────────────────────────────────────────────────────────────
// MODULE: Hermetic OpenCode PATH
// ───────────────────────────────────────────────────────────────────

import { accessSync, constants, mkdtempSync, rmSync, statSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll } from 'vitest';

/**
 * Report whether a PATH directory holds an executable regular-file `opencode2`.
 */
function carriesOpencode2(directory: string): boolean {
  if (!directory) return false;
  const candidate = path.join(directory, 'opencode2');
  try {
    if (!statSync(candidate).isFile()) return false;
    accessSync(candidate, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Build a directory that exposes only the running interpreter, so PATH keeps a
 * working `node` without restoring the `opencode2` its own directory carries.
 */
function exposeInterpreter(): string | null {
  try {
    const directory = mkdtempSync(path.join(tmpdir(), 'speckit-hermetic-node-'));
    const link = path.join(directory, 'node');
    symlinkSync(process.execPath, link);
    const remove = (): void => {
      try {
        rmSync(directory, { recursive: true, force: true });
      } catch {
        // Best-effort cleanup; a failed removal must not affect the test result.
      }
    };
    process.once('exit', remove);
    // Vitest terminates its worker threads without emitting `exit`, so clean up
    // when the file's tests finish instead of relying on the process event alone.
    afterAll(remove);
    return directory;
  } catch {
    return null;
  }
}

// The OpenCode resolver prefers an `opencode2` anywhere on PATH, so a host
// installation would shadow the v1 stubs the suites put first. Drop every
// directory that carries one before any test file loads.
const entries = process.env.PATH ? process.env.PATH.split(path.delimiter) : [];
const survivors = entries.filter((directory) => !carriesOpencode2(directory));

// Spawned fixtures resolve `node` through PATH. Expose the running interpreter
// first so they run the same binary, whether or not its own directory survived
// the filter above. When that link cannot be made, fall back to appending the
// interpreter's directory at the end, unless the filter dropped it for carrying
// `opencode2`.
const interpreterDirectory = path.dirname(process.execPath);
const exposedInterpreter = exposeInterpreter();
if (exposedInterpreter) {
  survivors.unshift(exposedInterpreter);
} else if (!survivors.includes(interpreterDirectory) && !carriesOpencode2(interpreterDirectory)) {
  survivors.push(interpreterDirectory);
}

process.env.PATH = survivors.join(path.delimiter);
delete process.env.OPENCODE_BIN;
