'use strict';
// Probe: does the same goal.md read differently to the validator's two frontmatter
// boundaries, and what do the shipped rules report for each spelling?
const { mkdirSync, writeFileSync, rmSync } = require('node:fs');
const { join } = require('node:path');
const REPO = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const validator = require(`${REPO}/.opencode/skills/system-spec-kit/runtime/dist/lib/validation/spec-doc-structure.js`);
const RUNTIME = require(`${REPO}/.opencode/hooks/goal/lib/goal-slice.cjs`);

const ROOT = `${REPO}/specs/system-speckit/033-system-speckit-v4/036-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review-3/scratch/frontmatter-boundary`;

// A goal.md that satisfies the anchor gates but carries NO _memory continuity block,
// in three fence spellings.
function doc(opener, closer) {
  return [
    opener,
    'title: "fixture goal"',
    'description: "fixture"',
    'importance_tier: "normal"',
    'contextType: "implementation"',
    closer,
    '<!-- ANCHOR:directive -->',
    '## 1. DIRECTIVE',
    '',
    'Body.',
    '',
    '<!-- /ANCHOR:directive -->',
    '',
    '<!-- ANCHOR:completion -->',
    '## 2. COMPLETION',
    '',
    '- [ ] done',
    '',
    '<!-- /ANCHOR:completion -->',
    '',
    '<!-- ANCHOR:log -->',
    '## 3. LOG',
    '',
    '| Item | State | Evidence |',
    '|------|-------|----------|',
    '',
  ].join('\n');
}

const variants = {
  'exact fence': doc('---', '---'),
  'trailing-space fence': doc('---  ', '---  '),
  'no frontmatter at all': doc('', '').replace(/^\n/, ''),
};

for (const [name, content] of Object.entries(variants)) {
  const folder = join(ROOT, name.replace(/[^a-z0-9]+/gi, '-'));
  rmSync(folder, { recursive: true, force: true });
  mkdirSync(folder, { recursive: true });
  writeFileSync(join(folder, 'goal.md'), content, 'utf8');

  const memory = validator.runSpecDocStructureRule({ folder, level: '1', rule: 'FRONTMATTER_MEMORY_BLOCK' });
  const budget = validator.runSpecDocStructureRule({ folder, level: '1', rule: 'SPEC_DOC_SUFFICIENCY' });
  console.log(`--- ${name}`);
  console.log(`   FRONTMATTER_MEMORY_BLOCK status=${memory.status} codes=${(memory.diagnostics || []).map((d) => `${d.code}:${d.severity}`).join(',') || 'none'} ${(memory.diagnostics || []).map((d) => d.detail).join(' | ')}`);
  console.log(`   SPEC_DOC_SUFFICIENCY    status=${budget.status} codes=${(budget.diagnostics || []).map((d) => `${d.code}:${d.severity}`).join(',') || 'none'} ${(budget.diagnostics || []).map((d) => d.detail).join(' | ')}`);
  console.log(`   runtime durable slice   ${RUNTIME.extractDurableSlice(content).length} chars | validator goal slice ${validator.extractGoalDurableSlice(content).length} chars`);
}
