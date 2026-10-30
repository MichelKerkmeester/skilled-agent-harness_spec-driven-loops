import fs from 'node:fs';
import path from 'node:path';

const phase = path.resolve('specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment');
const pkg = path.join(phase, 'scratch/test/pkg');
const root = path.join(pkg, 'manual-testing-playbook');
const rows = [
  ['476', 'Placeholder token warning while Draft', 'placeholder-token-warning-while-draft', 'versioned-placeholder-gate'],
  ['477', 'Placeholder token error after Draft', 'placeholder-token-error-after-draft', 'versioned-placeholder-gate'],
  ['478', 'Placeholder gate unchanged for a v2.2 doc', 'placeholder-gate-legacy-stamp-unchanged', 'versioned-placeholder-gate'],
  ['479', 'Example drift guard catches a leaked description', 'example-drift-guard-catches-leak', 'example-drift-guard'],
  ['480', 'Golden render of every level', 'golden-render-all-levels', 'template-section-fill-guidance'],
  ['481', 'Authoring card loaded by four intents', 'authoring-card-router-intents', 'spec-authoring-card'],
  ['482', 'Authoring card sync guard', 'authoring-card-sync-guard', 'spec-authoring-card'],
  ['483', 'Level 1 packet authored from the card', 'level-1-packet-authored-from-card', 'spec-authoring-card'],
];

const lines = [
  '---',
  'title: "Dry Playbook"',
  'description: "Dry package for the new template authoring scenarios."',
  'version: 1.0.0.0',
  '---',
  '',
  '# Dry Playbook',
  '',
  '<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->',
  '',
  '## 7. SCENARIO DIRECTORY',
  '',
  '| Playbook ID | Scenario | Scenario File | Catalog Entry |',
  '|---|---|---|---|',
  ...rows.map(([id, title, slug, catalog]) =>
    `| ${id} | ${title} | [${id}](template-authoring/${slug}.md) | [${catalog}](../feature-catalog/tooling-and-scripts/${catalog}.md) |`),
  '',
  'Provenance: manual only - an operator runs each scenario linked from Section 7',
  '',
];
fs.mkdirSync(root, { recursive: true });
fs.writeFileSync(path.join(root, 'manual-testing-playbook.md'), lines.join('\n'));

for (const target of [
  'feature-catalog/tooling-and-scripts/versioned-placeholder-gate.md',
  'feature-catalog/tooling-and-scripts/template-section-fill-guidance.md',
  'feature-catalog/tooling-and-scripts/example-drift-guard.md',
  'feature-catalog/tooling-and-scripts/spec-authoring-card.md',
  'runtime/cli/spec/validate.sh',
  'runtime/cli/spec/check-example-drift.sh',
  'runtime/cli/spec/check-card-sync.sh',
  'runtime/cli/tests/scaffold-golden-snapshots.vitest.ts',
  'SKILL.md',
  'references/workflows/spec-authoring-card.md',
]) {
  const full = path.join(pkg, target);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, 'stub\n');
}
console.log('dry package written');
