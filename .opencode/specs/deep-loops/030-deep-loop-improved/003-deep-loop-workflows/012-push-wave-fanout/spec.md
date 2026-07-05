---
title: "Push-Wave Fan-Out Assignment Model"
description: "The deep-loop-runtime fan-out pool uses a FIFO pull-pool with no dependency or write-domain metadata; blocked or overlapping slots waste concurrency and risk file conflicts. A wave planner with depends_on/touches metadata is needed, but requires a conflict-safety substrate to be safe. Sequences last."
trigger_phrases:
  - "push wave fanout assignment"
  - "wave planner executor config"
  - "depends_on touches fan-out"
  - "flat_pool guard wave model"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/003-deep-loop-workflows/012-push-wave-fanout"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored spec.md from research.md §5.2 (iters 45, 42)"
    next_safe_action: "Add depends_on/touches schema to executor-config.ts and flat_pool guard to fanout-run.cjs"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-authoring-003-deep-loop-workflows"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Push-Wave Fan-Out Assignment Model

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 011-meta-loop-lane-d-packaging |
| **Successor** | None |
| **Handoff Criteria** | `depends_on`/`touches` schema in `executor-config.ts`; `assignment_model:"flat_pool"` guard in `fanout-run.cjs` rejects wave fields; wave-planner interface defined but not activated; rejection is logged, not silent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the deep-loop-workflows recommendations (the dependency-last item).

**Scope Boundary**: Schema, guard, and wave-planner interface definition only. No actual wave scheduling until the conflict-safety substrate (worktrees / path-scoped sandbox) is in place as a separate prerequisite.

**Dependencies**:
- This is rated dependency-last; all other phases, plus hermetic tests (§5.6/001), telemetry, integrity helpers, and a conflict-safety substrate should precede actual wave activation
- `depends_on`/`touches` schema can be written without those prerequisites, as can the `flat_pool` guard

**Deliverables**:
- `executor-config.ts`: `depends_on`/`touches` fields in executor assignment schema; `assignment_model` field with `"flat_pool"` as the only accepted value until wave planner ships
- `fanout-pool.cjs`: domain-aware wave planner interface (eligible + disjoint groups + concurrency cap) defined but not activated
- `fanout-run.cjs`: `assignment_model:"flat_pool"` guard rejects wave-scheduler field attempts; rejection is logged, not silent

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-loop-runtime fan-out pool assigns work in FIFO order with no dependency or write-domain metadata; blocked slots (waiting on another lineage) and overlapping slots (both writing to the same path) consume concurrency slots without making progress and risk file conflicts. Replacing the FIFO pull-pool with a wave-based planner requires a conflict-safety substrate (worktrees or path-scoped sandbox) that does not yet exist — shipping the wave planner without it is a data-loss risk.

### Purpose
Add `depends_on`/`touches` metadata to `executor-config.ts`, define the domain-aware wave planner interface in `fanout-pool.cjs`, and install an `assignment_model:"flat_pool"` guard in `fanout-run.cjs` that rejects any attempt to activate wave scheduling fields until the conflict-safety substrate exists.

> **Reference evidence**: `external/loop-cli-main/.opencode/commands/ob-apply.md:30-59` (dependency + write-domain metadata); `external/loop-cli-main/AGENTS.md:47-58` (wave planner: eligible + disjoint groups + concurrency cap). Research.md §5.2 + (iters 45, 42).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `executor-config.ts`: `depends_on[]` (slot IDs) and `touches[]` (path patterns) fields in executor assignment schema; `assignment_model` field (only `"flat_pool"` accepted)
- `fanout-pool.cjs`: domain-aware wave planner interface defined (eligible + disjoint groups + concurrency cap); **not activated**; `assignment_model:"wave"` is a schema-only stub
- `fanout-run.cjs`: `assignment_model:"flat_pool"` guard rejects any assignment with wave-scheduler fields while the guard is active; rejection is logged with a clear message, not silently ignored

### Out of Scope
- Worktree/path-scoped sandbox implementation (prerequisite; a separate follow-up packet)
- Activating wave scheduling (requires conflict-safety substrate; out of scope for this packet)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Modify | Add `depends_on`, `touches`, `assignment_model` fields to executor assignment schema |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Modify | Define domain-aware wave planner interface (not activated); note activation gate |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modify | Add `assignment_model:"flat_pool"` guard; log clear rejection message on wave field attempts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `executor-config.ts` schema accepts `depends_on[]` and `touches[]` fields without breaking existing configs that omit them; `assignment_model` field present with `"flat_pool"` as the only accepted runtime value | Existing executor configs without `depends_on`/`touches` fields still parse and run without errors; new configs with those fields are accepted |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | `assignment_model:"flat_pool"` guard in `fanout-run.cjs` rejects wave-scheduler field attempts with a logged clear rejection message; setting `assignment_model:"wave"` causes a logged rejection and falls back to `flat_pool` | Setting `assignment_model:"wave"` logs `REJECTED: wave assignment_model requires conflict-safety substrate` and the pool runs as `flat_pool`; rejection is in the output, not silent |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `executor-config.ts` schema accepts `depends_on[]` and `touches[]` fields without breaking existing configs; `assignment_model:"flat_pool"` is the only accepted runtime value
- **SC-002**: Setting `assignment_model:"wave"` in a fanout config causes `fanout-run.cjs` to log a clear rejection message and fall back to `flat_pool`; no silent activation of wave scheduling
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | This is the dependency-last item in the research backlog; premature wave activation (bypassing the guard) is a data-loss risk | High | Guard is enforced at runtime; `assignment_model:"wave"` is explicitly rejected with a logged message |
| Risk | Adding `depends_on`/`touches` fields to the schema could confuse operators who use them before the wave planner is active | Med | Schema doc clearly marks fields as `[reserved for wave planner; not yet active]` |
| Dependency | Actual wave activation requires hermetic tests (§5.6/001), telemetry, integrity helpers, and a conflict-safety substrate — all preceding packages must complete first | High | This phase only delivers the schema + guard + interface stub; activation is explicitly gated |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What is the minimum conflict-safety substrate required to safely activate the wave planner — worktrees only, path-scoped file lock only, or both?
- Should `depends_on` reference slot IDs (numeric, assigned at dispatch time) or logical task names (stable across runs)? Logical names are safer for human-authored configs.
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
