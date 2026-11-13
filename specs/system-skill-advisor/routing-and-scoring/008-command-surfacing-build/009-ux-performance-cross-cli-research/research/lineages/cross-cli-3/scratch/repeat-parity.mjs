// Read-only probe: what the OpenCode transform emits on the first prompt and on an
// immediate repeat in the same session. The advisor CLI is stubbed with the real
// payload the CLI returns for the prompt, so the only variable is delivery.
//
// Run from the repository root: node <this file>

import { execFileSync } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const PLUGIN = resolve(ROOT, '.opencode/plugins/system-skill-advisor.js');
const ADVISOR_CLI = resolve(ROOT, '.skilled/bin/skill-advisor.cjs');
const PROMPT = '/create:readme for the utils folder';

function fakeChild(stdout) {
  const child = new EventEmitter();
  child.stdout = new EventEmitter();
  child.stdout.setEncoding = () => undefined;
  child.stdin = { on: () => undefined, end: () => undefined };
  child.kill = () => true;
  queueMicrotask(() => {
    child.stdout.emit('data', stdout);
    child.emit('close', 0);
  });
  return child;
}

const stdout = execFileSync('node', [ADVISOR_CLI, 'advisor_recommend', '--json', JSON.stringify({ prompt: PROMPT }), '--format', 'json'], {
  cwd: ROOT,
  encoding: 'utf8',
  timeout: 60_000,
});

const mod = await import(pathToFileURL(PLUGIN).href);
const hooks = await mod.default.server({ directory: ROOT }, {
  spawnOverride: () => fakeChild(stdout),
  sourceSignatureOverride: 'repeat-probe',
  cacheTTLMs: 1,
});
const input = {
  sessionID: 'probe-repeat-session',
  messageID: 'probe-repeat-message-1',
  model: { providerID: 'probe', modelID: 'probe' },
  prompt: PROMPT,
};

const first = { system: [] };
await hooks['experimental.chat.system.transform'](input, first);
const second = { system: [] };
await hooks['experimental.chat.system.transform'](input, second);
const third = { system: [] };
await hooks['experimental.chat.system.transform']({ ...input, messageID: 'probe-repeat-message-2' }, third);
await hooks.event?.({ event: { type: 'session.instance.disposed', properties: { directory: ROOT } } });

console.log(JSON.stringify({
  call1: first.system.map((entry) => ({ bytes: Buffer.byteLength(entry, 'utf8'), text: entry })),
  call2SameMessage: second.system.map((entry) => ({ bytes: Buffer.byteLength(entry, 'utf8'), text: entry })),
  call3NewMessage: third.system.map((entry) => ({ bytes: Buffer.byteLength(entry, 'utf8'), text: entry })),
}, null, 2));
