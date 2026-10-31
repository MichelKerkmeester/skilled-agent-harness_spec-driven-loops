// Project how many residual packets new deterministic fixers would clear.
const fs = require('node:fs');
const rows = fs.readFileSync(process.argv[2], 'utf8').trim().split('\n').map(JSON.parse).filter((r) => !r.archived && !r.unreadable);
const MECH = [
  [/ANCHORS_VALID/, /no anchors found/],
  [/FRONTMATTER_MEMORY_BLOCK/, /fingerprint .* is not sha/],
  [/GREP_CONVENTION/, /category=missing .*no frontmatter block/],
  [/SCAFFOLD_NEVER_TOUCHED/, /scaffold placeholder|packet_pointer starts with "scaffold\/"|title contains \[template:/],
  [/TEMPLATE_SOURCE/, /./],
  [/GENERATED_METADATA_INTEGRITY/, /SPEC_FOLDER_PREFIXED|FILE_MISSING|SOURCE_FINGERPRINT_MISSING|STATUS_NOT_IN_ENUM/],
  [/GENERATED_METADATA_DRIFT/, /./],
  [/METADATA_DISK_PATH_CONSISTENCY/, /./],
  [/CANONICAL_SAVE_LINEAGE_REQUIRED/, /./],
  [/GREP_CONVENTION/, /category=duplicate/],
];
const isMech = (rule, d) => MECH.some(([r, p]) => r.test(rule) && p.test(d));
let pass = 0, mechOnly = 0, authored = 0;
const authoredRules = {};
for (const r of rows) {
  if (r.errors === 0) { pass++; continue; }
  // details are truncated to 3 per rule; a rule with no detail counts as authored
  let allMech = true;
  for (const [rule, ds] of r.details) {
    const ok = ds.length > 0 && ds.every((d) => isMech(rule, d));
    if (!ok) { allMech = false; authoredRules[rule] = (authoredRules[rule] || 0) + 1; }
  }
  if (allMech) mechOnly++; else authored++;
}
console.log(`${process.argv[3]}: active=${rows.length} pass=${pass} +mechanical-only=${mechOnly} => projected=${pass + mechOnly} (${Math.round(100 * (pass + mechOnly) / rows.length)}%) ; still-authored=${authored}`);
console.log('  packets held back by rule:', JSON.stringify(Object.entries(authoredRules).sort((a, b) => b[1] - a[1])));
