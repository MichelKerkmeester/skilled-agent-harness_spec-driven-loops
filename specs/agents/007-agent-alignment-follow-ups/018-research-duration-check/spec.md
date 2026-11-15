---
title: "Feature Specification: Phase 18: research-duration-check"
description: "The deep-research duration check sits above step_read_state, where the loop re-enters, so a research run checks its 120-minute limit only on the first pass. This phase moves the check after step_read_state, as 017 did for deep review."
trigger_phrases:
  - "research duration check"
  - "phase 18 research duration check"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 18: research-duration-check

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 18 of 18 |
| **Predecessor** | 017-terminal-record-gaps |
| **Successor** | None |
| **Handoff Criteria** | The research duration check runs after `step_read_state`, the runtime suite shows no failure the baseline lacks, and `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for every folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of the agent alignment follow-ups. It closes the limitation 017 recorded for deep research.

**Scope Boundary**: The position of `step_check_max_duration` in the deep-research loop. Its content does not change.

**Dependencies**:
- 017's move of the same step in the deep-review loop (origin/main `714420ec9a2`)

**Deliverables**:
- The deep-research duration check runs on every pass of the loop
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
In `deep-research.yaml`, `step_check_max_duration` runs before `step_read_state`, and `step_loop_decision` returns to `step_read_state`. So every pass after the first skips the duration check, and the 120-minute limit is checked only once per run.

### Purpose
A deep-research run stops for synthesis on the first pass after its wall-clock budget runs out.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ awk (phase_loop step order up to step_run_now_check) .skilled/commands/deep/assets/deep-research.yaml
821: step_refresh_lock:
826: step_check_max_duration:
852: step_record_artifact_migration:
859: step_read_state:
908: step_run_now_check:
$ sed -n 1701,1703p .skilled/commands/deep/assets/deep-research.yaml
      step_loop_decision:
        action: "Return to step_read_state for next iteration"
        goto: step_read_state
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move `step_check_max_duration` unchanged to just after `step_read_state` in the deep-research loop, matching the deep-review loop.
- Recompile the deep-research contract.

### Out of Scope
- The content of the duration step and its stop behavior: unchanged.
- A terminal gate record for research: deep research has no such record.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/deep/assets/deep-research.yaml` | Modify | Step order in `phase_loop` |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown` | Regenerate | Source digest |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `step_check_max_duration` runs after `step_read_state` and before `step_run_now_check` in the deep-research loop, with its content unchanged. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The runtime suite and `workflow-max-duration.vitest.ts` pass, and the drift check prints `OK`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The `phase_loop` step order lists `step_read_state` before `step_check_max_duration`.
- **SC-002**: `(cd .skilled/skills/system-deep-loop/runtime && npm test)` shows no failure the baseline lacks, and `check-contract-drift.cjs` prints `OK`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `step_record_artifact_migration` now runs before a first-pass duration stop | Low | It is once-only and skipped once recorded; 017's review found the same order correct for deep review |
| Risk | A step between `step_read_state` and the duration check should be skipped on a duration stop | Low | None exists: `step_read_state` only reads files and binds values |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator asked for the fix on 2026-11-15 ("Fix follow").
<!-- /ANCHOR:questions -->

---
