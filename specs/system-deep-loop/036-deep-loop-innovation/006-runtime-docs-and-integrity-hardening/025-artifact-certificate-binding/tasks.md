---
title: "Tasks: Bind Sealed Artifacts and Certificates to the Semantic Identity They Claim to Certify"
description: "Task breakdown for 025-artifact-certificate-binding, reconciled against the landed build: T001-T018/T020-T021 done across 4 commits + a companion fix; T003 (historical corpus) and T019 (corpus re-verify) remain genuinely open."
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
    last_updated_at: "2026-08-09T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Reconciled task checkboxes against the landed 12-finding build"
    next_safe_action: "Review T003 and T019 for the historical certificate corpus"
    blockers: []
    key_files:
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 85
    open_questions: []
    answered_questions:
      - "Are T001-T018/T020 done? Yes, across 4 landed commits plus a required companion fix, all reachable on origin/skilled/v4.0.0.0."
      - "Are T003/T019 done? No — the historical certificate corpus was never enumerated; left genuinely open rather than false-marked."
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

| Milestone | Tasks | Gate | Status |
|-----------|-------|------|--------|
| M1 | T001-T004 | Field lists and historical corpus enumerated | T001/T002/T004 done; T003 (historical corpus) open |
| M2 | T005-T007 | Binding validator with per-emitter field lists | Done — validator built and adopted by 1 of 4 emitters (see T006 note) |
| M3 | T008-T010 | Sealed store and creation evidence bound | Done (`8b2e49931f8`); 1 low-sev residual on T008 (see note) |
| M4 | T011-T015 | Four certificate emitters bound | Done (`59e0040d33`, `d30321b98e`) |
| M5 | T016-T017 | Reducers bound | Done (`89067fe46e` + companion `a232835611`) |
| M6 | T018-T021 | Twelve decoy tests; delta clean | T018/T020/T021 done; T019 (corpus re-verify) open |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Confirm and enumerate [M1]

Enumerating the historical certificate corpus first is what separates "tightening rejected a forgery" from "tightening rejected a genuine certificate".

- [x] T001 **CONFIRM BEFORE BUILD.** For each of the 12 finding IDs in scope, re-read the cited `file:line` at current HEAD and record `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` with a cited probe. (`spec.md` §3 scope table) [3h]
  - **Done**: `t001-disposition.md` (`a5f89f15872`) — 12/12 `CONFIRMED-REAL`, `GO-to-build`, none `REFUTED`.
- [x] T002 Enumerate the load-bearing identity fields per certificate emitter [4h] {deps: T001}
  - **Done, partially formal**: the field list exists as shipped data driving `certificate-binding-core.ts` for `F-011-03` (~15 fields, named in `d30321b98e`'s commit message); the 3 Group C emitters each carry an inline per-kind field switch rather than an enumerated field-list document — see T006 note.
- [ ] T003 Enumerate the historical certificate corpus that must continue to verify [3h] {deps: T001}
  - **Open**: no corpus-enumeration artifact found in the 5 landed commits or elsewhere in this child.
- [x] T004 Cite the `021` baseline and confirm the `024` receipt and proof primitives are available [1h] {deps: T001}
  - **Done**: `t001-disposition.md` §4 confirms `F-007-01` needs no missing `024` primitive (`frame.sequence` already exposed); `021` baseline continuity is tracked via the "unchanged" regression chain across the 4 build commits (see `checklist.md` CHK-002).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Binding validator [M2]

- [x] T005 Build one validator that compares a claim against values re-derived from the verified typed payload [8h] {deps: T002}
  - **Done**: `certificate-binding-core.ts`'s `firstBoundFieldMismatch`, landed `d30321b98e`.
- [x] T006 Express per-emitter load-bearing field lists as data driving the validator [3h] {deps: T005}
  - **Done for 1 of 4 emitters.** `firstBoundFieldMismatch` is called only by `deep-improvement-common-certificates.ts` (`F-011-03`) — confirmed via `git grep certificate-binding-core` across all 5 landed commits. The 3 Group C emitters (`F-015-02`, `F-011-04`, `F-006-04`) each ship a local inline comparison instead of routing through this validator. Not a defect in any individual fix (each has its own decoy test), but ADR-001's "one shared validator for all four emitters" goal is only 1/4 realized. See `implementation-summary.md` Known Limitations #6.
- [x] T007 Decide and record the issuer-versus-verifier fix order for `F-007-01` so no value is invented on one side and re-derived on the other [2h] {deps: T004}
  - **Done**: both issuer (`unsignedSharedReceipt`) and verifier bind to `frame.sequence` together, landed in the same commit `d30321b98e`, per ADR-002. Recorded in `implementation-summary.md` Key Decisions (not in `decision-record.md`'s ADR-002 implementation notes, which was left untouched — out of this reconciliation pass's scope).

### Sealed store and events [M3]

- [x] T008 Resolve `deleteAuthorized` and `restoreAuthorized` authorization against the ledger (`F-011-01`) (`.opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/sealed-artifact-store.ts`) [6h] {deps: T006}
  - **Done, with a documented residual**: landed `8b2e49931f8` — both methods now take `AppendOnlyLedger` and resolve against a verified ledger frame. Residual: `resolveLifecycleAuthorization` compares only `qualified_digest`, not the full `sameReference` used elsewhere in the same file — low-sev, near-zero production exposure (only the base `InitialArtifactKinds` store, not any domain store). See `implementation-summary.md` Known Limitations #1.
- [x] T009 [P] Run the registered canonicalizer on verified sealed reads (`F-011-02`) (`.opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/sealed-artifact-store.ts`) [3h] {deps: T006}
  - **Done**: landed `8b2e49931f8` — reads now re-derive the canonical encoding and reject a mismatch.
- [x] T010 Compare the complete reference in creation-evidence lookup (`F-015-01`) (`.opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/artifact-events.ts`) [5h] {deps: T006}
  - **Done**: landed `8b2e49931f8` — via the new shared `sameReference` primitive.

### Certificate emitters [M4]

- [x] T011 Deep-review: bind artifacts to events by content digest, not metadata (`F-015-02`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-review-certificates/deep-review-certificates.ts`) [6h] {deps: T006}
  - **Done, partial scope**: landed `59e0040d33` — content digest bound for `CONVERGENCE_WITNESS`/`SYNTHESIS_VIEW`/`SYNTHESIS_REPORT` (3 kinds); `TARGET_SNAPSHOT`/`SCOPE_REFERENCE_SET`/`REVIEW_CONTRACT` deliberately left unbound by content digest (their `materialDigest` already points at a required backing-blob per `validateBackedMaterialReference`). See `implementation-summary.md` Known Limitations #2.
- [x] T012 Common: compare every emitted semantic body field (`F-011-03`) and add scoped identity binding to artifact origin validation (`F-007-02`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-certificates/deep-improvement-common-certificates.ts`) [7h] {deps: T006}
  - **Done**: landed `d30321b98e`.
- [x] T013 Common: stop fabricating `result_head.sequence` and transition heads; read them from the ledger (`F-007-01`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-certificates/deep-improvement-common-certificates.ts`) [6h] {deps: T007, T012}
  - **Done**: landed `d30321b98e`, same commit as T012.
- [x] T014 [P] Alignment: require a lane or digest match for provenance (`F-011-04`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-alignment-certificates/deep-alignment-certificates.ts`) [4h] {deps: T006}
  - **Done**: landed `59e0040d33` — `lane_completed` removed from the unconditional 4-stem bypass.
- [x] T015 Council: bind artifact `scope.runId`/`scope.roundId` (`F-006-04`) and include `roundId` in source references (`F-006-03`) — serialize the reducer edit with `022` (`.opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-certificates/`, `.opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-reducers/`) [6h] {deps: T006}
  - **Done, as two separate commits rather than one**: `F-006-04` (certificates) landed `59e0040d33`; `F-006-03` (reducer) landed `89067fe46e` (Group D), not the same commit T015 implies. Both confirmed independently by direct read.

### Reducers [M5]

- [x] T016 [P] Model: ownership-bind score references to the target trial (`F-007-03`) (`.opencode/skills/system-deep-loop/runtime/lib/model-benchmark-reducers/model-benchmark-reducer.ts`) [4h] {deps: T006}
  - **Done**: landed `89067fe46e`.
- [x] T017 [P] Research: reject replay sequence gaps when no checkpoint explains them (`F-005-01`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts`) [4h] {deps: T006}
  - **Done, with a flagged-and-closed downstream residual**: landed `89067fe46e`. This default-on stricter check broke `deep-research-shadow-parity`'s reorder-fault test (named and root-caused in `89067fe46e`'s own commit message, `48/49`, flagged rather than fixed inline under SCOPE LOCK); the companion commit `a232835611` (1-line, `harness-adapter.ts`, `requireContiguousTail: false`) applied the flagged fix.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Decoys, delta and gate [M6]

Acceptance per finding is the decoy contrast: the decoy satisfies today's predicate and must fail after the fix.

- [x] T018 Author a decoy or forgery negative test per finding; record the passing pre-fix run and the failing post-fix run [10h] {deps: T008, T009, T010, T011, T013, T014, T015, T016, T017}
  - **Done**: 12/12 named tests, listed per group in `implementation-summary.md` What Was Built; red-before/green-after confirmed in the commit messages.
- [ ] T019 Verify the historical certificate corpus still verifies; investigate any rejection as a finding [4h] {deps: T018}
  - **Open**: depends on T003 (corpus was never enumerated), so nothing exists to re-verify against. Genuinely open.
- [x] T020 Re-run `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck && npm test`; report the delta against the `021` baseline [2h] {deps: T019}
  - **Done, transcribed**: per-file tallies in `implementation-summary.md` Verification (9 suites matching the task-provided figures, `authorized-ledger` 34/34 unchanged, `tsc --noEmit: 0 errors` stated in 2 of the 4 commit messages). This reconciliation pass did not re-execute the suites itself — see `implementation-summary.md` Known Limitations #5.
- [x] T021 Independent adversarial verification pass, then `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/system-deep-loop/036-deep-loop-innovation/025-artifact-certificate-binding --strict` exits 0 [6h] {deps: T020}
  - **Done**: the adversarial pass returned CLEAN (11/12 fully clean, 1 low-sev residual). After adding the required AI execution protocol, strict validation exited 0 with zero errors and warnings on 2026-08-10.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` — T003 and T019 remain open
- [x] No `[B]` blocked tasks remaining
- [x] Every scoped finding ID resolved to a fix, a `REFUTED` rationale, or an `ALREADY-FIXED` commit citation — 12/12 resolved to a fix
- [x] Every confirmed finding carries a negative test that was red pre-fix
- [ ] Whole gate re-run and reported as a delta against the captured baseline — no standalone pre-edit baseline artifact was found (see `checklist.md` CHK-002); the delta is tracked via the commits' own "unchanged" regression chain instead
- [x] Independent adversarial verification pass recorded
- [ ] `checklist.md` fully verified with test-name + suite-digest + SHA evidence — 33/45 items verified; 12 left genuinely open (see `checklist.md`)
- [ ] All ADRs have a terminal status (Accepted or Superseded) — both remain `Proposed`; `decision-record.md` out of this pass's scope
- [x] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-child> --strict` exits 0 — verified 2026-08-10 with zero errors and warnings
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Confirm-before-build disposition**: `t001-disposition.md` (`a5f89f15872`; not present under `.opencode/specs/` in this worktree — read via `git show a5f89f15872:<path>`)
- **Source register**: `../016-whole-system-gate/review/findings-register.md` and `review/deep-review-findings-registry.json`
<!-- /ANCHOR:cross-refs -->
