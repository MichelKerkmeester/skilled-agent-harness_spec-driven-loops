#!/usr/bin/env node
/**
 * Generate the mode-and-lane migration subtree worklist entries and merge them
 * into author-worklist.json. It fans out into eight mode migrations, each a
 * phase parent over seven identical concern children — so the entries are generated
 * from an 8x7 matrix rather than hand-written, keeping briefs consistent while
 * still carrying mode-specific and concern-specific context.
 *
 * Idempotent: strips any pre-existing 010-* items before re-appending.
 * Waves: 7 = all 56 leaves, 8 = the 8 mode parents, 9 = the top 010 parent
 * (leaves must exist before a parent validates AS a phase parent).
 */
const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const WORKLIST = path.join(HERE, 'author-worklist.json');
const BASE_REL = '.opencode/specs/system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation';
const TOP_REL = `${BASE_REL}/010-mode-and-lane-migrations`;
const LEAF_MOLD = `${BASE_REL}/scratch/templates/leaf-mold`;
const PARENT_MOLD = `${BASE_REL}/scratch/templates/parent-mold`;
const REG = '.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/research';
const RESEARCH_REFS = [`${REG}/findings-registry.json`, `${REG}/findings-registry-modes.json`, `${BASE_REL}/spec.md`];

// Each mode's run behaviour and its cross-mode coupling. The coupling text is
// injected verbatim so each authored child respects the real dependency graph:
// deep-improvement-common owns services the three benchmark variants reuse, and
// deep-alignment shares the review loop with deep-review.
const MODES = [
  { n: '001', slug: 'deep-research', title: 'Deep Research',
    blurb: 'the autonomous deep-research loop (init -> iterate: gather/analyze -> convergence detection -> synthesize -> memory-save handoff)',
    couple: '', deps: [] },
  { n: '002', slug: 'deep-review', title: 'Deep Review',
    blurb: 'the deep-review loop (scope -> per-dimension passes emitting P0/P1/P2 findings -> convergence -> review-report)',
    couple: 'This mode shares its loop backbone with deep-alignment (mode 008): consume the shared review-loop contract frozen in phase 009 rather than forking it.', deps: [] },
  { n: '003', slug: 'deep-ai-council', title: 'Deep AI Council',
    blurb: 'the multi-seat council deliberation (seats deliberate -> critique rounds -> converge -> ai-council artifacts -> council test gate)',
    couple: '', deps: [] },
  { n: '004', slug: 'deep-improvement-common', title: 'Deep Improvement Common Services',
    blurb: 'the shared deep-improvement backbone (evaluator-first loop -> candidate generation -> scoring -> guarded promotion) plus the shared evaluator, canary, and promotion services',
    couple: 'This mode PRECEDES and is consumed by agent-improvement (005), model-benchmark (006), and skill-benchmark (007): it OWNS the shared evaluator/canary/promotion services those three variants reuse, so define them here as the single source.', deps: [] },
  { n: '005', slug: 'agent-improvement', title: 'Agent Improvement',
    blurb: 'the agent-improvement variant (agent-loop proposal generation + scoring) layered on the deep-improvement-common backbone',
    couple: 'BUILD ON the deep-improvement-common services from mode 004 (evaluator/canary/promotion): reuse them, do NOT re-implement them; add only what is agent-improvement-specific.', deps: ['004-deep-improvement-common'] },
  { n: '006', slug: 'model-benchmark', title: 'Model Benchmark',
    blurb: 'the model-benchmark variant (multi-model runs + a scoring matrix) layered on the deep-improvement-common backbone',
    couple: 'BUILD ON the deep-improvement-common services from mode 004: add only model-benchmark-specific run and scoring logic; do NOT re-implement the shared evaluator/canary/promotion.', deps: ['004-deep-improvement-common'] },
  { n: '007', slug: 'skill-benchmark', title: 'Skill Benchmark',
    blurb: 'the skill-benchmark variant (skill scenario runs + scoring) layered on the deep-improvement-common backbone',
    couple: 'BUILD ON the deep-improvement-common services from mode 004: add only skill-benchmark-specific scenario and scoring logic; do NOT re-implement the shared services.', deps: ['004-deep-improvement-common'] },
  { n: '008', slug: 'deep-alignment', title: 'Deep Alignment',
    blurb: 'the deep-alignment loop (per-lane conformance checks against a named authority, verify-first findings)',
    couple: 'This mode shares the review-loop backbone with deep-review (mode 002): reuse the shared review-loop contract frozen in phase 009.', deps: ['002-deep-review'] },
];

// The seven concerns every mode migration decomposes into. MODE is substituted
// with the mode title in each guide string.
const CONCERNS = [
  { n: '001', slug: 'typed-ledger-schema', title: 'Typed Ledger Schema',
    guide: "Define the TYPED APPEND-ONLY EVENT SCHEMA MODE emits during its run: the event-envelope specialization, the concrete event types for MODE's run behavior, field-level types, and the versioned-envelope plus upcaster hooks. Consumes the phase-003 transition-authorized ledger core and the phase-009 shared event contracts. Output is MODE's event VOCABULARY only - the reducers belong to the next sibling." },
  { n: '002', slug: 'reducers-and-projections', title: 'Reducers & Projections',
    guide: "Define the DETERMINISTIC REDUCERS that replay MODE's typed event log (the previous sibling's schema) into its live state projections (iteration/convergence state, artifact index, per-mode status). A pure fold with no side effects: an identical event sequence must always yield an identical projection." },
  { n: '003', slug: 'sealed-artifacts', title: 'Sealed Reference Artifacts',
    guide: "Define how MODE SEALS its reference artifacts - the immutable inputs and outputs it must be able to reproduce: content-addressed digests, seal-on-write, and a tamper-evident read path. Consumes the phase-003 sealing primitives; do not invent a second sealing scheme." },
  { n: '004', slug: 'certificates-and-receipts', title: 'Certificates & Receipts',
    guide: "Define MODE's per-run CERTIFICATE and per-transition RECEIPTS: what each attests, the replay-fingerprint inputs, and how an independent verifier re-checks them offline. Consumes the phase-003 receipt and certificate primitives." },
  { n: '005', slug: 'resume-adapter', title: 'Resume Adapter',
    guide: "Define MODE's RESUME ADAPTER: how a mid-run interruption rebuilds live state purely from the sealed ledger via the reducers, the continuity-ladder mapping, and an idempotent re-entry contract (no double-apply, no lost or replayed events)." },
  { n: '006', slug: 'shadow-parity', title: 'Shadow Parity',
    guide: "Define MODE's SHADOW-PARITY harness: run the new ledger path in shadow alongside the legacy emitter, diff the projections event-for-event, and state the parity acceptance criteria that MUST be green before any authority cutover. Consumes the phase-011 shadow framework." },
  { n: '007', slug: 'rollback-and-mode-gate', title: 'Rollback & Mode Gate',
    guide: "Define MODE's ROLLBACK SWITCH and independent MODE GATE: the fail-closed authority-cutover toggle, the bounded rollback window, and the mode-gate checklist that certifies THIS mode migrated (shadow-parity green, artifacts sealed, certificate emitted). This is the mode's exit gate into phase 011." },
];

function concernBrief(mode, c) {
  const guide = c.guide.replace(/MODE/g, mode.title);
  const couple = mode.couple ? ` ${mode.couple}` : '';
  return `MODE MIGRATION - ${mode.title}: plan the ${c.title} for ${mode.blurb}. ${guide}${couple} This is PLANNING only; the 010 migrations are the per-mode fan-out that lands AFTER phase 009 freezes the shared contracts and emits the write-set conflict graph. Keep scope to THIS concern for THIS mode - the six sibling concerns and the mode gate integrate the rest.`;
}
function concernOutcome(mode, c) {
  return `Plan the ${c.title} for the ${mode.title} migration to the typed event-ledger substrate.`;
}

const items = [];

// Wave 7 - the 56 concern leaves.
for (const mode of MODES) {
  const modeDir = `${TOP_REL}/${mode.n}-${mode.slug}`;
  CONCERNS.forEach((c, i) => {
    const pred = i > 0 ? `${CONCERNS[i - 1].n}-${CONCERNS[i - 1].slug}` : '';
    const succ = i < CONCERNS.length - 1 ? `${CONCERNS[i + 1].n}-${CONCERNS[i + 1].slug}` : '';
    items.push({
      id: `010-${mode.n}-${c.n}`,
      wave: 7,
      kind: 'leaf',
      folder: `${modeDir}/${c.n}-${c.slug}`,
      level: 2,
      template: LEAF_MOLD,
      title: `${mode.title} — ${c.title}`,
      status: 'Planned',
      pred_sibling: pred,
      succ_sibling: succ,
      outcome: concernOutcome(mode, c),
      depends_on: [],
      content_brief: concernBrief(mode, c),
      research_refs: RESEARCH_REFS,
    });
  });
}

// Wave 8 - the 8 mode parents. Sibling nav is sorted-linear (001..008); the
// deep-improvement-common dependency is carried separately in depends_on.
MODES.forEach((mode, i) => {
  const modeDir = `${TOP_REL}/${mode.n}-${mode.slug}`;
  const pred = i > 0 ? `${MODES[i - 1].n}-${MODES[i - 1].slug}` : '';
  const succ = i < MODES.length - 1 ? `${MODES[i + 1].n}-${MODES[i + 1].slug}` : '';
  const children = CONCERNS.map((c) => ({
    slug: `${c.n}-${c.slug}`,
    focus: c.guide.replace(/MODE/g, mode.title),
  }));
  items.push({
    id: `010-${mode.n}`,
    wave: 8,
    kind: 'parent',
    folder: modeDir,
    level: 2,
    template: PARENT_MOLD,
    title: `${mode.title} Migration`,
    status: 'Planned',
    predecessor: pred,
    successor: succ,
    handoff_criteria: `${mode.title}'s full run behavior is migrated to the typed event-ledger substrate: schema and reducers defined, artifacts sealed, certificate and receipts emitted, resume adapter proven, shadow-parity green, and the mode gate passes with the rollback switch armed.`,
    outcome: `Migrate ${mode.blurb} to the typed event-ledger substrate across seven concern children, ending in an independent mode gate.`,
    depends_on: mode.deps,
    children,
    content_brief: `MODE MIGRATION PARENT - ${mode.title}. Decompose ${mode.blurb} into seven concern children that together migrate the mode to the typed event-ledger substrate: typed schema, reducers, sealed artifacts, certificates and receipts, resume adapter, shadow parity, and rollback plus mode gate.${mode.couple ? ' ' + mode.couple : ''} Author ONLY the lean parent trio (spec.md root purpose plus a PHASE DOCUMENTATION MAP over the seven children); the children own the mechanics.`,
    research_refs: RESEARCH_REFS,
  });
});

// Wave 9 - the top 010 parent over the 8 mode parents.
items.push({
  id: '010',
  wave: 9,
  kind: 'parent',
  folder: TOP_REL,
  level: 2,
  template: PARENT_MOLD,
  title: 'Mode & Lane Migrations',
  status: 'Planned',
  predecessor: '009-shared-mode-contracts-and-fixtures',
  successor: '011-staged-state-migration-and-authority-cutover',
  handoff_criteria: 'Every one of the eight modes is migrated and green behind its own mode gate: shadow-parity passing, sealed artifacts and a certificate per mode, rollback switch armed. deep-improvement-common (004) landed before its three variants (005/006/007).',
  outcome: 'The per-mode fan-out: eight mode migrations, each a fractal parent implementing that mode’s full run behavior on the typed event-ledger substrate and ending in an independent mode gate.',
  depends_on: ['009'],
  children: MODES.map((mode) => ({
    slug: `${mode.n}-${mode.slug}`,
    focus: `Migrate ${mode.blurb} to the typed event-ledger substrate, ending in an independent mode gate.${mode.couple ? ' ' + mode.couple : ''}`,
  })),
  content_brief: 'TOP MODE-MIGRATION PARENT (010). This phase parent fans out into eight mode migrations - deep-research, deep-review, deep-ai-council, deep-improvement-common, agent-improvement, model-benchmark, skill-benchmark, deep-alignment - each a fractal parent that migrates one mode’s full run behavior to the typed event-ledger substrate and ends in its own mode gate. deep-improvement-common precedes the agent-improvement, model-benchmark, and skill-benchmark variants; deep-alignment shares the review loop with deep-review. Author ONLY the lean parent trio (spec.md root purpose plus a PHASE DOCUMENTATION MAP over the eight mode children); the mode parents and their children own the mechanics.',
  research_refs: RESEARCH_REFS,
});

// Merge: drop any prior 010-* entries, append the freshly generated set.
const wl = JSON.parse(fs.readFileSync(WORKLIST, 'utf8'));
const before = wl.items.length;
wl.items = wl.items.filter((x) => !String(x.id).startsWith('010'));
const stripped = before - wl.items.length;
wl.items.push(...items);
fs.writeFileSync(WORKLIST, JSON.stringify(wl, null, 2) + '\n');

const leaves = items.filter((x) => x.kind === 'leaf').length;
const parents = items.filter((x) => x.kind === 'parent').length;
console.log(`stripped ${stripped} prior 010 items; appended ${items.length} (${leaves} leaves + ${parents} parents).`);
console.log(`worklist now ${wl.items.length} items across waves ${[...new Set(wl.items.map((x) => x.wave))].sort((a, b) => a - b).join(',')}.`);
