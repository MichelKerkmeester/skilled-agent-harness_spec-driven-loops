import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { createHermeticEnv, type HermeticEnv } from '../helpers/spawn-cjs';

const nodeRequire = createRequire(import.meta.url);
const {
  reduceResearchState,
} = nodeRequire('../../../deep-loop-workflows/deep-research/scripts/reduce-state.cjs') as {
  reduceResearchState: (specFolder: string, options?: {
    write?: boolean;
    lenient?: boolean;
    emitResourceMap?: boolean;
    requireExistingState?: boolean;
  }) => {
    registry: { status?: string };
    dashboard: string;
    hasCorruption: boolean;
  };
};

const hermeticEnvs: HermeticEnv[] = [];

function makeTempSpec(): string {
  const env = createHermeticEnv('deep-research-reducer');
  hermeticEnvs.push(env);
  const specFolder = join(env.tmpDir, 'spec');
  mkdirSync(join(specFolder, 'research'), { recursive: true });
  writeFileSync(join(specFolder, 'spec.md'), '# Test Packet\n', 'utf8');
  writeFileSync(
    join(specFolder, 'research', 'deep-research-config.json'),
    `${JSON.stringify({
      topic: 'Reducer recovery test',
      createdAt: '2026-06-19T00:00:00.000Z',
      status: 'initialized',
      maxIterations: 3,
      resource_map: { emit: false },
    }, null, 2)}\n`,
    'utf8',
  );
  writeFileSync(join(specFolder, 'research', 'deep-research-strategy.md'), strategyTemplate(), 'utf8');
  return specFolder;
}

function strategyTemplate(): string {
  return [
    '# Deep Research Strategy',
    '',
    '<!-- ANCHOR:key-questions -->',
    '## 3. KEY QUESTIONS (remaining)',
    '- [ ] What should be checked?',
    '<!-- /ANCHOR:key-questions -->',
    '',
    '<!-- ANCHOR:answered-questions -->',
    '## 6. ANSWERED QUESTIONS',
    '[None yet]',
    '<!-- /ANCHOR:answered-questions -->',
    '',
    '<!-- ANCHOR:what-worked -->',
    '## 7. WHAT WORKED',
    '[None yet]',
    '<!-- /ANCHOR:what-worked -->',
    '',
    '<!-- ANCHOR:what-failed -->',
    '## 8. WHAT FAILED',
    '[None yet]',
    '<!-- /ANCHOR:what-failed -->',
    '',
    '<!-- ANCHOR:exhausted-approaches -->',
    '## 9. EXHAUSTED APPROACHES (do not retry)',
    '[None yet]',
    '<!-- /ANCHOR:exhausted-approaches -->',
    '',
    '<!-- ANCHOR:ruled-out-directions -->',
    '## 10. RULED OUT DIRECTIONS',
    '[None yet]',
    '<!-- /ANCHOR:ruled-out-directions -->',
    '',
    '<!-- ANCHOR:carried-forward-open-questions -->',
    '## 11A. CARRIED-FORWARD OPEN QUESTIONS',
    '[None yet]',
    '<!-- /ANCHOR:carried-forward-open-questions -->',
    '',
    '<!-- ANCHOR:next-focus -->',
    '## 11. NEXT FOCUS',
    '[None yet]',
    '<!-- /ANCHOR:next-focus -->',
    '',
  ].join('\n');
}

function writeState(specFolder: string, content: string): void {
  writeFileSync(join(specFolder, 'research', 'deep-research-state.jsonl'), content, 'utf8');
}

function expectRecoveryRefusal(action: () => void, reason: string): void {
  try {
    action();
    throw new Error('Expected recovery refusal');
  } catch (error: unknown) {
    expect(error).toBeInstanceOf(Error);
    expect((error as { code?: string }).code).toBe('STATE_RECOVERY_REFUSED');
    expect((error as { reason?: string }).reason).toBe(reason);
  }
}

afterEach(() => {
  while (hermeticEnvs.length > 0) {
    const env = hermeticEnvs.pop();
    if (env) {
      env.cleanup();
    }
  }
});

describe('deep-research reduce-state recovery gate', () => {
  it('refuses a missing expected state log in validate-existing-state mode', () => {
    const specFolder = makeTempSpec();

    expectRecoveryRefusal(
      () => reduceResearchState(specFolder, { write: false, requireExistingState: true }),
      'missing state log',
    );
  });

  it('refuses an empty expected state log in validate-existing-state mode', () => {
    const specFolder = makeTempSpec();
    writeState(specFolder, '');

    expectRecoveryRefusal(
      () => reduceResearchState(specFolder, { write: false, requireExistingState: true }),
      'empty state log',
    );
  });

  it('refuses a corrupt expected state log in validate-existing-state mode', () => {
    const specFolder = makeTempSpec();
    writeState(specFolder, '{"type":"iteration","run":1}\nnot-json\n');

    expectRecoveryRefusal(
      () => reduceResearchState(specFolder, { write: false, requireExistingState: true }),
      'corrupt state log',
    );
  });

  it('leaves the legitimate fresh reducer path unchanged when validation is not requested', () => {
    const specFolder = makeTempSpec();
    writeState(specFolder, '');

    const result = reduceResearchState(specFolder, { write: false });

    expect(result.hasCorruption).toBe(false);
    expect(result.registry.status).toBe('INITIALIZED');
  });

  it('renders log region fields when iteration records carry byte metadata', () => {
    const specFolder = makeTempSpec();
    writeState(specFolder, `${JSON.stringify({
      type: 'iteration',
      run: 1,
      status: 'complete',
      focus: 'offset metadata',
      findingsCount: 1,
      newInfoRatio: 0.4,
      logOffset: 34,
      logSize: 211,
      logPath: '/tmp/research/deep-research-state.jsonl',
    })}\n`);

    const result = reduceResearchState(specFolder, { write: false });

    expect(result.dashboard).toContain('| # | Focus | Track | Ratio | Findings | Status | Log Offset | Log Size | Log Path |');
    expect(result.dashboard).toContain('| 1 | offset metadata | - | 0.40 | 1 | complete | 34 | 211 | /tmp/research/deep-research-state.jsonl |');
  });
});
