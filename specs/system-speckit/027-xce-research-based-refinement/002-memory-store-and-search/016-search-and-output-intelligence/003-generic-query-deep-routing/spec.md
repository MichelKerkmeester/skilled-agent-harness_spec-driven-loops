---
title: "Feature Specification: Phase 3: generic-query-deep-routing"
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
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/016-search-and-output-intelligence/003-generic-query-deep-routing"
    last_updated_at: "2026-06-17T08:48:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Shipped generic-query deep routing; spec superseded by impl-summary"
    next_safe_action: "Tune LOW_SIGNAL_STOPWORD_RATIO against real memory_search traffic"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-classifier.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-expander.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/recovery-payload.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/generic-query-deep-routing.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-027-002-017-003"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Optimal LOW_SIGNAL_STOPWORD_RATIO threshold under real traffic"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: generic-query-deep-routing

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
| **Phase** | 3 of 7 |
| **Predecessor** | 002-request-quality-aggregation |
| **Successor** | 004-confidence-calibration-labeled-set |
| **Handoff Criteria** | Low-signal short queries escalate to full channels + expansion, with no new LLM calls; recovery returns actionable suggestions |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the search-and-output-intelligence implementation: generic-query deep routing (S3).

**Scope Boundary**: The classifier escalation, the domain synonym map, and the recovery-suggestion append. `query-plan.ts` (telemetry-only) and `hyde.ts` (deep-mode gate outside the write set) are intentionally untouched - editing them would raise LLM cost.

**Dependencies**:
- Existing channel-selection + expansion guards (both key off the classifier tier) and `expandQuery` (shared expander).

**Deliverables**:
- Classifier escalation of low-signal short queries to `complex`/`low` (≥2 terms, no trigger anchor, stop-word ratio ≥ `LOW_SIGNAL_STOPWORD_RATIO`), turning on all five channels + expansion with NO new LLM calls.
- `generateSuggestedQueries` appends `expandQuery` synonym variants (best-effort, capped at three).
- Enriched `DOMAIN_VOCABULARY_MAP` (`semantic`, `retrieval`, `agent`, `skill`, `council`).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Generic short queries read "weak" because the cheap `simple` route stripped them of the recall machinery they need: a ≤3-term query was trimmed to two channels with both rule-based and embedding expansion suppressed, and produced an empty `suggestedQueries` list, so the agent had no way to broaden.

### Purpose
Route low-signal short queries to the full pipeline and hand back concrete broaden suggestions, while leaving confident short queries on the fast path so cost does not balloon.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Classifier escalation of low-signal short queries to `complex`/`low` (`isLowSignalShortQuery`, `LOW_SIGNAL_STOPWORD_RATIO`).
- `expandQuery` synonym variants appended to `suggestedQueries` (best-effort, capped at three).
- Five new entries in `DOMAIN_VOCABULARY_MAP`.

### Out of Scope
- `query-plan.ts` - telemetry-only; made no routing decision to change.
- `hyde.ts` / LLM reformulation - deep-mode gate outside the write set; editing it would raise LLM cost (forbidden by the brief).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/query-classifier.ts` | Modify | Escalate low-signal short queries to `complex`/`low` (full channels + expansion); add `LOW_SIGNAL_STOPWORD_RATIO` + `isLowSignalShortQuery` |
| `mcp_server/lib/search/query-expander.ts` | Modify | Add `semantic`, `retrieval`, `agent`, `skill`, `council` to the domain synonym map |
| `mcp_server/lib/search/recovery-payload.ts` | Modify | Append `expandQuery` variants to `suggestedQueries` (best-effort, capped) |
| `mcp_server/tests/generic-query-deep-routing.vitest.ts` | Create | Pin escalation, cost-control, and recovery-suggestion contracts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Low-signal short queries escalate to full channels + expansion with NO new LLM calls | Test: escalation turns on five channels + expansion; no HyDE/LLM call added |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | A low-signal query returns actionable broaden suggestions | Test: `semantic search` yields non-empty `suggestedQueries` (capped at three) |
| REQ-003 | Confident short queries stay on the fast path | Test: a high-signal short query is not escalated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A generic 2-3 word query (e.g. `semantic search`) runs the full pipeline and returns non-empty `suggestedQueries`.
- **SC-002**: No new LLM/HyDE calls are introduced by the escalation (cost-control test green).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Classifier tier drives channel selection + expansion guards | A single escalation enables five channels + expansion | Reuses existing tier semantics; no new branching |
| Risk | `LOW_SIGNAL_STOPWORD_RATIO` (0.5) is untuned against real traffic | Med | Documented open question; threshold tunable; confident short queries stay on the fast path |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Optimal `LOW_SIGNAL_STOPWORD_RATIO` threshold under real `memory_search` traffic (currently 0.5, untuned). See `implementation-summary.md`.
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
