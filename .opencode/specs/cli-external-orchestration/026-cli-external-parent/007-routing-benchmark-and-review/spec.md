---
title: "Feature Specification: Phase 7: routing-benchmark-and-review"
description: "The merged cli-external parent hub needs empirical verification before cutover. This phase plans a deterministic router-mode Lane-C benchmark, a live delegation-routing re-baseline against the rewritten scorer, and an independent deep-review pass so routing, discovery, and dispatch-resolution claims are backed by evidence."
trigger_phrases:
  - "cli-external parent benchmark"
  - "routing benchmark"
  - "delegation routing re-baseline"
  - "deep-review sign-off"
  - "router-final report"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/026-cli-external-parent/007-routing-benchmark-and-review"
    last_updated_at: "2026-07-09T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the benchmark-and-review spec, plan, and tasks"
    next_safe_action: "Run the benchmark and review after phase 006"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external/benchmark/router-final/skill-benchmark-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-007-routing-benchmark-and-review"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does either mode keep routingClass:metadata, or does benchmark evidence show a lexical carve-out is needed?"
    answered_questions:
      - "The phase uses router-mode Lane-C skill-benchmark plus a live delegation-routing re-baseline against the rewritten scorer"
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
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-09 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 8 |
| **Predecessor** | 006-advisor-and-integration |
| **Successor** | 008-cutover-and-rollout |
| **Handoff Criteria** | The Lane-C benchmark report exists, the live delegation-routing re-baseline confirms the rewritten scorer resolves both executor kinds, the deep-review triage is complete, and the routing-class decision is recorded for cutover |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Merge cli-opencode and cli-claude-code into one parent hub cli-external with two workflow modes: cli-opencode and cli-claude-code specification.

**Scope Boundary**: Validate the phases 003-006 diff and the new cli-external hub routing plus the rewritten scorer's live behavior; do not perform the cutover or broaden the hub design.

**Dependencies**:
- Phases 003-006 produced the fold-in diff, the atomic scorer rewrite, and the referrer sweep.
- The deterministic router-mode benchmark command is available through the deep-improvement Lane-C skill-benchmark path.
- The deep-review pass can inspect the full diff produced by phases 003-006, including the scorer change.

**Deliverables**:
- Router-mode Lane-C skill-benchmark report for `cli-external` covering both `cli-opencode` and `cli-claude-code`.
- A live delegation-routing re-baseline confirming the rewritten scorer resolves both executor-kind strings for real delegation prompts (not only the parity fixtures).
- Independent deep-review findings triage for the phases 003-006 diff, with emphasis on the scorer rewrite and the fail-open hook.
- A recorded routing-class decision for each mode.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The merged `cli-external` hub serves two modes that were previously independent skills, and its delegation routing now flows through a rewritten scorer. Routing, discovery, and dispatch resolution cannot be treated as safe by inspection alone: the scorer rewrite is the riskiest change in the program, and a silent misroute would not surface without a live routing test.

### Purpose
Produce a benchmark report, a live delegation-routing re-baseline, and a review sign-off before cutover, then record whether each mode keeps the default `metadata` routingClass or needs a lexical carve-out based on empirical evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run the router-mode Lane-C skill-benchmark for `cli-external` with both `cli-opencode` and `cli-claude-code` represented.
- Run a live delegation-routing re-baseline: dispatch real delegation prompts and confirm the rewritten scorer resolves the correct executor-kind string (beyond the parity fixtures).
- Read and summarize the benchmark report across D1-D5 dimensions, with emphasis on D1/D2 routing and discovery.
- Run an independent deep-review pass over the full phases 003-006 diff, weighting the scorer rewrite and the fail-open hook.
- Triage deep-review findings as fixed, deferred-with-reason, or false-positive; decide each mode's routingClass from evidence.

### Out of Scope
- Performing phase 008 cutover or rollout work - this phase produces evidence and triage inputs for cutover.
- Fixing every non-blocking benchmark or review finding - defer non-blocking issues with a named follow-up when they are not tractable here.
- Changing the approved parent-hub architecture - zero extensions and the two workflow packets remain locked decisions.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external/benchmark/router-final/skill-benchmark-report.md` | Create | Human-readable Lane-C router-mode benchmark report for the merged `cli-external` hub. |
| `.opencode/skills/cli-external/benchmark/router-final/skill-benchmark-report.json` | Create | Machine-readable benchmark results used to inspect D1-D5 scores and routing evidence. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Generate a router-mode Lane-C benchmark report for the new `cli-external` hub covering D1-D5 for both modes. | The benchmark command writes `skill-benchmark-report.md` and `skill-benchmark-report.json` under `.opencode/skills/cli-external/benchmark/router-final/`, legible enough to support the cutover decision. |
| REQ-002 | Run a live delegation-routing re-baseline against the rewritten scorer. | Real delegation prompts resolve the correct executor-kind string for both `cli-opencode` and `cli-claude-code` with no silent misroute; the result is recorded alongside the benchmark. |
| REQ-003 | Triage P0 deep-review findings from the full phases 003-006 diff. | Every P0 finding is marked fixed, deferred-with-reason, or false-positive with evidence or a named follow-up before handoff to cutover. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Make the routingClass decision from empirical D1/D2 results rather than assumption. | The phase records, per mode, whether `metadata` remains acceptable or a lexical carve-out is required, citing benchmark evidence. |
| REQ-005 | Triage non-P0 deep-review findings. | P1/P2 findings are fixed when tractable or deferred with reason and a named follow-up if they exceed this phase's scope. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The two benchmark report files exist under `.opencode/skills/cli-external/benchmark/router-final/` and clearly report D1-D5 results for both workflow modes.
- **SC-002**: The live delegation-routing re-baseline confirms both executor kinds resolve, and no untriaged P0 review finding remains.
- **SC-003**: The routingClass decision for each mode is recorded with D1/D2 benchmark evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 003-006 diff | Review cannot sign off if the target diff is unavailable or incomplete | Confirm the diff scope before review; if incomplete, block cutover and name the missing phase output |
| Dependency | Router-mode benchmark command | Benchmark evidence cannot be produced if the command or output directory fails | Capture the exact failure, do not infer routing safety, and defer cutover until the report is generated |
| Risk | The live routing test passes the fixtures but misses a real prompt shape | High | Run real delegation prompts for both executors, not only the parity fixtures, and record the outcomes |
| Risk | Advisor routing regression for a folded mode | Medium | Base the routingClass decision on D1/D2 results and require a carve-out if metadata does not hold up |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does each mode keep `routingClass: metadata`, or does benchmark evidence show a lexical carve-out is needed to preserve delegation routing accuracy?
- Which non-blocking review findings, if any, should be deferred into a named follow-up rather than fixed in this phase?
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
