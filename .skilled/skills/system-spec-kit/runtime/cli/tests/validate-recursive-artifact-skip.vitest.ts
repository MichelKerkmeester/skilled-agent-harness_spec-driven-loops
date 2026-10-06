// ───────────────────────────────────────────────────────────────────
// MODULE: Validate Recursive Artifact Skip
// ───────────────────────────────────────────────────────────────────
// Recursive validation must not skip a numbered child that still holds a packet
// document. A phase child that lost spec.md but kept plan.md used to vanish
// from the parent's verdict, so the parent reported PASSED while a numbered
// child was invalid. Artifact-only children (a lone review/ or research/ tree)
// stay skipped, the skip is named on stderr, and JSON stdout stays parseable.

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const cliRoot = path.resolve(testDir, '..');
const validateScript = path.join(cliRoot, 'spec', 'validate.sh');
const fixtureRoot = path.join(testDir, 'fixtures', 'recursive-artifact-skip');
const fixtureParent = path.join(fixtureRoot, 'parent');

interface RunResult {
  status: number | null;
  stdout: string;
  stderr: string;
}

// Every run starts from a clean slate: no switch inherited from the shell, and
// HOOK_FLAGS_CONFIG pointed away from the operator's own hook-flags.env.
function runValidate(extraArgs: string[] = [], extraEnv: Record<string, string> = {}): RunResult {
  const env: NodeJS.ProcessEnv = { ...process.env };
  for (const key of ['SPECKIT_SKIP_VALIDATION', 'SPECKIT_VALIDATION', 'SPECKIT_JSON', 'SPECKIT_QUIET', 'SPECKIT_RULES']) {
    delete env[key];
  }
  Object.assign(
    env,
    {
      HOOK_FLAGS_CONFIG: path.join(fixtureRoot, 'absent-hook-flags.env'),
      SPECKIT_RULES: 'FILE_EXISTS',
    },
    extraEnv,
  );
  const result = spawnSync('bash', [validateScript, fixtureParent, '--recursive', ...extraArgs], {
    encoding: 'utf8',
    env,
  });
  return { status: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

// JSON mode emits one report object per validated folder, one line each.
function parseReports(stdout: string): Array<Record<string, unknown>> {
  return stdout
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => JSON.parse(line) as Record<string, unknown>);
}

function validatedFolderNames(stdout: string): string[] {
  return parseReports(stdout).map((report) => path.basename(String(report.folder)));
}

describe('recursive validation artifact skip', () => {
  it('validates a numbered child that kept plan.md but lost spec.md, instead of skipping it', () => {
    const { status, stdout } = runValidate(['--json']);
    const validated = validatedFolderNames(stdout);
    expect(validated).toContain('002-lost-docs');
    expect(status).toBe(2);

    const lostDocs = parseReports(stdout).find((report) => path.basename(String(report.folder)) === '002-lost-docs');
    expect(lostDocs?.passed).toBe(false);
  });

  it('keeps an artifact-only child skipped and reports the skip on stderr, never on JSON stdout', () => {
    const { stdout, stderr } = runValidate(['--json']);
    expect(validatedFolderNames(stdout)).not.toContain('003-review-only');
    expect(stderr).toContain('003-review-only');
    expect(stderr).toContain('no packet docs');
    expect(stderr).toContain('holds: review');
    expect(stdout).not.toContain('Skipped');
  });

  it('suppresses the skip notice under --quiet while still validating the lost-docs child', () => {
    const { stdout, stderr } = runValidate(['--json', '--quiet']);
    expect(stderr).not.toContain('Skipped');
    expect(validatedFolderNames(stdout)).toContain('002-lost-docs');
  });
});
