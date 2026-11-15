// ───────────────────────────────────────────────────────────────────
// MODULE: Stop Policy YAML Parity
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// --stop-policy=max-iterations must keep every runtime-loop workflow running
// to its iteration ceiling, so each one records the policy, reads it back and
// gates its convergence stop on it. A workflow that drops any of the three
// silently stops early.
const ASSETS = resolve(__dirname, '..', '..', '..', '..', '..', 'commands', 'deep', 'assets');
const RUNTIME_LOOP_YAMLS = [
  'deep-research.yaml',
  'deep-review.yaml',
];
const STOP_CLAUSE = 'if stop_policy == "max-iterations" AND iteration_count < max_iterations';

function stepText(text: string, step: string): string {
  const start = text.indexOf(`      ${step}:\n`);
  if (start === -1) return '';
  const rest = text.slice(start + 1);
  const end = rest.search(/\n      step_[a-z_]+:\n/);
  return end === -1 ? rest : rest.slice(0, end);
}

// The nearest line above with less indentation: the rule a line belongs to.
function parentLine(lines: string[], index: number): string {
  const indent = lines[index].search(/\S/);
  for (let i = index - 1; i >= 0; i -= 1) {
    if (lines[i].trim() && lines[i].search(/\S/) < indent) return lines[i];
  }
  return '';
}

// The literal algorithm text of a workflow's convergence step.
function convergenceAlgorithm(text: string): string {
  const lines = stepText(text, 'step_check_convergence').split('\n');
  const start = lines.findIndex((line) => /^\s+algorithm: \|/.test(line));
  if (start === -1) return '';
  const indent = lines[start].search(/\S/);
  const body: string[] = [];
  for (const line of lines.slice(start + 1)) {
    if (line.trim() && line.search(/\S/) <= indent) break;
    body.push(line);
  }
  return body.join('\n');
}

describe('stop policy parity across runtime-loop workflows', () => {
  for (const file of RUNTIME_LOOP_YAMLS) {
    it(`${file} records, reads and honors stop_policy`, () => {
      const text = readFileSync(resolve(ASSETS, file), 'utf8');
      // Research also writes it into its line-one state row; review keeps it in
      // the config file alone, because its state log is a gateway projection.
      expect(text).toMatch(/"stopPolicy":"\{stop_policy\}"|stopPolicy: "\{stop_policy\}"/);
      expect(text).toMatch(/- stop_policy: "Extract stopPolicy from deep-(research|review)-config\.json/);
      expect(stepText(text, 'step_check_convergence')).toContain(STOP_CLAUSE);
      // A clause nested under the convergence-off branch is skipped in the default mode.
      const convergence = stepText(text, 'step_check_convergence').split('\n');
      convergence.forEach((line, index) => {
        if (line.includes(STOP_CLAUSE)) {
          expect(parentLine(convergence, index)).not.toContain('convergence_mode == "off"');
        }
      });
    });
  }
});

// One workflow serves both modes, so its convergence algorithm is the only one
// either mode can run. An empty algorithm would stop a run at a different point
// than the loop contract promises.
describe('convergence algorithm contract', () => {
  for (const mode of ['research', 'review']) {
    it(`deep-${mode}.yaml carries the convergence algorithm`, () => {
      const algorithm = convergenceAlgorithm(readFileSync(resolve(ASSETS, `deep-${mode}.yaml`), 'utf8'));
      expect(algorithm.length).toBeGreaterThan(0);
    });
  }
});
