// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension Tests - Decision Capture
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { queueFile, readQueue } from '../lib/capture-core.mjs';
import decisionCapture from './decision-capture';

import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';

type Handler = (event: unknown, context: unknown) => unknown;

const SESSION_ID = 'pi-session-test';
const CALL_ID = 'call-option';
const QUESTION_INPUT = {
  questions: [{
    question: 'Which color?',
    header: 'Color',
    multiSelect: false,
    options: [{ label: 'red' }, { label: 'blue' }],
  }],
};
const ANSWER_DETAILS = {
  answers: [{
    questionIndex: 0,
    question: 'Which color?',
    kind: 'option',
    answer: 'red',
    selected: ['red'],
  }],
  cancelled: false,
};
const ENV_KEYS = [
  'HOOK_FLAGS_CONFIG',
  'SYSTEM_HOOKS_DISABLED',
  'SYSTEM_DECISION_CAPTURE_DISABLED',
];
const originalEnv = new Map(ENV_KEYS.map((key) => [key, process.env[key]]));
const SWEEP_SCRIPT = join(dirname(fileURLToPath(import.meta.url)), '../bin/sweep-pi.mjs');

let projectDir: string;
let notifications: Array<{ message: string; type?: string }>;

function makeExtensionApi(): { api: ExtensionAPI; handlers: Map<string, Handler[]> } {
  const handlers = new Map<string, Handler[]>();
  const api = {
    on(event: string, handler: Handler) {
      const registered = handlers.get(event) ?? [];
      registered.push(handler);
      handlers.set(event, registered);
    },
  } as unknown as ExtensionAPI;
  return { api, handlers };
}

function toolResult(overrides: Record<string, unknown> = {}) {
  return {
    type: 'tool_result',
    toolName: 'ask_user_question',
    toolCallId: CALL_ID,
    input: QUESTION_INPUT,
    isError: false,
    details: ANSWER_DETAILS,
    ...overrides,
  };
}

// A null argument stands for "no session id"; undefined would pick up the default.
function context(sessionId: string | null = SESSION_ID) {
  return {
    cwd: projectDir,
    hasUI: true,
    ui: {
      notify: (message: string, type?: string) => {
        notifications.push({ message, type });
      },
    },
    sessionManager: { getSessionId: () => sessionId ?? undefined },
  };
}

function queueLines(): string[] {
  const filePath = queueFile(projectDir, SESSION_ID);
  if (!existsSync(filePath)) return [];
  return readFileSync(filePath, 'utf8').split('\n').filter(Boolean);
}

describe('Pi decision capture', () => {
  beforeEach(() => {
    for (const key of ENV_KEYS) delete process.env[key];
    projectDir = mkdtempSync(join(tmpdir(), 'decision-capture-pi-'));
    process.env.HOOK_FLAGS_CONFIG = join(projectDir, 'missing-hook-flags.json');
    notifications = [];
  });

  afterEach(() => {
    for (const [key, value] of originalEnv) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    rmSync(projectDir, { recursive: true, force: true });
  });

  it('queues an answered option with the sweep key and leaves the result unchanged', () => {
    const { api, handlers } = makeExtensionApi();
    expect(decisionCapture(api)).toBeUndefined();
    const handler = handlers.get('tool_result')?.[0];
    expect(handler).toBeTypeOf('function');

    const result = handler?.(toolResult(), context());

    expect(result).toBeUndefined();
    expect(queueLines()).toHaveLength(1);
    expect(readQueue(projectDir, SESSION_ID)).toEqual([
      expect.objectContaining({
        key: `pi:${SESSION_ID}:${CALL_ID}:0`,
        answer: 'red',
        source: 'hook',
      }),
    ]);
  });

  it('notifies once for a newly captured answer at turn end', () => {
    const { api, handlers } = makeExtensionApi();
    decisionCapture(api);
    const toolResultHandler = handlers.get('tool_result')?.[0];
    const turnEndHandler = handlers.get('turn_end')?.[0];

    expect(toolResultHandler?.(toolResult(), context())).toBeUndefined();
    expect(turnEndHandler?.({}, context())).toBeUndefined();
    expect(notifications).toEqual([
      expect.objectContaining({
        message: expect.stringMatching(/^1 operator answer/),
        type: 'info',
      }),
    ]);

    expect(turnEndHandler?.({}, context())).toBeUndefined();
    expect(notifications).toHaveLength(1);
  });

  it('queues an answer from the pi-plan-build question tool under the sweep key', () => {
    const { api, handlers } = makeExtensionApi();
    decisionCapture(api);
    const handler = handlers.get('tool_result')?.[0];
    const question = 'Which colour should the status badge use?';

    expect(handler?.(toolResult({
      toolName: 'question',
      input: {
        questions: [{
          question,
          header: 'Badge colour',
          options: [{ label: 'Amber' }, { label: 'Teal' }],
          multiple: false,
        }],
      },
      details: { answers: [{ question, header: 'Badge colour', answers: ['Amber'], custom: false }] },
    }), context())).toBeUndefined();

    expect(readQueue(projectDir, SESSION_ID)).toEqual([
      expect.objectContaining({
        key: `pi:${SESSION_ID}:${CALL_ID}:0`,
        answer: 'Amber',
        source: 'hook',
      }),
    ]);
  });

  it('joins multi-select answers with comma-space', () => {
    const { api, handlers } = makeExtensionApi();
    decisionCapture(api);
    const handler = handlers.get('tool_result')?.[0];
    const event = toolResult({
      input: {
        questions: [{
          question: 'Which letters?',
          header: 'Letters',
          multiSelect: true,
          options: [{ label: 'a' }, { label: 'b' }],
        }],
      },
      details: {
        answers: [{
          questionIndex: 0,
          question: 'Which letters?',
          kind: 'multi',
          answer: 'a, b',
          selected: ['a', 'b'],
        }],
        cancelled: false,
      },
    });

    expect(handler?.(event, context())).toBeUndefined();
    expect(readQueue(projectDir, SESSION_ID)).toEqual([
      expect.objectContaining({
        key: `pi:${SESSION_ID}:${CALL_ID}:0`,
        answer: 'a, b',
        source: 'hook',
      }),
    ]);
  });

  it('queues nothing for a cancelled result', () => {
    const { api, handlers } = makeExtensionApi();
    decisionCapture(api);
    const handler = handlers.get('tool_result')?.[0];

    expect(handler?.(toolResult({
      details: { answers: [], cancelled: true },
    }), context())).toBeUndefined();
    expect(queueLines()).toEqual([]);
  });

  it('queues nothing for an error result', () => {
    const { api, handlers } = makeExtensionApi();
    decisionCapture(api);
    const handler = handlers.get('tool_result')?.[0];

    expect(handler?.(toolResult({ isError: true }), context())).toBeUndefined();
    expect(queueLines()).toEqual([]);
  });

  it('queues nothing for another tool name', () => {
    const { api, handlers } = makeExtensionApi();
    decisionCapture(api);
    const handler = handlers.get('tool_result')?.[0];

    expect(handler?.(toolResult({ toolName: 'bash' }), context())).toBeUndefined();
    expect(queueLines()).toEqual([]);
  });

  it('queues nothing when the session id is missing', () => {
    const { api, handlers } = makeExtensionApi();
    decisionCapture(api);
    const handler = handlers.get('tool_result')?.[0];

    expect(handler?.(toolResult(), context(null))).toBeUndefined();
    expect(queueLines()).toEqual([]);
  });

  it('registers no handler when the decision-capture kill switch is on', () => {
    process.env.SYSTEM_DECISION_CAPTURE_DISABLED = '1';
    const { api, handlers } = makeExtensionApi();

    expect(decisionCapture(api)).toBeUndefined();
    expect(handlers.get('tool_result')).toBeUndefined();
    expect(handlers.get('turn_end')).toBeUndefined();
    expect(notifications).toEqual([]);
    expect(queueLines()).toEqual([]);
  });

  it('does not add a second line when the session sweep sees the same call', () => {
    const { api, handlers } = makeExtensionApi();
    decisionCapture(api);
    const handler = handlers.get('tool_result')?.[0];
    expect(handler?.(toolResult(), context())).toBeUndefined();
    expect(queueLines()).toHaveLength(1);

    const transcriptPath = join(projectDir, 'session.jsonl');
    const transcriptLines = [
      { type: 'session', id: SESSION_ID },
      {
        type: 'message',
        message: {
          role: 'assistant',
          content: [{
            type: 'toolCall',
            name: 'ask_user_question',
            id: CALL_ID,
            arguments: QUESTION_INPUT,
          }],
        },
      },
      {
        type: 'message',
        message: {
          role: 'toolResult',
          toolName: 'ask_user_question',
          toolCallId: CALL_ID,
          isError: false,
          details: ANSWER_DETAILS,
        },
      },
    ];
    writeFileSync(transcriptPath, `${transcriptLines.map((line) => JSON.stringify(line)).join('\n')}\n`);

    const sweep = spawnSync(
      process.execPath,
      [SWEEP_SCRIPT, '--transcript', transcriptPath],
      { cwd: projectDir, encoding: 'utf8' },
    );

    expect(sweep.status).toBe(0);
    expect(JSON.parse(sweep.stdout).recovered).toBe(0);
    expect(queueLines()).toHaveLength(1);
  });
});
