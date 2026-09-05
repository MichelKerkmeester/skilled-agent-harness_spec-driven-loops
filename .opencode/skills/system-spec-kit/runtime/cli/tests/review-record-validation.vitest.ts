// ───────────────────────────────────────────────────────────────
// TEST: Review-Record Packet Validation
// ───────────────────────────────────────────────────────────────
// Verifies the additive, marker-gated review-record packet type: a lean folder
// of spec.md plus review/review-report.md validates clean, and dropping the
// report makes FILE_EXISTS fail. The review path is reachable only through the
// explicit SPECKIT_LEVEL: review marker, so no existing numbered level is touched.

import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

import { getContractDocs, resolveTemplatePath } from '../utils/template-structure.js';

const SCRIPTS_DIR = path.resolve(__dirname, '..');
const VALIDATE_SCRIPT = path.join(SCRIPTS_DIR, 'spec', 'validate.sh');
const FIXTURES_DIR = path.join(SCRIPTS_DIR, 'tests', 'test-fixtures');
const VALID_REVIEW_FIXTURE = path.join(FIXTURES_DIR, '068-review-record-valid');
const MISSING_REPORT_FIXTURE = path.join(FIXTURES_DIR, '069-review-record-missing-report');

function runValidate(
  folderPath: string,
  flags: string[] = [],
): { stdout: string; exitCode: number } {
  const result = spawnSync('bash', [VALIDATE_SCRIPT, folderPath, ...flags], {
    encoding: 'utf8',
    timeout: 60_000,
  });
  return {
    stdout: result.stdout ?? '',
    exitCode: result.status ?? 2,
  };
}

describe('review-record packet type', () => {
  it('resolves the review level to only spec.md and review/review-report.md', () => {
    expect(getContractDocs('review')).toEqual(['spec.md', 'review/review-report.md']);
  });

  it('routes the review spec.md to the lean review template', () => {
    expect(resolveTemplatePath('review', 'spec.md')).toMatch(
      /templates\/manifest\/review\.spec\.md\.tmpl$/,
    );
    // The review report is freeform: it has no backing template.
    expect(resolveTemplatePath('review', 'review/review-report.md')).toBeNull();
  });

  it('validates a lean review-record folder at exit 0', () => {
    const result = runValidate(VALID_REVIEW_FIXTURE);
    expect(result.stdout).toContain('Level:  review');
    expect(result.stdout).toContain('FILE_EXISTS');
    expect(result.exitCode).toBe(0);
  });

  it('fails a review-record folder that is missing review/review-report.md', () => {
    const result = runValidate(MISSING_REPORT_FIXTURE);
    expect(result.stdout).toContain('Level:  review');
    expect(result.stdout).toMatch(/Missing 1 required file\(s\) for Level review/);
    expect(result.exitCode).toBe(2);
  });
});
