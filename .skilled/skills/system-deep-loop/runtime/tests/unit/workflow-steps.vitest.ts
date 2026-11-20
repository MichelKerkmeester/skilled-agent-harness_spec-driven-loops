// ───────────────────────────────────────────────────────────────────
// MODULE: Workflow Step Programs
// ───────────────────────────────────────────────────────────────────

// Each subcommand is a program the research and review workflows call as one
// step. The workflow captures the step's stdout, exit code and the files it
// writes, so these tests pin all three against temp fixtures.

import { afterEach, describe, expect, it } from 'vitest';

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';

import { runtimeRoot } from '../helpers/spawn-cjs';

// ───────────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────────

const SCRIPT = resolve(runtimeRoot, 'scripts', 'workflow-steps.cjs');
const REPO_ROOT = resolve(runtimeRoot, '..', '..', '..', '..');

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

function tempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'workflow-steps-'));
  tempDirs.push(dir);
  return dir;
}

function run(...args: string[]) {
  return spawnSync(process.execPath, [SCRIPT, ...args], { cwd: REPO_ROOT, encoding: 'utf8' });
}

function sha(value: string | Buffer): string {
  return createHash('sha256').update(value).digest('hex');
}

function json(stdout: string): Record<string, any> {
  return JSON.parse(stdout.trim());
}

const MINUTE = 60_000;

// ───────────────────────────────────────────────────────────────────
// 2. TESTS
// ───────────────────────────────────────────────────────────────────

describe('workflow-steps prior-lineage', () => {
  it('reports no prior lineage and the empty digest when nothing exists', () => {
    const dir = tempDir();
    const result = run('prior-lineage', join(dir, 'config.json'), join(dir, 'state.jsonl'));
    expect(result.status).toBe(0);
    expect(json(result.stdout)).toEqual({ priorSessionId: null, priorGeneration: 0, priorTailDigest: sha('') });
  });

  it('reads the lineage block or the top level, and digests the state log bytes', () => {
    const dir = tempDir();
    const state = '{"type":"iteration","run":1}\n';
    writeFileSync(join(dir, 'state.jsonl'), state);
    writeFileSync(join(dir, 'research.json'), JSON.stringify({ lineage: { sessionId: 'r-1', generation: 3 } }));
    writeFileSync(join(dir, 'review.json'), JSON.stringify({ sessionId: 'v-1', generation: 2 }));
    expect(json(run('prior-lineage', join(dir, 'research.json'), join(dir, 'state.jsonl')).stdout)).toEqual({
      priorSessionId: 'r-1', priorGeneration: 3, priorTailDigest: sha(state),
    });
    expect(json(run('prior-lineage', join(dir, 'review.json'), join(dir, 'state.jsonl')).stdout)).toMatchObject({
      priorSessionId: 'v-1', priorGeneration: 2,
    });
  });

  it('exits 1 on an unreadable config', () => {
    const dir = tempDir();
    writeFileSync(join(dir, 'config.json'), '{not json');
    const result = run('prior-lineage', join(dir, 'config.json'), join(dir, 'state.jsonl'));
    expect(result.status).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('The old config cannot be read: ');
  });
});

describe('workflow-steps extend', () => {
  const createdAt = new Date(Date.now() - 30 * MINUTE).toISOString();
  const iterations = ['{"type":"iteration","iteration":1}', '{"type":"iteration","run":2}', '{"type":"event"}', 'bad'].join('\n') + '\n';

  it('extend-research stages the event and config and prints the new budget', () => {
    const dir = tempDir();
    const config = {
      status: 'complete', maxIterations: 2, maxDurationMinutes: 20, createdAt,
      lineage: { sessionId: 's-1', generation: 2 },
    };
    writeFileSync(join(dir, 'config.json'), JSON.stringify(config));
    writeFileSync(join(dir, 'state.jsonl'), iterations);
    const result = run('extend-research', join(dir, 'config.json'), join(dir, 'state.jsonl'), join(dir, 'inbox.jsonl'), '3', '', dir);
    expect(result.status).toBe(0);
    const out = json(result.stdout);
    expect(out).toMatchObject({ continuedFromRun: 2, newMaxIterations: 5, newMaxDurationMinutes: 50 });
    expect(out.warning).toContain('Add questions to research/inbox.jsonl');
    const event = JSON.parse(readFileSync(join(dir, 'event.json'), 'utf8'));
    expect(event).toMatchObject({
      stem: 'deep_research.run_extended',
      scope: { runId: 's-1', lineageId: 's-1' },
      data: { priorTailDigest: sha(iterations), sessionId: 's-1', generation: 2, continuedFromRun: 2 },
    });
    const next = readFileSync(join(dir, 'config.json'), 'utf8');
    expect(next.endsWith('\n')).toBe(true);
    expect(JSON.parse(next)).toMatchObject({ status: 'initialized', maxIterations: 5, lineage: { lineageMode: 'completed-continue', continuedFromRun: 2 } });
  });

  it('extend-review stages the review event and top-level lineage fields', () => {
    const dir = tempDir();
    writeFileSync(join(dir, 'config.json'), JSON.stringify({
      status: 'complete', maxIterations: 2, maxDurationMinutes: 0, createdAt, sessionId: 'v-1', generation: 1,
      antiConvergence: { convergenceMode: 'off' },
    }));
    writeFileSync(join(dir, 'state.jsonl'), iterations);
    const result = run('extend-review', join(dir, 'config.json'), join(dir, 'state.jsonl'), '1', '{extend_minutes}', dir);
    expect(result.status).toBe(0);
    expect(json(result.stdout)).toEqual({ continuedFromRun: 2, newMaxIterations: 3, newMaxDurationMinutes: 0, warning: null });
    expect(JSON.parse(readFileSync(join(dir, 'event.json'), 'utf8'))).toMatchObject({
      stem: 'deep_review.run_extended', scope: { runId: 'v-1', sessionId: 'v-1', generation: 1 },
    });
    expect(JSON.parse(readFileSync(join(dir, 'config.json'), 'utf8'))).toMatchObject({ lineageMode: 'completed-continue', continuedFromRun: 2 });
  });

  it.each(['extend-research', 'extend-review'])('%s exits 2 on a run that is not complete and writes nothing', (subcommand) => {
    const dir = tempDir();
    const work = join(dir, 'work');
    mkdirSync(work);
    writeFileSync(join(dir, 'config.json'), JSON.stringify({ status: 'running' }));
    writeFileSync(join(dir, 'state.jsonl'), '');
    const args = subcommand === 'extend-research'
      ? [join(dir, 'config.json'), join(dir, 'state.jsonl'), join(dir, 'inbox.jsonl'), '1', '', work]
      : [join(dir, 'config.json'), join(dir, 'state.jsonl'), '1', '', work];
    const result = run(subcommand, ...args);
    expect(result.status).toBe(2);
    expect(result.stderr).toContain('--extend needs a completed run, and this run has status running.');
    expect(existsSync(join(work, 'event.json'))).toBe(false);
  });
});

describe('workflow-steps generation', () => {
  it('prints the lineage generation, then the top-level one, then 1', () => {
    const dir = tempDir();
    const cases: Array<[unknown, string]> = [
      [{ lineage: { generation: 4 } }, '4\n'],
      [{ generation: 2 }, '2\n'],
      [{}, '1\n'],
    ];
    for (const [config, expected] of cases) {
      writeFileSync(join(dir, 'config.json'), JSON.stringify(config));
      const result = run('generation', join(dir, 'config.json'));
      expect(result.status).toBe(0);
      expect(result.stdout).toBe(expected);
    }
  });

  it('exits non-zero on a missing config', () => {
    expect(run('generation', join(tempDir(), 'missing.json')).status).not.toBe(0);
  });
});

describe('workflow-steps run-open', () => {
  it('run-open-research prints the run_initialized event without a trailing newline', () => {
    const dir = tempDir();
    const raw = JSON.stringify({ topic: 'T', maxIterations: 4, lineage: { sessionId: 's-2', generation: 1 } });
    writeFileSync(join(dir, 'config.json'), raw);
    const result = run('run-open-research', join(dir, 'config.json'));
    expect(result.status).toBe(0);
    expect(result.stdout.endsWith('}')).toBe(true);
    expect(JSON.parse(result.stdout)).toMatchObject({
      stem: 'deep_research.run_initialized',
      scope: { runId: 's-2', lineageId: 's-2' },
      data: { generation: 1, topic: 'T', configDigest: sha(raw), maxIterations: 4, convergencePolicyVersion: 'convergence-policy@default' },
    });
  });

  it('run-open-review digests the workflow file it is given together with the step programs', () => {
    const dir = tempDir();
    const raw = JSON.stringify({ sessionId: 'v-2', generation: 1, reviewTargetType: 'track', reviewTarget: 'x', maxIterations: 3, lineageMode: 'new' });
    writeFileSync(join(dir, 'config.json'), raw);
    writeFileSync(join(dir, 'workflow.yaml'), 'workflow: {}\n');
    const result = run('run-open-review', join(dir, 'config.json'), join(dir, 'workflow.yaml'));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      stem: 'deep_review.run_initialized',
      scope: { runId: 'v-2', sessionId: 'v-2', generation: 1 },
      data: {
        target: { targetType: 'directory', sourceDigest: sha('x'), contentDigest: sha(raw) },
        lineageMode: 'fresh',
        reviewModeContractDigest: createHash('sha256')
          .update(Buffer.concat([Buffer.from('workflow: {}\n'), readFileSync(SCRIPT)]))
          .digest('hex'),
      },
    });
  });
});

describe('workflow-steps max-duration', () => {
  it('reports reached only once the budget is used', () => {
    const dir = tempDir();
    const at = (minutesAgo: number) => {
      writeFileSync(join(dir, 'config.json'), JSON.stringify({ maxDurationMinutes: 60, createdAt: new Date(Date.now() - minutesAgo * MINUTE).toISOString() }));
      const result = run('max-duration', join(dir, 'config.json'));
      expect(result.status).toBe(0);
      return json(result.stdout);
    };
    expect(at(61)).toMatchObject({ maxDurationMinutes: 60, reached: true });
    expect(at(59)).toMatchObject({ elapsedMinutes: 59, reached: false });
  });
});

describe('workflow-steps replay-legacy-review', () => {
  it('replays iteration rows through the gateway and counts what it kept back', () => {
    const dir = tempDir();
    const gateway = join(dir, 'gateway.cjs');
    // A stand-in gateway that accepts a row unless it is marked to be refused.
    writeFileSync(gateway, [
      'const fs = require("fs");',
      'const row = JSON.parse(fs.readFileSync(process.argv[process.argv.indexOf("--event-json") + 1], "utf8"));',
      'process.exit(row.refuse ? 1 : 0);',
    ].join('\n'));
    const legacy = join(dir, 'legacy.jsonl');
    writeFileSync(legacy, [
      '{"type":"config"}', '{"type":"iteration","run":1}', '{"type":"iteration","run":2,"refuse":true}',
      '{"type":"event"}', 'not json', '',
    ].join('\n'));
    const result = run('replay-legacy-review', gateway, legacy, dir);
    expect(result.status).toBe(0);
    expect(result.stdout).toBe(JSON.stringify({ replayedIterations: 1, keptOnlyInLegacyLog: 3, legacyLog: legacy }) + '\n');
  });
});

describe('workflow-steps refuse-single-vibe', () => {
  it('exits 2 with the fan-out-only message', () => {
    const result = run('refuse-single-vibe');
    expect(result.status).toBe(2);
    expect(result.stdout).toBe('');
    expect(result.stderr).toBe('cli-mistral-vibe runs only as a fan-out lineage; rerun with --count=2 or a second --executor group, or choose another executor kind\n');
  });
});

describe('workflow-steps dispatch', () => {
  it('exits 2 with the usage line on an unknown subcommand', () => {
    const result = run('no-such-step');
    expect(result.status).toBe(2);
    expect(result.stderr).toContain('Usage: workflow-steps.cjs <prior-lineage|');
  });
});
