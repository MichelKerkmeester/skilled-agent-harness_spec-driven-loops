const fs = require('fs'); const path = require('path');
const [root, hub, addPath] = process.argv.slice(2);
const child = { 'sk-doc': '009-parent-hub-rollout/007-sk-doc', 'system-deep-loop': '009-parent-hub-rollout/002-system-deep-loop' }[hub];
const CR = path.join(root, '.skilled/bin/lib/compiled-routing', child);
const target = path.join(root, '.skilled/skills', hub, 'hub-router.json');
const base = JSON.parse(fs.readFileSync(target, 'utf8'));
const mod = JSON.parse(JSON.stringify(base));
for (const [cls, kws] of Object.entries(JSON.parse(fs.readFileSync(addPath, 'utf8')))) mod.vocabularyClasses[cls].keywords.push(...kws);
let useMod = false; const orig = fs.readFileSync;
fs.readFileSync = function (p, ...rest) { if (useMod && typeof p === 'string' && fs.realpathSync(p) === fs.realpathSync(target)) { const b = Buffer.from(JSON.stringify(mod)); return rest[0] ? b.toString() : b; } return orig.call(fs, p, ...rest); };
const { loadSnapshot } = require(path.join(CR, 'harness/build-artifacts.cjs'));
const rp = fs.existsSync(path.join(CR, 'lib/canary-router.cjs')) ? path.join(CR, 'lib/canary-router.cjs') : path.join(CR, 'lib/router.cjs');
const rm = require(rp); const evaluate = rm.evaluateCanary || rm.evaluateRoute;
const { snapshot: a, fixture } = loadSnapshot(); useMod = true; const { snapshot: b } = loadSnapshot(); useMod = false;
const fmt = (d) => d.action === 'route' ? `route:${d.route.selectionKind}:${d.route.targets.map((t) => t.destinationId.workflowMode).join('+')}` : d.action;
const corpus = orig.call(fs, path.join(root, '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl'), 'utf8').trim().split('\n').map(JSON.parse).filter((r) => r.split !== 'holdout');
let changed = 0;
for (const r of [...corpus, ...fixture.cases.map((c) => ({ id: 'canary:' + c.id, prompt: c.prompt, row_type: 'canary', expected_command: c.expectedAction }))]) {
  if (!r.prompt) continue;
  const x = fmt(evaluate(a, { prompt: r.prompt }).decision), y = fmt(evaluate(b, { prompt: r.prompt }).decision);
  if (x !== y || process.env.ALL) { changed++; console.log(`${r.id}\t${r.row_type}\t${r.expected_command}\t${x} -> ${y}`); }
}
console.log('changed', changed);
