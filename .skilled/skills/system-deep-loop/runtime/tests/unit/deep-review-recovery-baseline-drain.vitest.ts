// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Recovery Baseline Drain Tests
// ───────────────────────────────────────────────────────────────────
//
// The detached-dispatch path stages a recovery-baseline event beside the
// state log, and the dispatch script drains that event into the append
// gateway after the dispatch returns. The drain is what projects the baseline
// the dispatch captured and removes the scratch directory, so this suite calls
// the exported drain against a preset staging directory.

import { afterEach, describe, expect, it } from 'vitest';

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const GATEWAY = resolve(here, '..', '..', 'scripts', 'append-mode-event.cjs');

const require = createRequire(import.meta.url);
const { drainStagedEvents } = require('../../scripts/dispatch-iteration.cjs') as {
  drainStagedEvents: (options: {
    eventDir: string;
    mode: string;
    runDirectory: string;
    gatewayPath: string;
  }) => number;
};

const scratch: string[] = [];

afterEach(() => {
  while (scratch.length > 0) rmSync(scratch.pop() as string, { recursive: true, force: true });
});

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

function runDrain(fixture: DrainFixture): number {
  const previousAuthorityRoot = process.env.DEEP_LOOP_AUTHORITY_ROOT;
  process.env.DEEP_LOOP_AUTHORITY_ROOT = fixture.authorityRoot;
  try {
    return drainStagedEvents({
      eventDir: fixture.eventDir,
      mode: 'review',
      runDirectory: dirname(fixture.stateLog),
      gatewayPath: GATEWAY,
    });
  } finally {
    if (previousAuthorityRoot === undefined) {
      delete process.env.DEEP_LOOP_AUTHORITY_ROOT;
    } else {
      process.env.DEEP_LOOP_AUTHORITY_ROOT = previousAuthorityRoot;
    }
  }
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

    const status = runDrain(fixture);
    expect(status).toBe(0);

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

    const status = runDrain(fixture);
    expect(status).not.toBe(0);
    expect(existsSync(fixture.eventDir)).toBe(false);
  });
});
