'use strict';
// Prints the sk-code hub router's scores and route for each probe prompt.
const path = require('node:path');
const root = path.resolve(process.argv[2]);
const { loadHubEngine } = require(path.join(root, '.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs'));
const { resolveRoute } = require(path.join(root, '.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs'));
const engine = loadHubEngine('sk-code');
const model = engine.snapshot.routingModel;
console.log('ambiguityDelta=' + model.ambiguityDelta + ' weights=' + model.modes.map((mode) => mode.workflowMode + ':' + mode.weight).join(','));
console.log('surfaceDetection=' + JSON.stringify(model.surfaceDetection));
const probes = [
  ['review the dark mode toggle and focus trap', undefined],
  ['fix the responsive grid and the sticky header', undefined],
  ['make the navbar sticky with css', 'FRONTEND'],
  ['review this function for bugs', undefined],
  ['review this function for bugs', 'FRONTEND'],
  ['add a filter to the table', 'FRONTEND'],
];
for (const [prompt, surfaceHint] of probes) {
  const scores = engine.evaluate(engine.snapshot, { prompt }).trace.matchedScores;
  const route = resolveRoute('sk-code', prompt, { surfaceHint });
  const targets = route && route.targets ? route.targets.map((target) => target.workflowMode) : [];
  console.log(JSON.stringify({ prompt, surfaceHint: surfaceHint || null, scores, action: route ? route.action : null, targets }));
}
