// ───────────────────────────────────────────────────────────────────
// MODULE: Placeholder Token Gate
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

// Every path below is derived from this file's own location, so the test always
// exercises the checkout it sits in and never a linked copy of another one.
const here = path.dirname(fileURLToPath(import.meta.url));
const cliRoot = path.resolve(here, '..');
const runtimeRoot = path.resolve(cliRoot, '..');
const validateScript = path.join(cliRoot, 'spec', 'validate.sh');
const shellRule = path.join(cliRoot, 'rules', 'check-placeholders.sh');
const fixturesRoot = path.join(cliRoot, 'test-fixtures');
const createdRoots = new Set<string>();

type RuleStatus = 'pass' | 'warn' | 'error';

interface RuleEntry {
  rule: string;
  status: RuleStatus;
  message: string;
  details: string[];
}

interface PacketShape {
  stamp: 'v2.2' | 'v2.3';
  status: 'Draft' | 'Complete';
  line: string;
}

const TOKEN_LINE = '[YOUR_VALUE_HERE: one-paragraph problem statement]';
const QUESTION_LINE = '[NEEDS CLARIFICATION: which owner?]';

// Builds a throwaway packet from the clean Level 2 fixture. Only spec.md is
// changed: the stamp, the Status cell and one extra line in the problem section.
function buildPacket(shape: PacketShape): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'placeholder-token-gate-'));
  createdRoots.add(root);
  const folder = path.join(root, 'packet');
  fs.cpSync(path.join(fixturesRoot, '053-template-compliant-level2'), folder, { recursive: true });
  const spec = path.join(folder, 'spec.md');
  const text = fs
    .readFileSync(spec, 'utf8')
    .replace('| v2.2 -->', `| ${shape.stamp} -->`)
    .replace('| **Status** | Complete |', `| **Status** | ${shape.status} |`)
    .replace('### Purpose', `${shape.line}\n\n### Purpose`);
  fs.writeFileSync(spec, text, 'utf8');
  return folder;
}

function runOrchestrator(folder: string): { entry: RuleEntry; passed: boolean } {
  const result = spawnSync('bash', [validateScript, folder, '--no-recursive', '--strict', '--json'], {
    encoding: 'utf8',
    env: { ...process.env, SPECKIT_RULES: 'PLACEHOLDER_FILLED' },
  });
  const report = JSON.parse(result.stdout) as { entries: RuleEntry[]; passed: boolean };
  const matches = report.entries.filter((item) => item.rule === 'PLACEHOLDER_FILLED');
  if (matches.length !== 1) throw new Error(`expected one PLACEHOLDER_FILLED entry, found ${matches.length}`);
  return { entry: matches[0], passed: report.passed };
}

// The shell rule is the mirror the isolated rule tests drive. It reports fail
// where the orchestrator reports error, so the two are compared after that mapping.
function runShellRule(folder: string): RuleStatus {
  const script = `source "${path.join(cliRoot, 'lib', 'shell-common.sh')}"; source "${shellRule}"; run_check "${folder}" 2; echo "$RULE_STATUS"`;
  const result = spawnSync('bash', ['-c', script], { encoding: 'utf8' });
  const status = result.stdout.trim().split('\n').pop();
  return status === 'fail' ? 'error' : (status as RuleStatus);
}

afterEach(() => {
  for (const root of createdRoots) fs.rmSync(root, { recursive: true, force: true });
  createdRoots.clear();
});

describe('PLACEHOLDER_FILLED token gate', () => {
  it('runs the orchestrator built from this checkout', () => {
    const built = path.join(runtimeRoot, 'dist', 'lib', 'validation', 'orchestrator.js');
    const resolved = fs.realpathSync(built);
    const home = fs.realpathSync(runtimeRoot) + path.sep;
    expect(resolved.startsWith(home), `${built} resolves to ${resolved}, outside ${home}`).toBe(true);
  });

  it('warns on a v2.3 doc with an unfilled token while the packet is a Draft', { timeout: 30_000 }, () => {
    const folder = buildPacket({ stamp: 'v2.3', status: 'Draft', line: TOKEN_LINE });
    const { entry, passed } = runOrchestrator(folder);
    expect(entry.status).toBe('warn');
    expect(passed).toBe(true);
    expect(entry.details.some((detail) => detail.startsWith('spec.md:'))).toBe(true);
    expect(runShellRule(folder)).toBe('warn');
  });

  it('fails a v2.3 doc with an unfilled token once the status is not Draft', { timeout: 30_000 }, () => {
    const folder = buildPacket({ stamp: 'v2.3', status: 'Complete', line: TOKEN_LINE });
    const { entry, passed } = runOrchestrator(folder);
    expect(entry.status).toBe('error');
    expect(passed).toBe(false);
    expect(runShellRule(folder)).toBe('error');
  });

  it('keeps the strict verdict for a v2.2 doc even while the packet is a Draft', { timeout: 30_000 }, () => {
    const folder = buildPacket({ stamp: 'v2.2', status: 'Draft', line: TOKEN_LINE });
    const { entry, passed } = runOrchestrator(folder);
    expect(entry.status).toBe('error');
    expect(passed).toBe(false);
    expect(runShellRule(folder)).toBe('error');
  });

  it('never defers an open question, even in a v2.3 Draft', { timeout: 30_000 }, () => {
    const folder = buildPacket({ stamp: 'v2.3', status: 'Draft', line: QUESTION_LINE });
    const { entry } = runOrchestrator(folder);
    expect(entry.status).toBe('error');
    expect(runShellRule(folder)).toBe('error');
  });
});
