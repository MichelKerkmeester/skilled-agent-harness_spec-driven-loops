import fs from 'node:fs';
import path from 'node:path';

const phase = path.resolve('specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment');
const plan = fs.readFileSync(path.join(phase, 'plan.md'), 'utf8').split('\n');

const blocks = [];
let inside = false;
let buf = [];
for (const line of plan) {
  if (!inside && line === '```markdown') { inside = true; buf = []; continue; }
  if (inside && line === '```') { inside = false; blocks.push(buf.join('\n')); continue; }
  if (inside) buf.push(line);
}

const rootBlocks = blocks.slice(4);
if (rootBlocks.length !== 4) throw new Error(`expected 4 root blocks, got ${rootBlocks.length}`);

const pkg = path.join(phase, 'scratch/test/catalog-pkg/system-spec-kit/feature-catalog');
fs.mkdirSync(path.join(pkg, 'tooling-and-scripts'), { recursive: true });
for (const name of ['versioned-placeholder-gate', 'template-section-fill-guidance', 'example-drift-guard', 'spec-authoring-card']) {
  fs.copyFileSync(path.join(phase, 'scratch/test/catalog-dry', `${name}.md`), path.join(pkg, 'tooling-and-scripts', `${name}.md`));
}

const header = [
  '---',
  'title: "Dry Feature Catalog"',
  'description: "Dry catalog for the four new template authoring entries."',
  'trigger_phrases:',
  '  - "dry catalog"',
  'last_updated: "2026-10-23"',
  'version: 1.0.0.0',
  '---',
  '',
  '# Dry Feature Catalog',
  '',
  '## 1. OVERVIEW',
  '',
  'Dry catalog for the four new template authoring entries.',
  '',
  '## 2. TOOLING AND SCRIPTS',
  '',
].join('\n');
fs.writeFileSync(path.join(pkg, 'feature-catalog.md'), `${header}${rootBlocks.join('\n')}`);
console.log('dry catalog written');
