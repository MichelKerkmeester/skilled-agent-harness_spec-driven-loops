import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  SCHEDULED_RUN_LINE,
  WORKING_PLACE_PREFIX,
  buildBotPrompt,
  collectKnownSecrets,
  finalAnswerText,
  findSecretLiteral,
  parseDecisionMarker,
  removeLineageFolder,
  workingPlaceLine,
} from '../lib/dispatch.js';
import { cleanupTemp, tempDir } from './support.js';

afterEach(cleanupTemp);

// Built at run time so no token-shaped literal sits in the repository.
const FAKE_GITHUB_TOKEN = ['ghp', '_', 'A'.repeat(36)].join('');

describe('secret-literal detector', () => {
  const env = { PATH: '/usr/bin:/bin', HOME: '/Users/someone', LANG: 'en_US.UTF-8', PLANTED_TOKEN: 'planted-value-93kd1' };

  it('refuses a body holding a value of a non-allowlisted key, naming the key and never the value', () => {
    const known = collectKnownSecrets(env, null);
    const match = findSecretLiteral('Use planted-value-93kd1 to log in.', known);
    expect(match).toEqual({ kind: 'key', name: 'PLANTED_TOKEN' });
    expect(JSON.stringify(match)).not.toContain('planted-value-93kd1');
  });

  it('ignores values every executor admits, such as PATH and HOME', () => {
    const known = collectKnownSecrets(env, null);
    expect(known.has('PATH')).toBe(false);
    expect(known.has('HOME')).toBe(false);
    expect(findSecretLiteral('Write under /Users/someone/notes.', known)).toBeNull();
  });

  it('ignores absolute-path values outside the allowlist, such as PWD', () => {
    const known = collectKnownSecrets({ ...env, PWD: '/work/acme/tool', OLDPWD: '/work/acme' }, null);
    expect(known.has('PWD')).toBe(false);
    expect(findSecretLiteral('Write notes under /work/acme/tool/notes.', known)).toBeNull();
  });

  it('catches a known token prefix the operator never loaded, and a dotenv value', () => {
    expect(findSecretLiteral(`token: ${FAKE_GITHUB_TOKEN}`, new Map())).toEqual({ kind: 'prefix', name: 'ghp_' });
    const checkout = tempDir();
    writeFileSync(join(checkout, '.env.local'), 'DB_PASSWORD="dotenv-secret-55aa"\nDEBUG=true\n');
    const known = collectKnownSecrets({}, checkout);
    expect(findSecretLiteral('connect with dotenv-secret-55aa', known)).toEqual({ kind: 'key', name: '.env.local:DB_PASSWORD' });
    expect(known.has('.env.local:DEBUG')).toBe(false);
  });

  it('passes ordinary text', () => {
    expect(findSecretLiteral('Review the merged changes and write the findings.', collectKnownSecrets(env, null))).toBeNull();
  });
});

describe('bot prompt', () => {
  it('carries the child-dispatch exemption, the bound spec folder and the decision rule before the body', () => {
    const prompt = buildBotPrompt({ body: 'Tidy the notes.', specFolder: 'specs/demo/001-tidy' });
    expect(prompt).toContain('AI_SESSION_CHILD=1 is set');
    expect(prompt).toContain('autonomous child-dispatch exemption');
    expect(prompt).toContain('Bound spec folder: specs/demo/001-tidy.');
    expect(prompt).toContain('[NEEDS-DECISION]');
    expect(prompt.endsWith('Tidy the notes.')).toBe(true);
  });

  it('names the checkout path for a child that runs outside it, and only then', () => {
    const outside = buildBotPrompt({ body: 'Read notes/today.md.', specFolder: null, checkoutRoot: '/work/acme-tool' });
    const lines = outside.split('\n');
    expect(lines.filter((line) => line.includes('/work/acme-tool'))).toHaveLength(1);
    expect(outside).toContain('The repository checkout is /work/acme-tool.');
    expect(outside.endsWith('Read notes/today.md.')).toBe(true);
    expect(buildBotPrompt({ body: 'x', specFolder: null })).not.toContain('repository checkout is');
  });

  it('says so when no spec folder is bound', () => {
    expect(buildBotPrompt({ body: 'x', specFolder: null })).toContain('Bound spec folder: none.');
  });

  it('tells a scheduled run that it is a firing', () => {
    const lines = buildBotPrompt({ body: 'Do the work.', specFolder: null, scheduled: true }).split('\n');
    expect(lines[0]?.startsWith('You are a non-interactive bot run')).toBe(true);
    expect(lines[1]).toBe('This run was started by its schedule. Do the work now. Do not create or change a schedule.');
    expect(lines[1]).toBe(SCHEDULED_RUN_LINE);
    expect(buildBotPrompt({ body: 'Do the work.', specFolder: null })).not.toContain('This run was started by its schedule');
    expect(buildBotPrompt({ body: 'Do the work.', specFolder: null, scheduled: false })).not.toContain('This run was started by its schedule');
  });
});

describe('decision marker parser', () => {
  it('reads one marker and its options', () => {
    expect(parseDecisionMarker('working\n[NEEDS-DECISION] Merge or PR?\n[OPTION] merge\n[OPTION] open a PR\ndone\n')).toEqual({
      kind: 'question',
      question: 'Merge or PR?',
      options: ['merge', 'open a PR'],
    });
  });

  it('lets the first of two markers win', () => {
    expect(parseDecisionMarker('[NEEDS-DECISION] first?\n[NEEDS-DECISION] second?\n')).toEqual({
      kind: 'question',
      question: 'first?',
      options: null,
    });
  });

  it('reports an empty question and no marker apart', () => {
    expect(parseDecisionMarker('[NEEDS-DECISION] \n')).toEqual({ kind: 'empty' });
    expect(parseDecisionMarker('[NEEDS-DECISION]\n')).toEqual({ kind: 'empty' });
    expect(parseDecisionMarker('all done\n')).toEqual({ kind: 'none' });
  });
});

describe('final answer reader', () => {
  const marker = '[NEEDS-DECISION] Delete the stale notes?\n[OPTION] delete';

  it('reads the marker from a Claude Code stream-json result event', () => {
    const stream = [
      { type: 'system', subtype: 'init', session_id: 's-1' },
      { type: 'assistant', session_id: 's-1', parent_tool_use_id: null, message: { content: [{ type: 'text', text: 'thinking' }] } },
      { type: 'result', subtype: 'success', session_id: 's-1', result: `Looked.\n${marker}` },
    ].map((event) => JSON.stringify(event)).join('\n');
    expect(parseDecisionMarker(stream)).toEqual({ kind: 'none' });
    expect(parseDecisionMarker(finalAnswerText('cli-claude-code', stream) ?? '')).toEqual({
      kind: 'question',
      question: 'Delete the stale notes?',
      options: ['delete'],
    });
  });

  it('reads the DeepSeek Harness final event text, in the observed --json shape', () => {
    const stream = [
      { type: 'session', sessionId: 'session-1', cwd: '/tmp/x' },
      { type: 'text', text: 'partial' },
      { type: 'status', phase: 'turn_end', turn: 1, reason: { kind: 'completed' } },
      { type: 'final', sessionId: 'session-1', reason: { kind: 'completed' }, text: marker },
    ].map((event) => JSON.stringify(event)).join('\n');
    expect(finalAnswerText('cli-deepseek-harness', stream)).toBe(marker);
  });

  it('reads the OpenCode json stream: the text parts of the last message that printed any', () => {
    // The event and part shape of a committed real capture: step_start, text, tool_use and
    // step_finish events, each carrying its part with the message id.
    const event = (type: string, messageID: string, extra: Record<string, unknown> = {}) =>
      JSON.stringify({ type, timestamp: 1, sessionID: 'ses_1', part: { id: `prt_${type}`, messageID, sessionID: 'ses_1', type: type.replace('_', '-'), ...extra } });
    const stream = [
      event('step_start', 'msg_1'),
      event('text', 'msg_1', { text: 'Looking first. [NEEDS-DECISION] not this one' }),
      event('tool_use', 'msg_1', { tool: 'read', state: { status: 'completed' } }),
      event('step_finish', 'msg_1', { reason: 'tool-calls', cost: 0 }),
      event('step_start', 'msg_2'),
      event('text', 'msg_2', { text: 'Read the notes.' }),
      event('text', 'msg_2', { text: marker }),
      event('step_finish', 'msg_2', { reason: 'stop', cost: 0 }),
    ].join('\n');
    expect(finalAnswerText('cli-opencode', stream)).toBe(`Read the notes.\n${marker}`);
    expect(parseDecisionMarker(finalAnswerText('cli-opencode', stream) ?? '')).toMatchObject({ kind: 'question', question: 'Delete the stale notes?' });
    // A stream with no text event has no answer, so no marker can be read from it.
    expect(finalAnswerText('cli-opencode', event('step_finish', 'msg_1', { reason: 'stop' }))).toBe('');
  });

  it('reads plain text kinds as they are, and refuses a kind with no output format', () => {
    expect(finalAnswerText('cli-codex', marker)).toBe(marker);
    expect(finalAnswerText('cli-mistral-vibe', marker)).toBe(marker);
    expect(finalAnswerText('native', marker)).toBeNull();
  });
});

describe('lineage folder removal', () => {
  it('removes a folder whose nested folders have the write bit off', () => {
    const lineage = join(tempDir(), 'lineage');
    mkdirSync(join(lineage, 'home', 'pkg'), { recursive: true });
    writeFileSync(join(lineage, 'home', 'pkg', 'index.js'), '');
    chmodSync(join(lineage, 'home', 'pkg'), 0o500);
    chmodSync(join(lineage, 'home'), 0o500);
    removeLineageFolder(lineage);
    expect(existsSync(lineage)).toBe(false);
  });

  it('warns on stderr instead of throwing when the folder cannot be removed', () => {
    const parent = tempDir();
    const lineage = join(parent, 'lineage');
    mkdirSync(lineage);
    chmodSync(parent, 0o500);
    const warn = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    try {
      expect(() => removeLineageFolder(lineage)).not.toThrow();
      expect(String(warn.mock.calls[0]?.[0])).toContain('could not remove lineage folder');
      expect(existsSync(lineage)).toBe(true);
    } finally {
      warn.mockRestore();
      chmodSync(parent, 0o700);
    }
  });
});

// ───────────────────────────────────────────────────────────────────
// WORKING PLACE LINE
// ───────────────────────────────────────────────────────────────────
//
// The line names the directory a run works in, the branch it is on and the
// run folder, so an operator can tell where an unattended run worked. Its
// slot is fixed: after the spec-folder line and before the checkout line, so
// a later block lands after it without moving it. The three goldens are the
// whole prompt for each shape, compared line by line rather than by a
// substring, so a moved line fails here.

/** A repository-relative path from a fixture, resolved from this file. */
function repoPath(path: string): string {
  return resolve(import.meta.dirname, '..', '..', '..', '..', '..', path);
}

const FIXTURES = 'specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/design/fixtures';

/** The lines of a golden prompt. Each golden ends with one newline, which is not a line. */
function goldenLines(name: string): string[] {
  const text = readFileSync(repoPath(`${FIXTURES}/${name}`), 'utf8');
  return text.replace(/\n$/, '').split('\n');
}

const RF = '/Users/ada/code/hello/.skilled/skills/.state/system-skilled-bots/skilled-scratch%2Fhello/runs/20261125T211204Z-7c1e9a40';
const BODY = '<the BOT.md body>';

describe('working place line', () => {
  it('both shapes', () => {
    const onBranch = workingPlaceLine({ path: '/tmp/wt', branch: 'worktrees/004-bot-hello', runFolder: '/state/runs/r1' });
    expect(onBranch).toBe("Your working place is /tmp/wt on branch worktrees/004-bot-hello. This run's folder is /state/runs/r1.");
    const detached = workingPlaceLine({ path: '/tmp/wt', branch: null, runFolder: '/state/runs/r1' });
    expect(detached).toBe("Your working place is /tmp/wt. This run's folder is /state/runs/r1.");
    expect(detached).toBe(onBranch.replace(' on branch worktrees/004-bot-hello', ''));
    expect(onBranch.startsWith(WORKING_PLACE_PREFIX)).toBe(true);
    expect(detached.startsWith(WORKING_PLACE_PREFIX)).toBe(true);

    const shared = buildBotPrompt({
      body: BODY,
      specFolder: null,
      workingPlace: { path: '/Users/ada/code/hello', branch: 'main', runFolder: RF },
    });
    expect(shared.split('\n')).toEqual(goldenLines('prompt.shared.txt'));

    const detachedPrompt = buildBotPrompt({
      body: BODY,
      specFolder: null,
      workingPlace: { path: '/Users/ada/code/hello', branch: null, runFolder: RF },
    });
    expect(detachedPrompt.split('\n')).toEqual(goldenLines('prompt.detached.txt'));
  });

  it('absent', () => {
    const prompts = [
      buildBotPrompt({ body: 'x', specFolder: null }),
      buildBotPrompt({ body: 'x', specFolder: null, workingPlace: null }),
    ];
    for (const prompt of prompts) {
      expect(prompt.split('\n').filter((line) => line.startsWith(WORKING_PLACE_PREFIX))).toEqual([]);
    }
  });

  it('slot', () => {
    const checkoutPrompt = buildBotPrompt({
      body: BODY,
      specFolder: null,
      checkoutRoot: '/Users/ada/worktrees/004-bot-hello',
      workingPlace: { path: '/Users/ada/worktrees/004-bot-hello', branch: 'worktrees/004-bot-hello', runFolder: RF },
    });
    expect(checkoutPrompt.split('\n')).toEqual(goldenLines('prompt.worktree.txt'));

    const prompts = [
      checkoutPrompt,
      buildBotPrompt({
        body: BODY,
        specFolder: null,
        scheduled: true,
        workingPlace: { path: '/Users/ada/worktrees/004-bot-hello', branch: 'worktrees/004-bot-hello', runFolder: RF },
      }),
      buildBotPrompt({
        body: '[NEEDS-DECISION] a line in the body',
        specFolder: null,
        workingPlace: { path: '/Users/ada/worktrees/004-bot-hello', branch: 'worktrees/004-bot-hello', runFolder: RF },
      }),
    ];
    for (const prompt of prompts) {
      const lines = prompt.split('\n');
      const wp = lines.findIndex((line) => line.startsWith(WORKING_PLACE_PREFIX));
      const spec = lines.findIndex((line) => line.startsWith('Bound spec folder: '));
      const marker = lines.findIndex((line) => line.startsWith('If you reach a decision only a person can make'));
      const checkout = lines.findIndex((line) => line.startsWith('The repository checkout is '));
      const needs = lines.findIndex((line) => line.startsWith('[NEEDS-DECISION]'));
      expect(wp).toBe(spec + 1);
      expect(wp).toBeLessThan(marker);
      if (checkout !== -1) expect(wp).toBeLessThan(checkout);
      if (needs !== -1) expect(wp).toBeLessThan(needs);
    }
  });
});
