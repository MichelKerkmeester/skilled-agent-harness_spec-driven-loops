---
title: "Feature Specification: add model-benchmark lane selection prompts"
description: "Add command prompts that ask for the agent-improvement or model-benchmark lane and route into the dedicated model-benchmark workflow."
trigger_phrases:
  - "command lane-asking"
  - "model-benchmark command entry"
  - "start-model-benchmark-loop"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/007-deep-agent-improvement-benchmark-mode/008-add-model-benchmark-lane-selection-prompts"
    last_updated_at: "2026-05-29T09:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase 008 spec/plan/tasks/checklist"
    next_safe_action: "Build the lane-asking branch + Lane B YAMLs + dedicated command"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-008-docs"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: add model-benchmark lane selection prompts

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 19 |
| **Predecessor** | 007-review-model-benchmark-mode-hardening |
| **Successor** | 009-restructure-skill-md-two-lane |
| **Handoff Criteria** | Lane A behavior unchanged; Lane B runs end-to-end from a command; advisor routes both lanes; README and gemini mirror present |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the two-lane program. The deep-agent-improvement skill already has two runtime lanes: Lane A (agent-improvement, improve an agent `.md` file) and Lane B (model-benchmark, benchmark or optimize a model or prompt framework). Lane B works as a skill mode but has no command entry. This phase makes Lane B first-class at the command layer.

**Scope Boundary**: Command-layer surfaces only (command markdown, command YAML assets, gemini mirror, README, advisor routing). No change to the loop-host or benchmark runtime, which already support `--mode=model-benchmark` (verified in phases 003 to 005).

**Dependencies**:
- The model-benchmark runtime contract from phases 003 to 005 (`loop-host.cjs --mode=model-benchmark`, fixtures, scorers, mode-aware promotion). This phase consumes it, it does not change it.
- The existing Lane A command and its two YAML assets, used as the template for the Lane B equivalents.

**Deliverables**:
- A use-case lane question added to the agent-improvement command so it can branch to the model-benchmark workflow.
- Two Lane B workflow YAMLs (`_auto` and `_confirm`).
- A dedicated `/deep:start-model-benchmark-loop` command plus its gemini mirror.
- README and advisor routing that surface both lanes.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The model-benchmark lane of deep-agent-improvement runs end-to-end at the runtime layer (`loop-host.cjs --mode=model-benchmark`) but has no command entry, so a user cannot start a benchmark run without hand-writing the loop-host invocation. The existing `/deep:start-agent-improvement-loop` command also never asks which use-case lane the user wants, so it silently assumes agent-improvement and the benchmark lane stays invisible. The result is a capability that exists in the skill but is unreachable through the normal command surface.

### Purpose
Make the model-benchmark lane first-class at the command layer: the agent-improvement command asks the use-case lane and branches, and a dedicated `/deep:start-model-benchmark-loop` command starts benchmark runs directly, both backed by Lane B workflow YAMLs and registered in the README and the advisor.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a use-case lane question and an additive lane-resolution branch to `start-agent-improvement-loop.md` so it can route to either lane.
- Create the two Lane B workflow YAMLs (`deep_start-model-benchmark-loop_auto.yaml`, `deep_start-model-benchmark-loop_confirm.yaml`) that drive the model-benchmark runtime contract.
- Create the dedicated `start-model-benchmark-loop.md` command and its gemini mirror `start-model-benchmark-loop.toml`.
- Register the new command in `.opencode/commands/README.txt` and confirm the advisor routes both lanes.

### Out of Scope
- Changing the loop-host or benchmark runtime (fixtures, scorers, grader, promotion) - that contract shipped in phases 003 to 005 and is reused as-is.
- SKILL.md restructure and references/assets reorg - those are phases 009 and 010.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/start-agent-improvement-loop.md` | Modify | Add the use-case lane question plus an additive lane-resolution branch |
| `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml` | Create | Lane B auto-mode workflow YAML |
| `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_confirm.yaml` | Create | Lane B confirm-mode workflow YAML |
| `.opencode/commands/deep/start-model-benchmark-loop.md` | Create | Dedicated Lane B command |
| `.gemini/commands/deep/start-model-benchmark-loop.toml` | Create | Gemini mirror of the Lane B command |
| `.opencode/commands/README.txt` | Modify | Register the new command and the two lanes |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts` | Verify/Modify | Confirm `/deep:start-model-benchmark-loop` alias routes to the deep-model-benchmark skill |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` | Verify/Modify | Confirm the explicit lane maps the new command to the deep-model-benchmark skill |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Lane A behavior is unchanged | Running the agent-improvement lane produces the same workflow as before this phase (behavioral identity); CMD-1 in checklist.md confirms it |
| REQ-002 | Lane B runs end-to-end from a command | `/deep:start-model-benchmark-loop` (or the lane-asking branch) reaches a benchmark-complete state via `loop-host.cjs --mode=model-benchmark` with no hand-written invocation |
| REQ-003 | The command asks the use-case lane | `start-agent-improvement-loop.md` asks which lane the user wants and branches additively, with no silent default that hides Lane B |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The advisor routes both lanes | `skill_advisor.py` maps `/deep:start-agent-improvement-loop` to the agent-improvement skill and `/deep:start-model-benchmark-loop` to the model-benchmark skill |
| REQ-005 | README and gemini mirror present | `.opencode/commands/README.txt` lists the new command and lanes; `.gemini/commands/deep/start-model-benchmark-loop.toml` exists and mirrors the opencode command |
| REQ-006 | No placeholders remain | All authored command and YAML surfaces use real content; strict validate reports no unfilled template placeholders |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A user can start a model-benchmark run from a command and reach benchmark-complete, while the agent-improvement lane behaves exactly as before.
- **SC-002**: Both lanes are discoverable: the advisor routes each command to its skill, and the README plus gemini mirror surface the model-benchmark command.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Model-benchmark runtime contract (phases 003 to 005) | High - no Lane B run without it | Reuse the shipped contract as-is; this phase only wires the command surface |
| Risk | Lane A regression from the additive branch | Med | Keep lane resolution additive; CMD-1 behavioral identity gate confirms Lane A is unchanged |
| Risk | Advisor alias already exists but is unverified | Low | REQ-004 verifies routing for both commands against `skill_advisor.py`, not assumed from source presence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the lane-asking prompt default to agent-improvement when the user gives no signal, or always ask? (Current design: always ask, no silent default.)
- Does the dedicated `/deep:start-model-benchmark-loop` command fully replace the lane-asking branch, or do both stay as parallel entries? (Current design: both stay, the branch routes into the same Lane B workflow.)
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The lane-asking branch adds at most one question to the agent-improvement command. It must not add a perceptible startup delay to a Lane A run.

### Reliability
- **NFR-R01**: Lane A behavioral identity is the reliability invariant. Selecting agent-improvement reproduces the pre-phase Lane A workflow with no observable difference.
- **NFR-R02**: Lane B reuses the shipped loop-host contract, so a benchmark run is as reliable as the phase 003 to 005 runtime. This phase adds no new failure modes in the runtime.

### Security
- **NFR-S01**: No secrets are introduced into the command, YAMLs, or gemini mirror. Lane B profile and outputs-dir paths stay inside the expected packet-local boundaries.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- User gives no lane signal: the command asks rather than silently defaulting, so Lane B never gets hidden behind an implicit Lane A choice.
- Lane B invoked with no `--profile`: loop-host falls back to the default profile (`assets/benchmark-profiles/default.json`), and the YAML must document that default.

### Error Scenarios
- A Lane B run with `--grader llm` but no reachable executor: the run should surface the dispatch failure rather than silently degrade. The YAML default is `--grader noop` so the happy path is deterministic.
- The dedicated command is invoked while the advisor source references it but is not recompiled: routing falls back to general handling. REQ-004 verifies routing against `skill_advisor.py`, not source presence.

### State Transitions
- Lane resolution is a one-time branch per invocation. Once a lane is chosen the run stays in that lane, with no mid-run lane switch.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | 5 to 7 command-layer files; no runtime change |
| Risk | 11/25 | The agent-improvement command is a shared live surface; the additive branch must preserve Lane A identity |
| Research | 6/20 | Runtime contract already verified in phases 003 to 005; Lane A YAMLs are the known template |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
