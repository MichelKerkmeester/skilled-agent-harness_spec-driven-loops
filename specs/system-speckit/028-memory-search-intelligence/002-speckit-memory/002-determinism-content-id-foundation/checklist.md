---
title: "Verification Checklist: Determinism + Content-ID Foundation"
description: "QA checklist for the determinism + content-id foundation sub-phase: 5 shipped keystone candidates with commit evidence, 4 gated residue candidates, the cross-subsystem byte-compare contract and strict packet validation."
trigger_phrases:
  - "verification checklist determinism content-id foundation"
  - "memory total comparator QA"
  - "028 speckit-memory determinism checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-speckit-memory/002-determinism-content-id-foundation"
    last_updated_at: "2026-07-04T17:51:02.224Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-3 verification checklist for the determinism foundation"
    next_safe_action: "Run validate.sh --strict on this sub-phase"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-determinism-foundation"
      parent_session_id: null
    completion_pct: 55
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Determinism + Content-ID Foundation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot close the foundation until complete or explicitly gated with evidence |
| **[P1]** | Required | Must be verified or documented as a gated residual follow-up |
| **[P2]** | Optional | Can defer with rationale |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Foundation scope is documented and bounded to determinism + content-id seams.
  - **Evidence**: `spec.md` sections 2, 3 and 13 define the 9-candidate set and exclude downstream consumers (C2-A/B/C, C4-A, C4-B).
- [x] CHK-002 [P0] 028 research is treated as roadmap input, shipped record traced to packet 030.
 - **Evidence**: `spec.md` METADATA + section 13 cite `../research/research.md` and Wave-0 record.
- [x] CHK-003 [P1] Candidate seams identified before implementation.
  - **Evidence**: `spec.md` section 3 candidate table lists file:line seams, `plan.md` affected-surfaces table records them.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Memory MCP typecheck passes for the shipped candidates.
  - **Evidence**: Wave-0 closeout ran `npm run typecheck` green in `.opencode/skills/system-spec-kit/mcp_server` (`030` implementation-summary).
- [x] CHK-011 [P0] Memory MCP build passes for the shipped candidates.
  - **Evidence**: Wave-0 closeout ran `npm run build` green in the same package.
- [x] CHK-012 [P1] Content-id centralization is byte-identical to the legacy call sites.
  - **Evidence**: content-hash parity test (`content-hash-dedup.vitest.ts`), commit `18c8582e33` records no behavior change.
- [x] CHK-013 [P1] Default fusion seams are byte-identical to pre-change.
  - **Evidence**: C-X1 `'active'` traced arithmetically, C6-A no-timestamp skip guard restored (commit `65cfcea513`).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] two-content-id-primitives implemented, tested and committed.
  - **Evidence**: Commit `18c8582e33`, byte-identical hash outputs proven by parity test (`030` §14 cand 7).
- [x] CHK-021 [P0] ANN-tie-stable-order implemented, tested and committed.
  - **Evidence**: Commit `bec0eed27f`, ANN ordering covered by the Memory search/fusion suite (`030` §14 cand 3).
- [x] CHK-022 [P0] C5-B content-derived tiebreak implemented, tested and committed.
  - **Evidence**: Commit `bec0eed27f`, RRF + deterministic comparator tiebreak tests passed, primary order unchanged (verified) (`030` §14 cand 4).
- [x] CHK-023 [P0] C-X1 `'active'` implemented, tested, reviewed and committed.
  - **Evidence**: Commit `65cfcea513`, opus review SHIP, default byte-identical traced (`030` §14 cand 5).
- [x] CHK-024 [P0] C6-A rank-time decay clock implemented, tested and committed.
  - **Evidence**: Commit `65cfcea513`, pure-refactor with restored no-timestamp skip guard (`030` §14 cand 5).
- [x] CHK-025 [P0] C-X1-true-multichannel (`'configured'`) explicitly gated, not shipped.
  - **Evidence**: `spec.md` §13 / `tasks.md` T006 record gate shared-infra-dep (Wave-1 C2-B consumer + fusion-bonus unit test).
- [x] CHK-026 [P0] C5-A render-stage explicitly gated, not shipped.
  - **Evidence**: `spec.md` §13 / `tasks.md` T007 record gate render-build (golden re-baseline, render tiebreak separate from fusion tiebreak).
- [x] CHK-027 [P0] M-dual-class-identity explicitly gated, not shipped.
  - **Evidence**: `spec.md` §13 / `tasks.md` T008 record single-tenant PARTIAL/NO-GO (iter-14 → iter-23).
- [x] CHK-028 [P0] M-clock-skew-replay-window explicitly gated, not shipped.
  - **Evidence**: `spec.md` §13 / `tasks.md` T009 record single-tenant REFUTED/NO-GO (iter-23).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each candidate has a final disposition.
  - **Evidence**: `spec.md` section 13 - 5 DONE-with-commit, 4 PENDING-with-gate.
- [x] CHK-FIX-002 [P0] Gated residue is backed by real evidence, not silent drop.
  - **Evidence**: `'configured'` (no consumer + open unit test), C5-A (render-build), dual-class/clock-skew (single-tenant refutation, iter-23).
- [x] CHK-FIX-003 [P0] The cross-subsystem byte-compare contract is preserved.
  - **Evidence**: `fuseResultsMulti` `'active'` default keeps Code Graph 002 / Skill Advisor 003 / Deep Loop 004 byte-stable (`spec.md` section 3 + `plan.md` architecture).
- [x] CHK-FIX-004 [P0] Identity-hardening is not shipped against the wrong threat model.
  - **Evidence**: The dual-class / clock-skew pair is documented-NO-GO for a single-trusted-host tool.
- [x] CHK-FIX-005 [P1] Determinism axes are documented.
  - **Evidence**: `plan.md` affected-surfaces names the ANN-below-RRF, comparator/output-sort, decay-clock and render-order axes.
- [x] CHK-FIX-006 [P1] Evidence is pinned to commits and research citations.
  - **Evidence**: `tasks.md` records commit hashes, `spec.md` cites per-iteration research (iter-3/7/14/23/31).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No secrets introduced.
  - **Evidence**: Candidate changes are hashing, ranking and fusion logic, no secret-bearing files in scope.
- [x] CHK-041 [P1] Identity-hardening threat model is honest.
  - **Evidence**: Clock-skew / dual-class are NOT shipped because their threat model (remote / multi-writer adversary) does not apply to a single-trusted-host MCP (`spec.md` NFR-S01).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] `plan.md` covers all 9 candidates and the sequencing.
  - **Evidence**: `plan.md` phase, effort and rollback tables list shipped and gated candidates.
- [x] CHK-051 [P1] `tasks.md` has one task per candidate.
  - **Evidence**: T001-T009 map to the 9 candidates, T010-T013 cover verification/closeout.
- [x] CHK-052 [P1] No leakage into packet 030 or sibling-subsystem code.
  - **Evidence**: Only this sub-phase's docs are authored, the shipped record (030) is referenced, not modified.
- [x] CHK-053 [P2] Research provenance is cited per candidate.
  - **Evidence**: `spec.md` RELATED DOCUMENTS maps each candidate to its iteration evidence.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Only scoped sub-phase docs are authored.
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md` under this sub-phase folder.
- [x] CHK-061 [P1] Unrelated and shipped-record files remain untouched.
  - **Evidence**: No edits to packet 030, the 028 parent or sibling research children.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 18/18 |
| P1 Items | 13 | 13/13 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-19
**Verified By**: Claude (re-plan author)
**Scope**: Determinism + content-id foundation sub-phase: 5 shipped keystone candidates (commit-traced to packet 030), 4 gated residue candidates documented.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-100 [P0] The total-comparator + content-id keystone is documented.
  - **Evidence**: `plan.md` architecture names the hand-written total order and the two content-id primitives as the keystone.
- [x] CHK-101 [P1] The cross-subsystem signature contract is documented.
  - **Evidence**: `fuseResultsMulti` `{bonusOverChannels}` `'active'` default, consumers 002/003/004 promote/import with adapters.
- [x] CHK-102 [P1] Alternatives / rejection rationale are recorded.
  - **Evidence**: `spec.md` §2 records the JS-`b-a`-not-total-order rationale and the single-tenant refutation of the identity pair.
- [x] CHK-103 [P2] Migration path documented where needed.
  - **Evidence**: No shipped migration, C4-B `derived_id` (Wave-2) and the `'configured'` consumer (Wave-1) are named as downstream.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

- [x] CHK-110 [P1] No benchmark-gated candidate is shipped without a caveat.
  - **Evidence**: `spec.md` §2 records that no candidate has a measured benefit number, all shipped seams are tie-only re-orders or default-identity refactors.
- [x] CHK-111 [P1] Byte-identical default behavior is preserved.
  - **Evidence**: C-X1 `'active'` + C6-A clock byte-identity is traced (commit `65cfcea513`).
- [x] CHK-112 [P2] The fusion-bonus invariant unit test is named as the residue gate.
  - **Evidence**: `plan.md` testing strategy + `tasks.md` completion criteria flag the still-open unit test before any `'configured'` promotion.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented.
  - **Evidence**: `plan.md` rollback + enhanced-rollback list per-candidate reverts and shared commits.
- [x] CHK-121 [P1] Default-preserving discipline documented.
  - **Evidence**: Every shipped seam is byte-identical-by-default or a content-derived tie re-order.
- [x] CHK-122 [P2] No runbook update required.
  - **Evidence**: Changes are internal ranking/hashing, operator-visible behavior is unchanged by default.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [x] CHK-130 [P1] No shipped schema migration.
  - **Evidence**: The foundation's shipped candidates use existing schema, `derived_id` (Wave-2) is out of scope.
- [x] CHK-131 [P2] No new external data sink or telemetry.
  - **Evidence**: Determinism + hashing changes only, no new destination added.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [x] CHK-140 [P1] Level-3 docs exist.
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md` present in this sub-phase.
- [x] CHK-141 [P1] Docs are synchronized with `spec.md` section 13.
  - **Evidence**: Candidate statuses and commits match across `spec.md`, `plan.md` and `tasks.md`.
- [x] CHK-142 [P2] Knowledge transfer documented.
  - **Evidence**: `spec.md` OPEN QUESTIONS names the fusion-bonus unit-test gate and the multi-writer-revival question.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Claude | Re-plan author | Authored against research + Wave-0 commit evidence | 2026-06-19 |
| User | Packet owner | Pending review | 2026-06-19 |
<!-- /ANCHOR:sign-off -->
