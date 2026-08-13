---
title: "Verification Checklist: Make Invalid Input Fail Loudly and Repair the Harnesses That Produce Evidence"
description: "Verification checklist for 031-silent-failure-and-harness-repair: baseline-before-delta evidence, a negative test per confirmed finding, and independent adversarial verification."
trigger_phrases:
  - "silent failure harness repair"
  - "input validation exit code deep loop"
  - "aggregate suite double registration"
  - "manual playbook dead runtime path"
  - "deep loop 031 silent failure"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/031-silent-failure-and-harness-repair"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Landed 22/23 findings as 8fc33832c9+8b887bef5f+5611f21a15 (3 lanes)"
    next_safe_action: "Re-land skill-benchmark-resume-adapter timeout fix without the hang"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

# Verification Checklist: Make Invalid Input Fail Loudly and Repair the Harnesses That Produce Evidence

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

Evidence strings must name a **test name + suite-content digest + candidate SHA**. A bare run count is not evidence: reconciling exactly that failure is what child `021` exists for.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] All scoped finding IDs classified by T001 before any edit
  - **Evidence**: T001 table in `tasks.md`: every ID carries `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` plus a cited probe
- [ ] CHK-002 [P0] Pre-edit baseline captured for every runner this child touches
  - **Evidence**: Recorded discovered-test count, pass/fail/skip, and exit code per runner, at a named SHA

- [ ] CHK-010 [P0] Discovered-test count baseline captured per file before Lane B
  - **Evidence**: Per-file discovered counts at a named SHA
- [ ] CHK-011 [P0] The `021` sequencing decision recorded
  - **Evidence**: Recorded choice: digest-based citations, or a post-`031` re-reconcile
- [ ] CHK-012 [P1] Exit-code consumers enumerated before the classification change
  - **Evidence**: Consumer list with the ones needing updates named
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-020 [P0] No invalid-input path exits 0
  - **Evidence**: Grep plus a classification test per Lane A case
- [ ] CHK-021 [P1] No closed-type cast remains where only a generic check preceded it
  - **Evidence**: Diff review of `divergent-pivot.ts` and `durable-orchestrator.ts`
- [ ] CHK-022 [P1] No ephemeral artifact labels embedded in shipped code comments
  - **Evidence**: Comment hygiene review of the diff
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-003 [P0] Every confirmed finding has a negative test that is red pre-fix and green post-fix
  - **Evidence**: Named test per finding, with the red run and the green run both recorded
- [ ] CHK-004 [P0] Whole gate re-run at close and reported as a delta against the baseline
  - **Evidence**: Post-edit run of every runner, delta table vs CHK-002
- [ ] CHK-005 [P1] Independent adversarial verification pass by a different actor than the builder
  - **Evidence**: Verification record naming the actor and the defects found (or explicitly none)

- [ ] CHK-030 [P0] One classification test per Lane A invalid-input case
  - **Evidence**: Test-to-finding mapping with no unmapped Lane A finding
- [ ] CHK-031 [P0] A corrupt delta row produces a strict failure
  - **Evidence**: Named test
- [ ] CHK-032 [P0] A malformed newest record is not satisfied by a stale valid one
  - **Evidence**: Named test
- [ ] CHK-033 [P0] Each test registers exactly once after Lane B
  - **Evidence**: Per-file discovered-count delta with unique-test evidence
- [ ] CHK-034 [P0] A SIGTERM-ignoring fixture with a descendant completes within bounds with a clean process tree
  - **Evidence**: Named test with the process tree checked
- [ ] CHK-035 [P1] Every prescribed playbook `cwd` and test path resolves
  - **Evidence**: Resolution gate with zero unresolved paths
- [ ] CHK-036 [P1] All ten benchmark profiles resolve their fixture IDs
  - **Evidence**: All-profile asset-resolution gate
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each of the 23 scoped findings has a finding class recorded (`CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED`) from T001, treating `F-003-03`/`F-037-04` as one work unit
  - **Evidence**: T001 output table in `tasks.md` lists all 23 IDs with a classification and a cited probe
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed for every silent-success invalid-input path across Lane A's five scripts
  - **Evidence**: T004's exit-code-consumer enumeration cross-checked against every script in scope; no unclassified silent-success path remains
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the current exit codes before the classification change
  - **Evidence**: T004 consumer list names every automation caller, each updated in the same change
- [ ] CHK-FIX-004 [P0] The Lane B de-duplication has an adversarial case: an aggregate that legitimately needs to import a suite it does not independently discover
  - **Evidence**: Named case reviewed; no unique test lost per CHK-033's per-file delta
- [ ] CHK-FIX-005 [P1] The {23 findings} x {lane, disposition} matrix is listed before completion is claimed
  - **Evidence**: T001 classification table cross-tabulated against the Lane A/B/C assignment in `implementation-summary.md`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-007 [P1] Severity calibration carried into the spec and not re-escalated
  - **Evidence**: `spec.md` §2 contains the calibration block verbatim

- [ ] CHK-040 [P1] Benchmark postconditions cannot pass on files outside the repo
  - **Evidence**: Named test with an absolute out-of-repo probe path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-006 [P0] No evidence string cites a bare run count or raw line number
  - **Evidence**: Every evidence string carries a test name + suite digest + candidate SHA
- [ ] CHK-008 [P0] `validate.sh --strict` exits 0 for this child
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <child> --strict` -> exit 0

- [ ] CHK-050 [P0] The count reduction is documented as a fix, not as lost coverage
  - **Evidence**: Delta report with the explanation and unique-test evidence
- [ ] CHK-051 [P1] Each of the five pre-existing command-contract failures carries a recorded disposition
  - **Evidence**: Five dispositions with rationales
- [ ] CHK-052 [P1] The verdict-vocabulary resolution is documented with its effect on existing scenario results
  - **Evidence**: Recorded decision and its consequences
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-090 [P1] Temp files confined to `scratch/`
  - **Evidence**: No temp file outside `scratch/`; `git status` clean for out-of-scope paths
- [ ] CHK-091 [P1] Work ran in an isolated worktree, so no concurrent session's files were touched
  - **Evidence**: Worktree path recorded; `git status` in the main checkout unchanged across the run
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented in `decision-record.md`
  - **Evidence**: ADR-001..ADR-002 present with context, alternatives, and consequences
- [ ] CHK-101 [P1] Every ADR carries a terminal status
  - **Evidence**: No ADR remains `Proposed` at close
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
  - **Evidence**: Each ADR alternatives table names why the rejected option loses

- [ ] CHK-103 [P1] ADR-002 documents why a lower test count is a correction
  - **Evidence**: ADR-002 context and consequences
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Behavior and Regression Verification

- [ ] CHK-110 [P0] Whole suite delta reported, with Lane B's reduction separated from any regression
  - **Evidence**: Before/after per file, reduction attributed
- [ ] CHK-111 [P1] `render-contract-snapshot.cjs --check` exits 0 against the committed snapshot
  - **Evidence**: Recorded run
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Landing Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and rehearsed
  - **Evidence**: `plan.md` §7 and the L2 enhanced-rollback section; rehearsal recorded
- [ ] CHK-121 [P1] Completion metadata reconciled across spec/plan/tasks/implementation-summary
  - **Evidence**: No doc claims a completion state another doc contradicts
- [ ] CHK-122 [P0] Reconciled counts handed back to `021` with the sequencing outcome recorded
  - **Evidence**: Hand-back note with the new counts and digests
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [ ] CHK-130 [P1] No manual-testing-playbook or benchmark-profile fix embeds a credential, token, or absolute machine-local path
  - **Evidence**: Diff review of playbook and profile changes; only repo-relative paths present
- [ ] CHK-131 [P1] The `INPUT_VALIDATION` classification introduces no secret or credential-shaped value into script output
  - **Evidence**: Error payloads reviewed for leaked env or config values
- [ ] CHK-132 [P2] The severity calibration block (`spec.md` §2) is carried verbatim wherever this child's findings are cited elsewhere
  - **Evidence**: Grep confirms verbatim reuse where cited
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [ ] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are synchronized at close
  - **Evidence**: Cross-read confirms no doc claims a completion state another doc contradicts
- [ ] CHK-141 [P1] `decision-record.md` records ADR-001 and ADR-002 in terms `021` can cite for its re-reconciliation
  - **Evidence**: `decision-record.md` ADRs reviewed for citability by `021`
- [ ] CHK-142 [P2] The `021` hand-back note states the new per-file counts and digests with no dangling reference to the pre-de-duplication numbers
  - **Evidence**: Hand-back note reviewed after Phase 5 completes
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 23 | 0/23 |
| P1 Items | 22 | 0/22 |
| P2 Items | 2 | 0/2 |

**Verification Date**: not yet run
**Verified By**: not yet assigned
**Status**: Planned — no item may be marked `[x]` without a test name, a suite-content digest, and a candidate SHA.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| `021` owner | Bidirectional count-reconciliation sequencing decision | [ ] Approved | |
| Independent verifier | REQ-U04 adversarial pass over every invalid-input path | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
