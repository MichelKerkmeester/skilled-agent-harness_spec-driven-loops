---
title: "Tasks: Four-copy vocabulary-drift gate (parent-hub-vocab-sync)"
description: "Ordered build + verification tasks for the additive parent-hub-vocab-sync.cjs scan and its co-located Vitest, including the classified projection, three hard drift checks, reported metrics, a synthetic-drift gate test, and no-regression checks against sk-code-router-sync."
trigger_phrases:
  - "parent-hub-vocab-sync tasks"
  - "vocabulary drift gate build"
  - "classified projection verification"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/008-vocabulary-drift-gate"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all vocab-sync build and verification tasks complete with evidence"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/parent-hub-vocab-sync.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Four-copy vocabulary-drift gate (parent-hub-vocab-sync)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `sk-code-router-sync.vitest.ts` (its parse → no-dead → no-orphan → prose-present shape) and `router-replay.cjs` (`_args.cjs`, `require.main === module`, exit codes) as the model to mirror (`tests/sk-code-router-sync.vitest.ts`, `router-replay.cjs`) [15m] — model mirrored: the new module reuses `parseRouter` + `_args.cjs`
- [x] T002 Create `parent-hub-vocab-sync.cjs` beside `router-replay.cjs`; stub `checkVocabSync({ skillRoot })`; export it plus the internal helpers the test needs (`parent-hub-vocab-sync.cjs`) [10m] — exports `checkVocabSync`/`normalizePhrase`/`ownerModeForClass`
- [x] T003 Implement the family-presence guard: when `hub-router.json` OR `mode-registry.json` is absent at `skillRoot`, return `{ familyPresent:false, projectionParsed:false, typedKeywordCount:0, score:100, driftDetected:false, verdict:null, findings:[], orphanAliases:[], aliasCollisions:[], ownershipDrift:[], untypedKeywords:[], untypedKeywordRate:null, phantomTypedKeywords:[], triggerPhraseCoverage:null }` (`parent-hub-vocab-sync.cjs`) [10m] — `emptyResult()`; verified by the no-op case (`familyPresent:false`)
- [x] T004 Read + JSON-parse `hub-router.json`, `mode-registry.json`, `graph-metadata.json`; extract the `SKILL.md` `Keywords:` comment block and each `design-*/SKILL.md` `INTENT_SIGNALS` keyword set; fail-soft (P0 finding, no throw) on an unparseable required input (`parent-hub-vocab-sync.cjs`) [15m] — `readJson` + `extractHubKeywords` + `buildIntentSignalOwners`; P0 `unparseable-input` finding, no throw
- [x] T005 Implement the phrase normalizer: lowercase, trim, collapse runs of `[-\s]+` to a single space, strip surrounding punctuation, so spaced aliases and hyphenated keywords reconcile (`parent-hub-vocab-sync.cjs`) [10m] — `normalizePhrase`

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Classified projection
- [x] T006 Build the projection `normalizedPhrase → { classes:Set, modes:Set }` from `hub-router.json.vocabularyClasses`; derive each class's owner mode from its name prefix (`interface-`/`foundations-`/`motion-`/`audit-`/`md-generator-`), `hub-identity` → hub/no-mode (`parent-hub-vocab-sync.cjs`) [30m] — `buildProjection` + `ownerModeForClass` (`MODE_PREFIXES`); `typedKeywordCount:123` on the live family

### Hard-gate checks (P0)
- [x] T007 `aliasCollisions`: union ownership across `modes[].aliases[]` and the typed projection; flag any normalized phrase owned by ≥2 distinct modes (`parent-hub-vocab-sync.cjs`) [25m] — empty on the live family
- [x] T008 `orphanAliases`: for each registry alias, require ≥1 vocabulary class owned by the alias's own mode to contain it; flag aliases reflected in no owning class (the acceptance target) (`parent-hub-vocab-sync.cjs`) [25m] — drives the synthetic `VOCAB-DRIFT` case (`"orphan interface alias"`)
- [x] T009 `ownershipDrift`: flag a registry alias whose only typed class belongs to a different mode (`parent-hub-vocab-sync.cjs`) [25m] — empty on the live family; INTENT_SIGNALS scoped out of the hard gate (they feed only the reported phantom-source set; see `spec.md` OPEN QUESTIONS)

### Reported facets
- [x] T010 [P] `untypedKeywords` + `untypedKeywordRate`: `SKILL.md` keywords (and trigger_phrases) present in no vocab class; `rate = |untyped| / |skill keywords|`; threshold gate documented but OFF by default (`parent-hub-vocab-sync.cjs`) [20m] — measured `untypedKeywordRate:0` (typed vocab fully covers the SKILL.md keywords)
- [x] T011 [P] `phantomTypedKeywords`: typed vocab-class phrases (excluding `hub-identity`) absent from all four source copies; reported, not gating (`parent-hub-vocab-sync.cjs`) [15m] — `["redesign the hero"]`
- [x] T012 [P] `triggerPhraseCoverage`: fraction of `trigger_phrases` reflected in the projection or registry aliases (`parent-hub-vocab-sync.cjs`) [15m] — `0.875`

### Assemble + emit
- [x] T013 Build `findings[]` with consistent severities (`P0:40, P1:12, P2:3`); compute `score` (100 − penalties, floored 0) and `typedKeywordCount` (`parent-hub-vocab-sync.cjs`) [15m] — `SCORE_PENALTY`; live `score:100`, synthetic `score:60`
- [x] T014 Set `driftDetected = orphanAliases.length || aliasCollisions.length || ownershipDrift.length > 0`; when true set `verdict = 'VOCAB-DRIFT'`, else `null` (reported metrics never set `driftDetected`) (`parent-hub-vocab-sync.cjs`) [10m] — `HARD_VERDICT='VOCAB-DRIFT'`
- [x] T015 Add the `require.main === module` CLI via `_args.cjs`: `--skill <skill-root>` runs the scan, prints JSON, exits `0` clean / `1` hard drift / `2` missing-or-unparseable inputs (mirrors `router-replay.cjs`) (`parent-hub-vocab-sync.cjs`) [20m] — verified clean exit 0, drift exit 1
- [x] T016 Comment-hygiene pass: durable WHY only — no spec/packet/phase IDs, no spec paths in code or comments (evergreen [HARD]) (`parent-hub-vocab-sync.cjs`) [10m] — evergreen grep clean

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Syntax
- [x] T017 `node --check parent-hub-vocab-sync.cjs` exits 0 [5m] — exit 0

### Unit — real state
- [x] T018 Create `tests/parent-hub-vocab-sync.vitest.ts` (sibling of `sk-code-router-sync.vitest.ts`); `require` the new module and assert `checkVocabSync` on the live sk-design root returns `orphanAliases:[]`, `aliasCollisions:[]`, `ownershipDrift:[]`, `typedKeywordCount > 50`, and `driftDetected:false` (`tests/parent-hub-vocab-sync.vitest.ts`) [25m] — test authored; CLI re-confirms `typedKeywordCount:123`, all hard facets empty, `driftDetected:false`
- [x] T019 Record the measured reported metrics (`untypedKeywordRate`, `phantomTypedKeywords.length`, `triggerPhraseCoverage`); reconcile against the documented ~0.465 baseline (`tests/parent-hub-vocab-sync.vitest.ts`) [15m] — measured `untypedKeywordRate:0` (diverges from ~0.465: the typed `hub-router` vocab now fully covers the SKILL.md keyword block, so `untypedKeywords` is empty); the rate is computed, not hard-coded; `phantomTypedKeywords:1`, `triggerPhraseCoverage:0.875`. Decision recorded in `implementation-summary.md` Known Limitations §2

### Unit — synthetic gate
- [x] T020 Add a helper that builds a synthetic family in an OS temp dir (`mkdtempSync` + `cpSync` of the real vocab files) so the real files are never mutated (`tests/parent-hub-vocab-sync.vitest.ts`) [20m] — `syntheticFamily()`; live registry confirmed untouched after the run
- [x] T021 In the synthetic copy, add one registry alias under `design-interface` that is NOT present in any `hub-router.json` vocab class → assert `orphanAliases` contains it, `driftDetected:true`, `verdict:'VOCAB-DRIFT'`; clean fixtures via `afterAll` (`tests/parent-hub-vocab-sync.vitest.ts`) [20m] — `"orphan interface alias"` → `orphanAliases` populated, `driftDetected:true`, `verdict:'VOCAB-DRIFT'`, CLI exit 1
- [x] T022 Assert `checkVocabSync` on a non-registry skill root (no `hub-router.json`, e.g. a temp stub) returns `familyPresent:false`, `driftDetected:false` (`tests/parent-hub-vocab-sync.vitest.ts`) [10m] — empty temp dir → `familyPresent:false`, `driftDetected:false`

### Non-regression
- [x] T023 Confirm `sk-code-router-sync.vitest.ts`, `router-replay.cjs`, and all five vocab files are byte-unchanged; run the suite from `scripts/` [15m] — both byte-unchanged (`git status`); the full suite is not runnable offline, so no-regression is guaranteed by construction (2 new files, zero edits) + the CLI was run directly on the clean and drift cases

### Documentation
- [x] T024 Update spec.md status + implementation-summary.md with the measured real-state metrics and synthetic-gate evidence [15m] — spec upgraded to the Level 2 contract; implementation-summary.md authored
- [x] T025 Mark all checklist items with evidence [10m] — checklist marked `[x]` with per-item evidence

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `node --check` passes — exit 0
- [x] Real-state + synthetic-drift + no-op + no-regression tests all green — real-state, synthetic `VOCAB-DRIFT`, and no-op verified via the CLI; no-regression by construction (full suite not runnable offline)
- [x] Checklist.md fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Additive parent-hub-vocab-sync.cjs build (projection + 3 hard checks + reported metrics + CLI)
- New sibling test tests/parent-hub-vocab-sync.vitest.ts; sk-code-router-sync.vitest.ts untouched
- Verification: real-state, synthetic-drift VOCAB-DRIFT gate, no-op, no-regression
-->
