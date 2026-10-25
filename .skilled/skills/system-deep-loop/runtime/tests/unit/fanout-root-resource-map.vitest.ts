// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Fan-out Root Resource Map
// ───────────────────────────────────────────────────────────────────

// A fan-out root has no root state log until closeout writes it, so the
// root reducer that emits the resource map exits on a missing file and no
// root map is written. Each lineage already emits its own map under
// `lineages/<label>/`. Both review workflows therefore skip the root
// reducer whenever the run is a fan-out root and point the report at the
// lineage maps instead. A single lineage run still emits its own map,
// because the skip is keyed on `config.fanout`, which a lineage never binds.

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

const WORKFLOW_FILES = ['deep-review-auto.yaml', 'deep-review-confirm.yaml'] as const;
const ROOT_SKIP_WHEN = 'config.fanout is present';
const MERGE_SKIP_WHEN = 'config.fanout is absent';
const LINEAGE_MAPS = '{artifact_dir}/lineages/*/resource-map.md';

type WorkflowStep = { skip_when?: string; note?: string };
type ReviewWorkflow = {
  workflow?: {
    phase_synthesis?: { steps?: Record<string, WorkflowStep> };
  };
};

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function synthesisStep(file: string, id: string): WorkflowStep {
  const doc = loadYaml(readFileSync(resolve(ASSETS, file), 'utf8')) as ReviewWorkflow;
  const step = doc.workflow?.phase_synthesis?.steps?.[id];
  if (!step) throw new Error(`${id} not found in ${file}`);
  return step;
}

// ───────────────────────────────────────────────────────────────────
// 3. TESTS
// ───────────────────────────────────────────────────────────────────

describe('deep-review skips the root resource-map reducer at a fan-out root', () => {
  for (const file of WORKFLOW_FILES) {
    it(`skips step_emit_resource_map exactly when the fan-out merge runs in ${file}`, () => {
      expect(synthesisStep(file, 'step_emit_resource_map')['skip_when']).toBe(ROOT_SKIP_WHEN);
      expect(synthesisStep(file, 'step_fanout_merge')['skip_when']).toBe(MERGE_SKIP_WHEN);
    });

    it(`points a fan-out report at the lineage resource maps in ${file}`, () => {
      expect(synthesisStep(file, 'step_emit_resource_map')['note']).toContain(LINEAGE_MAPS);
    });
  }
});
