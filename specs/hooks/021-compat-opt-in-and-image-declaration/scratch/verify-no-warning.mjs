// Verifies the cache-compat advisory against the operator's real models.json and
// the real extension module: registers the extension on a stub host, fires the
// same model_select hook that produced the chat warning, and records every
// notification. Positive controls exist so a silent detector cannot pass.
import { readFileSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const EXT = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer';
const requireFromExt = createRequire(join(EXT, 'package.json'));
const { createJiti } = requireFromExt('jiti');

const repo = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const cfg = JSON.parse(readFileSync(join(repo, '.pi/models.json'), 'utf8'));
const prov = cfg.providers.llmgateway;

function effectiveModel(id) {
  const entry = prov.models.find((m) => m.id === id);
  // Pi merges provider compat with model compat, model wins (docs/models.md).
  const compat = { ...(prov.compat ?? {}), ...(entry.compat ?? {}) };
  return {
    provider: 'llmgateway', id, name: entry.name, api: prov.api, baseUrl: prov.baseUrl,
    reasoning: entry.reasoning, input: entry.input, compat,
  };
}

const agentDir = mkdtempSync(join(tmpdir(), 'pi-verify-'));
process.env.PI_CODING_AGENT_DIR = agentDir;
writeFileSync(join(agentDir, 'empty.json'), '{}');

const jiti = createJiti(join(EXT, 'verify.mjs'), { interopDefault: false, moduleCache: false });
const mod = await jiti.import(join(EXT, 'index.ts'));
const internals = mod.__internals_for_tests;

const handlers = new Map();
const commands = new Map();
const notifications = [];
mod.default({
  on(event, handler) { handlers.set(event, [...(handlers.get(event) ?? []), handler]); },
  registerTool() {},
  registerCommand(name, command) { commands.set(name, command); },
});

const ctx = {
  model: undefined,
  cwd: repo,
  sessionManager: { getSessionId: () => 'verify-session', getSessionFile: () => join(agentDir, 's.jsonl') },
  modelRegistry: { find: () => undefined, getAvailable: () => [], getAll: () => [] },
  ui: { notify: (message, level) => notifications.push({ message, level }), setStatus() {}, confirm: async () => false },
};

function plainProxy() {
  return {
    provider: 'proxy.example', id: 'gpt-6-x', name: 'GPT-6 X', api: 'openai-completions',
    baseUrl: 'https://proxy.example/v1', reasoning: true, input: ['text'], compat: {},
  };
}

function optedInDeepSeek() {
  const m = effectiveModel('deepseek-v4.1-flash');
  m.provider = 'proxy.example';
  m.baseUrl = 'https://proxy.example/v1';
  m.compat = { thinkingFormat: 'deepseek', sendSessionAffinityHeaders: true };
  return m;
}

function unoptedDeepSeekMissingEverything() {
  const m = effectiveModel('deepseek-v4.1-flash');
  m.compat = {};
  return m;
}

const CASES = [
  ['current config llmgateway/deepseek-v4.1-flash', effectiveModel('deepseek-v4.1-flash'), 0],
  ['current config llmgateway/glm-5.3-flash', effectiveModel('glm-5.3-flash'), 0],
  ['control A: plain third-party proxy, no compat (detector sanity)', plainProxy(), 1],
  ['control B: opted-in DeepSeek proxy missing the replay flag', optedInDeepSeek(), 1],
  ['control C: DeepSeek-named, never opted in (adapter short-circuits)', unoptedDeepSeekMissingEverything(), 0],
];

function compatWarnings() {
  return notifications.filter((n) => n.message.includes('pi-cache-optimizer') || n.message.includes('compat'));
}

for (const [label, model, expected] of CASES) {
  ctx.model = model;
  notifications.length = 0;
  for (const handler of handlers.get('model_select') ?? []) await handler({ model }, ctx);
  const warns = compatWarnings();
  const verdict = warns.length === expected ? 'OK' : `MISMATCH (expected ${expected})`;
  console.log(`\n### ${label}`);
  console.log(`  effective compat        : ${JSON.stringify(model.compat)}`);
  console.log(`  check applicable        : ${internals.isDeepSeekCompatCheckApplicable(model)}`);
  console.log(`  deepseek missing        : ${JSON.stringify(internals.describeMissingDeepSeekCompat(model))}`);
  console.log(`  full diagnosis missing  : ${JSON.stringify(internals.describeMissingCacheCompatForModel(model))}`);
  console.log(`  chat warnings=${warns.length} expected=${expected}  ${verdict}`);
  for (const warn of warns) console.log(`    ! ${warn.message.split('\n')[0].slice(0, 110)}`);
}

// The command surface must still tell the operator the truth even when the chat
// advisory is silenced, so the fix path stays discoverable.
console.log('\n### command surface for the current llmgateway/deepseek-v4.1-flash');
const model = effectiveModel('deepseek-v4.1-flash');
for (const sub of ['compat', 'doctor']) {
  notifications.length = 0;
  await commands.get('cache-optimizer').handler(sub, { ...ctx, model, hasUI: false });
  const text = notifications.map((n) => n.message).join('\n').trim();
  console.log(`\n--- /cache-optimizer ${sub}`);
  console.log(text.length ? text.slice(0, 900) : '(no output)');
}
