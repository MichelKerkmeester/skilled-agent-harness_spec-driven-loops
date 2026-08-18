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
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Reconciled packet docs to the landed additive-dark state under 0d1827eef50"
    next_safe_action: "Pass the additive-dark acceptance review and independent adversarial verification"
    blockers:
      - "Additive-dark acceptance review must pass before promotion goes live (CHK-018)"
      - "Independent adversarial verification pending (CHK-005)"
    key_files:
      - "checklist.md"
    completion_pct: 90
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

**Landing state.** The 13-finding runtime scope landed additive-dark under commits `0d1827eef50`, `f6cdf604a25` and `a28a39354b7` (status reconciled `ab6aae0a714`). The landed-finding items below carry those SHAs. Go-live stays gated: the additive-dark acceptance review (CHK-018) and independent adversarial verification (CHK-005) remain open, so this packet is **not Complete**.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] All scoped finding IDs classified by T001 before any edit
  - **Evidence**: T001 ledger in `tasks.md` lists all 13 IDs with a `CONFIRMED` / `ALREADY-FIXED` class and a cited probe; landed `a28a39354b7`
- [ ] CHK-002 [P0] Pre-edit baseline captured for every runner this child touches
  - **Evidence**: Recorded discovered-test count, pass/fail/skip, and exit code per runner, at a named SHA
  - **Open**: only the council runner baseline (`vitest`, 10 files / 109 passed / 2 failed / exit 1) was captured; the full improvement-project pre-edit baseline (T002) was not

- [ ] CHK-010 [P0] Both vitest project baselines captured before any change
  - **Evidence**: Discovered, pass, fail, skip, exit code and SHA per project
  - **Open**: council project captured; full improvement project baseline not captured (couples to T002/T020)
- [x] CHK-011 [P0] Fixture target trees in place; no test writes to a real canonical target
  - **Evidence**: Promotion/rollback tests run against fixture target trees only; no real canonical target path appears in any test; landed `0d1827eef50`
- [x] CHK-012 [P0] The acceptance receipt contents fixed in ADR-001 before implementation
  - **Evidence**: ADR-001 (`decision-record.md`) records the full field list, Accepted; landed `a28a39354b7`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-020 [P0] No promotion path treats a mutable local file as sole authority
  - **Evidence**: `requireApprovalReceipt` in `promote-candidate.cjs` binds promotion to the HMAC-authenticated receipt via `promotion-receipts.cjs`; landed `0d1827eef50`
- [x] CHK-021 [P1] Every path is validated before any `mkdir`
  - **Evidence**: Council/topic/payload paths validated upstream of `mkdirSync` in `persist-artifacts.cjs`; landed `f6cdf604a25`
- [x] CHK-022 [P1] No ephemeral artifact labels embedded in shipped code comments
  - **Evidence**: `grep -E 'F-0..-..|ADR-00.|REQ-U0.|CHK-|036/006/007'` over the four core changed `.cjs` files returns none; landed `0d1827eef50`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-003 [P0] Every confirmed finding has a negative test that is red pre-fix and green post-fix
  - **Evidence**: Named test per finding, with the red run and the green run both recorded
  - **Open**: every finding has a final green named probe, but the red-before run was not recorded against the untouched base for every finding
- [ ] CHK-004 [P0] Whole gate re-run at close and reported as a delta against the baseline
  - **Evidence**: Post-edit run of every runner, delta table vs CHK-002
  - **Open**: council delta captured (109/2/exit1 -> 118/0/exit0); full improvement-project whole-gate delta not captured (T020)
- [ ] CHK-005 [P1] Independent adversarial verification pass by a different actor than the builder
  - **Evidence**: Verification record naming the actor and the defects found (or explicitly none)
  - **Open — GATED**: external sign-off; a single-actor builder pass is not independent evidence. Blocking gate for go-live.

- [x] CHK-030 [P0] Stale, cross-candidate and cross-target score receipts are rejected
  - **Evidence**: `rejects a stale approval receipt after the candidate bytes change`, plus different-candidate and different-target companion tests; landed `0d1827eef50`
- [x] CHK-031 [P0] A forged acceptance JSON is rejected against the receipt
  - **Evidence**: `rejects a forged acceptance JSON that has no authenticated receipt`; landed `0d1827eef50`
- [x] CHK-032 [P0] A forged rollback hash pair does not restore an arbitrary backup
  - **Evidence**: `refuses a forged acceptance file with no receipt, even when the OR hash guard would pass`; landed `f6cdf604a25`
- [x] CHK-033 [P0] A candidate cannot select its own evaluator identity
  - **Evidence**: `ignores candidate frontmatter when selecting evaluator identity and rubric source`; landed `0d1827eef50`
- [x] CHK-034 [P0] `--approve` alone does not promote
  - **Evidence**: `is advisory-only and cannot invoke a canonical promotion command`; signed approval required by `requireApprovalReceipt`; landed `0d1827eef50`
- [x] CHK-035 [P0] A `../` topic ID and an external packet root are rejected before any `mkdir`
  - **Evidence**: `rejects unsafe topic id %s before creating any topic directory` and `refuses a caller-selected packet root outside configured authority before mkdir`; landed `f6cdf604a25`
- [x] CHK-036 [P1] `NaN`, `Infinity` and absent numerics fail closed
  - **Evidence**: `rejects an absent or non-finite agent %s value %j` plus absent/non-numeric/infinite aggregate tests via `Number.isFinite`; landed `0d1827eef50`
- [x] CHK-037 [P1] A text-less event stream is unscorable
  - **Evidence**: `marks a successful textless JSONL stream unscorable without throwing` in `sweep-benchmark.cjs`; landed `0d1827eef50`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each of the 13 scoped findings has a finding class recorded (`CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED`) from T001
  - **Evidence**: T001 output table in `tasks.md` lists all 13 IDs with a classification and a cited probe; landed `a28a39354b7`
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed for the "mutable local JSON treated as authority" pattern
  - **Evidence**: Every promote/ship/rollback/persist call site that trusted an unauthenticated local file was re-bound to the receipt/root path; grep for acceptance-JSON reads outside the receipt-bound path returns none new; landed `0d1827eef50`
- [x] CHK-FIX-003 [P0] Consumer inventory completed for `promote-candidate.cjs`, `rollback-candidate.cjs` and `persist-artifacts.cjs`
  - **Evidence**: CLI entry points, calling scripts, and the autonomous `deep-model-benchmark-auto.yaml` enumerated and validated against the receipt/root binding; landed `0d1827eef50`
- [x] CHK-FIX-004 [P0] Adversarial case: a receipt copied from a different candidate/target pair (cross-binding forgery), not only a stale one
  - **Evidence**: `rejects an approval receipt issued for a different candidate` and `rejects an approval receipt issued for a different target`, distinct from the stale-score test; landed `0d1827eef50`
- [x] CHK-FIX-005 [P1] The {13 findings} x {fixed, refuted, already-fixed} matrix is listed before completion is claimed
  - **Evidence**: Thirteen-Finding Evidence Matrix in `implementation-summary.md`; suite digest `0505321f55...`; reconciled `ab6aae0a714`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-007 [P1] Severity calibration carried into the spec and not re-escalated
  - **Evidence**: `spec.md` §2 Calibration block carries the operator/stale-local-file actor verbatim; not re-escalated to remote-attacker
- [x] CHK-040 [P0] Every write boundary is contained: candidate, archive, acceptance, event log, state
  - **Evidence**: `rejects an uncontained %s before creating output` five-boundary matrix via `assertAllBoundaries`; landed `0d1827eef50`
- [x] CHK-041 [P1] `--memory-save-payload-out` cannot overwrite a path outside the authorized root
  - **Evidence**: `rejects a payload output outside the authorized council root` via `assertMemorySavePayloadOutSafe`; landed `f6cdf604a25`
- [x] CHK-042 [P1] REMEDIATE requires authorization at both the CLI and the module boundary
  - **Evidence**: `REMEDIATE requires confirmation at both module and CLI boundaries` in `remediate-hook.cjs`; landed `0d1827eef50`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-006 [P0] No evidence string cites a bare run count or raw line number
  - **Evidence**: Evidence strings carry a named test plus the aggregate suite-content digest `0505321f555e3edab1a3145da4e5acce74cb4b022408b10c2f49867d1a1fa265` and a landing SHA
- [ ] CHK-008 [P0] `validate.sh --strict` exits 0 for this child
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <child> --strict` -> exit 0
  - **Open**: reconciled state validates `Errors: 0` with a single benign `CONTINUITY_FRESHNESS` `dirty_tree` warning; literal exit 0 clears only after the orchestrator commits this packet

- [x] CHK-050 [P0] The severity calibration is carried and not escalated
  - **Evidence**: `spec.md` §2 states the operator or stale-local-file actor
- [x] CHK-051 [P1] The chosen approval model for autonomous mode is recorded
  - **Evidence**: ADR-004 Accepted, advisory-only, under the operator's no-dark-to-live-authority-flip constraint (`decision-record.md`)
- [x] CHK-052 [P1] The evaluator identity authority is recorded
  - **Evidence**: ADR-002 records manifest-owned evaluator profile/name/epoch/source (`decision-record.md`)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-090 [P1] Temp files confined to `scratch/`
  - **Evidence**: Landed diff under `0d1827eef50` carries no temp file outside `scratch/`; scoped `git status` clean for out-of-scope paths
- [x] CHK-091 [P1] Work ran in an isolated worktree, so no concurrent session's files were touched
  - **Evidence**: Worktree `014-036-shadow-parity-fixtures`; landed commits `0d1827eef50`/`f6cdf604a25`/`a28a39354b7` scoped to in-packet runtime and docs
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md`
  - **Evidence**: ADR-001..ADR-003 present with context, alternatives, and consequences; landed `a28a39354b7`
- [x] CHK-101 [P1] Every ADR carries a terminal status
  - **Evidence**: ADR-001..ADR-004 all `Accepted`; none remains `Proposed` (`decision-record.md`)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
  - **Evidence**: Each ADR alternatives table names why the rejected option loses (`decision-record.md`)

- [x] CHK-103 [P1] ADR-001 receipt contents documented with the alternatives weighed
  - **Evidence**: ADR-001 alternatives table in `decision-record.md`
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Behavior and Regression Verification

- [ ] CHK-110 [P0] Both vitest projects re-run and reported as deltas against their baselines
  - **Evidence**: Before/after per project
  - **Open**: council delta captured; the improvement project has no valid full pre-edit baseline (T002/T020), so no honest whole-project delta exists yet
- [ ] CHK-111 [P1] Receipt write cost on a promotion recorded
  - **Evidence**: Wall-clock promotion time before and after
  - **Open**: only current receipt write cost recorded (100 writes, 485.381 ms total, 4.854 ms mean); no before/after promotion benchmark
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Landing Readiness

- [x] CHK-120 [P0] Rollback procedure documented and rehearsed
  - **Evidence**: `plan.md` §7 rollback section; rehearsed by the `rejects a backup whose bytes no longer match the authenticated rollback binding` probe; landed `f6cdf604a25`
- [x] CHK-121 [P1] Completion metadata reconciled across spec/plan/tasks/implementation-summary
  - **Evidence**: Cross-checked `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md`; all read In Progress — landed additive-dark, go-live gated; no doc claims a completion state another doc contradicts
- [x] CHK-122 [P0] The improvement-lane gate for `014` is recorded with its evidence
  - **Evidence**: Gate cites `rejects a stale approval receipt after the candidate bytes change` and `rejects a forged acceptance JSON that has no authenticated receipt`; landed `0d1827eef50`
- [ ] CHK-018 [P0] Additive-dark acceptance review passes before promotion enforcement goes live
  - **Evidence**: Recorded acceptance-review verdict authorizing the dark-to-live flip of promotion enforcement
  - **Open — GATED**: `[Deferred: gated — go-live blocked behind acceptance review]`. External sign-off this session cannot produce; the code is landed additive-dark and stays dark until this review passes.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [x] CHK-130 [P1] Receipt, fixture, and citation content contain no credential, token, or absolute machine-local path
  - **Evidence**: Contents reviewed; only repo-relative paths and content hashes present; landed `0d1827eef50`
- [x] CHK-131 [P1] The severity calibration block (`spec.md` §2) is carried verbatim wherever this child's findings are cited elsewhere
  - **Evidence**: Grep for the calibration text confirms verbatim reuse where cited
- [x] CHK-132 [P2] No promotion or rollback test writes outside its fixture target tree
  - **Evidence**: Test setup review confirms no real canonical target path appears in any test; landed `0d1827eef50`
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [x] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are synchronized at close
  - **Evidence**: Cross-read confirms all four agree on In Progress — landed additive-dark, go-live gated; no contradicting completion state
- [x] CHK-141 [P1] `decision-record.md` records ADR-001 through ADR-003 in terms a future reader can cite without re-deriving them
  - **Evidence**: `decision-record.md` ADR-001..ADR-003 reviewed for citability; landed `a28a39354b7`
- [x] CHK-142 [P2] The reserved ADR-004 approval-model decision states the disposition once answered, with no dangling reference to an unresolved model
  - **Evidence**: `decision-record.md` records ADR-004 Accepted, advisory-only; no dangling unresolved-model reference
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 27 | 20/27 |
| P1 Items | 22 | 20/22 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-08-18 (reconciled to landed additive-dark state)
**Verified By**: Orchestrator reconciliation (builder pass by Codex; not the independent actor required by REQ-U04)
**Status**: In Progress — code landed additive-dark; go-live gated behind acceptance review. The 13-finding runtime scope landed under `0d1827eef50`, `f6cdf604a25` and `a28a39354b7` (reconciled `ab6aae0a714`) with green named probes, and ADR-001 through ADR-004 are terminal. The packet is **not Complete**: CHK-018 (additive-dark acceptance review) and CHK-005 (independent adversarial verification) are blocking go-live gates and remain open, and the full improvement-project baseline/delta (CHK-002/CHK-004/CHK-010/CHK-110), the red-before proof (CHK-003), the before/after receipt cost (CHK-111), and the committed exit-0 validation (CHK-008) also remain open.

### Landed Builder Evidence

- Affected promotion-authority matrix: 8 files, 52 passed, exit 0.
- Sweep acceptance/runtime: 2 files, 25 passed, exit 0.
- Council project: 10 files, 118 passed, exit 0 (baseline: 109 passed, 2 failed, exit 1).
- REMEDIATE module/CLI plus state-machine wiring: 2 passed, exit 0.
- TypeScript: `tsc --noEmit --ignoreDeprecations 6.0`, exit 0.
- Aggregate suite-content SHA-256: `0505321f555e3edab1a3145da4e5acce74cb4b022408b10c2f49867d1a1fa265`.
- Landed commits: `0d1827eef50`, `f6cdf604a25`, `a28a39354b7`; status reconciled `ab6aae0a714`.
- Receipt write probe: 100 authenticated exclusive writes in 485.381 ms total, 4.854 ms mean, exit 0. This records current cost only; it is not a before/after promotion benchmark, so CHK-111 remains open.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | ADR-004 advisory-only model selected by the explicit no-dark-to-live-authority-flip task constraint | [x] Approved | 2026-08-15 |
| Additive-dark acceptance review | CHK-018 go-live gate: authorize the dark-to-live flip of promotion enforcement | [ ] Approved | |
| Independent verifier | REQ-U04 / CHK-005 adversarial pass targeted at whether any promotion path still trusts a mutable local file | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
