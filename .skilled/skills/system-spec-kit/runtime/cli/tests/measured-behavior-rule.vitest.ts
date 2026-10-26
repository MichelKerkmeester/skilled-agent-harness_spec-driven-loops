// ───────────────────────────────────────────────────────────────────
// MODULE: Measured Behavior Rule Tests
// ───────────────────────────────────────────────────────────────────
// Runs the MEASURED_BEHAVIOR shell rule against throwaway packet folders. The
// rule only applies to a spec.md stamped from spec-core at v2.4 or later, and
// it may warn but must never fail, because a fail on a warn-severity rule is
// still one mapping away from an error if the registry row ever changes.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

const CLI_ROOT = path.resolve(import.meta.dirname, '..');
const RULE = path.join(CLI_ROOT, 'rules', 'check-measured-behavior.sh');
const REGISTRY = path.join(CLI_ROOT, 'lib', 'validator-registry.json');

const FENCE = '```';
const folders: string[] = [];
const seenStatuses: string[] = [];

function spec(stamp: string, block: string | null): string {
  const measured = block === null
    ? ''
    : `<!-- ANCHOR:measured-behavior -->\n### Measured Behavior\n<!-- FILL: Paste the command and its verbatim output. -->\n\n${block}\n<!-- /ANCHOR:measured-behavior -->\n\n`;
  return [
    '---',
    'title: "Feature Specification: Fixture"',
    '---',
    `<!-- SPECKIT_TEMPLATE_SOURCE: ${stamp} -->`,
    '# Feature Specification: Fixture',
    '',
    '<!-- ANCHOR:problem -->',
    '## 2. PROBLEM & PURPOSE',
    '',
    '### Problem Statement',
    'The script prints too much.',
    '<!-- /ANCHOR:problem -->',
    '',
    `${measured}<!-- ANCHOR:scope -->`,
    '## 3. SCOPE',
    '<!-- /ANCHOR:scope -->',
    '',
  ].join('\n');
}

function packet(text: string | null): string {
  const folder = mkdtempSync(path.join(tmpdir(), 'measured-behavior-'));
  folders.push(folder);
  if (text !== null) writeFileSync(path.join(folder, 'spec.md'), text);
  return folder;
}

function runRule(folder: string): { status: string; message: string } {
  const [status, message] = execFileSync('bash', ['-c',
    'source "$1"; run_check "$2" 2; printf "%s\\n%s\\n" "$RULE_STATUS" "$RULE_MESSAGE"',
    '_', RULE, folder], { encoding: 'utf8' }).split('\n');
  seenStatuses.push(status);
  return { status, message };
}

afterEach(() => {
  while (folders.length > 0) rmSync(folders.pop() as string, { recursive: true, force: true });
});

describe('MEASURED_BEHAVIOR shell rule', () => {
  it('warns when a v2.4 spec has no measured-behavior block', () => {
    const result = runRule(packet(spec('spec-core | v2.4', null)));
    expect(result).toEqual({ status: 'warn', message: 'spec.md has no measured-behavior block' });
  });

  it('warns on an empty fence, and on a fence holding only an unfilled value token', () => {
    const empty = runRule(packet(spec('spec-core | v2.4', `${FENCE}text\n\n${FENCE}`)));
    expect(empty.status).toBe('warn');
    expect(empty.message).toBe('Measured behavior block holds no command output and no N/A: line with a reason');

    const token = runRule(packet(spec('spec-core | v2.4', `${FENCE}\n[YOUR_VALUE_HERE: command and output]\n${FENCE}`)));
    expect(token.status).toBe('warn');
  });

  it('passes a fence holding the command and its output', () => {
    const block = `${FENCE}text\n$ bash recommend-level.sh --quiet | wc -l\n      17\n${FENCE}`;
    const result = runRule(packet(spec('spec-core + level2-verify | v2.4', block)));
    expect(result).toEqual({ status: 'pass', message: 'Measured behavior block holds command output or a reasoned N/A' });
  });

  it('passes an N/A: line with a reason and warns on a bare N/A:', () => {
    expect(runRule(packet(spec('spec-core | v2.4', 'N/A: the change adds a new file, so there is no current behavior to run.'))).status).toBe('pass');
    expect(runRule(packet(spec('spec-core | v2.4', 'N/A:   '))).status).toBe('warn');
  });

  it('does not apply to a v2.3 spec, another template source or an unstamped spec', () => {
    const v23 = runRule(packet(spec('spec-core | v2.3', null)));
    expect(v23).toEqual({ status: 'pass', message: 'Not applicable: spec.md is stamped v2.3, below v2.4' });
    expect(runRule(packet(spec('phase-parent-spec | v2.4', null))).message).toBe('Not applicable: spec.md is not stamped from spec-core');
    expect(runRule(packet(spec('spec-core | v2.4', null).replace(/^<!-- SPECKIT_TEMPLATE_SOURCE.*$/mu, ''))).status).toBe('pass');
    expect(runRule(packet(null)).message).toBe('Not applicable: no spec.md');
  });

  it('compares the stamp numerically, so v2.10 and v3.0 apply', () => {
    expect(runRule(packet(spec('spec-core | v2.10', null))).status).toBe('warn');
    expect(runRule(packet(spec('spec-core | v3.0', null))).status).toBe('warn');
  });

  it('never reports fail, and the registry keeps the rule at warn severity', () => {
    expect(seenStatuses.length).toBeGreaterThan(0);
    expect(seenStatuses.filter((status) => status !== 'pass' && status !== 'warn')).toEqual([]);
    const registry = JSON.parse(readFileSync(REGISTRY, 'utf8')) as Array<{ rule_id: string; severity: string; script_path: string }>;
    const row = registry.find((item) => item.rule_id === 'MEASURED_BEHAVIOR');
    expect(row).toMatchObject({ severity: 'warn', script_path: 'rules/check-measured-behavior.sh' });
  });
});
