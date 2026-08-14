---
title: "Verification Checklist: Rebuild Shadow Parity So Both Sides Derive Independently"
description: "Verification checklist for 002-shadow-parity-independent-derivation: baseline-before-delta evidence, a negative test per confirmed finding, and independent adversarial verification."
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
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-shadow-parity-independent-derivation"
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

# Verification Checklist: Rebuild Shadow Parity So Both Sides Derive Independently

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

- [ ] CHK-010 [P0] Six protected semantic surfaces enumerated and reviewed before comparator code exists
  - **Evidence**: Reviewed surface lists per mode, derived from mode contracts and projection types
- [ ] CHK-011 [P0] Pre-fix divergence-injection runs recorded as PASSING
  - **Evidence**: Six recorded runs against the pre-fix adapters at a named SHA
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-020 [P0] No adapter returns a legacy-derived value as the ledger side
  - **Evidence**: Grep plus a test asserting the ledger side is object-identical to `folded.projection`
- [ ] CHK-021 [P0] No oracle transitively imports the reducer fold
  - **Evidence**: Import-graph assertion (NFR-I01) green
- [ ] CHK-022 [P1] One comparator implementation; the partial oracle is absorbed rather than duplicated
  - **Evidence**: Grep for `assertLegacyProjectionMatchesCurrentState` returns only the absorbed call site
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

- [ ] CHK-030 [P0] Six divergence injections proven: PASS pre-fix, FAIL post-fix
  - **Evidence**: Both runs recorded per mode with test names and SHAs
- [ ] CHK-031 [P0] Reducer exception produces a parity failure in every mode
  - **Evidence**: Six named tests; deep-review case explicitly inverts `F-012-04`
- [ ] CHK-032 [P1] Every element of each protected surface has a divergence test
  - **Evidence**: Surface-to-test mapping table with no unmapped element
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each of the 6 scoped findings has a finding class recorded (`CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED`) from T001
  - **Evidence**: T001 output table in `tasks.md` lists all 6 IDs with a classification and a cited probe
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed for every adapter that discards the folded reducer projection
  - **Evidence**: `rg -n "legacyProjection|folded\.projection" .opencode/skills/system-deep-loop/runtime/lib/*-shadow-parity/harness-adapter.ts` enumerated; each hit resolved to a rebuilt adapter or a rationale
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for `assertLegacyProjectionMatchesCurrentState` before it is absorbed
  - **Evidence**: `rg -n "assertLegacyProjectionMatchesCurrentState" .opencode/skills/system-deep-loop/runtime` enumerates every call site; each one verified against the wrapper's preserved contract
- [ ] CHK-FIX-004 [P0] The rebuilt harness has an adversarial case beyond the six divergence injections: an empty event log and a reducer that throws mid-fold
  - **Evidence**: Test run per mode showing the empty-log case reports PASS (not a vacuous skip) and the mid-fold throw reports FAIL
- [ ] CHK-FIX-005 [P1] The {6 findings} x {council, alignment, agent-improvement, model-benchmark, skill-benchmark, deep-review} matrix is listed before completion is claimed
  - **Evidence**: T001 classification table cross-tabulated against the per-mode rebuild status in `implementation-summary.md`
- [ ] CHK-FIX-006 [P1] Every oracle module is checked for a transitive import into the reducer fold, not only the six modules named in the scope table
  - **Evidence**: Import-graph assertion (NFR-I01) run against all six oracle modules, recorded pass/fail per module
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-007 [P1] Severity calibration carried into the spec and not re-escalated
  - **Evidence**: `spec.md` §2 contains the calibration block verbatim

- [ ] CHK-040 [P1] No fixture embeds a real credential or host-specific path
  - **Evidence**: Fixture review; only synthetic identifiers present
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-006 [P0] No evidence string cites a bare run count or raw line number
  - **Evidence**: Every evidence string carries a test name + suite digest + candidate SHA
- [ ] CHK-008 [P0] `validate.sh --strict` exits 0 for this child
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <child> --strict` -> exit 0

- [ ] CHK-050 [P1] Per-mode surface lists documented so a later reader can extend them
  - **Evidence**: Surface lists recorded in the child, not only in code
- [ ] CHK-051 [P1] Newly surfaced genuine divergences recorded as findings against the owning mode
  - **Evidence**: Finding list with owner per divergence, or an explicit "none surfaced" statement
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

- [ ] CHK-103 [P1] ADR-002 alternative (per-mode local oracles) documented with rejection rationale
  - **Evidence**: ADR-002 alternatives table
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Behavior and Regression Verification

- [ ] CHK-110 [P0] Whole `runtime` suite re-run and reported as a delta against the `021` baseline
  - **Evidence**: Before/after discovered, pass, fail, skip, exit code
- [ ] CHK-111 [P1] Newly failing tests classified as surfaced divergences or regressions, never merged into one number
  - **Evidence**: Classification table in `implementation-summary.md`
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Landing Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and rehearsed
  - **Evidence**: `plan.md` §7 and the L2 enhanced-rollback section; rehearsal recorded
- [ ] CHK-121 [P1] Completion metadata reconciled across spec/plan/tasks/implementation-summary
  - **Evidence**: No doc claims a completion state another doc contradicts
- [ ] CHK-122 [P0] Blocker 1 discharge recorded in the `014` unblock table with per-mode evidence
  - **Evidence**: Per-mode divergence-injection citation in the unblock record
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [ ] CHK-130 [P1] No oracle or comparator module makes a network call or reads outside the input event log
  - **Evidence**: Oracle and comparator source reviewed; no fetch/network calls
- [ ] CHK-131 [P1] No fixture, surface list, or divergence-injection test embeds a credential, token, or absolute machine-local path
  - **Evidence**: Fixture and surface-list review; only synthetic identifiers and repo-relative paths present
- [ ] CHK-132 [P2] The severity calibration block (`spec.md` §2) is carried verbatim wherever this child's findings are cited by a sibling child
  - **Evidence**: Grep for the calibration text across `021`, `023`-`032` confirms verbatim reuse where cited
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [ ] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are synchronized at close
  - **Evidence**: Cross-read confirms no doc claims a completion state another doc contradicts
- [ ] CHK-141 [P1] `decision-record.md` records ADR-001 and ADR-002 in terms the sibling children can cite without re-deriving them
  - **Evidence**: `decision-record.md` ADRs reviewed for citability by `023`-`032`
- [ ] CHK-142 [P2] Per-mode surface lists are documented in the child, not only encoded in comparator test fixtures
  - **Evidence**: Surface lists reviewable from `implementation-summary.md` alone, without reading the fixture source
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 20 | 0/20 |
| P1 Items | 20 | 0/20 |
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
| Independent verifier | REQ-U04 adversarial pass over oracle independence for all six modes | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
