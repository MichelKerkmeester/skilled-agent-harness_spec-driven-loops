// ───────────────────────────────────────────────────────────────
// MODULE: Executor adapter capability record conformance
// ───────────────────────────────────────────────────────────────
// Each executor kind's capability record must describe the command its builders
// really emit: the binary, how the prompt travels, the log format the cost reader
// parses, where an effort and a sandbox mode land, and that no command resumes a
// provider session. One table-driven pass covers every kind.

import { spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import {
  EXECUTOR_ADAPTER_CAPABILITIES,
  EXECUTOR_KINDS,
  EXECUTOR_KIND_FLAG_SUPPORT,
  resolveClaudePermissionMode,
} from '../../lib/deep-loop/executor-config.js';
import type { ExecutorKind, ExecutorLogFormat } from '../../lib/deep-loop/executor-config.js';
import { detectFromAncestry } from '../../lib/deep-loop/executor-audit.js';

const here = fileURLToPath(new URL('.', import.meta.url));
const scriptsDir = resolve(here, '..', '..', 'scripts');
const requireCjs = createRequire(import.meta.url);

interface BuiltCommand {
  command: string;
  args: string[];
  input?: string;
}

const { buildLineageCommand } = requireCjs(join(scriptsDir, 'fanout-run.cjs')) as {
  buildLineageCommand: (
    lineage: Record<string, unknown>,
    prompt: string,
    resolvedSandbox: string,
    resolvedPermission: string,
    options?: Record<string, unknown>,
  ) => BuiltCommand;
};
const { readLineageProviderCostUsd } = requireCjs(join(scriptsDir, 'fanout-salvage.cjs')) as {
  readLineageProviderCostUsd: (lineageDir: string) => number | null;
};
const DISPATCH_SCRIPT = join(scriptsDir, 'dispatch-iteration.cjs');
const { buildClaudeDispatch } = requireCjs(DISPATCH_SCRIPT) as {
  buildClaudeDispatch: (context: Record<string, unknown>) => { args: string[] };
};

const PROMPT = 'capability-probe prompt\nsecond line';
const SANDBOX_MODES = ['read-only', 'workspace-write', 'danger-full-access'] as const;
type Sandbox = typeof SANDBOX_MODES[number];

const tempDirs: string[] = [];
afterEach(() => {
  while (tempDirs.length > 0) rmSync(tempDirs.pop() as string, { recursive: true, force: true });
});

function makeTempDir(prefix: string): string {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), prefix)));
  tempDirs.push(dir);
  return dir;
}

function stubEnv(): NodeJS.ProcessEnv {
  const binDir = makeTempDir('adapter-cap-bin-');
  const versions: Record<string, string> = { opencode: '2.3.2', dsh: '0.2.2-rc.3', vibe: 'vibe 3.1.2' };
  for (const name of ['codex', 'claude', 'opencode', 'cursor-agent', 'devin', 'pi', 'dsh', 'vibe']) {
    const probe = versions[name]
      ? `if [ "$1" = "--version" ]; then echo '${versions[name]}'; exit 0; fi\n`
      : '';
    writeFileSync(join(binDir, name), `#!/bin/sh\n${probe}exit 0\n`, { mode: 0o755 });
  }
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    PATH: `${binDir}:${process.env.PATH ?? ''}`,
    DEEP_LOOP_CURSOR_NEUTRAL_WORKSPACE: join(makeTempDir('adapter-cap-cursor-'), 'neutral'),
  };
  delete env.OPENCODE_BIN;
  return env;
}

function stubRepo(): string {
  const repoRoot = makeTempDir('adapter-cap-repo-');
  const patchDir = join(repoRoot, '.dsh', 'patches');
  mkdirSync(patchDir, { recursive: true });
  for (const name of [
    'route-llmgateway-deepseek.patch.yml',
    'route-opencode-go-deepseek.patch.yml',
    'lineage.patch.yml',
    'guards.patch.yml',
  ]) {
    writeFileSync(join(patchDir, name), 'patch: true\n');
  }
  mkdirSync(join(repoRoot, '.vibe'), { recursive: true });
  writeFileSync(join(repoRoot, '.vibe', 'config.toml'), '[[providers]]\nname = "mistral"\n');
  writeFileSync(join(repoRoot, '.vibe', 'hooks.toml'), '');
  return repoRoot;
}

// A model each kind accepts that no top-tier pin rewrites, so a requested effort shows
// up unchanged wherever the kind forwards it.
const PROBE_MODEL: Record<ExecutorKind, string | null> = {
  native: null,
  'cli-codex': 'gpt-6-luna',
  'cli-claude-code': 'claude-opus-4-8',
  'cli-opencode': 'openai/gpt-6-luna',
  'cli-cursor': 'composer-2.5',
  'cli-devin': 'swe-2-max',
  'cli-pi': 'gpt-6-luna',
  'cli-deepseek-harness': 'deepseek-v4.1-flash-1017',
  'cli-mistral-vibe': 'deepseek-flash',
};

// Stands in for `opencode debug agents`: the inline rules laid over a catch-all allow, top
// level first and the build agent's own rules last, the order OpenCode applies them in.
function resolveOpencodeAgentsFromInline({ env }: { env: Record<string, string | undefined> }): unknown {
  const inline = JSON.parse(env.OPENCODE_CONFIG_CONTENT ?? '{}') as {
    permission?: Record<string, string>;
    agent?: { build?: { permission?: Record<string, string> } };
  };
  const rules = (map: Record<string, string> = {}) => Object.entries(map).map(([action, effect]) => ({ action, resource: '*', effect }));
  return [{
    id: 'build',
    permissions: [{ action: '*', resource: '*', effect: 'allow' }, ...rules(inline.permission), ...rules(inline.agent?.build?.permission)],
  }];
}

function makeBuilder() {
  const env = stubEnv();
  const repoRoot = stubRepo();
  return (kind: ExecutorKind, sandbox: Sandbox, reasoningEffort: string | null = null): BuiltCommand => {
    const lineage: Record<string, unknown> = { kind, model: PROBE_MODEL[kind], reasoningEffort, sandboxMode: sandbox };
    return buildLineageCommand(lineage, PROMPT, sandbox, resolveClaudePermissionMode(sandbox), {
      env,
      executableVersion: 'stub 1.0.0',
      directoryRoot: repoRoot,
      repoRoot,
      lineageDir: makeTempDir('adapter-cap-lineage-'),
      resolveOpencodeAgents: resolveOpencodeAgentsFromInline,
    });
  };
}

function tryBuild(build: () => BuiltCommand): BuiltCommand | Error {
  try {
    return build();
  } catch (error) {
    return error as Error;
  }
}

function pairIndex(args: readonly string[], flag: string, value: string): number {
  return args.findIndex((arg, index) => arg === flag && args[index + 1] === value);
}

function expectLogFormatFlags(kind: string, args: readonly string[], format: ExecutorLogFormat): void {
  switch (format) {
    case 'opencode-json':
      expect(pairIndex(args, '--format', 'json'), kind).toBeGreaterThanOrEqual(0);
      return;
    case 'claude-stream-json':
      expect(pairIndex(args, '--output-format', 'stream-json'), kind).toBeGreaterThanOrEqual(0);
      expect(args, kind).toContain('--verbose');
      return;
    case 'dsh-json':
      expect(args, kind).toContain('--json');
      return;
    case 'text': {
      expect(args, kind).not.toContain('--json');
      expect(args, kind).not.toContain('--format');
      const outputFormat = args.indexOf('--output-format');
      if (outputFormat !== -1) expect(args[outputFormat + 1], kind).toBe('text');
    }
  }
}

function effortTokens(args: readonly string[]): string[] {
  return args.filter((arg) => arg === 'high' || arg.endsWith('=high') || arg.endsWith('#high'));
}

// One fixture log per format, as the fan-out captures it in logs/fanout-lineage.out.
const LOG_FIXTURES: Record<ExecutorLogFormat, { text: string; cost: number | null }> = {
  'opencode-json': {
    text: [
      JSON.stringify({ type: 'step_start', part: { type: 'step-start' } }),
      JSON.stringify({ type: 'step_finish', part: { type: 'step-finish', cost: 0.0125 } }),
      JSON.stringify({ type: 'step_finish', part: { type: 'step-finish', cost: 0.0075 } }),
    ].join('\n'),
    cost: 0.02,
  },
  'claude-stream-json': {
    text: [
      JSON.stringify({ type: 'system', subtype: 'init' }),
      JSON.stringify({ type: 'result', subtype: 'success', total_cost_usd: 0.05 }),
      JSON.stringify({ type: 'result', subtype: 'success', total_cost_usd: 0.125 }),
    ].join('\n'),
    cost: 0.125,
  },
  'dsh-json': {
    text: [
      JSON.stringify({ type: 'message', text: 'working' }),
      JSON.stringify({ type: 'final', reason: { kind: 'completed' } }),
    ].join('\n'),
    cost: null,
  },
  text: { text: 'Iteration complete.\nWrote iteration-001.md\n', cost: null },
};

function writeLineageLog(text: string | null): string {
  const lineageDir = makeTempDir('adapter-cap-cost-');
  if (text !== null) {
    mkdirSync(join(lineageDir, 'logs'));
    writeFileSync(join(lineageDir, 'logs', 'fanout-lineage.out'), text);
  }
  return lineageDir;
}

describe('executor adapter capability record', () => {
  it('holds one frozen record per executor kind', () => {
    expect(Object.keys(EXECUTOR_ADAPTER_CAPABILITIES).sort()).toEqual([...EXECUTOR_KINDS].sort());
    expect(Object.isFrozen(EXECUTOR_ADAPTER_CAPABILITIES)).toBe(true);
    for (const kind of EXECUTOR_KINDS) {
      expect(Object.isFrozen(EXECUTOR_ADAPTER_CAPABILITIES[kind]), kind).toBe(true);
      expect(EXECUTOR_ADAPTER_CAPABILITIES[kind].resume, kind).toBe('artifact');
    }
  });

  it('refuses a native lineage command, matching a record with no binary or prompt channel', () => {
    const build = makeBuilder();
    expect(EXECUTOR_ADAPTER_CAPABILITIES.native).toMatchObject({ binary: null, promptChannel: null, logFormat: null });
    expect(tryBuild(() => build('native', 'workspace-write'))).toBeInstanceOf(Error);
  });

  const cliKinds = EXECUTOR_KINDS.filter((kind) => kind !== 'native');

  it.each(cliKinds)('%s: the fan-out builder matches binary, prompt channel, log format and resume', (kind) => {
    const record = EXECUTOR_ADAPTER_CAPABILITIES[kind];
    const build = makeBuilder();
    const built = build(kind, 'workspace-write');

    expect(basename(built.command)).toBe(record.binary);

    switch (record.promptChannel) {
      case 'argv':
        expect(built.args).toContain(PROMPT);
        expect(built.input ?? '').toBe('');
        break;
      case 'stdin':
        expect(built.args).not.toContain(PROMPT);
        expect(built.input).toBe(PROMPT);
        expect(built.args[built.args.length - 1]).toBe('-');
        break;
      case 'file': {
        expect(built.args).not.toContain(PROMPT);
        expect(built.input ?? '').toBe('');
        const promptFile = built.args[built.args.indexOf('--prompt-file') + 1];
        expect(readFileSync(promptFile, 'utf8')).toBe(PROMPT);
        break;
      }
      default:
        throw new Error(`${kind} has a lineage command but no prompt channel in its record`);
    }

    expectLogFormatFlags(kind, built.args, record.logFormat as ExecutorLogFormat);

    for (const resumeFlag of ['--resume', '--continue', 'resume']) {
      expect(built.args).not.toContain(resumeFlag);
    }
  });

  it.each(cliKinds)('%s: a requested effort lands where the record says', (kind) => {
    const record = EXECUTOR_ADAPTER_CAPABILITIES[kind];
    const build = makeBuilder();
    const args = build(kind, 'workspace-write', 'high').args;
    const tokens = effortTokens(args);

    switch (record.effortSurface) {
      case 'flag':
        expect(tokens.some((token) => token === 'high' || token.endsWith('=high'))).toBe(true);
        expect(EXECUTOR_KIND_FLAG_SUPPORT[kind]).toContain('reasoningEffort');
        break;
      case 'model-suffix':
        expect(tokens).toEqual([`${PROBE_MODEL[kind]}#high`]);
        expect(EXECUTOR_KIND_FLAG_SUPPORT[kind]).toContain('reasoningEffort');
        break;
      default:
        expect(tokens).toEqual([]);
    }
  });

  it.each(cliKinds)('%s: a requested sandbox mode changes the command the way the record says', (kind) => {
    const record = EXECUTOR_ADAPTER_CAPABILITIES[kind];
    const build = makeBuilder();
    const byMode = Object.fromEntries(
      SANDBOX_MODES.map((mode) => [mode, tryBuild(() => build(kind, mode))]),
    ) as Record<Sandbox, BuiltCommand | Error>;
    const argsFor = (mode: Sandbox): string[] => {
      const built = byMode[mode];
      if (built instanceof Error) throw built;
      return built.args;
    };
    const flagValue = (mode: Sandbox, flag: string): string | undefined => {
      const args = argsFor(mode);
      const index = args.indexOf(flag);
      return index === -1 ? undefined : args[index + 1];
    };

    switch (record.sandboxSurface) {
      case 'sandbox-flag':
        expect(argsFor('workspace-write')).toContain('--sandbox');
        expect(argsFor('read-only')).not.toEqual(argsFor('danger-full-access'));
        break;
      case 'permission-mode':
        expect(flagValue('read-only', '--permission-mode')).toBeDefined();
        expect(flagValue('read-only', '--permission-mode'))
          .not.toBe(flagValue('danger-full-access', '--permission-mode'));
        break;
      case 'tool-allowlist': {
        const allowlistFlag = argsFor('read-only').includes('--enabled-tools') ? '--enabled-tools' : '--tools';
        expect(argsFor('read-only')).toContain(allowlistFlag);
        expect(argsFor('danger-full-access')).not.toContain(allowlistFlag);
        break;
      }
      case 'permission-config': {
        // The narrowing rides in the child's inline config; read-only also names the agent it covers.
        const configFor = (mode: Sandbox): unknown => {
          const built = byMode[mode];
          if (built instanceof Error) throw built;
          const content = (built as BuiltCommand & { env?: Record<string, string> }).env?.OPENCODE_CONFIG_CONTENT;
          return content === undefined ? null : JSON.parse(content);
        };
        expect(argsFor('read-only').filter((arg) => arg !== '--agent' && arg !== 'build')).toEqual(argsFor('danger-full-access'));
        expect(argsFor('read-only')).toContain('--agent');
        expect(configFor('read-only')).toMatchObject({ permission: { '*': 'deny', read: 'allow' } });
        expect(configFor('danger-full-access')).toBeNull();
        break;
      }
      case 'none':
        expect(argsFor('read-only').filter((arg) => !arg.includes('adapter-cap-lineage-')))
          .toEqual(argsFor('danger-full-access').filter((arg) => !arg.includes('adapter-cap-lineage-')));
        break;
    }

    // A config may carry sandboxMode exactly when the command acts on it.
    expect(EXECUTOR_KIND_FLAG_SUPPORT[kind].includes('sandboxMode')).toBe(record.sandboxSurface !== 'none');
  });

  it.each([...EXECUTOR_KINDS])('%s: the cost reader returns the record\'s cost source from its log format', (kind) => {
    const record = EXECUTOR_ADAPTER_CAPABILITIES[kind];
    if (record.logFormat === null) {
      expect(record.costSource).toBe('none');
      expect(readLineageProviderCostUsd(writeLineageLog(null))).toBeNull();
      return;
    }
    const fixture = LOG_FIXTURES[record.logFormat];
    const cost = readLineageProviderCostUsd(writeLineageLog(fixture.text));
    if (record.costSource === 'log') {
      expect(fixture.cost).not.toBeNull();
      expect(cost).toBeCloseTo(fixture.cost as number, 9);
    } else {
      // A kind that cannot report a cost reads as unknown, never as free.
      expect(cost).toBeNull();
    }
  });
});

describe('executor adapter capability record — single-iteration dispatcher', () => {
  it('builds the claude iteration with the record\'s prompt channel and permission surface', () => {
    const record = EXECUTOR_ADAPTER_CAPABILITIES['cli-claude-code'];
    const repoRoot = stubRepo();
    mkdirSync(join(repoRoot, '.skilled', 'agents'), { recursive: true });
    writeFileSync(join(repoRoot, '.skilled', 'agents', 'deep-research.md'), 'persona\n', 'utf8');
    const promptFile = join(repoRoot, 'prompt.md');
    writeFileSync(promptFile, PROMPT, 'utf8');
    const savedPath = process.env.PATH;
    process.env.PATH = stubEnv().PATH;
    try {
      const invocationFor = (sandboxMode: string) => buildClaudeDispatch({
        executorKind: 'cli-claude-code',
        loopType: 'research',
        agent: 'deep-research',
        repoRoot,
        promptFile,
        artifactDir: repoRoot,
        claudeConfigDir: '',
        model: 'claude-opus-4-8',
        reasoningEffort: null,
        serviceTier: null,
        sandboxMode,
        timeoutSeconds: 60,
      }).args;
      expect(record.promptChannel).toBe('argv');
      expect(invocationFor('read-only').some((arg) => arg.endsWith(PROMPT))).toBe(true);
      const mode = (args: string[]) => args[args.indexOf('--permission-mode') + 1];
      expect(mode(invocationFor('read-only'))).not.toBe(mode(invocationFor('danger-full-access')));
    } finally {
      process.env.PATH = savedPath;
    }
  });

  describe.skipIf(detectFromAncestry('cli-codex'))('cli-codex', () => {
    it('sends the codex iteration prompt on stdin and the sandbox mode as a flag', () => {
      const record = EXECUTOR_ADAPTER_CAPABILITIES['cli-codex'];
      const root = makeTempDir('adapter-cap-dispatch-');
      const repo = join(root, 'repo');
      const binDir = join(root, 'bin');
      mkdirSync(binDir);
      mkdirSync(join(repo, 'packet'), { recursive: true });
      mkdirSync(join(repo, '.skilled', 'agents'), { recursive: true });
      writeFileSync(join(repo, '.skilled', 'agents', 'deep-research.md'), 'persona\n', 'utf8');
      writeFileSync(join(root, 'prompt.md'), PROMPT, 'utf8');
      writeFileSync(join(root, 'state.jsonl'), '', 'utf8');
      spawnSync('git', ['init', '-q', repo], { encoding: 'utf8' });
      const recordPath = join(root, 'record.json');
      const shimPath = join(binDir, record.binary);
      writeFileSync(
        shimPath,
        '#!/usr/bin/env node\n'
          + "const fs = require('node:fs');\n"
          + 'const argv = process.argv.slice(2);\n'
          + "if (argv[0] === '--version') { process.stdout.write('codex 0.0.0\\n'); process.exit(0); }\n"
          + "const stdin = fs.readFileSync(0, 'utf8');\n"
          + `fs.writeFileSync(${JSON.stringify(recordPath)}, JSON.stringify({ argv, stdin }));\n`,
        'utf8',
      );
      chmodSync(shimPath, 0o755);

      spawnSync(process.execPath, [
        DISPATCH_SCRIPT,
        '--executor', 'cli-codex',
        '--loop-type', 'research',
        '--repo-root', repo,
        '--prompt-file', join(root, 'prompt.md'),
        '--state-log', join(root, 'state.jsonl'),
        '--packet-dir', join(repo, 'packet'),
        '--artifact-dir', join(repo, 'packet'),
        '--iteration', '1',
        '--generation', '1',
        '--session-id', 's',
        '--model', 'null',
        '--reasoning-effort', 'null',
        '--service-tier', 'null',
        '--sandbox-mode', 'read-only',
        '--timeout-seconds', '60',
      ], {
        cwd: repo,
        encoding: 'utf8',
        timeout: 60_000,
        env: { PATH: `${binDir}:${process.env.PATH}`, HOME: root, TMPDIR: process.env.TMPDIR },
      });

      expect(existsSync(recordPath)).toBe(true);
      const seen = JSON.parse(readFileSync(recordPath, 'utf8')) as { argv: string[]; stdin: string };
      expect(record.promptChannel).toBe('stdin');
      expect(seen.argv).not.toContain(PROMPT);
      // The dispatcher prepends the agent persona, so the prompt arrives inside a larger body.
      expect(seen.stdin).toContain(PROMPT);
      expect(seen.argv[seen.argv.indexOf('--sandbox') + 1]).toBe('read-only');
    });
  });
});
