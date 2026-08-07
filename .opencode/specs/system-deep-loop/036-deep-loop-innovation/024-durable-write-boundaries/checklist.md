---
title: "Verification Checklist: Enforce Fencing at the Append Boundary Through a Gateway-Only Mutation Surface"
description: "Verification checklist for 024-durable-write-boundaries: baseline-before-delta evidence, a negative test per confirmed finding, and independent adversarial verification."
trigger_phrases:
  - "durable write boundaries fencing"
  - "blocker 3 append fencing token"
  - "gateway only mutation ledger"
  - "appendAuthorized internal only"
  - "deep loop 024 fencing"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries"
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

# Verification Checklist: Enforce Fencing at the Append Boundary Through a Gateway-Only Mutation Surface

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

- [ ] CHK-010 [P0] Every exported mutation entry point and call site enumerated before the surface changes
  - **Evidence**: Inventory output from the grep commands in `plan.md`, reviewed
- [ ] CHK-011 [P0] Two-process harness available and deterministic
  - **Evidence**: Harness uses barriers, not sleeps; a demonstration run shows a reproducible interleaving
- [ ] CHK-012 [P0] Work runs in an isolated worktree
  - **Evidence**: Worktree path recorded; main checkout `git status` unchanged
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-020 [P0] Direct append is not reachable from the public export surface
  - **Evidence**: Export-surface test attempting a direct append fails to resolve the symbol
- [ ] CHK-021 [P0] Fencing added before the direct export is demoted, in separate commits
  - **Evidence**: Commit history shows the gateway path landing before the demotion
- [ ] CHK-022 [P1] Protected-surface manifest no longer describes `FencedLedgerWriter` as a direct replacement
  - **Evidence**: Manifest diff
- [ ] CHK-023 [P1] No ephemeral artifact labels embedded in shipped code comments
  - **Evidence**: Comment hygiene review of the whole diff
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

- [ ] CHK-030 [P0] Superseded writer with an unexpired proof is rejected
  - **Evidence**: Named test with the fencing-specific error asserted
- [ ] CHK-031 [P0] Two-process single-winner test per named race, none skipped
  - **Evidence**: One test per race: `F-018-04`, `F-004-01`, `F-004-02`, `F-004-03`, `F-018-01`, `F-018-02`/`F-003-01`
- [ ] CHK-032 [P0] Crash injection at every leaf-publication stage boundary recovers on a clean retry
  - **Evidence**: Per-boundary test with the injection point named
- [ ] CHK-033 [P0] Cyclic request data yields a durable `INVALID_INPUT` denial
  - **Evidence**: Named test asserting a persisted denial record and a typed error
- [ ] CHK-034 [P1] Two policies with identical source and different captured allowlists digest differently
  - **Evidence**: Named test
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each of the 18 scoped findings has a finding class recorded (`CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED`) from T001, with `F-003-01`/`F-018-02` tracked as one work unit
  - **Evidence**: T001 output table in `tasks.md` lists all 18 IDs with a classification and a cited probe
- [ ] CHK-FIX-002 [P0] Same-mechanism producer inventory completed for the ten mutation-boundary files in scope
  - **Evidence**: `rg -n "fenc|lease|token|highWater" .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts` and the equivalent check-then-act grep from `plan.md` re-run against the fixed tree, both showing the boundary is now covered
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for every exported mutation entry point and its call sites
  - **Evidence**: `rg -n "^export" .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/*.ts` and every `appendAuthorized` call site enumerated in `plan.md`, cross-checked against the demoted export
- [ ] CHK-FIX-004 [P0] Adversarial case exercised: a superseded writer with an unexpired proof attempts an append against the gateway-only surface
  - **Evidence**: Named negative test (T008) asserting a fencing-specific rejection, not a generic error
- [ ] CHK-FIX-005 [P1] The {18 findings} x {fix, strike, already-fixed} matrix is listed before completion is claimed
  - **Evidence**: T001 classification table cross-tabulated against the fix work units in `implementation-summary.md`
- [ ] CHK-FIX-006 [P1] `leaf-artifact-writer.ts` structural ownership (5 findings: `F-003-02`, `F-037-01`, `F-039-01`, `F-039-02`, `F-036-04`) is closed as one reconciled fix, not five independent patches
  - **Evidence**: `implementation-summary.md` names the single staged-publication mechanism that closes all five
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-007 [P1] Severity calibration carried into the spec and not re-escalated
  - **Evidence**: `spec.md` §2 contains the calibration block verbatim

- [ ] CHK-040 [P0] A forged `actorId` or `capabilityId` is denied with the failing field named
  - **Evidence**: Named test per identity field
- [ ] CHK-041 [P0] No exported path mutates the ledger without passing the fenced gateway (NFR-S01)
  - **Evidence**: Export-surface test plus the call-site inventory
- [ ] CHK-042 [P1] A worker whose lease is revoked mid-flight cannot commit a side effect
  - **Evidence**: Named test
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-006 [P0] No evidence string cites a bare run count or raw line number
  - **Evidence**: Every evidence string carries a test name + suite digest + candidate SHA
- [ ] CHK-008 [P0] `validate.sh --strict` exits 0 for this child
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <child> --strict` -> exit 0

- [ ] CHK-050 [P0] The gateway-only ruling is recorded as Accepted, not as an open fork
  - **Evidence**: ADR-001 status Accepted with the operator ruling stated
- [ ] CHK-051 [P1] The fencing-token placement decision is recorded
  - **Evidence**: Recorded in `spec.md` §11 resolution and in the ADR implementation notes
- [ ] CHK-052 [P1] The parser hand-off to `026` is documented
  - **Evidence**: Ownership edge recorded here and in WS1 `MANIFEST.md`
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

- [ ] CHK-103 [P1] ADR-001 alternative (accept the gap with a compensating control) documented with rejection rationale
  - **Evidence**: ADR-001 alternatives table
- [ ] CHK-104 [P1] ADR-003 staged-publication design documented with its crash-recovery argument
  - **Evidence**: ADR-003 context and consequences
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Behavior and Regression Verification

- [ ] CHK-110 [P0] Whole `runtime` suite re-run and reported as a delta against the `021` baseline
  - **Evidence**: Before/after discovered, pass, fail, skip, exit code
- [ ] CHK-111 [P1] Fencing overhead on the append path measured and recorded
  - **Evidence**: Append throughput before and after, so a later regression is visible
- [ ] CHK-112 [P1] No concurrency test introduces a deadlock under repeated runs
  - **Evidence**: Repeated-run record for the two-process suite
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Landing Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and rehearsed
  - **Evidence**: `plan.md` §7 and the L2 enhanced-rollback section; rehearsal recorded
- [ ] CHK-121 [P1] Completion metadata reconciled across spec/plan/tasks/implementation-summary
  - **Evidence**: No doc claims a completion state another doc contradicts
- [ ] CHK-122 [P0] Blocker 3 discharge recorded in the `014` unblock table with the fencing decision and the superseded-writer test
  - **Evidence**: Unblock record citation
- [ ] CHK-123 [P0] Receipt, proof and parser primitives handed to `025`, `026` and `027`
  - **Evidence**: Hand-off note naming the exported primitives and their consumers
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [ ] CHK-130 [P1] No exported test helper, fixture, or fencing-token value embeds a credential, token, or absolute machine-local path
  - **Evidence**: Diff reviewed; only repo-relative paths and synthetic test identities present
- [ ] CHK-131 [P1] The two-process concurrency harness performs no network access and reads only repo-local fixtures
  - **Evidence**: Harness source reviewed; no fetch/network calls
- [ ] CHK-132 [P2] The severity calibration block (`spec.md` §2) is carried verbatim into every child that cites it
  - **Evidence**: Grep for the calibration text across `022`-`032` confirms verbatim reuse where cited
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [ ] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are synchronized at close
  - **Evidence**: Cross-read confirms no doc claims a completion state another doc contradicts
- [ ] CHK-141 [P1] `decision-record.md` records ADR-001 (Accepted) and ADR-002/ADR-003 in terms `025`, `026`, and `027` can cite without re-deriving them
  - **Evidence**: `decision-record.md` ADRs reviewed for citability by the sibling children they hand off to
- [ ] CHK-142 [P2] The fencing-token placement decision (`spec.md` §11) is recorded once answered, with no dangling reference to the unresolved open question
  - **Evidence**: File reviewed after the placement question is answered
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 27 | 0/27 |
| P1 Items | 23 | 0/23 |
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
| Independent verifier | REQ-U04 adversarial pass over the gateway-only mutation surface and the concurrency-race fixes | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
