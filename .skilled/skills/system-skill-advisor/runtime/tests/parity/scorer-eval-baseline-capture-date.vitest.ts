// ───────────────────────────────────────────────────────────────
// MODULE: Scorer Eval Baseline Capture Date Tests
// ───────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const HERE = dirname(fileURLToPath(import.meta.url));
const CAPTURE_SCRIPT = resolve(HERE, '../../scripts/routing-accuracy/capture-scorer-eval-baseline.mjs');
const BASELINE_PATH = resolve(HERE, '../../scripts/routing-accuracy/scorer-eval-baseline.json');
const SCORING_DATE_ENV = 'SPECKIT_EVAL_BASELINE_SCORING_DATE';
const CAPTURE_TIMEOUT_MS = 120_000;

// Pins the wall clock to FAKE_TODAY so a capture run can show it ignores "today".
const FAKE_CLOCK_PRELOAD = `
const RealDate = Date;
const fixed = RealDate.parse(process.env.FAKE_TODAY + 'T13:37:00Z');
globalThis.Date = class extends RealDate {
  constructor(...args) { if (args.length === 0) super(fixed); else super(...args); }
  static now() { return fixed; }
};
`;

let scratch = '';
let preloadPath = '';

function capture(env: Record<string, string>) {
  const childEnv: NodeJS.ProcessEnv = { ...process.env, TMPDIR: scratch, ...env };
  delete childEnv[SCORING_DATE_ENV];
  Object.assign(childEnv, env);
  return spawnSync('node', ['--require', preloadPath, CAPTURE_SCRIPT], {
    encoding: 'utf8',
    env: childEnv,
    timeout: CAPTURE_TIMEOUT_MS,
    maxBuffer: 1024 * 1024 * 16,
  });
}

describe('scorer eval baseline capture date', () => {
  beforeAll(() => {
    scratch = mkdtempSync(join(tmpdir(), 'advisor-baseline-capture-date-'));
    preloadPath = join(scratch, 'fake-clock.cjs');
    writeFileSync(preloadPath, FAKE_CLOCK_PRELOAD, 'utf8');
  });

  afterAll(() => {
    if (scratch) rmSync(scratch, { recursive: true, force: true });
  });

  it('prints identical output whatever the wall clock says, at the recorded scoring date', () => {
    const first = capture({ FAKE_TODAY: '2026-10-27' });
    const second = capture({ FAKE_TODAY: '2027-03-05' });
    expect(first.status, first.stderr).toBe(0);
    expect(second.status, second.stderr).toBe(0);
    expect(second.stdout).toBe(first.stdout);

    const recorded = (JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) as { capturedAt: string }).capturedAt;
    expect((JSON.parse(first.stdout) as { capturedAt: string }).capturedAt).toBe(recorded);
  }, CAPTURE_TIMEOUT_MS * 2 + 30_000);

  it('rejects a scoring date that is not a calendar date before scoring anything', () => {
    const result = capture({ FAKE_TODAY: '2026-10-27', [SCORING_DATE_ENV]: '2026-13-45' });
    expect(result.status).toBe(2);
    expect(result.stderr).toContain(SCORING_DATE_ENV);
  }, CAPTURE_TIMEOUT_MS);
});
