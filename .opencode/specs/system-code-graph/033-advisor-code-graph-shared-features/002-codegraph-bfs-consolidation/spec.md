---
title: "Feature Specification: Standardize code-graph's two BFS paths into a shared helper"
description: "The code graph already uses app-level BFS for transitive symbol traversal and blast radius, but as two separate routines. Adopt 027 phase 012's shared-BFS pattern to consolidate them, preserving existing depth-truncation and dangling-edge handling exactly."
trigger_phrases:
  - "code graph BFS consolidation"
  - "transitive symbol traversal blast radius"
  - "shared graph traversal helper"
  - "code graph query BFS"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/033-advisor-code-graph-shared-features/002-codegraph-bfs-consolidation"
    last_updated_at: "2026-06-10T21:12:38Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed behavior-preserving BFS helper consolidation"
    next_safe_action: "Use existing query tests as regression coverage for future traversal changes"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/graph/bfs-traversal.ts"
      - ".opencode/skills/system-code-graph/mcp_server/handlers/query.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/bfs-traversal.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/007-codegraph-bfs-consolidation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: codegraph-bfs-consolidation

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
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 9 |
| **Predecessor** | 004-advisor-bfs-consolidation (pattern reuse, soft) |
| **Successor** | None (independent) |
| **Source transfers** | Analysis #7 (shared BFS helper, lower value); adopts 027 phase 012 |
| **Handoff Criteria** | Phase validates `--strict`; blast-radius and transitive outputs are byte-equivalent to today |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the spec-027 feature adoption into the advisor and code-graph daemons. It consolidates the code graph's two BFS routines into one helper.

**Scope Boundary**: The transitive symbol traversal and blast-radius BFS in `handlers/query.ts`. Extract a shared helper; preserve existing depth-truncation and dangling-edge warnings. No new capabilities, no behavior change.

**Dependencies**:
- Soft pattern dependency on phase 004 (advisor BFS): reuse the proven consolidation pattern.

**Deliverables**:
- A code-graph-local shared BFS helper with caps, visited semantics, and truncation/dangling-edge signals.
- Both BFS callers re-pointed at the helper with verified output equivalence.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The code graph already uses app-level BFS rather than recursive CTEs for transitive symbol traversal (`handlers/query.ts:537-632`) and blast radius (`:1068-1179`), but as two separate routines that each re-implement depth truncation and dangling-edge handling. 027 phase 012's shipped value was exact equivalence with lower latency from a single shared helper (`027 012/implementation-summary.md:111-125`). This is consolidation, not a bug fix.

### Purpose
Adopt 027 phase 012's shared-BFS pattern code-graph-side so both traversals use one helper with consistent caps, truncation, and dangling-edge handling - preserving current outputs exactly.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A code-graph-local shared BFS helper (caps, visited set, truncation + dangling-edge signals).
- Re-pointing transitive symbol traversal and blast-radius at the helper.
- Equivalence tests proving identical results and no latency regression.

### Out of Scope
- Adding new traversal queries or changing depth/cap defaults.
- The advisor BFS (phase 004) - separate package.
- The `why_included` breadcrumbs (phase 008), even though both touch blast radius - keep changes independent.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-code-graph/mcp_server/handlers/query.ts` (~:537-632, :1068-1179) | Modify | Re-point both BFS callers at the shared helper |
| `system-code-graph/mcp_server/lib/graph/bfs-traversal.ts` | Create | Code-graph-local shared BFS helper with caps + truncation/dangling-edge signals |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Behavior preservation: both traversals return identical results to today | Equivalence test over a fixture graph: transitive traversal and blast-radius outputs match pre-refactor exactly |
| REQ-002 | Existing depth-truncation and dangling-edge warnings are preserved | The helper emits the same truncation and dangling-edge signals both callers currently produce |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No latency regression | Traversal latency on the fixture graph is equal or better than the two hand-rolled routines |
| REQ-004 | Helper is code-graph-local, not a cross-package import | Import graph shows no dependency on memory's or the advisor's traversal helper |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both code-graph traversals run through one shared helper with zero output drift versus today.
- **SC-002**: Depth-truncation and dangling-edge handling are centralized once, not duplicated, with no latency regression.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Output drift during refactor | Med | REQ-001 equivalence test gates the change |
| Risk | Lowest-value of the code-graph phases (consolidation only) | Low | Keep scope minimal; consider bundling with phase 008 if it reduces churn |
| Risk | Losing existing dangling-edge warnings | Med | REQ-002 preserves the current signals |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Resolved: Ship standalone as requested because this phase is a scoped, behavior-preserving consolidation with targeted regression coverage.
- Resolved: Do not add phase 008 breadcrumb hooks here; the helper exposes traversal visits without changing blast-radius response shape.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
