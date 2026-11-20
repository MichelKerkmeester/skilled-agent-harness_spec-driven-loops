// ───────────────────────────────────────────────────────────────────
// MODULE: Fan-Out Lineage Config Block Tests
// ───────────────────────────────────────────────────────────────────
//
// Each lineage's model writes its own config, and runtimes have filled the lineage block
// differently (one chained to the root session, one claiming a first generation with no
// parent). The runner owns that block once the lineage process ends, from the root config.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
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
  // The text of the --review-scope-file input, or undefined to omit the flag.
  scopeFileText?: string;
  // Repo-relative files to create in the hermetic checkout before the run.
  repoFiles?: string[];
  // The reviewScopeFiles value the model writes, when it differs from the default config.
  modelScopeFiles?: unknown;
  // Further fields the model writes into its config.
  modelConfigExtra?: Record<string, unknown>;
  // A config an earlier, unfinished run left in the lineage folder.
  priorLineageConfig?: Record<string, unknown>;
};

type RunResult = {
  configPath: string;
  lineageDir: string;
  baseDir: string;
  exitCode: number | null;
  // The runner reports an input refusal as one JSON line on stdout.
  stdout: string;
};

async function runLineage(
  testId: string,
  rootConfig: Record<string, unknown> | null,
  options: RunOptions = {},
): Promise<string> {
  return (await runLineageDetailed(testId, rootConfig, options)).configPath;
}

async function runLineageDetailed(
  testId: string,
  rootConfig: Record<string, unknown> | null,
  { loopType = 'research', stubExitCode = 0, scopeFileText, repoFiles = [], modelScopeFiles, modelConfigExtra = {}, priorLineageConfig }: RunOptions = {},
): Promise<RunResult> {
  const hermetic = createHermeticEnv(testId);
  hermeticEnvs.push(hermetic);
  const binDir = join(hermetic.tmpDir, 'bin');
  mkdirSync(binDir, { recursive: true });
  const configName = loopType === 'review' ? 'deep-review-config.json' : 'deep-research-config.json';
  const baseModelConfig = loopType === 'review' ? MODEL_WRITTEN_REVIEW_CONFIG : MODEL_WRITTEN_CONFIG;
  const modelConfig = {
    ...baseModelConfig,
    ...(modelScopeFiles === undefined ? {} : { reviewScopeFiles: modelScopeFiles }),
    ...modelConfigExtra,
  };
  for (const file of repoFiles) {
    mkdirSync(join(hermetic.tmpDir, file, '..'), { recursive: true });
    writeFileSync(join(hermetic.tmpDir, file), 'x\n');
  }
  writeFileSync(
    join(binDir, 'opencode'),
    [
      '#!/bin/sh',
      OPENCODE_VERSION_PROBE,
      'lineage_dir=$(dirname "$SPECKIT_OPENCODE_STATE_DIR")',
      'mkdir -p "$lineage_dir"',
      // Record what the lineage could read while it ran: the bound scope list and its prompt.
      '[ -f "$lineage_dir/review-scope-files.txt" ] && cp "$lineage_dir/review-scope-files.txt" "$lineage_dir/scope-seen-during-run.txt"',
      `[ -f "$lineage_dir/${configName}" ] && cp "$lineage_dir/${configName}" "$lineage_dir/config-seen-during-run.json"`,
      'printf \'%s\\n\' "$@" > "$lineage_dir/argv-seen.txt"',
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
  if (priorLineageConfig) {
    mkdirSync(join(baseDir, 'lineages', 'solo'), { recursive: true });
    writeFileSync(join(baseDir, 'lineages', 'solo', configName), `${JSON.stringify(priorLineageConfig, null, 2)}\n`);
  }
  const fanoutConfig = JSON.stringify({
    executors: [{ label: 'solo', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1 }],
    concurrency: 1,
    maxRetries: 0,
  });
  const scopeArgs: string[] = [];
  if (scopeFileText !== undefined) {
    const scopeFilePath = join(hermetic.tmpDir, 'review-scope-input.txt');
    writeFileSync(scopeFilePath, scopeFileText);
    scopeArgs.push('--review-scope-file', scopeFilePath);
  }
  const child = spawn(
    process.execPath,
    [
      fanoutRunScript,
      '--spec-folder', SPEC_FOLDER,
      '--loop-type', loopType,
      '--fanout-config-json', fanoutConfig,
      '--base-artifact-dir', baseDir,
      '--only-lineage', 'solo',
      ...scopeArgs,
    ],
    {
      cwd: hermetic.tmpDir,
      env: { ...hermetic.env, PATH: `${binDir}:${hermetic.env['PATH'] ?? ''}` },
      stdio: ['ignore', 'pipe', 'ignore'],
    },
  );
  let stdout = '';
  child.stdout?.on('data', (chunk) => { stdout += String(chunk); });
  const exitCode = await new Promise<number | null>((resolvePromise) => child.on('close', resolvePromise));
  const lineageDir = join(baseDir, 'lineages', 'solo');
  return { configPath: join(lineageDir, configName), lineageDir, baseDir, exitCode, stdout };
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

const ROOT_REVIEW_CONFIG = {
  mode: 'review',
  sessionId: 'root-review-session',
  parentSessionId: null,
  lineageMode: 'new',
  generation: 1,
};

describe('fanout-run.cjs — review scope seed', () => {
  const scopeFiles = ['src/app.ts', 'tests/app.test.ts'];

  it('binds the seeded scope while the lineage runs and records it in the lineage config', async () => {
    const run = await runLineageDetailed('fanout-review-scope-seed', ROOT_REVIEW_CONFIG, {
      loopType: 'review',
      repoFiles: scopeFiles,
      scopeFileText: ['# discovered scope', '', 'src/app.ts', './tests/app.test.ts', ''].join('\n'),
      modelScopeFiles: [],
    });

    expect(run.exitCode).toBe(0);
    expect(JSON.parse(readFileSync(run.configPath, 'utf8')).reviewScopeFiles).toEqual(scopeFiles);
    expect(readFileSync(join(run.lineageDir, 'scope-seen-during-run.txt'), 'utf8')).toBe(`${scopeFiles.join('\n')}\n`);
    expect(readFileSync(join(run.lineageDir, 'argv-seen.txt'), 'utf8')).toContain('review_scope_file: ');
  }, 60_000);

  it('keeps the list a commit-range target recorded from git', async () => {
    const run = await runLineageDetailed('fanout-review-scope-keep', ROOT_REVIEW_CONFIG, {
      loopType: 'review',
      repoFiles: scopeFiles,
      scopeFileText: scopeFiles.join('\n'),
      modelConfigExtra: { reviewTargetType: 'files', reviewTarget: 'main..HEAD', reviewScopeFiles: ['lib/from-git.ts'] },
    });

    expect(JSON.parse(readFileSync(run.configPath, 'utf8')).reviewScopeFiles).toEqual(['lib/from-git.ts']);
  }, 60_000);

  it('replaces a narrower list a spec-folder lineage discovered on its own', async () => {
    const run = await runLineageDetailed('fanout-review-scope-replace', ROOT_REVIEW_CONFIG, {
      loopType: 'review',
      repoFiles: scopeFiles,
      scopeFileText: scopeFiles.join('\n'),
      modelConfigExtra: { reviewTargetType: 'spec-folder', reviewScopeFiles: ['src/app.ts'] },
    });

    expect(JSON.parse(readFileSync(run.configPath, 'utf8')).reviewScopeFiles).toEqual(scopeFiles);
  }, 60_000);

  it('seeds a resumed lineage config before the lineage starts, since a resume skips discovery', async () => {
    const run = await runLineageDetailed('fanout-review-scope-resume', ROOT_REVIEW_CONFIG, {
      loopType: 'review',
      repoFiles: scopeFiles,
      scopeFileText: scopeFiles.join('\n'),
      priorLineageConfig: { ...MODEL_WRITTEN_REVIEW_CONFIG, status: 'running', reviewScopeFiles: [] },
    });

    expect(JSON.parse(readFileSync(join(run.lineageDir, 'config-seen-during-run.json'), 'utf8')).reviewScopeFiles)
      .toEqual(scopeFiles);
  }, 60_000);

  it('seeds the scope even when there is no root config to read lineage values from', async () => {
    const run = await runLineageDetailed('fanout-review-scope-no-root', null, {
      loopType: 'review',
      repoFiles: scopeFiles,
      scopeFileText: scopeFiles.join('\n'),
    });

    expect(JSON.parse(readFileSync(run.configPath, 'utf8'))).toEqual({
      ...MODEL_WRITTEN_REVIEW_CONFIG,
      reviewScopeFiles: scopeFiles,
    });
  }, 60_000);

  it('leaves the model-written config unchanged when no scope file is passed', async () => {
    const run = await runLineageDetailed('fanout-review-scope-absent', ROOT_REVIEW_CONFIG, {
      loopType: 'review',
      modelScopeFiles: [],
    });

    expect(run.exitCode).toBe(0);
    expect(JSON.parse(readFileSync(run.configPath, 'utf8')).reviewScopeFiles).toEqual([]);
    expect(existsSync(join(run.lineageDir, 'review-scope-files.txt'))).toBe(false);
    expect(readFileSync(join(run.lineageDir, 'argv-seen.txt'), 'utf8')).not.toContain('review_scope_file');
  }, 60_000);

  it('refuses invalid entries with line numbers before any lineage spawns', async () => {
    const run = await runLineageDetailed('fanout-review-scope-invalid', ROOT_REVIEW_CONFIG, {
      loopType: 'review',
      repoFiles: ['src/app.ts'],
      scopeFileText: ['src/app.ts', '/etc/passwd', '../outside.ts', 'src/missing.ts', 'src/app.ts', 'src'].join('\n'),
    });

    expect(run.exitCode).toBe(3);
    expect(run.stdout).toContain('line 2: absolute path');
    expect(run.stdout).toContain('line 3: path leaves the repository');
    expect(run.stdout).toContain('line 4: file not found');
    expect(run.stdout).toContain('line 5: duplicate of line 1');
    expect(run.stdout).toContain('line 6: not a file');
    expect(existsSync(join(run.baseDir, 'lineages'))).toBe(false);
  }, 60_000);
});
