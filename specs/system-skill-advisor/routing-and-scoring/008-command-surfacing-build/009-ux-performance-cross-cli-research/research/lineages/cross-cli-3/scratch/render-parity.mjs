// Read-only probe: render the same advisor payload through the OpenCode plugin
// path and the Claude hook path, then print both briefs and their byte counts.
//
// Plugin path:  .opencode/plugins/system-skill-advisor.js
//               experimental.chat.system.transform, with the advisor CLI stubbed by
//               the payload the CLI actually returned for that prompt.
// Hook path:    dist/hooks/lib/skill-advisor-cli-fallback.js
//               buildSkillAdvisorBriefFromCli (the function the Claude hook calls)
//               + renderAdvisorBrief from the shared renderer.
//
// No daemon is started: the CLI call is the ordinary read-only
// `advisor_recommend` the plugin itself makes. Run from the repository root.

import { execFileSync } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const PLUGIN = resolve(ROOT, '.opencode/plugins/system-skill-advisor.js');
const RENDERER = resolve(ROOT, '.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/render.js');
const HOOK = resolve(ROOT, '.skilled/skills/system-skill-advisor/runtime/dist/hooks/lib/skill-advisor-cli-fallback.js');
const ADVISOR_CLI = resolve(ROOT, '.skilled/bin/skill-advisor.cjs');

const PROMPTS = [
  ['typed', '/create:readme for the utils folder'],
  ['plain', 'write a readme for the utils folder'],
  ['ambiguous', 'use the system-deep-loop skill on this packet'],
  ['doctor', 'run doctor setup for my install'],
  ['no-match', 'what is the weather today'],
  ['deep-research-plain', 'Go find out everything you can about incremental indexing approaches and report back'],
  ['deep-review-plain', 'Audit this codebase over many passes until the findings stop changing'],
  ['deep-council-plain', 'Get several models to debate the tradeoffs and give us a final verdict'],
  ['doctor-deep-loop-plain', 'my research loop stopped converging and I cannot see why'],
];

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
    { sessionID: `probe-${label}`, model: { providerID: 'probe', modelID: 'probe' }, prompt: PROMPTS.find(([k]) => k === label)[1] },
    output,
  );
  await hooks.event?.({ event: { type: 'server.instance.disposed', properties: { directory: ROOT } } });
  return typeof output.system[0] === 'string' ? output.system[0] : null;
}

function cliPayload(prompt) {
  const raw = execFileSync('node', [ADVISOR_CLI, 'advisor_recommend', '--json', JSON.stringify({ prompt }), '--format', 'json'], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 60_000,
  });
  return raw;
}

const fallback = await import(pathToFileURL(HOOK).href);
const renderer = await import(pathToFileURL(RENDERER).href);

const rows = [];
for (const [label, prompt] of PROMPTS) {
  const stdout = cliPayload(prompt);
  const parsed = JSON.parse(stdout);
  const top = parsed?.data?.recommendations?.[0] ?? {};
  const plugin = await pluginBrief(stdout, label);
  const hookResult = await fallback.buildSkillAdvisorBriefFromCli(prompt, {
    runtime: 'Claude Code',
    workspaceRoot: ROOT,
    timeoutMs: 60_000,
  }, {});
  const hookBrief = renderer.renderAdvisorBrief(hookResult, {});
  const hook = hookBrief ?? renderer.renderAdvisorFallbackDirective({}, hookResult);
  rows.push({
    label,
    prompt,
    top: {
      skillId: top.skillId ?? null,
      kind: top.kind ?? null,
      command: top.command ?? null,
      policy: top.policy ?? null,
      ownerSkillId: top.ownerSkillId ?? null,
      needsMode: top.needsMode === true,
      confidence: top.confidence ?? null,
      uncertainty: top.uncertainty ?? null,
    },
    effectiveThresholds: parsed?.data?.effectiveThresholds ?? null,
    ambiguous: parsed?.data?.ambiguous === true,
    freshness: parsed?.data?.freshness ?? null,
    degraded: parsed?.degraded === true,
    plugin: plugin === null ? null : { bytes: Buffer.byteLength(plugin, 'utf8'), text: plugin },
    hook: { bytes: Buffer.byteLength(hook, 'utf8'), text: hook },
    same: plugin === hook,
  });
}

console.log(JSON.stringify({ sessionChild: process.env.AI_SESSION_CHILD === '1', rows }, null, 2));
