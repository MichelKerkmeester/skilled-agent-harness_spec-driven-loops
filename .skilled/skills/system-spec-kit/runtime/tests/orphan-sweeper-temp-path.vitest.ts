// ───────────────────────────────────────────────────────────────────
// MODULE: Orphan Sweeper Temp-Path Orphan Tests
// ───────────────────────────────────────────────────────────────────
// Abandoned fixtures, benchmark browsers and scratch repros outlive their parent
// and keep running from a temp or scratch folder. The sweeper reaps a process only
// when every part of that shape holds, and a listener it holds must not save it.

import { execFileSync } from 'node:child_process';
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', '..');
const sweeper = join(repoRoot, '.skilled/scripts/orphan-mcp-sweeper.sh');

const USER_TMP = '/var/folders/zz/abc/T';
const HOME = '/Users/tester';
const SIX_HOURS = 6 * 3600;

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'orphan-sweeper-temp-'));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

// Source the sweeper with getconf, id and ps stubbed so the verdict depends only on
// the supplied process shape, then print one verdict per case.
function runHarness(lines: string[]): string[] {
  const harness = join(dir, 'harness.sh');
  writeFileSync(
    harness,
    [
      '#!/usr/bin/env bash',
      'set -euo pipefail',
      `source ${JSON.stringify(sweeper)}`,
      `getconf() { printf '%s\\n' ${JSON.stringify(`${USER_TMP}/`)}; }`,
      'id() { printf "501\\n"; }',
      'ps() { printf "501\\n"; }',
      'lsof() { printf "python 4242 tester 5u IPv6 0x1 0t0 TCP *:8099 (LISTEN)\\n"; }',
      ...lines,
      '',
    ].join('\n'),
    { mode: 0o755 },
  );
  chmodSync(harness, 0o755);
  return execFileSync('bash', [harness], { encoding: 'utf8', env: { ...process.env, HOME } })
    .trim()
    .split('\n');
}

function verdict(ppid: string, age: number, stat: string, cmd: string): string {
  return `if is_temp_path_orphan 4242 ${ppid} ${age} ${stat} ${JSON.stringify(cmd)}; then echo reap; else echo keep; fi`;
}

describe('orphan sweeper temp-path orphans', () => {
  it('reaps only an old, parentless, live process that runs from a temp or scratch folder', () => {
    const chrome = `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless=new --user-data-dir=/private${USER_TMP}/bench/udd4`;
    const results = runHarness([
      verdict('1', SIX_HOURS, 'SN', chrome),
      verdict('1', SIX_HOURS, 'S', 'tail -n +1 -f /private/tmp/claude-501/session/scratchpad/run.log'),
      verdict('1', SIX_HOURS, 'SNs', `node --check ${HOME}/worktrees/public/.scratch-dc90/f1/repro.fifo`),
      verdict('4100', SIX_HOURS, 'S', chrome),
      verdict('1', SIX_HOURS - 1, 'S', chrome),
      verdict('1', SIX_HOURS, 'Z', chrome),
      verdict('1', SIX_HOURS, 'S', `/private${USER_TMP}/AppTranslocation/ABC/d/Some.app/Contents/MacOS/Some`),
      verdict('1', SIX_HOURS, 'S', '/Applications/Spotify.app/Contents/MacOS/Spotify'),
    ]);
    expect(results).toEqual(['reap', 'reap', 'reap', 'keep', 'keep', 'keep', 'keep', 'keep']);
  });

  it('does not let a TCP listener preserve a temp-path orphan, but still preserves an MCP daemon', () => {
    const results = runHarness([
      `if preserve_reason 4242 "$TEMP_PROCESS_CLASS" ${SIX_HOURS} "python -m http.server 8099"; then :; else echo none; fi`,
      `preserve_reason 4242 skill-advisor-server ${SIX_HOURS} "node advisor-server.js" || echo none`,
    ]);
    expect(results).toEqual(['none', 'active-non-mcp-tcp-listener']);
  });
});

describe('orphan sweeper session tree', () => {
  // PGREP_ANCESTOR_FLAG is fixed from `uname -s` when the sweeper is sourced, so the two
  // platforms are exercised through stub `uname` and `pgrep` binaries on PATH instead of
  // the host's real commands. runHarness is not reusable here because it sources the
  // sweeper before any stub could be installed.
  function pgrepArguments(unameOutput: string): string {
    const stub = join(dir, 'stub');
    mkdirSync(stub, { recursive: true });
    const log = join(dir, 'pgrep.log');
    writeFileSync(
      join(stub, 'uname'),
      `#!/usr/bin/env bash\nprintf '%s\\n' ${JSON.stringify(unameOutput)}\n`,
      { mode: 0o755 },
    );
    writeFileSync(
      join(stub, 'pgrep'),
      `#!/usr/bin/env bash\nprintf '%s\\n' "$*" >> "$PGREP_LOG"\n`,
      { mode: 0o755 },
    );
    const harness = join(dir, 'session-tree-harness.sh');
    writeFileSync(
      harness,
      [
        '#!/usr/bin/env bash',
        'set -euo pipefail',
        `source ${JSON.stringify(sweeper)}`,
        'build_session_trees',
        '',
      ].join('\n'),
      { mode: 0o755 },
    );
    execFileSync('bash', [harness], {
      encoding: 'utf8',
      env: { ...process.env, PATH: `${stub}:${process.env.PATH ?? ''}`, PGREP_LOG: log },
    });
    return readFileSync(log, 'utf8').trim();
  }

  it('passes -a to pgrep on Darwin so a sweep started inside a session still sees it', () => {
    const args = pgrepArguments('Darwin');
    expect(args.startsWith('-a -f')).toBe(true);
  });

  it('leaves -a off on Linux, where pgrep reads it as an output-format flag', () => {
    const args = pgrepArguments('Linux');
    expect(args.startsWith('-f')).toBe(true);
    expect(args).not.toContain('-a');
  });
});

// The advisor launcher retires itself on its own idle timer, so a sweep that lands
// between two prompts finds it with no client attached; reaping it there would tear
// down a daemon the next prompt reuses. Its server is covered only while that launcher
// is still its parent, because a server whose launcher died is the orphan the sweeper
// exists for. `ps` is redefined after the harness stub so each case can state the
// parentage it wants the policy to see.
describe('orphan sweeper advisor daemon', () => {
  it('preserves the launcher, which is legitimately clientless between prompts', () => {
    const results = runHarness([
      `preserve_reason 4242 system-skill-advisor-launcher ${SIX_HOURS} "node system-skill-advisor-launcher.cjs" || echo none`,
    ]);
    expect(results).toEqual(['advisor-self-idle-timeout']);
  });

  it('preserves a server that still names its launcher as parent', () => {
    const results = runHarness([
      'ps() {',
      '  case "$*" in',
      '    "-p 4242 -o ppid=") printf "80911\\n" ;;',
      '    "-p 80911 -o command=") printf "node /Users/tester/.skilled/system-skill-advisor-launcher.cjs\\n" ;;',
      '    *) printf "501\\n" ;;',
      '  esac',
      '}',
      `preserve_reason 4242 skill-advisor-server ${SIX_HOURS} "node advisor-server.js" || echo none`,
    ]);
    expect(results).toEqual(['advisor-launcher-child']);
  });

  it('does not extend launcher coverage to a server reparented onto init', () => {
    const results = runHarness([
      'ps() {',
      '  case "$*" in',
      '    "-p 4242 -o ppid=") printf "1\\n" ;;',
      '    *) printf "501\\n" ;;',
      '  esac',
      '}',
      `preserve_reason 4242 skill-advisor-server ${SIX_HOURS} "node advisor-server.js" || echo none`,
    ]);
    expect(results).not.toContain('advisor-launcher-child');
    expect(results).toEqual(['active-non-mcp-tcp-listener']);
  });
});
