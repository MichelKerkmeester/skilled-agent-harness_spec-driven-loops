---
title: "Feature Specification: Phase 7: skill-advisor-decoupling"
description: "Remove the code graph from the skill-advisor: its node and edges in the skill graph, its scorer lane references, the latency benches that import its internals, and the drill that shells out to its CLI — so the advisor stops recommending a skill that will not exist."
trigger_phrases:
  - "skill advisor code graph node removal"
  - "skill-graph.json code graph edges"
  - "advisor scorer lane code graph"
  - "tri daemon drill code index"
  - "036 skill advisor decoupling"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/007-skill-advisor-decoupling"
    last_updated_at: "2026-07-27T20:56:19Z"
    last_updated_by: "claude-code"
    recent_action: "Executed the phase and verified it"
    next_safe_action: "Closeout verification in phase 015"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-007-skill-advisor-decoupling"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: skill-advisor-decoupling

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 15 |
| **Predecessor** | 006-spec-kit-test-and-harness-cleanup |
| **Successor** | 008-deep-loop-and-skill-surface |
| **Handoff Criteria** | A rebuilt advisor recommends no removed skill for structural-search prompts, and its own suite is green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the code graph decommission specification.

**Scope Boundary**: `system-skill-advisor` graph data, scorer lanes, benches, and drills.

**Dependencies**:
- Phase 002 decides where structural-search prompts should route instead.

**Deliverables**:
- The skill removed as a graph node, family member, and edge endpoint, with the skill count corrected.
- Scorer lane references removed so no lane can surface it.
- Latency benches that import its internals deleted.
- The tri-daemon drill reduced to the two surviving daemons.
- The advisor database rebuilt and its routing re-verified.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor treats the code graph as a first-class routable skill: it is a node in the skill graph with a declared dependency edge and inbound edges from two other skills, it carries a block of intent signals, and it is counted in the total skill population. Three scorer lanes name it directly. Beyond the data, two benches import its TypeScript internals directly — the one place in the repo with source-level coupling — and a drill shells out to its CLI. Left in place, the advisor would keep routing structural-search prompts to a skill whose directory has been deleted.

### Purpose
Make the advisor consistent with a repo that has no code graph: nothing recommends it, nothing counts it, nothing imports it, and structural-search prompts route to whatever phase 002 chose instead.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Removing the node, family membership, adjacency edges, and intent-signal block from the skill graph data.
- Correcting the declared skill count.
- Removing the skill from the lexical, explicit, and fusion scorer lanes.
- Deleting the two latency benches that import its internals.
- Reducing the tri-daemon drill to the surviving daemons.
- Rebuilding the advisor database and re-verifying routing.

### Out of Scope
- Advisor changes unrelated to this skill.
- Re-baselining advisor routing benchmarks beyond confirming no regression.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill-graph.json` | Modify | Remove node, family, edges, signals; correct the count |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/lexical.ts` | Modify | Remove the skill reference |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/explicit.ts` | Modify | Remove the skill reference |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/fusion.ts` | Modify | Remove the skill reference |
| `.opencode/skills/system-skill-advisor/mcp-server/bench/code-graph-*.bench.ts` | Delete | Import the removed package directly |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/tri-daemon-drill.vitest.ts` | Modify | Drop the code-index daemon leg |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The skill is absent from the graph data | No node, family entry, edge, or signal block references it |
| REQ-002 | The declared skill count matches reality | The count equals the number of remaining skills |
| REQ-003 | No scorer lane can surface the skill | A structural-search prompt returns no recommendation for it |
| REQ-004 | No source-level import of the removed package remains | The benches that imported its internals are gone |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The advisor database is rebuilt | A rebuild runs cleanly and the new roster is served |
| REQ-006 | Inbound edges from other skills are pruned | No surviving skill declares an edge to the removed one |
| REQ-007 | The drill covers the surviving daemons | The reduced drill passes without the removed leg |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A recommendation request for a structural-search prompt returns only surviving skills.
- **SC-002**: The advisor suite passes and the rebuild reports the corrected skill count.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Dangling inbound edges after node removal | Graph validation fails or routing misbehaves | Prune both directions, then run graph validation |
| Risk | Stale database served after the data edit | Advisor keeps recommending the removed skill | Rebuild is a P1 requirement, verified by a live query |
| Risk | Routing quality shifts for unrelated prompts | Silent regression elsewhere | Compare recommendations before and after on a fixed prompt set |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should structural-search intent signals be reassigned to another skill or dropped entirely?
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
