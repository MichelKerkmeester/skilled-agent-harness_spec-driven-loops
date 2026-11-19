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
 * Contract: parseOpencodeVersion(text) returns 'v2' | 'unsupported' | 'unknown'; major 1 is
 * 'unsupported'. resolveOpencodeBinary(env, deps?) returns { command, executablePath,
 * version: 'v2' }; a missing binary, a failed probe, unparseable output and an OpenCode 1
 * binary all throw Error(code 'E_OPENCODE_UNRESOLVED') carrying the probe output.
 * deps.probe(executablePath) replaces --version. OPENCODE_BIN overrides PATH: bare names use
 * env.PATH, paths are used as-is, with no fallback. Otherwise the first opencode on PATH is
 * the only candidate. Cache entries use realpath, size, and mtime;
 * clearOpencodeVersionCache() empties the cache. isOpencodeBinaryAvailable(env) is true only
 * when that candidate resolves to OpenCode 2.
 */

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

type OpencodeVersion = 'v2' | 'unsupported' | 'unknown';
type SupportedOpencodeVersion = Exclude<OpencodeVersion, 'unsupported' | 'unknown'>;

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
}

interface BuiltLineageCommand {
  readonly command: string;
  readonly args: string[];
  readonly input?: string;
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
const GARBAGE_OUTPUT = 'not an OpenCode version';
const CRLF_VERSION_OUTPUT = '2.0.32\r\n';
const TRAILING_SPACE_VERSION_OUTPUT = '2.0.32 ';
const JOINED_VERSION_OUTPUT = '1.19.3 2.0.32';
const VERSION_OUTPUTS: readonly string[] = [
  VERSION_1_OUTPUT,
  VERSION_2_OUTPUT,
  VERSION_1_PRERELEASE_OUTPUT,
  EMPTY_OUTPUT,
  UNPARSEABLE_OUTPUT,
  GARBAGE_OUTPUT,
  CRLF_VERSION_OUTPUT,
  TRAILING_SPACE_VERSION_OUTPUT,
  JOINED_VERSION_OUTPUT,
];
const VERSION_CORPUS = JSON.parse(readFileSync(
  resolve(projectRoot, '.skilled/hooks/cli-dispatch/lib/opencode-version-corpus.json'),
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
  it('P1 refuses 1.19.3 as an unsupported OpenCode 1 binary', () => {
    const binDir = createTempDirectory();
    writeVersionStub(binDir, 'opencode', VERSION_1_OUTPUT);
    const env = envWithPath(binDir);

    expect(resolver.parseOpencodeVersion(VERSION_1_OUTPUT)).toBe('unsupported');
    const error = expectUnresolved(() => resolver.resolveOpencodeBinary(env), VERSION_1_OUTPUT);
    expect(error.message).toContain('no longer supported');
    expect(fanoutRun.isOpencodeBinaryAvailable(env)).toBe(false);
  });

  it('P2 resolves opencode v2.0.32 as v2', () => {
    const binDir = createTempDirectory();
    const executablePath = writeVersionStub(binDir, 'opencode', VERSION_2_OUTPUT);

    expect(resolver.parseOpencodeVersion(VERSION_2_OUTPUT)).toBe('v2');
    expect(resolver.resolveOpencodeBinary(envWithPath(binDir))).toEqual({
      command: 'opencode',
      executablePath: realpathSync(executablePath),
      version: 'v2',
    });
  });

  it('P3 refuses 1.19.3-rc.1 as unsupported', () => {
    const binDir = createTempDirectory();
    writeVersionStub(binDir, 'opencode', VERSION_1_PRERELEASE_OUTPUT);

    expect(resolver.parseOpencodeVersion(VERSION_1_PRERELEASE_OUTPUT)).toBe('unsupported');
    expectUnresolved(
      () => resolver.resolveOpencodeBinary(envWithPath(binDir)),
      VERSION_1_PRERELEASE_OUTPUT,
    );
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

  it('A1 finds opencode and reports its parsed version', () => {
    const binDir = createTempDirectory();
    const executablePath = writeVersionStub(binDir, 'opencode', VERSION_2_OUTPUT);
    const env = envWithPath(binDir);

    expect(resolver.resolveOpencodeBinary(env)).toEqual({
      command: 'opencode',
      executablePath: realpathSync(executablePath),
      version: 'v2',
    });
    expect(fanoutRun.isOpencodeBinaryAvailable(env)).toBe(true);
  });

  it('A2 does not probe an executable named opencode2', () => {
    const binDir = createTempDirectory();
    writeVersionStub(binDir, 'opencode2', VERSION_2_OUTPUT);
    const env = envWithPath(binDir);

    expectUnresolved(() => resolver.resolveOpencodeBinary(env));
    expect(fanoutRun.isOpencodeBinaryAvailable(env)).toBe(false);
  });

  it('A3 refuses when opencode does not resolve', () => {
    const emptyPathDir = createTempDirectory();
    const env = envWithPath(emptyPathDir);

    expectUnresolved(() => resolver.resolveOpencodeBinary(env));
    expect(fanoutRun.isOpencodeBinaryAvailable(env)).toBe(false);
  });
});

describe('OpenCode lineage builders', () => {
  it('returns empty stdin input', () => {
    const binDir = createTempDirectory();
    writeVersionStub(binDir, 'opencode', VERSION_2_OUTPUT);
    const result = fanoutRun.buildLineageCommand(
      { kind: 'cli-opencode', model: MODEL, reasoningEffort: EFFORT },
      PROMPT,
      'danger-full-access',
      'bypassPermissions',
      { env: envWithPath(binDir) },
    );

    expect(result.input).toBe('');
  });

  it('D2 uses the cli-opencode v2 argv, cwd, safe flags, and optional effort', () => {
    const binDir = createTempDirectory();
    writeVersionStub(binDir, 'opencode', VERSION_2_OUTPUT);
    const env = envWithPath(binDir);
    const result = fanoutRun.buildLineageCommand(
      { kind: 'cli-opencode', model: MODEL, reasoningEffort: EFFORT },
      PROMPT,
      'danger-full-access',
      'bypassPermissions',
      { env },
    );

    expect(result.command).toBe('opencode');
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

  it('applies the OpenCode 2 default model to an unpinned lineage', () => {
    const binDir = createTempDirectory();
    writeVersionStub(binDir, 'opencode', VERSION_2_OUTPUT);
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

  it('refuses a cli-opencode lineage when opencode is OpenCode 1', () => {
    const binDir = createTempDirectory();
    writeVersionStub(binDir, 'opencode', VERSION_1_OUTPUT);
    const error = thrownError(() => fanoutRun.buildLineageCommand(
      { kind: 'cli-opencode', model: MODEL, reasoningEffort: EFFORT },
      PROMPT,
      'danger-full-access',
      'bypassPermissions',
      { env: envWithPath(binDir) },
    ));

    expect(error.message).toContain('no longer supported');
  });
});

describe('OpenCode resolver adversarial cases', () => {
  it('accepts CRLF and trailing whitespace around a version', () => {
    expect(resolver.parseOpencodeVersion(CRLF_VERSION_OUTPUT)).toBe('v2');
    expect(resolver.parseOpencodeVersion(TRAILING_SPACE_VERSION_OUTPUT)).toBe('v2');
  });

  it('uses the first version token in joined output', () => {
    expect(resolver.parseOpencodeVersion(JOINED_VERSION_OUTPUT)).toBe('unsupported');
  });

  it('resolves a bare OPENCODE_BIN name through env.PATH', () => {
    const binDir = createTempDirectory();
    const executablePath = writeVersionStub(binDir, 'opencode-pinned', VERSION_2_OUTPUT);
    const env = { ...envWithPath(binDir), OPENCODE_BIN: 'opencode-pinned' };

    expect(resolver.resolveOpencodeBinary(env)).toEqual({
      command: 'opencode-pinned',
      executablePath: realpathSync(executablePath),
      version: 'v2',
    });
  });

  it('does not fall back when OPENCODE_BIN names a missing path', () => {
    const binDir = createTempDirectory();
    writeVersionStub(binDir, 'opencode', VERSION_2_OUTPUT);
    const missingPath = join(binDir, 'missing-opencode');
    const env = { ...envWithPath(binDir), OPENCODE_BIN: missingPath };

    expectUnresolved(() => resolver.resolveOpencodeBinary(env));
  });

  it('refuses when the version probe throws ETIMEDOUT', () => {
    const binDir = createTempDirectory();
    writeVersionStub(binDir, 'opencode', VERSION_2_OUTPUT);
    const probeError = Object.assign(new Error('ETIMEDOUT'), { code: 'ETIMEDOUT' });

    expectUnresolved(
      () => resolver.resolveOpencodeBinary(envWithPath(binDir), {
        probe: () => {
          throw probeError;
        },
      }),
    );
  });

  it('refuses garbage from OPENCODE_BIN without falling back to opencode on PATH', () => {
    const pathRoot = createTempDirectory();
    const pinnedDir = join(pathRoot, 'pinned');
    const pathDir = join(pathRoot, 'path');
    const pinned = writeVersionStub(pinnedDir, 'opencode', GARBAGE_OUTPUT);
    writeVersionStub(pathDir, 'opencode', VERSION_2_OUTPUT);
    const env = { ...envWithPath(pathDir), OPENCODE_BIN: pinned };

    expectUnresolved(() => resolver.resolveOpencodeBinary(env), GARBAGE_OUTPUT);
  });

  it('runs a hostile OPENCODE_BIN path without shell interpretation', () => {
    const workingDirectory = createTempDirectory();
    const binDir = join(workingDirectory, 'a b');
    const executablePath = writeVersionStub(binDir, '$(touch PWNED)', VERSION_2_OUTPUT);
    const env = { ...envWithPath(binDir), OPENCODE_BIN: executablePath };
    const originalWorkingDirectory = process.cwd();

    try {
      process.chdir(workingDirectory);
      const result = resolver.resolveOpencodeBinary(env);
      expect(result.executablePath).toBe(executablePath);
      expect(result.version).toBe('v2');
      expect(containsEntry(workingDirectory, 'PWNED')).toBe(false);
    } finally {
      process.chdir(originalWorkingDirectory);
    }
  });

  it('OPENCODE_BIN overrides an opencode elsewhere on PATH', () => {
    const pathRoot = createTempDirectory();
    const firstDir = join(pathRoot, 'dir1');
    const secondDir = join(pathRoot, 'dir2');
    const pinned = writeVersionStub(firstDir, 'opencode', VERSION_2_OUTPUT);
    writeVersionStub(secondDir, 'opencode', VERSION_1_OUTPUT);
    const env = { ...envWithPath(secondDir), OPENCODE_BIN: pinned };

    expect(resolver.resolveOpencodeBinary(env)).toEqual({
      command: pinned,
      executablePath: realpathSync(pinned),
      version: 'v2',
    });
  });

  it('takes the first opencode on PATH and does not search past an OpenCode 1', () => {
    const pathRoot = createTempDirectory();
    const firstDir = join(pathRoot, 'dir1');
    const secondDir = join(pathRoot, 'dir2');
    const firstExecutable = writeVersionStub(firstDir, 'opencode', VERSION_2_OUTPUT);
    writeVersionStub(secondDir, 'opencode', VERSION_1_OUTPUT);

    expect(resolver.resolveOpencodeBinary(envWithPath(firstDir, secondDir))).toEqual({
      command: 'opencode',
      executablePath: realpathSync(firstExecutable),
      version: 'v2',
    });
    expectUnresolved(
      () => resolver.resolveOpencodeBinary(envWithPath(secondDir, firstDir)),
      VERSION_1_OUTPUT,
    );
  });

  it('caches by executable metadata and probes again after a rewrite', () => {
    const binDir = createTempDirectory();
    const executablePath = writeVersionStub(binDir, 'opencode', VERSION_2_OUTPUT);
    let probeCount = 0;
    const probe = (path: string): string => {
      probeCount += 1;
      const script = readFileSync(path, 'utf8');
      return script.includes(VERSION_1_OUTPUT) ? VERSION_1_OUTPUT : VERSION_2_OUTPUT;
    };
    const env = envWithPath(binDir);
    const deps = { probe };

    expect(resolver.resolveOpencodeBinary(env, deps).version).toBe('v2');
    expect(resolver.resolveOpencodeBinary(env, deps).version).toBe('v2');
    expect(probeCount).toBe(1);

    writeVersionStub(binDir, 'opencode', VERSION_1_OUTPUT);
    expect(executablePath).toBe(join(binDir, 'opencode'));
    expectUnresolved(() => resolver.resolveOpencodeBinary(env, deps), VERSION_1_OUTPUT);
    expect(probeCount).toBe(2);
  });

  it('keeps CJS parsing in parity with the ESM parser for every fixture', async () => {
    const esmParser = await import(pathToFileURL(
      resolve(projectRoot, '.skilled/hooks/cli-dispatch/lib/opencode-version.mjs'),
    ).href) as { parseOpencodeVersion: (text: string) => OpencodeVersion };

    for (const output of VERSION_OUTPUTS) {
      expect(resolver.parseOpencodeVersion(output)).toBe(esmParser.parseOpencodeVersion(output));
    }
  });
});
