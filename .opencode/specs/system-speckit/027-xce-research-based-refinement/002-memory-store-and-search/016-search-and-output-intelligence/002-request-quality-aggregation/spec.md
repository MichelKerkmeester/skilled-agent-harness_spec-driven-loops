---
title: "Feature Specification: Phase 2: request-quality-aggregation"
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
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/016-search-and-output-intelligence/002-request-quality-aggregation"
    last_updated_at: "2026-06-17T08:30:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Shipped top-dominant + margin-aware request-quality verdict; spec superseded"
    next_safe_action: "Rebuild mcp_server dist so the runtime picks up the source change"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/request-quality-aggregation.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-017-002-request-quality-aggregation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: request-quality-aggregation

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
| **Phase** | 2 of 7 |
| **Predecessor** | 001-token-budget-truncation-safety |
| **Successor** | 003-generic-query-deep-routing |
| **Handoff Criteria** | "good" disjunction lands (top-dominant + margin-aware); quality ratio capped at head K=5; recall-expansion no longer depresses the verdict |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the search-and-output-intelligence implementation: request-quality aggregation (S2).

**Scope Boundary**: The `assessRequestQuality` request-level verdict logic in `confidence-scoring.ts` only. Ordering (`resolveEffectiveScore` / `resolveAbsoluteRelevance`, the packet-015 scale) is untouched.

**Dependencies**:
- `computeMargin` / `resolveCalibrationScore` (the cosine-calibrated score `topScore` reads) - reused for the margin path.

**Deliverables**:
- A "good" disjunction: top-dominant (`topScore >= 0.8`) OR `topScore >= 0.7` AND (`qualityRatio >= 0.6` OR `topMargin >= 0.15`).
- `qualityRatio` computed over the ranking head `min(N, K)` with `K = 5` (`QUALITY_RATIO_HEAD`) so recall expansion no longer depresses it.
- `weak` / `gap` thresholds unchanged so a genuinely low-signal set still trips the do-not-cite net.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The request-quality verdict was gated on `topScore >= 0.7 AND qualityRatio >= 0.6` with the ratio computed over the whole result set. A strong top hit (e.g. 0.751) above a mediocre tail failed the ratio test, and pulling more candidates for recall mechanically lowered the ratio - so recall improvements fought the quality verdict.

### Purpose
A search with one strong, clearly-best memory reads `good` instead of being dragged to `weak`, and recall expansion never depresses the verdict.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Top-dominant + margin-aware "good" disjunction in `assessRequestQuality`.
- `qualityRatio` capped at the ranking head (`QUALITY_RATIO_HEAD = 5`).
- `TOP_DOMINANT_THRESHOLD = 0.8` constant.

### Out of Scope
- Result ordering / scoring (`resolveEffectiveScore`, `resolveAbsoluteRelevance`, the packet-015 scale) - only the request-level verdict changed.
- `weak` / `gap` threshold tuning - left unchanged to preserve the do-not-cite safety net.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/confidence-scoring.ts` | Modify | Rewrote `assessRequestQuality` (top-dominant + margin-aware); added `TOP_DOMINANT_THRESHOLD = 0.8` and `QUALITY_RATIO_HEAD = 5` |
| `mcp_server/tests/request-quality-aggregation.vitest.ts` | Create | good-via-margin, good-top-dominant, recall-expansion does not depress, weak/gap preserved |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A strong, clearly-best top hit reads `good`, not `weak` | Test: good-via-margin and good-top-dominant cases pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Recall expansion must not depress the verdict | Test: appending weaker tail candidates does not flip `good` to `weak` |
| REQ-003 | The do-not-cite safety net is preserved | Test: a genuinely low-signal set still reads `weak`/`gap` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A 0.751 top hit above a mediocre tail reads `good` (via top-margin), where it previously read `weak`.
- **SC-002**: The quality verdict is decoupled from result-set size (capped at head K=5).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `computeMargin` / `resolveCalibrationScore` | Margin path reuses the cosine-calibrated score | Same score `topScore` reads; no new scale introduced |
| Risk | Loosening "good" could over-cite a weak set | Med | `weak`/`gap` thresholds unchanged; margin/top-dominant gates only relax the strong-hit case |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Shipped; see `implementation-summary.md` for the delivered verdict logic, decisions, and verification.
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
