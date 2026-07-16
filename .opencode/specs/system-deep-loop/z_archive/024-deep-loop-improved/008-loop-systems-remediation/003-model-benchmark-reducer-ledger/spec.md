---
title: "Feature Specification: model-benchmark reducer ledger [template:level_1/spec.md]"
description: "Model-benchmark auto runs wrote benchmark reports but could omit the reducer-visible benchmark_run ledger row when outputs lived outside the improvement runtime folder. This phase makes the auto workflow pass the state log explicitly so reducer rollups can see benchmark runs."
trigger_phrases:
  - "model-benchmark"
  - "benchmark_run"
  - "reducer ledger"
  - "agent-improvement-state"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/008-loop-systems-remediation/003-model-benchmark-reducer-ledger"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented explicit state-log forwarding in the model-benchmark auto workflow"
    next_safe_action: "Review the matching confirm-mode workflow if reducer visibility is required there too"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_model-benchmark_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "model-benchmark-reducer-ledger-2026-06-29"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The auto workflow must pass --state-log because benchmark outputs are outside the improvement runtime folder."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: model-benchmark reducer ledger

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-29 |
| **Branch** | `scaffold/003-model-benchmark-reducer-ledger` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 6 |
| **Predecessor** | 002-deep-improvement-promotion-safety |
| **Successor** | 004-adversarial-playbook-scenarios |
| **Handoff Criteria** | YAML parses, the auto workflow command passes `--state-log`, and a direct model-benchmark runtime check appends a reducer-visible `benchmark_run` row. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is Phase 3 of the loop systems remediation packet.

**Scope Boundary**: Fix the autonomous model-benchmark workflow file so benchmark reports are paired with the reducer-visible append-only ledger row.

**Dependencies**:
- `loop-host.cjs` already forwards `--state-log` to `run-benchmark.cjs`.
- `run-benchmark.cjs` already appends `benchmark_run` when a state log path is provided.
- Reviewer benchmark mode already supplied the state log directly.

**Deliverables**:
- Updated autonomous model-benchmark workflow command.
- Filled Level-1 phase documentation.
- Verification evidence for YAML parsing and reducer-ledger emission.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The autonomous model-benchmark workflow sends benchmark outputs to `.opencode/skills/sk-prompt-models/benchmarks/{run_label}`, outside `{spec_folder}/improvement`. `run-benchmark.cjs` can only infer the state log when outputs live under an `improvement` directory, so non-reviewer benchmark runs could write `report.json` without appending the `benchmark_run` row consumed by the reducer.

### Purpose
Ensure autonomous model-benchmark runs are visible to the reducer rollup by making the workflow pass `{spec_folder}/improvement/agent-improvement-state.jsonl` explicitly.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the sibling deep-loop YAMLs and benchmark runner to confirm the existing ledger pattern.
- Update `.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml` so the non-reviewer model-benchmark branch passes `--state-log`.
- Keep reviewer benchmark behavior unchanged because it already passes `--state-log`.
- Fix same-file YAML quoting that blocked the required parse verification.

### Out of Scope
- Changing benchmark runner code.
- Changing reducer code.
- Changing confirm-mode workflow behavior.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml` | Modify | Pass `--state-log` on the non-reviewer model-benchmark loop-host call and make the existing promotion command parse as YAML. |
| `.opencode/specs/system-deep-loop/024-deep-loop-improved/008-loop-systems-remediation/003-model-benchmark-reducer-ledger/spec.md` | Modify | Replace scaffold placeholders with the completed phase specification. |
| `.opencode/specs/system-deep-loop/024-deep-loop-improved/008-loop-systems-remediation/003-model-benchmark-reducer-ledger/plan.md` | Modify | Replace scaffold placeholders with the completed implementation plan. |
| `.opencode/specs/system-deep-loop/024-deep-loop-improved/008-loop-systems-remediation/003-model-benchmark-reducer-ledger/tasks.md` | Modify | Replace scaffold placeholders with completed tasks. |
| `.opencode/specs/system-deep-loop/024-deep-loop-improved/008-loop-systems-remediation/003-model-benchmark-reducer-ledger/implementation-summary.md` | Modify | Record what changed and verification results. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Autonomous model-benchmark runs must emit the reducer-visible benchmark ledger row. | The non-reviewer `loop-host --mode=model-benchmark` command includes `--state-log "{spec_folder}/improvement/agent-improvement-state.jsonl"`. |
| REQ-002 | The workflow YAML must remain parseable. | `js-yaml` parses `.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml` and the parsed command contains the state-log flag. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Match existing sibling mode evidence patterns instead of adding a duplicate orchestrator append. | Research/review and benchmark runner inspection confirms the workflow should rely on runner-owned append semantics, with the YAML supplying the missing state-log path. |
| REQ-004 | Verify runtime behavior when benchmark outputs are outside the improvement folder. | A direct `loop-host --mode=model-benchmark` check writes a `benchmark_run` row to `/tmp/model-benchmark-ledger-check/improvement/agent-improvement-state.jsonl`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The auto workflow passes `--state-log` to the non-reviewer model-benchmark path.
- **SC-002**: YAML parse verification passes.
- **SC-003**: Direct runtime verification appends a `benchmark_run` row with mode `model-benchmark`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `loop-host.cjs` state-log forwarding | If forwarding regresses, the YAML flag would not reach `run-benchmark.cjs`. | Direct Node check confirms `planInvocation` forwards `--state-log`. |
| Dependency | Local Vitest availability | The existing Vitest benchmark suites could not run without a local runner or network. | Direct runtime check exercised the affected command path with Node. |
| Risk | Confirm-mode parity | Confirm workflow has similar command text but was outside the requested file scope. | Documented as a follow-up review target. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
