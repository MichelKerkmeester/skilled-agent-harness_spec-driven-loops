// ───────────────────────────────────────────────────────────────────
// MODULE: Gateway-Backed Lineage Stub Helpers
// ───────────────────────────────────────────────────────────────────
//
// A real CLI lineage records every state row through the append gateway, which
// leaves a ledger record behind each row. The runner rejects a lineage whose
// state log has rows and whose ledger has none, so a stub executor that stands
// in for a lineage has to record its rows the same way rather than write the
// state log itself. These snippets run the real gateway from inside a stub.

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { runtimeRoot, strippedProcessEnv } from './spawn-cjs';

/**
 * The checkout that encloses `start`. A vendored install nests the framework
 * below the project (`<project>/skilled/.skilled/...`), so a fixed climb lands
 * short of the git toplevel. Ask git first, with the inherited git plumbing
 * removed so a hook-exported GIT_DIR cannot answer for another repository,
 * then fall back to the nearest folder that holds `.skilled`.
 */
export function resolveRepositoryRoot(start: string): string {
  const probe = spawnSync('git', ['rev-parse', '--show-toplevel'], {
    cwd: start,
    env: strippedProcessEnv(),
    encoding: 'utf8',
  });
  const toplevel = probe.status === 0 ? probe.stdout.trim() : '';
  if (toplevel) return toplevel;

  for (let dir = resolve(start); ; dir = dirname(dir)) {
    if (existsSync(join(dir, '.skilled'))) return dir;
    if (dirname(dir) === dir) break;
  }
  return resolve(start, '..', '..', '..', '..');
}

/** The checkout root: the gateway binds each append to its git identity. */
export const REPOSITORY_ROOT = resolveRepositoryRoot(runtimeRoot);
export const APPEND_GATEWAY = resolve(runtimeRoot, 'scripts', 'append-mode-event.cjs');

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, "'\\''")}'`;
}

/**
 * Shell lines that hand one state record to the gateway for `$lineage_dir`.
 * A refused append ends the stub with exit 97 so the test sees the refusal.
 */
export function gatewayAppendShell(mode: 'research' | 'review', record: Record<string, unknown>): string {
  return [
    'stub_event="$(mktemp "${TMPDIR:-/tmp}/stub-gateway-event.XXXXXX")"',
    `printf '%s' ${shellQuote(JSON.stringify(record))} > "$stub_event"`,
    `(cd ${shellQuote(REPOSITORY_ROOT)} && ${shellQuote(process.execPath)} ${shellQuote(APPEND_GATEWAY)} `
      + `--mode ${mode} --run-directory "$lineage_dir" --event-json "$stub_event") > /dev/null || exit 97`,
    'rm -f "$stub_event"',
  ].join('\n');
}

/**
 * Node source defining `appendThroughGateway(mode, lineageDir, record)` for a
 * stub written as a Node script. It needs `fs` and `path` already in scope.
 */
export function gatewayAppendNodeSource(): string {
  return [
    'const { spawnSync } = require("node:child_process");',
    'const os = require("node:os");',
    'function appendThroughGateway(mode, lineageDir, record) {',
    '  const eventDir = fs.mkdtempSync(path.join(os.tmpdir(), "stub-gateway-event-"));',
    '  const eventPath = path.join(eventDir, "event.json");',
    '  fs.writeFileSync(eventPath, JSON.stringify(record), "utf8");',
    `  const result = spawnSync(${JSON.stringify(process.execPath)}, [${JSON.stringify(APPEND_GATEWAY)},`,
    '    "--mode", mode, "--run-directory", lineageDir, "--event-json", eventPath],',
    `    { cwd: ${JSON.stringify(REPOSITORY_ROOT)}, encoding: "utf8" });`,
    '  fs.rmSync(eventDir, { recursive: true, force: true });',
    '  if (result.status !== 0) {',
    '    process.stderr.write(`gateway refused the stub record: ${result.stdout}${result.stderr}`);',
    '    process.exit(97);',
    '  }',
    '}',
  ].join('\n');
}
