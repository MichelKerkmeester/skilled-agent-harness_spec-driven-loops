// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Stage Skip
// ───────────────────────────────────────────────────────────────────

// A fan-out lineage stages its own artifacts under the lineage-owned
// artifact directory, which the runner collects separately. Letting the
// lineage also stage the shared index would let sibling lineages race the
// same `git add` and leave lineage-owned paths staged in the parent
// packet. Both review workflows therefore skip the staging step exactly
// when the lineage override is bound.

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { runtimeRoot } from '../helpers/spawn-cjs';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const WORKSPACE_ROOT = resolve(runtimeRoot, '..', '..', '..');
const ASSETS = resolve(WORKSPACE_ROOT, 'commands', 'deep', 'assets');

// js-yaml is a dependency of the shared package the runtime declares, so
// anchor the require at that package rather than reaching through a
// sibling skill's node_modules by relative path.
const sharedRequire = createRequire(
  resolve(runtimeRoot, '..', '..', 'system-spec-kit', 'shared', 'package.json'),
);
const { load: loadYaml } = sharedRequire('js-yaml') as { load: (source: string) => unknown };

const WORKFLOW_FILE = 'deep-review.yaml';
const STAGE_SKIP_WHEN = 'config.fanout_lineage_artifact_dir is present';

type WorkflowStep = { skip_when?: string };
type ReviewWorkflow = {
  workflow?: {
    phase_synthesis?: { steps?: Record<string, WorkflowStep> };
  };
};

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function stageStep(file: string): WorkflowStep {
  const doc = loadYaml(readFileSync(resolve(ASSETS, file), 'utf8')) as ReviewWorkflow;
  const step = doc.workflow?.phase_synthesis?.steps?.['step_stage_artifact_dir'];
  if (!step) throw new Error(`step_stage_artifact_dir not found in ${file}`);
  return step;
}

// ───────────────────────────────────────────────────────────────────
// 3. TESTS
// ───────────────────────────────────────────────────────────────────

describe('deep-review skips artifact staging inside a fan-out lineage', () => {
  it('skips step_stage_artifact_dir when the lineage override is bound', () => {
    expect(stageStep(WORKFLOW_FILE)['skip_when']).toBe(STAGE_SKIP_WHEN);
  });

  it('makes the skip the first key of step_stage_artifact_dir', () => {
    expect(Object.keys(stageStep(WORKFLOW_FILE))[0]).toBe('skip_when');
  });
});
