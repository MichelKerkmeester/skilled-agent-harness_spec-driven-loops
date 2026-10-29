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
    expect(args.split(' ')).not.toContain('-a');
  });

  it('searches every session runtime the repo drives, not only Claude Code', () => {
    const args = pgrepArguments('Darwin');
    expect(args).toContain('pi|hermes|devin|cursor-agent');
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

  it('preserves a model server that still names its launcher as parent', () => {
    const results = runHarness([
      'ps() {',
      '  case "$*" in',
      '    "-p 4242 -o ppid=") printf "80911\\n" ;;',
      '    "-p 80911 -o command=") printf "node /Users/tester/.skilled/system-skill-advisor-launcher.cjs\\n" ;;',
      '    *) printf "501\\n" ;;',
      '  esac',
      '}',
      `preserve_reason 4242 hf-model-server ${SIX_HOURS} "node /Users/tester/.skilled/skills/hf-model-server/hf-model-server.cjs" || echo none`,
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

// Signalling is the last step, so the class the scan recorded is re-derived from live
// process state first. A temp-path orphan is defined by its parent, age and state as much
// as by its command, so each case states the `ps` line the recheck has to see.
describe('orphan sweeper pre-signal recheck', () => {
  function recheck(cmd: string, cls: string, psLine: string): string[] {
    return [
      'ps() {',
      '  case "$*" in',
      `    "-p 4242 -o ppid=,etime=,stat=") printf '%s\\n' ${JSON.stringify(psLine)} ;;`,
      '    "-p 4242 -o uid=") printf "501\\n" ;;',
      '    *) printf "501\\n" ;;',
      '  esac',
      '}',
      `current_class_of 4242 ${JSON.stringify(cmd)} ${cls} || echo none`,
    ];
  }

  const tempCmd = `node ${USER_TMP}/bench/fixture/server.js`;

  it('reclassifies a temp-path orphan that still has every part of the shape', () => {
    const results = runHarness(recheck(tempCmd, 'temp-path-orphan', '1 06:00:00 S'));
    expect(results).toEqual(['temp-path-orphan']);
  });

  it('drops a temp-path candidate that has been reparented onto a live parent', () => {
    const results = runHarness(recheck(tempCmd, 'temp-path-orphan', '4100 06:00:00 S'));
    expect(results).toEqual(['none']);
  });

  it('drops a temp-path candidate that has not reached the age floor yet', () => {
    const results = runHarness(recheck(tempCmd, 'temp-path-orphan', '1 05:59:59 S'));
    expect(results).toEqual(['none']);
  });

  it('drops a temp-path candidate that has become a zombie', () => {
    const results = runHarness(recheck(tempCmd, 'temp-path-orphan', '1 06:00:00 Z'));
    expect(results).toEqual(['none']);
  });

  it('keeps an MCP server that its command alone classifies', () => {
    const cmd = 'node /repo/.skilled/skills/system-skill-advisor/runtime/dist/advisor-server.js';
    const results = runHarness(recheck(cmd, 'skill-advisor-server', '1 06:00:00 S'));
    expect(results).toEqual(['skill-advisor-server']);
  });
});

// A detached driver script outlives its own parent while the session below it keeps running,
// so a temp-path candidate with a session root somewhere beneath it is that session's driver,
// not a leftover. `pgrep` is redefined per case so each states the ancestry the walk should see.
describe('orphan sweeper live-session driver', () => {
  it('preserves a temp-path process that still drives a live session', () => {
    const results = runHarness([
      'pgrep() {',
      '  case "$*" in',
      '    "-P 4242") printf "5000\\n" ;;',
      '    "-P 5000") printf "6000\\n" ;;',
      '    *) : ;;',
      '  esac',
      '}',
      'SESSION_ROOT_PIDS=(6000)',
      `preserve_reason 4242 "$TEMP_PROCESS_CLASS" ${SIX_HOURS} "zsh ${HOME}/worktrees/public/.scratch-x/run-pi.zsh" || echo none`,
    ]);
    expect(results).toEqual(['drives-live-session']);
  });

  it('does not preserve a temp-path process with no session root below it', () => {
    const results = runHarness([
      'pgrep() {',
      '  case "$*" in',
      '    "-P 4242") printf "5000\\n" ;;',
      '    *) : ;;',
      '  esac',
      '}',
      'SESSION_ROOT_PIDS=(7777)',
      `preserve_reason 4242 "$TEMP_PROCESS_CLASS" ${SIX_HOURS} "zsh ${HOME}/worktrees/public/.scratch-x/run-pi.zsh" || echo none`,
    ]);
    expect(results).toEqual(['none']);
  });
});

// The age floor covers every candidate, not only the freshest one of its class: a helper still
// starting up under a session that has not finished spawning must survive even when a steadier
// sibling of the same class makes the freshest-instance rule miss it.
describe('orphan sweeper age floor', () => {
  it('preserves a candidate that is younger than the age floor', () => {
    const results = runHarness([
      'preserve_reason 4242 mcp-code-mode 120 "node mcp-code-mode/mcp-server/dist/index.js" || echo none',
    ]);
    expect(results).toEqual(['younger-than-age-min']);
  });

  it('lets a candidate past the age floor fall through to the other preservation rules', () => {
    const results = runHarness([
      'preserve_reason 4242 mcp-code-mode 600 "node mcp-code-mode/mcp-server/dist/index.js" || echo none',
    ]);
    expect(results).not.toContain('younger-than-age-min');
  });
});
