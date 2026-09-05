import { afterEach, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { __testables } from '../lib/validation/orchestrator.js';
import type { RegistrySeverity, ValidationEntry, ValidatorRegistryEntry } from '../lib/validation/orchestrator.js';

const tempDirs: string[] = [];
const SKILL_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
// A real registry entry, so the node-rule bridge is exercised against a rule
// that actually ships rather than a fixture that can drift from the registry.
const NODE_RULE: ValidatorRegistryEntry = {
  rule_id: 'CONTINUITY_FRESHNESS',
  script_path: 'validation/continuity-freshness.ts',
  severity: 'error',
  strict_only: true,
};

function createTempFolder(files: Record<string, string>): string {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'validation-orchestrator-'));
  tempDirs.push(folder);
  for (const [name, content] of Object.entries(files)) {
    const filePath = path.join(folder, name);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, 'utf8');
  }
  return folder;
}

function createLevelOneFolder(tasks: string, extraFiles: Record<string, string> = {}): string {
  return createTempFolder({
    'spec.md': '# Spec\n\n<!-- SPECKIT_LEVEL: 1 -->\n',
    'plan.md': '# Plan\n',
    'tasks.md': tasks,
    ...extraFiles,
  });
}

function validateFileExists(folder: string): ValidationEntry {
  return __testables.validateFileExists(folder, '1');
}

afterEach(() => {
  for (const folder of tempDirs.splice(0)) {
    fs.rmSync(folder, { recursive: true, force: true });
  }
});

describe('registry rule filtering', () => {
  it('includes strict-only rules only in strict mode and always excludes skipped rules', () => {
    const rules: ValidatorRegistryEntry[] = [
      { rule_id: 'BASE_RULE', script_path: 'rules/check-files.sh', severity: 'error' },
      { rule_id: 'STRICT_RULE', script_path: 'rules/check-files.sh', severity: 'warn', strict_only: true },
      NODE_RULE,
      { rule_id: 'SKIPPED_RULE', script_path: 'rules/check-files.sh', severity: 'skip', strict_only: true },
    ];

    const nonStrictRules = rules
      .filter((rule) => __testables.shouldRunRegistryShellRule(rule, new Set(), false))
      .map((rule) => rule.rule_id);
    const strictRules = rules
      .filter((rule) => __testables.shouldRunRegistryShellRule(rule, new Set(), true))
      .map((rule) => rule.rule_id);

    expect(nonStrictRules).toEqual(['BASE_RULE']);
    expect(strictRules).toEqual(['BASE_RULE', 'STRICT_RULE', 'CONTINUITY_FRESHNESS']);
  });
});

describe('shell rule status mapping', () => {
  it('maps shell statuses through registry severity', () => {
    const cases: Array<[status: string, severity: RegistrySeverity, expected: ValidationEntry['status']]> = [
      ['pass', 'error', 'pass'],
      ['skip', 'error', 'pass'],
      ['warn', 'error', 'warn'],
      ['info', 'error', 'info'],
      ['fail', 'error', 'error'],
      ['fail', 'warn', 'warn'],
      ['fail', 'info', 'info'],
      ['unexpected', 'warn', 'error'],
    ];

    for (const [status, severity, expected] of cases) {
      expect(__testables.mapShellRuleStatus(status, severity)).toBe(expected);
    }
  });
});

describe('registry rule script resolution', () => {
  it('rejects path traversal payloads', () => {
    expect(__testables.resolveRegistryRuleScript('rules/../lib/validator-registry.json')).toBeNull();
    expect(__testables.resolveRegistryRuleScript('rules/../spec/validate.sh')).toBeNull();
    expect(__testables.resolveRegistryRuleScript('validation/../validation/continuity-freshness.ts')).toBeNull();
    expect(__testables.resolveRegistryRuleScript('validation/nested/continuity-freshness.ts')).toBeNull();
  });

  it('resolves validation TypeScript rules to compiled validation scripts', () => {
    expect(__testables.resolveRegistryRuleScript('validation/continuity-freshness.ts')).toBe(
      path.join(SKILL_ROOT, 'scripts', 'dist', 'validation', 'continuity-freshness.js'),
    );
  });
});

describe('registry node rule execution', () => {
  it('runs a real node rule through the compiled bridge', () => {
    const folder = createLevelOneFolder('# Tasks\n\n- [ ] Pending task\n');
    const scriptPath = __testables.resolveRegistryRuleScript(NODE_RULE.script_path);
    if (!scriptPath) throw new Error('Expected continuity freshness script to resolve');

    const result = __testables.runRegistryNodeRule(folder, NODE_RULE, scriptPath, true);

    expect(result.rule).toBe('CONTINUITY_FRESHNESS');
    expect(result.status).toBe('pass');
    // The bridge has to carry the rule's own words back, not just its verdict.
    // Asserting only the status would pass on a bridge that dropped the
    // message, which is the difference between a report and a bare exit code.
    expect(result.message).toContain('Continuity freshness');
    expect(Array.isArray(result.details)).toBe(true);
  });

  it('reports an error when a rule prints a passing verdict but exits non-zero', () => {
    const folder = createLevelOneFolder('# Tasks\n\n- [ ] Pending task\n');
    const stubDir = fs.mkdtempSync(path.join(os.tmpdir(), 'validation-orchestrator-stub-'));
    tempDirs.push(stubDir);
    const stubPath = path.join(stubDir, 'optimistic-rule.cjs');
    fs.writeFileSync(
      stubPath,
      "process.stdout.write('rule\\tCONTINUITY_FRESHNESS\\nstatus\\tpass\\nmessage\\tlooks fine\\n'); process.exit(1);\n",
      'utf8',
    );

    const result = __testables.runRegistryNodeRule(folder, NODE_RULE, stubPath, true);

    expect(result.status).toBe('error');
    expect(result.message).toContain('exited 1');
  });

  it('carries a changed message back from the rule rather than a cached one', () => {
    const folder = createLevelOneFolder('# Tasks\n\n- [ ] Pending task\n');
    const scriptPath = __testables.resolveRegistryRuleScript(NODE_RULE.script_path);
    if (!scriptPath) throw new Error('Expected continuity freshness script to resolve');

    // Same rule, different environment, different reason: the flag flips this
    // rule from "not enabled" to a real applicability check. If the bridge
    // returned a fixed string the two runs would be indistinguishable.
    const before = __testables.runRegistryNodeRule(folder, NODE_RULE, scriptPath, true);
    const previous = process.env.SPECKIT_COMPLETION_FRESHNESS;
    process.env.SPECKIT_COMPLETION_FRESHNESS = 'true';
    let after;
    try {
      after = __testables.runRegistryNodeRule(folder, NODE_RULE, scriptPath, true);
    } finally {
      if (previous === undefined) delete process.env.SPECKIT_COMPLETION_FRESHNESS;
      else process.env.SPECKIT_COMPLETION_FRESHNESS = previous;
    }

    expect(before.message).not.toBe(after.message);
  });

  it('carries the rule code through as a distinguishable detail line', () => {
    const folder = createLevelOneFolder('# Tasks\n\n- [ ] Pending task\n');
    const scriptPath = __testables.resolveRegistryRuleScript(NODE_RULE.script_path);
    if (!scriptPath) throw new Error('Expected continuity freshness script to resolve');

    const previous = process.env.SPECKIT_COMPLETION_FRESHNESS;
    process.env.SPECKIT_COMPLETION_FRESHNESS = 'true';
    let result: ValidationEntry;
    try {
      // No implementation-summary.md in this fixture, so the rule resolves
      // to its `implementation_summary_missing` skip code.
      result = __testables.runRegistryNodeRule(folder, NODE_RULE, scriptPath, true);
    } finally {
      if (previous === undefined) delete process.env.SPECKIT_COMPLETION_FRESHNESS;
      else process.env.SPECKIT_COMPLETION_FRESHNESS = previous;
    }

    // The rule's own code survives the pass/warn/fail collapse as a detail
    // line, so an unverifiable skip stays distinguishable from a genuinely
    // verified pass in the aggregate report without changing that status.
    expect(result.status).toBe('pass');
    expect(result.details).toContain('code:implementation_summary_missing');
  });
});

describe('started-work file exemption', () => {
  it('does not require implementation-summary.md when work has not started', () => {
    const folder = createLevelOneFolder('# Tasks\n\n- [ ] Pending task\n');

    const result = validateFileExists(folder);

    expect(result.status).toBe('pass');
    expect(result.details).not.toContain('implementation-summary.md');
  });

  it('requires implementation-summary.md when tasks contain a completed list item', () => {
    const folder = createLevelOneFolder('# Tasks\n\n- [x] Completed task\n');

    const result = validateFileExists(folder);

    expect(result.status).toBe('error');
    expect(result.details).toContain('implementation-summary.md');
  });

  it('ignores task-notation legend rows', () => {
    const folder = createLevelOneFolder([
      '# Tasks',
      '',
      '| Prefix | Meaning |',
      '|--------|---------|',
      '| `[x]` | Completed |',
      '',
      '- [ ] Pending task',
      '',
    ].join('\n'));

    const result = validateFileExists(folder);

    expect(result.status).toBe('pass');
    expect(result.details).not.toContain('implementation-summary.md');
  });
});
