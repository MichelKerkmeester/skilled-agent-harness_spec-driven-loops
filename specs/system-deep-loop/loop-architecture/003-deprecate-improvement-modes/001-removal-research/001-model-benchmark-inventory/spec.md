---
title: "Feature Specification: Phase 1: model-benchmark-inventory"
description: "The model-benchmark deep-loop mode is being removed, and nobody has a complete map of where it is wired. This phase runs a forced-depth deep research pass that inventories every reference so the removal can be planned without leaving dead routes behind."
trigger_phrases:
  - "model benchmark inventory"
  - "phase 1 model benchmark inventory"
  - "model-benchmark removal research"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: model-benchmark-inventory

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 2 |
| **Predecessor** | None |
| **Successor** | 002-agent-improvement-inventory (runs in parallel, not after) |
| **Handoff Criteria** | `research/research.md` exists with a classified, path-cited inventory and a terminal `maxIterationsReached` synthesis record after 10 iterations |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the removal-research phase. It runs at the same time as its sibling, `002-agent-improvement-inventory`, and the two inventories feed `../../002-removal-plan/`.

**Scope Boundary**: read the repository and write only under this folder's `research/` directory. No file outside this folder is edited, moved or deleted in this phase.

**Dependencies**:
- `/deep:research` workflow with the fan-out runner, one `cli-opencode` lineage on `llmgateway/deepseek-v4.1-flash` at `--variant max`
- Stop policy `max-iterations` with a cap of 10, so convergence cannot end the run early

**Deliverables**:
- `research/research.md`: the classified inventory of every model-benchmark reference
- `research/resource-map.md`: the path map the research touched
- Iteration records and state log under `research/`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `model-benchmark` mode of `system-deep-loop` is registered in the hub's mode registry, exposed as the `/deep:model-benchmark` command, and runs through the shared `deep-improvement` packet and its loop host. Its references spread across the hub, the advisor, `sk-doc`, the CLI skills, the runtime mirrors and READMEs. A removal that works from a grep alone will miss indirect wiring such as registry projections, compiled contracts, drift guards and generated mirrors.

### Purpose
Produce a complete, path-cited inventory of everything that must change, be deleted or be kept when `model-benchmark` is removed, so phase 002 can plan the deletion without guessing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every file that names, routes to, tests, documents or generates the `model-benchmark` mode, the `/deep:model-benchmark` command or its YAML and presentation assets
- The mode's slice of the shared `deep-improvement` packet: scripts, loop-host branches, references, templates, feature catalog and playbook entries
- Hub wiring: `mode-registry.json`, `hub-router.json`, `ROUTER.md`, `SKILL.md`, `graph-metadata.json`, `leaf-manifest.json`, `leaf-scopes.json`, `command-metadata.json`, compiled contracts
- Advisor wiring: projection maps, aliases, scorer entries, the routing-registry drift guard and any skill-graph entries
- Runtime mirrors under `.claude`, `.opencode`, `.codex`, `.cursor`, `.pi`, `.devin` and `.hermes`, including Hermes `agent-*` skill mirrors and Pi prompts
- Cross-skill mentions: `sk-doc` (including `sk-create-benchmark`), `cli-external-orchestration`, `system-spec-kit`, `sk-prompt`, `sk-code`, `cli-classifier`, `mcp-tooling`, hooks, `bin/`, git hooks and env examples
- READMEs, changelogs, `AGENTS.md`/`CLAUDE.md`-family docs and the root `README.md`
- Whether anything outside this repository consumes the mode, and where that is recorded

### Out of Scope
- Editing or deleting any file. This phase only reads and reports.
- The `agent-improvement` mode, which `002-agent-improvement-inventory` covers. Shared surfaces are recorded here with the note that the sibling owns the other half.
- Historical spec folders under `specs/`. They are listed as history, not as removal targets.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` (this folder) | Create | Deep-research state, iterations, `research.md` and `resource-map.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run 10 research iterations with no early convergence | The state log holds 10 iteration records and the synthesis record carries `stopReason` `maxIterationsReached` |
| REQ-002 | Classify every reference | Each entry in `research.md` is tagged delete, edit, keep-as-history or shared-with-agent-improvement, with a `[SOURCE: path:line]` tag |
| REQ-003 | Stay read-only outside `research/` | `git status` shows no change outside this folder that the run made |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Name indirect wiring | `research.md` lists registry projections, drift guards, compiled contracts and generated mirrors separately from plain text mentions |
| REQ-005 | Name the gates the removal must keep green | `research.md` lists the tests, validators and doctor checks that cover the touched surfaces |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reviewer can open five random `[SOURCE: path:line]` tags from `research.md` and each one resolves to a real model-benchmark reference.
- **SC-002**: A repo-wide search for `model-benchmark`, `model benchmark` and `deep-model-benchmark` outside `specs/` returns no file that `research.md` fails to account for.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `llmgateway/deepseek-v4.1-flash` provider | The run cannot start or stalls | The fan-out runner's stall watchdog aborts and requeues a silent lineage; a failed run is re-dispatched with the cause recorded |
| Risk | The executor writes outside `research/` | High | The brief names the allowed write path and the runner's write containment records any stray write |
| Risk | Other sessions share this checkout | Low | The runner's churn detector latches preserve mode, so no foreign bytes are restored over |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does `sk-create-benchmark` depend on the model-benchmark mode, or only mention it?
- Does any repository outside this one, such as a consumer of the Skilled framework, call `/deep:model-benchmark`?
<!-- /ANCHOR:questions -->

---
