'use strict';
// Builds dispatch-units.json from the OLD/NEW text files under units/.
const fs = require('node:fs');
const path = require('node:path');

const FOLDER = 'specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/006-deep-loop-follow-ups';
const UNITS = path.join(__dirname, 'units');
const RS = '.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs';
const RT = '.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts';
const EA = '.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts';
const ET = '.skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts';
const SK = '.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md';
const PM = '.skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md';
const CP = '.skilled/skills/cli-external-orchestration/cli-pi/changelog/v1.5.14.0.md';
const CR = '.skilled/skills/system-deep-loop/runtime/changelog/v1.9.3.0.md';
const DR = '.skilled/skills/system-deep-loop/deep-review/README.md';
const DS = '.skilled/skills/system-deep-loop/deep-review/SKILL.md';
const DC = '.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.4.0.md';
const RC = '.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml';

const read = (name) => fs.readFileSync(path.join(UNITS, name), 'utf8');
const edit = (task, file, check, expect) => ({
  task,
  files: [file],
  kind: 'edit',
  instruction: `In ${file}, replace the exact text <<<OLD\n${read(`${task}.old.txt`)}OLD>>> with <<<NEW\n${read(`${task}.new.txt`)}NEW>>>`,
  check,
  expect,
});
const create = (task, file, source) => ({
  task,
  files: [file],
  kind: 'create',
  instruction: `Create ${file} with exactly the content of ${FOLDER}/scratch/units/${source}`,
  check: `cmp ${FOLDER}/scratch/units/${source} ${file} && echo identical`,
  expect: 'identical',
});

const units = [
  edit('T012', RS, `grep -c '^function parseNumberedFindingLine(line, severity, findingId) {$' ${RS}`, '1'),
  edit('T013', RS, `grep -c '^function parseFindingsBlock(sectionText, severity, run = 0) {$' ${RS}`, '1'),
  edit('T014', RS, `grep -cF "...parseFindingsBlock(p1Block, 'P1', run)," ${RS}`, '1'),
  edit('T015', RS, `grep -cF 'if (numberedNarrativeFindings.has(finding) && structuredRuns.has(iteration.run)) {' ${RS}`, '1'),
  edit('T016', RT, `grep -cF "describe('reduceReviewState: numbered finding narrative'" ${RT}`, '1'),
  edit('T017', EA, `grep -cF "'cli-pi': ['PI_BLACKHOLE_PASSIVE']," ${EA}`, '1'),
  edit('T018', EA, `grep -cF 'if ((EXECUTOR_ENV_KEYS_BY_KIND[kind] ?? []).includes(key)) {' ${EA}`, '1'),
  edit('T019', ET, `grep -cF "describe('executor-audit: cli-pi environment filter'" ${ET}`, '1'),
  edit('T020', SK, `grep -cF 'cli-pi environment filter passes this one variable through' ${SK}`, '1'),
  edit('T021', SK, `grep -c '^version: 1.5.14.0$' ${SK}`, '1'),
  edit('T022', PM, `grep -cF 'AI_SESSION_CHILD=1 PI_BLACKHOLE_PASSIVE=true pi -p' ${PM}`, '1'),
  edit('T023', PM, `grep -cF "switches the operator's global pi-blackhole package to passive" ${PM}`, '1'),
  create('T024', CP, 'T024.cli-pi-v1.5.14.0.md'),
  create('T025', CR, 'T025.runtime-v1.9.3.0.md'),
  edit('T026', RC, `grep -cF 'are owned by .skilled/skills/sk-code/sk-code-review/references/review-core.md.' ${RC}`, '1'),
  edit('T027', DR, `grep -cF 'The severity ids and their meanings belong to [\`review-core.md\`](../../sk-code/sk-code-review/references/review-core.md)' ${DR}`, '1'),
  edit('T028', DS, `grep -c '^version: 1.11.4.0$' ${DS}`, '1'),
  create('T029', DC, 'T029.deep-review-v1.11.4.0.md'),
];

fs.writeFileSync(path.join(__dirname, 'dispatch-units.json'), `${JSON.stringify(units, null, 2)}\n`);
console.log(`wrote ${units.length} units`);
