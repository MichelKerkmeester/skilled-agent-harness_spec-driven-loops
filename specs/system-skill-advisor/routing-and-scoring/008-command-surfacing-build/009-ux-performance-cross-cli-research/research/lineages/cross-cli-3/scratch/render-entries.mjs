// Read-only probe: every system entry the OpenCode transform emits for one prompt,
// beside the single context string the Claude hook emits for the same prompt.
//
// Run from the repository root: node <this file>

import { execFileSync } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const PLUGIN = resolve(ROOT, '.opencode/plugins/system-skill-advisor.js');
const HOOK = resolve(ROOT, '.skilled/skills/system-skill-advisor/runtime/dist/hooks/lib/skill-advisor-cli-fallback.js');
const RENDERER = resolve(ROOT, '.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/render.js');
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

const fallback = await import(pathToFileURL(HOOK).href);
const renderer = await import(pathToFileURL(RENDERER).href);
const rows = [];

for (const [label, prompt] of PROMPTS) {
  const stdout = execFileSync('node', [ADVISOR_CLI, 'advisor_recommend', '--json', JSON.stringify({ prompt }), '--format', 'json'], {
    cwd: ROOT, encoding: 'utf8', timeout: 60_000,
  });
  const mod = await import(pathToFileURL(PLUGIN).href);
  const hooks = await mod.default.server({ directory: ROOT }, {
    spawnOverride: () => fakeChild(stdout),
    sourceSignatureOverride: `entries-${label}`,
    cacheTTLMs: 1,
  });
  const output = { system: [] };
  await hooks['experimental.chat.system.transform']?.({ sessionID: `entries-${label}`, messageID: `entries-${label}-1`, model: { providerID: 'probe', modelID: 'probe' }, prompt }, output);
  await hooks.event?.({ event: { type: 'session.instance.disposed', properties: { directory: ROOT } } });

  const hookResult = await fallback.buildSkillAdvisorBriefFromCli(prompt, { runtime: 'Claude Code', workspaceRoot: ROOT, timeoutMs: 60_000 }, {});
  const hookBrief = renderer.renderAdvisorBrief(hookResult, {});
  const hookText = hookBrief ?? renderer.renderAdvisorFallbackDirective({}, hookResult);

  rows.push({
    label,
    pluginEntries: output.system.map((entry) => ({ bytes: Buffer.byteLength(entry, 'utf8'), text: entry })),
    hook: { bytes: Buffer.byteLength(hookText, 'utf8'), text: hookText },
  });
}

console.log(JSON.stringify({ rows }, null, 2));
