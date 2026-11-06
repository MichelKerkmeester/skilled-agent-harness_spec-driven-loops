// ───────────────────────────────────────────────────────────────────
// MODULE: Repo Guards Test Harness
// ───────────────────────────────────────────────────────────────────

import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/**
 * Build a fake plugin context that records every handler, command and log line.
 *
 * @returns {{ctx: object, handlers: Map<string, Function[]>, commands: object[], logs: object[], fire: Function}}
 */
export function pluginHarness() {
  const handlers = new Map();
  const commands = [];
  const logs = [];
  const ctx = {
    on(name, handler) {
      if (!handlers.has(name)) handlers.set(name, []);
      handlers.get(name).push(handler);
    },
    commands: {
      register(definition) { commands.push(definition); },
    },
    logger: {
      warn(message) { logs.push({ level: 'warn', message }); },
      error(message) { logs.push({ level: 'error', message }); },
    },
  };
  // Calls the first handler registered for an event, the one an adapter under test added.
  const fire = (name, ...args) => {
    const list = handlers.get(name);
    if (!list || list.length === 0) throw new Error(`no handler registered for ${name}`);
    return list[0](...args);
  };
  return { ctx, handlers, commands, logs, fire };
}

/**
 * Build a fake agent that records injected messages and scoped tool registrations.
 *
 * @param {object} [options] - Session identity and snapshot events.
 * @returns {{agent: object, injected: object[], tools: object[]}}
 */
export function fakeAgent({ id = 'session-fixture', cwd = '/fixture/workspace', events = [] } = {}) {
  const injected = [];
  const tools = [];
  const agent = {
    id,
    session: {
      id,
      header: { cwd },
      snapshotEvents: () => events,
    },
    ctx: {
      tools: {
        register(definition) {
          tools.push(definition);
          return () => {};
        },
      },
    },
    inject(message) { injected.push(message); },
  };
  return { agent, injected, tools };
}

/** A notice factory that skips the harness message helpers. */
export async function plainNotice(text) {
  return { role: 'user', source: { kind: 'repo-guards' }, content: [{ type: 'text', text }] };
}

/** The text of a notice built by {@link plainNotice}. */
export function noticeText(message) {
  return message?.content?.[0]?.text ?? '';
}

/** A message the operator typed. */
export function humanMessage(text) {
  return { role: 'user', source: { kind: 'user' }, content: [{ type: 'text', text }] };
}

export function tempDir(prefix = 'repo-guards-parity-') {
  return mkdtempSync(path.join(os.tmpdir(), prefix));
}

export function cleanup(directory) {
  rmSync(directory, { recursive: true, force: true });
}

export const enabled = () => true;
export const disabled = () => false;
export const leaf = () => true;
export const interactive = () => false;
