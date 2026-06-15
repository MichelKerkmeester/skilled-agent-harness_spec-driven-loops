import { describe, expect, it } from 'vitest';

import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const nodeRequire = createRequire(import.meta.url);

const CONVERGENCE_CLI = resolve(here, '..', '..', 'scripts', 'convergence.cjs');
const LOOP_HOST = '../../../deep-loop-workflows/improvement/scripts/shared/loop-host.cjs';

describe('improvement stays host-driven, never a runtime convergence loopType', () => {
  it('convergence.cjs rejects loopType=improvement with the existing validation message', () => {
    const result = spawnSync(
      process.execPath,
      [CONVERGENCE_CLI, '--spec-folder', 'specs/118-improvement-probe', '--loop-type', 'improvement', '--session-id', 'sess-improvement-probe'],
      { encoding: 'utf8' },
    );
    expect(result.status).toBe(3);
    const json = JSON.parse((result.stdout ?? '').trim().split(/\r?\n/).filter(Boolean).at(-1) ?? '{}');
    expect(json).toMatchObject({ status: 'error', code: 'INPUT_VALIDATION' });
    expect(json.error).toBe('loopType must be "research", "review", "council", or "context"');
  });

  it('convergence.cjs source validates exactly four loopTypes and names no improvement loopType', () => {
    const source = readFileSync(CONVERGENCE_CLI, 'utf8');
    expect(source).toContain(
      `if (loopType !== 'research' && loopType !== 'review' && loopType !== 'council' && loopType !== 'context')`,
    );
    expect(source).not.toContain(`loopType === 'improvement'`);
    expect(source).not.toContain(`loopType !== 'improvement'`);
  });

  it('loop-host keeps exactly the four improvement lanes', () => {
    const loopHost = nodeRequire(LOOP_HOST) as { VALID_MODES: Set<string> };
    expect(loopHost.VALID_MODES).toBeInstanceOf(Set);
    expect([...loopHost.VALID_MODES].sort()).toEqual([
      'agent-improvement',
      'model-benchmark',
      'non-dev-ai-system-refine',
      'skill-benchmark',
    ]);
    expect(loopHost.VALID_MODES.has('improvement')).toBe(false);
  });
});
