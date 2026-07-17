#!/usr/bin/env node
'use strict';

// ─────────────────────────────────────────────────────────────────
// check-markdown-links.cjs — markdown-link integrity guard
// ─────────────────────────────────────────────────────────────────
// Complements check-links.sh (which validates wikilinks `[[...]]`): this walks the
// active skills/commands/agents docs and verifies every relative markdown link `](path)`
// (and `[id]: path` ref-def) resolves on disk. It exists because feature removal/migration
// edits have deleted snippet files or moved targets without updating the hand-maintained
// catalog/playbook roots that link to them — breakage that nothing else catches. Whole-repo
// (not changed-files) on purpose: a deleted target breaks UNCHANGED referrers.
//
// Conventions: a relative link is valid if it resolves against EITHER the source file's
// directory OR the repo root. Fenced code blocks, anchors, http(s), and template-variable
// refs are not links. A narrow (file,ref) allowlist below covers the intentional template
// fill-in placeholders + one illustrative example so the guard is green today and only fires
// on NEW breakage — it deliberately does NOT skip whole template directories.
//
// Exit: 0 = clean ("0 broken"); 1 = one or more real broken links (listed).
const fs = require('fs');
const path = require('path');

const ROOTS = [
  '.opencode/skills', '.opencode/commands', '.opencode/agents',
  '.claude/agents', '.claude/commands', '.opencode/agents', '.opencode/commands',
];

// Files in these path segments are not link-checked: archives/runtime dumps (broken links
// there are expected), changelogs (links were correct at write-time; history is frozen),
// and test fixtures (some are deliberately broken to exercise validators).
const EXCLUDE_SEGMENTS = [
  'node_modules', 'z_archive', 'z_future', '.worktrees', '_archive', 'review_archive',
  '/research/', '/deltas/', '/prompts/', '/iterations/', '/changelog/', '/tests/fixtures/',
];

// Intentional broken links: template fill-in placeholders the author replaces when copying
// the template, plus one illustrative example path. Keyed by "<sourceFile>::<rawRef>".
// Adding a genuinely-new broken link still fails — these specific pairs are the only waivers.
const ALLOWLIST = new Set([
  // benchmark report template — sibling artifacts the report author creates
  '.opencode/skills/sk-doc/create-benchmark/assets/shared/benchmark_report_template.md::./SOURCE.md',
  '.opencode/skills/sk-doc/create-benchmark/assets/shared/benchmark_report_template.md::./results.csv',
  '.opencode/skills/sk-doc/create-benchmark/assets/shared/benchmark_report_template.md::./per-probe.jsonl',
  '.opencode/skills/sk-doc/create-benchmark/assets/shared/benchmark_report_template.md::./runtime-measurements.md',
  '.opencode/skills/sk-doc/create-benchmark/assets/shared/benchmark_report_template.md::../README.md',
  // skill_md_template — fill-in names the author replaces per skill
  '.opencode/skills/sk-doc/create-skill/assets/skill/skill_md_template.md::./references/workflow-details.md',
  '.opencode/skills/sk-doc/create-skill/assets/skill/skill_md_template.md::./references/reference-name.md',
  '.opencode/skills/sk-doc/create-skill/assets/skill/skill_md_template.md::./references/workflow-name.md',
  '.opencode/skills/sk-doc/create-skill/assets/skill/skill_md_template.md::./assets/template-name.md',
  '.opencode/skills/sk-doc/create-skill/assets/skill/skill_md_template.md::./assets/checklist-name.md',
  '.opencode/skills/sk-doc/create-skill/assets/skill/skill_md_template.md::INSTALL-GUIDE.md',
  // skill_reference_template — use-site example paths
  '.opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md::./scripts/workflow_router.py',
  '.opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md::../scripts/',
  '.opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md::../assets/',
  // illustrative client-domain example path
  '.opencode/skills/sk-code/code-webflow/references/performance/webflow_constraints.md::/specs/005-example.com/024-performance-optimization/decision-record.md',
]);

function excluded(p) { return EXCLUDE_SEGMENTS.some((seg) => p.includes(seg)); }

function walk(dir, out) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (excluded(p)) continue;
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile() && p.endsWith('.md')) out.push(p);
  }
}

// Blank out inline code spans so link/ref syntax DOCUMENTED inside backticks (prose showing
// the bracket-paren link form) is not mistaken for a real link. Mirrors the fenced-block strip:
// per CommonMark, code spans are literal text, not link surface. Guard-safe by construction —
// it strips a span only when an opening backtick run is closed by a run of the SAME length,
// treats a backslash-escaped backtick as literal (never a delimiter), and leaves unmatched runs
// untouched. So the worst case is a documented placeholder staying checkable (a false positive
// the ALLOWLIST handles), never a hidden real link (a false negative — the dangerous direction
// for a guard). Blanks rather than deletes, preserving offsets/newlines so refDefRe's `^\s*`
// cannot promote a stripped line into a phantom reference definition.
function stripInlineCode(content) {
  let out = '';
  for (let i = 0; i < content.length; ) {
    const ch = content[i];
    if (ch === '\\' && i + 1 < content.length) { out += ch + content[i + 1]; i += 2; continue; }
    if (ch !== '`') { out += ch; i++; continue; }
    const open = i;
    while (i < content.length && content[i] === '`') i++;
    const runLen = i - open;
    let close = -1;
    for (let j = i; j < content.length; ) {
      if (content[j] !== '`') { j++; continue; }
      const r = j;
      while (j < content.length && content[j] === '`') j++;
      if (j - r === runLen) { close = r; break; }
    }
    if (close === -1) { out += content.slice(open, i); continue; }     // unmatched run: not a span
    const end = close + runLen;
    out += content.slice(open, end).replace(/[^\n]/g, ' ');            // blank the span, keep newlines
    i = end;
  }
  return out;
}

function extractRefs(content) {
  const refs = [];
  content = content.replace(/```[\s\S]*?```/g, '\n'); // fenced code is not links
  content = stripInlineCode(content);                 // inline code is not links either
  const linkRe = /\]\(\s*([^)\s]+?)\s*(?:\s+"[^"]*")?\)/g;
  let m;
  while ((m = linkRe.exec(content)) !== null) refs.push(m[1]);
  const refDefRe = /^\s*\[[^\]]+\]:\s+(\S+)\s*$/gm;
  while ((m = refDefRe.exec(content)) !== null) refs.push(m[1]);
  return refs;
}

function checkable(raw) {
  if (!raw) return false;
  if (/^[a-z]+:/i.test(raw)) return false;                 // http:, mailto:, etc.
  if (raw.startsWith('#')) return false;                    // pure anchor
  if (/[<>{}*$]/.test(raw)) return false;                  // autolink / placeholder / glob / var
  return true;
}

function resolves(file, raw) {
  let t = raw.split('#')[0].split('?')[0].trim();
  if (!t) return true;                                      // anchor on this file
  try { t = decodeURIComponent(t); } catch { /* malformed % */ }
  t = t.replace(/\/+$/, '');
  if (!t) return true;
  const cands = t.startsWith('/')
    ? [path.join('.', t)]
    : [path.join(path.dirname(file), t), path.join('.', t)];
  return cands.some((c) => { try { return fs.existsSync(c); } catch { return false; } });
}

// `--self-test`: assert inline-code handling on synthetic inputs (no filesystem walk). A guard's
// dangerous failure is a FALSE NEGATIVE (hiding a real broken link), so the same-line and
// escaped-backtick cases below are the ones that MUST stay caught.
function runSelfTest() {
  const T = 'missing.md';
  const targets = (s) => extractRefs(s).filter(checkable);
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const cases = [
    { name: 'inline-code link ignored',                      input: 'Literal `[bad](missing.md)` syntax.',                  expect: [] },
    { name: 'real link on same line as inline code caught',  input: 'Pre `[x](missing.md)` then [bad](missing.md).',         expect: [T] },
    { name: 'ref-style def inside inline code ignored',       input: '`[bad]: missing.md`',                                   expect: [] },
    { name: 'escaped backticks do NOT hide a real link',     input: '\\`[bad](missing.md)\\`',                               expect: [T] },
    { name: 'variable-length delimiter strips whole span',   input: '``Use `[x](missing.md)` with `tick` inside``',          expect: [] },
    { name: 'plain broken link still caught (control)',      input: 'See [bad](missing.md) here.',                           expect: [T] },
  ];
  let failed = 0;
  for (const c of cases) {
    const got = targets(c.input);
    const ok = eq(got, c.expect);
    if (!ok) failed++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${c.name}  → [${got.join(', ')}] (expect [${c.expect.join(', ')}])`);
  }
  console.log(failed ? `\nself-test: ${failed} case(s) FAILED` : '\nself-test: all cases passed');
  process.exit(failed ? 1 : 0);
}

if (process.argv.includes('--self-test')) runSelfTest();

const files = [];
for (const root of ROOTS) if (fs.existsSync(root)) walk(root, files);

const broken = [];
let checked = 0;
for (const file of files) {
  let content;
  try { content = fs.readFileSync(file, 'utf8'); } catch { continue; }
  for (const raw of extractRefs(content)) {
    if (!checkable(raw)) continue;
    checked++;
    if (resolves(file, raw)) continue;
    if (ALLOWLIST.has(file + '::' + raw)) continue;        // intentional placeholder/example
    broken.push({ file, raw });
  }
}

console.log(`check-markdown-links: ${files.length} files, ${checked} links checked, ${broken.length} broken`);
if (broken.length) {
  console.error('\nBroken markdown links (target resolves under neither the file dir nor repo root):');
  for (const b of broken) console.error(`  ${b.file}  ](${b.raw})`);
  console.error('\nFix the link, or — if it is an intentional placeholder/example — add it to the ALLOWLIST in this script.');
  process.exit(1);
}
console.log('OK — 0 broken markdown links.');
process.exit(0);
