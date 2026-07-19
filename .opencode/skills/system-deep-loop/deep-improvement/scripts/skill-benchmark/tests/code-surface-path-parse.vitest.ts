import { describe, it, expect } from 'vitest';
import { resolve, join } from 'node:path';

// Guard: the scenario loader must parse code-<surface>/ packet paths WHOLE.
//
// Post two-axis split (and the animation fold into code-webflow), playbook gold
// names resources like code-webflow/references/x.md and
// code-webflow/references/animation/y.md. A code-*-blind extractor (one that only
// knows references/, assets/, ../shared/) silently strips the packet prefix —
// code-webflow/references/animation/decision-matrix.md parses as
// references/animation/decision-matrix.md — which breaks gold<->router matching
// for every surface scenario without failing anything loudly. This locks the
// extractor's code-* awareness so a future packet-folder change can't regress it.

const HARNESS = resolve(__dirname, '..');
const { extractPaths, extractForbiddenPrefixes } = require(join(HARNESS, 'load-playbook-scenarios.cjs'));

describe('scenario loader parses code-<surface>/ packet paths whole', () => {
  it('extractPaths keeps the full code-<surface>/ prefix and never strips to references/', () => {
    const got = extractPaths(
      '- `code-webflow/references/animation/decision-matrix.md`\n'
      + '- `code-webflow/references/implementation/animation_workflows.md`\n'
      + '- `code-opencode/references/shared/universal_patterns.md`\n'
      + '- `references/universal/code-quality-standards.md`',
    );
    expect(got).toContain('code-webflow/references/animation/decision-matrix.md');
    expect(got).toContain('code-webflow/references/implementation/animation_workflows.md');
    expect(got).toContain('code-opencode/references/shared/universal_patterns.md');
    expect(got).toContain('references/universal/code-quality-standards.md');
    // the regression this guards against: a packet path collapsed to references/
    expect(got).not.toContain('references/animation/decision-matrix.md');
  });

  it('extractForbiddenPrefixes captures a code-<surface>/ forbidden glob prefix', () => {
    const got = extractForbiddenPrefixes('**Expected NOT loaded**: `code-opencode/references/*`, `code-webflow/assets/*`');
    expect(got).toContain('code-opencode/references/');
    expect(got).toContain('code-webflow/assets/');
  });
});
