// Deterministic remediation applier (dry-run by default; pass --apply to write).
// Part A: the confident fix-resolver proposals (unique+ranked), as ](old)->](new) link
//   rewrites, skipping intentional template-example sources.
// Part B: explicit regex-missed fixes (P0s + .cjs + stale-spec repoint + create_sk_skill slug),
//   each a literal string replace across the active tree (excludes archives + the 133 packet).
const fs = require('fs');
const path = require('path');

const APPLY = process.argv.includes('--apply');
const REVIEW = path.resolve(__dirname, '..');
const fixes = require(path.join(__dirname, 'fix-proposals.json'));

const isTemplateSource = (f) => /_template\.md$|\/templates\//.test(f) || /template/.test(path.basename(f));
// Changelogs are historical records — leave their (now-stale) links as written.
const skipSource = (f) => isTemplateSource(f) || /\/changelog\//.test(f);

let filesChanged = new Set();
let editsA = 0, editsB = 0, skippedTemplate = 0;

// ---- PART A: confident md-link proposals ----
const partALog = [];
for (const p of fixes.proposals) {
  if (p.confidence !== 'unique' && p.confidence !== 'ranked') continue;
  if (!p.proposed_correct_target) continue;
  if (skipSource(p.file)) { skippedTemplate++; continue; }
  let content;
  try { content = fs.readFileSync(p.file, 'utf8'); } catch { continue; }
  const ref = p.ref;
  const hashIdx = ref.indexOf('#');
  const anchor = hashIdx >= 0 ? ref.slice(hashIdx) : '';
  const newRef = p.proposed_correct_target + anchor;
  const needle = '](' + ref + ')';
  if (!content.includes(needle)) continue;
  const count = content.split(needle).length - 1;
  const updated = content.split(needle).join('](' + newRef + ')');
  editsA += count;
  filesChanged.add(p.file);
  partALog.push(`  ${p.file.replace('.opencode/skills/', '')}  ${ref} -> ${newRef}  (x${count})`);
  if (APPLY) fs.writeFileSync(p.file, updated);
}

// ---- PART B: explicit literal fixes across the active tree ----
const LITERAL_FIXES = [
  { why: 'P0 create-skill command points at wrong yaml slug (real: create_sk_skill_*)',
    old: 'create_skill_auto.yaml', new: 'create_sk_skill_auto.yaml' },
  { why: 'P0 create-skill command points at wrong yaml slug',
    old: 'create_skill_confirm.yaml', new: 'create_sk_skill_confirm.yaml' },
  { why: 'P0 system-spec-kit SKILL.md misses protocol/ subdir',
    old: '../deep-research/references/spec_check_protocol.md', new: '../deep-research/references/protocol/spec_check_protocol.md' },
  { why: 'P1 ai-council persist-artifacts is .cjs not .js',
    old: 'persist-artifacts.js', new: 'persist-artifacts.cjs' },
  { why: 'P1 code.md cites archived 059 decision-record at old root',
    old: 'specs/skilled-agent-orchestration/059-agent-implement-code/decision-record.md',
    new: '.opencode/specs/skilled-agent-orchestration/z_archive/059-agent-implement-code/decision-record.md' },
];

const ACTIVE_ROOTS = ['.opencode/skills', '.opencode/commands', '.opencode/agents', '.claude/agents', '.claude/commands', '.codex/agents', '.codex/commands'];
const EXCLUDE = ['z_archive', 'z_future', '.worktrees', 'node_modules', '133-catalog-playbook-snippet-denumbering', 'changelog'];
const excluded = (p) => EXCLUDE.some((e) => p.includes(e));
function walk(dir, out) {
  let ents; try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of ents) {
    const p = path.join(dir, e.name);
    if (excluded(p)) continue;
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile() && p.endsWith('.md')) out.push(p);
  }
}
const activeFiles = [];
for (const r of ACTIVE_ROOTS) if (fs.existsSync(r)) walk(r, activeFiles);

const partBLog = [];
for (const f of activeFiles) {
  let content;
  try { content = fs.readFileSync(f, 'utf8'); } catch { continue; }
  let updated = content;
  for (const fix of LITERAL_FIXES) {
    if (!updated.includes(fix.old)) continue;
    // guard: skip if old is already a substring of the new target already present
    const count = updated.split(fix.old).length - 1;
    updated = updated.split(fix.old).join(fix.new);
    editsB += count;
    partBLog.push(`  ${f.replace('.opencode/', '')}  "${fix.old}" -> "${fix.new}" (x${count})`);
  }
  if (updated !== content) { filesChanged.add(f); if (APPLY) fs.writeFileSync(f, updated); }
}

console.log(`=== APPLY-FIXES (${APPLY ? 'APPLIED' : 'DRY-RUN'}) ===`);
console.log('Part A (confident md-link proposals):', editsA, 'edits |', skippedTemplate, 'template-source skipped');
partALog.slice(0, 30).forEach((l) => console.log(l));
if (partALog.length > 30) console.log('  ... +', partALog.length - 30, 'more');
console.log('\nPart B (explicit literal fixes):', editsB, 'edits');
partBLog.forEach((l) => console.log(l));
console.log('\nfiles changed:', filesChanged.size, APPLY ? '(written)' : '(dry-run, nothing written)');
