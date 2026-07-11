// Tests for the CLI dispatch audit trail core. Run: npx vitest run <this file>
import { describe, it, expect } from 'vitest';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  DISPATCH_SHAPES,
  KILL_SWITCH_ENV,
  appendAuditLog,
  buildAuditLine,
  extractDispatchMeta,
  isAuditDisabled,
  matchDispatchShape,
  recordDispatch,
} from './dispatch-audit.mjs';

function makeScratchDir() {
  return mkdtempSync(join(tmpdir(), 'dispatch-audit-test-'));
}

// ── matchDispatchShape ───────────────────────────────────────────────────────────────────────

describe('matchDispatchShape', () => {
  it('recognizes an opencode run dispatch', () => {
    expect(matchDispatchShape('opencode run --model gpt-5.5 "x"')).toEqual({ skill: 'cli-opencode' });
  });

  it('recognizes a claude -p / --print dispatch', () => {
    expect(matchDispatchShape('claude -p "x"')).toEqual({ skill: 'cli-claude-code' });
    expect(matchDispatchShape('claude --print "x"')).toEqual({ skill: 'cli-claude-code' });
  });

  it('fast-exits non-dispatch bash commands', () => {
    expect(matchDispatchShape('git status')).toBeNull();
    expect(matchDispatchShape('ls -la && echo done')).toBeNull();
  });

  it('fast-exits non-string or empty input without throwing', () => {
    expect(matchDispatchShape(undefined)).toBeNull();
    expect(matchDispatchShape(null)).toBeNull();
    expect(matchDispatchShape('')).toBeNull();
    expect(matchDispatchShape(12345)).toBeNull();
  });
});

// ── DISPATCH_SHAPES (single source of truth shared with the lint twin) ─────────────────────────

describe('DISPATCH_SHAPES', () => {
  it('exposes the skill + packetPath pairs the preflight lint twin resolves SKILL.md from', () => {
    expect(DISPATCH_SHAPES.map((shape) => shape.skill)).toEqual(['cli-opencode', 'cli-claude-code']);
    expect(DISPATCH_SHAPES.every((shape) => typeof shape.packetPath === 'string' && shape.test instanceof RegExp)).toBe(true);
  });
});

// ── extractDispatchMeta ──────────────────────────────────────────────────────────────────────

describe('extractDispatchMeta', () => {
  it('parses --model and --agent flags from the command text', () => {
    const meta = extractDispatchMeta('opencode run --model gpt-5.5 --agent orchestrate "x"', {});
    expect(meta.model).toBe('gpt-5.5');
    expect(meta.target).toBe('orchestrate');
  });

  it('reads duration/exit hints from an opaque metadata object, defensively', () => {
    const meta = extractDispatchMeta('opencode run "x"', { metadataObj: { durationMs: 1234, exitCode: 0 } });
    expect(meta.durationMs).toBe(1234);
    expect(meta.exitCode).toBe(0);
  });

  it('computes outputBytes from outputText when present', () => {
    const meta = extractDispatchMeta('opencode run "x"', { outputText: 'hello' });
    expect(meta.outputBytes).toBe(5);
  });

  it('degrades every field to null when metadata is missing entirely', () => {
    const meta = extractDispatchMeta('opencode run "x"', {});
    expect(meta).toEqual({ model: null, target: null, durationMs: null, exitCode: null, outputBytes: null });
  });

  it('never throws on a non-string command or a malformed meta object', () => {
    expect(() => extractDispatchMeta(12345, {})).not.toThrow();
    expect(() => extractDispatchMeta('opencode run "x"', null)).not.toThrow();
    expect(() => extractDispatchMeta('opencode run "x"', { metadataObj: 'not-an-object' })).not.toThrow();
  });

  // Regression: Number(null) === 0, so a present-but-null primary field must not shadow a
  // real later candidate with a false-but-finite zero exit code.
  it('does not misreport a null exitCode as 0 when a later candidate holds the real value', () => {
    const meta = extractDispatchMeta('opencode run "x"', { metadataObj: { exitCode: null, exit: 1 } });
    expect(meta.exitCode).toBe(1);
  });

  it('does not misreport a null durationMs as 0 when a later candidate holds the real value', () => {
    const meta = extractDispatchMeta('opencode run "x"', { metadataObj: { durationMs: null, duration: 500 } });
    expect(meta.durationMs).toBe(500);
  });

  it('still falls through to null when every duration/exit candidate is null or undefined', () => {
    const meta = extractDispatchMeta('opencode run "x"', { metadataObj: { exitCode: null, exit: undefined } });
    expect(meta.exitCode).toBeNull();
  });
});

// ── buildAuditLine ───────────────────────────────────────────────────────────────────────────

describe('buildAuditLine', () => {
  it('produces exactly one parseable JSON line with the expected fields', () => {
    const line = buildAuditLine({
      ts: '2026-07-11T00:00:00.000Z',
      runtime: 'opencode',
      sessionID: 's1',
      callID: 'c1',
      skill: 'cli-opencode',
      command: 'opencode run "hello"',
      model: 'gpt-5.5',
      target: null,
      durationMs: 10,
      exitCode: 0,
      outputBytes: 20,
    });
    expect(typeof line).toBe('string');
    expect(line.includes('\n')).toBe(false);
    const parsed = JSON.parse(line);
    expect(parsed.schema_version).toBe(1);
    expect(parsed.skill).toBe('cli-opencode');
    expect(parsed.command).toBe('opencode run "hello"');
    expect(parsed.commandTruncated).toBe(false);
    expect(parsed.model).toBe('gpt-5.5');
  });

  it('truncates a multi-KB command to the fixed cap and marks it truncated', () => {
    const bigCommand = `opencode run "${'x'.repeat(2000)}"`;
    const parsed = JSON.parse(buildAuditLine({ command: bigCommand }));
    expect(parsed.commandTruncated).toBe(true);
    expect(parsed.command.length).toBeLessThan(bigCommand.length);
  });

  it('leaves embedded newlines inside a single valid JSON line (no raw line breaks in the file)', () => {
    const line = buildAuditLine({ command: 'opencode run "line one\nline two"' });
    expect(line.includes('\n')).toBe(false); // JSON.stringify escapes it to \\n
    const parsed = JSON.parse(line);
    expect(parsed.command).toContain('\n');
  });

  it('scrubs secret-shaped flags, env assignments, bearer tokens, and provider key prefixes', () => {
    const command = [
      'opencode run --api-key sk-liveSuperSecretValue1234567890',
      'MY_APP_TOKEN=abcdEFGH12345678',
      'Authorization: Bearer abcdef123456789',
      'ghp_abcdefghijklmnopqrst',
    ].join(' ');
    const parsed = JSON.parse(buildAuditLine({ command }));
    expect(parsed.command).not.toContain('sk-liveSuperSecretValue1234567890');
    expect(parsed.command).not.toContain('abcdEFGH12345678');
    expect(parsed.command).not.toContain('abcdef123456789');
    expect(parsed.command).not.toContain('ghp_abcdefghijklmnopqrst');
    expect(parsed.command).toContain('[REDACTED]');
  });

  it('degrades to null on an unserializable record rather than throwing', () => {
    const circular = {};
    circular.self = circular;
    expect(() => buildAuditLine({ command: 'x', model: circular })).not.toThrow();
    expect(buildAuditLine({ command: 'x', model: circular })).toBeNull();
  });

  it('handles an empty/non-string command without throwing', () => {
    expect(buildAuditLine({})).not.toBeNull();
    expect(JSON.parse(buildAuditLine({ command: undefined })).command).toBe('');
  });

  // Regression: lowercase/camelCase secret-named env assignments must be redacted, not just
  // the fixed-casing SECRET/TOKEN/API_KEY/PASSWORD forms.
  it('scrubs lowercase and camelCase secret-named env-var assignments', () => {
    const command = 'apiToken=liveSuperSecretAbcdef123 my_secret_token=anotherSecretValue456';
    const parsed = JSON.parse(buildAuditLine({ command }));
    expect(parsed.command).not.toContain('liveSuperSecretAbcdef123');
    expect(parsed.command).not.toContain('anotherSecretValue456');
    expect(parsed.command).toContain('apiToken=[REDACTED]');
  });

  // Regression: underscore-delimited live/test provider key formats (Stripe-style) were missed
  // entirely by the old hyphen-only prefix list.
  it('scrubs underscore-delimited live/test provider key formats', () => {
    const command = 'opencode run --agent x sk_live_abcdefghij0123456789 pk_test_zyxwvutsrq9876543210';
    const parsed = JSON.parse(buildAuditLine({ command }));
    expect(parsed.command).not.toContain('sk_live_abcdefghij0123456789');
    expect(parsed.command).not.toContain('pk_test_zyxwvutsrq9876543210');
  });

  // Regression: a quoted multi-word secret flag value must be redacted in full, not just up to
  // its first space.
  it('scrubs a quoted multi-word secret flag value in full', () => {
    const command = 'opencode run --secret "my secret with spaces" "x"';
    const parsed = JSON.parse(buildAuditLine({ command }));
    expect(parsed.command).not.toContain('my secret with spaces');
    expect(parsed.command).not.toContain('with spaces');
    expect(parsed.command).toContain('[REDACTED]');
  });

  // Regression: model/target are raw command substrings and must be scrubbed + truncated the
  // same as the command field before they reach the serialized line.
  it('scrubs a secret-shaped model field before serialization', () => {
    const line = buildAuditLine({ command: 'x', model: 'sk-liveSuperSecretValue1234567890', target: 'orchestrate' });
    const parsed = JSON.parse(line);
    expect(parsed.model).not.toContain('sk-liveSuperSecretValue1234567890');
    expect(parsed.model).toContain('[REDACTED]');
    expect(parsed.target).toBe('orchestrate');
  });

  // Regression (Fable-5 P2): the env-assignment scrub was not quote-aware, so a quoted
  // multi-word secret leaked its tail after the first space (e.g. `="abc def ghi"` only
  // redacted `abc`, leaving `def ghi"` in the audit line).
  it('scrubs a quoted multi-word env-assignment secret value in full', () => {
    const command = 'OPENAI_API_KEY="abc def ghi" opencode run';
    const parsed = JSON.parse(buildAuditLine({ command }));
    expect(parsed.command).not.toContain('abc def ghi');
    expect(parsed.command).not.toContain('def ghi');
    expect(parsed.command).toContain('OPENAI_API_KEY=[REDACTED]');
  });

  // Regression (Fable-5 P2): header-style credentials fully leaked — neither the colon form
  // (`x-api-key: <value>`) nor `Authorization: Basic <b64>` matched any prior pattern.
  it('scrubs a colon-form header credential (x-api-key: <value>)', () => {
    const command = 'x-api-key: mySecretHeaderValue123 opencode run';
    const parsed = JSON.parse(buildAuditLine({ command }));
    expect(parsed.command).not.toContain('mySecretHeaderValue123');
    expect(parsed.command).toContain('x-api-key: [REDACTED]');
  });

  it('scrubs an Authorization: Basic <b64> header alongside the existing Bearer form', () => {
    const basicCommand = 'Authorization: Basic QWxhZGRpbjpvcGVuc2VzYW1l opencode run';
    const basicParsed = JSON.parse(buildAuditLine({ command: basicCommand }));
    expect(basicParsed.command).not.toContain('QWxhZGRpbjpvcGVuc2VzYW1l');
    expect(basicParsed.command).toContain('Authorization: Basic [REDACTED]');

    const bearerCommand = 'Authorization: Bearer abcdef123456789 opencode run';
    const bearerParsed = JSON.parse(buildAuditLine({ command: bearerCommand }));
    expect(bearerParsed.command).not.toContain('abcdef123456789');
    expect(bearerParsed.command).toContain('Authorization: Bearer [REDACTED]');
  });

  it('scrubs a bare Authorization header value with no Bearer/Basic scheme', () => {
    const command = 'Authorization: rawTokenNoScheme123 opencode run';
    const parsed = JSON.parse(buildAuditLine({ command }));
    expect(parsed.command).not.toContain('rawTokenNoScheme123');
    expect(parsed.command).toContain('Authorization: [REDACTED]');
  });

  it('truncates an oversized target field before serialization', () => {
    const line = buildAuditLine({ command: 'x', target: 'y'.repeat(2000) });
    const parsed = JSON.parse(line);
    expect(parsed.target.length).toBeLessThan(2000);
    expect(parsed.target.endsWith('[truncated]')).toBe(true);
  });

  it('leaves a normal short model/target field untouched', () => {
    const line = buildAuditLine({ command: 'x', model: 'gpt-5.5', target: 'orchestrate' });
    const parsed = JSON.parse(line);
    expect(parsed.model).toBe('gpt-5.5');
    expect(parsed.target).toBe('orchestrate');
  });
});

// ── appendAuditLog ───────────────────────────────────────────────────────────────────────────

describe('appendAuditLog', () => {
  it('writes exactly one parseable JSONL line to a fresh log', () => {
    const dir = makeScratchDir();
    try {
      const logPath = join(dir, 'audit.log');
      const line = buildAuditLine({ command: 'opencode run "x"', skill: 'cli-opencode' });
      expect(appendAuditLog(logPath, line)).toBe(true);

      const lines = readFileSync(logPath, 'utf8').split('\n').filter(Boolean);
      expect(lines.length).toBe(1);
      expect(() => JSON.parse(lines[0])).not.toThrow();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('rotates the primary log to a .1 backup once the size cap is reached', () => {
    const dir = makeScratchDir();
    try {
      const logPath = join(dir, 'audit.log');
      // Directly exceed the size cap on the first write (no rotation on a fresh/missing log).
      expect(appendAuditLog(logPath, 'a'.repeat(520 * 1024))).toBe(true);
      expect(existsSync(`${logPath}.1`)).toBe(false);

      // The next write finds the log past the cap and rotates before appending.
      expect(appendAuditLog(logPath, 'fresh-line')).toBe(true);
      expect(existsSync(`${logPath}.1`)).toBe(true);
      expect(readFileSync(logPath, 'utf8').trim()).toBe('fresh-line');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('is fail-open: an unwritable log path returns false without throwing', () => {
    const dir = makeScratchDir();
    try {
      const blockerFile = join(dir, 'blocker');
      writeFileSync(blockerFile, 'not a directory');
      const logPath = join(blockerFile, 'nested', 'audit.log'); // parent segment is a file

      expect(() => appendAuditLog(logPath, 'line')).not.toThrow();
      expect(appendAuditLog(logPath, 'line')).toBe(false);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('returns false for empty/invalid inputs without throwing', () => {
    expect(appendAuditLog('', 'line')).toBe(false);
    expect(appendAuditLog('/tmp/x.log', '')).toBe(false);
    expect(appendAuditLog(null, null)).toBe(false);
  });
});

// ── isAuditDisabled / KILL_SWITCH_ENV ────────────────────────────────────────────────────────

describe('isAuditDisabled', () => {
  it('is true only when the kill-switch env var is exactly "1"', () => {
    expect(isAuditDisabled({ [KILL_SWITCH_ENV]: '1' })).toBe(true);
    expect(isAuditDisabled({ [KILL_SWITCH_ENV]: 'true' })).toBe(false);
    expect(isAuditDisabled({})).toBe(false);
  });
});

// ── recordDispatch (full pipeline round-trip) ───────────────────────────────────────────────

describe('recordDispatch', () => {
  it('matches a dispatch and writes one audit line end-to-end', () => {
    const dir = makeScratchDir();
    try {
      const logPath = join(dir, 'audit.log');
      const ok = recordDispatch({
        command: 'opencode run --model gpt-5.5 "hello world"',
        logPath,
        runtime: 'opencode',
        sessionID: 's1',
        callID: 'c1',
        outputText: 'ok',
        metadataObj: { durationMs: 42 },
      });
      expect(ok).toBe(true);

      const parsed = JSON.parse(readFileSync(logPath, 'utf8').trim());
      expect(parsed.skill).toBe('cli-opencode');
      expect(parsed.model).toBe('gpt-5.5');
      expect(parsed.durationMs).toBe(42);
      expect(parsed.runtime).toBe('opencode');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('returns false and writes nothing for a non-dispatch command', () => {
    const dir = makeScratchDir();
    try {
      const logPath = join(dir, 'audit.log');
      expect(recordDispatch({ command: 'git status', logPath })).toBe(false);
      expect(existsSync(logPath)).toBe(false);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('honors the kill-switch env var as a full no-op', () => {
    const dir = makeScratchDir();
    try {
      const logPath = join(dir, 'audit.log');
      const ok = recordDispatch({
        command: 'opencode run "x"',
        logPath,
        env: { [KILL_SWITCH_ENV]: '1' },
      });
      expect(ok).toBe(false);
      expect(existsSync(logPath)).toBe(false);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('never throws even when the log path is unwritable', () => {
    const dir = makeScratchDir();
    try {
      const blockerFile = join(dir, 'blocker');
      writeFileSync(blockerFile, 'x');
      const logPath = join(blockerFile, 'nested', 'audit.log');

      expect(() => recordDispatch({ command: 'opencode run "x"', logPath })).not.toThrow();
      expect(recordDispatch({ command: 'opencode run "x"', logPath })).toBe(false);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
