// Dry run of the planned mapper fix, in memory only. It reads the OpenCode
// plugin, checks the anchor line the build task names occurs once, inserts the
// task's exact block after the line that closes the `ambiguousWith` spread and
// loads the patched text from a data URL. The plugin file on disk is never
// written. Relative specifiers and `import.meta.url` are pinned to the real
// plugin path so every dependency resolves as it does in place.
//
// It then runs the transform with the plugin's `spawnOverride` stub, the way
// the plugin's Vitest suite stubs the CLI, and prints each brief head beside
// the head the planned test expects.
//
// Usage, from the repository root: node <this file>
// Exit 0 when the anchor is unique and every expected head matches.

import { EventEmitter } from 'node:events';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const PLUGIN = resolve(ROOT, '.opencode/plugins/system-skill-advisor.js');
const ANCHOR = "          ? { ambiguousWith: recommendation.ambiguousWith.filter((value) => typeof value === 'string') }";
const CLOSER = '          : {}),';
const BLOCK = [
  '        // The renderer prints a command, its policy and its owner only from these',
  '        // fields. A skill row such as sk-doc has no generated command row to refill',
  '        // them, so a dropped field hides the command the advisor attached.',
  "        ...(typeof recommendation.command === 'string' && recommendation.command.trim() !== '' ? { command: recommendation.command } : {}),",
  "        ...(recommendation.policy === 'run' || recommendation.policy === 'start' || recommendation.policy === 'ask' ? { policy: recommendation.policy } : {}),",
  "        ...(typeof recommendation.ownerSkillId === 'string' && recommendation.ownerSkillId.trim() !== '' ? { ownerSkillId: recommendation.ownerSkillId } : {}),",
  '        ...(recommendation.needsMode === true ? { needsMode: true } : {}),',
];

function patchedSource() {
  const lines = readFileSync(PLUGIN, 'utf8').split('\n');
  const hits = lines.flatMap((line, index) => (line === ANCHOR ? [index] : []));
  if (hits.length !== 1) throw new Error(`anchor found ${hits.length} times`);
  if (lines[hits[0] + 1] !== CLOSER) throw new Error('the line after the anchor is not the spread closer');
  lines.splice(hits[0] + 2, 0, ...BLOCK);
  const pluginUrl = pathToFileURL(PLUGIN).href;
  const pluginDir = pathToFileURL(dirname(PLUGIN)).href;
  const opencodeDir = pathToFileURL(dirname(dirname(PLUGIN))).href;
  return lines.join('\n')
    .replaceAll('import.meta.url', JSON.stringify(pluginUrl))
    .replaceAll("from './", `from '${pluginDir}/`)
    .replaceAll("from '../", `from '${opencodeDir}/`);
}

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

async function head(server, recommendations, label, prompt) {
  const stdout = JSON.stringify({ status: 'ok', data: { freshness: 'live', recommendations } });
  const hooks = await server({ directory: ROOT }, {
    spawnOverride: () => fakeChild(stdout),
    sourceSignatureOverride: `dry-run-${label}`,
  });
  const output = { system: [] };
  await hooks['experimental.chat.system.transform']?.(
    { sessionID: `dry-run-${label}`, model: { providerID: 'probe', modelID: 'probe' }, prompt },
    output,
  );
  await hooks.event?.({ event: { type: 'server.instance.disposed', properties: { directory: ROOT } } });
  return typeof output.system[0] === 'string' ? output.system[0].split('\n')[0] : '(no brief)';
}

const CASES = [
  {
    label: 'skill-row-command',
    prompt: 'write a readme for the utils folder',
    recommendations: [{ skillId: 'sk-doc', kind: 'skill', command: '/create:readme', policy: 'start', ownerSkillId: 'sk-doc', confidence: 0.95, uncertainty: 0.12 }],
    expected: 'Advisor: live; use sk-doc → /create:readme (start) 0.95/0.12 pass.',
  },
  {
    label: 'plain-skill-unchanged',
    prompt: 'implement feature X',
    recommendations: [{ skillId: 'sk-code', confidence: 0.91, uncertainty: 0.23 }],
    expected: 'Advisor: live; use sk-code 0.91/0.23 pass.',
  },
  {
    // A row id outside the generated table, so only the kept field can name the owner.
    label: 'owner-from-field',
    prompt: 'write a readme for the api folder',
    recommendations: [{ skillId: 'probe-row', kind: 'command', command: '/create:readme', policy: 'start', ownerSkillId: 'sk-doc', confidence: 0.95, uncertainty: 0.12 }],
    expected: 'Advisor: live; use sk-doc → /create:readme (start) 0.95/0.12 pass.',
  },
  {
    label: 'unknown-policy-dropped',
    prompt: 'write a readme for the docs folder',
    recommendations: [{ skillId: 'sk-doc', command: '/create:readme', policy: 'later', ownerSkillId: 'sk-doc', confidence: 0.95, uncertainty: 0.12 }],
    expected: 'Advisor: live; use sk-doc → /create:readme 0.95/0.12 pass.',
  },
];

const patched = await import(`data:text/javascript;base64,${Buffer.from(patchedSource()).toString('base64')}`);
const original = await import(pathToFileURL(PLUGIN).href);
let ok = true;
for (const testCase of CASES) {
  const before = await head(original.default.server, testCase.recommendations, `${testCase.label}-before`, testCase.prompt);
  const after = await head(patched.default.server, testCase.recommendations, `${testCase.label}-after`, testCase.prompt);
  const match = after === testCase.expected;
  ok = ok && match;
  console.log(`[${testCase.label}] today:   ${before}`);
  console.log(`[${testCase.label}] patched: ${after}`);
  console.log(`[${testCase.label}] patched equals expected=${match} today equals expected=${before === testCase.expected}`);
}
process.exitCode = ok ? 0 : 1;
