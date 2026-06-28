---
title: "Feature Specification: Phase 4: commands-scripts-data"
description: "Update the workflow command YAMLs (deep_*.yaml benchmark/context paths), the pre-commit hook, the agent ref, and benchmark-output run-pointers to the new skill path."
trigger_phrases:
  - "sk-prompt-models command yaml paths"
  - "deep_model-benchmark benchmark path rename"
  - "sk-prompt-models scripts agents"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/158-sk-prompt-models-rename/004-commands-scripts-data"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase scaffolded; not started"
    next_safe_action: "Update command YAMLs, hook, agent, run-pointers"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/004-commands-scripts-data"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: commands-scripts-data

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Not Started (Planned) |
| **Created** | 2026-06-28 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 6 |
| **Predecessor** | 003-cross-skill-and-code-refs |
| **Successor** | 005-specs-history-sweep |
| **Handoff Criteria** | Command YAMLs + hook + agent + run-pointers point at the new path; benchmark/context workflows write/read the new location |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the sk-prompt-models-rename specification — the workflow commands, scripts, agents, and benchmark-output pointers.

**Scope Boundary**: `.opencode/commands/**`, `.opencode/scripts/**`, `.opencode/agents/**`, and run-pointers that name the benchmark output dir. The skill + sibling skills are phases 2–3; specs are phase 5.

**Dependencies**:
- Phase 2 (the benchmarks output dir now lives under `sk-prompt-models/benchmarks/`).

**Deliverables**:
- `commands/deep/assets/deep_model-benchmark_{auto,confirm}.yaml`: `benchmark_root`, `benchmark_report`, `reviewer_report`, the `mkdir`, the `loop-host --outputs-dir`, the `promote-candidate --benchmark-report` paths.
- `commands/deep/assets/deep_context_{auto,confirm}.yaml`: `prompt_framing:` path + the loader refs to the SKILL.md.
- `commands/deep/model-benchmark.md`: the prose output-path mention.
- `scripts/git-hooks/pre-commit`; the 1 `agents/` ref; benchmark run-pointers (e.g. `157-glm-5-2-support/002-framework-bakeoff/improvement/benchmark-run-pointer.json`).

**Changelog**:
- When this phase closes, add the matching file to ../changelog/.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `/deep:model-benchmark` and `/deep:context` workflows hardcode `.opencode/skills/sk-prompt-small-model/...` paths — the benchmark workflow writes outputs to and promotes from `sk-prompt-small-model/benchmarks/{run_label}`, and the context workflow loads `prompt_framing` from the SKILL.md. After the folder moves, those paths are dead.

### Purpose
Repoint the command YAMLs, the pre-commit hook, the agent ref, and the benchmark run-pointers at `sk-prompt-models` so the deep-loop workflows write/read the correct location.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Token-replace in `commands/deep/assets/deep_model-benchmark_{auto,confirm}.yaml`, `deep_context_{auto,confirm}.yaml`, `commands/deep/model-benchmark.md`.
- `scripts/git-hooks/pre-commit`, the `agents/` ref, and benchmark run-pointers under specs.

### Out of Scope
- The skill + sibling skills (phases 2–3); the spec/history bulk (phase 5); index regeneration (phase 6).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/assets/deep_model-benchmark_{auto,confirm}.yaml` | Modify | benchmark_root/report/reviewer_report/mkdir/outputs-dir/promote paths |
| `.opencode/commands/deep/assets/deep_context_{auto,confirm}.yaml` | Modify | `prompt_framing:` + loader paths |
| `.opencode/commands/deep/model-benchmark.md` | Modify | prose output-path mention |
| `.opencode/scripts/git-hooks/pre-commit` | Modify | path/string ref |
| `.opencode/agents/**` (1 ref) | Modify | path/prose ref |
| `…/157-glm-5-2-support/002-framework-bakeoff/improvement/benchmark-run-pointer.json` | Modify | `outputsDir` pointer into benchmarks/** |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Benchmark workflow paths updated | All `sk-prompt-small-model/benchmarks/{run_label}` occurrences in the deep_model-benchmark YAMLs point at `sk-prompt-models/...` |
| REQ-002 | Context workflow paths updated | `deep_context_*.yaml` `prompt_framing` + loaders point at `sk-prompt-models/SKILL.md` |
| REQ-003 | Run-pointers updated | Benchmark run-pointers naming the output dir point at the new path |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Hook + agent updated | pre-commit hook + the agent ref say the new name |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg "sk-prompt-small-model" .opencode/commands .opencode/scripts .opencode/agents` returns 0.
- **SC-002**: A dry parse of the edited YAMLs is valid (no broken path interpolation).
<!-- /ANCHOR:success-criteria -->

### Acceptance Scenarios

- **Given** the edited deep_model-benchmark YAMLs, **When** a benchmark run is simulated, **Then** the output/promote paths resolve under `sk-prompt-models/benchmarks/`.
- **Given** the edited deep_context YAMLs, **When** `prompt_framing` loads, **Then** it reads `sk-prompt-models/SKILL.md`.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A YAML path occurrence missed | Benchmark writes to a dead path | rg the commands dir = 0 after edits; the count of benchmark paths is enumerated in phase 1 |
| Risk | Editing a frozen run-pointer for a completed packet | Rewriting a historical record | Update only the path field (which must resolve), keep the rest of the record intact |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — the command/script/agent/run-pointer set is enumerated by phase 1's map.
<!-- /ANCHOR:questions -->
