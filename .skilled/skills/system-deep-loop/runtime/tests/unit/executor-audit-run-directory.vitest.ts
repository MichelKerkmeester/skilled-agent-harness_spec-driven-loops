// ───────────────────────────────────────────────────────────────────
// MODULE: Executor Audit Run Directory
// ───────────────────────────────────────────────────────────────────

import { isAbsolute, join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { gatewayRunDirectory } from '../../lib/deep-loop/executor-audit.js';

// The append gateway runs from the checkout that holds this module. Reached
// through a symlinked .skilled, that is not the caller's project, so a relative
// state-log path must be fixed against the caller's directory before the spawn.
describe('the gateway run directory resolves against the caller', () => {
  it('turns a relative state-log path into an absolute directory under the caller cwd', () => {
    const directory = gatewayRunDirectory('specs/demo/research/deep-research-state.jsonl');
    expect(isAbsolute(directory)).toBe(true);
    expect(directory).toBe(join(process.cwd(), 'specs/demo/research'));
  });

  it('keeps an absolute state-log path as given', () => {
    expect(gatewayRunDirectory('/work/project/specs/demo/research/state.jsonl'))
      .toBe('/work/project/specs/demo/research');
  });
});
