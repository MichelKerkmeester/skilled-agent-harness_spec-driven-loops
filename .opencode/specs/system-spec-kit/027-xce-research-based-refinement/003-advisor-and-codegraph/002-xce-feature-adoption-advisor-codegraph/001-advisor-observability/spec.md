---
title: "Feature Specification: Advisor retrieval observability (why_recommended + degraded-vector counters)"
description: "Advisor strips ranker evidence at output and only warns to console when the semantic lane degrades. Adopt 027's why_ranked-style attribution and degraded-vector/maintenance counters so Gate 2 decisions are debuggable and semantic-lane health is visible."
trigger_phrases:
  - "advisor observability"
  - "why_recommended attribution"
  - "degraded vector counters"
  - "advisor_status semantic health"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/001-advisor-observability"
    last_updated_at: "2026-06-10T22:36:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented prompt-safe advisor attribution and semantic-lane health reporting"
    next_safe_action: "Address out-of-scope hook settings parity failure separately if required"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-advisor-observability"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: advisor-observability

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
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 9 |
| **Predecessor** | None |
| **Successor** | None (independent) |
| **Source transfers** | Analysis #1 (why_recommended), #2 (degraded-vector counters) |
| **Handoff Criteria** | Phase validates `--strict`; attribution payload carries no raw prompt text |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the spec-027 feature adoption into the advisor and code-graph daemons. It covers the advisor's retrieval observability surface — the same surface for both transfers, so they are scoped together.

**Scope Boundary**: Advisor observability only. Output attribution in `advisor_recommend` and health counters in `advisor_status` (optionally exposed via `advisor_recommend(includeAttribution)`). No scorer math changes, no lane registry changes, no schema changes beyond additive opt-in fields.

**Dependencies**:
- None. Independent of all other phases; ships standalone.

**Deliverables**:
- Prompt-safe `why_recommended` attribution derived from the scorer intermediates the advisor already computes internally.
- Semantic-lane health counters in `advisor_status` (active embedder, vector coverage, dim mismatch, last refresh, disabled reason).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor already computes scorer evidence internally (`lib/scorer/types.ts:80-87`) but strips it at output, so the public `laneBreakdown` exposes only numeric lane fields and Gate 2 routing decisions are hard to debug (`handlers/advisor-recommend.ts:177-184`). Separately, semantic-shadow lane failures only warn to console and silently remove the lane (`lib/scorer/lanes/semantic-shadow.ts:69-88`), so there is no signal of embedder/vector health. Memory's 027 work added both opt-in `why_ranked` attribution and degraded-vector health signals (`027 before-vs-after.md:187-190` and `:191-195`).

### Purpose
Adopt 027's ranker-derived attribution and degraded-vector health signals: expose a prompt-safe `why_recommended` and surface semantic-lane health in `advisor_status`, so routing decisions are explainable and lane degradation is observable instead of silent.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Prompt-safe `why_recommended` attribution surfaced from existing scorer intermediates, opt-in / debug-profile only.
- Semantic-lane health counters in `advisor_status`: active embedder, vector coverage, dimension mismatch, last embedding refresh, semantic-lane disabled reason.
- Optional exposure of the health summary through `advisor_recommend(includeAttribution)`.

### Out of Scope
- Changing scorer math, fusion weights, or the lane registry - these belong to phases 003/005.
- Echoing raw prompt text in any metadata field (forbidden by the prompt-safety guardrail below).
- Making attribution the default-on payload - keep it compact and opt-in to avoid payload bloat.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-skill-advisor/mcp_server/handlers/advisor-recommend.ts` (~:177-184) | Modify | Stop stripping evidence; emit prompt-safe `why_recommended` under opt-in flag |
| `system-skill-advisor/mcp_server/handlers/advisor-status.ts` | Modify | Add semantic-lane health counters block |
| `system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Modify | Surface lane intermediates for attribution (read-only export of existing evidence) |
| `system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts` (~:69-88) | Modify | Record degraded-vector reason instead of console-only warn |
| `system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts` | Modify | Additive opt-in `includeAttribution` field + response shape |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Prompt-safety guardrail: attribution metadata MUST NOT echo raw prompt text (per `SKILL.md:313-317`) | A test feeds a distinctive prompt token and asserts it never appears in any `why_recommended` / attribution field |
| REQ-002 | `why_recommended` is opt-in and ranker-derived, not a free-text restatement | `advisor_recommend` without the flag returns the current payload byte-for-byte; with the flag, attribution is built only from existing scorer intermediates |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | `advisor_status` reports semantic-lane health counters | Status response includes active embedder, vector coverage, dim-mismatch flag, last refresh, and disabled reason |
| REQ-004 | Degraded-vector events are recorded, not console-only | A simulated embedder/dim mismatch sets a queryable disabled-reason counter rather than only logging |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A Gate 2 routing decision can be explained from `advisor_recommend(includeAttribution)` output alone, with zero raw prompt text leaked.
- **SC-002**: `advisor_status` surfaces semantic-lane health so a degraded vector lane is diagnosable without reading console logs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Prompt-text leakage into metadata | High - violates the advisor's prompt-safety contract | REQ-001 token-leak test; attribution built only from ranker intermediates |
| Risk | Payload bloat from always-on attribution | Med | Keep attribution opt-in / debug-profile only; default payload unchanged |
| Dependency | Existing scorer evidence shape (`lib/scorer/types.ts:80-87`) | Low - already present internally | Read-only surfacing; no new computation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should attribution ride on a per-call flag (`includeAttribution`) or a server debug profile, or both?
- What is the minimal prompt-safe attribution shape - lane scores + matched signal categories - that explains a decision without restating the prompt?
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
