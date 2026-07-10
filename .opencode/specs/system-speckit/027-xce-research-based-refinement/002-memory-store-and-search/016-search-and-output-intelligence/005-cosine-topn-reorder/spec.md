---
title: "Feature Specification: Phase 5: cosine-topn-reorder"
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
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/016-search-and-output-intelligence/005-cosine-topn-reorder"
    last_updated_at: "2026-06-17T09:15:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Shipped cosine-primary top-N head reorder; spec superseded by impl-summary"
    next_safe_action: "Measure precision@1 on a labeled set (research step b) to validate the lift"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/cosine-topn-reorder.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-017/005-cosine-topn-reorder"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does the head reorder improve precision@1 in practice? Unmeasured — no labeled set yet."
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: cosine-topn-reorder

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
| **Phase** | 5 of 7 |
| **Predecessor** | 004-confidence-calibration-labeled-set |
| **Successor** | 006-command-contract-structural |
| **Handoff Criteria** | Gated head reorder lands behind `SPECKIT_COSINE_TOPN_REORDER` (default-ON); search test sweep green; only the degree-fusion assertion updated |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the search-and-output-intelligence implementation: cosine top-N head reorder (Problem 4 / S5).

**Scope Boundary**: A stable head reorder applied to the budgeted survivors in `enrichFusedResults`, plus its feature flag. No change to fusion math, the tail, or membership.

**Dependencies**:
- `resolveAbsoluteRelevance` (packet-015 absolute-relevance scale) — the cosine signal the reorder re-asserts.
- `truncateToBudget` — the reorder runs on its output (the final word on order).

**Deliverables**:
- `reorderTopNByCosine` helper + `COSINE_TOPN_REORDER_DEPTH` (N=10), applied after `truncateToBudget`, stable, head-only.
- `isCosineTopnReorderEnabled()` flag (`SPECKIT_COSINE_TOPN_REORDER`, default-ON, reversible).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Compressed RRF fusion magnitudes buried the most semantically-on-target memory below position 1, because ordering ignored the one absolute relevance signal the corpus carries (cosine). The S2/S3 work made position 1 decisive, so head ordering by fused score alone now actively misranks.

### Purpose
Re-assert absolute cosine relevance at the head so the most on-target memory lands at position 1, at near-zero latency, without a model or a change to fusion math.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Stable cosine-primary reorder of the top-N (N=10) by `resolveAbsoluteRelevance`, after `truncateToBudget`.
- A default-ON, reversible feature flag (`SPECKIT_COSINE_TOPN_REORDER`).
- Update the degree-fusion regression assertion to the cosine-correct order.

### Out of Scope
- Any model / LLM call / cross-encoder reranker - the research's "only if a gap remains, later" path, not this phase.
- Reordering in `evaluationMode` - skipped so it does not shift the labeled-set baseline.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/hybrid-search.ts` | Modify | `reorderTopNByCosine` + `COSINE_TOPN_REORDER_DEPTH`; gated reorder after `truncateToBudget`; `__testables` exports |
| `mcp_server/lib/search/search-flags.ts` | Modify | `isCosineTopnReorderEnabled()` (default-ON) |
| `mcp_server/tests/cosine-topn-reorder.vitest.ts` | Create | Promotion, tie stability, length/membership, head-only, lexical fallback, flag default-ON + reversible |
| `mcp_server/tests/hybrid-search.vitest.ts` | Modify | Degree-fusion regression assertion updated to cosine-correct order |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Re-sort the top-N head by absolute cosine without disturbing ties, length, or membership | Test: promotion of a higher-cosine hit; tie stability; length/membership invariants |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Gate the reorder behind a default-ON, reversible flag; skip it in `evaluationMode` | `SPECKIT_COSINE_TOPN_REORDER=false` disables it; eval mode preserves the requested top-K |
| REQ-003 | Lexical-only hits fall back to the effective score | Test: lexical fallback covered |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The highest-cosine hit in the head lands at position 1 when the flag is on; reversible when off.
- **SC-002**: Search test sweep green (cosine-topn-reorder 9/9; hybrid-search incl. updated degree-fusion assertion) with no new failures vs baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `resolveAbsoluteRelevance` / packet-015 scale | Reorder needs the absolute cosine signal | Reuse, unchanged |
| Risk | Unmeasured lift — reorder may change order without improving precision@1 | Med | Default-ON but reversible via `SPECKIT_COSINE_TOPN_REORDER=false`; measure on a labeled set |
| Risk | Head reorder overrides degree/recency/importance promotion at position 1 | Low — intentional per research | Documented; degree-fusion test updated to reflect it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the head reorder improve precision@1 in practice? Unmeasured — no labeled set yet. See `implementation-summary.md` Known Limitations.
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
