---
title: "Feature Specification: Phase 7: routing-benchmark-and-review"
description: "Run a Lane-C skill-benchmark against the new mcp-tooling hub and an independent deep-review over the full fold-in diff. This phase empirically resolves the deferred figma-transport routing carve-out question."
trigger_phrases:
  - "mcp-tooling routing benchmark"
  - "lane-c skill benchmark hub"
  - "deep-review fold-in diff"
  - "figma transport routing carve-out"
  - "phase 007 routing-benchmark-and-review"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review"
    last_updated_at: "2026-07-10T07:36:17Z"
    last_updated_by: "claude"
    recent_action: "Marked routing benchmark and review deferred"
    next_safe_action: "Run Lane-C benchmark when scheduled"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/spec.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/plan.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-007-routing-benchmark-and-review"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the figma transport needs a lexical routing carve-out — this phase's benchmark decides it empirically"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: routing-benchmark-and-review

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
| **Status** | Deferred |
| **Created** | 2026-07-09 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 8 |
| **Predecessor** | 006-advisor-and-integration |
| **Successor** | 008-cutover-and-rollout |
| **Handoff Criteria** | A Lane-C skill-benchmark report exists for the hub; an independent deep-review pass over the full diff is complete; the figma-transport routing carve-out question is resolved or its amendment is recorded; findings are resolved or explicitly deferred |
| **Execution Note** | The Lane-C skill-benchmark was not run; `mcp-tooling/benchmark/` holds only the `.gitkeep` baseline, no `router-final/` report. An independent review substituted: a gpt-5.6-sol-fast cross-check of the fold-in diff reported clean after 2 gaps were closed. The figma-transport routing carve-out question (Open Questions below) stays unresolved pending the deferred benchmark |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Merge mcp-chrome-devtools mcp-click-up and mcp-figma into one parent hub mcp-tooling with three modes: two workflow bridges and one figma transport; mcp-code-mode stays flat standalone infrastructure specification.

**Scope Boundary**: Measurement and review only. This phase runs the Lane-C skill-benchmark and an independent deep-review; it makes no structural change except a routing-config amendment if the benchmark evidence requires one (routed through the phase 002 ADR amendment protocol, not a silent workaround).

**Dependencies**:
- Phase 006 complete: one hub graph identity, all functional referrers repointed, advisor skill-graph rebuilt.

**Deliverables**:
- A Lane-C skill-benchmark report for `mcp-tooling` (routing, discovery, efficiency, usefulness) covering all three modes, with special attention to the figma transport's routing.
- An independent deep-review pass over the full fold-in diff (moves, graph union, referrer repoints).
- An empirical resolution of the figma-transport routing carve-out question: either hub-membership metadata routing suffices, or a routing-config amendment is recorded against phase 002's ADR-001/ADR-006.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The fold-in is functionally complete after phase 006, but two things are unverified: whether the advisor actually routes the three tools correctly through the single hub identity (especially the figma transport, whose routing carve-out was deferred here), and whether the full diff is free of correctness regressions. Both need independent measurement before cutover.

### Purpose
Prove the hub routes correctly and the fold-in diff is clean, and resolve the one deferred architecture question with real benchmark evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run a Lane-C skill-benchmark against `mcp-tooling` covering routing, discovery, efficiency, and usefulness across all three modes.
- Run an independent deep-review over the full fold-in diff.
- Empirically resolve the figma-transport routing carve-out: keep metadata routing, or record a routing-config amendment against the phase 002 ADRs.
- Capture the benchmark report and review findings under this phase folder.

### Out of Scope
- Any structural change beyond a routing-config amendment justified by benchmark evidence.
- The final `parent-skill-check.cjs` STRICT gate and parent rollup - phase 008.
- Any change to `mcp-code-mode`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/benchmark/router-final/*` | Create | Lane-C skill-benchmark output for the hub |
| `.opencode/skills/mcp-tooling/hub-router.json` | Modify (conditional) | Only if benchmark evidence justifies a routing-weight amendment |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Lane-C benchmark run against the hub | A benchmark report exists covering routing/discovery/efficiency/usefulness for all three modes, with the figma transport's routing explicitly measured |
| REQ-002 | Independent deep-review over the full diff | Review findings are recorded with P0/P1/P2 severity; P0/P1 findings are resolved or explicitly deferred with rationale |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | figma-transport routing carve-out resolved empirically | The report states whether metadata routing suffices; if not, a routing-config amendment is recorded against phase 002's ADR-001/ADR-006 per the amendment protocol |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The benchmark shows the advisor routes all three tools correctly through the single hub identity, or names the exact fix.
- **SC-002**: The deep-review confirms the fold-in diff is free of correctness regressions, or its findings are resolved/deferred with rationale.
- **SC-003**: The deferred figma-transport routing question is closed with evidence, not assumption.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 006 complete | High | Do not benchmark until the hub identity and referrers are wired |
| Risk | The benchmark reveals a routing regression for the figma transport | Medium | Resolve via a routing-config amendment routed through the phase 002 ADR amendment protocol, not a silent workaround |
| Risk | A deep-review P0 finding blocks cutover | Medium | Resolve before phase 008, or defer explicitly with operator-visible rationale |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Owned here: whether the figma transport needs a lexical routing carve-out or hub-membership metadata routing suffices — resolved by this phase's benchmark, not pre-decided.
- Any routing-config amendment lands against the phase 002 ADRs (same ADR number, dated note), never as a competing decision.
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
