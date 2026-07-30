---
title: "Verification Checklist: Reconcile Migration-Program Completion Claims Against the Current Suites"
description: "Verification checklist for 021-completion-evidence-reconcile: baseline-before-delta evidence, a negative test per confirmed finding, and independent adversarial verification."
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
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/021-completion-evidence-reconcile"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the verification checklist from the WS1 phase-tree proposal"
    next_safe_action: "Run checklist items after phase execution completes"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 0
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

- [ ] CHK-001 [P0] All scoped finding IDs classified by T001 before any edit
  - **Evidence**: T001 table in `tasks.md`: every ID carries `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` plus a cited probe
- [ ] CHK-002 [P0] Pre-edit baseline captured for every runner this child touches
  - **Evidence**: Recorded discovered-test count, pass/fail/skip, and exit code per runner, at a named SHA

- [ ] CHK-010 [P0] All four runner baselines captured at a named SHA before any edit
  - **Evidence**: Recorded discovered/pass/fail/skip and exit code per runner, plus the SHA
- [ ] CHK-011 [P0] `F-ORC-01` RED alignment baseline recorded and its 5 failures assigned to `031`
  - **Evidence**: `node --test` run output with exit code, plus the assignment note
- [ ] CHK-012 [P0] Reopen set enumerated and frozen before any checklist edit
  - **Evidence**: Frozen list in `implementation-summary.md`, including parent rollups
- [ ] CHK-013 [P1] Whole-repo recursive-validation baseline captured before touching `validate.sh`
  - **Evidence**: Recorded run with error/warning counts at a named SHA
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-020 [P0] `validate.sh` change is opt-in and preserves current behavior when no manifest is present
  - **Evidence**: Whole-repo recursive delta shows no change for packets without a manifest
- [ ] CHK-021 [P1] Manifest hash is machine-stable (no absolute paths, no locale-dependent sort)
  - **Evidence**: Same hash produced on two runs with different locales
- [ ] CHK-022 [P1] No ephemeral artifact labels (spec paths, packet numbers, finding IDs) embedded in shipped code comments
  - **Evidence**: Comment hygiene review of the `validate.sh` diff
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

- [ ] CHK-030 [P0] Unlisted child makes the recursive gate fail
  - **Evidence**: Negative test T021: run with a decoy child folder absent from the manifest, gate exits non-zero
- [ ] CHK-031 [P0] A synthetic incomplete `fix` rollout entry is rejected by the validator
  - **Evidence**: Validator run against an entry missing each of the four required fields in turn
- [ ] CHK-032 [P1] Manifest check fails closed when `git ls-files` is unavailable
  - **Evidence**: Run in an environment without git metadata; exits non-zero
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each of the 9 scoped findings has a finding class recorded (`CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED`) from T001
  - **Evidence**: T001 output table in `tasks.md` lists all 9 IDs with a classification and a cited probe
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed for bare-count and bare-line citations
  - **Evidence**: `rg -n "[0-9]+/[0-9]+ (passing|tests|scenarios)" .opencode/specs/system-deep-loop/036-deep-loop-innovation` returns zero hits in the reconciled set
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for `goal-file-manifest.txt` and the recursive glob
  - **Evidence**: `rg -n "recursive" .opencode/skills/system-spec-kit/scripts/spec/validate.sh` and every caller of `validate.sh --recursive` in the repo enumerated
- [ ] CHK-FIX-004 [P0] The manifest-vs-`git ls-files` check has an adversarial case: a bare checkout with no git metadata
  - **Evidence**: Test run in an environment without `git`; the check fails closed rather than passing by default
- [ ] CHK-FIX-005 [P1] The {9 findings} x {reopen, strike, already-fixed} matrix is listed before completion is claimed
  - **Evidence**: T001 classification table cross-tabulated against the reopen set in `implementation-summary.md`
- [ ] CHK-FIX-006 [P1] `validate.sh --recursive --strict` is exercised from a working directory other than the repository root
  - **Evidence**: Recorded run with a non-root CWD, same result as the root-relative run
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-007 [P1] Severity calibration carried into the spec and not re-escalated
  - **Evidence**: `spec.md` §2 contains the calibration block verbatim

- [ ] CHK-040 [P1] No credential-shaped or host-specific value enters the manifest or its hash
  - **Evidence**: Manifest contents reviewed; only repo-relative tracked paths present
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-006 [P0] No evidence string cites a bare run count or raw line number
  - **Evidence**: Every evidence string carries a test name + suite digest + candidate SHA
- [ ] CHK-008 [P0] `validate.sh --strict` exits 0 for this child
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <child> --strict` -> exit 0

- [ ] CHK-050 [P0] Zero bare run-count or bare line-number citations remain in the reopened set
  - **Evidence**: `rg -n "[0-9]+/[0-9]+ (passing|tests|scenarios)"` over the reopened files returns none
- [ ] CHK-051 [P0] `015` status is honest and its gating relationship to `016` is written down
  - **Evidence**: `015/graph-metadata.json` and `015/checklist.md` agree with reality; `016` names 015 as unmet
- [ ] CHK-052 [P1] OD-1 `016` disposition recorded with a rationale
  - **Evidence**: `PRE-014-VALIDATION-RUN.md` and `decision-record.md` state the chosen disposition
- [ ] CHK-053 [P1] `F-022-01` re-open trigger enforcement recorded
  - **Evidence**: Cross-reference present in this child and in the WS1 disposition bucket
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

- [ ] CHK-103 [P1] ADR-002 alternative (manifest in `graph-metadata.json`) documented with rejection rationale
  - **Evidence**: ADR-002 alternatives table
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Behavior and Regression Verification

- [ ] CHK-110 [P0] All four runners re-run at close and reported as a delta against CHK-010
  - **Evidence**: Delta table: discovered/pass/fail/skip per runner, before and after
- [ ] CHK-111 [P0] Whole-repo recursive validation delta shows no regression outside 036
  - **Evidence**: Before/after error and warning counts per packet
- [ ] CHK-112 [P1] Re-verification plan recorded for after `031` Lane B changes test counts
  - **Evidence**: Named task or gate in `implementation-summary.md`
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Landing Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and rehearsed
  - **Evidence**: `plan.md` §7 and the L2 enhanced-rollback section; rehearsal recorded
- [ ] CHK-121 [P1] Completion metadata reconciled across spec/plan/tasks/implementation-summary
  - **Evidence**: No doc claims a completion state another doc contradicts
- [ ] CHK-122 [P0] No parent rollup claims Complete over a reopened child at any commit
  - **Evidence**: Parent rollup review across the `013` subtree and the 036 phase map
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [ ] CHK-130 [P1] The rollout validator (`F-035-01`) reads only `command-injection-rollout.json` and performs no network access
  - **Evidence**: Validator source reviewed; no fetch/network calls
- [ ] CHK-131 [P1] No fixture, manifest entry, or citation embeds a credential, token, or absolute machine-local path
  - **Evidence**: Manifest and citation contents reviewed; only repo-relative tracked paths present
- [ ] CHK-132 [P2] The severity calibration block (`spec.md` §2) is carried verbatim into every child that cites it
  - **Evidence**: Grep for the calibration text across `022`-`032` confirms verbatim reuse where cited
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [ ] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are synchronized at close
  - **Evidence**: Cross-read confirms no doc claims a completion state another doc contradicts
- [ ] CHK-141 [P1] `decision-record.md` records ADR-001 and ADR-002 in terms the sibling children can cite without re-deriving them
  - **Evidence**: `decision-record.md` ADRs reviewed for citability by `022`-`032`
- [ ] CHK-142 [P2] `PRE-014-VALIDATION-RUN.md` states the OD-1 disposition once answered, with no dangling reference to a relocated artifact tree
  - **Evidence**: File reviewed after OD-1 is answered
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
| Operator | OPERATOR-DECISION OD-1 (016 disposition: relocate or re-scope) | [ ] Approved | |
| Independent verifier | REQ-U04 adversarial pass over the reopened evidence set | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
