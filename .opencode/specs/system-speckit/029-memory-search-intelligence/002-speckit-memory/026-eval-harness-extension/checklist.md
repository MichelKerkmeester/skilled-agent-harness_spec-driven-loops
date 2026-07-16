---
title: "Verification Checklist: Eval-Harness Extension - Three Corpus Metric Lanes + Per-Class Promotion Gate (028/001 impl phase)"
description: "QA checklist for the eval-harness spine (C9-1 emit, C9-2 tagging, C9-3 three corpus metrics, A8-1/A8-2/A8-5/A8-4 per-class promotion gate): C9 lanes implemented with deterministic tests, A8 gate work pending schema/live validation."
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
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/026-eval-harness-extension"
    last_updated_at: "2026-07-04T17:51:00.031Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified C9 eval-harness metric lanes"
    next_safe_action: "Run strict packet validation, then plan A8 as separate schema/live-gate work"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-019-replan"
      parent_session_id: null
    completion_pct: 43
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Eval-Harness Extension - Three Corpus Metric Lanes + Per-Class Promotion Gate (028/001 impl phase)

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

> **Status:** C9-1/C9-2/C9-3 are implemented with deterministic tests. A8-1/A8-2/A8-5/A8-4 remain pending because their acceptance criteria require generalized ledger/schema work and live promotion-gate validation.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Gate-zero confirmed: sibling `001-corpus-reindex-gate-zero` reindex run + `assertEmbeddingCoverage` passes.
  - **Evidence**: user provided gate-zero embedding coverage = 100%, not locally re-run because live reindex/scan was explicitly forbidden.
- [x] CHK-002 [P0] Live promotion-gate entrypoint symbol re-confirmed (research-cited `:547` drifted).
  - **Evidence**: `rg` + file read confirmed `evaluatePromotionGate`, `MIN_NDCG_IMPROVEMENT`, `meanNdcgDelta`, `is_improvement` and `selectHoldoutQueries` in `lib/feedback/shadow-scoring.ts`.
- [x] CHK-003 [P1] Candidate seams identified before implementation.
  - **Evidence**: `spec.md` §3 and §14 list each seam (`ablation-framework.ts:554/486`, `eval-metrics.ts:29-45`, `lib/feedback/shadow-scoring.ts`, `shadow-evaluation-runtime.ts:137,160`).
- [x] CHK-004 [P1] Wave-0 done-evidence cross-checked, all seven candidates confirmed PENDING.
  - **Evidence**: `030-...-impl/spec.md` §14 + `git log --oneline 1ecc531431..ab5459fb6d` = zero eval-metric/gate-generalization commits, 030's "C9" = embedder-degrade.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Memory MCP typecheck passes after each candidate.
  - **Evidence**: baseline and final `npm run typecheck` in `.opencode/skills/system-spec-kit/mcp_server` exited 0.
- [ ] CHK-011 [P0] Memory MCP build passes after each candidate.
  - **Evidence**: `npm run build` exits 0.
- [x] CHK-012 [P1] Existing 12 ranking metrics byte-identical when the new lanes are off.
  - **Evidence**: new diagnostics are opt-in via `includeDiagnosticSnapshots`, existing focused ablation tests pass before/after. Live byte benchmark deferred by user constraint.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] C9-1 per-query diagnostic snapshot (verdict + per-result confidence + tier/created_at) emitted and tested.
  - **Evidence**: `tests/ablation-framework.vitest.ts` diagnostic snapshot test, existing array-return callers remain compatible.
- [x] CHK-021 [P0] C9-2 label views (citability/binary/tier) derived in one DB-join and tested.
  - **Evidence**: `tests/eval-metrics.vitest.ts` label-view fixture and `tests/ablation-framework.vitest.ts` in-memory metadata lookup, non-citable labels use `hard_negative`.
- [x] CHK-022 [P0] C9-3 three corpus metrics implemented + fixture-tested.
  - **Evidence**: `tests/eval-metrics.vitest.ts` covers confusion + P/R/F1, ECE + Brier + reliability bins and cold-rate + cold-precision.
- [ ] CHK-023 [P0] A8-1 class-parameterized gate scores ≥2 classes off one spine, ranking class unregressed.
  - **Evidence**: per-class panel test, ledger records `candidate_class` + metric-JSON, ranking-class regression test.
- [ ] CHK-024 [P1] A8-2 CLASS-G panel produces a promote signal sufficient to graduate isotonic on evidence.
  - **Evidence**: ECE/Brier fixture test, the gate that was previously missing now exists.
- [ ] CHK-025 [P1] A8-5 golden-set label routing replaces `adaptive_signal_events` with no silent cycle-skip.
  - **Evidence**: label-routing test, cycle no longer skipped when signals cancel.
- [ ] CHK-026 [P1] A8-4 promote-on-evidence flag lifecycle encoded.
  - **Evidence**: `isOptInEnabled`→`isFeatureEnabled`→rollback transitions tested, reuses the existing flag mechanism.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each candidate has a final disposition in `spec.md` §14 (DONE with commit, or PENDING with gate).
- [x] CHK-FIX-002 [P0] Deferred items name their gate (gate-zero / data-backfill / shared-infra) and path.
- [x] CHK-FIX-003 [P0] The existing ranking ablation path is byte-identical when the new lanes are off (additive-only).
- [x] CHK-FIX-004 [P0] No recall/calibration/cold number reported before gate-zero is met.
- [x] CHK-FIX-005 [P1] Affected-surface axes documented.
  - **Evidence**: `plan.md` affected-surface table names the harness + gate seams.
- [x] CHK-FIX-006 [P1] Ranking-baseline classified before closeout.
  - **Evidence**: live ranking-ablation baseline deferred by explicit no-live-benchmark constraint, static/focused-test baseline captured before edits.
- [x] CHK-FIX-007 [P1] Evidence pinned to commits and commands.
  - **Evidence**: no commit per user instruction, evidence is command-based (`npm run typecheck`, focused Vitest).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No secrets introduced, changes are eval-metric/promotion-gate logic only.
- [x] CHK-041 [P1] New metrics read only golden-set + corpus rows already accessible to the eval harness.
  - **Evidence**: C9-2 join reads `memory_index`, no new external data source.
- [ ] CHK-042 [P1] The gate's promote path does not auto-flip a production flag without ≥2 clean cycles.
  - **Evidence**: A8-4 lifecycle requires the cycle threshold before `isFeatureEnabled`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] `plan.md` covers all seven candidates + the gate-zero precondition.
  - **Evidence**: `plan.md` phase, dependency and rollback tables.
- [x] CHK-051 [P1] `tasks.md` has a task per candidate with its gate.
  - **Evidence**: T004-T010 map to the seven candidates, T001-T003 are setup.
- [x] CHK-052 [P1] Load-bearing decisions captured in `spec.md` §13 + §12.
  - **Evidence**: forced-linear order, additive-only, A8-3 rescoped-out, ECE bin scheme open question.
- [x] CHK-053 [P1] `implementation-summary.md` records shipped/deferred/verification once implementation begins.
- [x] CHK-054 [P2] `description.json` / `graph-metadata.json` regeneration deferred to generate-context.js.
  - **Evidence**: this re-plan authored the spec docs only.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Only this phase's scoped docs are authored.
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md` under `019-eval-harness-extension/`.
- [x] CHK-061 [P1] The Wave-0 record (030) and the sibling gate-zero phase are not modified.
  - **Evidence**: 030 is read-only done-evidence, sibling 001 owns the reindex, no edits made.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 9/14 (C9 done, A8/build items pending) |
| P1 Items | 17 | 14/17 (A8/live-operational items pending) |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-19
**Verified By**: Codex
**Scope**: C9 eval-harness metric lanes implemented, A8 gate generalization pending.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions are documented.
  - **Evidence**: `plan.md` §3 + `spec.md` §13 cover the additive-host pattern and the single-gate per-class panel.
- [x] CHK-101 [P1] Candidate dispositions have a status (DONE/PENDING + gate).
  - **Evidence**: `spec.md` §14 status table.
- [x] CHK-102 [P1] Alternatives and rejection rationale documented.
  - **Evidence**: A8-3 recall-union panel rescoped out (refuted headline), second-gate vs per-class-panel decided in favor of one spine.
- [x] CHK-103 [P2] Migration path documented where needed.
  - **Evidence**: A8-1 left pending because the generalized gate ledger requires schema design/migration.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

- [x] CHK-110 [P1] No benchmark-gated number is reported before gate-zero.
  - **Evidence**: no live recall/calibration/cold benchmark was run or reported.
- [x] CHK-111 [P1] Byte-identical default behavior preserved where required.
  - **Evidence**: diagnostics default off for direct `runAblation` callers, existing focused tests pass.
- [x] CHK-112 [P2] Full benefit benchmark acknowledged as unmeasured.
  - **Evidence**: no candidate has a measured before/after number, the harness is what enables the first one (structural inference only).
- [x] CHK-113 [P1] Touched test suites run within local command limits.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented.
  - **Evidence**: `plan.md` enhanced-rollback lists per-candidate revert, C9 lanes + A8 panel kept separable.
- [x] CHK-121 [P1] Flag/lifecycle decisions documented.
  - **Evidence**: promote-on-evidence remains pending behind A8, C9 diagnostics are opt-in and ablation remains behind `SPECKIT_ABLATION=true`.
- [x] CHK-122 [P1] Monitoring impact documented.
  - **Evidence**: new corpus metrics are optional report fields, no new background state.
- [x] CHK-123 [P2] Runbook update not required for this re-plan.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [x] CHK-130 [P1] No schema migration authored in the lanes.
  - **Evidence**: label tagging is a derived view, any gate-ledger column addition is additive (open question).
- [x] CHK-131 [P1] New metrics read only data the eval harness already accesses.
  - **Evidence**: golden set + `memory_index` join, no new external source.
- [x] CHK-132 [P2] License review not required.
- [x] CHK-133 [P2] Data handling remains internal.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [x] CHK-140 [P1] Level-3 docs exist.
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md` present.
- [x] CHK-141 [P1] Packet docs synchronized with `spec.md` §14 as candidates land.
- [x] CHK-142 [P2] User-facing docs not required.
- [x] CHK-143 [P2] Knowledge transfer documented.
  - **Evidence**: research cross-refs name the 008-retrieval-evaluation research, synthesis/08 and the gate-zero sibling.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Codex | Implementation agent | C9 implemented, A8 pending | 2026-06-19 |
| User | Packet owner | Requested code + unit tests only, no commit/live benchmark | 2026-06-19 |
<!-- /ANCHOR:sign-off -->
