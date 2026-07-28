---
title: "Implementation Plan: Phase 7: skill-advisor-decoupling"
description: "Removed the code graph from the skill advisor: deleted its graph node, edges, and family membership, corrected the skill count from 12 to 11, stripped all three scorer lanes plus the Python twin, deleted the latency benches that imported its internals, and reduced the tri-daemon drill to the two surviving daemons."
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
    packet_pointer: "system-code-graph/036-code-graph-decommission/007-skill-advisor-decoupling"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-007-skill-advisor-decoupling"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: skill-advisor-decoupling

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
| **Language/Stack** | TypeScript + Python (advisor scorer) |
| **Framework** | system-skill-advisor MCP server |
| **Storage** | Advisor graph data (JSON) + rebuilt database |
| **Testing** | Advisor suite + tri-daemon drill |

### Overview
Removed the code graph from the skill advisor entirely: deleted its node, family membership, adjacency edges, and intent-signal block from the skill graph data; corrected the skill count from 12 to 11; stripped all three TS scorer lanes plus the Python twin; deleted the two latency benches that imported its internals; and reduced the tri-daemon drill to the two surviving daemons. The advisor database was rebuilt and routing re-verified.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Graph-data edit plus scorer-lane strip across TS and Python, with bench deletion and drill reduction.

### Key Components
- **Skill graph data**: node, family, edges, and intent-signal block removed; skill count corrected 12 to 11
- **TS scorer lanes**: lexical, explicit, and fusion lanes stripped of the skill reference
- **Python scorer**: py-twin kept in parity with the TS lanes
- **Latency benches**: two benches that imported the removed package's internals deleted
- **Tri-daemon drill**: reduced to the two surviving daemons

### Data Flow
With the node and edges gone, the advisor no longer routes structural-search prompts to a skill whose directory has been deleted. The rebuilt database serves the corrected 11-skill roster.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable as a fix_bug finding. This phase is a decoupling removal, not a bug fix.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Skill graph data | Carried the code-graph node, family, edges, signals | Removed; count corrected 12 to 11 | Graph validation passes; no dangling edges |
| TS scorer lanes | Named the skill in lexical, explicit, fusion | Stripped | Structural-search prompt returns no recommendation for it |
| Python scorer | Mirrored the TS lanes | Stripped in parity | Py-twin matches TS lane state |
| Latency benches | Imported the removed package's internals directly | Deleted | No source-level import of the removed package remains |
| Tri-daemon drill | Shelled out to the code-index CLI | Reduced to two surviving daemons | Drill passes without the removed leg |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirmed phase 002 disposition for structural-search prompt routing

### Phase 2: Core Implementation
- [x] Removed node, family membership, adjacency edges, and intent-signal block from `skill-graph.json`
- [x] Corrected the declared skill count from 12 to 11
- [x] Stripped the skill reference from the lexical, explicit, and fusion scorer lanes
- [x] Stripped the Python scorer (py-twin) in parity with the TS lanes
- [x] Deleted the two latency benches that imported the removed package's internals
- [x] Reduced the tri-daemon drill to the two surviving daemons
- [x] Dropped corpora rows referencing the removed skill

### Phase 3: Verification
- [x] Advisor database rebuilt cleanly with the corrected 11-skill roster (commit `5a2aab0d37`)
- [x] A structural-search prompt returns no recommendation for the removed skill
- [x] No source-level import of the removed package remains
- [x] Inbound edges from other skills pruned (no dangling edges)
- [x] Reduced drill passes without the removed leg
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Advisor suite | vitest |
| Integration | Tri-daemon drill | drill harness |
| Manual | Routing check for structural-search prompts | Live advisor query |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 disposition | Internal | Green | Decides where structural-search prompts route instead |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The advisor needs to route to the code graph again (not expected; the decommission is the intended end state).
- **Procedure**: Restore the node, edges, and scorer-lane references from git history (commit `5a2aab0d37` predecessor), correct the skill count back to 12, and rebuild the advisor database.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
