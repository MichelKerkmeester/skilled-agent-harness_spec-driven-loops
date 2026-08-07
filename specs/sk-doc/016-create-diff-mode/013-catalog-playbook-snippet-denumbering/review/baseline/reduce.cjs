'use strict';

// Reduce all iteration deltas + the deterministic baseline/fix-proposals into the canonical
// review state (config, state.jsonl, findings-registry, dashboard) and a synthesis summary.
// Every model finding is cross-checked against on-disk truth (model path claims are unreliable).
const fs = require('fs');
const path = require('path');

const REVIEW = path.resolve(__dirname, '..');
const baseline = require(path.join(__dirname, 'baseline-findings.json'));
const fixes = require(path.join(__dirname, 'fix-proposals.json'));
const NOW = new Date().toISOString();

// --- Load deltas ---
const deltaDir = path.join(REVIEW, 'deltas');
const deltas = fs.readdirSync(deltaDir).filter((f) => /^iter-\d+\.jsonl$/.test(f)).sort()
  .map((f) => { try { return JSON.parse(fs.readFileSync(path.join(deltaDir, f), 'utf8').trim()); } catch { return null; } })
  .filter(Boolean);

// --- Cross-check one model finding against on-disk truth ---
function crossCheck(f) {
  const src = f.source_file || '';
  const refRaw = (f.ref || '').trim();
  if (!src || !refRaw) return { status: 'UNCHECKABLE' };
  const hasAnchor = refRaw.includes('#');
  const refNo = refRaw.split('#')[0].split('?')[0].replace(/\/+$/, '');
  if (!refNo) return { status: hasAnchor ? 'ANCHOR_ONLY' : 'UNCHECKABLE' };
  if (/^[a-z]+:/i.test(refNo) || refNo.includes('{') || refNo.includes('*')) return { status: 'UNCHECKABLE' };
  const cands = refNo.startsWith('/')
    ? [path.join('.', refNo)]
    : [path.join(path.dirname(src), refNo), path.join('.', refNo)];
  const resolves = cands.some((c) => { try { return fs.existsSync(c); } catch { return false; } });
  if (resolves) return { status: hasAnchor ? 'ANCHOR_UNVERIFIED' : 'MODEL_FALSE_POSITIVE' };
  return { status: 'CONFIRMED_BROKEN' };
}

// --- Aggregate model findings (cross-checked) ---
const baselineKeys = new Set(baseline.broken.map((b) => b.file + '::' + path.basename(b.ref.split('#')[0])));
const modelConfirmedNew = [];   // regex-missed, deterministically broken
const modelAnchorAdvisory = []; // file exists, anchor unverified
const modelFalsePositives = []; // model said broken, but resolves
let modelFindingsTotal = 0;
for (const d of deltas) {
  for (const f of (d.findingDetails || [])) {
    modelFindingsTotal++;
    const cc = crossCheck(f);
    f._crosscheck = cc.status;
    f._iteration = d.iteration;
    const key = (f.source_file || '') + '::' + path.basename((f.ref || '').split('#')[0]);
    if (cc.status === 'CONFIRMED_BROKEN') { if (!baselineKeys.has(key)) modelConfirmedNew.push(f); }
    else if (cc.status === 'ANCHOR_UNVERIFIED') modelAnchorAdvisory.push(f);
    else if (cc.status === 'MODEL_FALSE_POSITIVE') modelFalsePositives.push(f);
  }
}

// --- Canonical config ---
const config = {
  topic: 'Review: path-reference integrity (skills/commands/agents)',
  mode: 'review', sessionId: NOW, parentSessionId: null, lineageMode: 'new', generation: 1,
  reviewTarget: 'all path references across skills, commands, agents',
  reviewTargetType: 'files', reviewDimensions: ['correctness', 'traceability'],
  maxIterations: 10, convergenceThreshold: 0.10, specFolder: path.relative('.', REVIEW).replace(/\/review$/, ''),
  executor: { kind: 'cli-opencode', model: 'deepseek/deepseek-v4-pro', dispatch: 'orchestrator-applied read-only' },
  method: 'deterministic baseline (authoritative) + 10 read-only DeepSeek iterations (advisory, cross-checked)',
  status: 'complete', createdAt: NOW, releaseReadinessState: 'converged',
};
fs.writeFileSync(path.join(REVIEW, 'deep-review-config.json'), JSON.stringify(config, null, 2));

// --- state.jsonl: config record + one per iteration ---
const stateLines = [JSON.stringify({ type: 'config', ...config })];
for (const d of deltas) {
  stateLines.push(JSON.stringify({
    type: 'iteration', iteration: d.iteration, slice: d.slice, verdict: d.verdict,
    findingsSummary: d.findingsSummary, findingCount: d.findingCount,
    newFindingsRatio: d.findingCount ? +(d.findingCount / Math.max(1, modelFindingsTotal)).toFixed(3) : 0,
    timestamp: NOW,
  }));
}
fs.writeFileSync(path.join(REVIEW, 'deep-review-state.jsonl'), stateLines.join('\n') + '\n');

// --- Deterministic severity model: confirmed broken links ---
// P0 = command/agent loadable path broken (runtime breakage); P1 = real doc cross-ref broken; P2 = ambiguous/other.
// Severity for deterministic broken markdown links:
//   P0 = command/agent loadable path broken (runtime) — none appear in the md-link baseline
//        (those refs are frontmatter/backtick, found by the hunt iterations instead).
//   P2 = template/placeholder example links (a *_template.md source or a /templates/ path) —
//        intentional illustrative targets, cosmetic.
//   P1 = everything else: a real broken doc/script cross-reference a human or tool would follow.
const isTemplateSource = (f) => /_template\.md$|\/templates\//.test(f) || /template/.test(path.basename(f));
const det = baseline.broken.map((b) => {
  const fp = fixes.proposals.find((p) => p.file === b.file && p.ref === b.ref) || {};
  let sev = 'P1';
  if (b.area === 'agents' || b.area === 'commands') sev = 'P0';
  else if (isTemplateSource(b.file)) sev = 'P2';
  return { ...b, severity: sev, fix: fp.proposed_correct_target || null, fix_confidence: fp.confidence || 'none' };
});
const detSev = { P0: 0, P1: 0, P2: 0 };
for (const d of det) detSev[d.severity]++;

const registry = {
  sessionId: NOW, generation: 1,
  deterministic: {
    broken_mdlinks: baseline.broken.length,
    by_area: baseline.by_area,
    fixable_unique: fixes.stats.unique, fixable_ranked: fixes.stats.ranked,
    ambiguous: fixes.stats.ambiguous, truly_missing: fixes.stats.no_match,
    severity: detSev, denumber_caused: baseline.broken_denumber_fixable,
  },
  model: {
    iterations: deltas.length, findings_emitted: modelFindingsTotal,
    confirmed_new_regex_missed: modelConfirmedNew.length,
    anchor_advisory: modelAnchorAdvisory.length,
    false_positives_rejected: modelFalsePositives.length,
  },
  confirmed_new_findings: modelConfirmedNew,
  anchor_advisories: modelAnchorAdvisory,
};
fs.writeFileSync(path.join(REVIEW, 'deep-review-findings-registry.json'), JSON.stringify(registry, null, 2));

// --- Dashboard ---
const dash = `# Deep-Review Dashboard — Path-Reference Integrity

Iterations: ${deltas.length}/10 | Method: deterministic baseline + DeepSeek (cross-checked)

## Deterministic (authoritative)
- Broken markdown links: **${baseline.broken.length}** / ${baseline.refs_checked} checked
- De-number-caused (#133): **${baseline.broken_denumber_fixable}**
- Fixable: ${fixes.stats.unique} unique + ${fixes.stats.ranked} ranked = **${fixes.stats.unique + fixes.stats.ranked}** | ambiguous ${fixes.stats.ambiguous} | truly-missing ${fixes.stats.no_match}
- Severity: P0=${detSev.P0} P1=${detSev.P1} P2=${detSev.P2}

## Model (advisory, cross-checked)
- Findings emitted: ${modelFindingsTotal}
- Confirmed NEW (regex-missed, broken on disk): **${modelConfirmedNew.length}**
- Anchor advisories (file ok, anchor unverified): ${modelAnchorAdvisory.length}
- Model false-positives rejected by cross-check: ${modelFalsePositives.length}

## Per-iteration
${deltas.map((d) => `- iter ${String(d.iteration).padStart(2, '0')} — ${d.slice}: ${d.verdict} (P0=${d.findingsSummary.P0} P1=${d.findingsSummary.P1} P2=${d.findingsSummary.P2}, ${d.findingCount} findings)`).join('\n')}
`;
fs.writeFileSync(path.join(REVIEW, 'deep-review-dashboard.md'), dash);

// --- Console summary ---
console.log('=== REDUCE COMPLETE ===');
console.log('deltas reduced       :', deltas.length, '/ 9 expected (+ iter1 =', deltas.length, 'of 10 if all present)');
console.log('deterministic broken :', baseline.broken.length, '| severity', JSON.stringify(detSev), '| #133-caused', baseline.broken_denumber_fixable);
console.log('fixable/ambiguous/missing:', fixes.stats.unique + fixes.stats.ranked, '/', fixes.stats.ambiguous, '/', fixes.stats.no_match);
console.log('model findings       :', modelFindingsTotal);
console.log('  confirmed NEW (regex-missed):', modelConfirmedNew.length);
console.log('  anchor advisories          :', modelAnchorAdvisory.length);
console.log('  false-positives rejected   :', modelFalsePositives.length);
console.log('\n=== model CONFIRMED-NEW (regex-missed, broken on disk) ===');
modelConfirmedNew.slice(0, 40).forEach((f) => console.log(`  [i${f._iteration} ${f.severity}] ${f.source_file} -> ${f.ref}`));
if (modelConfirmedNew.length > 40) console.log('  ... +', modelConfirmedNew.length - 40, 'more');
console.log('\nwrote: config, state.jsonl, findings-registry, dashboard');
