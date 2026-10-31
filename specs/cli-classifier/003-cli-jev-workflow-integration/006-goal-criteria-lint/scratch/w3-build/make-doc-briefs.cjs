'use strict';
// Orchestrator helper: write the task text for each doc brief. Each brief makes
// one target byte-identical to literal text the orchestrator wrote in content/.
const fs = require('node:fs');
const path = require('node:path');

const W = 'specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/scratch/w3-build';
const GOAL = '.skilled/skills/sk-doc/sk-create-goal';
const DOCS = [
  ['09-changelog', 'create', 'changelog entry (compact format, Frontmatter Contract of sk-create-changelog)', 'changelog-v1.3.0.0.md', GOAL + '/changelog/v1.3.0.0.md', []],
  ['10-playbook-scenario', 'create', 'manual testing playbook scenario (sk-create-manual-testing-playbook snippet shape)', 'playbook-lint-goal-criteria.md', GOAL + '/manual-testing-playbook/goal-authoring/lint-goal-criteria.md', []],
  ['11-catalog-leaf', 'create', 'feature catalog entry (sk-create-feature-catalog leaf shape)', 'catalog-goal-criteria-lint.md', '.skilled/skills/sk-doc/feature-catalog/document-validation/goal-criteria-lint.md', []],
  ['12-skill-md', 'replace', 'skill manifest SKILL.md', 'skill-md.new.md', GOAL + '/SKILL.md', [
    'line 5: version 1.2.0.0 becomes 1.3.0.0',
    'line 109 (step 7): two sentences appended that name the advisory lint command',
    'line 155: the scripts/README.md bullet names the lint and its scorer'
  ]],
  ['13-readme', 'replace', 'skill README', 'readme.new.md', GOAL + '/README.md', [
    'section 6: a new "### The Advisory Criteria Lint" subsection after the checker paragraph',
    'section 8: "eight" becomes "nine" and one table row for lint-goal-criteria.md',
    'section 9: the tests row reads pass 40, a new Criteria lint row, scenarios=9',
    'section 10: the scripts/README.md and playbook rows'
  ]],
  ['14-scripts-readme', 'replace', 'code-folder README', 'scripts-readme.new.md', GOAL + '/scripts/README.md', [
    'frontmatter title, description and two trigger phrases; the H1',
    'section 1: five checks, not four, a lint paragraph and two state bullets',
    'section 2: four tree lines; section 3: five key-file rows',
    'section 4: a lint paragraph and flow block; section 5: the corrected --all exit rule and the lint and scorer commands'
  ]],
  ['15-playbook-root', 'replace', 'manual testing playbook root', 'playbook-root.new.md', GOAL + '/manual-testing-playbook/manual-testing-playbook.md', [
    'frontmatter description: "eight" becomes "nine"',
    'section 7: heading range SCG-009 and a new SCG-009 block before section 8',
    'section 8: one automated-test row; section 9: one index row for SCG-009'
  ]],
  ['16-catalog-root', 'replace', 'feature catalog root', 'catalog-root.new.md', '.skilled/skills/sk-doc/feature-catalog/feature-catalog.md', [
    'frontmatter description, one trigger phrase and last_updated',
    'the intro paragraph gains one sentence',
    'section 4: a new "### Goal Criteria Lint" block, and the closing Note names the lint'
  ]]
];

for (const [name, mode, kind, source, target, hunks] of DOCS) {
  const src = W + '/content/' + source;
  const lines = [
    'TASK: ' + (mode === 'create' ? 'create one new ' : 'update one existing ') + kind + ' so it is byte-identical to literal text the orchestrator already wrote to sk-doc\'s rules for that doc type.',
    'Source (read only, do not edit): ' + src,
    'Target (' + (mode === 'create' ? 'create' : 'replace its content') + '): ' + target
  ];
  if (hunks.length > 0) {
    lines.push('', 'The source differs from the current target only here (read both first and confirm):');
    for (const hunk of hunks) lines.push('- ' + hunk);
  }
  lines.push(
    '',
    'Step: make the target byte-identical to the source, for example with',
    '  cp ' + src + ' ' + target,
    'Do not reword, reflow or reformat anything. Do not run any command the document lists. Change no other file.',
    '',
    'VERIFY (repo root):',
    '  cmp ' + src + ' ' + target,
    '  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py ' + target,
    'Accept when: 1 file ' + (mode === 'create' ? 'created' : 'changed') + ' and nothing else; cmp prints nothing and exits 0; validate_document exits 0.'
  );
  fs.writeFileSync(path.join(__dirname, 'briefs', name + '.task.txt'), lines.join('\n') + '\n');
  console.log(name);
}
