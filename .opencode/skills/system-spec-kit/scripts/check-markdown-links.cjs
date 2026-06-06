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
  '.claude/agents', '.claude/commands', '.codex/agents', '.codex/commands',
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
  '.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md::./SOURCE.md',
  '.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md::./results.csv',
  '.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md::./per-probe.jsonl',
  '.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md::./runtime-measurements.md',
  '.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md::../README.md',
  // skill_md_template — fill-in names the author replaces per skill
  '.opencode/skills/sk-doc/assets/skill/skill_md_template.md::./references/workflow-details.md',
  '.opencode/skills/sk-doc/assets/skill/skill_md_template.md::./references/reference-name.md',
  '.opencode/skills/sk-doc/assets/skill/skill_md_template.md::./references/workflow-name.md',
  '.opencode/skills/sk-doc/assets/skill/skill_md_template.md::./assets/template-name.md',
  '.opencode/skills/sk-doc/assets/skill/skill_md_template.md::./assets/checklist-name.md',
  '.opencode/skills/sk-doc/assets/skill/skill_md_template.md::INSTALL_GUIDE.md',
  // skill_reference_template — use-site example paths
  '.opencode/skills/sk-doc/assets/skill/skill_reference_template.md::./scripts/workflow_router.py',
  '.opencode/skills/sk-doc/assets/skill/skill_reference_template.md::../scripts/',
  '.opencode/skills/sk-doc/assets/skill/skill_reference_template.md::../assets/',
  // illustrative client-domain example path
  '.opencode/skills/sk-code/references/webflow/performance/webflow_constraints.md::/specs/005-example.com/024-performance-optimization/decision-record.md',
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

function extractRefs(content) {
  const refs = [];
  content = content.replace(/```[\s\S]*?```/g, '\n'); // fenced code is not links
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
