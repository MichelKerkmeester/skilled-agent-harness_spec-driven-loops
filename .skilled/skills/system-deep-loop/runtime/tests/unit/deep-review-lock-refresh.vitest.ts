// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Lock Refresh
// ───────────────────────────────────────────────────────────────────

// A review run can outlive a short lock TTL, so both review workflows
// acquire the packet lock with the long TTL and refresh its heartbeat at
// the top of every loop pass. Acquire reclaims a stale lock itself, so
// the assets must not keep the older claim that reclaiming a stale lock
// is a confirmation-only override.

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

const LONG_TTL_ARG = '--ttl-ms 1800000';
const REFRESH_COMMAND = 'loop-lock.cjs refresh';
const STALE_OVERRIDE_CLAIM = 'stale-lock override is confirm-only';

type WorkflowStep = { command?: string };
type WorkflowPhase = { steps?: Record<string, WorkflowStep> };
type ReviewWorkflow = {
  workflow?: {
    phase_init?: WorkflowPhase;
    phase_loop?: WorkflowPhase;
  };
};

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function readWorkflow(file: string): { text: string; doc: ReviewWorkflow } {
  const text = readFileSync(resolve(ASSETS, file), 'utf8');
  return { text, doc: loadYaml(text) as ReviewWorkflow };
}

function acquireStep(doc: ReviewWorkflow, file: string): WorkflowStep {
  const step = doc.workflow?.phase_init?.steps?.['step_acquire_lock'];
  if (!step) throw new Error(`step_acquire_lock not found in ${file}`);
  return step;
}

function phaseLoopSteps(doc: ReviewWorkflow, file: string): Record<string, WorkflowStep> {
  const steps = doc.workflow?.phase_loop?.steps;
  if (!steps) throw new Error(`workflow.phase_loop.steps not found in ${file}`);
  return steps;
}

// ───────────────────────────────────────────────────────────────────
// 3. TESTS
// ───────────────────────────────────────────────────────────────────

describe('deep-review keeps its packet lock alive across iterations', () => {
  for (const file of WORKFLOW_FILES) {
    it(`acquires the packet lock with the long TTL in ${file}`, () => {
      const { doc } = readWorkflow(file);
      expect(acquireStep(doc, file).command ?? '').toContain(LONG_TTL_ARG);
    });

    it(`refreshes the packet lock first in every loop pass in ${file}`, () => {
      const { doc } = readWorkflow(file);
      const firstEntry = Object.entries(phaseLoopSteps(doc, file))[0];
      expect(firstEntry?.[0]).toBe('step_refresh_lock');
      expect(firstEntry?.[1]?.command ?? '').toContain(REFRESH_COMMAND);
    });

    it(`drops the confirm-only stale-lock claim in ${file}`, () => {
      const { text } = readWorkflow(file);
      expect(text).not.toContain(STALE_OVERRIDE_CLAIM);
    });
  }
});
