import { afterEach, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { __testables } from '../lib/validation/orchestrator.js';
import type { RegistrySeverity, ValidationEntry, ValidatorRegistryEntry } from '../lib/validation/orchestrator.js';

const tempDirs: string[] = [];

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
      { rule_id: 'SKIPPED_RULE', script_path: 'rules/check-files.sh', severity: 'skip', strict_only: true },
    ];

    const nonStrictRules = rules
      .filter((rule) => __testables.shouldRunRegistryShellRule(rule, new Set(), false))
      .map((rule) => rule.rule_id);
    const strictRules = rules
      .filter((rule) => __testables.shouldRunRegistryShellRule(rule, new Set(), true))
      .map((rule) => rule.rule_id);

    expect(nonStrictRules).toEqual(['BASE_RULE']);
    expect(strictRules).toEqual(['BASE_RULE', 'STRICT_RULE']);
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

  it('requires implementation-summary.md when checklist contains a completed list item', () => {
    const folder = createLevelOneFolder('# Tasks\n\n- [ ] Pending task\n', {
      'checklist.md': '# Checklist\n\n- [X] Completed check\n',
    });

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
