'use strict';

// Remove dead listings from the (clean, hand-maintained) feature_catalog.md + 2 standalone
// READMEs. Each feature_catalog dead ref is the sole content of a "#### Source Files" block —
// remove the whole header+blank+See-line block. Line 40's dead ref is inline among other
// links — remove just that link + its separator. READMEs: remove the dead list-item line.
// Dry-run by default (prints exactly what is removed); --apply to write.
const fs = require('fs');
const APPLY = process.argv.includes('--apply');
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const FC = '.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md';
// 8 dead "Source Files" pointers (snippet removed/migrated/deprecated-and-hard-deleted)
const SOURCE_FILES_REFS = [
  '04--maintenance/035-embedding-status-reconciliation.md',
  '10--graph-signal-activation/_deprecated/09-anchor-tags-as-graph-nodes.md',
  '11--scoring-and-calibration/_deprecated/02-cold-start-novelty-boost.md',
  '12--query-intelligence/_deprecated/02-relative-score-fusion-in-shadow-mode.md',
  '13--memory-quality-and-indexing/_deprecated/22-implicit-feedback-log.md',
  '13--memory-quality-and-indexing/_deprecated/20-weekly-batch-feedback-learning.md',
  '14--pipeline-architecture/_deprecated/09-activation-window-persistence.md',
  '14--pipeline-architecture/_deprecated/15-warm-server-daemon-mode.md',
];
// line 40 inline dead link (kept siblings: session-start-priming, hook_system)
const INLINE_DEAD = '[`18--ux-hooks/21-shared-provenance-and-copilot-compact-cache-parity.md`](18--ux-hooks/21-shared-provenance-and-copilot-compact-cache-parity.md), ';

let removed = 0;
function edit(file, transform) {
  if (!fs.existsSync(file)) { console.log('  ! missing', file); return; }
  let c = fs.readFileSync(file, 'utf8');
  const { out, log } = transform(c);
  log.forEach((l) => console.log(l));
  removed += log.length;
  if (APPLY && out !== c) fs.writeFileSync(file, out);
}

edit(FC, (c) => {
  const log = [];
  for (const ref of SOURCE_FILES_REFS) {
    const re = new RegExp('#### Source Files\\n\\nSee \\[`' + esc(ref) + '`\\]\\(' + esc(ref) + '\\)[^\\n]*\\n');
    const m = c.match(re);
    if (m) { c = c.replace(re, ''); log.push('  FC block removed: ' + ref); }
    else log.push('  !! FC block NOT matched: ' + ref);
  }
  if (c.includes(INLINE_DEAD)) { c = c.replace(INLINE_DEAD, ''); log.push('  FC inline link removed: 21-shared-provenance (line ~40)'); }
  else log.push('  !! FC inline NOT matched: 21-shared-provenance');
  return { out: c, log };
});

// 2 standalone README dead list items
const README_LINES = [
  { f: '.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/README.md', line: '- [`../README.md`](../README.md)\n' },
  { f: '.opencode/skills/deep-loop-runtime/tests/fixtures/council-value/README.md', line: '- [Parent: Fixtures](../README.md)\n' },
];
for (const { f, line } of README_LINES) {
  edit(f, (c) => c.includes(line)
    ? { out: c.replace(line, ''), log: ['  README line removed: ' + f.replace('.opencode/skills/', '') + ' -> ' + line.trim()] }
    : { out: c, log: ['  !! README line NOT matched: ' + f] });
}

console.log(`\n=== DELETE-CATALOG (${APPLY ? 'APPLIED' : 'DRY-RUN'}) === ${removed} removals`);
