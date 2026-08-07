---
title: "Verification Checklist: Bind Sealed Artifacts and Certificates to the Semantic Identity They Claim to Certify"
description: "Verification checklist for 025-artifact-certificate-binding: baseline-before-delta evidence, a negative test per confirmed finding, and independent adversarial verification."
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

# Verification Checklist: Bind Sealed Artifacts and Certificates to the Semantic Identity They Claim to Certify

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

- [ ] CHK-010 [P0] Per-emitter load-bearing identity field lists enumerated and reviewed
  - **Evidence**: Field list per emitter, derived from the certificate body and mode contract
- [ ] CHK-011 [P0] Historical certificate corpus enumerated before any binding is tightened
  - **Evidence**: Corpus list with the certificates that must continue to verify
- [ ] CHK-012 [P1] `024` receipt and proof primitives confirmed available
  - **Evidence**: Named exports cited from `024`'s hand-off note
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-020 [P0] No verifier computes a value the issuer chose
  - **Evidence**: Grep for `receiptDigests.length` and `attemptNumber` in verification paths returns none
- [ ] CHK-021 [P1] One binding validator; per-emitter differences are data, not forked code
  - **Evidence**: Single validator module with four field lists
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

- [ ] CHK-030 [P0] A decoy or forgery test exists per finding, demonstrated on both sides of the fix
  - **Evidence**: Twelve tests with the pre-fix passing run and the post-fix failing run recorded
- [ ] CHK-031 [P0] A validly signed certificate with a false semantic binding fails verification
  - **Evidence**: Named test asserting the mismatched field is reported
- [ ] CHK-032 [P0] An unresolvable authorization removes nothing from the sealed store
  - **Evidence**: Named test asserting reference, blob and descriptor all survive
- [ ] CHK-033 [P1] A score citing a foreign trial is rejected
  - **Evidence**: Named test
- [ ] CHK-034 [P1] A gap-containing fold without a checkpoint fails
  - **Evidence**: Named test
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each of the 12 scoped findings has a finding class recorded (`CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED`) from T001
  - **Evidence**: T001 output table in `tasks.md` lists all 12 IDs with a classification and a cited probe
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed for the metadata-only-correspondence defect class across the sealed store and the four certificate emitters
  - **Evidence**: The three `plan.md` §FIX ADDENDUM inventories run and recorded: `rg -n "candidateId|baselineId|evaluatorEpochId|qualified_digest|artifact_kind|roundId|runId"` over `*-certificates`, `rg -n "receiptDigests\.length|attemptNumber"` over `runtime/lib`, `rg -n "eventStem|eventId|authorityEpoch"` over `deep-review-certificates`
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for every caller of the new binding validator across the sealed store, four certificate emitters and three reducers
  - **Evidence**: Enumerated call-site list cross-checked against the §3 Files to Change table
- [ ] CHK-FIX-004 [P0] Adversarial edge case covered: a decoy sharing two digests with a different `artifact_kind` is rejected (`F-015-01`)
  - **Evidence**: Named test asserting the decoy fails creation-evidence lookup after the fix
- [ ] CHK-FIX-005 [P1] The {12 findings} x {fix, `REFUTED`, `ALREADY-FIXED`} disposition matrix is listed before completion is claimed
  - **Evidence**: T001 classification table cross-tabulated against the fix set in `implementation-summary.md`
- [ ] CHK-FIX-006 [P1] The historical certificate corpus (T003) is cross-checked against every tightened emitter, not only the emitter it was enumerated for
  - **Evidence**: Corpus list reviewed per emitter with a pass/fail entry for each
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-007 [P1] Severity calibration carried into the spec and not re-escalated
  - **Evidence**: `spec.md` §2 contains the calibration block verbatim

- [ ] CHK-040 [P0] Metadata correspondence alone never satisfies a binding check (NFR-B02)
  - **Evidence**: Decoy tests per emitter
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-006 [P0] No evidence string cites a bare run count or raw line number
  - **Evidence**: Every evidence string carries a test name + suite digest + candidate SHA
- [ ] CHK-008 [P0] `validate.sh --strict` exits 0 for this child
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <child> --strict` -> exit 0

- [ ] CHK-050 [P1] Per-emitter field lists documented so a later emitter can adopt them
  - **Evidence**: Field lists recorded in the child, not only in code
- [ ] CHK-051 [P1] The `F-007-01` issuer-versus-verifier fix order is recorded
  - **Evidence**: Recorded in ADR-002 implementation notes
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

- [ ] CHK-103 [P1] ADR-001 alternative (per-emitter local checks) documented with rejection rationale
  - **Evidence**: ADR-001 alternatives table
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Behavior and Regression Verification

- [ ] CHK-110 [P0] Whole `runtime` suite re-run and reported as a delta against the `021` baseline
  - **Evidence**: Before/after discovered, pass, fail, skip, exit code
- [ ] CHK-111 [P1] Historical certificate corpus verification result recorded
  - **Evidence**: Pass/fail per historical certificate, with any rejection investigated
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Landing Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and rehearsed
  - **Evidence**: `plan.md` §7 and the L2 enhanced-rollback section; rehearsal recorded
- [ ] CHK-121 [P1] Completion metadata reconciled across spec/plan/tasks/implementation-summary
  - **Evidence**: No doc claims a completion state another doc contradicts
- [ ] CHK-122 [P0] The binding property is recorded as a `014` cutover-certificate precondition
  - **Evidence**: Precondition citation in the `014` unblock record
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [ ] CHK-130 [P1] No secret, credential or token is embedded in decoy fixtures, field-list data or evidence citations
  - **Evidence**: Fixture and field-list contents reviewed; only field names and repo-relative paths present
- [ ] CHK-131 [P1] No absolute machine-local path is embedded in the binding validator, field lists or test fixtures
  - **Evidence**: Diff reviewed for absolute paths outside the repo root
- [ ] CHK-132 [P2] The severity calibration block (`spec.md` §2) is carried verbatim into every child that cites it
  - **Evidence**: Grep for the calibration text across `022`-`032` confirms verbatim reuse where cited
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [ ] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md` and `checklist.md` are synchronized at close
  - **Evidence**: Cross-read confirms no doc claims a completion state another doc contradicts
- [ ] CHK-141 [P1] `decision-record.md` records ADR-001 and ADR-002 in terms sibling children (`022`, `024`, `027`) can cite without re-deriving them
  - **Evidence**: `decision-record.md` ADRs reviewed for citability by dependent and coordinating children
- [ ] CHK-142 [P2] Per-emitter load-bearing field lists are documented in the child docs, not only in code, so a future emitter can adopt them
  - **Evidence**: Field lists recorded in `plan.md` and `checklist.md`, reviewed against the shipped validator
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 21 | 0/21 |
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
| Packet owner | `F-007-01` issuer-vs-verifier fix order decision (recorded in Phase 2, T007) | [ ] Approved | |
| Independent verifier | REQ-U04 adversarial pass over the twelve decoy/forgery negative tests | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
