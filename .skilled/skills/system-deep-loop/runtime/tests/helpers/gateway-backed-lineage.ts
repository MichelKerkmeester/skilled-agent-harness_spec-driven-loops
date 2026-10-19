// ───────────────────────────────────────────────────────────────────
// MODULE: Gateway-Backed Lineage Stub Helpers
// ───────────────────────────────────────────────────────────────────
//
// A real CLI lineage records every state row through the append gateway, which
// leaves a ledger record behind each row. The runner rejects a lineage whose
// state log has rows and whose ledger has none, so a stub executor that stands
// in for a lineage has to record its rows the same way rather than write the
// state log itself. These snippets run the real gateway from inside a stub.

import { resolve } from 'node:path';

import { runtimeRoot } from './spawn-cjs';

/** The checkout root: the gateway binds each append to its git identity. */
export const REPOSITORY_ROOT = resolve(runtimeRoot, '..', '..', '..', '..');
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
