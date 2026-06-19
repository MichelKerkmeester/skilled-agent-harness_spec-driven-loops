---
title: "Verification Checklist: Eval-Harness Extension — Three Corpus Metric Lanes + Per-Class Promotion Gate (028/001 impl phase)"
description: "QA checklist for the eval-harness spine (C9-1 emit, C9-2 tagging, C9-3 three corpus metrics, A8-1/A8-2/A8-5/A8-4 per-class promotion gate): gate-zero precondition, per-candidate code/test/security items, and Level-3 architecture/deploy/compliance verification. All implementation items pending; Wave-0 (030) confirmed none shipped."
trigger_phrases:
  - "verification checklist eval harness extension"
  - "corpus metric lanes QA"
  - "promotion gate per class checklist"
  - "ECE Brier calibration checklist"
  - "gate verdict confusion checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/019-019-eval-harness-extension"
    last_updated_at: "2026-06-19T08:00:00+02:00"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored QA checklist for the eval-harness spine"
    next_safe_action: "Work the pre-implementation gates once gate-zero reindex is confirmed"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-019-replan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Eval-Harness Extension — Three Corpus Metric Lanes + Per-Class Promotion Gate (028/001 impl phase)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot close the phase until complete or explicitly deferred with evidence |
| **[P1]** | Required | Must be verified or documented as residual follow-up |
| **[P2]** | Optional | Can defer with rationale |

> **Status:** This is a re-plan. All seven candidates are PENDING (none shipped in Wave-0 — `../../../030-memory-search-intelligence-impl/spec.md` §14; 030's "C9" is the embedder-degrade candidate, not these C9-N metric lanes). Implementation/test items are unchecked until each candidate is built behind its gate.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Gate-zero confirmed: sibling `001-001-corpus-reindex-gate-zero` reindex run + `assertEmbeddingCoverage` passes.
  - **Evidence**: sibling-phase status + `memory_health` coverage; hard precondition for every recall/calibration/cold number.
- [ ] CHK-002 [P0] Live promotion-gate entrypoint symbol re-confirmed (research-cited `:547` drifted).
  - **Evidence**: grep of `lib/feedback/shadow-scoring.ts`; confirmed constants `:43,68,93,243` pinned.
- [x] CHK-003 [P1] Candidate seams identified before implementation.
  - **Evidence**: `spec.md` §3 and §14 list each seam (`ablation-framework.ts:554/486`, `eval-metrics.ts:29-45`, `lib/feedback/shadow-scoring.ts`, `shadow-evaluation-runtime.ts:137,160`).
- [x] CHK-004 [P1] Wave-0 done-evidence cross-checked; all seven candidates confirmed PENDING.
  - **Evidence**: `030-...-impl/spec.md` §14 + `git log --oneline 1ecc531431..ab5459fb6d` = zero eval-metric/gate-generalization commits; 030's "C9" = embedder-degrade.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Memory MCP typecheck passes after each candidate.
  - **Evidence**: `npm run typecheck` in `.opencode/skills/system-spec-kit/mcp_server` exits 0.
- [ ] CHK-011 [P0] Memory MCP build passes after each candidate.
  - **Evidence**: `npm run build` exits 0.
- [ ] CHK-012 [P1] Existing 12 ranking metrics byte-identical when the new lanes are off.
  - **Evidence**: ranking-ablation baseline byte-check recorded in `implementation-summary.md`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] C9-1 per-query diagnostic snapshot (verdict + per-result confidence + tier/created_at) emitted and tested.
  - **Evidence**: snapshot-emit test; ranking metrics unchanged when lanes off.
- [ ] CHK-021 [P0] C9-2 label views (citability/binary/tier) derived in one DB-join and tested.
  - **Evidence**: label-view test; "expect non-citable" sourced from the `hard_negative` category (no grade-0 rows).
- [ ] CHK-022 [P0] C9-3 three corpus metrics implemented + fixture-tested.
  - **Evidence**: confusion + P/R/F1; ECE + Brier + reliability bins vs a reliability diagram; cold-rate + cold-precision.
- [ ] CHK-023 [P0] A8-1 class-parameterized gate scores ≥2 classes off one spine; ranking class unregressed.
  - **Evidence**: per-class panel test; ledger records `candidate_class` + metric-JSON; ranking-class regression test.
- [ ] CHK-024 [P1] A8-2 CLASS-G panel produces a promote signal sufficient to graduate isotonic on evidence.
  - **Evidence**: ECE/Brier fixture test; the gate that was previously missing now exists.
- [ ] CHK-025 [P1] A8-5 golden-set label routing replaces `adaptive_signal_events` with no silent cycle-skip.
  - **Evidence**: label-routing test; cycle no longer skipped when signals cancel.
- [ ] CHK-026 [P1] A8-4 promote-on-evidence flag lifecycle encoded.
  - **Evidence**: `isOptInEnabled`→`isFeatureEnabled`→rollback transitions tested; reuses the existing flag mechanism.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each candidate has a final disposition in `spec.md` §14 (DONE with commit, or PENDING with gate).
- [ ] CHK-FIX-002 [P0] Deferred items name their gate (gate-zero / data-backfill / shared-infra) and path.
- [ ] CHK-FIX-003 [P0] The existing ranking ablation path is byte-identical when the new lanes are off (additive-only).
- [ ] CHK-FIX-004 [P0] No recall/calibration/cold number reported before gate-zero is met.
- [x] CHK-FIX-005 [P1] Affected-surface axes documented.
  - **Evidence**: `plan.md` affected-surface table names the harness + gate seams.
- [ ] CHK-FIX-006 [P1] Ranking-baseline classified before closeout.
- [ ] CHK-FIX-007 [P1] Evidence pinned to commits and commands.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No secrets introduced; changes are eval-metric/promotion-gate logic only.
- [ ] CHK-041 [P1] New metrics read only golden-set + corpus rows already accessible to the eval harness.
  - **Evidence**: C9-2 join reads `memory_index`; no new external data source.
- [ ] CHK-042 [P1] The gate's promote path does not auto-flip a production flag without ≥2 clean cycles.
  - **Evidence**: A8-4 lifecycle requires the cycle threshold before `isFeatureEnabled`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] `plan.md` covers all seven candidates + the gate-zero precondition.
  - **Evidence**: `plan.md` phase, dependency, and rollback tables.
- [x] CHK-051 [P1] `tasks.md` has a task per candidate with its gate.
  - **Evidence**: T004-T010 map to the seven candidates; T001-T003 are setup.
- [x] CHK-052 [P1] Load-bearing decisions captured in `spec.md` §13 + §12.
  - **Evidence**: forced-linear order, additive-only, A8-3 rescoped-out, ECE bin scheme open question.
- [ ] CHK-053 [P1] `implementation-summary.md` records shipped/deferred/verification once implementation begins.
- [x] CHK-054 [P2] `description.json` / `graph-metadata.json` regeneration deferred to generate-context.js.
  - **Evidence**: this re-plan authored the spec docs only.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Only this phase's scoped docs are authored.
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md` under `019-019-eval-harness-extension/`.
- [x] CHK-061 [P1] The Wave-0 record (030) and the sibling gate-zero phase are not modified.
  - **Evidence**: 030 is read-only done-evidence; sibling 001 owns the reindex; no edits made.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 (re-plan; implementation pending) |
| P1 Items | 17 | 8/17 (doc/seam gates done) |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-19
**Verified By**: claude-opus-4-8 (re-plan author)
**Scope**: Planning re-plan for the seven PENDING eval-harness-spine candidates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions are documented.
  - **Evidence**: `plan.md` §3 + `spec.md` §13 cover the additive-host pattern and the single-gate per-class panel.
- [x] CHK-101 [P1] Candidate dispositions have a status (DONE/PENDING + gate).
  - **Evidence**: `spec.md` §14 status table.
- [x] CHK-102 [P1] Alternatives and rejection rationale documented.
  - **Evidence**: A8-3 recall-union panel rescoped out (refuted headline); second-gate vs per-class-panel decided in favor of one spine.
- [ ] CHK-103 [P2] Migration path documented where needed.
  - **Evidence**: no schema migration in the lanes; the gate ledger column addition (if taken) is additive (open question).
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

- [ ] CHK-110 [P1] No benchmark-gated number is reported before gate-zero.
  - **Evidence**: every recall/calibration/cold number waits on the sibling reindex + coverage guard.
- [ ] CHK-111 [P1] Byte-identical default behavior preserved where required.
  - **Evidence**: existing ranking ablation unchanged when the new lanes are off.
- [x] CHK-112 [P2] Full benefit benchmark acknowledged as unmeasured.
  - **Evidence**: no candidate has a measured before/after number; the harness is what enables the first one (structural inference only).
- [ ] CHK-113 [P1] Touched test suites run within local command limits.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented.
  - **Evidence**: `plan.md` enhanced-rollback lists per-candidate revert; C9 lanes + A8 panel kept separable.
- [ ] CHK-121 [P1] Flag/lifecycle decisions documented.
  - **Evidence**: promote-on-evidence = `isOptInEnabled`→`isFeatureEnabled`→rollback; ablation behind `SPECKIT_ABLATION=true`.
- [ ] CHK-122 [P1] Monitoring impact documented.
  - **Evidence**: new corpus metrics + a generalized promotion ledger; no new background state.
- [x] CHK-123 [P2] Runbook update not required for this re-plan.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [x] CHK-130 [P1] No schema migration authored in the lanes.
  - **Evidence**: label tagging is a derived view; any gate-ledger column addition is additive (open question).
- [ ] CHK-131 [P1] New metrics read only data the eval harness already accesses.
  - **Evidence**: golden set + `memory_index` join; no new external source.
- [x] CHK-132 [P2] License review not required.
- [x] CHK-133 [P2] Data handling remains internal.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [x] CHK-140 [P1] Level-3 docs exist.
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md` present.
- [ ] CHK-141 [P1] Packet docs synchronized with `spec.md` §14 as candidates land.
- [x] CHK-142 [P2] User-facing docs not required.
- [x] CHK-143 [P2] Knowledge transfer documented.
  - **Evidence**: research cross-refs name the 008-retrieval-evaluation research, synthesis/08, and the gate-zero sibling.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| claude-opus-4-8 | Re-plan author | Planning complete; implementation pending | 2026-06-19 |
| User | Packet owner | Re-plan only; no implementation requested | 2026-06-19 |
<!-- /ANCHOR:sign-off -->
