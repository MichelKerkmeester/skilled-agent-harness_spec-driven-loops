// ───────────────────────────────────────────────────────────────────
// MODULE: Review Depth Convergence Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const testDir = dirname(fileURLToPath(import.meta.url));
const opencodeRoot = resolve(testDir, '../../../../..');

/**
 * Reads the deep-review workflow YAML fixture from the commands directory.
 */
function readWorkflow(): string {
  return readFileSync(
    resolve(opencodeRoot, 'commands/deep/assets/deep-review.yaml'),
    'utf8',
  );
}

describe('review-depth convergence v2 fixtures', () => {
  it('blocks graphless standard-scope STOP when fallback ledger rows are missing', () => {
    const workflow = readWorkflow();
    expect(workflow).toContain('candidateCoverageGate');
    expect(workflow).toContain('graphlessFallbackGate');
    expect(workflow).toContain('"gateResults":{gate_results_array_json}');
    expect(workflow).toMatch(/gate_results_array_json: "One \{gateId,status,reasonCode,evidenceDigest\} row per legal-stop gate \([^)]*graphlessFallbackGate[^)]*\)/);
  });
});
