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
  'deep-research-auto.yaml',
  'deep-research-confirm.yaml',
  'deep-review-auto.yaml',
  'deep-review-confirm.yaml',
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
    const lines = text.split('\n').filter((line) => line.includes('triggerReason:'));
    expect(lines.length).toBe(1);
    expect(lines[0]).toContain("'{reason_detail}'");
  });

  if (file.startsWith('deep-review-')) {
    it('holds no hardcoded 0.05 threshold', () => {
      expect(text).not.toMatch(/0\.05\b/);
    });
  }
});
