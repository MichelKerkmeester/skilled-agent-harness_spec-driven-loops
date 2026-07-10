---
title: "Feature Specification: Phase 4: confidence-calibration-labeled-set"
description: "[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]"
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/016-search-and-output-intelligence/004-confidence-calibration-labeled-set"
    last_updated_at: "2026-06-17T09:05:00Z"
    last_updated_by: "implementer"
    recent_action: "Shipped (A) 0.45/0.55 rebalance + (B) flag-gated calibration infra; spec superseded"
    next_safe_action: "Collect labeled live traffic, refit, validate before enabling calibration flag"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-calibration.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/confidence-calibration.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-027-002-017-004-confidence-calibration-labeled-set"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: confidence-calibration-labeled-set

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-17 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 7 |
| **Predecessor** | 003-generic-query-deep-routing |
| **Successor** | 005-cosine-topn-reorder |
| **Handoff Criteria** | (A) 0.45/0.55 rebalance default-ON, existing assertions green; (B) calibration infra flag-gated default-OFF (no-op in production) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the search-and-output-intelligence implementation: confidence calibration (Problem 6 / S4).

**Scope Boundary**: The per-result `confidence.value` weight blend and the calibration fit/apply infrastructure. The S2 `assessRequestQuality` request-level verdict is left intact.

**Dependencies**:
- `resolveCalibrationScore` (the absolute cosine prior) - the relevance signal the rebalance weights up.

**Deliverables**:
- **(A) default-ON**: rebalance `value = heuristicValue*0.45 + scorePrior*0.55` (was 0.6/0.4), via named constants `WEIGHT_HEURISTIC`/`WEIGHT_SCORE_PRIOR` (sum 1.0), so relevance dominates the confidence band.
- **(B) flag-gated default-OFF, UNVALIDATED**: isotonic (PAV) `fitCalibration`/`applyCalibration`, a labeled-set loader, and a model file loader, mapped through only when `SPECKIT_CONFIDENCE_CALIBRATION` is ON and a readable model is configured - otherwise a no-op.
- A **CORPUS-DERIVED PROXY** starter labeled set (not human-judged); the real ~50-100 judged pairs from live traffic are the documented FOLLOW-UP before any model is trusted.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Per-result `confidence.value` was only ~40% absolute relevance, so a strong-but-isolated high-cosine hit could be capped at "medium" - dragged down by weak heuristic signals (the 0.6/0.4 blend favoured the heuristic).

### Purpose
Make relevance dominate per-result confidence (default-ON rebalance), and stand up the calibration machinery (default-OFF, unvalidated) so a real labeled set can later refine it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- (A) Weight rebalance to `WEIGHT_HEURISTIC = 0.45` / `WEIGHT_SCORE_PRIOR = 0.55` named constants (default-ON).
- (B) Isotonic fit/apply, labeled-set loader, model file loader; flag-gated default-OFF.
- A corpus-derived proxy starter labeled set + demo model (under `assets/`).

### Out of Scope
- Enabling calibration in production - default-OFF until a real labeled set is collected and validated.
- A human-judged labeled set - the proxy is a weak stand-in; real judged pairs are the documented follow-up.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/confidence-scoring.ts` | Modify | (A) rebalance to 0.45/0.55 named constants; (B) lazy model-loading + `maybeCalibrate()` hook |
| `mcp_server/lib/search/confidence-calibration.ts` | Create | (B) isotonic fit/apply, labeled-set loader, model file loader |
| `mcp_server/lib/search/search-flags.ts` | Modify | (B) `isConfidenceCalibrationEnabled()` (default-OFF) + model-path getter |
| `mcp_server/tests/confidence-calibration.vitest.ts` | Create | (B) fit/apply math, loader validation, default-OFF wiring guarantee |
| `004-…/assets/{fit-calibration.mjs, confidence-labeled-set.starter.json, confidence-calibration-model.starter.json}` | Create | (B) proxy seed generator + 100-pair proxy set + demo model |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | (A) Per-result confidence must be monotonic in relevance (rebalance default-ON) | `value = heuristic*0.45 + scorePrior*0.55`; existing absolute-relevance + d5 assertions stay green |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | (B) Calibration infra must be a no-op in production | Default-OFF unless `SPECKIT_CONFIDENCE_CALIBRATION` ON AND a readable model is configured; wiring-guarantee test |
| REQ-003 | (B) The starter labeled set is clearly a proxy, not trusted | Documented as corpus-derived (Jaccard `rawValue`); real judged pairs are the follow-up before trusting any model |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A strong isolated cosine hit reads "good"/"high" instead of being capped at "medium" by weak heuristics.
- **SC-002**: Production confidence is the rebalance-only value (calibration default-OFF, proven by the wiring-guarantee test).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `resolveCalibrationScore` (absolute cosine prior) | The relevance signal weighted up by the rebalance | Already live (packet 015) |
| Risk | The rebalance shifts confidence values upward for relevance-strong hits | Med | All qualitative contracts still hold; no existing assertion broke under the new band |
| Risk | A model fit on the proxy set could mis-rank if trusted | High if enabled | (B) is default-OFF + unvalidated; real judged pairs required before enabling |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. The real ~50-100 judged pairs from live `memory_search` traffic (to refit and validate before enabling the flag) are the documented FOLLOW-UP - see `implementation-summary.md`.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
