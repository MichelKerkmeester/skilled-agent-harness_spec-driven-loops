---
title: "Verification Checklist: Bind Promotion, Rollback and Council Persistence to Authenticated Receipts and Authorized Roots"
description: "Verification checklist for 007-improvement-promotion-authority: baseline-before-delta evidence, a negative test per confirmed finding, and independent adversarial verification."
trigger_phrases:
  - "improvement promotion authority"
  - "promotion acceptance receipt binding"
  - "council persistence packet root"
  - "stale score authorizes promotion"
  - "deep loop 029 promotion"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/007-improvement-promotion-authority"
    last_updated_at: "2026-08-15T08:00:00Z"
    last_updated_by: "codex"
    recent_action: "All 13 findings have green named probes; checklist closeout remains evidence-blocked"
    next_safe_action: "Commit, independent verification, main validation"
    blockers:
      - "Sandbox cannot write the shared Git index, so no candidate commit SHA exists"
      - "Independent verifier not available in this single-actor session"
      - "Strict validator command-tree environment is incomplete in this worktree"
    key_files:
      - "checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

# Verification Checklist: Bind Promotion, Rollback and Council Persistence to Authenticated Receipts and Authorized Roots

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

- [ ] CHK-010 [P0] Both vitest project baselines captured before any change
  - **Evidence**: Discovered, pass, fail, skip, exit code and SHA per project
- [ ] CHK-011 [P0] Fixture target trees in place; no test writes to a real canonical target
  - **Evidence**: Test setup review; no real target path appears in any test
- [ ] CHK-012 [P0] The acceptance receipt contents fixed in ADR-001 before implementation
  - **Evidence**: ADR-001 with the full field list
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-020 [P0] No promotion path treats a mutable local file as sole authority
  - **Evidence**: Grep of authorization checks against the receipt-bound implementation
- [ ] CHK-021 [P1] Every path is validated before any `mkdir`
  - **Evidence**: Grep for `mkdirSync` shows validation upstream in every case
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

- [ ] CHK-030 [P0] Stale, cross-candidate and cross-target score receipts are rejected
  - **Evidence**: Three named tests
- [ ] CHK-031 [P0] A forged acceptance JSON is rejected against the receipt
  - **Evidence**: Named test with matching hashes and arbitrary snapshot content
- [ ] CHK-032 [P0] A forged rollback hash pair does not restore an arbitrary backup
  - **Evidence**: Named test
- [ ] CHK-033 [P0] A candidate cannot select its own evaluator identity
  - **Evidence**: Named test with candidate frontmatter naming a different evaluator
- [ ] CHK-034 [P0] `--approve` alone does not promote
  - **Evidence**: Named test of the autonomous workflow path
- [ ] CHK-035 [P0] A `../` topic ID and an external packet root are rejected before any `mkdir`
  - **Evidence**: Two named tests asserting no directory is created
- [ ] CHK-036 [P1] `NaN`, `Infinity` and absent numerics fail closed
  - **Evidence**: Named tests per field and value
- [ ] CHK-037 [P1] A text-less event stream is unscorable
  - **Evidence**: Named test
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each of the 13 scoped findings has a finding class recorded (`CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED`) from T001
  - **Evidence**: T001 output table in `tasks.md` lists all 13 IDs with a classification and a cited probe
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed for the "mutable local JSON treated as authority" pattern
  - **Evidence**: Every promote/ship/rollback/persist call site that trusted an unauthenticated local file enumerated; grep for acceptance-JSON reads outside the receipt-bound path returns none new
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for `promote-candidate.cjs`, `rollback-candidate.cjs` and `persist-artifacts.cjs`
  - **Evidence**: Every CLI entry point, calling script, and workflow yaml that invokes these scripts enumerated and validated against the receipt/root binding
- [ ] CHK-FIX-004 [P0] Adversarial case: a receipt copied from a different candidate/target pair (cross-binding forgery), not only a stale one
  - **Evidence**: Named test distinct from the stale-score test
- [ ] CHK-FIX-005 [P1] The {13 findings} x {fixed, refuted, already-fixed} matrix is listed before completion is claimed
  - **Evidence**: T001 classification table cross-tabulated in `implementation-summary.md`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-007 [P1] Severity calibration carried into the spec and not re-escalated
  - **Evidence**: `spec.md` §2 contains the calibration block verbatim

- [ ] CHK-040 [P0] Every write boundary is contained: candidate, archive, acceptance, event log, state
  - **Evidence**: One containment test per boundary
- [ ] CHK-041 [P1] `--memory-save-payload-out` cannot overwrite a path outside the authorized root
  - **Evidence**: Named test
- [ ] CHK-042 [P1] REMEDIATE requires authorization at both the CLI and the module boundary
  - **Evidence**: Two named tests
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-006 [P0] No evidence string cites a bare run count or raw line number
  - **Evidence**: Every evidence string carries a test name + suite digest + candidate SHA
- [ ] CHK-008 [P0] `validate.sh --strict` exits 0 for this child
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <child> --strict` -> exit 0

- [ ] CHK-050 [P0] The severity calibration is carried and not escalated
  - **Evidence**: `spec.md` §2 states the operator or stale-local-file actor
- [ ] CHK-051 [P1] The chosen approval model for autonomous mode is recorded
  - **Evidence**: ADR or recorded operator answer
- [ ] CHK-052 [P1] The evaluator identity authority is recorded
  - **Evidence**: ADR-002
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
  - **Evidence**: ADR-001..ADR-003 present with context, alternatives, and consequences
- [ ] CHK-101 [P1] Every ADR carries a terminal status
  - **Evidence**: No ADR remains `Proposed` at close
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
  - **Evidence**: Each ADR alternatives table names why the rejected option loses

- [ ] CHK-103 [P1] ADR-001 receipt contents documented with the alternatives weighed
  - **Evidence**: ADR-001 alternatives table
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Behavior and Regression Verification

- [ ] CHK-110 [P0] Both vitest projects re-run and reported as deltas against their baselines
  - **Evidence**: Before/after per project
- [ ] CHK-111 [P1] Receipt write cost on a promotion recorded
  - **Evidence**: Wall-clock promotion time before and after
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Landing Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and rehearsed
  - **Evidence**: `plan.md` §7 and the L2 enhanced-rollback section; rehearsal recorded
- [ ] CHK-121 [P1] Completion metadata reconciled across spec/plan/tasks/implementation-summary
  - **Evidence**: No doc claims a completion state another doc contradicts
- [ ] CHK-122 [P0] The improvement-lane gate for `014` is recorded with its evidence
  - **Evidence**: Gate citation naming the stale-score and forged-acceptance tests
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [ ] CHK-130 [P1] Receipt, fixture, and citation content contain no credential, token, or absolute machine-local path
  - **Evidence**: Contents reviewed; only repo-relative paths and content hashes present
- [ ] CHK-131 [P1] The severity calibration block (`spec.md` §2) is carried verbatim wherever this child's findings are cited elsewhere
  - **Evidence**: Grep for the calibration text confirms verbatim reuse where cited
- [ ] CHK-132 [P2] No promotion or rollback test writes outside its fixture target tree
  - **Evidence**: Test setup review confirms no real canonical target path appears in any test
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [ ] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are synchronized at close
  - **Evidence**: Cross-read confirms no doc claims a completion state another doc contradicts
- [ ] CHK-141 [P1] `decision-record.md` records ADR-001 through ADR-003 in terms a future reader can cite without re-deriving them
  - **Evidence**: `decision-record.md` ADRs reviewed for citability
- [ ] CHK-142 [P2] The reserved ADR-004 approval-model decision states the disposition once answered, with no dangling reference to an unresolved model
  - **Evidence**: `decision-record.md` RESERVED DECISIONS section reviewed after the operator answers
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 26 | 0/26 |
| P1 Items | 22 | 0/22 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-08-15 (builder pass only)
**Verified By**: Codex (builder; not the independent actor required by REQ-U04)
**Status**: Verification Closeout Partial — the named affected probes are green and ADR-001 through ADR-004 are terminal, but no checklist item is eligible for `[x]` until the working tree has an immutable candidate commit SHA. Independent verification and main-checkout strict validation also remain open.

### Observed Builder Evidence (not yet eligible for checklist credit)

- Affected promotion-authority matrix: 8 files, 52 passed, exit 0.
- Sweep acceptance/runtime: 2 files, 25 passed, exit 0.
- Council project: 10 files, 118 passed, exit 0 (baseline: 109 passed, 2 failed, exit 1).
- REMEDIATE module/CLI plus state-machine wiring: 2 passed, exit 0.
- TypeScript: `tsc --noEmit --ignoreDeprecations 6.0`, exit 0.
- Aggregate suite-content SHA-256: `0505321f555e3edab1a3145da4e5acce74cb4b022408b10c2f49867d1a1fa265`.
- Candidate base: `149742c46260277ae26df6fe6cfe582a9d02454d`; no candidate commit SHA because the sandbox rejected the shared index lock with `Operation not permitted`.
- Receipt write probe: 100 authenticated exclusive writes in 485.381 ms total, 4.854 ms mean, exit 0. This records current cost only; it is not a before/after promotion benchmark, so CHK-111 remains open.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | ADR-004 advisory-only model selected by the explicit no-dark-to-live-authority-flip task constraint | [x] Approved | 2026-08-15 |
| Independent verifier | REQ-U04 adversarial pass targeted at whether any promotion path still trusts a mutable local file | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
