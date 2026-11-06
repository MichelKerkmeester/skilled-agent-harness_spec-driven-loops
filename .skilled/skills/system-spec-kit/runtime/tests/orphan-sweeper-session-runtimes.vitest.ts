// ───────────────────────────────────────────────────────────────────
// MODULE: Orphan Sweeper Session-Runtime Tests
// ───────────────────────────────────────────────────────────────────
// An MCP helper descended from any AI CLI session the repository drives belongs to
// that live session. The sweeper finds those sessions by command line, so a runtime
// missing from its pattern leaves the helpers of every one of its sessions sweepable.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', '..');
const sweeper = join(repoRoot, '.skilled/scripts/orphan-mcp-sweeper.sh');

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'orphan-sweeper-runtimes-'));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

// Source the sweeper with pgrep stubbed over a fixed process table, then print the
// session roots build_session_trees found. `pgrep -f` matches the whole command line,
// and `pgrep -P` finds no children, so only the root match decides.
function sessionRoots(table: Array<[number, string]>): string[] {
  const harness = join(dir, 'harness.sh');
  const rows = table.map(([pid, cmd]) => `${pid}|${cmd}`).join('\n');
  writeFileSync(
    harness,
    [
      '#!/usr/bin/env bash',
      `source ${JSON.stringify(sweeper)}`,
      'pgrep() {',
      '  local pattern="" parent=""',
      '  while [ $# -gt 0 ]; do',
      '    case "$1" in',
      '      -f) pattern="$2"; shift 2 ;;',
      '      -P) parent="$2"; shift 2 ;;',
      '      *) shift ;;',
      '    esac',
      '  done',
      '  [ -n "$parent" ] && return 1',
      '  while IFS="|" read -r pid cmd; do',
      '    printf "%s\\n" "$cmd" | grep -Eq -- "$pattern" && printf "%s\\n" "$pid"',
      '  done <<"TABLE"',
      rows,
      'TABLE',
      '}',
      'SESSION_TREE_PIDS=()',
      'SESSION_ROOT_PIDS=()',
      'build_session_trees',
      'printf "%s\\n" "${SESSION_ROOT_PIDS[@]}"',
      '',
    ].join('\n'),
    { mode: 0o755 },
  );
  return execFileSync('bash', [harness], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
}

describe('orphan sweeper session runtimes', () => {
  it('treats a DSH session, headless or web, as a live operator session', () => {
    const roots = sessionRoots([
      [101, 'node /Users/tester/.local/bin/dsh --profile headless --patch guards.patch.yml'],
      [102, 'node /opt/homebrew/bin/dsh web'],
      [103, '/usr/local/bin/pi --mode rpc'],
      [104, 'node /private/tmp/dshell-probe.js'],
      [105, '/usr/bin/python3 server.py'],
    ]);
    expect(roots).toEqual(['101', '102', '103']);
  });
});
