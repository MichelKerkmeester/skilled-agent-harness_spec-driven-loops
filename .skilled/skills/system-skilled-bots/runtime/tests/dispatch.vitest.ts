import { chmodSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  buildBotPrompt,
  collectKnownSecrets,
  finalAnswerText,
  findSecretLiteral,
  parseDecisionMarker,
  removeLineageFolder,
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
