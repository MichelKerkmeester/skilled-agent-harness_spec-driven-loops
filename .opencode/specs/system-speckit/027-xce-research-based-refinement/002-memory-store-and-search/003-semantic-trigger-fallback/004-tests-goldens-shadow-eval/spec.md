---
title: "004 — Tests, Goldens + Shadow Eval"
description: "Trigger goldens fixture, cold-start/latency/threshold-tuning/backfill-resume tests, the 5 SPECKIT_SEMANTIC_TRIGGERS flags in ENV_REFERENCE, shadow telemetry, and the shadow→union promotion gate evidence."
trigger_phrases:
  - "027 phase 004 goldens shadow eval"
  - "trigger goldens fixture"
  - "shadow to union promotion"
  - "semantic trigger flags"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/004-tests-goldens-shadow-eval"
    last_updated_at: "2026-06-10T10:50:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Added synthetic goldens, tests, and flag docs"
    next_safe_action: "Run live embedding eval before union promotion"
    blockers: ["Union promotion blocked pending live eval evidence"]
    key_files: ["spec.md", "plan.md", "tasks.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-007-phase-split"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 004 — Tests, Goldens + Shadow Eval

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Completed; union promotion remains operator policy (env-driven mode, no code-enforced gate) |
| **Created** | 2026-06-06 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-hybrid-handler |
| **Successor** | None |
| **Handoff Criteria** | Goldens metrics pass; flags documented; shadow telemetry recorded; shadow→union promotion gate evidence captured. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** (final) of the semantic trigger fallback decomposition (parent `004-semantic-trigger-fallback`).

**Scope Boundary**: Evaluation, telemetry, flag documentation, and the promotion gate. No new runtime behavior beyond shadow telemetry; it closes out the feature.

**Dependencies**:
- `003-hybrid-handler` (the wired handler the goldens + telemetry exercise).

**Deliverables**:
- Trigger goldens fixture (~40 phrases × {exact, paraphrase, distractor}; CJK + Latin).
- Cold-start, latency-budget, threshold-tuning, and resumable-backfill tests.
- The 5 `SPECKIT_SEMANTIC_TRIGGERS*` flags documented in `ENV_REFERENCE.md`.
- Shadow telemetry + the shadow→union promotion gate evidence.

**Fixture honesty**: the goldens use deterministic synthetic vectors to validate matcher gates, metrics, and telemetry machinery. They do not represent live 768d embedding recall. Union promotion remains blocked pending live-profile evidence.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Without a goldens fixture, latency gate, and shadow telemetry, the semantic stage cannot be safely tuned or promoted from shadow to union. Thresholds tuned for 1024d Voyage must be re-validated for the active 768d Nomic profile, and union mode stays off as operator policy until evidence passes — mode selection is env-driven (`SPECKIT_SEMANTIC_TRIGGERS_MODE`); no code-enforced promotion gate exists.

### Purpose
Establish the evaluation harness, document the flags, capture shadow telemetry, and gate shadow→union promotion on false-positive, recall, latency, cost, and rollback evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `mcp_server/tests/fixtures/trigger-goldens.json` (NEW): ~40 phrases × {exact, paraphrase, distractor}, CJK + Latin, expected match-source per fixture.
- `trigger-cold-start.vitest.ts`, `trigger-latency-budget.vitest.ts`, `trigger-threshold-tuning.vitest.ts`, `trigger-backfill-resume.vitest.ts` (NEW).
- Document the 5 `SPECKIT_SEMANTIC_TRIGGERS*` flags (master, mode, threshold, margin, max) in `mcp_server/ENV_REFERENCE.md` with defaults preserved.
- Shadow telemetry: log would-have-fired hits without activation when `_MODE=shadow`; record threshold-band distribution.
- Shadow→union promotion checklist evidence (FP, recall, latency, cost, rollback).

### Out of Scope
- The matcher and handler implementations - owned by `002` / `003`.
- Backfill implementation - owned by `001` (this phase only tests resumability).
- Changing the default flag state (stays off / shadow-first).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/tests/fixtures/trigger-goldens.json` | Create | Goldens fixture (exact/paraphrase/distractor) |
| `mcp_server/tests/trigger-cold-start.vitest.ts` | Create | Uncached phrase skipped silently |
| `mcp_server/tests/trigger-latency-budget.vitest.ts` | Create | 30-50ms PASS / 100ms WARN preserved |
| `mcp_server/tests/trigger-threshold-tuning.vitest.ts` | Create | Threshold-band distribution from shadow telemetry |
| `mcp_server/tests/trigger-backfill-resume.vitest.ts` | Create | Interrupted backfill restarts without duplicate ready rows |
| `mcp_server/ENV_REFERENCE.md` | Modify | Document 5 semantic-trigger flags |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-012 | Trigger goldens fixture (~40 phrases × 3 variants) for threshold tuning | Fixture exists; tests load and verify all variants; CJK + Latin covered |
| REQ-010 | Shadow telemetry + shadow→union promotion gate | Threshold-band buckets populated; union promotion is operator policy gated on FP, recall, latency, cost, rollback evidence (documented bar, not code-enforced) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Document the 5 `SPECKIT_SEMANTIC_TRIGGERS*` flags | All 5 in `ENV_REFERENCE.md` with defaults preserved |
| REQ-011 | Cold-start handling — uncached phrases skipped silently; backfill on next scan | Missing embedding -> no semantic hit; semantic trigger shadow stats report `no_query_embedding` |
| REQ-013 | Latency budget preserved with shadow stage active | p95 within 100ms WARN budget |
| REQ-014 | CJK + Latin trigger phrases both covered (re-validate at 768d Nomic) | Fixture covers CJK paraphrases |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Synthetic goldens: exact precision = 1.0; paraphrase recall ≥ 0.7; distractor FP ≤ 0.05. Live 768d retuning remains a promotion blocker.
- **SC-002**: Latency p95 within WARN budget; 5 flags documented; shadow→union promotion evidence recorded before any union rollout.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Threshold drift: 1024d Voyage values don't transfer to 768d Nomic | High | Re-tune from goldens at 768d before any union promotion |
| Risk | Premature union promotion | High | Promotion checklist gate (FP/recall/latency/cost/rollback) blocks union |
| Dependency | `003-hybrid-handler` | High | Goldens + telemetry exercise the wired handler |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What trigger golden set defines acceptable false-activation rate for semantic-only matches? (inherited from parent 007)
- What recall-lift threshold over baseline justifies union promotion at 768d?
<!-- /ANCHOR:questions -->
