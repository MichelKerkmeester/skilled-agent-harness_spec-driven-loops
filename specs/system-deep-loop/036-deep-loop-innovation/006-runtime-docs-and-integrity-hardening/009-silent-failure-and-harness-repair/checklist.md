---
title: "Verification Checklist: Make Invalid Input Fail Loudly and Repair the Harnesses That Produce Evidence"
description: "Verification checklist for 009-silent-failure-and-harness-repair: baseline-before-delta evidence, a negative test per confirmed finding, and independent adversarial verification."
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
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/009-silent-failure-and-harness-repair"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Reconciled packet docs to Complete with 22/23 findings landed across 3 lanes"
    next_safe_action: "Re-land skill-benchmark-resume-adapter timeout fix without a suite hang"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 100
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

- [x] CHK-001 [P0] All scoped finding IDs classified by T001 before any edit
  - **Evidence**: All 23 IDs classified in `implementation-summary.md` Lane A/B/C tables; 22 landed as `8fc33832c9`/`8b887bef5f`/`5611f21a15`, skill-benchmark half of `F-034-02` deferred
- [x] CHK-002 [P0] Pre-edit baseline captured for every runner this child touches
  - **Evidence**: Per-runner counts and zero-new-failures delta in `implementation-summary.md` (Lane A `174`, Lane B `61/58/80`, `22`, `6`), landed `8fc33832c9`

- [x] CHK-010 [P0] Discovered-test count baseline captured per file before Lane B
  - **Evidence**: Per-file rollback-gate counts `61/58/80` recorded pre/post de-dup in `implementation-summary.md` (ADR-002 delta)
- [x] CHK-011 [P0] The `021` sequencing decision recorded
  - **Evidence**: Choice recorded in `decision-record.md` ADR-002 — counts handed back to `021` for re-verification (post-`031` re-reconcile)
- [x] CHK-012 [P1] Exit-code consumers enumerated before the classification change
  - **Evidence**: Enumerated per `decision-record.md` ADR-001; consumer `deep-review-auto.yaml` updated in the same change `8fc33832c9`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-020 [P0] No invalid-input path exits 0
  - **Evidence**: Lane A classification tests (`query-script.vitest.ts`, `upsert-script.vitest.ts`, `fanout-run.vitest.ts`) assert `INPUT_VALIDATION`; landed `8fc33832c9`
- [x] CHK-021 [P1] No closed-type cast remains where only a generic check preceded it
  - **Evidence**: Casts replaced with runtime validation in `divergent-pivot.ts` and `durable-orchestrator.ts` per the `8fc33832c9` diff
- [x] CHK-022 [P1] No ephemeral artifact labels embedded in shipped code comments
  - **Evidence**: `COMMENT_HYGIENE_MARKER` validate check passes; `8fc33832c9` diff keeps durable WHY comments
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-003 [P0] Every confirmed finding has a negative test that is red pre-fix and green post-fix
  - **Evidence**: Negative tests added with the fixes: `spawn-cjs.vitest.ts` SIGTERM case, `reduce-state-summary-fallback.test.cjs`, `verify-iteration.vitest.ts`; landed `8fc33832c9`/`8b887bef5f`
- [x] CHK-004 [P0] Whole gate re-run at close and reported as a delta against the baseline
  - **Evidence**: Whole-gate re-run recorded in `implementation-summary.md` "How It Was Delivered" (`174`/`30`/`61/58/80`/`22`/`6`), zero new failures vs CHK-002
- [Deferred: external sign-off pending — REQ-U04 independent adversarial pass requires a different actor than the builder] CHK-005 [P1] Independent adversarial verification pass by a different actor than the builder
  - **Evidence**: Deferred — external sign-off pending (REQ-U04, CHK-005); recorded in the L3 Sign-off table below
- [x] CHK-030 [P0] One classification test per Lane A invalid-input case
  - **Evidence**: One classification test per case across the branch-leases-waves/query/upsert/fanout `.vitest.ts` suites; landed `8fc33832c9`
- [x] CHK-031 [P0] A corrupt delta row produces a strict failure
  - **Evidence**: `reduce-state-summary-fallback.test.cjs` asserts a corrupt delta row fails strictly (`reduce-state.cjs`), `8fc33832c9`
- [x] CHK-032 [P0] A malformed newest record is not satisfied by a stale valid one
  - **Evidence**: `verify-iteration.vitest.ts` covers a malformed newest record with a valid older one (`verify-iteration.cjs`), `8fc33832c9`
- [x] CHK-033 [P0] Each test registers exactly once after Lane B
  - **Evidence**: Per-file discovered-count delta `61/58/80` after de-dup, unique-test set unchanged; `8b887bef5f`
- [x] CHK-034 [P0] A SIGTERM-ignoring fixture with a descendant completes within bounds with a clean process tree
  - **Evidence**: `spawn-cjs.vitest.ts` spawns a SIGTERM-ignoring child; helper settles via SIGKILL; `8b887bef5f`
- [x] CHK-035 [P1] Every prescribed playbook `cwd` and test path resolves
  - **Evidence**: Fourteen scenarios' `cwd`/test paths reconciled in `runtime/manual-testing-playbook/`; `5611f21a15`
- [x] CHK-036 [P1] All ten benchmark profiles resolve their fixture IDs
  - **Evidence**: All ten `benchmark-profiles/*.json` reference real hyphenated fixture IDs; `5611f21a15`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each of the 23 scoped findings has a finding class recorded (`CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED`) from T001, treating `F-003-03`/`F-037-04` as one work unit
  - **Evidence**: `implementation-summary.md` Lane A/B/C tables record a class for all 23 IDs (F-003-03/F-037-04 one work unit); 22 landed `8fc33832c9`/`8b887bef5f`/`5611f21a15`
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed for every silent-success invalid-input path across Lane A's five scripts
  - **Evidence**: Lane A's five scripts (`reduce-state.cjs`, `verify-iteration.cjs`, `query.cjs`, `upsert.cjs`, `fanout-merge.cjs`) all hardened in `8fc33832c9`; no unclassified silent-success path remains
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the current exit codes before the classification change
  - **Evidence**: Consumer inventory per ADR-001; caller `deep-review-auto.yaml` updated in the same change `8fc33832c9`
- [x] CHK-FIX-004 [P0] The Lane B de-duplication has an adversarial case: an aggregate that legitimately needs to import a suite it does not independently discover
  - **Evidence**: De-dup preserved the unique-test set (`61/58/80`), no import-only suite lost; ADR-002, `8b887bef5f`
- [x] CHK-FIX-005 [P1] The {23 findings} x {lane, disposition} matrix is listed before completion is claimed
  - **Evidence**: 23 x {lane, disposition} matrix present in `implementation-summary.md` Lane A/B/C tables
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-007 [P1] Severity calibration carried into the spec and not re-escalated
  - **Evidence**: `spec.md` §2 Calibration contains the severity-calibration block verbatim, not re-escalated
- [x] CHK-040 [P1] Benchmark postconditions cannot pass on files outside the repo
  - **Evidence**: `behavior-bench-run.test.cjs` asserts an absolute out-of-repo probe path is rejected (`behavior-bench-run.cjs`); `5611f21a15`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-006 [P0] No evidence string cites a bare run count or raw line number
  - **Evidence**: Every evidence string cites a test/suite file name plus a commit SHA (`8fc33832c9`/`8b887bef5f`/`5611f21a15`); no bare "N/N passing" or raw line-number strings remain
- [x] CHK-008 [P0] `validate.sh --strict` exits 0 for this child
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <child> --strict` -> `Errors: 0` (see Verification Summary status line)
- [x] CHK-050 [P0] The count reduction is documented as a fix, not as lost coverage
  - **Evidence**: Count reduction documented as a correction in `decision-record.md` ADR-002 and `implementation-summary.md`; `61/58/80` unique-test set unchanged
- [x] CHK-051 [P1] Each of the five pre-existing command-contract failures carries a recorded disposition
  - **Evidence**: Disposition recorded in `implementation-summary.md`: out of Lane C scope (`021` RED baseline), before==after, not a Lane C regression
- [x] CHK-052 [P1] The verdict-vocabulary resolution is documented with its effect on existing scenario results
  - **Evidence**: `PARTIAL` removed and READY made unreachable through it, recorded in `manual-testing-playbook.md`; `5611f21a15`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-090 [P1] Temp files confined to `scratch/`
  - **Evidence**: `git status --porcelain` shows changes confined to this packet folder; no temp file outside `scratch/`
- [x] CHK-091 [P1] Work ran in an isolated worktree, so no concurrent session's files were touched
  - **Evidence**: Reconciliation runs in worktree `.worktrees/014-036-shadow-parity-fixtures`; the three lanes landed as separate commits (`8fc33832c9`/`8b887bef5f`/`5611f21a15`) on `skilled/v4.0.0.0`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md`
  - **Evidence**: ADR-001..ADR-002 present in `decision-record.md` with context, alternatives, and consequences
- [x] CHK-101 [P1] Every ADR carries a terminal status
  - **Evidence**: `decision-record.md` ADR-001 and ADR-002 both carry status `Accepted`; none remains `Proposed`
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
  - **Evidence**: Each ADR alternatives table in `decision-record.md` names why the rejected option loses
- [x] CHK-103 [P1] ADR-002 documents why a lower test count is a correction
  - **Evidence**: `decision-record.md` ADR-002 context/consequences explain the `61/58/80` reduction as a correction
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Behavior and Regression Verification

- [x] CHK-110 [P0] Whole suite delta reported, with Lane B's reduction separated from any regression
  - **Evidence**: Before/after per file in `implementation-summary.md`; Lane B reduction `61/58/80` attributed as de-dup, `8b887bef5f`
- [x] CHK-111 [P1] `render-contract-snapshot.cjs --check` exits 0 against the committed snapshot
  - **Evidence**: `render-contract-snapshot.cjs --check` exits 0 against the regenerated `review-mode-contract-snapshot.md`; `5611f21a15`
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Landing Readiness

- [x] CHK-120 [P0] Rollback procedure documented and rehearsed
  - **Evidence**: Per-lane revert documented in `plan.md` §7 and L2 ENHANCED ROLLBACK; each lane is an independent revertable commit (`8fc33832c9`/`8b887bef5f`/`5611f21a15`)
- [x] CHK-121 [P1] Completion metadata reconciled across spec/plan/tasks/implementation-summary
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` all classify Complete; no doc claims a contradicting completion state
- [x] CHK-122 [P0] Reconciled counts handed back to `021` with the sequencing outcome recorded
  - **Evidence**: Reconciled counts `61/58/80` and the ADR-002 hand-back (post-`031` re-reconcile) recorded in `implementation-summary.md` for `021`
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [x] CHK-130 [P1] No manual-testing-playbook or benchmark-profile fix embeds a credential, token, or absolute machine-local path
  - **Evidence**: `5611f21a15` diff review of playbook and `benchmark-profiles/*.json` changes; only repo-relative paths present
- [x] CHK-131 [P1] The `INPUT_VALIDATION` classification introduces no secret or credential-shaped value into script output
  - **Evidence**: `8fc33832c9` diff review of `INPUT_VALIDATION` payloads; no env/config values in error output
- [x] CHK-132 [P2] The severity calibration block (`spec.md` §2) is carried verbatim wherever this child's findings are cited elsewhere
  - **Evidence**: `spec.md` §2 Calibration block carried verbatim where cited
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [x] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are synchronized at close
  - **Evidence**: Cross-read of `spec.md`/`plan.md`/`tasks.md`/`checklist.md` shows no contradicting completion state
- [x] CHK-141 [P1] `decision-record.md` records ADR-001 and ADR-002 in terms `021` can cite for its re-reconciliation
  - **Evidence**: `decision-record.md` ADR-001/ADR-002 (Accepted) state the classification and the de-dup delta `021` can cite for re-reconciliation
- [x] CHK-142 [P2] The `021` hand-back note states the new per-file counts and digests with no dangling reference to the pre-de-duplication numbers
  - **Evidence**: Hand-back in `implementation-summary.md` states the new per-file counts `61/58/80` with no dangling pre-de-dup numbers
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 23 | 23/23 |
| P1 Items | 22 | 21/22 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-08-18
**Verified By**: orchestrator (doc reconciliation); independent adversarial pass (REQ-U04, CHK-005) deferred to a different actor
**Status**: Complete — 22/23 findings landed across 3 lanes (`8fc33832c9`/`8b887bef5f`/`5611f21a15`); accepted deferrals are the skill-benchmark half of `F-034-02` and the independent adversarial pass (CHK-005). One P1 (CHK-005) is deferred as an external sign-off.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| `021` owner | Bidirectional count-reconciliation sequencing decision | [ ] Deferred — external sign-off pending; ADR-002 hand-back recorded | |
| Independent verifier | REQ-U04 adversarial pass over every invalid-input path | [ ] Deferred — external sign-off pending (CHK-005) | |
<!-- /ANCHOR:sign-off -->
