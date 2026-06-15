import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../');
const SCRIPTS = path.join(WORKSPACE_ROOT, '.opencode/skills/deep-loop-workflows/improvement/scripts');
const require = createRequire(import.meta.url);

const DISPATCH_MODEL_PATH = path.join(SCRIPTS, 'model-benchmark/dispatch-model.cjs');
const dispatchModel = require(DISPATCH_MODEL_PATH) as {
  dispatch: (opts: Record<string, unknown>) => Envelope;
  dispatchReal: (opts: Record<string, unknown>) => Envelope;
  dispatchMock: (opts: Record<string, unknown>) => Envelope;
  buildEnvelope: (
    raw: Record<string, unknown>,
    resolved: Record<string, unknown>,
    executor: string | null,
    latencyMs: number,
  ) => Envelope;
  parseOpencodeStream: (stdout: string) => {
    output: string;
    tokens_in: number | null;
    tokens_out: number | null;
    cost_usd: number | null;
    usage_parser_status: 'parsed' | 'absent' | 'error';
  };
  deriveProvider: (slug: unknown) => string | null;
};

type Envelope = {
  ok: boolean;
  exit_code?: number;
  stdout?: string;
  attempts?: number;
  mock?: boolean;
  latency_ms: number | null;
  executor: string | null;
  provider: string | null;
  model: string | null;
  variant: string | null;
  tokens_in: number | null;
  tokens_out: number | null;
  cost_usd: number | null;
  output?: string;
  usage_parser_status?: string;
};

// A newline-delimited OpenCode event stream with NO usage fields. The text events
// match the confirmed shape (type:'text', part.text, part.time.start); ordering
// is intentionally out-of-order to prove the parser sorts by start time.
const STREAM_NO_USAGE = [
  JSON.stringify({ type: 'text', part: { text: 'world', time: { start: 200 } } }),
  JSON.stringify({ type: 'step-start', part: {} }),
  JSON.stringify({ type: 'text', part: { text: 'hello ', time: { start: 100 } } }),
].join('\n');

// Same text events, plus a terminal event that DOES expose usage. This proves the
// parser extracts real numbers when present (so "null" elsewhere is honest
// absence, not a parser that can only ever return null).
const STREAM_WITH_USAGE = [
  JSON.stringify({ type: 'text', part: { text: 'done', time: { start: 50 } } }),
  JSON.stringify({
    type: 'session.completed',
    usage: { input: 1234, output: 567 },
    cost: 0.0042,
  }),
].join('\n');

describe('parseOpencodeStream: assistant text + nullable usage', () => {
  it('assembles assistant text from a multi-event stream, ordered by start time', () => {
    const parsed = dispatchModel.parseOpencodeStream(STREAM_NO_USAGE);
    expect(parsed.output).toBe('hello world');
  });

  it('returns null usage with status "absent" when events expose no usage', () => {
    const parsed = dispatchModel.parseOpencodeStream(STREAM_NO_USAGE);
    expect(parsed.tokens_in).toBeNull();
    expect(parsed.tokens_out).toBeNull();
    expect(parsed.cost_usd).toBeNull();
    expect(parsed.usage_parser_status).toBe('absent');
  });

  it('extracts real usage with status "parsed" when events expose it', () => {
    const parsed = dispatchModel.parseOpencodeStream(STREAM_WITH_USAGE);
    expect(parsed.output).toBe('done');
    expect(parsed.tokens_in).toBe(1234);
    expect(parsed.tokens_out).toBe(567);
    expect(parsed.cost_usd).toBe(0.0042);
    expect(parsed.usage_parser_status).toBe('parsed');
  });

  it('is defensive: a malformed/non-JSON stream yields empty output, null usage, status "error"', () => {
    const parsed = dispatchModel.parseOpencodeStream('not json at all\nstill not json');
    expect(parsed.output).toBe('');
    expect(parsed.tokens_in).toBeNull();
    expect(parsed.tokens_out).toBeNull();
    expect(parsed.cost_usd).toBeNull();
    expect(parsed.usage_parser_status).toBe('error');
  });

  it('is defensive: an empty stream yields empty output, null usage, status "error"', () => {
    const parsed = dispatchModel.parseOpencodeStream('');
    expect(parsed.output).toBe('');
    expect(parsed.usage_parser_status).toBe('error');
  });

  it('never fabricates a zero: a non-finite usage value coerces to null', () => {
    const stream = JSON.stringify({
      type: 'session.completed',
      usage: { input: 'oops', output: null },
      cost: 'free',
    });
    const parsed = dispatchModel.parseOpencodeStream(stream);
    expect(parsed.tokens_in).toBeNull();
    expect(parsed.tokens_out).toBeNull();
    expect(parsed.cost_usd).toBeNull();
  });
});

describe('deriveProvider: provider from model slug prefix', () => {
  it('derives the provider segment from a provider/model slug', () => {
    expect(dispatchModel.deriveProvider('minimax-coding-plan/MiniMax-M2.7-highspeed')).toBe(
      'minimax-coding-plan',
    );
    expect(dispatchModel.deriveProvider('anthropic/claude-opus')).toBe('anthropic');
  });

  it('returns null for a bare slug with no provider prefix', () => {
    expect(dispatchModel.deriveProvider('claude-opus')).toBeNull();
    expect(dispatchModel.deriveProvider('')).toBeNull();
    expect(dispatchModel.deriveProvider(null)).toBeNull();
    expect(dispatchModel.deriveProvider(123)).toBeNull();
  });

  it('returns null when the slash is leading (no provider segment)', () => {
    expect(dispatchModel.deriveProvider('/leading')).toBeNull();
  });
});

describe('buildEnvelope: additive normalized shape over a raw result', () => {
  it('preserves existing raw keys and adds the envelope fields', () => {
    const raw = { ok: true, exit_code: 0, stdout: 'plain text', stderr: '', attempts: 1 };
    const env = dispatchModel.buildEnvelope(
      raw,
      { model: 'anthropic/claude-opus', variant: 'high' },
      'cli-claude-code',
      42,
    );
    // Existing keys survive (ADD, not rename).
    expect(env.ok).toBe(true);
    expect(env.exit_code).toBe(0);
    expect(env.stdout).toBe('plain text');
    expect(env.attempts).toBe(1);
    // Envelope fields layered on top.
    expect(env.latency_ms).toBe(42);
    expect(env.executor).toBe('cli-claude-code');
    expect(env.model).toBe('anthropic/claude-opus');
    expect(env.variant).toBe('high');
    expect(env.provider).toBe('anthropic');
    // A plain-text executor's output is its stdout; usage stays null.
    expect(env.output).toBe('plain text');
    expect(env.tokens_in).toBeNull();
    expect(env.tokens_out).toBeNull();
    expect(env.cost_usd).toBeNull();
  });

  it('parses the cli-opencode event stream into clean output + usage', () => {
    const raw = { ok: true, exit_code: 0, stdout: STREAM_WITH_USAGE, stderr: '', attempts: 1 };
    const env = dispatchModel.buildEnvelope(
      raw,
      { model: 'minimax-coding-plan/MiniMax-M2.7-highspeed', variant: null },
      'cli-opencode',
      7,
    );
    expect(env.output).toBe('done');
    expect(env.tokens_in).toBe(1234);
    expect(env.tokens_out).toBe(567);
    expect(env.cost_usd).toBe(0.0042);
    expect(env.usage_parser_status).toBe('parsed');
    expect(env.provider).toBe('minimax-coding-plan');
  });

  it('falls back to raw stdout when the cli-opencode stream is malformed', () => {
    const raw = { ok: true, exit_code: 0, stdout: 'raw non-stream output', stderr: '', attempts: 1 };
    const env = dispatchModel.buildEnvelope(raw, { model: 'm', variant: null }, 'cli-opencode', 3);
    expect(env.output).toBe('raw non-stream output');
    expect(env.usage_parser_status).toBe('error');
    expect(env.tokens_in).toBeNull();
  });
});

describe('dispatchMock: envelope populates with null usage', () => {
  let promptFile: string;
  let dir: string;
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'env-mock-'));
    promptFile = path.join(dir, 'p.md');
    fs.writeFileSync(promptFile, 'mock prompt');
  });
  afterEach(() => { fs.rmSync(dir, { recursive: true, force: true }); });

  it('latency_ms is a finite number >= 0', () => {
    const env = dispatchModel.dispatchMock({ prompt_file: promptFile, mock: true });
    expect(typeof env.latency_ms).toBe('number');
    expect(Number.isFinite(env.latency_ms as number)).toBe(true);
    expect(env.latency_ms as number).toBeGreaterThanOrEqual(0);
  });

  it('envelope carries executor, model, and variant', () => {
    const env = dispatchModel.dispatchMock({
      prompt_file: promptFile,
      mock: true,
      executor: 'cli-opencode',
      model: 'minimax-coding-plan/MiniMax-M2.7-highspeed',
      variant: 'fast',
    });
    expect(env.executor).toBe('cli-opencode');
    expect(env.model).toBe('minimax-coding-plan/MiniMax-M2.7-highspeed');
    expect(env.variant).toBe('fast');
    expect(env.provider).toBe('minimax-coding-plan');
  });

  it('tokens and cost are null in mock (never fabricated), output carries the mock text', () => {
    const env = dispatchModel.dispatchMock({
      prompt_file: promptFile,
      mock: true,
      mock_mode: 'high-score',
      executor: 'cli-opencode',
    });
    expect(env.tokens_in).toBeNull();
    expect(env.tokens_out).toBeNull();
    expect(env.cost_usd).toBeNull();
    // Even with executor cli-opencode, the mock's plain-text stdout is the output
    // (it is NOT routed through the JSON-stream parser).
    expect(typeof env.output).toBe('string');
    expect(env.output as string).toContain('formatBytes');
  });
});

describe('dispatchReal: envelope on a stubbed cli-opencode success', () => {
  let promptFile: string;
  let dir: string;
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'env-real-'));
    promptFile = path.join(dir, 'p.md');
    fs.writeFileSync(promptFile, 'real prompt');
  });
  afterEach(() => { fs.rmSync(dir, { recursive: true, force: true }); });

  it('wraps a stubbed cli-opencode JSON-stream result into the envelope', () => {
    const fakeSpawn = () => ({ status: 0, stdout: STREAM_WITH_USAGE, stderr: '' });
    const env = dispatchModel.dispatchReal({
      executor: 'cli-opencode',
      prompt_file: promptFile,
      cwd: dir,
      model: 'minimax-coding-plan/MiniMax-M2.7-highspeed',
      agent: 'general',
      variant: 'fast',
      _spawn: fakeSpawn,
    });
    expect(env.ok).toBe(true);
    expect(typeof env.latency_ms).toBe('number');
    expect(env.latency_ms as number).toBeGreaterThanOrEqual(0);
    expect(env.executor).toBe('cli-opencode');
    expect(env.provider).toBe('minimax-coding-plan');
    expect(env.variant).toBe('fast');
    // Clean assistant text was parsed out of the event stream.
    expect(env.output).toBe('done');
    expect(env.tokens_in).toBe(1234);
    expect(env.tokens_out).toBe(567);
    expect(env.cost_usd).toBe(0.0042);
  });

  it('adds the --format json flag to the cli-opencode spawn args', () => {
    let capturedArgs: string[] = [];
    const fakeSpawn = (_bin: string, args: string[]) => {
      capturedArgs = args;
      return { status: 0, stdout: STREAM_NO_USAGE, stderr: '' };
    };
    dispatchModel.dispatchReal({
      executor: 'cli-opencode',
      prompt_file: promptFile,
      cwd: dir,
      model: 'm',
      agent: 'general',
      _spawn: fakeSpawn,
    });
    const fmtIdx = capturedArgs.indexOf('--format');
    expect(fmtIdx).toBeGreaterThanOrEqual(0);
    expect(capturedArgs[fmtIdx + 1]).toBe('json');
    // The prompt is the final positional arg, AFTER --format json.
    expect(capturedArgs[capturedArgs.length - 1]).toBe('real prompt');
    expect(fmtIdx).toBeLessThan(capturedArgs.length - 1);
  });

  it('keeps usage null when the stubbed stream exposes none', () => {
    const fakeSpawn = () => ({ status: 0, stdout: STREAM_NO_USAGE, stderr: '' });
    const env = dispatchModel.dispatchReal({
      executor: 'cli-opencode',
      prompt_file: promptFile,
      cwd: dir,
      model: 'm',
      agent: 'general',
      _spawn: fakeSpawn,
    });
    expect(env.output).toBe('hello world');
    expect(env.tokens_in).toBeNull();
    expect(env.tokens_out).toBeNull();
    expect(env.cost_usd).toBeNull();
    expect(env.usage_parser_status).toBe('absent');
  });
});
