---
title: "Feature Specification: Shared app-level BFS helper for advisor skill-graph queries"
description: "The advisor hand-rolls BFS for transitive_path and subgraph. Adopt 027 phase 012's shared BFS pattern (reusable caps, visited semantics, truncation signals) as an advisor-local helper, preserving current behavior exactly."
trigger_phrases:
  - "advisor BFS consolidation"
  - "transitive_path subgraph BFS"
  - "shared graph traversal helper"
  - "skill graph queries BFS"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/013-advisor-and-codegraph-migrated-items/007-advisor-bfs-consolidation"
    last_updated_at: "2026-06-10T23:30:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented advisor-local BFS helper and cut over transitive_path/subgraph callers"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/bfs-traversal.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-queries.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph-bfs-traversal.vitest.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph-queries-parity.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-advisor-bfs-consolidation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: advisor-bfs-consolidation

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
| **Phase** | 4 of 9 |
| **Predecessor** | None |
| **Successor** | 007-codegraph-bfs-consolidation (pattern reuse, soft) |
| **Source transfers** | Analysis #6 (shared app-level BFS); adopts 027 phase 012 |
| **Handoff Criteria** | Phase validates `--strict`; `transitive_path`/`subgraph` outputs are byte-equivalent to today |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the spec-027 feature adoption into the advisor and code-graph daemons. It consolidates the advisor's two hand-rolled BFS routines into one reusable helper.

**Scope Boundary**: The advisor's `transitive_path` and `subgraph` traversals in `lib/skill-graph/skill-graph-queries.ts`. Extract a shared, advisor-local BFS helper. No new query capabilities; no behavior change.

**Dependencies**:
- Soft pattern dependency with phase 007 (code-graph BFS): the advisor consolidation proves the pattern first.

**Deliverables**:
- An advisor-local BFS helper with reusable depth caps, visited semantics, and truncation signals.
- `transitive_path` and `subgraph` re-pointed at the helper with verified output equivalence.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor hand-rolls BFS twice for `transitive_path` and `subgraph` (`lib/skill-graph/skill-graph-queries.ts:296-354` and `:376-423`), duplicating caps and visited logic with no shared truncation signal. 027 phase 012 replaced recursive CTEs with a shared BFS helper and proved exact equivalence with lower latency (`027 012/implementation-summary.md:54-66`, `:111-125`).

### Purpose
Adopt 027 phase 012's shared-BFS pattern as an advisor-local helper so the two traversals share caps, visited semantics, and truncation signals - a pure consolidation that preserves current outputs exactly.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An advisor-local BFS traversal helper (caps, visited set, truncation reporting).
- Re-pointing `transitive_path` and `subgraph` at the helper.
- Equivalence tests proving identical results to the current hand-rolled traversals.

### Out of Scope
- Importing memory's BFS helper directly - the analysis flags this as a package-ownership violation; port the pattern or build an advisor-local helper.
- Adding new traversal queries or changing depth/cap defaults.
- Code-graph BFS (that is phase 007).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-queries.ts` (~:296-354, :376-423) | Modify | Re-point both BFS callers at the shared helper |
| `system-skill-advisor/mcp_server/lib/skill-graph/bfs-traversal.ts` | Create | Advisor-local shared BFS helper with caps + truncation signals |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Behavior preservation: consolidated traversals return identical results to today | Equivalence test over a fixture graph: `transitive_path` and `subgraph` outputs match the pre-refactor outputs exactly |
| REQ-002 | The helper is advisor-local, not a cross-package import of memory's BFS | Import graph shows no dependency on the memory package's traversal helper |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Shared caps, visited semantics, and truncation signal | Helper exposes a truncation flag both callers surface; depth/visited caps configurable |
| REQ-004 | No latency regression | Traversal latency on the fixture graph is equal or better than the hand-rolled version |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both traversals run through one shared advisor-local helper with zero output drift versus the current implementation. Verified by `tests/skill-graph-queries-parity.vitest.ts`.
- **SC-002**: Truncation is now an explicit helper result signal while public query outputs remain unchanged for behavior preservation. Verified by `tests/skill-graph-bfs-traversal.vitest.ts`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Subtle output drift during refactor | Med | REQ-001 equivalence test gates the change |
| Risk | Package-ownership violation via direct import | Med | REQ-002: advisor-local helper only |
| Risk | Low value (consolidation, not a bug fix) | Low | Keep scope minimal; do not gold-plate |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the helper live under `lib/skill-graph/` or a shared `lib/graph/` if phase 007 ends up reusing it?
- Is the consolidation worth shipping on its own, or only bundled with another advisor graph change to justify the churn?
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
