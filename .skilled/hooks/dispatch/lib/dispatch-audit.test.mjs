// ───────────────────────────────────────────────────────────────────
// MODULE: Dispatch Audit Core Tests
// ───────────────────────────────────────────────────────────────────
// Run with the pinned binary, because `npx vitest` resolves a different copy:
// .skilled/node_modules/.bin/vitest run .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs

import { chmodSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, it, expect, vi } from 'vitest';

import {
  DISPATCH_SHAPES,
  KILL_SWITCH_ENV,
  appendAuditLog,
  buildAuditLine,
  extractDispatchMeta,
  inspectDispatch,
  isAuditDisabled,
  matchDispatchShape,
  recordDispatch,
  resolveDispatchPacket,
} from './dispatch-audit.mjs';
import { evaluate } from './dispatch-rule-checks.mjs';
import {
  clearOpencodeVersionCache,
  parseOpencodeVersion,
  resolveOpencodeVersion,
  resolveOpencodeVersionSync,
  PROBE_TIMEOUT_MS,
} from './opencode-version.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

// Resolver API: export function parseOpencodeVersion(text) and export function
// resolveOpencodeVersion(binary, { probe, stat, realpath }).
// Both return 'v1' | 'v2' | 'unknown'; resolution memoizes by realpath, size, and mtime.
// PROBE_TIMEOUT_MS is exported.

function makeScratchDir() {
  return mkdtempSync(join(tmpdir(), 'dispatch-audit-test-'));
}

function versionResolverOptions(key, probe) {
  return {
    probe,
    stat: () => ({ size: 42, mtimeMs: 1 }),
    realpath: () => `/virtual/opencode/${key}`,
  };
}

describe('OpenCode version resolution', () => {
  it('R1 — opencode resolves v1 from 1.x probe output', async () => {
    const probe = vi.fn(async () => '1.19.3');

    await expect(resolveOpencodeVersion('opencode', versionResolverOptions('r1', probe))).resolves.toBe('v1');
    expect(probe).toHaveBeenCalledTimes(1);
  });

  it('R2 — opencode2 resolves v2 from v2 probe output', async () => {
    const probe = vi.fn(async () => 'opencode v2.0.32');

    await expect(resolveOpencodeVersion('opencode2', versionResolverOptions('r2', probe))).resolves.toBe('v2');
    expect(probe).toHaveBeenCalledTimes(1);
  });

  it('R3 — opencode2 resolves v1 when the probe reports a v1 version', async () => {
    const probe = vi.fn(async () => '1.19.3');

    await expect(resolveOpencodeVersion('opencode2', versionResolverOptions('r3', probe))).resolves.toBe('v1');
    expect(probe).toHaveBeenCalledTimes(1);
  });

  it('R4 — opencode resolves v2 when the probe reports a v2 version', async () => {
    const probe = vi.fn(async () => 'opencode v2.0.32');

    await expect(resolveOpencodeVersion('opencode', versionResolverOptions('r4', probe))).resolves.toBe('v2');
    expect(probe).toHaveBeenCalledTimes(1);
  });

  it('R5 — empty or unparsable probe output resolves to unknown', async () => {
    const empty = await resolveOpencodeVersion(
      'opencode2',
      versionResolverOptions('r5-empty', async () => ''),
    );
    const unparsable = await resolveOpencodeVersion(
      'opencode2',
      versionResolverOptions('r5-unparsable', async () => 'version unavailable'),
    );

    expect(empty).toBe('unknown');
    expect(unparsable).toBe('unknown');
  });

  it('R6 — a timed-out probe resolves to unknown', async () => {
    const probe = vi.fn()
      .mockImplementationOnce(() => new Promise(() => {}))
      .mockResolvedValueOnce('opencode v2.0.32');
    const options = versionResolverOptions('r6', probe);
    clearOpencodeVersionCache();
    vi.useFakeTimers();
    try {
      const pending = resolveOpencodeVersion('opencode', options);
      await vi.advanceTimersByTimeAsync(0);
      await vi.advanceTimersByTimeAsync(PROBE_TIMEOUT_MS + 1);

      expect(PROBE_TIMEOUT_MS).toBeGreaterThan(0);
      await expect(pending).resolves.toBe('unknown');
      await expect(resolveOpencodeVersion('opencode', options)).resolves.toBe('v2');
      expect(probe).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
      clearOpencodeVersionCache();
    }
  });

  it('R7 — a path-qualified binary resolves to unknown without probing', async () => {
    const probe = vi.fn(async () => 'opencode v2.0.32');

    await expect(
      resolveOpencodeVersion('/abs/path/opencode', versionResolverOptions('r7', probe)),
    ).resolves.toBe('unknown');
    expect(probe).not.toHaveBeenCalled();
  });

  it('R8 — a probe that fails to spawn resolves to unknown', async () => {
    const probe = vi.fn(async () => { throw new Error('spawn failed'); });

    await expect(resolveOpencodeVersion('opencode2', versionResolverOptions('r8', probe))).resolves.toBe('unknown');
    expect(probe).toHaveBeenCalledTimes(1);
  });

  it('does not cache a failed probe when a later attempt succeeds', async () => {
    const probe = vi.fn()
      .mockRejectedValueOnce(new Error('spawn failed'))
      .mockResolvedValueOnce('opencode v2.0.32');
    const options = versionResolverOptions('retry-after-failure', probe);
    clearOpencodeVersionCache();

    try {
      await expect(resolveOpencodeVersion('opencode2', options)).resolves.toBe('unknown');
      await expect(resolveOpencodeVersion('opencode2', options)).resolves.toBe('v2');
      expect(probe).toHaveBeenCalledTimes(2);
    } finally {
      clearOpencodeVersionCache();
    }
  });

  it('does not cache a successful probe with empty output', async () => {
    const probe = vi.fn()
      .mockResolvedValueOnce('')
      .mockResolvedValueOnce('opencode v2.0.32');
    const options = versionResolverOptions('retry-after-empty-output', probe);
    clearOpencodeVersionCache();

    try {
      await expect(resolveOpencodeVersion('opencode2', options)).resolves.toBe('unknown');
      await expect(resolveOpencodeVersion('opencode2', options)).resolves.toBe('v2');
      expect(probe).toHaveBeenCalledTimes(2);
    } finally {
      clearOpencodeVersionCache();
    }
  });

  it('resolveOpencodeVersionSync retries a non-zero probe result', () => {
    const directory = makeScratchDir();
    const binaryPath = join(directory, 'opencode2');
    const counterPath = join(directory, 'probe-count');
    const previousPath = process.env.PATH;
    const previousBinary = process.env.OPENCODE_BIN;
    const previousCounter = process.env.OPENCODE_PROBE_COUNTER;
    const script = [
      '#!/bin/sh',
      "printf '%s\\n' probe >> \"$OPENCODE_PROBE_COUNTER\"",
      'if [ ! -f "$OPENCODE_PROBE_COUNTER.success" ]; then',
      '  : > "$OPENCODE_PROBE_COUNTER.success"',
      '  exit 1',
      'fi',
      "printf '%s\\n' 'opencode v2.0.32'",
    ].join('\n');
    clearOpencodeVersionCache();

    try {
      writeFileSync(binaryPath, script);
      chmodSync(binaryPath, 0o755);
      process.env.PATH = [directory, previousPath].filter(Boolean).join(delimiter);
      delete process.env.OPENCODE_BIN;
      process.env.OPENCODE_PROBE_COUNTER = counterPath;

      expect(resolveOpencodeVersionSync('opencode2')).toBe('unknown');
      expect(resolveOpencodeVersionSync('opencode2')).toBe('v2');
      expect(readFileSync(counterPath, 'utf8').trim().split(/\r?\n/)).toHaveLength(2);
    } finally {
      if (previousPath === undefined) delete process.env.PATH;
      else process.env.PATH = previousPath;
      if (previousBinary === undefined) delete process.env.OPENCODE_BIN;
      else process.env.OPENCODE_BIN = previousBinary;
      if (previousCounter === undefined) delete process.env.OPENCODE_PROBE_COUNTER;
      else process.env.OPENCODE_PROBE_COUNTER = previousCounter;
      clearOpencodeVersionCache();
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it('adversarial — CRLF and trailing whitespace still parse a v1 version', () => {
    expect(parseOpencodeVersion('1.19.3\r\n ')).toBe('v1');
  });

  it('adversarial — joined version tokens choose the first version', () => {
    expect(parseOpencodeVersion('opencode v2.0.32 1.19.3')).toBe('v2');
  });

  it('adversarial — a binary outside the root is unknown without a probe', async () => {
    const probe = vi.fn(async () => '1.19.3');

    await expect(
      resolveOpencodeVersion('/tmp/x/opencode', versionResolverOptions('outside-root', probe)),
    ).resolves.toBe('unknown');
    expect(probe).not.toHaveBeenCalled();
  });

  it('adversarial — empty output is a no-op version result', () => {
    expect(parseOpencodeVersion('')).toBe('unknown');
  });

  it('adversarial — path-qualified, prerelease and joined output keep the same seven answers', () => {
    const pinned = [
      ['', 'unknown'],
      ['opencode2', 'unknown'],
      ['opencode', 'unknown'],
      ['/opt/tools/1.19.3/opencode', 'unknown'],
      ['2.0.32-rc.1', 'v2'],
      ['1.19.3 2.0.32', 'v1'],
      ['opencode v2.0.32\n1.19.3', 'v2'],
    ];
    for (const [sample, answer] of pinned) {
      expect(parseOpencodeVersion(sample), JSON.stringify(sample)).toBe(answer);
    }
  });

  it('adversarial — probe failure keeps shared rules and warns version-specific rules', async () => {
    const version = await resolveOpencodeVersion(
      'opencode2',
      versionResolverOptions('fallback-rules', async () => { throw new Error('probe failed'); }),
    );
    const rules = [
      { id: 'shared-rule', check: 'always-fail', message: 'shared', severity: 'error', appliesTo: ['v1', 'v2'] },
      { id: 'v1-rule', check: 'always-fail', message: 'v1 only', severity: 'error', appliesTo: ['v1'] },
    ];
    const violations = evaluate('opencode run "task"', rules, {
      version,
      checks: { 'always-fail': () => false },
    });

    expect(version).toBe('unknown');
    expect(violations.map(({ id, severity }) => ({ id, severity }))).toEqual([
      { id: 'shared-rule', severity: 'block' },
      { id: 'v1-rule', severity: 'warn' },
    ]);
  });

  it('adversarial — OPENCODE_BIN reaches the injected probe as one argument', async () => {
    const previousBinary = process.env.OPENCODE_BIN;
    const configuredBinary = 'opencode candidate; echo unsafe';
    process.env.OPENCODE_BIN = configuredBinary;
    const probe = vi.fn(async (executable) => {
      expect(executable).toBe(configuredBinary);
      return 'opencode v2.0.32';
    });

    try {
      const version = await resolveOpencodeVersion(
        '$OPENCODE_BIN',
        versionResolverOptions('hostile-env', probe),
      );

      expect(version).toBe('v2');
      expect(probe).toHaveBeenCalledTimes(1);
      expect(probe.mock.calls[0][0]).toBe(configuredBinary);
    } finally {
      if (previousBinary === undefined) delete process.env.OPENCODE_BIN;
      else process.env.OPENCODE_BIN = previousBinary;
    }
  });

  it('uses the command-named binary instead of OPENCODE_BIN', async () => {
    const previousBinary = process.env.OPENCODE_BIN;
    process.env.OPENCODE_BIN = 'opencode';
    const probe = vi.fn(async (executable) => {
      expect(executable).toBe('opencode2');
      return 'opencode v2.0.32';
    });

    try {
      await expect(
        resolveOpencodeVersion('opencode2', versionResolverOptions('named-binary-wins', probe)),
      ).resolves.toBe('v2');
      expect(probe).toHaveBeenCalledTimes(1);
    } finally {
      if (previousBinary === undefined) delete process.env.OPENCODE_BIN;
      else process.env.OPENCODE_BIN = previousBinary;
    }
  });

  it('does not probe a path-qualified OPENCODE_BIN value', async () => {
    const previousBinary = process.env.OPENCODE_BIN;
    process.env.OPENCODE_BIN = '/abs/path/opencode';
    const probe = vi.fn(async () => 'opencode v2.0.32');

    try {
      await expect(
        resolveOpencodeVersion('$OPENCODE_BIN', versionResolverOptions('path-variable-binary', probe)),
      ).resolves.toBe('unknown');
      await expect(
        resolveOpencodeVersion('${OPENCODE_BIN}', versionResolverOptions('path-braced-variable-binary', probe)),
      ).resolves.toBe('unknown');
      expect(probe).not.toHaveBeenCalled();
    } finally {
      if (previousBinary === undefined) delete process.env.OPENCODE_BIN;
      else process.env.OPENCODE_BIN = previousBinary;
    }
  });
});

// ── matchDispatchShape ───────────────────────────────────────────────────────────────────────

describe('matchDispatchShape', () => {
  it('recognizes an opencode run dispatch', () => {
    expect(matchDispatchShape('opencode run --model gpt-5.5 "x"')).toEqual({ skill: 'cli-opencode' });
  });

  it('recognizes a claude -p / --print dispatch', () => {
    expect(matchDispatchShape('claude -p "x"')).toEqual({ skill: 'cli-claude-code' });
    expect(matchDispatchShape('claude --print "x"')).toEqual({ skill: 'cli-claude-code' });
  });

  it('does not expose prose or quoted payloads as direct matches', () => {
    expect(matchDispatchShape('printf "devin -p task"')).toBeNull();
    expect(matchDispatchShape('echo "cursor-agent -p task"')).toBeNull();
    expect(matchDispatchShape('"devin -p task"')).toBeNull();
  });

  it('records a quote-safe command-position executor as a direct dispatch', () => {
    expect(matchDispatchShape('"devin" -p "task"')).toEqual({ skill: 'cli-devin' });
    expect(matchDispatchShape('"/usr/local/bin/pi" --offline -p "x"')).toEqual({ skill: 'cli-pi' });
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

// ── inspectDispatch ─────────────────────────────────────────────────────────────────────────

describe('inspectDispatch', () => {
  it.each([
    ['direct OpenCode', 'opencode run "task"', { kind: 'direct', executor: 'cli-opencode' }],
    ['direct Claude', 'claude --print "task"', { kind: 'direct', executor: 'cli-claude-code' }],
    ['direct Codex', 'codex exec --full-auto -p "task"', { kind: 'direct', executor: 'cli-codex' }],
    ['direct Devin', 'devin -p "task"', { kind: 'direct', executor: 'cli-devin' }],
    ['direct Cursor', 'cursor-agent -p "task"', { kind: 'direct', executor: 'cli-cursor' }],
    ['direct Pi', 'pi --offline -p "task"', { kind: 'direct', executor: 'cli-pi' }],
    ['transparent env wrapper', 'env KEY=value devin -p "task"', { kind: 'direct', executor: 'cli-devin' }],
    ['prose payload', 'printf "devin -p task"', { kind: 'none' }],
    ['echo payload', 'echo "cursor-agent -p task"', { kind: 'none' }],
    ['quoted prose', '"devin -p task"', { kind: 'none' }],
    // A quote-safe command-position executor is the unquoted binary by another name; quoting it
    // must not drop the command out of authorization or the audit trail.
    ['quote-safe executor', '"devin" -p "task"', { kind: 'direct', executor: 'cli-devin' }],
    ['quote-safe path executor', '"/usr/local/bin/cursor-agent" -p task', { kind: 'direct', executor: 'cli-cursor' }],
    ['quoted executor without print flag', '"devin" auth status', { kind: 'none' }],
    ['bare executor without print flag', 'devin auth status', { kind: 'none' }],
    // A bare pi CLI subcommand (list/auth/doctor/...) is not a dispatch: no print flag, no
    // payload. The preflight lint must not treat it as ambiguous dispatch evidence.
    ['bare pi subcommand', 'pi list', { kind: 'none' }],
    ['bare pi flagless run', 'pi --offline --approve', { kind: 'none' }],
    // A print flag in an unrelated segment must not turn a bare executor token elsewhere
    // into dispatch evidence (echo -p prints a literal flag).
    ['stray print flag in unrelated segment', 'git status && echo -p && devin auth status', { kind: 'none' }],
    ['quoted executor as an argument stays prose', 'echo "devin" -p "hi"', { kind: 'none' }],
    ['variable executor', '$CLI -p task', { kind: 'ambiguous' }],
    ['alias-shaped command', 'alias d=devin; d -p task', { kind: 'ambiguous' }],
    ['command substitution', '$(devin -p task)', { kind: 'ambiguous' }],
    ['quoted command substitution', 'echo "$(devin -p task)"', { kind: 'ambiguous' }],
    ['unknown wrapper', 'unknown-wrapper devin -p task', { kind: 'ambiguous' }],
    ['variable prompt', 'devin -p "$TASK"', { kind: 'ambiguous' }],
    ['print flag beside a variable argument', 'mkdir -p "$DIR"', { kind: 'none' }],
    ['node print flag beside a variable argument', 'node -p "$EXPR"', { kind: 'none' }],
    ['bash -c wrapped dispatch', "bash -c 'devin -p task'", { kind: 'direct', executor: 'cli-devin' }],
    ['sh -c wrapped dispatch', "sh -c 'opencode run task'", { kind: 'direct', executor: 'cli-opencode' }],
    ['zsh -c wrapped dispatch', "zsh -c 'codex exec task'", { kind: 'direct', executor: 'cli-codex' }],
    // A double-quoted payload ends at its closing quote, not at the first escaped one inside it.
    ['bash -c payload with escaped quotes', String.raw`bash -c "devin -p \"fix the bug\" </dev/null"`, { kind: 'direct', executor: 'cli-devin' }],
    ['bash -c payload with an escaped quoted path', String.raw`bash -c "cd \"/tmp/my dir\" && devin -p task </dev/null"`, { kind: 'direct', executor: 'cli-devin' }],
    // An expansion inside the payload still fails closed, so `bash -c "$CMD"` never reads as none.
    ['bash -c payload with an expansion', String.raw`bash -c "cd \"$DIR\" && devin -p task </dev/null"`, { kind: 'ambiguous' }],
    ['bash -c payload that only quotes a dispatch', String.raw`bash -c "echo \"devin -p task\""`, { kind: 'none' }],
    // Every wrapper is read, so a dispatch in a later wrapper is still seen.
    ['dispatch in the second of two wrappers', String.raw`bash -c 'true' ; bash -c "devin -p task </dev/null"`, { kind: 'direct', executor: 'cli-devin' }],
    ['dispatches in two wrappers', "bash -c 'devin -p task' ; sh -c 'opencode run task'", { kind: 'ambiguous' }],
    ['two dispatch segments', 'devin -p task && cursor-agent -p task', { kind: 'ambiguous' }],
    ['unsupported redirection without dispatch', 'cat x >> out', { kind: 'none' }],
    ['pipeline without dispatch', 'npm run build 2>&1 | tee log', { kind: 'none' }],
    ['heredoc without dispatch', 'cat <<EOF\nplain text\nEOF', { kind: 'none' }],
    ['unbalanced non-dispatch quote', 'echo "plain text', { kind: 'none' }],
  ])('%s', (_name, command, expected) => {
    expect(inspectDispatch(command)).toEqual(expected);
  });

  it('inspects a dispatch segment without borrowing a match from another segment', () => {
    expect(inspectDispatch('printf "devin -p task"; git status')).toEqual({ kind: 'none' });
    expect(inspectDispatch('git status && devin -p task')).toEqual({ kind: 'direct', executor: 'cli-devin' });
  });

  it('bounds malformed and overlong input without throwing', () => {
    expect(inspectDispatch('devin -p "unterminated')).toEqual({ kind: 'ambiguous' });
    expect(inspectDispatch('x'.repeat(100_000))).toEqual({ kind: 'none' });
    expect(inspectDispatch(null)).toEqual({ kind: 'none' });
  });
});

// ── resolveDispatchPacket ───────────────────────────────────────────────────────────────────

describe('resolveDispatchPacket', () => {
  const packetFor = (skill) => DISPATCH_SHAPES.find((shape) => shape.skill === skill);

  it.each([
    ['nohup', 'nohup opencode run --model x "hi" </dev/null', 'cli-opencode'],
    ['command builtin', 'command opencode run --model x "hi"', 'cli-opencode'],
    ['negation', '! opencode run --model x "hi"', 'cli-opencode'],
    ['subshell', '( opencode run --model x "hi" )', 'cli-opencode'],
    ['env -S double quotes', 'env -S "codex exec hi"', 'cli-codex'],
    ['env -S single quotes', "env -S 'codex exec hi'", 'cli-codex'],
    // The prefixes compose; four unwraps is what the bound has to reach.
    ['nested wrappers', String.raw`! nohup env VAR=1 perl -e 'alarm 300; exec @ARGV' -- opencode run --model x "hi"`, 'cli-opencode'],
  ])('resolves a dispatch behind %s', (_name, command, skill) => {
    expect(resolveDispatchPacket(command)).toEqual(packetFor(skill));
  });

  it('does not unwrap a name lookup', () => {
    expect(resolveDispatchPacket('command -v opencode')).toBeNull();
  });
});

// ── DISPATCH_SHAPES (single source of truth shared with the lint twin) ─────────────────────────

describe('DISPATCH_SHAPES', () => {
  it('exposes the skill + packetPath pairs the preflight lint twin resolves SKILL.md from', () => {
    expect(DISPATCH_SHAPES.map((shape) => shape.skill)).toEqual([
      'cli-opencode', 'cli-claude-code', 'cli-codex', 'cli-devin', 'cli-cursor', 'cli-pi', 'cli-hermes',
      'cli-classifier',
    ]);
    expect(DISPATCH_SHAPES.every((shape) => typeof shape.packetPath === 'string' && shape.test instanceof RegExp)).toBe(true);
    // The Jev transport is a mode of the classifier hub; its row has to name that packet, or
    // the preflight reads a path that is not there and the eight rules fail open.
    expect(DISPATCH_SHAPES.find((shape) => shape.skill === 'cli-classifier').packetPath).toBe('cli-classifier/cli-jev');
  });

  it('resolves every shape to a SKILL.md that exists, because a missing one fails open', () => {
    for (const shape of DISPATCH_SHAPES) {
      const skillMd = join(HERE, '..', '..', '..', 'skills', shape.packetPath, 'SKILL.md');
      expect(existsSync(skillMd), `${shape.skill} resolves ${shape.packetPath}/SKILL.md`).toBe(true);
    }
  });

  it('recognizes each external CLI print-mode dispatch and ignores non-dispatch bash', () => {
    const skillFor = (cmd) => (DISPATCH_SHAPES.find((s) => s.test.test(cmd)) || {}).skill || null;
    expect(skillFor('opencode run "x" </dev/null')).toBe('cli-opencode');
    expect(skillFor('claude -p "x"')).toBe('cli-claude-code');
    expect(skillFor('codex exec --full-auto -p "x"')).toBe('cli-codex');
    expect(skillFor('devin -p "x" </dev/null')).toBe('cli-devin');
    expect(skillFor('cursor-agent -p "x" --model composer-2.5')).toBe('cli-cursor');
    expect(skillFor('hermes chat -Q --oneshot --query-file - --yolo </dev/null')).toBe('cli-hermes');
    expect(skillFor('hermes chat -q "x" </dev/null')).toBe('cli-hermes');
    expect(skillFor('hermes -z "x"')).toBe('cli-hermes');
    expect(skillFor('hermes chat')).toBeNull();
    expect(skillFor('hermes skills list')).toBeNull();
    expect(skillFor('grep -q pattern file.txt')).toBeNull();
    expect(skillFor('pi --offline -p "x" </dev/null')).toBe('cli-pi');
    // A bare interactive launch (no print flag) or unrelated bash is never a dispatch.
    expect(skillFor('devin auth status')).toBe(null);
    expect(skillFor('cursor-agent --help')).toBe(null);
    expect(skillFor('git status && ls -la')).toBe(null);
    // A print flag after a shell separator belongs to the second command, not the first.
    expect(skillFor('pi install && claude -p "x"')).toBe('cli-claude-code');
    // Jev's judgment subcommand is its own dispatch evidence, and its management commands are not.
    expect(skillFor('jev noul -q "Is it urgent?" -s @state.txt')).toBe('cli-classifier');
    expect(skillFor('jev choice -q "Which queue?" -s @state.txt -o a=first -o b=second')).toBe('cli-classifier');
    expect(skillFor('jev score -q "How severe?" -s @state.txt -l low -l high')).toBe('cli-classifier');
    expect(skillFor('jev run @request.json --pretty')).toBe('cli-classifier');
    expect(skillFor('jev --version')).toBeNull();
    expect(skillFor('jev auth status')).toBeNull();
    expect(skillFor('jev install-skills --global')).toBeNull();
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

  // Quoted env values must be redacted fully so their whitespace-delimited tails cannot leak.
  it('scrubs a quoted multi-word env-assignment secret value in full', () => {
    const command = 'OPENAI_API_KEY="abc def ghi" opencode run';
    const parsed = JSON.parse(buildAuditLine({ command }));
    expect(parsed.command).not.toContain('abc def ghi');
    expect(parsed.command).not.toContain('def ghi');
    expect(parsed.command).toContain('OPENAI_API_KEY=[REDACTED]');
  });

  // Header credentials need full-value scrubbing to prevent colon-form values from leaking.
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

  it('scrubs a bare PEM private-key block with no surrounding keyword', () => {
    const command = 'echo "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAtest\nmore body lines here\n-----END RSA PRIVATE KEY-----" | some-cli';
    const parsed = JSON.parse(buildAuditLine({ command }));
    expect(parsed.command).not.toContain('MIIEowIBAAKCAQEAtest');
    expect(parsed.command).toContain('[REDACTED]');
    expect(parsed.command).not.toContain('-----BEGIN RSA PRIVATE KEY-----');
  });

  it('scrubs a bare JWT with no surrounding keyword', () => {
    const jwt = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
    const parsed = JSON.parse(buildAuditLine({ command: `curl -H "X-Custom: ${jwt}" opencode run` }));
    expect(parsed.command).not.toContain(jwt);
    expect(parsed.command).toContain('[REDACTED]');
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
