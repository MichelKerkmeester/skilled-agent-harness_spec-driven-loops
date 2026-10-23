// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Dual Dispatch Unit Tests
// ───────────────────────────────────────────────────────────────────

import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

/**
 * Contract: parseOpencodeVersion(text) returns 'v1' | 'v2' | 'unknown'.
 * resolveOpencodeBinary(env, deps?) returns { command, executablePath, version: 'v1' | 'v2' };
 * unresolved or unparseable probes throw Error(code 'E_OPENCODE_UNRESOLVED'), naming both
 * opencode2 and opencode and including probe output. deps.probe(executablePath) replaces --version.
 * OPENCODE_BIN overrides PATH: bare names use env.PATH, paths are used as-is, with no fallback.
 * Otherwise opencode2 wins anywhere on PATH, and opencode is the fallback when no opencode2 exists.
 * Cache entries use realpath, size, and mtime; clearOpencodeVersionCache() empties the cache.
 * isOpencodeBinaryAvailable(env) returns true when either executable name resolves.
 */

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

type OpencodeVersion = 'v1' | 'v2' | 'unknown';
type SupportedOpencodeVersion = Exclude<OpencodeVersion, 'unknown'>;

interface OpencodeResolution {
  readonly command: string;
  readonly executablePath: string;
  readonly version: SupportedOpencodeVersion;
}

interface ResolverError extends Error {
  readonly code?: string;
}

interface ResolverDependencies {
  readonly probe?: (executablePath: string) => string;
}

interface OpencodeVersionApi {
  readonly parseOpencodeVersion: (text: string) => OpencodeVersion;
  readonly resolveOpencodeBinary: (
    env: NodeJS.ProcessEnv,
    deps?: ResolverDependencies,
  ) => OpencodeResolution;
  readonly clearOpencodeVersionCache: () => void;
}

interface VersionCorpusEntry {
  readonly output: string;
  readonly family: OpencodeVersion;
}

interface BuilderOptions {
  readonly env?: NodeJS.ProcessEnv;
  readonly loopType?: string;
  readonly directoryRoot?: string;
  readonly specFolder?: string;
  readonly lineageDir?: string;
  readonly convergenceThreshold?: number;
  readonly stopPolicy?: string;
}

interface BuiltLineageCommand {
  readonly command: string;
  readonly args: string[];
  readonly cwd?: string;
}

interface FanoutRunApi {
  readonly buildLineageCommand: (
    lineage: Record<string, unknown>,
    prompt: string,
    resolvedSandbox: string,
    resolvedPermission: string,
    options?: BuilderOptions,
  ) => BuiltLineageCommand;
  readonly isOpencodeBinaryAvailable: (env: NodeJS.ProcessEnv) => boolean;
}

// ───────────────────────────────────────────────────────────────────
// 2. TEST FIXTURES
// ───────────────────────────────────────────────────────────────────

const requireCjs = createRequire(import.meta.url);
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../../../');
const resolver = requireCjs('../../scripts/opencode-version.cjs') as OpencodeVersionApi;
const fanoutRun = requireCjs('../../scripts/fanout-run.cjs') as FanoutRunApi;

const VERSION_1_OUTPUT = '1.19.3';
const VERSION_2_OUTPUT = 'opencode v2.0.32';
const VERSION_1_PRERELEASE_OUTPUT = '1.19.3-rc.1';
const EMPTY_OUTPUT = '';
const UNPARSEABLE_OUTPUT = 'definitely not a version';
const GARBAGE_OPENCODE2_OUTPUT = 'not an OpenCode version';
const CRLF_VERSION_OUTPUT = '1.19.3\r\n';
const TRAILING_SPACE_VERSION_OUTPUT = '1.19.3 ';
const JOINED_VERSION_OUTPUT = '1.19.3 2.0.32';
const VERSION_OUTPUTS: readonly string[] = [
  VERSION_1_OUTPUT,
  VERSION_2_OUTPUT,
  VERSION_1_PRERELEASE_OUTPUT,
  EMPTY_OUTPUT,
  UNPARSEABLE_OUTPUT,
  GARBAGE_OPENCODE2_OUTPUT,
  CRLF_VERSION_OUTPUT,
  TRAILING_SPACE_VERSION_OUTPUT,
  JOINED_VERSION_OUTPUT,
];
const VERSION_CORPUS = JSON.parse(readFileSync(
  resolve(projectRoot, '.skilled/hooks/dispatch/lib/opencode-version-corpus.json'),
  'utf8',
)) as VersionCorpusEntry[];

const MODEL = 'openai/gpt-5.5';
const EFFORT = 'high';
const PROMPT = 'Run the requested lineage prompt.';
const tempDirs: string[] = [];

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function createTempDirectory(): string {
  const directory = realpathSync(mkdtempSync(join(tmpdir(), 'opencode-dual-dispatch-')));
  tempDirs.push(directory);
  return directory;
}

function shellQuote(value: string): string {
  return "'" + value.replace(/'/g, "'\\''") + "'";
}

function writeVersionStub(binDir: string, name: string, versionOutput: string): string {
  mkdirSync(binDir, { recursive: true });
  const executablePath = join(binDir, name);
  const outputCommand = versionOutput === ''
    ? ''
    : '  printf "%s\\n" ' + shellQuote(versionOutput) + '\n';
  const script = '#!/bin/sh\n'
    + 'if [ "$1" = "--version" ]; then\n'
    + outputCommand
    + '  exit 0\n'
    + 'fi\n'
    + 'exit 0\n';
  writeFileSync(executablePath, script, { mode: 0o755 });
  return executablePath;
}

function envWithPath(...directories: string[]): NodeJS.ProcessEnv {
  return { PATH: directories.join(delimiter) };
}

function thrownError(action: () => unknown): Error {
  try {
    action();
  } catch (error: unknown) {
    if (error instanceof Error) return error;
    throw new Error('Expected the operation to throw an Error.');
  }
  throw new Error('Expected the operation to throw.');
}

function expectUnresolved(action: () => unknown, probeOutput?: string): Error {
  const error = thrownError(action) as ResolverError;
  expect(error.code).toBe('E_OPENCODE_UNRESOLVED');
  expect(error.message).toMatch(/\bopencode2\b/);
  expect(error.message).toMatch(/\bopencode\b/);
  if (probeOutput !== undefined) {
    expect(error.message).toContain(probeOutput);
  }
  return error;
}

function containsEntry(directory: string, name: string): boolean {
  return readdirSync(directory, { withFileTypes: true }).some((entry) => (
    entry.name === name
    || (entry.isDirectory() && containsEntry(join(directory, entry.name), name))
  ));
}

beforeEach(() => {
  resolver.clearOpencodeVersionCache();
});

afterEach(() => {
  for (const directory of tempDirs) {
    rmSync(directory, { recursive: true, force: true });
  }
  tempDirs.length = 0;
});

describe('OpenCode version resolution', () => {
  it('P1 resolves 1.19.3 as v1', () => {
    const binDir = createTempDirectory();
    const executablePath = writeVersionStub(binDir, 'opencode', VERSION_1_OUTPUT);

    expect(resolver.parseOpencodeVersion(VERSION_1_OUTPUT)).toBe('v1');
    expect(resolver.resolveOpencodeBinary(envWithPath(binDir))).toEqual({
      command: 'opencode',
      executablePath: realpathSync(executablePath),
      version: 'v1',
    });
  });

  it('P2 resolves opencode v2.0.32 as v2', () => {
    const binDir = createTempDirectory();
    const executablePath = writeVersionStub(binDir, 'opencode2', VERSION_2_OUTPUT);

    expect(resolver.parseOpencodeVersion(VERSION_2_OUTPUT)).toBe('v2');
    expect(resolver.resolveOpencodeBinary(envWithPath(binDir))).toEqual({
      command: 'opencode2',
      executablePath: realpathSync(executablePath),
      version: 'v2',
    });
  });

  it('P3 resolves 1.19.3-rc.1 as v1', () => {
    const binDir = createTempDirectory();
    const executablePath = writeVersionStub(binDir, 'opencode', VERSION_1_PRERELEASE_OUTPUT);

    expect(resolver.parseOpencodeVersion(VERSION_1_PRERELEASE_OUTPUT)).toBe('v1');
    expect(resolver.resolveOpencodeBinary(envWithPath(binDir))).toEqual({
      command: 'opencode',
      executablePath: realpathSync(executablePath),
      version: 'v1',
    });
  });

  it('P4 refuses empty probe output', () => {
    const binDir = createTempDirectory();
    writeVersionStub(binDir, 'opencode', EMPTY_OUTPUT);

    expect(resolver.parseOpencodeVersion(EMPTY_OUTPUT)).toBe('unknown');
    expectUnresolved(() => resolver.resolveOpencodeBinary(envWithPath(binDir)));
  });

  it('P5 refuses unparseable probe output', () => {
    const binDir = createTempDirectory();
    writeVersionStub(binDir, 'opencode', UNPARSEABLE_OUTPUT);

    expect(resolver.parseOpencodeVersion(UNPARSEABLE_OUTPUT)).toBe('unknown');
    expectUnresolved(
      () => resolver.resolveOpencodeBinary(envWithPath(binDir)),
      UNPARSEABLE_OUTPUT,
    );
  });

  it('parses every entry in the shared version corpus', () => {
    expect(VERSION_CORPUS.length).toBeGreaterThanOrEqual(12);
    for (const { output, family } of VERSION_CORPUS) {
      expect(resolver.parseOpencodeVersion(output), JSON.stringify(output)).toBe(family);
    }
  });

  it('A1 finds only opencode2 and reports its parsed version', () => {
    const binDir = createTempDirectory();
    const executablePath = writeVersionStub(binDir, 'opencode2', VERSION_2_OUTPUT);
    const env = envWithPath(binDir);

    expect(resolver.resolveOpencodeBinary(env)).toEqual({
      command: 'opencode2',
      executablePath: realpathSync(executablePath),
      version: 'v2',
    });
    expect(fanoutRun.isOpencodeBinaryAvailable(env)).toBe(true);
  });

  it('A2 finds only opencode and reports its parsed version', () => {
    const binDir = createTempDirectory();
    const executablePath = writeVersionStub(binDir, 'opencode', VERSION_1_OUTPUT);

    expect(resolver.resolveOpencodeBinary(envWithPath(binDir))).toEqual({
      command: 'opencode',
      executablePath: realpathSync(executablePath),
      version: 'v1',
    });
  });

  it('A3 refuses when neither name resolves and names both candidates', () => {
    const emptyPathDir = createTempDirectory();
    const env = envWithPath(emptyPathDir);

    expectUnresolved(() => resolver.resolveOpencodeBinary(env));
    expect(fanoutRun.isOpencodeBinaryAvailable(env)).toBe(false);
  });
});

describe('OpenCode lineage builders', () => {
  it('D1 preserves the cli-opencode v1 argv', () => {
    const binDir = createTempDirectory();
    writeVersionStub(binDir, 'opencode', VERSION_1_OUTPUT);
    const result = fanoutRun.buildLineageCommand(
      { kind: 'cli-opencode', model: MODEL, reasoningEffort: EFFORT },
      PROMPT,
      'danger-full-access',
      'bypassPermissions',
      { env: envWithPath(binDir) },
    );

    expect(result.command).toBe('opencode');
    expect(result.args).toEqual([
      'run',
      '--model',
      MODEL,
      '--format',
      'json',
      '--dir',
      process.cwd(),
      '--dangerously-skip-permissions',
      '--variant',
      EFFORT,
      PROMPT,
    ]);
    expect(Object.prototype.hasOwnProperty.call(result, 'cwd')).toBe(false);
  });

  it('D2 uses the cli-opencode v2 argv, cwd, safe flags, and optional effort', () => {
    const binDir = createTempDirectory();
    writeVersionStub(binDir, 'opencode2', VERSION_2_OUTPUT);
    const env = envWithPath(binDir);
    const result = fanoutRun.buildLineageCommand(
      { kind: 'cli-opencode', model: MODEL, reasoningEffort: EFFORT },
      PROMPT,
      'danger-full-access',
      'bypassPermissions',
      { env },
    );

    expect(result.command).toBe('opencode2');
    expect(result.args).toEqual([
      'run',
      '--standalone',
      '-m',
      MODEL + '#' + EFFORT,
      '--format',
      'json',
      '--auto',
      PROMPT,
    ]);
    expect(result.cwd).toBe(process.cwd());
    const forbiddenFlags = [
      '--dir',
      '--variant',
      '--command',
      '--pure',
      '--share',
      '--port',
      '--dangerously-skip-permissions',
    ];
    expect(result.args.some((argument) => forbiddenFlags.includes(argument))).toBe(false);

    const withoutEffort = fanoutRun.buildLineageCommand(
      { kind: 'cli-opencode', model: MODEL },
      PROMPT,
      'danger-full-access',
      'bypassPermissions',
      { env },
    );
    expect(withoutEffort.args).toEqual([
      'run',
      '--standalone',
      '-m',
      MODEL,
      '--format',
      'json',
      '--auto',
      PROMPT,
    ]);
    expect(withoutEffort.cwd).toBe(process.cwd());
  });

  it('applies the OpenCode 1 default model to an unpinned lineage', () => {
    const binDir = createTempDirectory();
    writeVersionStub(binDir, 'opencode', VERSION_1_OUTPUT);
    const result = fanoutRun.buildLineageCommand(
      { kind: 'cli-opencode' },
      PROMPT,
      'danger-full-access',
      'bypassPermissions',
      { env: envWithPath(binDir) },
    );

    expect(result.args).toContain('--model');
    expect(result.args).toContain('llmgateway/deepseek-v4.1-flash-1017');
    expect(result.args).toContain('--variant');
    expect(result.args).toContain('max');
    expect(result.args).not.toContain('opencode-go/deepseek-v4.1-flash');
  });

  it('applies the OpenCode 2 default model to an unpinned lineage', () => {
    const binDir = createTempDirectory();
    writeVersionStub(binDir, 'opencode2', VERSION_2_OUTPUT);
    const result = fanoutRun.buildLineageCommand(
      { kind: 'cli-opencode' },
      PROMPT,
      'danger-full-access',
      'bypassPermissions',
      { env: envWithPath(binDir) },
    );

    expect(result.args).toContain('-m');
    expect(result.args).toContain('llmgateway/deepseek-v4.1-flash-1017#max');
  });

  it('D3 preserves the native v1 argv', () => {
    const binDir = createTempDirectory();
    writeVersionStub(binDir, 'opencode', VERSION_1_OUTPUT);
    const specFolder = 'example-packet';
    const lineageDir = join(binDir, 'lineage-artifacts');
    const result = fanoutRun.buildLineageCommand(
      { kind: 'native', label: 'native-v1', iterations: 2 },
      PROMPT,
      'workspace-write',
      'acceptEdits',
      {
        env: envWithPath(binDir),
        loopType: 'review',
        specFolder,
        lineageDir,
        convergenceThreshold: 0.1,
        stopPolicy: 'convergence',
      },
    );
    const nativePrompt = [
      ':auto "example-packet" --spec-folder=example-packet --max-iterations=2 --convergence=0.1'
        + ' --stop-policy=convergence --fanout-lineage-artifact-dir=' + lineageDir
        + ' --lineage-mode=auto',
      '',
      'PRE-BOUND SETUP ANSWERS:',
      'review_target: example-packet',
      'review_target_type: spec-folder',
      'review_dimensions: all',
      'spec_folder: example-packet',
      'execution_mode: AUTONOMOUS',
      'lineage_mode: auto',
      'maxIterations: 2',
      'convergenceThreshold: 0.1',
      'stop_policy: convergence',
      'config.fanout_lineage_artifact_dir: ' + lineageDir,
    ].join('\n');

    expect(result.command).toBe('opencode');
    expect(result.args).toEqual([
      'run',
      '--dangerously-skip-permissions',
      '--format',
      'json',
      '--dir',
      process.cwd(),
      '--command',
      'deep/review',
      nativePrompt,
    ]);
  });

  it('D4 refuses native v2 dispatch and names v2 and session.command', () => {
    const binDir = createTempDirectory();
    writeVersionStub(binDir, 'opencode2', VERSION_2_OUTPUT);
    const error = thrownError(() => fanoutRun.buildLineageCommand(
      { kind: 'native', label: 'native-v2', iterations: 1 },
      PROMPT,
      'workspace-write',
      'acceptEdits',
      {
        env: envWithPath(binDir),
        loopType: 'review',
        specFolder: 'example-packet',
        lineageDir: join(binDir, 'lineage-artifacts'),
      },
    ));

    expect(error.message.toLowerCase()).toContain('v2');
    expect(error.message).toContain('session.command');
  });
});

describe('OpenCode resolver adversarial cases', () => {
  it('accepts CRLF and trailing whitespace around a version', () => {
    expect(resolver.parseOpencodeVersion(CRLF_VERSION_OUTPUT)).toBe('v1');
    expect(resolver.parseOpencodeVersion(TRAILING_SPACE_VERSION_OUTPUT)).toBe('v1');
  });

  it('uses the first version token in joined output', () => {
    expect(resolver.parseOpencodeVersion(JOINED_VERSION_OUTPUT)).toBe('v1');
  });

  it('resolves a bare OPENCODE_BIN name through env.PATH', () => {
    const binDir = createTempDirectory();
    const executablePath = writeVersionStub(binDir, 'opencode2', VERSION_2_OUTPUT);
    const env = { ...envWithPath(binDir), OPENCODE_BIN: 'opencode2' };

    expect(resolver.resolveOpencodeBinary(env)).toEqual({
      command: 'opencode2',
      executablePath: realpathSync(executablePath),
      version: 'v2',
    });
  });

  it('does not fall back when OPENCODE_BIN names a missing path', () => {
    const binDir = createTempDirectory();
    writeVersionStub(binDir, 'opencode', VERSION_1_OUTPUT);
    const missingPath = join(binDir, 'missing-opencode');
    const env = { ...envWithPath(binDir), OPENCODE_BIN: missingPath };

    expectUnresolved(() => resolver.resolveOpencodeBinary(env));
  });

  it('refuses when the version probe throws ETIMEDOUT', () => {
    const binDir = createTempDirectory();
    writeVersionStub(binDir, 'opencode', VERSION_1_OUTPUT);
    const probeError = Object.assign(new Error('ETIMEDOUT'), { code: 'ETIMEDOUT' });

    expectUnresolved(
      () => resolver.resolveOpencodeBinary(envWithPath(binDir), {
        probe: () => {
          throw probeError;
        },
      }),
    );
  });

  it('refuses garbage from opencode2 without falling back to opencode', () => {
    const binDir = createTempDirectory();
    writeVersionStub(binDir, 'opencode2', GARBAGE_OPENCODE2_OUTPUT);
    writeVersionStub(binDir, 'opencode', VERSION_1_OUTPUT);

    expectUnresolved(
      () => resolver.resolveOpencodeBinary(envWithPath(binDir)),
      GARBAGE_OPENCODE2_OUTPUT,
    );
  });

  it('runs a hostile OPENCODE_BIN path without shell interpretation', () => {
    const workingDirectory = createTempDirectory();
    const binDir = join(workingDirectory, 'a b');
    const executablePath = writeVersionStub(binDir, '$(touch PWNED)', VERSION_1_OUTPUT);
    const env = { ...envWithPath(binDir), OPENCODE_BIN: executablePath };
    const originalWorkingDirectory = process.cwd();

    try {
      process.chdir(workingDirectory);
      const result = resolver.resolveOpencodeBinary(env);
      expect(result.executablePath).toBe(executablePath);
      expect(result.version).toBe('v1');
      expect(containsEntry(workingDirectory, 'PWNED')).toBe(false);
    } finally {
      process.chdir(originalWorkingDirectory);
    }
  });

  it('prefers opencode2 on a later PATH directory over opencode on an earlier one', () => {
    const pathRoot = createTempDirectory();
    const firstDir = join(pathRoot, 'dir1');
    const secondDir = join(pathRoot, 'dir2');
    writeVersionStub(firstDir, 'opencode', VERSION_1_OUTPUT);
    const secondExecutable = writeVersionStub(secondDir, 'opencode2', VERSION_2_OUTPUT);

    expect(resolver.resolveOpencodeBinary(envWithPath(firstDir, secondDir))).toEqual({
      command: 'opencode2',
      executablePath: realpathSync(secondExecutable),
      version: 'v2',
    });
  });

  it('OPENCODE_BIN overrides an opencode2 elsewhere on PATH', () => {
    const pathRoot = createTempDirectory();
    const firstDir = join(pathRoot, 'dir1');
    const secondDir = join(pathRoot, 'dir2');
    const v1Executable = writeVersionStub(firstDir, 'opencode', VERSION_1_OUTPUT);
    writeVersionStub(secondDir, 'opencode2', VERSION_2_OUTPUT);
    const env = { ...envWithPath(secondDir), OPENCODE_BIN: v1Executable };

    expect(resolver.resolveOpencodeBinary(env)).toEqual({
      command: v1Executable,
      executablePath: realpathSync(v1Executable),
      version: 'v1',
    });
  });

  it('falls back to the first opencode on PATH when no opencode2 exists', () => {
    const pathRoot = createTempDirectory();
    const firstDir = join(pathRoot, 'dir1');
    const secondDir = join(pathRoot, 'dir2');
    const firstExecutable = writeVersionStub(firstDir, 'opencode', VERSION_1_OUTPUT);
    writeVersionStub(secondDir, 'opencode', VERSION_2_OUTPUT);

    expect(resolver.resolveOpencodeBinary(envWithPath(firstDir, secondDir))).toEqual({
      command: 'opencode',
      executablePath: realpathSync(firstExecutable),
      version: 'v1',
    });
  });

  it('prefers opencode2 when both names share one PATH directory', () => {
    const binDir = createTempDirectory();
    const opencode2Path = writeVersionStub(binDir, 'opencode2', VERSION_2_OUTPUT);
    writeVersionStub(binDir, 'opencode', VERSION_1_OUTPUT);

    expect(resolver.resolveOpencodeBinary(envWithPath(binDir))).toEqual({
      command: 'opencode2',
      executablePath: realpathSync(opencode2Path),
      version: 'v2',
    });
  });

  it('caches by executable metadata and probes again after a rewrite', () => {
    const binDir = createTempDirectory();
    const executablePath = writeVersionStub(binDir, 'opencode', VERSION_1_OUTPUT);
    let probeCount = 0;
    const probe = (path: string): string => {
      probeCount += 1;
      const script = readFileSync(path, 'utf8');
      return script.includes(VERSION_2_OUTPUT) ? VERSION_2_OUTPUT : VERSION_1_OUTPUT;
    };
    const env = envWithPath(binDir);
    const deps = { probe };

    expect(resolver.resolveOpencodeBinary(env, deps).version).toBe('v1');
    expect(resolver.resolveOpencodeBinary(env, deps).version).toBe('v1');
    expect(probeCount).toBe(1);

    writeVersionStub(binDir, 'opencode', VERSION_2_OUTPUT);
    expect(executablePath).toBe(join(binDir, 'opencode'));
    expect(resolver.resolveOpencodeBinary(env, deps).version).toBe('v2');
    expect(probeCount).toBe(2);
  });

  it('keeps CJS parsing in parity with the ESM parser for every fixture', async () => {
    const esmParser = await import(pathToFileURL(
      resolve(projectRoot, '.skilled/hooks/dispatch/lib/opencode-version.mjs'),
    ).href) as { parseOpencodeVersion: (text: string) => OpencodeVersion };

    for (const output of VERSION_OUTPUTS) {
      expect(resolver.parseOpencodeVersion(output)).toBe(esmParser.parseOpencodeVersion(output));
    }
  });
});
