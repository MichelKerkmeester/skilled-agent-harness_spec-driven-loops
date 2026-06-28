// ───────────────────────────────────────────────────────────────────
// MODULE: Speckit Autopilot Contract Tests
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { runtimeRoot } from '../helpers/spawn-cjs';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const OPENCODE_ROOT = resolve(runtimeRoot, '..', '..');
const SPECKIT_COMMAND_ROOT = resolve(OPENCODE_ROOT, 'commands', 'speckit');
const COMPLETE_AUTO_YAML = resolve(SPECKIT_COMMAND_ROOT, 'assets', 'speckit_complete_auto.yaml');
const TERMINAL_REASON_CODES = [
  'no_eligible_tasks',
  'retry_exhausted',
  'verification_failed',
  'uncertainty_blocked',
];
const AUTOPILOT_SEQUENCE = [
  'branch_first',
  'propose_unattended',
  'apply_unattended',
  'archive_in_place',
  'verify_clean',
  'merge_on_clean',
];

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function readSpeckitCommand(fileName: string): string {
  return readFileSync(resolve(SPECKIT_COMMAND_ROOT, fileName), 'utf8');
}

function readCompleteAutoYaml(): string {
  return readFileSync(COMPLETE_AUTO_YAML, 'utf8');
}

function extractTerminalReasonCodes(yamlText: string): string[] {
  const match = yamlText.match(/terminal_reason_codes:\n((?:\s{6}- [a-z_]+\n)+)/u);
  if (!match) {
    throw new Error('terminal_reason_codes block was not found');
  }

  return match[1]
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^- /u, ''));
}

// ───────────────────────────────────────────────────────────────────
// 4. TESTS
// ───────────────────────────────────────────────────────────────────

describe('speckit autopilot command contract', () => {
  it('routes every command through explicit autopilot flags without aliasing plain auto', () => {
    for (const command of ['complete.md', 'plan.md', 'implement.md']) {
      const text = readSpeckitCommand(command);

      expect(text).toContain(':autopilot');
      expect(text).toContain(':unattended');
      expect(text).toContain('--unattended');
      expect(text).toContain('do not alias it to `:auto`');
    }
  });

  it('pins the exact unattended terminal reason enum in the complete auto workflow', () => {
    const yamlText = readCompleteAutoYaml();

    expect(extractTerminalReasonCodes(yamlText)).toEqual(TERMINAL_REASON_CODES);
    expect(yamlText).toContain('success_reason: null');
    expect(yamlText).toContain('SPECKIT_AUTOPILOT_RESULT');
  });

  it('keeps the branch-first lifecycle ordered before merge-on-clean', () => {
    const yamlText = readCompleteAutoYaml();
    const positions = AUTOPILOT_SEQUENCE.map((step) => yamlText.indexOf(step));

    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((left, right) => left - right));
  });

  it('requires unattended task metadata and branch-preserved failure', () => {
    const planText = readSpeckitCommand('plan.md');
    const implementText = readSpeckitCommand('implement.md');
    const yamlText = readCompleteAutoYaml();

    for (const field of ['agent', 'deps', 'touched-files']) {
      expect(planText).toContain(field);
      expect(yamlText).toContain(field);
    }

    for (const reason of TERMINAL_REASON_CODES) {
      expect(implementText).toContain(reason);
      expect(yamlText).toContain(`${reason}: { branch_preserved: true, merge: false, emit_terminal_result: true }`);
    }
  });
});
