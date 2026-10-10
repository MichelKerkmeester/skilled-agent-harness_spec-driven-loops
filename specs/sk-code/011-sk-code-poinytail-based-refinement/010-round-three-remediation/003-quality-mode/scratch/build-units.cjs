#!/usr/bin/env node
// Builds dispatch-units.json from the current skill files so every OLD text is quoted
// byte for byte, then proves each OLD text occurs exactly once in its file.
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../../../../../..');
const HERE = path.relative(ROOT, __dirname);
const SK = '.skilled/skills/sk-code/sk-code-quality/SKILL.md';
const RD = '.skilled/skills/sk-code/sk-code-quality/README.md';
const CL = '.skilled/skills/sk-code/sk-code-quality/changelog/v1.1.1.0.md';
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const skLines = read(SK).split('\n');
const rdLines = read(RD).split('\n');
const L = (n) => skLines[n - 1];
const R = (n) => rdLines[n - 1];
const rename = (s) => s
  .replace(/(^|[^-])code-webflow/g, '$1sk-code-webflow')
  .replace(/(^|[^-])code-opencode/g, '$1sk-code-opencode')
  .replace(/(^|[^-])code-review/g, '$1sk-code-review');
const esc = (s) => s.replace(/'/g, "'\\''");

const units = [];
let t = 12;
function edit(file, oldText, newText, check, expect) {
  units.push({
    task: `T${String(t++).padStart(3, '0')}`,
    files: [file],
    kind: 'edit',
    instruction: `In ${file}, replace the exact text <<<OLD\n${oldText}\nOLD>>> with <<<NEW\n${newText}\nNEW>>>`,
    check,
    expect,
    _old: oldText,
    _new: newText,
  });
}
const fixedCheck = (file, needle) => `grep -cF -- '${esc(needle)}' ${file}`;

// SKILL.md, in file order.
edit(SK, L(5), 'version: 1.1.1.0', `sed -n 5p ${SK}`, 'version: 1.1.1.0');
for (const n of [15, 36, 39, 47, 50]) {
  const nw = rename(L(n));
  edit(SK, L(n), nw, fixedCheck(SK, nw), '1');
}
{
  const nw = '- `scripts/hooks/claude-posttooluse.sh` is the legacy write-time hook, kept for direct tests and registered in no runtime. The live write-time warning is `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs`.';
  edit(SK, L(94), nw, fixedCheck(SK, nw), '1');
}
{
  const nw = "| ON_DEMAND | Need the legacy write-time hook's behavior, which no runtime registers | `scripts/hooks/claude-posttooluse.sh` |";
  edit(SK, L(112), nw, fixedCheck(SK, nw), '1');
}
{
  const nw = '| Write-time warning | `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs`, wired as the Claude `PostToolUse` hook for `Write` and `Edit` in `.claude/settings.json` | Warns during authoring when a comment carries ephemeral artifact labels. |';
  edit(SK, L(132), nw, fixedCheck(SK, nw), '1');
}
{
  const nw = '| Pre-commit block | `.skilled/scripts/git-hooks/pre-commit`, installed through `core.hooksPath` by `.skilled/scripts/install-git-hooks.sh` | Blocks commits with forbidden comment patterns across runtimes. |';
  edit(SK, L(133), nw, fixedCheck(SK, nw), '1');
}
{
  const nw = 'The live `.skilled/scripts/git-hooks/pre-commit` also runs the agent-mirror-sync gate and other repository gates, independent of comment hygiene, documented in `.skilled/scripts/git-hooks/README.md`. The older `.skilled/hooks/git/pre-commit` and `scripts/hooks/claude-posttooluse.sh` are compatibility helpers kept for direct tests. Neither is an installed hook.';
  edit(SK, L(136), nw, fixedCheck(SK, nw), '1');
}
edit(SK, 'code-quality routes primarily by TARGET PATH', 'sk-code-quality routes primarily by TARGET PATH', '', '');
edit(SK, "could score code-quality's one routable checklist", "could score sk-code-quality's one routable checklist", '', '');
{
  const nw = '# Thin prompt-intent router: sk-code-quality owns a single routable checklist. Its';
  edit(SK, L(145), nw, fixedCheck(SK, nw), '1');
}
for (const n of [182, 188, 202, 248, 280, 281]) {
  const nw = rename(L(n));
  edit(SK, L(n), nw, fixedCheck(SK, nw), '1');
}
{
  const nw = '- [`scripts/hooks/claude-posttooluse.sh`](scripts/hooks/claude-posttooluse.sh) - Legacy write-time comment-hygiene hook, kept for direct tests and registered in no runtime.';
  edit(SK, L(322), nw, fixedCheck(SK, nw), '1');
}

// The changelog file.
units.push({
  task: `T${String(t++).padStart(3, '0')}`,
  files: [CL],
  kind: 'create',
  instruction: `Create ${CL} with exactly the content of ${HERE}/units/v1.1.1.0.md.txt`,
  check: `cmp ${HERE}/units/v1.1.1.0.md.txt ${CL}`,
  expect: 'exit 0',
});

// README.md, in file order.
edit(RD, R(11), 'version: 1.1.1.0', `sed -n 11p ${RD}`, 'version: 1.1.1.0');
{
  const nw = '| **Spec folders** | routes to the spec-folder authoring checklist that `system-spec-kit` owns |\n| **MCP servers** | routes to the MCP-server-authoring checklist |';
  edit(RD, R(50), nw, fixedCheck(RD, '| **Spec folders** | routes to the spec-folder authoring checklist that `system-spec-kit` owns |'), '1');
}
{
  const old = [R(63), R(64), R(65)].join('\n');
  const nw = ['```bash', '.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh <modified-file>', '```'].join('\n');
  edit(RD, old, nw, `grep -c '^bash \\.skilled' ${RD}`, '0');
}
{
  const nw = 'OpenCode authoring targets route to specific checklists: skills, agents, commands, MCP servers, language files and config each have their own checklist under `sk-code-opencode`. Spec folders route to the spec-folder authoring checklist that `system-spec-kit` owns. Webflow frontend work uses the code quality checklist and the shared universal standards.';
  edit(RD, R(87), nw, fixedCheck(RD, nw), '1');
}
{
  const nw = '| Comment hygiene | `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh <modified-file>` reports zero violations and exits 0. Run it directly, not through `bash`, because it is a Python program |';
  edit(RD, R(115), nw, fixedCheck(RD, nw), '1');
}
{
  const nw = '| Distribution drift | `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh --all` prints a banner when a watched package is stale or cannot be checked and nothing when every one is current. It always exits 0 because it warns and does not gate. Run it directly, not through `bash`, because it is a Python program |';
  edit(RD, R(116), nw, fixedCheck(RD, nw), '1');
}
{
  const nw = '| [`assets/checklists/`](../sk-code-opencode/assets/checklists/) | Target-path OpenCode authoring checklists for skills, agents, commands, MCP servers, language files and config |\n| [`spec-folder-authoring-checklist.md`](../../system-spec-kit/references/workflows/spec-folder-authoring-checklist.md) | Spec-folder authoring checklist, owned by `system-spec-kit` |';
  edit(RD, R(129), nw, fixedCheck(RD, '| [`spec-folder-authoring-checklist.md`](../../system-spec-kit/references/workflows/spec-folder-authoring-checklist.md) | Spec-folder authoring checklist, owned by `system-spec-kit` |'), '1');
}

// README title rename, added after review. The task before it is the orchestrator's Hermes run.
t = 42;
edit(RD, 'title: code-quality', 'title: sk-code-quality', '', '');
edit(RD, '# code-quality', '# sk-code-quality', '', '');

// Prove uniqueness of every OLD text against the current files.
let bad = 0;
const occurrences = (hay, needle) => hay.split(needle).length - 1;
for (const u of units) {
  if (u.kind !== 'edit') continue;
  const n = occurrences(read(u.files[0]), u._old);
  if (n !== 1) { bad++; console.log(`NOT UNIQUE ${u.task} count=${n}`); }
  if (u._old === u._new) { bad++; console.log(`NO CHANGE ${u.task}`); }
  if (/\u2014/.test(u._new)) { bad++; console.log(`EM DASH ${u.task}`); }
}
// Each check prints the edited line at the position it holds right after its own unit
// runs. SKILL.md edits keep line counts, and two README edits each add one line.
const POS = {
  T012: 5, T013: 15, T014: 36, T015: 39, T016: 47, T017: 50, T018: 94, T019: 112,
  T020: 132, T021: 133, T022: 136, T023: 142, T024: 142, T025: 145, T026: 182, T027: 188,
  T028: 202, T029: 248, T030: 280, T031: 281, T032: 322,
  T034: 11, T035: 50, T036: 65, T037: 88, T038: 116, T039: 117, T040: 131, T042: 2, T043: 14,
};
for (const u of units) {
  if (u.kind !== 'edit') continue;
  const lines = u._new.split('\n');
  const pick = u.task === 'T036' ? lines[1] : u.task === 'T040' ? lines[1] : lines[0];
  u.check = `sed -n ${POS[u.task]}p ${u.files[0]}`;
  u.expect = pick;
  u._pos = POS[u.task];
}
const out = units.map(({ _old, _new, ...rest }) => rest);
if (process.argv.includes('--write')) {
  fs.writeFileSync(path.join(__dirname, 'dispatch-units.json'), JSON.stringify(out, null, 2) + '\n');
}
if (process.argv.includes('--dump')) {
  for (const u of units) if (u.kind === 'edit') console.log(`${u.task}\nOLD: ${u._old}\nNEW: ${u._new}\n`);
}
console.log(`units=${units.length} edits=${units.filter((u) => u.kind === 'edit').length} not_unique_or_bad=${bad}`);
process.exit(bad ? 1 : 0);
