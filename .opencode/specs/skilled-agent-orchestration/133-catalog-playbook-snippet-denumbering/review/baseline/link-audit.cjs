// Deterministic path-reference resolver for the active skills/commands/agents surface.
// Extracts markdown links + backtick-wrapped file paths from every active .md file,
// resolves each relative reference, and reports the ones that do not exist on disk.
// Frozen/historical trees (z_archive, z_future, node_modules, .worktrees, _archive,
// research output dumps) are excluded — broken links there are expected and out of scope.
// Output: machine JSON (baseline-findings.json) + a human summary on stdout.
const fs = require('fs');
const path = require('path');

const ROOTS = [
  '.opencode/skills',
  '.opencode/commands',
  '.opencode/agents',
  '.claude/agents',
  '.claude/commands',
  '.codex/agents',
  '.codex/commands',
];

const EXCLUDE_SEGMENTS = [
  'node_modules', 'z_archive', 'z_future', '.worktrees', '_archive',
  'review_archive', '/research/', '/deltas/', '/prompts/', '/iterations/',
];

function excluded(p) {
  return EXCLUDE_SEGMENTS.some((seg) => p.includes(seg));
}

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

// Classify a source file into a review area (one of the 10 audit slices).
function classify(file) {
  const m = file.match(/^\.opencode\/skills\/([^/]+)\/(.*)$/);
  if (m) {
    const skill = m[1];
    const rest = m[2];
    if (rest.startsWith('feature_catalog/') || rest.startsWith('manual_testing_playbook/')) {
      return 'catalog-playbook';
    }
    if (/^cli-/.test(skill)) return 'skill:cli';
    if (/^sk-/.test(skill)) return 'skill:sk';
    if (/^deep-/.test(skill)) return 'skill:deep';
    if (/^system-/.test(skill)) return 'skill:system';
    if (/^mcp-/.test(skill)) return 'skill:mcp';
    return 'skill:other';
  }
  if (file.startsWith('.opencode/commands/') || file.includes('/commands/')) return 'commands';
  if (file.includes('/agents/')) return 'agents';
  return 'other';
}

// Pull candidate references out of one markdown file.
function extractRefs(content) {
  const refs = [];
  content = content.replace(/```[\s\S]*?```/g, '\n'); // drop fenced code blocks (JS like ](target) is not a link)
  // 1. Inline markdown links: ](target)  and reference defs: [id]: target
  const linkRe = /\]\(\s*([^)\s]+?)\s*(?:\s+"[^"]*")?\)/g;
  let mm;
  while ((mm = linkRe.exec(content)) !== null) refs.push({ kind: 'mdlink', raw: mm[1] });
  const refDefRe = /^\s*\[[^\]]+\]:\s+(\S+)\s*$/gm;
  while ((mm = refDefRe.exec(content)) !== null) refs.push({ kind: 'refdef', raw: mm[1] });
  // 2. Backtick-wrapped paths that look like real files (have a dir separator + known ext)
  const tickRe = /`([^`\n]+?\.(?:md|cjs|js|ts|mjs|json|jsonl|py|sh|yaml|yml|toml|tmpl))`/g;
  while ((mm = tickRe.exec(content)) !== null) {
    const r = mm[1].trim();
    if (r.includes('/') && !/[{}*<>|]/.test(r)) refs.push({ kind: 'tickpath', raw: r });
  }
  return refs;
}

// Decide whether a raw reference is a checkable on-disk path.
function checkable(raw) {
  if (!raw) return false;
  if (/^[a-z]+:/i.test(raw)) return false;            // http:, https:, mailto:, etc.
  if (raw.startsWith('#')) return false;               // pure anchor
  if (raw.includes('<') || raw.includes('>') || raw.includes('{') || raw.includes('}')) return false; // autolink / placeholder / template var
  if (raw.includes('*') || raw.includes('$')) return false; // glob / shell var
  return true;
}

// Return all candidate on-disk paths for a reference. A ref is considered valid
// if ANY candidate exists. Docs in this repo mix two conventions:
//   - file-relative  (../foo.md, references/bar.md)
//   - repo-root-relative without a leading slash (.opencode/skills/foo/bar.md)
// so both bases are tried.
function resolveCandidates(file, raw) {
  let t = raw.split('#')[0].split('?')[0].trim();
  if (!t) return null;                                  // was a pure anchor on this file
  try { t = decodeURIComponent(t); } catch { /* leave as-is on malformed % */ }
  t = t.replace(/\/+$/, '');                            // trailing slash → dir
  if (!t) return null;
  const fromDir = path.dirname(file);
  if (t.startsWith('/')) return [path.join('.', t)];    // explicit repo-root-relative
  return [path.join(fromDir, t), path.join('.', t)];    // file-relative OR repo-root-relative
}

const allFiles = [];
for (const root of ROOTS) {
  if (fs.existsSync(root)) walk(root, allFiles);
}

const broken = [];          // high-confidence: real markdown links + ref defs
const lowConf = [];         // low-confidence: backtick prose paths (noisy — examples, partials)
let totalRefs = 0, checkedRefs = 0;
for (const file of allFiles) {
  let content;
  try { content = fs.readFileSync(file, 'utf8'); } catch { continue; }
  const refs = extractRefs(content);
  for (const { kind, raw } of refs) {
    totalRefs++;
    if (!checkable(raw)) continue;
    const candidates = resolveCandidates(file, raw);
    if (!candidates) continue;
    checkedRefs++;
    if (!candidates.some((c) => fs.existsSync(c))) {
      // de-numbered-target probe: does stripping a leading NNN- on the basename fix it?
      const target = candidates[0];
      const b = path.basename(target);
      const den = b.replace(/^[0-9]{2,3}-/, '');
      const denFixable = den !== b && candidates.some((c) =>
        fs.existsSync(path.join(path.dirname(c), den)));
      const rec = {
        area: classify(file),
        file,
        kind,
        ref: raw,
        resolved: candidates.join(' | '),
        denumber_fixable: denFixable,
      };
      if (kind === 'tickpath') lowConf.push(rec);
      else broken.push(rec);
    }
  }
}

// Group + summarize
const byArea = {};
for (const b of broken) {
  byArea[b.area] = byArea[b.area] || { total: 0, denumber_fixable: 0 };
  byArea[b.area].total++;
  if (b.denumber_fixable) byArea[b.area].denumber_fixable++;
}

const out = {
  generated_by: 'link-audit.cjs',
  roots: ROOTS,
  files_scanned: allFiles.length,
  refs_seen: totalRefs,
  refs_checked: checkedRefs,
  broken_total: broken.length,
  broken_denumber_fixable: broken.filter((b) => b.denumber_fixable).length,
  low_confidence_tickpath_total: lowConf.length,
  by_area: byArea,
  broken,
  low_confidence_tickpath: lowConf,
};
const outPath = path.join(__dirname, 'baseline-findings.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));

console.log('=== DETERMINISTIC PATH-REFERENCE BASELINE (markdown links) ===');
console.log('files scanned :', allFiles.length);
console.log('refs seen     :', totalRefs, '| checkable resolved:', checkedRefs);
console.log('BROKEN mdlinks:', broken.length, '| de-number-fixable:', out.broken_denumber_fixable);
console.log('low-conf tickpath (separate, noisy):', lowConf.length);
console.log('--- broken mdlinks by area ---');
for (const [area, s] of Object.entries(byArea).sort((a, b) => b[1].total - a[1].total)) {
  console.log(`  ${area.padEnd(20)} ${String(s.total).padStart(4)}  (denumber-fixable: ${s.denumber_fixable})`);
}
console.log('full report ->', outPath);
