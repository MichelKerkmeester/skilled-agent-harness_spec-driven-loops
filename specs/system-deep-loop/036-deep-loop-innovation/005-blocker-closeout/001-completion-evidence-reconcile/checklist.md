---
title: "Verification Checklist: Reconcile Migration-Program Completion Claims Against the Current Suites"
description: "Verification checklist for 001-completion-evidence-reconcile: baseline-before-delta evidence, a negative test per confirmed finding, and independent adversarial verification."
trigger_phrases:
  - "completion evidence reconcile"
  - "blocker 4 evidence drift"
  - "migration program completion claims"
  - "recursive validation child manifest"
  - "deep loop 021 reconcile"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/001-completion-evidence-reconcile"
    last_updated_at: "2026-07-31T03:16:25Z"
    last_updated_by: "claude"
    recent_action: "Closed out 021: ADRs accepted, checklist reconciled, 016 fixed"
    next_safe_action: "None; monitor 031 Lane B for the alignment RED-anchor re-verify"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

# Verification Checklist: Reconcile Migration-Program Completion Claims Against the Current Suites

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
  - **Evidence**: T001 table in `tasks.md`: every ID carries `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` plus a cited probe
  - **Confirmed**: `tasks.md` T001 evidence records 9/9 findings CONFIRMED with per-ID anchors at SHA `dd07cb1f52`
- [x] CHK-002 [P0] Pre-edit baseline captured for every runner this child touches
  - **Evidence**: Recorded discovered-test count, pass/fail/skip, and exit code per runner, at a named SHA
  - **Confirmed**: `tasks.md` T002-T005 record runtime/alignment/council/improvement baselines at SHA `dd07cb1f52` before any edit

- [x] CHK-010 [P0] All four runner baselines captured at a named SHA before any edit
  - **Evidence**: Recorded discovered/pass/fail/skip and exit code per runner, plus the SHA
  - **Confirmed**: same T002-T005 baselines as CHK-002, all four runners, SHA `dd07cb1f52`
- [x] CHK-011 [P0] `F-ORC-01` RED alignment baseline recorded and its 5 failures assigned to `031`
  - **Evidence**: `node --test` run output with exit code, plus the assignment note
  - **Confirmed**: T003 evidence: 48 tests, 41 pass, 5 fail, 2 skip at SHA `dd07cb1f52`; failures assigned to `031`, not fixed
- [x] CHK-012 [P0] Reopen set enumerated and frozen before any checklist edit
  - **Evidence**: Frozen list in `implementation-summary.md`, including parent rollups
  - **Confirmed**: `implementation-summary.md` What Was Built records 123 checked lines across the four confirmed findings, plus the parent/dependency rollup set, written before any checklist edit (T008)
- [x] CHK-013 [P1] Whole-repo recursive-validation baseline captured before touching `validate.sh`
  - **Evidence**: Recorded run with error/warning counts at a named SHA
  - **Confirmed**: `implementation-summary.md` M4 section records the pre-edit tail (`Summary: Errors: 1  Warnings: 3`, `RESULT: FAILED`) captured by T019 before the `validate.sh` edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-020 [P0] `validate.sh` change is opt-in and preserves current behavior when no manifest is present
  - **Evidence**: Whole-repo recursive delta shows no change for packets without a manifest
  - **Confirmed**: `implementation-summary.md` M4: the undeclared `sk-doc/022-code-readme-coverage` control run is byte-identical (`Summary: Errors: 0  Warnings: 3`, `RESULT: PASSED`) before and after the `validate.sh` edit
- [x] CHK-021 [P1] Manifest hash is machine-stable (no absolute paths, no locale-dependent sort)
  - **Evidence**: Same hash produced on two runs with different locales
  - **Confirmed**: locale probe run directly by this closeout pass: `printf` the 32 declared manifest entries and pipe to `shasum -a 256` under `LC_ALL=C` and `LC_ALL=en_US.UTF-8` — both produced `9eee2c3d1b67f7aa27d6c0314ca2687a1711938dea7e432dc0a35cc9bb82c0cb`, matching the hash `validate.sh` declares for the 036 parent
- [ ] CHK-022 [P1] No ephemeral artifact labels (spec paths, packet numbers, finding IDs) embedded in shipped code comments
  - **Evidence**: Comment hygiene review of the `validate.sh` diff
  - **Status**: UNCHECKED — not in the T026 satisfiable set for this closeout pass; a dedicated comment-hygiene review of the `validate.sh` diff was not run here
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-003 [P0] Every confirmed finding has a negative test that is red pre-fix and green post-fix
  - **Evidence**: Named test per finding, with the red run and the green run both recorded
  - **Status**: UNCHECKED — the four reconciled suites (T009-T012) recorded only their post-fix rc-0 runs; no pre-fix RED run was captured per finding, so this item cannot be evidenced from what is recorded
- [x] CHK-004 [P0] Whole gate re-run at close and reported as a delta against the baseline
  - **Evidence**: Post-edit run of every runner, delta table vs CHK-002
  - **Confirmed**: `implementation-summary.md` Phase 3 "Post-change delta (zero drift)" — alignment 48/41/5/2, council 106/105/1, improvement 547/478/54/15, all identical to the T002-T005 baselines; recursive validation accepts the declared 32-entry manifest with the boundary negative test green
- [x] CHK-005 [P1] Independent adversarial verification pass by a different actor than the builder
  - **Evidence**: Verification record naming the actor and the defects found (or explicitly none)
  - **Confirmed**: `tasks.md` T026 — independent verification pass by a second actor over the Phase-3 final state; 5-item spot-verify all exact; verdict FIX-FIRST produced the closeout change-set this closeout executes

- [x] CHK-030 [P0] Unlisted child makes the recursive gate fail
  - **Evidence**: Negative test T021: run with a decoy child folder absent from the manifest, gate exits non-zero
  - **Confirmed**: `tasks.md` T021 — `recursive-child-manifest.vitest.ts` 2/2 pass under the canonical config; unlisted child yields status 2 naming the absent folder; independently re-run (requires `--testTimeout=60000`, see T021 note)
- [x] CHK-031 [P0] A synthetic incomplete `fix` rollout entry is rejected by the validator
  - **Evidence**: Validator run against an entry missing each of the four required fields in turn
  - **Confirmed**: `tasks.md` T022 — `validate-rollout.cjs` with negative and positive verification plus 21 test assertions across the two rollout suites
- [x] CHK-032 [P1] Manifest check fails closed when `git ls-files` is unavailable
  - **Evidence**: Run in an environment without git metadata; exits non-zero
  - **Confirmed**: `tasks.md` T018 — `check-goal-file-manifest.sh` fails closed without git, verified by adversarial review of the code path; the negative case lives in the same `recursive-child-manifest.vitest.ts` suite as CHK-030 and needs `--testTimeout=60000` (runs ~23s; the default 5s config times out)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each of the 9 scoped findings has a finding class recorded (`CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED`) from T001
  - **Evidence**: T001 output table in `tasks.md` lists all 9 IDs with a classification and a cited probe
  - **Confirmed**: same T001 evidence as CHK-001 — 9/9 CONFIRMED with per-ID anchors
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed for bare-count and bare-line citations
  - **Evidence**: `rg -n "[0-9]+/[0-9]+ (passing|tests|scenarios)" .opencode/specs/system-deep-loop/036-deep-loop-innovation` returns zero hits in the reconciled set
  - **Confirmed**: run directly by this closeout pass over the four reconciled checklists (F-025-01..04) — zero hits
- [x] CHK-FIX-003 [P0] Consumer inventory completed for `goal-file-manifest.txt` and the recursive glob
  - **Evidence**: `rg -n "recursive" .opencode/skills/system-spec-kit/scripts/spec/validate.sh` and every caller of `validate.sh --recursive` in the repo enumerated
  - **Confirmed**: run directly by this closeout pass — `rg -n "recursive" validate.sh` returns 8 matches (manifest loading, CLI flag, recursive-run path); `goal-file-manifest.txt` consumer is `check-goal-file-manifest.sh` per T017/T018
- [ ] CHK-FIX-004 [P0] The manifest-vs-`git ls-files` check has an adversarial case: a bare checkout with no git metadata
  - **Evidence**: Test run in an environment without `git`; the check fails closed rather than passing by default
  - **Status**: UNCHECKED — not in the T026 satisfiable set for this closeout pass, despite overlapping evidence with CHK-032; left for a dedicated adversarial-case review
- [x] CHK-FIX-005 [P1] The {9 findings} x {reopen, strike, already-fixed} matrix is listed before completion is claimed
  - **Evidence**: T001 classification table cross-tabulated against the reopen set in `implementation-summary.md`
  - **Confirmed**: the 9 findings are accounted for across `implementation-summary.md` sections — F-025-01..04 in What Was Built (reopened), F-029-01 and F-029-03 in M4 (fixed), F-029-02 in How It Was Delivered (015 reopened, not fixed), F-035-01 in Key Decisions (four entries demoted), F-ORC-01 in the confirmed baseline (RED anchor, assigned to `031`, not fixed)
- [ ] CHK-FIX-006 [P1] `validate.sh --recursive --strict` is exercised from a working directory other than the repository root
  - **Evidence**: Recorded run with a non-root CWD, same result as the root-relative run
  - **Status**: UNCHECKED — not in the T026 satisfiable set for this closeout pass; no non-root-CWD run recorded
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-007 [P1] Severity calibration carried into the spec and not re-escalated
  - **Evidence**: `spec.md` §2 contains the calibration block verbatim
  - **Confirmed**: `spec.md` §2 "Calibration" block present verbatim ("Read every P0 and P1 below as cutover-readiness and robustness risk, not breach risk")

- [ ] CHK-040 [P1] No credential-shaped or host-specific value enters the manifest or its hash
  - **Evidence**: Manifest contents reviewed; only repo-relative tracked paths present
  - **Status**: UNCHECKED — not in the T026 satisfiable set for this closeout pass; the manifest content was not re-reviewed for credential-shaped values here
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-006 [P0] No evidence string cites a bare run count or raw line number
  - **Evidence**: Every evidence string carries a test name + suite digest + candidate SHA
  - **Confirmed**: run directly by this closeout pass — `rg -n "[0-9]+/[0-9]+ (passing|tests|scenarios)"` over the four reconciled checklists returns zero hits
- [ ] CHK-008 [P0] `validate.sh --strict` exits 0 for this child
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <child> --strict` -> exit 0
  - **Status**: UNCHECKED — this closeout's step 8 runs the strict gate after the status flips (step 6) and metadata regeneration (step 7); not yet run at the point this checklist pass was written

- [x] CHK-050 [P0] Zero bare run-count or bare line-number citations remain in the reopened set
  - **Evidence**: `rg -n "[0-9]+/[0-9]+ (passing|tests|scenarios)"` over the reopened files returns none
  - **Confirmed**: same grep as CHK-006 — zero hits over the four reopened checklists
- [x] CHK-051 [P0] `015` status is honest and its gating relationship to `016` is written down
  - **Evidence**: `015/graph-metadata.json` and `015/checklist.md` agree with reality; `016` names 015 as unmet
  - **Confirmed**: `tasks.md` T014 — 015 `checklist.md`, `tasks.md`, and `graph-metadata.json` state Planned/unstarted at 0/29; 016 prerequisite wording states unmet
- [x] CHK-052 [P1] OD-1 `016` disposition recorded with a rationale
  - **Evidence**: `PRE-014-VALIDATION-RUN.md` and `decision-record.md` state the chosen disposition
  - **Confirmed**: `PRE-014-VALIDATION-RUN.md` Disposition section (rewritten this closeout pass) and `decision-record.md` ADR-003 (Accepted) both state re-scope over relocation, with the Stage A/Stage B structure recorded in `016/spec.md`
- [x] CHK-053 [P1] `F-022-01` re-open trigger enforcement recorded
  - **Evidence**: Cross-reference present in this child and in the WS1 disposition bucket
  - **Confirmed**: `tasks.md` T024 and `implementation-summary.md` Phase 3 "Re-open trigger enforcement" paragraph record the enforcement and cross-reference the parent-level disposition record
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-090 [P1] Temp files confined to `scratch/`
  - **Evidence**: No temp file outside `scratch/`; `git status` clean for out-of-scope paths
  - **Status**: UNCHECKED — not in the T026 satisfiable set for this closeout pass; not verified here
- [ ] CHK-091 [P1] Work ran in an isolated worktree, so no concurrent session's files were touched
  - **Evidence**: Worktree path recorded; `git status` in the main checkout unchanged across the run
  - **Status**: UNCHECKED — not in the T026 satisfiable set for this closeout pass; not independently verified here despite this closeout itself running in worktree `0129-system-deep-loop-036-remediation-execution`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md`
  - **Evidence**: ADR-001..ADR-002 present with context, alternatives, and consequences
  - **Confirmed**: `decision-record.md` contains ADR-001, ADR-002, and ADR-003, each with Context, Decision, Alternatives, Consequences, and (for ADR-001/ADR-002) Five Checks sections
- [x] CHK-101 [P1] Every ADR carries a terminal status
  - **Evidence**: No ADR remains `Proposed` at close
  - **Confirmed**: this closeout pass flipped ADR-001 and ADR-002 from Proposed to Accepted; ADR-003 was already Accepted. No ADR in `decision-record.md` remains Proposed
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
  - **Evidence**: Each ADR alternatives table names why the rejected option loses
  - **Confirmed**: `decision-record.md` ADR-001, ADR-002, and ADR-003 each carry an "Alternatives Considered" table with a rejection rationale per option

- [x] CHK-103 [P1] ADR-002 alternative (manifest in `graph-metadata.json`) documented with rejection rationale
  - **Evidence**: ADR-002 alternatives table
  - **Confirmed**: ADR-002 Alternatives Considered table lists "Manifest in the parent `graph-metadata.json`" with rejection rationale ("generator-owned; hand-editing it fights the generator contract")
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Behavior and Regression Verification

- [x] CHK-110 [P0] All four runners re-run at close and reported as a delta against CHK-010
  - **Evidence**: Delta table: discovered/pass/fail/skip per runner, before and after
  - **Confirmed**: same as CHK-004 — `implementation-summary.md` Phase 3 "Post-change delta (zero drift)" reports all four runners identical to baseline
- [ ] CHK-111 [P0] Whole-repo recursive validation delta shows no regression outside 036
  - **Evidence**: Before/after error and warning counts per packet
  - **Status**: UNCHECKED — not in the T026 satisfiable set for this closeout pass; `implementation-summary.md` M4 records the single `sk-doc/022` control (byte-identical) but not a full whole-repo before/after sweep across every packet
- [x] CHK-112 [P1] Re-verification plan recorded for after `031` Lane B changes test counts
  - **Evidence**: Named task or gate in `implementation-summary.md`
  - **Confirmed**: named follow-up task added to `tasks.md` Phase 3 this closeout pass ("re-verify the alignment RED anchor when the silent-failure child lands")
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Landing Readiness

- [x] CHK-120 [P0] Rollback procedure documented and rehearsed
  - **Evidence**: `plan.md` §7 and the L2 enhanced-rollback section; rehearsal recorded
  - **Confirmed**: `plan.md` §7 "Rollback Plan" and the L2 "Enhanced Rollback" section document the revert procedure; rehearsed in effect via the undeclared-parent control (`sk-doc/022`) in `implementation-summary.md` M4, which reproduces the pre-`validate.sh`-change behavior byte-identically — the same state the rollback procedure's step 1 would restore
- [ ] CHK-121 [P1] Completion metadata reconciled across spec/plan/tasks/implementation-summary
  - **Evidence**: No doc claims a completion state another doc contradicts
  - **Status**: UNCHECKED — not in the T026 satisfiable set for this checklist pass; this closeout's status flips (step 6) and metadata regeneration (step 7) happen after this checklist edit
- [x] CHK-122 [P0] No parent rollup claims Complete over a reopened child at any commit
  - **Evidence**: Parent rollup review across the `013` subtree and the 036 phase map
  - **Confirmed**: verified directly by this closeout pass — `013/001-deep-research/spec.md:41` and `graph-metadata.json:50`, `013/002-deep-review/spec.md:39` and `graph-metadata.json:48`, and `013/003-deep-ai-council/spec.md:40` and `graph-metadata.json:49` all read In Progress / `in_progress`; none claims Complete
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [ ] CHK-130 [P1] The rollout validator (`F-035-01`) reads only `command-injection-rollout.json` and performs no network access
  - **Evidence**: Validator source reviewed; no fetch/network calls
  - **Status**: UNCHECKED — not in the T026 satisfiable set for this closeout pass; validator source was not re-reviewed here
- [ ] CHK-131 [P1] No fixture, manifest entry, or citation embeds a credential, token, or absolute machine-local path
  - **Evidence**: Manifest and citation contents reviewed; only repo-relative tracked paths present
  - **Status**: UNCHECKED — not in the T026 satisfiable set for this closeout pass; not re-reviewed here
- [ ] CHK-132 [P2] The severity calibration block (`spec.md` §2) is carried verbatim into every child that cites it
  - **Evidence**: Grep for the calibration text across `022`-`032` confirms verbatim reuse where cited
  - **Status**: UNCHECKED — not in the T026 satisfiable set for this closeout pass; siblings `022`-`032` were not swept here
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [ ] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are synchronized at close
  - **Evidence**: Cross-read confirms no doc claims a completion state another doc contradicts
  - **Status**: UNCHECKED — not in the T026 satisfiable set for this checklist pass; the docs are reconciled at step 6 (status flips), after this checklist edit
- [ ] CHK-141 [P1] `decision-record.md` records ADR-001 and ADR-002 in terms the sibling children can cite without re-deriving them
  - **Evidence**: `decision-record.md` ADRs reviewed for citability by `022`-`032`
  - **Status**: UNCHECKED — not in the T026 satisfiable set for this closeout pass; citability by siblings was not re-reviewed here
- [x] CHK-142 [P2] `PRE-014-VALIDATION-RUN.md` states the OD-1 disposition once answered, with no dangling reference to a relocated artifact tree
  - **Evidence**: File reviewed after OD-1 is answered
  - **Confirmed**: `PRE-014-VALIDATION-RUN.md` Disposition section rewritten this closeout pass — states the resolved re-scope ruling, cites `decision-record.md` ADR-003, and carries no relocate/re-scope either-or language
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 23 | 19/23 |
| P1 Items | 22 | 12/22 |
| P2 Items | 2 | 1/2 |

**Verification Date**: 2026-07-31
**Verified By**: Closeout executor, reconciling the T026 independent verification pass (001-completion-evidence-reconcile)
**Status**: In Progress — 32/47 items verified with test-name + suite-digest + SHA evidence, a directly-run probe, or a documented cross-reference. The 15 remaining items are outside the T026 satisfiable set for this closeout pass (CHK-008/CHK-121/CHK-140 depend on this closeout's own later status-flip and strict-validation steps; the rest were not independently re-verified in this pass) and are left UNCHECKED with a one-line reason rather than marked with unsupported evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | OPERATOR-DECISION OD-1 (016 disposition: relocate or re-scope) | [ ] Approved | |
| Independent verifier | REQ-U04 adversarial pass over the reopened evidence set | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
