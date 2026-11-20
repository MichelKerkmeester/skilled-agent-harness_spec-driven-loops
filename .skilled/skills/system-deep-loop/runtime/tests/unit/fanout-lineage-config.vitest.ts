// ───────────────────────────────────────────────────────────────────
// MODULE: Fan-Out Lineage Config Block Tests
// ───────────────────────────────────────────────────────────────────
//
// Each lineage's model writes its own config, and runtimes have filled the lineage block
// differently (one chained to the root session, one claiming a first generation with no
// parent). The runner owns that block once the lineage process ends, from the root config.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

import { afterEach, describe, expect, it } from 'vitest';

import { createHermeticEnv, runtimeRoot, type HermeticEnv } from '../helpers/spawn-cjs';

const fanoutRunScript = join(runtimeRoot, 'scripts', 'fanout-run.cjs');
const completedLineageStateHelper = join(runtimeRoot, 'tests', 'helpers', 'completed-lineage-state.cjs');
const OPENCODE_VERSION_PROBE = 'if [ "$1" = "--version" ]; then echo 2.3.2; exit 0; fi';
const SPEC_FOLDER = 'specs/test-fanout-lineage-config';

const hermeticEnvs: HermeticEnv[] = [];

afterEach(() => {
  while (hermeticEnvs.length > 0) hermeticEnvs.pop()?.cleanup();
});

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, "'\\''")}'`;
}

// What a model that ignored the root wrote: a first generation with no parent.
const MODEL_WRITTEN_CONFIG = {
  topic: 'q',
  maxIterations: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
  status: 'complete',
  lineage: {
    sessionId: 'lineage-session',
    parentSessionId: null,
    lineageMode: 'new',
    allowedModes: ['new', 'resume', 'restart', 'completed-continue'],
    generation: 1,
    continuedFromRun: null,
  },
};

// The review config keeps the same fields flat, beside the rest of the config.
const MODEL_WRITTEN_REVIEW_CONFIG = {
  mode: 'review',
  sessionId: 'lineage-session',
  parentSessionId: null,
  lineageMode: 'new',
  generation: 1,
  status: 'complete',
};

type RunOptions = {
  loopType?: 'research' | 'review';
  stubExitCode?: number;
};

async function runLineage(
  testId: string,
  rootConfig: Record<string, unknown> | null,
  { loopType = 'research', stubExitCode = 0 }: RunOptions = {},
): Promise<string> {
  const hermetic = createHermeticEnv(testId);
  hermeticEnvs.push(hermetic);
  const binDir = join(hermetic.tmpDir, 'bin');
  mkdirSync(binDir, { recursive: true });
  const configName = loopType === 'review' ? 'deep-review-config.json' : 'deep-research-config.json';
  const modelConfig = loopType === 'review' ? MODEL_WRITTEN_REVIEW_CONFIG : MODEL_WRITTEN_CONFIG;
  writeFileSync(
    join(binDir, 'opencode'),
    [
      '#!/bin/sh',
      OPENCODE_VERSION_PROBE,
      'lineage_dir=$(dirname "$SPECKIT_OPENCODE_STATE_DIR")',
      'mkdir -p "$lineage_dir"',
      `printf '%s\\n' ${shellQuote(JSON.stringify(modelConfig))} > "$lineage_dir/${configName}"`,
      'printf "ok\\n" > "$lineage_dir/research.md"',
      'printf "ok\\n" > "$lineage_dir/review-report.md"',
      `${shellQuote(process.execPath)} ${shellQuote(completedLineageStateHelper)} "$lineage_dir" ${loopType}`,
      'echo done',
      `exit ${stubExitCode}`,
      '',
    ].join('\n'),
    { mode: 0o755 },
  );
  const baseDir = join(hermetic.tmpDir, SPEC_FOLDER, loopType);
  mkdirSync(baseDir, { recursive: true });
  if (rootConfig) writeFileSync(join(baseDir, configName), `${JSON.stringify(rootConfig, null, 2)}\n`);
  const fanoutConfig = JSON.stringify({
    executors: [{ label: 'solo', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1 }],
    concurrency: 1,
    maxRetries: 0,
  });
  const child = spawn(
    process.execPath,
    [
      fanoutRunScript,
      '--spec-folder', SPEC_FOLDER,
      '--loop-type', loopType,
      '--fanout-config-json', fanoutConfig,
      '--base-artifact-dir', baseDir,
      '--only-lineage', 'solo',
    ],
    {
      cwd: hermetic.tmpDir,
      env: { ...hermetic.env, PATH: `${binDir}:${hermetic.env['PATH'] ?? ''}` },
      stdio: ['ignore', 'ignore', 'ignore'],
    },
  );
  await new Promise((resolvePromise) => child.on('close', resolvePromise));
  return join(baseDir, 'lineages', 'solo', configName);
}

describe('fanout-run.cjs — lineage config block', () => {
  it('writes generation, parent session and lineage mode from the root config', async () => {
    const configPath = await runLineage('fanout-lineage-block-root', {
      lineage: {
        sessionId: 'root-session',
        parentSessionId: 'previous-generation-session',
        lineageMode: 'restart',
        generation: 4,
        continuedFromRun: null,
      },
    });

    const config = JSON.parse(readFileSync(configPath, 'utf8')) as typeof MODEL_WRITTEN_CONFIG;
    expect(config.lineage).toEqual({
      ...MODEL_WRITTEN_CONFIG.lineage,
      parentSessionId: 'root-session',
      lineageMode: 'new',
      generation: 4,
    });
    expect({ ...config, lineage: null }).toEqual({ ...MODEL_WRITTEN_CONFIG, lineage: null });
  }, 60_000);

  it('writes the block for a lineage that exits non-zero, which a retry resumes from', async () => {
    const configPath = await runLineage('fanout-lineage-block-failed', {
      lineage: { sessionId: 'root-session', generation: 2 },
    }, { stubExitCode: 1 });

    expect(JSON.parse(readFileSync(configPath, 'utf8')).lineage).toMatchObject({
      sessionId: 'lineage-session',
      parentSessionId: 'root-session',
      generation: 2,
    });
  }, 60_000);

  it('writes the flat lineage fields of a review config from the root review config', async () => {
    const configPath = await runLineage('fanout-lineage-block-review', {
      mode: 'review',
      sessionId: 'root-review-session',
      parentSessionId: null,
      lineageMode: 'restart',
      generation: 3,
    }, { loopType: 'review' });

    expect(JSON.parse(readFileSync(configPath, 'utf8'))).toEqual({
      ...MODEL_WRITTEN_REVIEW_CONFIG,
      parentSessionId: 'root-review-session',
      lineageMode: 'new',
      generation: 3,
    });
  }, 60_000);

  // A guard rather than a fail-first case: it holds before and after, and pins that a run
  // whose root config is missing invents no lineage values.
  it('leaves the model-written block alone when there is no root config to read', async () => {
    const configPath = await runLineage('fanout-lineage-block-no-root', null);

    expect(JSON.parse(readFileSync(configPath, 'utf8'))).toEqual(MODEL_WRITTEN_CONFIG);
  }, 60_000);
});
