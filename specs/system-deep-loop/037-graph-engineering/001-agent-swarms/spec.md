---
title: "Feature Specification: agent-swarms → Graph-Based Deep-Loop (Repo Study 1)"
description: "Phase child of 037: a 20-iteration deep-research study of the agent-swarms reference implementation and the full graph-engineering blog corpus, extracting concrete graph-engineering design decisions for evolving system-deep-loop into a graph-based agent-loop layered over the 036 authority plane."
trigger_phrases:
  - "agent-swarms graph engineering"
  - "graph-based deep loop agent-swarms"
  - "agent swarms deep loop study"
  - "graph engineering repo study"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/037-graph-engineering/001-agent-swarms"
    last_updated_at: "2026-08-13T20:00:00Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Completed 20-iteration deep-research loop and synthesized graph-based deep-loop design"
    next_safe_action: "Proceed to repo study 2 (graphene-main) or plan a shadow-prototype implementation packet"
    blockers: []
    key_files:
      - "orientation.md"
      - "research/research.md"
      - "research/resource-map.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fanout-agent-swarms-sol-high-1786644869562-gvk422"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The graph runtime must be a projection over the 036 authority plane, adopted via a deterministic IR and shadow parity before any per-mode authority cutover."
---
# Feature Specification: agent-swarms → Graph-Based Deep-Loop (Repo Study 1)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
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
| **Created** | 2026-08-13 |
| **Parent** | `system-deep-loop/037-graph-engineering` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 037 corpus grew well past what the gen-1 research studied. The `agent-swarms` repository (a 20MB TypeScript/Bun multi-agent platform with a custom topological graph executor) was never examined by gen-1, and the 12 graph-engineering blog posts were only partially used. We need a focused study of agent-swarms as a reference implementation, grounded in the blog corpus, to extract concrete patterns for turning `system-deep-loop` into a more graph-based agent-loop system.

### Purpose
Produce a research foundation (`research/research.md`) that answers what agent-swarms is, how it operationalizes graph engineering and loops, how those map onto our runtime and the 036 authority plane, and what concrete, extractable design decisions follow — with explicit when-not-to-use boundaries.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only study of `context/agent-swarms/` (architecture, graph executor, reducers, gates, checkpoints, subgraphs, knowledge graph).
- All 12 posts in `context/blog-posts/` as the graph-engineering concept foundation.
- Mapping onto the current `system-deep-loop` runtime and the 036-deep-loop-innovation authority plane.
- A prioritized set of extractable design decisions and a staged adoption path.

### Out of Scope
- Implementation of any graph-based loop changes (follow-up planning packet).
- Code changes to `system-deep-loop`, 036, or agent-swarms (research subjects are read-only).
- The other 037 reference repos (`graphene-main`, `graph-arch`, `graph-engineering-master`) — separate phase children.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `orientation.md` | Create | gpt-5.6-sol orientation seed (summary + concept map + 8 angles) |
| `research/research.md` | Create | Canonical synthesis of the 20-iteration run |
| `research/lineages/agent-swarms-sol-high/iterations/iteration-NNN.md` | Create | Per-iteration evidence |
| `research/resource-map.md` | Create | Resource map emitted from converged deltas |
| `research/findings-registry.json` | Create | Consolidated findings registry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run 20 deep-research iterations (gpt-5.6-sol high/fast) over agent-swarms + the blog corpus | 20 iteration records complete; `research/research.md` synthesized — SATISFIED (20/20 complete, `stopReason: maxIterationsReached`) |
| REQ-002 | Answer the 8 prioritized orientation angles with cited sources | 8/8 angles resolved at design-decision level in `research/research.md` — SATISFIED |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every finding carries evidence provenance | Findings cite `[SOURCE: file:line]` or `[INFERENCE: ...]` across agent-swarms code, all 12 blogs, and 036 specs — SATISFIED |
| REQ-004 | Flag explicit when-NOT-to-use boundaries | Documented in `research/research.md` §"Explicit When-Not-to-Use Boundaries" — SATISFIED |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` compiled from 20 iterations with a convergence report. — MET
- **SC-002**: All 8 orientation angles resolved with cited evidence. — MET
- **SC-003**: A concrete, staged graph-based deep-loop design aligned with the 036 authority plane and our runtime constraints. — MET
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | agent-swarms is third-party code with its own maintenance state | Medium | Findings distinguish OBSERVED-IN-CODE from INFERRED and cite file:line |
| Risk | Design-level output is not implementation proof | Medium | Synthesis explicitly names the next evidence class: a shadow prototype with golden traces + measured baselines |
| Note | Leaf state records carry synthetic timestamps (runtime-flagged, non-fatal) | Low | Iteration content is real and cited; timestamps are cosmetic self-reports |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Residual implementation questions only (schema field naming, compiler language/module placement, initial shadow-fixture selection) — these require scoped implementation planning and runtime measurement, not more corpus review.
<!-- /ANCHOR:questions -->

---
