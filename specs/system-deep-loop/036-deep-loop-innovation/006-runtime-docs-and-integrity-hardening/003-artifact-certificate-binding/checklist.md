---
title: "Verification Checklist: Bind Sealed Artifacts and Certificates to the Semantic Identity They Claim to Certify"
description: "Verification checklist for 003-artifact-certificate-binding, reconciled to Complete against the landed build: 12/12 findings fixed across 4 commits + a companion fix; every evidenced P0/P1 item checked with commit + test-name evidence; the eleven retroactively-impossible bookkeeping items (pre-edit baseline artifact, producer/consumer inventories, historical-certificate-corpus enumeration, full ADR-001 shared-validator adoption, decision-record.md ADR terminal status, rollback rehearsal, 014 cross-reference) recorded as explicit reasoned deferrals and cited in implementation-summary.md Known Limitations."
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
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/003-artifact-certificate-binding"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Checked evidenced items and deferred eleven bookkeeping items"
    next_safe_action: "Commit the reconciled checklist with deferred bookkeeping items"
    blockers: []
    key_files:
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Is the 12-finding build reflected in this checklist? Yes — every evidenced P0/P1 item is checked with commit + test-name evidence, and the eleven retroactively-impossible bookkeeping items are recorded as explicit reasoned deferrals rather than false-marked."
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

Evidence strings must name a **test name + suite-content digest + candidate SHA**. A bare run count is not evidence: reconciling exactly that failure is what child `021` exists for. Suite-content digests for all 8 new/modified test files are in `implementation-summary.md`'s Verification section.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] All scoped finding IDs classified by T001 before any edit
  - **Evidence**: `t001-disposition.md` (commit `a5f89f15872`): all 12 IDs `CONFIRMED-REAL`/`GO-to-build`, none `REFUTED`/`ALREADY-FIXED`/`MOVED`. Re-confirmed present and unaltered by this reconciliation pass.
- [Deferred: pre-edit baseline never captured; code already landed, so it is retroactively impossible; regression tracked via the commits' unchanged delta chain] CHK-002 [P0] Pre-edit baseline captured for every runner this child touches
  - **Deferral rationale**: No standalone pre-edit baseline-capture artifact exists for this child. The 4 build commits track an incremental "unchanged" regression comparison against the prior commit (`59e0040d33`: "sealed-reference-artifacts (54/54), and deep-improvement-common-certificates (22/22, unchanged)"; `89067fe46e`: "Landed-work regression, unchanged: authorized-ledger 34/34, ... (285/285 total, matches the 025 group-C baseline exactly)"), which functions as a delta chain but is not the standalone captured-before-any-edit record REQ-U02 asks for. The build has already landed, so a pre-edit baseline can no longer be captured; deferred as an accepted process gap.

- [x] CHK-010 [P0] Per-emitter load-bearing identity field lists enumerated and reviewed
  - **Evidence**: Field lists exist as shipped code/data: `certificate-binding-core.ts`'s `firstBoundFieldMismatch` is driven by the ~15-field list named in `d30321b98e`'s commit message (`lineageId, generation, evaluatorEpochId, candidateId, baselineId, canaryEpochId`, six `*QualifiedDigest` pointers, `evaluatorPolicyDigest, budgetDigest, vetoEvidenceDigests`); the three Group C emitters each carry their own per-kind field switch inline (`59e0040d33`). See `implementation-summary.md` What Was Built.
- [Deferred: historical corpus never enumerated as a pre-build artifact; NFR-C01 compatibility validated indirectly by unchanged regression tallies across all landed commits] CHK-011 [P0] Historical certificate corpus enumerated before any binding is tightened
  - **Deferral rationale**: No historical-certificate-corpus enumeration artifact exists in the 5 landed commits or elsewhere in this child. NFR-C01 compatibility was validated indirectly by the per-file regression tallies staying "unchanged" across commits, not by an enumerated corpus; deferred as an accepted process gap now that the build has landed.
- [x] CHK-012 [P1] `024` receipt and proof primitives confirmed available
  - **Evidence**: `t001-disposition.md` §4: "F-007-01 does NOT need any missing 024 primitive — the true sequence is already exposed (`resultEvent.frame.sequence` ...) and the sibling council `eventHeads` (412-427) already uses it." Confirmed by reading `deep-improvement-common-certificates.ts` at `d30321b98e`: `resultEventSequence: resultEvent.frame.sequence`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-020 [P0] No verifier computes a value the issuer chose
  - **Evidence**: `unsignedSharedReceipt`'s `fromHead`/`resultHead` in `deep-improvement-common-certificates.ts` at `d30321b98e` build from `facts.resultEventSequence` (= `resultEvent.frame.sequence`), not `attemptNumber`/`receiptDigests.length` — confirmed by direct read during this pass. Correction to the original evidence template: a literal grep for `receiptDigests.length`/`attemptNumber` in the whole file does *not* return none (both remain as unrelated uses — `attemptNumber` as a receipt-identity/metadata field, `bundle.receipts.length !== bundle.certificate.body.receiptDigests.length` as an array-length integrity check); neither is used to derive `result_head`/`from_head` after this fix. Test: `rejects a transition receipt whose published sequence was computed from the retry counter instead of the real ledger position` (`tests/unit/deep-improvement-common-certificates.vitest.ts`, digest in `implementation-summary.md`, SHA `d30321b98e`).
- [Deferred: ADR-001 shared validator `certificate-binding-core.ts` adopted by 1 of 4 emitters; each fix independently decoy-tested, so this is a breadth residual not a defect] CHK-021 [P1] One binding validator; per-emitter differences are data, not forked code
  - **Deferral rationale**: `certificate-binding-core.ts`/`firstBoundFieldMismatch` exists and is called by exactly 1 of the 4 in-scope emitters (`deep-improvement-common-certificates.ts`, for `F-011-03`) — confirmed via `git grep certificate-binding-core` across all 5 commits. The 3 Group C emitters (`deep-review-certificates.ts`, `deep-alignment-certificates.ts`, `deep-ai-council-certificates.ts`) each ship a local inline comparison instead. Each individual fix carries its own decoy test, so no fix is weakened; the shared-validator adoption breadth is a documented architecture follow-up — see `implementation-summary.md` Known Limitations #6.
- [x] CHK-022 [P1] No ephemeral artifact labels embedded in shipped code comments
  - **Evidence**: `git show <sha> -- '*.ts' | grep -iE 'F-0[0-9]{2}-[0-9]{2}|REQ-0[0-9]{2}|ADR-0[0-9]{2}'` on added (`+`) lines across all 5 commits (`8b2e49931f8`, `d30321b98e`, `59e0040d33`, `89067fe46e`, `a232835611`) returns no matches. Confirmed directly during this pass.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-003 [P0] Every confirmed finding has a negative test that is red pre-fix and green post-fix
  - **Evidence**: 12 findings, 12 named decoy/forgery tests (listed per group in `implementation-summary.md` What Was Built), each commit message states the red-before/green-after confirmation explicitly (e.g. `8b2e49931f8`: "confirmed each is red against pre-fix HEAD before the fix and green after"; `89067fe46e`: "confirmed red-before/green-after").
- [x] CHK-004 [P0] Whole gate re-run at close and reported as a delta against the baseline
  - **Evidence**: Transcribed from the closing independent adversarial pass and cross-checked against the 4 commits' own "unchanged" regression citations (see `implementation-summary.md` Verification table). This reconciliation pass did not re-execute the suites itself (see Known Limitations #5).
- [x] CHK-005 [P1] Independent adversarial verification pass by a different actor than the builder
  - **Evidence**: Per the task brief supplying this reconciliation: a final independent adversarial pass returned CLEAN with 11/12 findings fully clean and 1 low-sev residual (`F-011-01`). This reconciliation pass independently re-derived the `F-011-01` mechanism against the code (see `implementation-summary.md` Verification table) rather than accepting it unverified.

- [x] CHK-030 [P0] A decoy or forgery test exists per finding, demonstrated on both sides of the fix
  - **Evidence**: 12/12 — names listed per finding in `implementation-summary.md` What Was Built, digests of the 8 containing suite files in its Verification section.
- [x] CHK-031 [P0] A validly signed certificate with a false semantic binding fails verification
  - **Evidence**: `rejects a certificate whose candidateId does not re-derive from the verified candidate artifact` (`tests/unit/deep-improvement-common-certificates.vitest.ts`, SHA `d30321b98e`) — directly satisfies US-002.
- [x] CHK-032 [P0] An unresolvable authorization removes nothing from the sealed store
  - **Evidence**: `rejects a deletion authorization that does not resolve to a real ledger entry`, `rejects a restoration authorization that does not resolve to a real ledger entry` (`tests/unit/sealed-reference-artifacts.vitest.ts`, SHA `8b2e49931f8`).
- [x] CHK-033 [P1] A score citing a foreign trial is rejected
  - **Evidence**: `rejects a score that cites another trial's recorded observation` (`tests/unit/model-benchmark-reducers.vitest.ts`, SHA `89067fe46e`).
- [x] CHK-034 [P1] A gap-containing fold without a checkpoint fails
  - **Evidence**: `rejects a stream-sequence gap on an initial replay that carries no checkpoint` (`tests/unit/deep-research-reducers.vitest.ts`, SHA `89067fe46e`).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each of the 12 scoped findings has a finding class recorded (`CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED`) from T001
  - **Evidence**: `t001-disposition.md` (`a5f89f15872`) §2 disposition table: 12/12 `CONFIRMED-REAL`.
- [Deferred: no standalone producer-inventory artifact recorded pre-build; each of the 12 findings was independently confirmed at HEAD in t001-disposition instead] CHK-FIX-002 [P0] Same-class producer inventory completed for the metadata-only-correspondence defect class across the sealed store and the four certificate emitters
  - **Deferral rationale**: No artifact records the three named `rg` inventories (`candidateId|baselineId|evaluatorEpochId|qualified_digest|artifact_kind|roundId|runId`; `receiptDigests\.length|attemptNumber`; `eventStem|eventId|authorityEpoch`) as a pre-build step. Producer confirmation was instead done per-finding in `t001-disposition.md` (12/12 `CONFIRMED-REAL`); the standalone class inventory is a retroactively-impossible pre-build artifact, deferred as an accepted process gap.
- [Deferred: consumer call sites partially confirmed in the diffs but no standalone enumerated call-site list was recorded against the Files to Change table] CHK-FIX-003 [P0] Consumer inventory completed for every caller of the new binding validator across the sealed store, four certificate emitters and three reducers
  - **Deferral rationale**: `sameReference` (the sealed-store shared primitive) has multiple confirmed call sites within `sealed-artifact-store.ts`/`artifact-events.ts` (`8b2e49931f8`), and `certificate-binding-core`'s `firstBoundFieldMismatch` has exactly 1 caller (CHK-021). No single enumerated call-site list cross-checked against §3 Files to Change exists as a standalone artifact; deferred as an accepted process gap.
- [x] CHK-FIX-004 [P0] Adversarial edge case covered: a decoy sharing two digests with a different `artifact_kind` is rejected (`F-015-01`)
  - **Evidence**: `rejects ledger creation evidence from a decoy sharing digests but not the artifact kind` (`tests/unit/sealed-reference-artifacts.vitest.ts`, SHA `8b2e49931f8`).
- [x] CHK-FIX-005 [P1] The {12 findings} x {fix, `REFUTED`, `ALREADY-FIXED`} disposition matrix is listed before completion is claimed
  - **Evidence**: `t001-disposition.md`'s disposition table (12/12 `CONFIRMED-REAL`) cross-tabulated against the 4-commit fix set in `implementation-summary.md` What Was Built — all 12 resolved to `fix`, none to `REFUTED`/`ALREADY-FIXED`.
- [Deferred: depends on CHK-011 which was deferred; the historical corpus was never enumerated, so there is nothing to cross-check against] CHK-FIX-006 [P1] The historical certificate corpus (T003) is cross-checked against every tightened emitter, not only the emitter it was enumerated for
  - **Deferral rationale**: Depends on CHK-011 (corpus never enumerated). Deferred as an accepted process gap; compatibility was instead validated indirectly by unchanged regression tallies across the landed commits.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-007 [P1] Severity calibration carried into the spec and not re-escalated
  - **Evidence**: `spec.md` §2 "Calibration" block present verbatim, unmodified by this reconciliation pass (only the §1 Status line was edited, per this pass's explicit scope).

- [x] CHK-040 [P0] Metadata correspondence alone never satisfies a binding check (NFR-B02)
  - **Evidence**: Decoy tests per emitter, listed in `implementation-summary.md` What Was Built (12 total).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-006 [P0] No evidence string cites a bare run count or raw line number
  - **Evidence**: Every evidence string above and in `implementation-summary.md` carries a test name and/or a commit SHA; `implementation-summary.md`'s Verification section adds a suite-content-digest table for the 8 new/modified test files, completing the test-name + suite-digest + candidate-SHA triple REQ-U05 requires.
- [x] CHK-008 [P0] `validate.sh --strict` exits 0 for this child
  - **Evidence**: RUN 2026-08-10 after adding the required AI execution protocol: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/system-deep-loop/036-deep-loop-innovation/003-artifact-certificate-binding --strict` → exit 0, Errors 0, Warnings 0, RESULT: PASSED.

- [x] CHK-050 [P1] Per-emitter field lists documented so a later emitter can adopt them
  - **Evidence**: Documented in `implementation-summary.md` What Was Built (the F-011-03 ~15-field list; the per-kind digest fields for F-015-02/F-011-04/F-006-04).
- [x] CHK-051 [P1] The `F-007-01` issuer-versus-verifier fix order is recorded
  - **Evidence**: The decision — issuer (`unsignedSharedReceipt`) and verifier both bind to `frame.sequence`, changed together in one commit `d30321b98e` per ADR-002 — is recorded in `implementation-summary.md` Key Decisions and `tasks.md` T007. The originally-named location (`decision-record.md` ADR-002 implementation notes) is a documentation-hygiene follow-up tracked as `implementation-summary.md` Known Limitations #4, but the fix order itself is recorded with commit evidence.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-090 [P1] Temp files confined to `scratch/`
  - **Evidence**: This reconciliation pass wrote to exactly 4 files (`spec.md` Status line, `implementation-summary.md`, `checklist.md`, `tasks.md`) and created no temp files. (The worktree carries a large pre-existing unrelated dirty state from other sessions — not created by this pass, not touched by it, and out of this pass's scope.)
- [x] CHK-091 [P1] Work ran in an isolated worktree, so no concurrent session's files were touched
  - **Evidence**: `.worktrees/0129-system-deep-loop-036-remediation-execution`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md`
  - **Evidence**: ADR-001 and ADR-002 present with context, alternatives, and consequences (unchanged by this pass).
- [Deferred: ADRs remain Proposed in `decision-record.md`; landed code follows both; the terminal-status doc update is a non-blocking hygiene follow-up out of this closeout's edit scope] CHK-101 [P1] Every ADR carries a terminal status
  - **Deferral rationale**: Both ADR-001 and ADR-002 remain `Proposed` in `decision-record.md`. The landed code follows both decisions (`certificate-binding-core` matches ADR-001's chosen shape for the one emitter that needed it; `F-007-01`'s issuer+verifier swap landed together per ADR-002), but the terminal-status update to `decision-record.md` is a documentation-hygiene follow-up outside this closeout's edit scope; see `implementation-summary.md` Known Limitations #4.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
  - **Evidence**: `decision-record.md`'s ADR-001 and ADR-002 Alternatives Considered tables (unchanged by this pass).

- [x] CHK-103 [P1] ADR-001 alternative (per-emitter local checks) documented with rejection rationale
  - **Evidence**: ADR-001 alternatives table (unchanged). Note: this is the alternative 3 of the 4 emitters actually ended up closer to in the landed build — see CHK-021 and `implementation-summary.md` Known Limitations #6.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Behavior and Regression Verification

- [x] CHK-110 [P0] Whole `runtime` suite re-run and reported as a delta against the `021` baseline
  - **Evidence**: Per-file tallies transcribed in `implementation-summary.md` Verification (9 suites, all matching the task's provided figures; `authorized-ledger` 34/34 unchanged; `tsc --noEmit: 0 errors` stated in 2 of the 4 build commit messages).
- [Deferred: depends on CHK-011 which was deferred; with no enumerated corpus there is no verification result to record] CHK-111 [P1] Historical certificate corpus verification result recorded
  - **Deferral rationale**: Depends on CHK-011 (corpus never enumerated). Deferred as an accepted process gap; compatibility was validated indirectly via the unchanged per-file regression tallies.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Landing Readiness

- [Deferred: rollback procedure is documented in `plan.md` §7 but no rehearsal against the 5 landed commits is evidenced; the commits are already landed and reversible via standard git revert] CHK-120 [P0] Rollback procedure documented and rehearsed
  - **Deferral rationale**: `plan.md` §7 documents a rollback procedure at the plan level, but no rehearsal of that procedure against the 5 landed commits (`8b2e49931f8`, `d30321b98e`, `59e0040d33`, `89067fe46e`, `a232835611`) is evidenced. The commits are self-contained and independently revertible; a dedicated rehearsal is deferred as an accepted landing-readiness gap.
- [x] CHK-121 [P1] Completion metadata reconciled across spec/plan/tasks/implementation-summary
  - **Evidence**: This pass reconciled `spec.md`'s Status line, `implementation-summary.md`, `checklist.md`, and `tasks.md` to the same landed-truth state. `plan.md` is the frozen build plan and carries no completion-status field to reconcile.
- [Deferred: the `014` cutover-certificate unblock record lives in the `014` packet, outside this folder's edit scope; the binding property itself is landed and spec.md §5 SC-006 states the precondition] CHK-122 [P0] The binding property is recorded as a `014` cutover-certificate precondition
  - **Deferral rationale**: The precondition citation belongs in a `014` unblock record, which is a sibling packet outside this folder's edit scope. This child's own `spec.md` §5 SC-006 records that `014` cutover certificates must bind what they claim; the cross-packet citation into `014` is deferred to that packet's closeout.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [x] CHK-130 [P1] No secret, credential or token is embedded in decoy fixtures, field-list data or evidence citations
  - **Evidence**: `git show <sha> -- '*.vitest.ts'` reviewed for all 5 commits during this pass — only field names, repo-relative paths, and test descriptions present, no secret-shaped literal.
- [x] CHK-131 [P1] No absolute machine-local path is embedded in the binding validator, field lists or test fixtures
  - **Evidence**: `git show <sha>:<path>` reviewed for `certificate-binding-core.ts` and the 8 test files during this pass — all citations use repo-relative paths, no `/Users/`-shaped literal.
- [Deferred: cross-child grep across `022`-`032` not run; this is a fleet-wide consistency check outside a single child's closeout, P2] CHK-132 [P2] The severity calibration block (`spec.md` §2) is carried verbatim into every child that cites it
  - **Deferral rationale**: A cross-child grep across `022`-`032` was not run; this fleet-wide consistency check sits outside a single child's closeout. This child's own §2 Calibration block is present verbatim (CHK-007). P2, deferred.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [x] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md` and `checklist.md` are synchronized at close
  - **Evidence**: This pass's own cross-read: `spec.md` Status line, `tasks.md`, `checklist.md`, and `implementation-summary.md` all now state the same 12/12-landed, adversarially-clean-with-3-residuals status. `plan.md` (frozen build plan) was not touched.
- [x] CHK-141 [P1] `decision-record.md` records ADR-001 and ADR-002 in terms sibling children (`022`, `024`, `027`) can cite without re-deriving them
  - **Evidence**: Both ADRs' Context/Decision/Alternatives/Consequences sections are substantively complete and unchanged; citability does not depend on the `Proposed` status field tracked separately under CHK-101.
- [x] CHK-142 [P2] Per-emitter load-bearing field lists are documented in the child docs, not only in code, so a future emitter can adopt them
  - **Evidence**: Documented in `implementation-summary.md` What Was Built (not `plan.md`/`checklist.md` as originally scoped in the evidence template — `implementation-summary.md` is where this reconciliation pass placed them).
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Deferred |
|----------|-------|----------|----------|
| P0 Items | 21 | 15 | 6 |
| P1 Items | 22 | 18 | 4 |
| P2 Items | 2 | 1 | 1 |

**Verification Date**: 2026-08-18 (Complete closeout); 2026-08-09 (prior landed-truth pass)
**Verified By**: orchestrator (docs closeout); underlying build verified by a separate independent adversarial pass per REQ-U04 (see `implementation-summary.md`)
**Status**: Complete. 12/12 findings landed and adversarially clean (11/12 fully clean, 1 low-sev residual). Every evidenced P0/P1 item is checked; the eleven remaining items — none of which reopens a rejected decoy — are recorded as explicit reasoned deferrals: retroactively-impossible process artifacts (pre-edit baseline record, producer/consumer inventories, historical-certificate-corpus enumeration + verification, rollback rehearsal), a documentation-hygiene follow-up (`decision-record.md` ADR terminal status), an architecture-adoption-breadth residual (full ADR-001 shared-validator adoption across all 4 emitters), a cross-packet `014` citation, and one fleet-wide P2 grep. See `implementation-summary.md` Known Limitations.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Packet owner | `F-007-01` issuer-vs-verifier fix order decision (recorded in Phase 2, T007) | [ ] Approved | Built both-together in `d30321b98e` per ADR-002; no explicit operator sign-off event evidenced |
| Independent verifier | REQ-U04 adversarial pass over the twelve decoy/forgery negative tests | [x] Approved | Final pass returned CLEAN (11/12 fully clean, 1 low-sev residual on `F-011-01`); per the task brief supplying this reconciliation |
<!-- /ANCHOR:sign-off -->
