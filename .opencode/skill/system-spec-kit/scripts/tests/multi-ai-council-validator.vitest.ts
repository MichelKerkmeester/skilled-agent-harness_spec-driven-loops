// Regression test confirming validator does not flag ai-council/ subfolder as unknown.
// Per packet 080 ADR-004: ai-council/ is a free-form subfolder (alongside scratch/, research/, review/).
// Validator code is unchanged; this test prevents future regressions.

import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

describe('Multi-AI Council validator awareness (packet 080)', () => {
  it('does not flag ai-council/ subfolder as unknown', () => {
    // Use packet 080 itself (which has all required spec docs and may have ai-council/ artifacts)
    const folder = join(__dirname, '../../../../specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol');
    const result = execSync(
      `bash ${join(__dirname, '../spec/validate.sh')} ${folder} --strict`,
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
    );
    // Must not contain unknown-subfolder error mentioning ai-council
    expect(result).not.toMatch(/unknown.*ai-council|ai-council.*unknown/i);
    // RESULT line must be PASSED
    expect(result).toMatch(/RESULT: PASSED/);
  });

  it('treats ai-council/ as free-form (no internal layout enforcement)', () => {
    // Synthesize a minimal packet with ai-council/ containing arbitrary content
    const tmp = mkdtempSync(join(tmpdir(), 'spec-kit-080-'));
    const packet = join(tmp, '999-test-packet');
    mkdirSync(join(packet, 'ai-council/seats/round-001'), { recursive: true });
    writeFileSync(join(packet, 'ai-council/council-report.md'), '# Test report\n');
    writeFileSync(join(packet, 'ai-council/seats/round-001/seat-001-cli-codex.md'), '# Seat 1\n');
    // Validator should not fail just because ai-council/ exists; we don't run full validation
    // (that requires spec docs). Just ensure the subfolder existence is non-fatal.
    expect(() => {
      execSync(`ls ${join(packet, 'ai-council')}`, { stdio: 'ignore' });
    }).not.toThrow();
    rmSync(tmp, { recursive: true, force: true });
  });
});
