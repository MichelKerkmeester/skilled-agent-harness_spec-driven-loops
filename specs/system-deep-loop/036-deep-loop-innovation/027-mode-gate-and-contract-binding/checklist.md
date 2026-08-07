---
title: "Verification Checklist: Close the Readiness-Gate, Rollback-Switch and Mode-Contract Conformance Boundaries"
description: "Verification checklist for 027-mode-gate-and-contract-binding: baseline-before-delta evidence, a negative test per confirmed finding, and independent adversarial verification."
trigger_phrases:
  - "mode gate contract binding"
  - "readiness gate sealed digest binding"
  - "rollback switch certificate binding"
  - "conformance event unbound reducer"
  - "deep loop 027 gates"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/027-mode-gate-and-contract-binding"
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

# Verification Checklist: Close the Readiness-Gate, Rollback-Switch and Mode-Contract Conformance Boundaries

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

- [ ] CHK-010 [P0] Gate clone drift diffed and documented before the validator is designed
  - **Evidence**: Diff record between legacy and reference gates
- [ ] CHK-011 [P1] The version-binding reference implementation chosen and recorded
  - **Evidence**: Recorded choice with rationale
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-020 [P0] No gate family carries a private copy of the validation logic
  - **Evidence**: Grep for duplicated validation shapes returns none
- [ ] CHK-021 [P1] Blocked-disposition reason codes are shared with a per-family detail field
  - **Evidence**: Reason-code enumeration reviewed
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

- [ ] CHK-030 [P0] A mismatched allow decision is rejected before a fence is acquired
  - **Evidence**: Named test asserting no fence acquisition on the rejection path
- [ ] CHK-031 [P0] A certificate whose claims are disjoint from the sealed set is rejected
  - **Evidence**: Named test with the mismatch reported
- [ ] CHK-032 [P0] An event-ignoring no-op reducer fails its accept fixture
  - **Evidence**: Named test
- [ ] CHK-033 [P0] A constant certificate with unrelated references fails conformance
  - **Evidence**: Named test
- [ ] CHK-034 [P0] `null` input to every gate returns a blocked disposition, not a rejection
  - **Evidence**: One test per gate family
- [ ] CHK-035 [P1] Fabricated execution rows earn no rollback-window credit
  - **Evidence**: Named test with two syntactically valid fabricated IDs
- [ ] CHK-036 [P1] A stale-but-token-shaped version binding is rejected by common and agent
  - **Evidence**: Named tests, parity asserted against the reference gate
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each of the 9 scoped findings has a finding class recorded (`CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED`) from T001
  - **Evidence**: T001 output table in `tasks.md` lists all 9 IDs with a classification and a cited probe
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed for the clone-drift defect class (permissive research/review gates vs the model/skill reference)
  - **Evidence**: Diff record (T002) covers every gate family, not just the two cited in the scope table
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for callers that currently catch a rejected promise from a gate
  - **Evidence**: `rg -n "throw|Promise.reject" .opencode/skills/system-deep-loop/runtime/lib/*-rollback-gate/mode-gate.ts` and every caller enumerated
- [ ] CHK-FIX-004 [P0] Adversarial case: a certificate whose claims partially overlap the sealed set (not fully disjoint) is still rejected
  - **Evidence**: Named test with a partial-overlap fixture, distinct from the fully-disjoint case in CHK-031
- [ ] CHK-FIX-005 [P1] The {9 findings} x {fixed, refuted, already-fixed} matrix is listed before completion is claimed
  - **Evidence**: T001 classification table cross-tabulated in `implementation-summary.md`
- [ ] CHK-FIX-006 [P1] The council and alignment rollback switches, named only in prose in the scope table, are resolved to concrete file paths before being modified
  - **Evidence**: Resolved paths recorded against the T009-equivalent tasks in `tasks.md`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-007 [P1] Severity calibration carried into the spec and not re-escalated
  - **Evidence**: `spec.md` §2 contains the calibration block verbatim

- [ ] CHK-040 [P0] A caller cannot redirect budget scope by mutating its input after validation
  - **Evidence**: Named test
- [ ] CHK-041 [P0] A caller-supplied object is never treated as ledger-authoritative at resume
  - **Evidence**: Named test
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-006 [P0] No evidence string cites a bare run count or raw line number
  - **Evidence**: Every evidence string carries a test name + suite digest + candidate SHA
- [ ] CHK-008 [P0] `validate.sh --strict` exits 0 for this child
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <child> --strict` -> exit 0

- [ ] CHK-050 [P1] The shared validator and its reason codes are documented for `032` to adopt
  - **Evidence**: Hand-off note naming the exported validator and codes
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

- [ ] CHK-103 [P1] ADR-001 alternative (four local patches) documented with rejection rationale
  - **Evidence**: ADR-001 alternatives table
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Behavior and Regression Verification

- [ ] CHK-110 [P0] Whole `runtime` suite re-run and reported as a delta against the `021` baseline
  - **Evidence**: Before/after discovered, pass, fail, skip, exit code
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Landing Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and rehearsed
  - **Evidence**: `plan.md` §7 and the L2 enhanced-rollback section; rehearsal recorded
- [ ] CHK-121 [P1] Completion metadata reconciled across spec/plan/tasks/implementation-summary
  - **Evidence**: No doc claims a completion state another doc contradicts
- [ ] CHK-122 [P0] Gate trustworthiness recorded as a `014` precondition for every mode flip
  - **Evidence**: Precondition citation in the `014` unblock record
- [ ] CHK-123 [P1] Sequencing note for `032` recorded
  - **Evidence**: Ordering in this child and in WS1 `MANIFEST.md`
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [ ] CHK-130 [P1] The shared strict validator reads only the arguments it is given and performs no network access
  - **Evidence**: Validator source reviewed; no fetch/network calls
- [ ] CHK-131 [P1] No fixture, reason code, or test asserts a credential, token, or absolute machine-local path
  - **Evidence**: Fixture and reason-code contents reviewed; only repo-relative values present
- [ ] CHK-132 [P2] The severity calibration block (`spec.md` §2) is carried verbatim into every child that cites it
  - **Evidence**: Grep for the calibration text across `022`-`032` confirms verbatim reuse where cited
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [ ] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are synchronized at close
  - **Evidence**: Cross-read confirms no doc claims a completion state another doc contradicts
- [ ] CHK-141 [P1] `decision-record.md` records ADR-001 and ADR-002 in terms `032` can cite without re-deriving them
  - **Evidence**: `decision-record.md` ADRs reviewed for citability by `032`
- [ ] CHK-142 [P2] The hand-off note to `032` names the exported validator module and its reason codes
  - **Evidence**: `implementation-summary.md` hand-off note reviewed once `032` begins adoption
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 23 | 0/23 |
| P1 Items | 21 | 0/21 |
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
| Operator | ADR-001/ADR-002 acceptance (shared validator scope, value-returning gate contract) | [ ] Approved | |
| Independent verifier | REQ-U04 adversarial pass over the four adopted gate families | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
