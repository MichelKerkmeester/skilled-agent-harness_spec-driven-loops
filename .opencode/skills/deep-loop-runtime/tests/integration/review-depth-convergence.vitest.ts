import { describe, expect, it } from 'vitest';

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const testDir = dirname(fileURLToPath(import.meta.url));
const opencodeRoot = resolve(testDir, '../../../..');

/**
 * Reads a deep-review workflow YAML fixture from the commands directory.
 */
function readWorkflow(name: 'auto' | 'confirm'): string {
  return readFileSync(
    resolve(opencodeRoot, `commands/deep/assets/deep_start-review-loop_${name}.yaml`),
    'utf8',
  );
}

describe('review-depth convergence v2 fixtures', () => {
  it('blocks graphless standard-scope STOP when fallback ledger rows are missing', () => {
    for (const workflow of [readWorkflow('auto'), readWorkflow('confirm')]) {
      expect(workflow).toContain('candidateCoverageGate');
      expect(workflow).toContain('graphlessFallbackGate');
      expect(workflow).toContain('at least one `searchLedger` row exists for each entry');
      expect(workflow).toContain('Fail automatically when graphCoverageMode is `unavailable_blocked`');
      expect(workflow).toContain('"graphlessFallbackGate":{"pass":{graphless_fallback_gate_pass}');
    }
  });
});
