---
title: "Tasks: Bind Sealed Artifacts and Certificates to the Semantic Identity They Claim to Certify"
description: "Task breakdown for 025-artifact-certificate-binding: confirm-before-build pass over 12 scoped review findings, then the fix work units, then the delta-reported verification gate."
trigger_phrases:
  - "artifact certificate binding"
  - "sealed artifact identity binding"
  - "certificate semantic binding"
  - "decoy artifact negative test"
  - "deep loop 025 certificates"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/025-artifact-certificate-binding"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the phased task breakdown from the WS1 phase-tree proposal"
    next_safe_action: "Execute T001 before any other task"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

# Tasks: Bind Sealed Artifacts and Certificates to the Semantic Identity They Claim to Certify

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
| M1 | T001-T004 | Field lists and historical corpus enumerated |
| M2 | T005-T007 | Binding validator with per-emitter field lists |
| M3 | T008-T010 | Sealed store and creation evidence bound |
| M4 | T011-T015 | Four certificate emitters bound |
| M5 | T016-T017 | Reducers bound |
| M6 | T018-T021 | Twelve decoy tests; delta clean |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Confirm and enumerate [M1]

Enumerating the historical certificate corpus first is what separates "tightening rejected a forgery" from "tightening rejected a genuine certificate".

- [ ] T001 **CONFIRM BEFORE BUILD.** For each of the 12 finding IDs in scope, re-read the cited `file:line` at current HEAD and record `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` with a cited probe. (`spec.md` §3 scope table) [3h]
- [ ] T002 Enumerate the load-bearing identity fields per certificate emitter [4h] {deps: T001}
- [ ] T003 Enumerate the historical certificate corpus that must continue to verify [3h] {deps: T001}
- [ ] T004 Cite the `021` baseline and confirm the `024` receipt and proof primitives are available [1h] {deps: T001}
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Binding validator [M2]

- [ ] T005 Build one validator that compares a claim against values re-derived from the verified typed payload [8h] {deps: T002}
- [ ] T006 Express per-emitter load-bearing field lists as data driving the validator [3h] {deps: T005}
- [ ] T007 Decide and record the issuer-versus-verifier fix order for `F-007-01` so no value is invented on one side and re-derived on the other [2h] {deps: T004}

### Sealed store and events [M3]

- [ ] T008 Resolve `deleteAuthorized` and `restoreAuthorized` authorization against the ledger (`F-011-01`) (`.opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/sealed-artifact-store.ts`) [6h] {deps: T006}
- [ ] T009 [P] Run the registered canonicalizer on verified sealed reads (`F-011-02`) (`.opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/sealed-artifact-store.ts`) [3h] {deps: T006}
- [ ] T010 Compare the complete reference in creation-evidence lookup (`F-015-01`) (`.opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/artifact-events.ts`) [5h] {deps: T006}

### Certificate emitters [M4]

- [ ] T011 Deep-review: bind artifacts to events by content digest, not metadata (`F-015-02`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-review-certificates/deep-review-certificates.ts`) [6h] {deps: T006}
- [ ] T012 Common: compare every emitted semantic body field (`F-011-03`) and add scoped identity binding to artifact origin validation (`F-007-02`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-certificates/deep-improvement-common-certificates.ts`) [7h] {deps: T006}
- [ ] T013 Common: stop fabricating `result_head.sequence` and transition heads; read them from the ledger (`F-007-01`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-certificates/deep-improvement-common-certificates.ts`) [6h] {deps: T007, T012}
- [ ] T014 [P] Alignment: require a lane or digest match for provenance (`F-011-04`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-alignment-certificates/deep-alignment-certificates.ts`) [4h] {deps: T006}
- [ ] T015 Council: bind artifact `scope.runId`/`scope.roundId` (`F-006-04`) and include `roundId` in source references (`F-006-03`) — serialize the reducer edit with `022` (`.opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-certificates/`, `.opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-reducers/`) [6h] {deps: T006}

### Reducers [M5]

- [ ] T016 [P] Model: ownership-bind score references to the target trial (`F-007-03`) (`.opencode/skills/system-deep-loop/runtime/lib/model-benchmark-reducers/model-benchmark-reducer.ts`) [4h] {deps: T006}
- [ ] T017 [P] Research: reject replay sequence gaps when no checkpoint explains them (`F-005-01`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts`) [4h] {deps: T006}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Decoys, delta and gate [M6]

Acceptance per finding is the decoy contrast: the decoy satisfies today's predicate and must fail after the fix.

- [ ] T018 Author a decoy or forgery negative test per finding; record the passing pre-fix run and the failing post-fix run [10h] {deps: T008, T009, T010, T011, T013, T014, T015, T016, T017}
- [ ] T019 Verify the historical certificate corpus still verifies; investigate any rejection as a finding [4h] {deps: T018}
- [ ] T020 Re-run `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck && npm test`; report the delta against the `021` baseline [2h] {deps: T019}
- [ ] T021 Independent adversarial verification pass, then `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/025-artifact-certificate-binding --strict` exits 0 [6h] {deps: T020}
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every scoped finding ID resolved to a fix, a `REFUTED` rationale, or an `ALREADY-FIXED` commit citation
- [ ] Every confirmed finding carries a negative test that was red pre-fix
- [ ] Whole gate re-run and reported as a delta against the captured baseline
- [ ] Independent adversarial verification pass recorded
- [ ] `checklist.md` fully verified with test-name + suite-digest + SHA evidence
- [ ] All ADRs have a terminal status (Accepted or Superseded)
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-child> --strict` exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Source register**: `../016-whole-system-gate/review/findings-register.md` and `review/deep-review-findings-registry.json`
<!-- /ANCHOR:cross-refs -->
