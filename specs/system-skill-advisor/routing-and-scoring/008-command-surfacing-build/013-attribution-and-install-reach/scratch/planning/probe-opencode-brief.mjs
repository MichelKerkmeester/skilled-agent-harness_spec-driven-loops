// Read-only probe: does the OpenCode plugin's brief name the command and policy
// the advisor attached to its top recommendation?
//
// It loads the plugin the way its Vitest suite does (default export `.server`,
// then the `experimental.chat.system.transform` hook) and stubs the advisor CLI
// with the plugin's own `spawnOverride` option, so no advisor child starts from
// the plugin. The answer is either the real CLI answer for the probe prompt or a
// fixed fixture. As a control it renders the same top recommendation straight
// through the shared renderer with its command fields intact.
//
// Usage, from the repository root:
//   node <this file>            real CLI answer plus the fixture
//   node <this file> --fixture  the fixture only
//   node <this file> --doctor   also a real doctor-bridge answer
// Exit 0 when every case printed a brief. The verdict lines say whether the head
// named the command and the policy.

import { execFileSync } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const PLUGIN = resolve(ROOT, '.opencode/plugins/system-skill-advisor.js');
const RENDERER = resolve(ROOT, '.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/render.js');
const ADVISOR_CLI = resolve(ROOT, '.skilled/bin/skill-advisor.cjs');
const PROMPT = '/create:readme for the utils folder';

const FIXTURE = {
  status: 'ok',
  data: {
    freshness: 'live',
    ambiguous: false,
    recommendations: [{
      skillId: 'sk-doc',
      kind: 'skill',
      command: '/create:readme',
      policy: 'start',
      ownerSkillId: 'sk-doc',
      confidence: 0.95,
      uncertainty: 0.12,
    }],
  },
};

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

async function pluginBrief(stdout, label) {
  const mod = await import(pathToFileURL(PLUGIN).href);
  const server = mod.default.server;
  const hooks = await server({ directory: ROOT }, {
    spawnOverride: () => fakeChild(stdout),
    sourceSignatureOverride: `probe-${label}`,
    cacheTTLMs: 1,
  });
  const output = { system: [] };
  await hooks['experimental.chat.system.transform']?.(
    { sessionID: `probe-${label}`, model: { providerID: 'probe', modelID: 'probe' }, prompt: PROMPT },
    output,
  );
  await hooks.event?.({ event: { type: 'server.instance.disposed', properties: { directory: ROOT } } });
  return typeof output.system[0] === 'string' ? output.system[0] : null;
}

async function controlBrief(answer) {
  const renderer = await import(pathToFileURL(RENDERER).href);
  const top = answer.data.recommendations[0];
  return renderer.renderAdvisorBrief({
    status: 'ok',
    freshness: answer.data.freshness,
    ambiguous: answer.data.ambiguous === true,
    recommendations: [{
      skill: top.skillId,
      kind: top.kind === 'command' ? 'command' : 'skill',
      confidence: top.confidence,
      uncertainty: top.uncertainty,
      passes_threshold: true,
      ...(typeof top.command === 'string' ? { command: top.command } : {}),
      ...(typeof top.policy === 'string' ? { policy: top.policy } : {}),
      ...(typeof top.ownerSkillId === 'string' ? { ownerSkillId: top.ownerSkillId } : {}),
    }],
  });
}

function headOf(text) {
  return text === null ? '(no brief)' : text.split('\n')[0];
}

function verdict(head, command, policy) {
  return `names command=${command ? head.includes(command) : 'n/a'} names policy=${policy ? head.includes(`(${policy})`) : 'n/a'}`;
}

async function runCase(label, answer) {
  const stdout = JSON.stringify(answer);
  const top = answer.data?.recommendations?.[0] ?? {};
  console.log(`[${label}] advisor top: ${JSON.stringify({ skillId: top.skillId, command: top.command ?? null, policy: top.policy ?? null, ownerSkillId: top.ownerSkillId ?? null })}`);
  const plugin = headOf(await pluginBrief(stdout, label));
  console.log(`[${label}] opencode plugin head: ${plugin}`);
  console.log(`[${label}] opencode plugin ${verdict(plugin, top.command, top.policy)}`);
  const control = headOf(await controlBrief(answer));
  console.log(`[${label}] renderer with fields kept: ${control}`);
  console.log(`[${label}] renderer with fields kept ${verdict(control, top.command, top.policy)}`);
  return plugin !== '(no brief)';
}

function realAnswer(prompt) {
  const raw = execFileSync('node', [ADVISOR_CLI, 'advisor_recommend', '--json', JSON.stringify({ prompt }), '--format', 'json'], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 60_000,
  });
  return JSON.parse(raw);
}

const cases = [];
if (!process.argv.includes('--fixture')) {
  cases.push(['real', realAnswer(PROMPT)]);
  // A doctor bridge is keyed by its own command row, so the renderer can refill
  // the dropped fields from the generated table. This case shows that path.
  if (process.argv.includes('--doctor')) {
    cases.push(['real-doctor', realAnswer('run doctor setup for my install')]);
  }
}
cases.push(['fixture', FIXTURE]);

let ok = true;
for (const [label, answer] of cases) {
  ok = (await runCase(label, answer)) && ok;
}
process.exitCode = ok ? 0 : 1;
