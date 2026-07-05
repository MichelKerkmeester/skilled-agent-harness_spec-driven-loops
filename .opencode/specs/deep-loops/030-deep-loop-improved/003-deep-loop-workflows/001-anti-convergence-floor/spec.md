---
title: "Anti-Convergence Floor for Deep-Loop-Workflows Research Mode"
description: "Deep-loop-workflows research mode has no minimum iteration guard; the step_check_convergence YAML step can halt a run after a single candidate forms, before quality checks run, producing shallow research. minIterations and convergenceMode:off are needed to prevent premature stops."
trigger_phrases:
  - "anti-convergence floor"
  - "min iterations guard"
  - "convergence mode off"
  - "research floor deep loop"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/003-deep-loop-workflows/001-anti-convergence-floor"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored spec.md from research.md §5.2 (iters 26, 27)"
    next_safe_action: "Implement minIterations + convergenceMode fields in config and YAML"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json"
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-authoring-003-deep-loop-workflows"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Anti-Convergence Floor for Deep-Loop-Workflows Research Mode

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 12 |
| **Predecessor** | None |
| **Successor** | 002-convergence-profile-unification-adr |
| **Handoff Criteria** | `minIterations` guard + `convergenceMode:"off"` both accepted by config schema; `min_iterations_guard_pass` event present in JSONL output; YAML guard does not halt on missing field |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the deep-loop-workflows recommendations.

**Scope Boundary**: Config and YAML changes for the research mode only. Cross-mode projection is handled in 003-cross-mode-anti-convergence-adr.

**Dependencies**:
- None (first leaf; this is the prerequisite for 002 and 003)

**Deliverables**:
- `minIterations` field (default 3) added to `deep_research_config.json`
- `convergenceMode` field added to config (values: `"default"` | `"off"`)
- `step_check_convergence` YAML guard emitting `min_iterations_guard_pass` event
- Validation that `minIterations <= maxIterations` enforced at config load

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-research loop's `step_check_convergence` step can trigger a STOP after a single candidate forms, with no minimum iteration floor enforced. This causes shallow research runs that terminate before quality guards run and before the angle-bank has been meaningfully explored. The config has no `minIterations` field and no `convergenceMode` escape hatch, so operators have no declarative way to prevent premature stops.

### Purpose
Add `minIterations` (default 3, `<= maxIterations`) as a STOP override and `convergenceMode:"off"` to disable convergence-STOP (while keeping hard caps, pause, and halts active), so research runs cannot stop before the operator-configured floor. The `min_iterations_guard_pass` event must be distinct from quality-guard events for dashboard attribution.

> **Reference evidence**: `external/kasper/src/config.ts:46` (observation-threshold + convergenceMode); `external/loop-cli-main/src/loop-config.ts:22-32` (minIterations schema). Research.md §5.2 + (iters 26, 27).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `minIterations` field (default 3) in `deep_research_config.json`
- `convergenceMode` field (values: `"default"` | `"off"`) in `deep_research_config.json`
- `step_check_convergence` YAML guard: block STOP when `iterationCount < minIterations`
- `min_iterations_guard_pass` JSONL event emitted when floor clears (distinct from quality-guard events)
- Config-load validation: `minIterations <= maxIterations`
- YAML guard must fail-open (log warning, not halt) when field is missing from older configs

### Out of Scope
- Cross-mode projection of the anti-convergence contract — handled in 003-cross-mode-anti-convergence-adr
- Convergence math unification ADR — handled in 002-convergence-profile-unification-adr
- Council mode `minRounds` variant — handled in 003

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json` | Modify | Add `minIterations` (default 3) and `convergenceMode` ("default"\|"off") fields |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Modify | Add `min_iterations_guard_pass` event emission and STOP guard in `step_check_convergence` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `minIterations` field (default 3) in `deep_research_config.json`; STOP blocked when `iterationCount < minIterations` regardless of convergence score | Config with `minIterations:1` and a converged score allows STOP on iteration 1; config with `minIterations:3` blocks STOP on iterations 1 and 2 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | `convergenceMode:"off"` disables only convergence-STOP; hard caps/pause/halts still fire; `min_iterations_guard_pass` event is emitted when iteration count clears the floor | JSONL output contains `min_iterations_guard_pass` with `iterationCount` and `minIterations` fields; setting `convergenceMode:"off"` with `maxIterations:10` still stops at iteration 10 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `deep_research_config.json` schema accepts `minIterations:3` and `convergenceMode:"off"` without errors; a research run with 1 completed iteration does not stop at the convergence check when `minIterations:3`
- **SC-002**: `min_iterations_guard_pass` event appears in JSONL output on the iteration where `iterationCount >= minIterations`; this event is distinct from `quality_guard_pass` and convergence-stop events
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Off-by-one in STOP predicate could cause infinite loops if `minIterations > maxIterations` | High | Validate `minIterations <= maxIterations` at config load; log error and clamp if violated |
| Risk | YAML guard failing closed (halting) on missing `minIterations` field breaks existing configs | Med | Guard must be fail-open: treat missing field as `minIterations:0` (no floor) with a deprecation warning |
| Dependency | Convergence-profile unification ADR (002) must not contradict this field's semantics | Med | Coordinate field names with 002 author; `minIterations` is already the canonical name in both references |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `minIterations` be overridable as a per-invocation CLI flag or is config-only acceptable for the initial implementation?
- What is the correct hard cap behavior when `convergenceMode:"off"` and `maxIterations` is not set? Should there be an implicit ceiling (e.g., 50)?
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
