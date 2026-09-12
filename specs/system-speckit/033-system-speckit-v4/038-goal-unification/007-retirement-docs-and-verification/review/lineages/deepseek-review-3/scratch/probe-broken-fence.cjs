'use strict';
// Probe: what a broken goal.md fence produces through the shipped validator rules,
// and what the runtime makes of the same document.
const { mkdirSync, writeFileSync, rmSync } = require('node:fs');
const { join } = require('node:path');
const REPO = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const runtime = require(`${REPO}/.opencode/hooks/goal/lib/goal-slice.cjs`);
const validator = require(`${REPO}/.opencode/skills/system-spec-kit/runtime/dist/lib/validation/spec-doc-structure.js`);

const ROOT = `${REPO}/specs/system-speckit/033-system-speckit-v4/036-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review-3/scratch/broken-fence`;
rmSync(ROOT, { recursive: true, force: true });
mkdirSync(ROOT, { recursive: true });

const padding = 'x'.repeat(4200);
const broken = [
  '---',
  'title: "broken fence goal"',
  '_memory:',
  '  continuity:',
  '    packet_pointer: "broken"',
  '    last_updated_at: "2026-09-11T00:00:00Z"',
  '<!-- ANCHOR:directive -->',
  '## 1. DIRECTIVE',
  '',
  padding,
  '',
  '<!-- /ANCHOR:directive -->',
  '',
  '<!-- ANCHOR:log -->',
  '| Item | State | Evidence |',
  '|------|-------|----------|',
  '<!-- /ANCHOR:log -->',
  '',
].join('\n');
writeFileSync(join(ROOT, 'goal.md'), broken, 'utf8');

console.log('RUNTIME_BROKEN_READ', JSON.stringify(runtime.readPacketGoal(REPO, ROOT.slice(REPO.length + 1))));
console.log('RUNTIME_SLICE_LEN', runtime.extractDurableSlice(broken).length);
console.log('VALIDATOR_SLICE_LEN', validator.extractGoalDurableSlice(broken).length);

for (const rule of ['SPEC_DOC_SUFFICIENCY', 'FRONTMATTER_MEMORY_BLOCK']) {
  try {
    const result = validator.runSpecDocStructureRule({ folder: ROOT, level: '1', rule });
    console.log(`RULE ${rule} status=${result.status} codes=${(result.diagnostics || []).map((d) => `${d.code}:${d.severity}`).join(',') || 'none'}`);
    for (const diagnostic of (result.diagnostics || [])) console.log(`   ${diagnostic.code} ${diagnostic.severity} ${diagnostic.detail}`);
  } catch (error) {
    console.log(`RULE ${rule} threw ${error.message}`);
  }
}
console.log('EXPORTED_RULES', Object.keys(validator).filter((key) => /^RULE|^run|^validate/i.test(key)).slice(0, 20).join(','));
