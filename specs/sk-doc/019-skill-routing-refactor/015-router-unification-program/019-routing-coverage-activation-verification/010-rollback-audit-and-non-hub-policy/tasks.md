---
title: "Tasks: Rollback, Audit Integrity & Non-Hub Policy"
description: "Task breakdown for activate-hub.cjs --rollback, the flip-serving.cjs serving-prior and fence-direction fixes, append-only audit history, the non-hub policy, the P2 canary naming, and the routingRecommendation field fix (Planned)."
trigger_phrases:
  - "rollback audit integrity tasks"
  - "non-hub policy task list"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Rollback, Audit Integrity & Non-Hub Policy

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

**Task Format**: `T### [P?] Description (file path)`

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

**Focus**: Baseline snapshot + `activate-hub.cjs --rollback`.

- [ ] T001 Snapshot all seven hubs' current `manifest.json` + `fence-state.json` bytes as the before-state.
- [ ] T002 [B: T001] Add `--rollback` to `activate-hub.cjs`'s `parseArgs()` (~L79-92), reusing `proveRollback()`.
- [ ] T003 [B: T002] Prove the new rollback path on a non-production test hub or fixture before touching any live hub's committed state.

**Evidence**: the Phase 1 snapshot exists and is diffable; `activate-hub.cjs --hub <test> --rollback` restores the byte-identical prior manifest for the test fixture without touching any live hub.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Focus**: `flip-serving.cjs` fixes + append-only history + policy/canary docs.

- [ ] T004 [P] Replace `flip-serving.cjs`'s first-flip-only `serving-prior` guard (~L124) with an unconditional resave.
- [ ] T005 [P] Persist `direction` in `fence-state.json` (or implement the restore-prior-epoch alternative) for both `activate-hub.cjs` and `flip-serving.cjs`.
- [ ] T006 [B: T002, T004] Add `flip-history.jsonl` emission to both drivers, alongside their existing single-record files.
- [ ] T007 [P] Author the non-hub ineligibility policy document naming `sk-git`, `system-code-graph`, `system-skill-advisor`, `system-spec-kit`, `mcp-code-mode`; add negative fixtures for all 5.
- [ ] T008 [P1][P] Author the canary-profile document naming profile/window/thresholds/rollback-trigger, owner as an explicit placeholder.

**Evidence**: a rollback-then-reflip fixture sequence on `flip-serving.cjs` retains the correct current `serving-prior`; `fence-state.json` (or its replacement) distinguishes cutover from recovery; `flip-history.jsonl` accumulates entries across repeated events without erasure; all 5 non-hub negative fixtures pass.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

**Focus**: `session-snapshot.ts` fix (P1) + full regression + final verification.

- [ ] T009 [P1] Rename `session-snapshot.ts`'s `routingRecommendation` to `codeSearchRecommendation`; add typed `skillRouterStatus` (~L33, ~L161-167).
- [ ] T010 [P1][B: T009] Wire the live router-status probe requirement into `speckit-resume-auto.yaml` (~L110) and `session-prime.ts` (~L292) for router-cutover-relevant packets.
- [ ] T011 [B: T001-T008] Byte-diff all seven hubs' `manifest.json`/`fence-state.json` against the Phase 1 (T001) snapshot; confirm unchanged except for any hub deliberately exercised by this child's own rollback test.
- [ ] T012 Re-hash the three frozen scorer files before and after this child's full diff; confirm unchanged.
- [ ] T013 Run `validate.sh --strict` on this child folder.

**Evidence**: the fleet byte-diff shows zero unintended change across all seven hubs; pre/post SHA-256 identical for the frozen trio; `validate.sh --strict` reports Errors: 0.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements (REQ-001..REQ-005) implemented and evidenced.
- [ ] P1 requirements (REQ-006, REQ-007) implemented or explicitly deferred with user approval.
- [ ] Frozen scorer digests unchanged.
- [ ] All seven already-activated hubs' committed state unchanged except through this child's own proven rollback path.
- [ ] No `005-mcp-code-mode` folder was created.
- [ ] Strict Level-2 packet validation passes.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification checklist**: See `checklist.md`
- **Completion record**: See `implementation-summary.md`
- **Upstream evidence**: `../001-research/synthesis-v1.md` §2.1 (CF-ACT-8, CF-ACT-9, CF-ACT-11), `../001-research/verification-v1.md`, `../001-research/review-v1.md` §2-4

<!-- /ANCHOR:cross-refs -->
