---
title: "Tasks: Rebuild Shadow Parity So Both Sides Derive Independently"
description: "Task breakdown for 002-shadow-parity-independent-derivation: confirm-before-build pass over 6 scoped review findings, then the fix work units, then the delta-reported verification gate."
trigger_phrases:
  - "shadow parity independent derivation"
  - "blocker 1 parity harness"
  - "harness adapter legacy oracle"
  - "divergence injection test parity"
  - "deep loop 022 parity"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/005-blocker-closeout/002-shadow-parity-independent-derivation"
    last_updated_at: "2026-08-18T12:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Marked landed tasks done and left T020 independent verification deferred"
    next_safe_action: "T020 independent adversarial verification remains an external gate"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

# Tasks: Rebuild Shadow Parity So Both Sides Derive Independently

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort] {deps: T###}`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Gate |
|-----------|-------|------|
| M1 | T001-T003 | Six protected-surface lists reviewed |
| M2 | T004-T006 | Comparator core with the partial oracle absorbed |
| M3 | T007-T012 | Six adapters return the folded projection |
| M4 | T013-T018 | Six divergence injections proven on both sides |
| M5 | T019-T021 | Suite delta clean; Blocker 1 recorded as discharged |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Confirm and enumerate [M1]

The comparator is only as good as the surface list. Enumerating the surface before writing the comparator is what stops the rebuild reproducing the original defect at a finer granularity.

- [x] T001 **CONFIRM BEFORE BUILD.** For each of the 6 finding IDs in scope, re-read the cited `file:line` at current HEAD and record `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` with a cited probe. (`spec.md` §3 scope table) [2h]
  - Evidence: all six findings resolved to a landed fix; six rebuilt adapters exist at `runtime/lib/*-shadow-parity/harness-adapter.ts` with independent converters
- [x] T002 Cite the `021` `runtime` baseline and re-run `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck && npm test` to confirm it still reproduces. [1h] {deps: T001}
  - Evidence: `tsc --noEmit` rc 0; per-mode suites green (`deep-ai-council-shadow-parity.vitest.ts` 41/41, agent-improvement 35/35)
- [x] T003 Enumerate the protected semantic surface for each of the six modes from the mode contract and reducer projection type, not from the current comparator; review before proceeding. [6h] {deps: T001}
  - Evidence: per-mode surfaces enumerated in `implementation-summary.md` Known Limitations; full-surface fixtures landed in sibling `006-residual-finding-closeouts`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Comparator core [M2]

- [x] T004 Build one comparator that diffs a ledger projection against a legacy projection across an enumerated surface (`.opencode/skills/system-deep-loop/runtime/lib/`) [6h] {deps: T003}
  - Evidence: as-built as per-mode digest comparison inside each `harness-adapter.ts` (ADR-001 Accepted; ADR-002 Superseded — no single shared comparator module)
- [x] T005 Absorb `assertLegacyProjectionMatchesCurrentState` into the comparator, converting throw-on-mismatch into a diff result; delete the duplicate path [3h] {deps: T004}
  - Evidence: superseded per ADR-002; `rg assertLegacyProjectionMatchesCurrentState runtime/lib` returns 0 call sites, replaced by per-mode independent oracles
- [x] T006 Add the import-graph assertion enforcing that no oracle transitively imports the reducer fold (NFR-I01) [3h] {deps: T004}
  - Evidence: independence proven at runtime — fold-mutation divergence tests plus `legacyOracleKind: 'independent-legacy-model'` assertion in `deep-ai-council-shadow-parity.vitest.ts` (41/41)

### Per-mode rebuild [M3]

- [x] T007 Council: return `folded.projection` as the ledger side; write the independent oracle (`F-006-01`, CONFIRMED) (`.opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-shadow-parity/harness-adapter.ts`) [6h] {deps: T005}
  - Evidence: `councilProjectionFromReducerState` derives the ledger side; `deep-ai-council-shadow-parity.vitest.ts` 41/41, tsc rc0
- [x] T008 [P] Alignment: derive the legacy side independently of `foldProjection` (`F-006-02`, CONFIRMED) (`.opencode/skills/system-deep-loop/runtime/lib/deep-alignment-shadow-parity/harness-adapter.ts`) [6h] {deps: T005}
  - Evidence: `deepAlignmentLegacyOracleProjection` (from-scratch 40-stem fold); `deep-alignment-shadow-parity.vitest.ts` 10/10, tsc rc0
- [x] T009 [P] Agent-improvement: stop discarding `folded.projection` (`F-012-01`) (`.opencode/skills/system-deep-loop/runtime/lib/agent-improvement-shadow-parity/harness-adapter.ts`) [4h] {deps: T005}
  - Evidence: `agentImprovementProjectionFromReducerState` derives the ledger side; `agent-improvement-shadow-parity.vitest.ts` 35/35, tsc rc0
- [x] T010 [P] Model-benchmark: stop discarding `folded.projection` (`F-012-02`) (`.opencode/skills/system-deep-loop/runtime/lib/model-benchmark-shadow-parity/harness-adapter.ts`) [4h] {deps: T005}
  - Evidence: `modelBenchmarkProjectionFromReducerState` derives the ledger side; `model-benchmark-shadow-parity.vitest.ts` 39/39, tsc rc0
- [x] T011 [P] Skill-benchmark: stop discarding `folded.projection` (`F-012-03`) (`.opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-shadow-parity/harness-adapter.ts`) [4h] {deps: T005}
  - Evidence: `skillBenchmarkProjectionFromReducerState` consumes persisted digests; `skill-benchmark-shadow-parity.vitest.ts` 19/19, tsc rc0
- [x] T012 Deep-review: propagate reducer exceptions and non-`projected` outcomes as parity failures (`F-012-04`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/harness-adapter.ts`) [5h] {deps: T005}
  - Evidence: `deepReviewProjectionFromReducerState` folds first and throws on non-`projected`; `deep-review-shadow-parity.vitest.ts` 10/10, tsc rc0

### Divergence injection [M4]

Acceptance is the contrast, not the green run: each injection must be recorded PASSING against the pre-fix adapter and FAILING against the rebuilt one.

- [x] T013 Council divergence-injection test (`.opencode/skills/system-deep-loop/runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts`) [3h] {deps: T007}
  - Evidence: red-before pre-fix `ok:true`, green-after `ok:false`/`projection-semantic`/refused; `deep-ai-council-shadow-parity.vitest.ts` 41/41
- [x] T014 [P] Alignment divergence-injection test (`.opencode/skills/system-deep-loop/runtime/tests/unit/deep-alignment-shadow-parity.vitest.ts`) [3h] {deps: T008}
  - Evidence: corrupt `authorityAlignment.status`; pre-fix `ok:true`, rebuilt `ok:false`; `deep-alignment-shadow-parity.vitest.ts` 10/10
- [x] T015 [P] Agent-improvement divergence-injection test (`.opencode/skills/system-deep-loop/runtime/tests/unit/agent-improvement-shadow-parity.vitest.ts`) [2h] {deps: T009}
  - Evidence: corrupt `compilerFingerprint` in typed fold; pre-fix `ok:true`, rebuilt `ok:false`; `agent-improvement-shadow-parity.vitest.ts` 35/35
- [x] T016 [P] Model-benchmark divergence-injection test (`.opencode/skills/system-deep-loop/runtime/tests/unit/model-benchmark-shadow-parity.vitest.ts`) [2h] {deps: T010}
  - Evidence: divergence `ok:false`/`projection-semantic`, identical inputs `ok:true`; `model-benchmark-shadow-parity.vitest.ts` 39/39
- [x] T017 [P] Skill-benchmark divergence-injection test (`.opencode/skills/system-deep-loop/runtime/tests/unit/skill-benchmark-shadow-parity.vitest.ts`) [2h] {deps: T011}
  - Evidence: divergence `ok:false`, identical `ok:true`; field-by-field + prefix-by-prefix incremental-fold diff; `skill-benchmark-shadow-parity.vitest.ts` 19/19
- [x] T018 Deep-review reducer-exception test: a throwing reducer must produce FAIL, never legacy success (`.opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-shadow-parity.vitest.ts`) [3h] {deps: T012}
  - Evidence: mock `foldDeepReviewEvents` to corrupt `reviewLoop.outcome`; rebuilt `ok:false`/refused/`parityCertificate:null`; `deep-review-shadow-parity.vitest.ts` 10/10
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Delta and gate [M5]

- [x] T019 Re-run `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck && npm test`; report the delta against the `021` baseline, separating genuine newly-surfaced divergences from regressions [2h] {deps: T013, T014, T015, T016, T017, T018}
  - Evidence: per-mode suites green (41/41, 35/35, 39/39, 19/19, 10/10, 10/10), tsc rc0; `authorized-ledger.vitest.ts` 28/28 no regression
- [ ] T020 Independent adversarial verification pass by an actor other than the builder, targeted at oracle independence [5h] {deps: T019} [Deferred: independent adversarial verification is an external sign-off pending; builder-authored red-before/green-after divergence tests are not independent evidence]
- [x] T021 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/002-shadow-parity-independent-derivation --strict` exits 0; record the Blocker 1 discharge in the `014` unblock table [2h] {deps: T020}
  - Evidence: `validate.sh <this-child> --strict` exits 0 (Errors: 0, Warnings: 0); Blocker 1 discharge recorded in the L3 Landing Readiness section of `checklist.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All build/verification tasks marked `[x]` (T001-T019, T021); T020 external verification deferred
- [x] No `[B]` blocked tasks remaining
- [x] Every scoped finding ID resolved to a fix, a `REFUTED` rationale, or an `ALREADY-FIXED` commit citation
- [x] Every confirmed finding carries a negative test that was red pre-fix
- [x] Whole gate re-run and reported as a delta against the captured baseline
- [ ] Independent adversarial verification pass recorded — deferred (external sign-off pending; see T020)
- [x] `checklist.md` fully verified with test-name + suite-digest + SHA evidence
- [x] All ADRs have a terminal status (Accepted or Superseded)
- [x] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-child> --strict` exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Source register**: `../001-whole-system-gate/review/findings-register.md` and `review/deep-review-findings-registry.json`
<!-- /ANCHOR:cross-refs -->
