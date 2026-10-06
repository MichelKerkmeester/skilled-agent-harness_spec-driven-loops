// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Recovery Baseline Drain Tests
// ───────────────────────────────────────────────────────────────────
//
// The detached-dispatch node stages a recovery-baseline event beside the
// state log, and the command block that follows the staging heredoc is what
// feeds that event to the append gateway. A block that ends at the heredoc
// terminator returns before the staged event is appended, so the baseline the
// dispatch captured is never projected and the scratch directory leaks. This
// suite runs the drain exactly as the workflow ships it against a preset
// staging directory, so a block that stops at the heredoc fails here.

import { afterEach, describe, expect, it } from 'vitest';

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(here, '..', '..', '..', '..', '..', '..');
const GATEWAY = resolve(here, '..', '..', 'scripts', 'append-mode-event.cjs');
const AUTO_YAML = join(REPO_ROOT, '.skilled', 'commands', 'deep', 'assets', 'deep-review-auto.yaml');

const scratch: string[] = [];

afterEach(() => {
  while (scratch.length > 0) rmSync(scratch.pop() as string, { recursive: true, force: true });
});

// The detached-dispatch command is a YAML literal block whose heredoc body
// carries the same indentation, so the block is collected until the
// indentation drops. The stage marker pins the lookup to the node that stages
// the recovery baseline rather than any sibling dispatch node.
function commandAfterHeredoc(): string[] {
  const lines = readFileSync(AUTO_YAML, 'utf8').split('\n');
  const markerAt = lines.findIndex((line) => line.includes('01-recovery_baseline.json'));
  if (markerAt === -1) throw new Error('deep-review-auto.yaml no longer stages a recovery baseline event');

  let commandAt = -1;
  for (let index = markerAt; index >= 0; index -= 1) {
    if (lines[index].trim() === 'command: |') {
      commandAt = index;
      break;
    }
  }
  if (commandAt === -1) throw new Error('the recovery-baseline staging node has no command block');

  const bodyIndent = (lines[commandAt].match(/^\s*/)?.[0].length ?? 0) + 2;
  const body: string[] = [];
  for (let index = commandAt + 1; index < lines.length; index += 1) {
    const line = lines[index];
    const lineIndent = line.match(/^\s*/)?.[0].length ?? 0;
    if (line.trim() !== '' && lineIndent < bodyIndent) break;
    body.push(line.length >= bodyIndent ? line.slice(bodyIndent) : '');
  }

  const heredocEnd = body.findIndex((line) => line.trim() === 'EOF');
  if (heredocEnd === -1) throw new Error('the recovery-baseline staging heredoc has no terminator');
  return body.slice(heredocEnd + 1);
}

function drainScript(): string {
  return commandAfterHeredoc().join('\n').trim();
}

type DrainFixture = {
  readonly stateLog: string;
  readonly eventDir: string;
  readonly authorityRoot: string;
};

function createScratchDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), `deep-review-drain-${prefix}-`));
  scratch.push(dir);
  return dir;
}

function drainFixture(prefix: string): DrainFixture {
  const root = createScratchDir(prefix);
  const stateDir = join(root, 'review');
  const eventDir = join(root, 'events');
  const authorityRoot = join(root, 'authority');
  mkdirSync(stateDir);
  mkdirSync(eventDir);
  mkdirSync(authorityRoot);
  return { stateLog: join(stateDir, 'deep-review-state.jsonl'), eventDir, authorityRoot };
}

function runDrain(fixture: DrainFixture): { status: number | null; output: string } {
  const script = drainScript().replaceAll('{state_paths.state_log}', fixture.stateLog);
  const result = spawnSync('bash', ['-c', script], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    env: {
      ...process.env,
      DEEP_LOOP_AUTHORITY_ROOT: fixture.authorityRoot,
      EVENT_DIR: fixture.eventDir,
      GATEWAY,
    },
  });
  return { status: result.status, output: `${result.stdout ?? ''}${result.stderr ?? ''}` };
}

function stateRows(stateLog: string): Array<Record<string, unknown>> {
  return readFileSync(stateLog, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as Record<string, unknown>);
}

const RECOVERY_BASELINE_EVENT = {
  stem: 'deep_review.recovery_baseline',
  scope: { runId: 'recovery-drain-session', sessionId: 'recovery-drain-session' },
  data: {
    mode: 'review',
    iteration: 1,
    recoveryBaselineCommit: '0a1b2c3d4e5f60718293a4b5c6d7e8f901234567',
    worktree: '/tmp/recovery-drain-worktree',
  },
};

describe('deep-review drains the staged recovery baseline after dispatch', () => {
  it('appends the staged event, projects the row, and removes the staging directory', () => {
    const fixture = drainFixture('happy');
    writeFileSync(
      join(fixture.eventDir, '01-recovery_baseline.json'),
      JSON.stringify(RECOVERY_BASELINE_EVENT),
      'utf8',
    );

    const result = runDrain(fixture);
    expect(result.status, result.output).toBe(0);

    const rows = stateRows(fixture.stateLog);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ type: 'event', event: 'recovery_baseline', iteration: 1 });
    expect(existsSync(fixture.eventDir)).toBe(false);
  });

  it('exits with the gateway status and removes the staging directory when the gateway refuses the event', () => {
    const fixture = drainFixture('refused');
    writeFileSync(
      join(fixture.eventDir, '01-recovery_baseline.json'),
      JSON.stringify({ unexpected: true }),
      'utf8',
    );

    const result = runDrain(fixture);
    expect(result.status, result.output).not.toBe(0);
    expect(existsSync(fixture.eventDir)).toBe(false);
  });
});
