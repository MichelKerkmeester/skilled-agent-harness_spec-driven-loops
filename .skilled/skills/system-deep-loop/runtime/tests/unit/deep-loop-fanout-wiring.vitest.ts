// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Loop Fan-Out Step Wiring
// ───────────────────────────────────────────────────────────────────

// A fan-out run never reaches phase_init, so the values a single-executor run
// reads from its own config must be handed to the fan-out steps explicitly. These
// tests pin that hand-off in both workflows, the staging step's placeholders, the
// fan-out root stop reason, the seed command honouring an explicit budget before
// the root config exists, and the pre-synthesis gate's fan-out branch.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { runtimeRoot } from '../helpers/spawn-cjs';

const WORKSPACE_ROOT = resolve(runtimeRoot, '..', '..', '..');
const ASSETS = resolve(WORKSPACE_ROOT, 'commands', 'deep', 'assets');
const FRONTIER_ADMIT = resolve(runtimeRoot, 'scripts', 'frontier-admit.cjs');

const sharedRequire = createRequire(
  resolve(runtimeRoot, '..', '..', 'system-spec-kit', 'shared', 'package.json'),
);
const { load: loadYaml } = sharedRequire('js-yaml') as { load: (source: string) => unknown };

const WORKFLOWS = ['deep-research.yaml', 'deep-review.yaml'] as const;

const tempDirs: string[] = [];
afterEach(() => {
  for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

function loadWorkflow(file: string): Record<string, any> {
  return loadYaml(readFileSync(resolve(ASSETS, file), 'utf8')) as Record<string, any>;
}

// Every occurrence of a step id, depth first, since the same id can sit both at
// the root and inside phase_init.
function findSteps(node: unknown, id: string, found: Record<string, any>[] = []): Record<string, any>[] {
  if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      if (key === id && value && typeof value === 'object') found.push(value as Record<string, any>);
      findSteps(value, id, found);
    }
  }
  return found;
}

function rootSeedStep(doc: Record<string, any>): Record<string, any> {
  const step = findSteps(doc, 'step_frontier_seed').find((candidate) => candidate.skip_when === 'config.fanout is absent');
  if (!step) throw new Error('no fan-out step_frontier_seed');
  return step;
}

describe.each(WORKFLOWS)('%s fan-out wiring', (file) => {
  it('hands an explicit budget to the runner and passes nothing for a defaulted one', () => {
    const [spawn] = findSteps(loadWorkflow(file), 'step_fanout_spawn_cli');
    expect(spawn.command).not.toContain('--max-iterations');
    expect(spawn.optional_flags).toContain("When max_iterations_source != 'default', append `--max-iterations {max_iterations}`");
    expect(spawn.optional_flags).toContain("When max_iterations_source == 'default', append no --max-iterations");
  });

  it('hands an explicit budget to the seed that runs before the root config exists', () => {
    const seed = rootSeedStep(loadWorkflow(file));
    expect(seed.command).not.toContain('--max-iterations ');
    expect(seed.optional_flags).toContain("When max_iterations_source != 'default', append `--max-iterations {max_iterations}`");
  });

  it('derives a fan-out root stop reason from its lineages before the frozen default', () => {
    const [hydrate] = findSteps(loadWorkflow(file), 'step_hydrate_summary_metrics');
    const reason = hydrate.extract.find((entry: Record<string, string>) => 'reason' in entry).reason;
    expect(reason).toContain('orchestration-summary.json');
    expect(reason).toContain('lineages/<label>/');
    expect(reason.indexOf('lineages/<label>/')).toBeLessThan(reason.indexOf("frozen default 'converged'"));
  });

  it('stages only paths that state_paths defines', () => {
    const doc = loadWorkflow(file);
    const [stage] = findSteps(doc, 'step_stage_artifact_dir');
    const names = [...String(stage.command).matchAll(/\{state_paths\.([a-z_]+)\}/g)].map((match) => match[1]);
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) expect(Object.keys(doc.state_paths)).toContain(name);
  });
});

describe('deep-research pre-synthesis gate on a fan-out run', () => {
  it('ends the run instead of returning to a loop that never started', () => {
    const [gate] = findSteps(loadWorkflow('deep-research.yaml'), 'gate_pre_synthesis');
    expect(gate.on_B.branch_on).toBe('config.fanout');
    expect(gate.on_B.if_absent.proceed_to).toBe('phase_loop');
    expect(gate.on_B.if_present).not.toHaveProperty('proceed_to');
  });
});

describe('deep-review pre-synthesis gate on a fan-out run', () => {
  it('ends the run instead of returning to a loop that never started', () => {
    const [gate] = findSteps(loadWorkflow('deep-review.yaml'), 'gate_pre_synthesis');
    expect(gate.on_B.branch_on).toBe('config.fanout');
    expect(gate.on_B.if_absent.proceed_to).toBe('phase_loop');
    expect(gate.on_B.if_present).not.toHaveProperty('proceed_to');
  });
});

describe('frontier-admit seed with an explicit budget and no config yet', () => {
  function seedDir(): string {
    const dir = mkdtempSync(join(tmpdir(), 'fanout-wiring-seed-'));
    tempDirs.push(dir);
    writeFileSync(join(dir, 'frontier-seed.json'), JSON.stringify([
      { question: 'what does part one hide', scope: 'src/one', evidence: 'src/one/index.ts:1' },
      { question: 'what does part two hide', scope: 'src/two', evidence: 'src/two/index.ts:1' },
    ]));
    return dir;
  }

  function seed(dir: string, ...extra: string[]) {
    return spawnSync(process.execPath, [
      FRONTIER_ADMIT, 'seed', '--artifact-dir', dir, '--iteration', '0',
      '--input', join(dir, 'frontier-seed.json'), ...extra,
    ], { encoding: 'utf8' });
  }

  it('reports the bound budget instead of the loop default', () => {
    const result = seed(seedDir(), '--max-iterations-source', 'flag', '--max-iterations', '20');
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout).derivedMaxIterations).toBe(20);
    expect(result.stderr).toContain('budget after seed 20 iterations');
  });

  it('refuses a budget that is not a positive integer', () => {
    const result = seed(seedDir(), '--max-iterations-source', 'flag', '--max-iterations', '0');
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('--max-iterations must be a positive integer');
  });
});
