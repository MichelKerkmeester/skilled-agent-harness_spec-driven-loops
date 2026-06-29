---
title: "Per-Iteration Memory Upsert Hook"
description: "Deep-loop findings only land in Spec Kit Memory at the final save call after a run completes: if the loop is interrupted or killed, all per-iteration findings are lost. There is no incremental streaming of validated findings into Spec Kit Memory during the run."
trigger_phrases:
  - "per iteration memory upsert"
  - "memory upsert hook"
  - "005 per iteration memory"
  - "step memory upsert iteration"
  - "incremental memory save"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/007-ux-observability-automation/005-per-iteration-memory-upsert"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored leaf spec for 005-per-iteration-memory-upsert"
    next_safe_action: "Author plan.md and tasks.md before implementation"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Per-Iteration Memory Upsert Hook

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
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-run-now-control |
| **Successor** | 006-loop-wide-dry-run |
| **Handoff Criteria** | `validate.sh --strict` passes; `step_memory_upsert_iteration` step present in YAML after validate/reduce; non-fatal on MCP error confirmed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is Phase 5 of 6 within `006-ux-observability-automation`.

**Scope Boundary**: `deep_research_auto.yaml` only — a new `step_memory_upsert_iteration` step inserted after validate/reduce/graph-upsert. No changes to the MCP server or Spec Kit Memory internals.

**Dependencies**:
- `reduce-state.cjs` must be stable before this step is wired (so the canonical iteration evidence file exists for `memory_save` to index). Per research §5.5, this leaf depends on 001 (reduce-state stable after sparkline).
- No blocking dependency on 004 (run-now-control); can run in parallel.

**Deliverables**:
- `step_memory_upsert_iteration` in `deep_research_auto.yaml` calling `memory_save({filePath})` on the canonical iteration evidence file after validate/reduce/graph-upsert
- `memory_context` refresh call before the next prompt render
- Non-fatal/idempotent behavior on MCP error

**Changelog**:
- When this phase closes, refresh `../changelog/` using `156-ux-observability-005`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Deep-loop findings only land in Spec Kit Memory at the final `memory_save` call after a run completes. If the loop is interrupted, killed, or fails mid-run, all per-iteration findings are lost from the memory index. There is no incremental way for findings to stream into memory continuously as each iteration validates and reduces its evidence.

### Purpose
Add a `step_memory_upsert_iteration` YAML step that calls `memory_save({filePath})` on the canonical iteration evidence file immediately after validate/reduce/graph-upsert completes, so each iteration's findings land in Spec Kit Memory without waiting for the final save — with non-fatal/idempotent behavior on MCP error.

> **Reference**: `external/kasper/src/evaluate.ts:299,308`; `index.ts:718-781`; `external/loop-cli-main/src/daemon/manager.ts:280` — per-iteration upsert fires after `evaluateAndUpdate()` completes, persisting the canonical evidence file path to the memory store; errors are caught and logged as non-fatal advisory events. (Research: research.md §5.5, iter 35)
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New `step_memory_upsert_iteration` YAML step in `deep_research_auto.yaml` inserted after validate/reduce/graph-upsert
- Direct `memory_save({filePath})` call on the canonical iteration evidence file (not in the fan-out leaf)
- `memory_context` refresh call before the next prompt render so context is fresh
- Non-fatal behavior: MCP error is caught and logged as advisory; loop continues
- Idempotent: re-running the step on the same iteration file is safe (upsert, not append)

### Out of Scope
- Reducer digest change (deep variant: hashing the reduce-state output to detect true content change before upsert) — tagged as deep variant in research §5.5
- Changes to the MCP server, Spec Kit Memory internals, or `reduce-state.cjs`
- Fan-out child worker memory upsert — this leaf covers the coordinator/single-executor path only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Modify | Add `step_memory_upsert_iteration` after validate/reduce/graph-upsert; `memory_context` refresh before next prompt render |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `step_memory_upsert_iteration` fires after validate/reduce/graph-upsert and before the next iteration's prompt render | YAML step ordering confirmed by read; integration fixture shows memory upsert before next prompt |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | MCP error in `memory_save` is non-fatal: loop continues and error is logged as advisory | Unit test: mock `memory_save` to throw → assert loop continues to next iteration with error logged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A 2-iteration deep-research run results in two incremental memory upserts (one after each iteration) visible in the memory index, independent of the final `memory_save` at run end
- **SC-002**: `validate.sh --strict` on this folder exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Per-iteration upsert adds latency on each iteration if MCP is slow | Low — non-fatal; timeout can be short | Gate with a short timeout (e.g., 5 s); treat timeout as non-fatal |
| Risk | Upsert races with the final `memory_save` at run end (duplicate indexing) | Low — idempotent upsert is safe | Confirm `memory_save` is idempotent; document in decision-record |
| Dependency | `reduce-state.cjs` must output a canonical iteration evidence file before this step can reference it | Medium | Read reduce-state output contract before authoring YAML step |

> **Deep-variant note**: Reducer digest (hash of reduce-state output for true-change detection before upsert) is the deep variant. This leaf calls `memory_save` unconditionally per iteration. (Research: research.md §5.5, iter 35)
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What is the canonical iteration evidence file path that `memory_save({filePath})` should reference — the reduce-state output file, the raw iteration JSONL, or a summary file?
- Should a short timeout be applied to `memory_save` to avoid blocking the loop on a slow MCP response?
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
