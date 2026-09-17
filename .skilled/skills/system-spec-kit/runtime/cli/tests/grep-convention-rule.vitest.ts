// ───────────────────────────────────────────────────────────────────
// TEST: Grep Convention Validator Rule
// ───────────────────────────────────────────────────────────────────
// Drives runtime/cli/rules/check-grep-convention.sh through the same wrapper
// contract the validation orchestrator uses, so the shell relay is exercised
// rather than only the node helper it delegates to.
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const SKILL_ROOT = path.resolve(import.meta.dirname, '..', '..', '..');
const RULE_SCRIPT = path.join(SKILL_ROOT, 'runtime', 'cli', 'rules', 'check-grep-convention.sh');
const VALIDATE_SCRIPT_DIR = path.join(SKILL_ROOT, 'runtime', 'cli', 'spec');
const FIXTURE_ROOT = path.join(SKILL_ROOT, 'runtime', 'cli', 'tests', 'fixtures', 'grep-convention');

const RULE_ID = 'GREP_CONVENTION';

// Mirrors the orchestrator's registry shell-rule wrapper: source the shared
// helpers, source the rule, call run_check, then print the RULE_* variables in
// the tab-separated form the orchestrator parses.
const WRAPPER = `set -euo pipefail
folder="$1"
rule_script="$2"
rule_id="$3"
validate_script_dir="$4"

RULES_DIR="$validate_script_dir/../rules"
VALIDATOR_REGISTRY_JSON="$validate_script_dir/../lib/validator-registry.json"
JSON_MODE=false
QUIET_MODE=false
VERBOSE=false
LEVEL_METHOD="inferred"
DETECTED_LEVEL="1"
RULE_NAME=""
RULE_STATUS="pass"
RULE_MESSAGE=""
RULE_DETAILS=()
RULE_REMEDIATION=""

source "$validate_script_dir/../lib/shell-common.sh"
source "$rule_script"

run_check "$folder" "1"

printf 'rule\\t%s\\n' "\${RULE_NAME:-$rule_id}"
printf 'status\\t%s\\n' "\${RULE_STATUS:-pass}"
printf 'message\\t%s\\n' "\${RULE_MESSAGE:-OK}"
if [[ -n "\${RULE_DETAILS[*]-}" ]]; then
  for detail in "\${RULE_DETAILS[@]}"; do
    printf 'detail\\t%s\\n' "$detail"
  done
fi
`;

interface Diagnostic {
  path: string;
  line: number;
  category: string;
  severity: string;
  rawKey: string;
  reason: string;
}

interface RuleResult {
  status: string;
  message: string;
  diagnostics: Diagnostic[];
}

const DIAGNOSTIC_PATTERN =
  /^path=(?<path>\S+) line=(?<line>\d+) category=(?<category>\S+) severity=(?<severity>\S+) rawKey=(?<rawKey>.*?) reason=(?<reason>.+)$/u;

function runRule(fixture: string): RuleResult {
  const folder = path.join(FIXTURE_ROOT, fixture);
  const result = spawnSync(
    'bash',
    ['-c', WRAPPER, 'grep-convention-test-wrapper', folder, RULE_SCRIPT, RULE_ID, VALIDATE_SCRIPT_DIR],
    { cwd: SKILL_ROOT, encoding: 'utf8' },
  );

  expect(result.error, `wrapper failed to spawn for ${fixture}`).toBeUndefined();
  expect(result.status, `wrapper exited non-zero for ${fixture}: ${result.stderr}`).toBe(0);

  const diagnostics: Diagnostic[] = [];
  let status = 'pass';
  let message = '';

  for (const line of (result.stdout ?? '').split('\n')) {
    const separator = line.indexOf('\t');
    if (separator === -1) continue;
    const kind = line.slice(0, separator);
    const value = line.slice(separator + 1);
    if (kind === 'status') status = value;
    else if (kind === 'message') message = value;
    else if (kind === 'detail') {
      const match = value.match(DIAGNOSTIC_PATTERN);
      expect(match?.groups, `detail row is not in the diagnostics schema: ${value}`).toBeTruthy();
      const groups = match!.groups!;
      diagnostics.push({
        path: groups.path,
        line: Number(groups.line),
        category: groups.category,
        severity: groups.severity,
        rawKey: groups.rawKey,
        reason: groups.reason,
      });
    }
  }

  return { status, message, diagnostics };
}

// The eight variant labels, plus the cross-cutting categories the same rule
// reports. valid-empty is deliberately absent from the row expectations: the
// convention treats a well-formed empty list as conforming, not as a finding.
const VARIANT_EXPECTATIONS: Array<[string, string | null, string | null]> = [
  ['missing', 'missing', 'error'],
  ['malformed-or-unclosed', 'malformed-or-unclosed', 'error'],
  ['non-yaml', 'non-yaml', 'error'],
  ['wrong-list-type', 'wrong-list-type', 'error'],
  ['non-string-members', 'non-string-members', 'error'],
  ['oversized', 'oversized', 'error'],
  ['duplicate', 'duplicate', 'error'],
  ['valid-empty', null, null],
];

// Report-only in this phase. These classes name work the retrofit does not do,
// so they warn until their owners fix them and the staging is promoted.
const CROSS_CUTTING_EXPECTATIONS: Array<[string, string, string]> = [
  ['alias-hit', 'alias-hit', 'warn'],
  ['generic-trigger', 'generic-trigger', 'warn'],
  ['900-folder-token-fallback', 'generic-trigger', 'warn'],
  ['anchor-unmatched', 'anchor-unmatched', 'warn'],
  ['anchor-duplicate', 'anchor-duplicate', 'warn'],
  ['naming-exception', 'naming-exception', 'warn'],
];

// The staging decision, restated here so a change to the rule's table has to be
// made deliberately in both places rather than silently in one.
const EXPECTED_SEVERITY: Record<string, string> = {
  'missing': 'error',
  'malformed-or-unclosed': 'error',
  'non-yaml': 'error',
  'wrong-list-type': 'error',
  'non-string-members': 'error',
  'oversized': 'error',
  'duplicate': 'error',
  'generic-trigger': 'warn',
  'anchor-unmatched': 'warn',
  'anchor-duplicate': 'warn',
  'alias-hit': 'warn',
  'naming-exception': 'warn',
};

describe('GREP_CONVENTION rule', () => {
  it('ships a fixture directory for every expected case', () => {
    const expected = [
      ...VARIANT_EXPECTATIONS.map(([fixture]) => fixture),
      ...CROSS_CUTTING_EXPECTATIONS.map(([fixture]) => fixture),
      'conforming',
    ].sort();
    const actual = fs
      .readdirSync(FIXTURE_ROOT, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
    expect(actual).toEqual(expected);
  });

  describe.each(VARIANT_EXPECTATIONS)('variant fixture %s', (fixture, category, severity) => {
    it(category ? `reports exactly one ${category} row` : 'reports no rows', () => {
      const result = runRule(fixture);

      if (category === null) {
        expect(result.diagnostics).toEqual([]);
        expect(result.status).toBe('pass');
        return;
      }

      expect(result.diagnostics).toHaveLength(1);
      const [row] = result.diagnostics;
      expect(row.category).toBe(category);
      expect(row.severity).toBe(severity);
      expect(result.status).toBe('fail');
    });
  });

  describe.each(CROSS_CUTTING_EXPECTATIONS)('cross-cutting fixture %s', (fixture, category, severity) => {
    it(`reports exactly one ${category} row at severity ${severity}`, () => {
      const result = runRule(fixture);
      expect(result.diagnostics).toHaveLength(1);
      const [row] = result.diagnostics;
      expect(row.category).toBe(category);
      expect(row.severity).toBe(severity);
      expect(result.status).toBe(severity === 'error' ? 'fail' : 'warn');
    });
  });

  // Every emitted diagnostic carries path, one-based line, category and
  // reason. A whole-file finding addresses line 0 by contract, so the
  // assertion is that the field is a present integer, not that it is positive.
  it('populates path, line, category and reason on every diagnostic', () => {
    const fixtures = [
      ...VARIANT_EXPECTATIONS.map(([fixture]) => fixture),
      ...CROSS_CUTTING_EXPECTATIONS.map(([fixture]) => fixture),
    ];
    const categories = new Set<string>();
    let rowCount = 0;

    for (const fixture of fixtures) {
      for (const row of runRule(fixture).diagnostics) {
        rowCount += 1;
        categories.add(row.category);
        expect(row.path, `empty path in ${fixture}`).not.toBe('');
        expect(row.path.endsWith('.md'), `path is not a document in ${fixture}`).toBe(true);
        expect(Number.isInteger(row.line), `non-integer line in ${fixture}`).toBe(true);
        expect(row.line, `negative line in ${fixture}`).toBeGreaterThanOrEqual(0);
        expect(row.category, `empty category in ${fixture}`).not.toBe('');
        expect(row.reason.trim(), `empty reason in ${fixture}`).not.toBe('');
        expect(['error', 'warn']).toContain(row.severity);
      }
    }

    expect(rowCount).toBe(13);
    expect([...categories].sort()).toEqual([
      'alias-hit',
      'anchor-duplicate',
      'anchor-unmatched',
      'duplicate',
      'generic-trigger',
      'malformed-or-unclosed',
      'missing',
      'naming-exception',
      'non-string-members',
      'non-yaml',
      'oversized',
      'wrong-list-type',
    ]);
  });

  it('stages every category at its decided severity', () => {
    const fixtures = [
      ...VARIANT_EXPECTATIONS.map(([fixture]) => fixture),
      ...CROSS_CUTTING_EXPECTATIONS.map(([fixture]) => fixture),
    ];
    const observed = new Map<string, string>();

    for (const fixture of fixtures) {
      for (const row of runRule(fixture).diagnostics) {
        observed.set(row.category, row.severity);
      }
    }

    expect(Object.fromEntries([...observed].sort())).toEqual(
      Object.fromEntries(Object.entries(EXPECTED_SEVERITY).sort()),
    );
  });

  // The rule's own status is derived from its rows, not from the registry: an
  // error row fails, warn rows alone warn. The orchestrator never escalates a
  // warn status, so the report-only classes cannot fail a packet.
  it('derives rule status from the severities of its rows', () => {
    for (const [fixture, , severity] of CROSS_CUTTING_EXPECTATIONS) {
      const result = runRule(fixture);
      expect(severity).toBe('warn');
      expect(result.status, `${fixture} should warn, not fail`).toBe('warn');
    }

    for (const [fixture, category] of VARIANT_EXPECTATIONS) {
      if (category === null) continue;
      expect(runRule(fixture).status, `${fixture} should fail`).toBe('fail');
    }
  });

  it('reports zero rows on the conforming fixture', () => {
    const result = runRule('conforming');
    expect(result.diagnostics).toEqual([]);
    expect(result.status).toBe('pass');
    expect(result.message).toContain('conform');
  });
});
