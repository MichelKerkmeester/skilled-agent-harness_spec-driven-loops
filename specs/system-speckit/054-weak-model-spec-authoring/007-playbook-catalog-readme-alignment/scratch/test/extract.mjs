import fs from 'node:fs';
import path from 'node:path';

const phase = path.resolve('specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment');
const plan = fs.readFileSync(path.join(phase, 'plan.md'), 'utf8').split('\n');

const scenarioNames = [
  'placeholder-token-warning-while-draft',
  'placeholder-token-error-after-draft',
  'placeholder-gate-legacy-stamp-unchanged',
  'example-drift-guard-catches-leak',
  'golden-render-all-levels',
  'authoring-card-router-intents',
  'authoring-card-sync-guard',
  'level-1-packet-authored-from-card',
];
const catalogNames = [
  'versioned-placeholder-gate',
  'template-section-fill-guidance',
  'example-drift-guard',
  'spec-authoring-card',
];

function extract(fence, targetLength) {
  const closer = fence.startsWith('````') ? '````' : '```';
  const blocks = [];
  let inside = false;
  let buf = [];
  for (const line of plan) {
    if (!inside && line === fence) { inside = true; buf = []; continue; }
    if (inside && line === closer) { inside = false; blocks.push(buf.join('\n')); continue; }
    if (inside) buf.push(line);
  }
  if (blocks.length !== targetLength) throw new Error(`${fence}: expected ${targetLength}, got ${blocks.length}`);
  return blocks;
}

const pkg = path.join(phase, 'scratch/test/pkg');
const scenarioRoot = path.join(pkg, 'manual-testing-playbook/template-authoring');
const catalogRoot = path.join(phase, 'scratch/test/catalog-dry');
fs.mkdirSync(scenarioRoot, { recursive: true });
fs.mkdirSync(catalogRoot, { recursive: true });

extract('````markdown', scenarioNames.length).forEach((text, i) => {
  fs.writeFileSync(path.join(scenarioRoot, `${scenarioNames[i]}.md`), text);
});
const catalogBlocks = extract('```markdown', 8);
catalogNames.forEach((name, i) => {
  fs.writeFileSync(path.join(catalogRoot, `${name}.md`), catalogBlocks[i]);
});

console.log(`scenarios=${scenarioNames.length} catalog=${catalogNames.length}`);
