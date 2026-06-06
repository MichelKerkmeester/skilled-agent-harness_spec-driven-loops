// Wave 4: resolve ambiguous refs that actually point at a file inside the SOURCE's own skill
// (typically a wrong-../-depth link to that skill's SKILL.md / README.md / a references doc).
// Among the basename candidates, if exactly one lives under the source file's own skill, that
// is unambiguously the intended target. Dry-run by default; --apply to write.
const fs = require('fs');
const path = require('path');

const APPLY = process.argv.includes('--apply');
const fixes = require(path.join(__dirname, 'fix-proposals.json'));

// Build basename -> [paths] within .opencode/skills
const index = new Map();
function walk(dir) {
  let ents; try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of ents) {
    const p = path.join(dir, e.name);
    if (/node_modules|z_archive|z_future|\.worktrees/.test(p)) continue;
    if (e.isDirectory()) walk(p);
    else if (e.isFile()) { const a = index.get(e.name) || []; a.push(p); index.set(e.name, a); }
  }
}
walk('.opencode/skills');

let edits = 0; const log = []; const changed = new Set(); let leftAmbiguous = 0;
for (const p of fixes.proposals) {
  if (p.confidence !== 'ambiguous') continue;
  const sm = p.file.match(/^(\.opencode\/skills\/[^/]+)\//);
  if (!sm) { leftAmbiguous++; continue; }
  const skillRoot = sm[1];
  const base = path.basename(p.ref.split('#')[0].split('?')[0].replace(/\/+$/, ''));
  const inSkill = (index.get(base) || []).filter((c) => c.startsWith(skillRoot + '/'));
  if (inSkill.length !== 1) { leftAmbiguous++; continue; } // 0 or >1 → genuinely ambiguous, leave
  const target = inSkill[0];
  const anchor = p.ref.includes('#') ? p.ref.slice(p.ref.indexOf('#')) : '';
  const newRef = path.relative(path.dirname(p.file), target) + anchor;
  let content; try { content = fs.readFileSync(p.file, 'utf8'); } catch { continue; }
  const needle = '](' + p.ref + ')';
  if (!content.includes(needle)) continue;
  const count = content.split(needle).length - 1;
  content = content.split(needle).join('](' + newRef + ')');
  edits += count; changed.add(p.file);
  log.push(`  ${p.file.replace('.opencode/skills/', '')}  ${p.ref} -> ${newRef} (x${count})`);
  if (APPLY) fs.writeFileSync(p.file, content);
}
console.log(`=== APPLY-SAMESKILL (${APPLY ? 'APPLIED' : 'DRY-RUN'}) ===`);
console.log('edits:', edits, '| files:', changed.size, '| left genuinely ambiguous:', leftAmbiguous);
log.slice(0, 30).forEach((l) => console.log(l));
if (log.length > 30) console.log('  ... +', log.length - 30, 'more');
