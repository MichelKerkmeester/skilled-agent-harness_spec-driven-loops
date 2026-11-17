// ───────────────────────────────────────────────────────────────────
// MODULE: Stop Decision YAML Contract
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// The stop decision is computed by a script from the state files. A workflow
// step that still carries vote arithmetic would let two runs over the same
// state stop at different points, so the step may only branch on the script's
// stop_decision object.
const ASSETS = resolve(__dirname, '..', '..', '..', '..', '..', 'commands', 'deep', 'assets');
const FILES = [
  'deep-research.yaml',
  'deep-review.yaml',
];
const FORBIDDEN_IN_STEP = [
  'MAD(',
  'mean(last',
  'w=0.',
  '0.08',
  '0.05',
  'checkQualityGuards',
  'graph_decision is absent',
  'Skip hard stops',
];

function stepText(text: string, step: string): string {
  const start = text.indexOf(`      ${step}:\n`);
  if (start === -1) return '';
  const rest = text.slice(start + 1);
  const end = rest.search(/\n      step_[a-z_]+:\n/);
  return end === -1 ? rest : rest.slice(0, end);
}

describe.each(FILES)('%s', (file) => {
  const text = readFileSync(resolve(ASSETS, file), 'utf8');

  it('step_check_convergence holds no vote arithmetic', () => {
    const step = stepText(text, 'step_check_convergence');
    expect(step.length).toBeGreaterThan(0);
    const found = FORBIDDEN_IN_STEP.filter((fragment) => step.includes(fragment));
    expect(found).toEqual([]);
  });

  it('step_check_convergence branches on stop_decision', () => {
    const step = stepText(text, 'step_check_convergence');
    expect(step).toContain('stop_decision.decision');
    expect(step).toContain('stop_decision.stopReason');
  });

  it('runs convergence.cjs once with --stop-decision', () => {
    const occurrences = text.split('runtime/scripts/convergence.cjs').length - 1;
    expect(occurrences).toBe(1);
    const invocation = text
      .split('\n')
      .find((line) => line.includes('runtime/scripts/convergence.cjs')) ?? '';
    expect(invocation).toContain('--stop-decision');
  });

  it('the divergent pivot reads stop_decision.reasonDetail', () => {
    const pivot = text
      .split('\n')
      .filter((line) => line.includes('branch_on') && line.includes('stop_decision.reasonDetail'));
    expect(pivot.length).toBeGreaterThan(0);
  });

  it('hands the divergent pivot the fine cause, not the coarse stop reason', () => {
    const lines = text
      .split('\n')
      .filter((line) => line.includes('--trigger-reason "{reason_detail}"'));
    expect(lines.length).toBe(1);
  });

  if (file.startsWith('deep-review')) {
    it('holds no hardcoded 0.05 threshold', () => {
      expect(text).not.toMatch(/0\.05\b/);
    });
  }
});

// The opt-in depth mode must be bound everywhere the convergence mode is, so an
// unbound value can never reach convergence.cjs as an empty argument.
describe('deep-research binds depth_mode beside convergence_mode', () => {
  const yaml = readFileSync(resolve(ASSETS, 'deep-research.yaml'), 'utf8');
  const presentation = readFileSync(resolve(ASSETS, 'deep-research-presentation.txt'), 'utf8');

  it('declares depth_mode in user_inputs and requires it in the preflight contract', () => {
    expect(yaml).toMatch(/\n  depth_mode: "\[default|expansive\]/);
    expect(yaml).toContain('convergence_mode, depth_mode, stop_policy]');
  });

  it('writes the depth mode at config creation and extracts it in step_read_state', () => {
    expect(yaml).toContain('antiConvergence.depthMode: "{depth_mode}"');
    expect(yaml).toMatch(/- depth_mode: "Extract antiConvergence\.depthMode/);
  });

  it('passes --depth-mode to the convergence.cjs stop decision', () => {
    const invocation = yaml.split('\n').find((line) => line.includes('runtime/scripts/convergence.cjs') && line.includes('--stop-decision'));
    expect(invocation).toContain('--convergence-mode "{convergence_mode}" --depth-mode "{depth_mode}"');
  });

  it('binds depth_mode in the presentation default, input table, resolution and bound values', () => {
    expect(presentation).toContain('depth_mode: default  # default | expansive');
    expect(presentation).toContain('| `depth_mode`');
    expect(presentation).toContain('|-- --depth-mode=default|expansive -> antiConvergence.depthMode = value');
    expect(presentation).toContain('- depth_mode = [from flag, marker, or default `default`');
  });
});
