---
title: "Subsystem: UX, Observability, and Automation"
description: "Loop runs lack consistent operator-visible feedback: no sparkline trend, no telemetry parity between single and fan-out runs, no unified observability envelope, no forced-run control, no per-iteration memory persistence, and no safe dry-run mode."
trigger_phrases:
  - "ux observability automation"
  - "006 ux observability"
  - "dashboard sparkline"
  - "single loop telemetry"
  - "observability event envelope"
  - "run-now control"
  - "per-iteration memory upsert"
  - "loop dry run"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/006-ux-observability-automation"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored subsystem parent spec for 006-ux-observability-automation"
    next_safe_action: "Phase complete; all sub-phases shipped"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs"
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/observability-events.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Subsystem: UX, Observability, and Automation

<!-- SPECKIT_LEVEL: 2 -->
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
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 7 |
| **Predecessor** | 005-skill-interconnection |
| **Successor** | 007-testing |
| **Handoff Criteria** | All six child phases pass `validate.sh --strict`; each has an implementation summary |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the system-deep-loop/030-deep-loop-improved subsystem groups.

**Scope Boundary**: All UX, observability, and automation improvements to the deep-loop commands and runtime. Changes are additive and non-breaking with respect to existing ledger formats.

**Dependencies**:
- 001-dashboard-sparkline-trend: no blocking dependency; can start immediately.
- 002-single-loop-telemetry-heartbeat: no blocking dependency on 001; can run in parallel.
- 003-unified-observability-event-envelope: logically follows 002 (event envelope wraps telemetry rows).
- 004-run-now-control: must follow lifecycle event naming decision from 002 (`iteration_started` vs `iteration_start`).
- 005-per-iteration-memory-upsert: depends on reduce-state being stable (after 001).
- 006-loop-wide-dry-run: last; hooks into dispatch boundaries established by all prior leaves.

**Deliverables**:
- Six child phase spec.md files authored, planned, and executed.

**Changelog**:
- When each child phase closes, refresh the matching file in `../changelog/` using parent packet number plus the child folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Operators running deep-loop research, review, or context passes receive no in-progress trend data (novelty/score history invisible), no telemetry parity between single-executor and fan-out runs (one dashboard for two modes is absent), no canonical event envelope (producers emit native formats that no single reader can index), no forced-run mechanism (only cadence-based triggers), no incremental memory persistence (findings only land in Spec Kit Memory at final save), and no safe dry-run mode to inspect setup/convergence without side-effects.

### Purpose
Six additive quick-win improvements deliver a coherent observability and automation layer: sparkline trend in the dashboard, telemetry heartbeat for single runs, a unified event envelope over all producers, a run-now sentinel for operator-forced iterations, per-iteration memory upsert, and a `--dry-run` flag that halts at every mutation boundary.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Dashboard sparkline + trend rendering in `reduce-state.cjs`
- Single-loop telemetry heartbeat rows in `deep_research_auto.yaml`
- New `observability-events.cjs` unified envelope (additive; legacy ledgers remain valid)
- Run-now sentinel (`.deep-research-run-now`) in `deep_research_auto.yaml`
- Per-iteration `memory_save` hook after validate/reduce/graph-upsert in `deep_research_auto.yaml`
- `--dry-run` first-class input in `research.md` + `deep_research_confirm.yaml`

### Out of Scope
- Fan-out dry-run (deep-rewrite; tagged as the deep variant in research §5.5)
- Running-iteration banner (requires canonical `iteration_started` lifecycle event first; tagged as deep variant)
- Unified reader over all event streams (deep variant of the event envelope; additive producer-side only in this phase)
- Changes to deep-loop-runtime core lib — covered in subsystem 002

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | Modify | Add sparkline trend rendering for newInfoRatio/score history |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Modify | Telemetry heartbeat, run-now sentinel, per-iteration memory upsert steps |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/observability-events.cjs` | Create | Unified event envelope normalizer + appender |
| `.opencode/commands/deep/research.md` | Modify | `--dry-run` flag documentation and gate |
| `.opencode/commands/deep/assets/deep_research_confirm.yaml` | Modify | Dry-run halt hooks at mutation boundaries |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Detail lives in each child phase spec.md | All six child specs pass `validate.sh --strict` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | All six child phases reach Status: Complete | `validate.sh --recursive` on this folder exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All six child phase specs pass `validate.sh --strict` with zero errors
- **SC-002**: Each child has an implementation summary confirming the target file was modified/created
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Telemetry rows added to deep_research_auto.yaml break existing parsers | Medium — additive rows are safe if schema-compatible | Use the same row shape as fan-out ledger; additive only |
| Dependency | 004-run-now-control depends on lifecycle event naming from 002 | Medium — wrong event name silently misroutes | Resolve event name in 002 spec before authoring 004 plan |
| Risk | Per-iteration memory upsert (005) introduces latency on each iteration | Low — non-fatal/idempotent; can be gated | Gate behind a config flag; non-fatal on MCP error |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Event naming: is the canonical lifecycle event `iteration_started` or `iteration_start`? Must be resolved before 004-run-now-control is planned.
- Should the sparkline (001) use a fixed-width window or the full history?
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

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-dashboard-sparkline-trend/` | Pure reducer change: `renderSparkline()` for newInfoRatio/score history in `## 5. TREND` terminal gate | Complete |
| 2 | `002-single-loop-telemetry-heartbeat/` | `started`/`progress`/terminal rows with `label:"single"` in deep_research_auto.yaml; parity with fan-out dashboard | Complete |
| 3 | `003-unified-observability-event-envelope/` | New `observability-events.cjs` with `normalizeObservabilityEvent()` / `appendObservabilityEvent()`; additive | Complete |
| 4 | `004-run-now-control/` | `.deep-research-run-now` sentinel: consume-once, pause precedence, JSONL lifecycle events | Complete |
| 5 | `005-per-iteration-memory-upsert/` | `step_memory_upsert_iteration` after validate/reduce/graph-upsert; non-fatal `memory_save` call | Complete |
| 6 | `006-loop-wide-dry-run/` | `--dry-run` as first-class input; halt at every mutation boundary with no dispatch/state mutation | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-dashboard-sparkline-trend | 002-single-loop-telemetry-heartbeat | Sparkline renders in reduce-state.cjs without errors | Manual run of reduce-state shows `## 5. TREND` block |
| 002-single-loop-telemetry-heartbeat | 003-unified-observability-event-envelope | Single-loop rows parse like fan-out rows | Parity test passes |
| 003-unified-observability-event-envelope | 004-run-now-control | Envelope module exports `normalizeObservabilityEvent` | TypeScript import resolves |
| 004-run-now-control | 005-per-iteration-memory-upsert | Sentinel consumed-once behavior verified | JSONL events emitted correctly |
| 005-per-iteration-memory-upsert | 006-loop-wide-dry-run | Memory upsert step runs non-fatally | No error thrown on MCP unavailability |
<!-- /ANCHOR:phase-map -->
