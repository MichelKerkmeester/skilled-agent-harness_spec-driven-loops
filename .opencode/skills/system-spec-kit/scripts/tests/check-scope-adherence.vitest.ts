// Behavioral coverage for the advisory SCOPE_ADHERENCE rule: it must no-op without a
// change-set, warn only on genuinely out-of-scope paths, and always treat a packet's own
// canonical docs as in-scope (the false-positive the rule was hardened against).
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const RULE = path.resolve(__dirname, '../rules/check-scope-adherence.sh');

let fixtureDir: string;
let harness: string;

beforeAll(() => {
  fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scope-adherence-'));
  fs.writeFileSync(
    path.join(fixtureDir, 'spec.md'),
    '# Spec\n## Files to Change\n- `.opencode/skills/foo/`\n',
  );
  // Harness sources the rule and prints the rule outputs for assertion.
  harness = path.join(fixtureDir, 'harness.sh');
  fs.writeFileSync(
    harness,
    [
      '#!/usr/bin/env bash',
      'RULE_NAME=""; RULE_STATUS=""; RULE_MESSAGE=""; RULE_DETAILS=(); RULE_REMEDIATION=""',
      'source "$1"',
      'run_check "$2" "2"',
      'printf "STATUS=%s\\n" "$RULE_STATUS"',
      'printf "MESSAGE=%s\\n" "$RULE_MESSAGE"',
      'printf "VIOLATIONS=%s\\n" "${RULE_DETAILS[*]:-}"',
      '',
    ].join('\n'),
  );
});

afterAll(() => {
  fs.rmSync(fixtureDir, { recursive: true, force: true });
});

function run(env: Record<string, string>): { status: string; message: string; violations: string } {
  const out = execFileSync('bash', [harness, RULE, fixtureDir], {
    env: { ...process.env, ...env },
    encoding: 'utf8',
  });
  return {
    status: /STATUS=(\w*)/.exec(out)?.[1] ?? '',
    message: /MESSAGE=(.*)/.exec(out)?.[1]?.trim() ?? '',
    violations: /VIOLATIONS=(.*)/.exec(out)?.[1]?.trim() ?? '',
  };
}

describe('SCOPE_ADHERENCE rule', () => {
  it('is a no-op when no change-set is supplied', () => {
    const r = run({ MK_SCOPE_CHANGED_FILES: '', MK_SCOPE_BASE: '' });
    expect(r.status).toBe('pass');
    expect(r.message).toMatch(/not active/i);
  });

  it('warns on only the genuinely out-of-scope file, not packet docs or declared paths', () => {
    const r = run({
      MK_SCOPE_CHANGED_FILES:
        'specs/x/spec.md .opencode/skills/foo/bar.ts some/other/out-of-scope.ts',
    });
    expect(r.status).toBe('warn');
    expect(r.violations).toBe('some/other/out-of-scope.ts');
  });

  it('passes when the change-set is only canonical packet docs plus declared paths', () => {
    const r = run({
      MK_SCOPE_CHANGED_FILES: 'specs/x/spec.md specs/x/plan.md .opencode/skills/foo/bar.ts',
    });
    expect(r.status).toBe('pass');
    expect(r.violations).toBe('');
  });
});
