'use strict';
// Routes a corpus of sk-code prompts under the shipped surface score and under
// the two candidate scores, and prints one line per prompt and candidate.
// Usage: node measure-candidates.cjs <repo root> [routes-only]
// With routes-only it prints the shipped route of every case in the hub's case
// file, one line per case, which is the before and after list.
const path = require('node:path');
const root = path.resolve(process.argv[2]);
const routesOnly = process.argv[3] === 'routes-only';
const hubLib = path.join(root, '.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code');
const { loadHubEngine } = require(path.join(root, '.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs'));
const admission = require(path.join(root, '.skilled/bin/lib/compiled-route-admission.cjs'));
const fixture = require(path.join(hubLib, 'fixtures/canary-cases.v1.json'));
const { scoreModes } = require(path.join(hubLib, 'lib/canary-router.cjs'));
const engine = loadHubEngine('sk-code');
const snapshot = engine.snapshot;
const model = snapshot.routingModel;

function routeOf(prompt, constraints, surfaceHint) {
  const { decision } = engine.evaluate(snapshot, { prompt, constraints, surfaceHint });
  if (decision.action !== 'route') return decision.action;
  return `${decision.route.selectionKind}:${decision.route.targets.map((t) => t.destinationId.workflowMode).join(',')}`;
}

if (routesOnly) {
  for (const entry of fixture.cases) {
    console.log(`${entry.id}\t${routeOf(entry.prompt, entry.constraints, entry.surfaceHint)}`);
  }
  process.exit(0);
}

const kind = new Map(snapshot.policy.destinations.map((d) => [d.id.workflowMode, d.id.packetKind]));
const order = new Map(model.tieBreak.map((mode, index) => [mode, index]));
const isSurface = (mode) => kind.get(mode) === 'surface';

function window(scores) {
  const sorted = [...scores].sort((l, r) => r.score - l.score || order.get(l.mode) - order.get(r.mode));
  if (sorted.length === 0) return [];
  const top = sorted[0].score;
  return sorted.filter((e) => top - e.score <= model.ambiguityDelta).map((e) => e.mode);
}

const ordered = (modes) => [...modes].sort((l, r) => order.get(l) - order.get(r));

// Shipped: every mode scores distinct matched phrases times weight, one window.
function shipped(text) {
  return ordered(window(scoreModes(model, text)));
}

// Candidate A: a surface counts once however many of its phrases match.
function countOnce(text) {
  const scores = scoreModes(model, text).map((e) => (
    isSurface(e.mode) && e.score !== Number.MAX_SAFE_INTEGER
      ? { mode: e.mode, score: model.modes.find((m) => m.workflowMode === e.mode).weight }
      : e
  ));
  return ordered(window(scores));
}

// Candidate B: keep the count, select workflow modes and surfaces in two windows.
function twoWindows(text) {
  const scores = scoreModes(model, text);
  return ordered([
    ...window(scores.filter((e) => !isSurface(e.mode))),
    ...window(scores.filter((e) => isSurface(e.mode))),
  ]);
}

const corpus = [];
for (const entry of fixture.cases) {
  if ((entry.constraints || []).length) continue;
  corpus.push({ source: 'case', id: entry.id, prompt: entry.prompt });
}
for (const entry of fixture.certificateCases) corpus.push({ source: 'certificate-case', id: entry.id, prompt: entry.prompt });
for (const s of admission.loadGoldScenarios(path.join(root, '.skilled/skills/sk-code'))) {
  corpus.push({ source: 'playbook-gold', id: s.id, prompt: s.prompt, gold: s.modes });
}
for (const [id, prompt] of [
  ['probe-1', 'review the dark mode toggle and focus trap'],
  ['probe-2', 'fix the responsive grid and the sticky header'],
  ['probe-4', 'review this function for bugs'],
  ['probe-6', 'add a filter to the table'],
  ['hint-test-ci', 'review the github actions workflow yaml for the typescript bundle'],
  ['hint-test-ci-path', 'review .github/workflows/ci.yml'],
  ['hint-test-ci-actions', 'review this GitHub Actions workflow'],
  ['hint-test-skilled', 'pr review opencode typescript'],
]) corpus.push({ source: 'probe', id, prompt });

let changedA = 0;
let changedB = 0;
for (const row of corpus) {
  const text = row.prompt.trim().toLowerCase();
  const base = shipped(text).join(',') || 'none';
  const a = countOnce(text).join(',') || 'none';
  const b = twoWindows(text).join(',') || 'none';
  if (a !== base) changedA += 1;
  if (b !== base) changedB += 1;
  const scores = scoreModes(model, text).map((e) => `${e.mode.replace('sk-code-', '')}=${e.score}`).join(' ');
  console.log(JSON.stringify({ source: row.source, id: row.id, prompt: row.prompt, scores, shipped: base, countOnce: a, twoWindows: b, ...(row.gold ? { gold: row.gold.join(',') } : {}) }));
}
console.log(`corpus=${corpus.length} changedByCountOnce=${changedA} changedByTwoWindows=${changedB}`);

// A second surface beside a surface that matched several phrases. The hub-only
// prompt adds one SKILLED phrase. The host prompt runs on the live hub plus a
// webflow surface, compiled the way the surface hint tests compile it.
const fs = require('node:fs');
const { compileRegistry } = require(path.join(hubLib, 'lib/registry-compiler.cjs'));
const skRoot = path.join(root, '.skilled/skills/sk-code');
function hostModel() {
  const registry = JSON.parse(fs.readFileSync(path.join(skRoot, 'mode-registry.json'), 'utf8'));
  const hubRouter = JSON.parse(fs.readFileSync(path.join(skRoot, 'hub-router.json'), 'utf8'));
  registry.modes.push({
    workflowMode: 'sk-code-webflow', packetKind: 'surface', backendKind: 'evidence-base', packet: 'sk-code-webflow',
    packetSkillName: 'sk-code-webflow', aliases: [], advisorRouting: { routingClass: 'metadata' },
    surfaceDetection: { label: 'WEBFLOW', role: 'specific', pathMarkers: ['src/2_javascript/'], contentMarkers: ['--vw-'] },
  });
  hubRouter.routerSignals['sk-code-webflow'] = { weight: 4, classes: ['code-webflow-runtime'], resources: ['sk-code-webflow/SKILL.md'] };
  hubRouter.vocabularyClasses['code-webflow-runtime'] = { keywords: ['webflow'] };
  hubRouter.routerPolicy.tieBreak.splice(hubRouter.routerPolicy.tieBreak.length - 1, 0, 'sk-code-webflow');
  const skillMarkdown = fs.readFileSync(path.join(skRoot, 'SKILL.md'), 'utf8');
  const rootRouter = fs.readFileSync(path.join(skRoot, 'ROUTER.md'), 'utf8');
  const routerMarkdown = rootRouter.slice(rootRouter.search(/^## \d+\. MACHINE ROUTER$/m));
  return compileRegistry({
    activationGeneration: 1, hubRouter, registry, routerMarkdown, skillMarkdown,
    sourceBytes: {
      'ROUTER.md': Buffer.from(rootRouter), 'SKILL.md': Buffer.from(skillMarkdown),
      'hub-router.json': Buffer.from(JSON.stringify(hubRouter)), 'mode-registry.json': Buffer.from(JSON.stringify(registry)),
    },
  });
}
function measureOn(snap, label, prompt) {
  const m = snap.routingModel;
  const k = new Map(snap.policy.destinations.map((d) => [d.id.workflowMode, d.id.packetKind]));
  const o = new Map(m.tieBreak.map((mode, index) => [mode, index]));
  const surf = (mode) => k.get(mode) === 'surface';
  const win = (scores) => {
    const sorted = [...scores].sort((l, r) => r.score - l.score || o.get(l.mode) - o.get(r.mode));
    if (!sorted.length) return [];
    return sorted.filter((e) => sorted[0].score - e.score <= m.ambiguityDelta).map((e) => e.mode);
  };
  const ord = (modes) => [...modes].sort((l, r) => o.get(l) - o.get(r)).join(',') || 'none';
  const text = prompt.toLowerCase();
  const raw = scoreModes(m, text);
  const once = raw.map((e) => (surf(e.mode) ? { mode: e.mode, score: m.modes.find((x) => x.workflowMode === e.mode).weight } : e));
  console.log(JSON.stringify({
    source: label, prompt,
    scores: raw.map((e) => `${e.mode.replace('sk-code-', '')}=${e.score}`).join(' '),
    shipped: ord(win(raw)), countOnce: ord(win(once)),
    twoWindows: ord([...win(raw.filter((e) => !surf(e.mode))), ...win(raw.filter((e) => surf(e.mode)))]),
  }));
}
measureOn(snapshot, 'second-surface-hub', 'review the typescript dark mode toggle and focus trap');
const host = hostModel();
measureOn(host, 'second-surface-host', 'review the webflow dark mode toggle and focus trap');
measureOn(host, 'second-surface-host', 'fix the webflow dark mode toggle and focus trap');
