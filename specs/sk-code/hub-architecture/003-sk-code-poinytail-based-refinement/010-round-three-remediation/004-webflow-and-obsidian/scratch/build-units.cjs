// Builds dispatch-units.json for this phase and proves every OLD text occurs exactly once.
// Run from the repository root: node <this file> [--write]
'use strict';
const fs = require('fs');
const path = require('path');

const PHASE = 'specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian';
const WF = '.skilled/skills/sk-code/sk-code-webflow';
const OB = '.skilled/skills/sk-code/sk-code-obsidian';
const T = `${WF}/assets/templates`;
const R = `${WF}/references`;
const ABS = '.skilled/skills/sk-code/sk-code-webflow/references';

const edits = [
  ['T014', `${T}/component-template.js`,
    '// Conventions enforced (see `references/webflow/javascript/style-guide.md`):',
    `// Conventions enforced (see \`${ABS}/javascript/style-guide/\`):`],
  ['T015', `${T}/component-template.css`,
    '   Conventions enforced (see references/webflow/css/style-guide.md):',
    `   Conventions enforced (see ${ABS}/css/style-guide.md):`],
  ['T016', `${T}/embed-template.html`,
    '   Conventions enforced (see references/webflow/html/style-guide.md):',
    `   Conventions enforced (see ${ABS}/html/style-guide.md):`],
  ['T017', `${T}/embed-template.html`,
    '   See references/webflow/javascript/quality-standards.md §13 Action Routing Pattern.',
    `   See ${ABS}/javascript/quality-standards/shared-listener-and-weakmap.md §2 Action Routing Pattern.`],
  ['T018', `${T}/form-scaffold-template.html`,
    '   Conventions enforced (see references/webflow/html/style-guide.md §3 Data-Attribute Conventions):',
    `   Conventions enforced (see ${ABS}/html/style-guide.md §3 Data-Attribute Conventions):`],
  ['T019', `${T}/form-scaffold-template.html`,
    '     - references/webflow/html/style-guide.md §3 Form-field state markers',
    `     - ${ABS}/html/style-guide.md §3 Form-field state markers`],
  ['T020', `${T}/form-scaffold-template.html`,
    '     - references/webflow/javascript/quick-reference.md §5 Form Validation Classes',
    `     - ${ABS}/javascript/quick-reference.md §5 Form Validation Classes`],
  ['T021', `${T}/form-scaffold-template.html`,
    '     - references/webflow/css/quick-reference.md §3 Form Validation Classes',
    `     - ${ABS}/css/quick-reference.md §4 Form Validation Classes`],
  ['T022', `${T}/head-footer-code-template.html`,
    '   Conventions enforced (see references/webflow/html/style-guide.md §7):',
    `   Conventions enforced (see ${ABS}/html/style-guide.md §7):`],
  ['T023', `${R}/html/style-guide.md`,
    '(see [`../javascript/quality-standards/init-dom-error-and-async.md`](../javascript/quality-standards/init-dom-error-and-async.md) §13 Action Routing Pattern)',
    '(see [`../javascript/quality-standards/shared-listener-and-weakmap.md`](../javascript/quality-standards/shared-listener-and-weakmap.md) §2 Action Routing Pattern)'],
  ['T024', `${R}/html/style-guide.md`,
    '(see [`../javascript/quick-reference.md`](../javascript/quick-reference.md) §10 Form Validation Classes)',
    '(see [`../javascript/quick-reference.md`](../javascript/quick-reference.md) §5 Form Validation Classes)'],
  ['TXXX', `${R}/html/style-guide.md`,
    '[`../javascript/quality-standards/init-dom-error-and-async.md`](../javascript/quality-standards/init-dom-error-and-async.md) §13 handles this',
    '[`../javascript/quality-standards/shared-listener-and-weakmap.md`](../javascript/quality-standards/shared-listener-and-weakmap.md) §2 handles this'],
  ['T025', `${R}/shared/cross-language-rules.md`,
    '1. **Quantity limit:** Maximum 5 comments per 10 lines of code',
    '1. **Quantity limit (Webflow setting):** Maximum 5 comments per 10 lines of code. This number is the Webflow surface\'s own setting. The shared comment rule in [`../../../shared/references/universal/code-style-guide.md`](../../../shared/references/universal/code-style-guide.md) §4 owns comment density and lets each surface set its own budget.'],
  ['T026', `${R}/shared/cross-language-rules.md`,
    'is defined once for both surfaces in [`../../universal/code-style-guide.md`](../../../shared/references/universal/code-style-guide.md)',
    'is defined once for every surface in [`../../../shared/references/universal/code-style-guide.md`](../../../shared/references/universal/code-style-guide.md)'],
  ['T027', `${R}/javascript/quick-reference.md`,
    '- [ ] Maximum 5 comments per 10 lines\n',
    '- [ ] Maximum 5 comments per 10 lines. This is the Webflow setting, and the shared comment rule in [`../../../shared/references/universal/code-style-guide.md`](../../../shared/references/universal/code-style-guide.md) §4 owns comment density\n'],
  ['TXXX', `${R}/javascript/quick-reference.md`,
    '[`../css/quick-reference.md`](../css/quick-reference.md) §3 Form Validation Classes',
    '[`../css/quick-reference.md`](../css/quick-reference.md) §4 Form Validation Classes'],
  ['TXXX', `${R}/css/quality-standards/focus-has-print-and-quick-reference.md`,
    '(in `references/webflow/css/quick-reference.md` §5)',
    '(in [`../quick-reference.md`](../quick-reference.md) §6)'],
  ['T028', `${R}/shared/enforcement.md`,
    '[`../../../assets/webflow/checklists/code-quality-checklist.md`]',
    '[`../../../sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md`]'],
  ['T029', `${WF}/SKILL.md`, 'version: 1.1.0.0\n', 'version: 1.1.1.0\n'],
  ['T030', `${WF}/changelog/v1.1.1.0.md`, null, `${PHASE}/scratch/units/webflow-changelog-v1.1.1.0.md`],
  ['T031', `${OB}/SKILL.md`,
    [
      '- Renderer-implementation pre-flight checklist — `assets/renderer-implementation-checklist.md`',
      '- Comment-grammar adoption checklist — `assets/comment-grammar-checklist.md`',
      '- Folder-docs pairing checklist — `assets/folder-docs-checklist.md`',
      '- Debugging checklist for view/pipeline regressions — `assets/debug-checklist.md`',
      '- Verification-gate checklist — `assets/verification-checklist.md`',
    ].join('\n') + '\n',
    [
      '- MODULE banner and section-comment checklist: `assets/comment-banner-checklist.md`',
      '- Folder-docs pairing checklist: `assets/folder-docs-checklist.md`',
      '- `.db-*` class-rename checklist: `assets/db-class-rename-checklist.md`',
      '- Screenshot fixture authoring checklist: `assets/fixture-authoring-checklist.md`',
      '- Screenshot coverage checklist: `assets/screenshot-coverage-checklist.md`',
      '- Modal screenshot-coverage checklist: `assets/modal-coverage-checklist.md`',
      '- Verification-gate checklist: `assets/verification-checklist.md`',
    ].join('\n') + '\n'],
  ['T032', `${OB}/SKILL.md`, 'version: 0.1.2.0\n', 'version: 0.1.3.0\n'],
  ['T033', `${OB}/manual-testing-playbook/manual-testing-playbook.md`,
    '# sk-code-obsidian: Manual Testing Playbook\n\nRouting-recall corpus for',
    '# sk-code-obsidian: Manual Testing Playbook\n\n## 1. OVERVIEW\n\nRouting-recall corpus for'],
  ['T034', `${OB}/changelog/v0.1.3.0.md`, null, `${PHASE}/scratch/units/obsidian-changelog-v0.1.3.0.md`],
  ['TXXX', `${OB}/manual-testing-playbook/manual-testing-playbook.md`,
    [
      "## Honesty note: `SKILL.md`'s own map has drifted from the shipped tree",
      '',
      "`SKILL.md` §2b's own `RESOURCE_MAP` names a few reference filenames",
      '(`references/single-stylesheet-ownership.md`, `references/screenshot-fixture-harness.md`,',
      '`references/obsidian-api-boundary.md`, `assets/renderer-implementation-checklist.md`,',
      '`assets/comment-grammar-checklist.md`, `assets/debug-checklist.md`) that do not match the shipped',
      'tree — the real files are `references/stylesheet-ownership.md`, `references/screenshot-harness.md`,',
      '`references/obsidian-plugin-api.md`, and the seven checklists actually present under `assets/`',
      '(`comment-banner-checklist.md`, `db-class-rename-checklist.md`, `fixture-authoring-checklist.md`,',
      '`folder-docs-checklist.md`, `modal-coverage-checklist.md`, `screenshot-coverage-checklist.md`,',
      '`verification-checklist.md`). `OB-H06` once recorded a second, distinct kind of drift beyond stale',
      'filenames:',
    ].join('\n'),
    [
      "## Honesty note: `SKILL.md`'s map matches the shipped tree",
      '',
      '`SKILL.md` names only files the packet ships. Its references include',
      '`references/stylesheet-ownership.md`, `references/screenshot-harness.md` and',
      '`references/obsidian-plugin-api.md`, and the checklists in its §2b `RESOURCE_MAP` and §4 asset list',
      'are the seven present under `assets/` (`comment-banner-checklist.md`, `db-class-rename-checklist.md`,',
      '`fixture-authoring-checklist.md`, `folder-docs-checklist.md`, `modal-coverage-checklist.md`,',
      '`screenshot-coverage-checklist.md` and `verification-checklist.md`). `OB-H06` once recorded a',
      'different kind of drift:',
    ].join('\n')],
  ['TXXX', `${OB}/manual-testing-playbook/intent-detection/renderer-feature-routing.md`,
    [
      '   mirror), and that `SKILL.md` §2b currently names `references/single-stylesheet-ownership.md` and',
      '   `assets/renderer-implementation-checklist.md`, neither of which exists in the shipped tree; the',
      '   real filenames are `references/stylesheet-ownership.md` and the checklists under `assets/`.',
    ].join('\n'),
    [
      '   mirror), and that `SKILL.md` §2b names `references/stylesheet-ownership.md` and the checklists',
      '   under `assets/`, which are the filenames the shipped tree carries.',
    ].join('\n')],
  ['TXXX', `${OB}/manual-testing-playbook/intent-detection/debugging-routing.md`,
    [
      "   an exact mirror), and `SKILL.md` §2b's own `DEBUGGING` entry currently names",
      '   `assets/debug-checklist.md`, which does not exist in the shipped tree.',
    ].join('\n'),
    [
      "   an exact mirror), and `SKILL.md` §2b's own `DEBUGGING` entry names only shipped files:",
      '   `references/view-renderer-architecture.md`, `references/mobile-and-touch.md` and',
      '   `references/verification.md`.',
    ].join('\n')],
  ['TXXX', `${OB}/manual-testing-playbook/intent-detection/stack-standards-routing.md`,
    [
      '   excerpt — note `SKILL.md` §2b currently names `references/obsidian-api-boundary.md` and',
      '   `references/screenshot-fixture-harness.md`, neither of which exists; the real filenames are',
      '   `references/obsidian-plugin-api.md` and `references/screenshot-harness.md`. This scenario\'s set is',
      '   a curated core subset built from the live paths, not an exact mirror of the stale map.',
    ].join('\n'),
    [
      '   excerpt. `SKILL.md` §2b names `references/obsidian-plugin-api.md` and',
      '   `references/screenshot-harness.md`, the filenames the shipped tree carries. This scenario\'s set is',
      '   a curated core subset built from the live paths, not an exact mirror of the map.',
    ].join('\n')],
  ['TXXX', `${OB}/manual-testing-playbook/unknown-fallback/zero-keyword-prompt.md`,
    [
      "§2b's stale `DEFAULT_RESOURCE` block (`references/obsidian-api-boundary.md`,",
      '`references/comment-grammar.md`); this scenario\'s own `expected_resources` swaps the first path for',
      'the real file `references/obsidian-plugin-api.md` per the packet\'s own honesty note.',
    ].join('\n'),
    [
      "§2b's `DEFAULT_RESOURCE` block (`references/obsidian-plugin-api.md`,",
      '`references/comment-grammar.md`), which matches this scenario\'s own `expected_resources`.',
    ].join('\n')],
  ['TXXX', `${OB}/README.md`,
    '1. Read `references/obsidian-api-boundary.md` to confirm',
    '1. Read `references/obsidian-plugin-api.md` to confirm'],
  ['TXXX', `${OB}/README.md`,
    'See `references/screenshot-fixture-harness.md`.',
    'See `references/screenshot-harness.md`.'],
  ['TXXX', `${R}/shared/dev-workflow/common-commands.md`,
    'See: [performance_patterns.md](../../implementation/performance-patterns/overview-and-checklist.md)',
    'See: [`../../implementation/performance-patterns/overview-and-checklist.md`](../../implementation/performance-patterns/overview-and-checklist.md)'],
  ['TXXX', `${R}/shared/dev-workflow/common-commands.md`,
    'See: [security_patterns.md](../../implementation/security-patterns/overview-and-checklist.md)',
    'See: [`../../implementation/security-patterns/overview-and-checklist.md`](../../implementation/security-patterns/overview-and-checklist.md)'],
  ['TXXX', `${R}/shared/dev-workflow/common-commands.md`,
    'See: [debugging_workflows.md](../../debugging/debugging-workflows/systematic-four-phases.md)',
    'See: [`../../debugging/debugging-workflows/systematic-four-phases.md`](../../debugging/debugging-workflows/systematic-four-phases.md)'],
];

function count(hay, needle) {
  let n = 0;
  let i = hay.indexOf(needle);
  while (i !== -1) { n += 1; i = hay.indexOf(needle, i + 1); }
  return n;
}

function shq(s) { return `'${s.replace(/'/g, `'\\''`)}'`; }

// A check greps for a fixed line of the new text, so the unit is proven by content, not by exit status alone.
function checkFor(file, newText) {
  const probe = newText.startsWith('# sk-code-obsidian: Manual Testing Playbook') ? '## 1. OVERVIEW' : newText.split('\n').find((l) => l.trim().length > 0).trim();
  return { check: `grep -cF -- ${shq(probe)} ${file}`, expect: '1' };
}

edits.forEach((e, i) => { e[0] = `T0${14 + i}`; });
const units = [];
let failures = 0;
for (const [task, file, oldText, newText] of edits) {
  if (oldText === null) {
    const src = newText;
    if (!fs.existsSync(src)) { console.log(`FAIL ${task} source missing ${src}`); failures += 1; }
    if (fs.existsSync(file)) { console.log(`FAIL ${task} target already exists ${file}`); failures += 1; }
    units.push({
      task, files: [file], kind: 'create',
      instruction: `Create ${file} with exactly the content of ${src}. Copy it byte for byte, for example with: cp ${src} ${file}`,
      check: `cmp ${src} ${file} && echo same`, expect: 'same',
    });
    console.log(`OK   ${task} create ${file}`);
    continue;
  }
  const body = fs.readFileSync(file, 'utf8');
  const n = count(body, oldText);
  const m = count(body, newText);
  if (n !== 1) { console.log(`FAIL ${task} old text occurs ${n} times in ${file}`); failures += 1; continue; }
  if (m !== 0) { console.log(`FAIL ${task} new text already present in ${file}`); failures += 1; continue; }
  const c = checkFor(file, newText);
  units.push({
    task, files: [file], kind: 'edit',
    instruction: `In ${file}, replace the exact text <<<OLD\n${oldText}\nOLD>>> with <<<NEW\n${newText}\nNEW>>>. The old text occurs exactly once in the file. Change nothing else.`,
    check: c.check, expect: c.expect,
  });
  console.log(`OK   ${task} old text occurs once in ${file}`);
}

if (process.argv.includes('--write')) {
  const out = path.join(PHASE, 'scratch', 'dispatch-units.json');
  fs.writeFileSync(out, JSON.stringify(units, null, 2) + '\n');
  console.log(`wrote ${out} (${units.length} units)`);
}
console.log(failures === 0 ? `RESULT: PASSED (${units.length} units)` : `RESULT: FAILED (${failures})`);
process.exit(failures === 0 ? 0 : 1);
