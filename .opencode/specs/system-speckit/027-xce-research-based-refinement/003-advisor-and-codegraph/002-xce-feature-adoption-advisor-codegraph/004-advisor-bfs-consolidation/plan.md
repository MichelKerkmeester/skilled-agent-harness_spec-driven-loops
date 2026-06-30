---
title: "Implementation Plan: Advisor BFS consolidation"
description: "Behavior-preserving extraction of the advisor skill-graph BFS logic into one advisor-local helper with targeted parity tests."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/004-advisor-bfs-consolidation"
    last_updated_at: "2026-06-10T23:30:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented advisor-local BFS helper and behavior-preserving query cutovers"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Advisor BFS Consolidation

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node) |
| **Framework** | mk_skill_advisor MCP daemon |
| **Storage** | skill-graph.sqlite |
| **Testing** | vitest |

### Overview
Extract the duplicated queue-based traversal logic from `transitivePath` and `subgraph` into a local `bfs-traversal.ts` helper. Keep the public query return shapes unchanged, and prove parity with a fixture that compares the new implementation against legacy traversal code.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing: typecheck, build, new helper/parity tests, existing skill-graph-focused suites
- [x] Docs updated: spec, plan, tasks, implementation summary
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Local reusable traversal helper.

### Key Components
- **`bfs-traversal.ts`**: Owns advisor-local BFS depth clamping, visited-set semantics, match paths, and truncation metadata.
- **`skill-graph-queries.ts`**: Keeps query response shapes stable while delegating traversal mechanics to the helper.
- **Skill graph vitest fixtures**: Prove helper behavior and exact parity against the legacy traversal algorithm.

### Data Flow
Query callers resolve the root/target nodes, supply adjacency readers backed by existing prepared statements, and consume the helper's matched path or traversal side effects to rebuild the same `transitivePath` and `subgraph` outputs as before.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The affected surface stays limited to advisor skill graph traversal and tests.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/skill-graph/bfs-traversal.ts` | Shared traversal helper for advisor skill graph callers | Created | `tests/skill-graph-bfs-traversal.vitest.ts` |
| `lib/skill-graph/skill-graph-queries.ts` | Public query helpers for `transitive_path` and `subgraph` | Updated only at traversal internals | `tests/skill-graph-queries-parity.vitest.ts` |
| Existing handler/tool response surfaces | Observe public query output shapes | Unchanged | `tests/skill-graph-handlers.vitest.ts` in skill-graph-focused suite |

Inventory evidence:
- Search found only the expected advisor query call sites for `transitivePath` and `subgraph`.
- Existing handler response tests remained green, proving no public response-shape drift.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read scaffold and target implementation files first
- [x] Identified existing hand-rolled traversal semantics
- [x] Reused existing advisor package scripts and vitest patterns

### Phase 2: Core Implementation
- [x] Added advisor-local `bfs-traversal.ts` helper
- [x] Cut over `transitivePath` to the helper
- [x] Cut over `subgraph` to the helper
- [x] Added helper and parity vitest coverage

### Phase 3: Verification
- [x] Typecheck passed
- [x] Build passed
- [x] New helper/parity tests passed
- [x] Existing skill-graph-focused suites passed
- [x] Documentation updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | BFS helper depth clamp, visited semantics, truncation, queue order | vitest |
| Parity | `transitivePath` and `subgraph` exact output equivalence | vitest |
| Regression | Existing skill-graph handler/db/query-adjacent suites | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing advisor skill graph DB helpers | Internal | Green | Parity tests would fail if row conversion or ordering drifted |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any parity drift in `transitivePath` or `subgraph`, or typecheck/build regression.
- **Procedure**: Restore the previous inline traversal blocks in `skill-graph-queries.ts`, remove the local helper import, and remove helper-specific tests.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
