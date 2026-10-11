---
title: "Feature Specification: Phase 2: agent-improvement-inventory"
description: "The agent-improvement deep-loop mode is being removed together with the deep-improvement agent and packet it runs on. This phase runs a forced-depth deep research pass that inventories every reference so the removal can be planned without leaving dead routes behind."
trigger_phrases:
  - "agent improvement inventory"
  - "phase 2 agent improvement inventory"
  - "agent-improvement removal research"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: agent-improvement-inventory

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
| **Phase** | 2 of 2 |
| **Predecessor** | 001-model-benchmark-inventory (runs in parallel, not before) |
| **Successor** | None |
| **Handoff Criteria** | `research/research.md` exists with a classified, path-cited inventory and a terminal `maxIterationsReached` synthesis record after 10 iterations |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the removal-research phase. It runs at the same time as its sibling, `001-model-benchmark-inventory`, and the two inventories feed `../../002-removal-plan/`.

**Scope Boundary**: read the repository and write only under this folder's `research/` directory. No file outside this folder is edited, moved or deleted in this phase.

**Dependencies**:
- `/deep:research` workflow with the fan-out runner, one `cli-opencode` lineage on `llmgateway/deepseek-v4.1-flash` at `--variant max`
- Stop policy `max-iterations` with a cap of 10, so convergence cannot end the run early

**Deliverables**:
- `research/research.md`: the classified inventory of every agent-improvement reference
- `research/resource-map.md`: the path map the research touched
- Iteration records and state log under `research/`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `agent-improvement` mode of `system-deep-loop` is registered in the hub's mode registry, exposed as the `/deep:agent-improvement` command, dispatched to the `deep-improvement` agent and run by the shared `deep-improvement` packet's loop host. The advisor folds the legacy `deep-improvement` id onto it as its default mode. Its references spread across the hub, the advisor, `sk-doc`, the CLI skills, hooks, the runtime mirrors and READMEs. A removal that works from a grep alone will miss indirect wiring such as alias folds, projection maps, drift guards and generated agent mirrors.

### Purpose
Produce a complete, path-cited inventory of everything that must change, be deleted or be kept when `agent-improvement` is removed, including the `deep-improvement` agent and packet once no mode uses them, so phase 002 can plan the deletion without guessing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every file that names, routes to, tests, documents or generates the `agent-improvement` mode, the `/deep:agent-improvement` command or its YAML and presentation assets
- The `deep-improvement` agent definition and every runtime copy of it, including Hermes `agent-deep-improvement` skill mirrors
- The `deep-improvement` packet as a whole: scripts, the shared loop host, references, templates, feature catalog, playbook, tests and runtime libraries it pulls in
- Hub wiring: `mode-registry.json`, `hub-router.json`, `ROUTER.md`, `SKILL.md`, `graph-metadata.json`, `leaf-manifest.json`, `leaf-scopes.json`, `command-metadata.json`, compiled contracts
- Advisor wiring: the `deep-improvement` legacy id, its alias group, the alias-fold and default-mode projection, scorer entries, the routing-registry drift guard and skill-graph entries
- Runtime mirrors under `.claude`, `.opencode`, `.codex`, `.cursor`, `.pi`, `.devin` and `.hermes`, plus hooks, task-dispatch, git hooks, `bin/` and env examples
- Cross-skill mentions in `sk-doc`, `cli-external-orchestration`, `system-spec-kit`, `sk-prompt`, `sk-code`, `sk-design`, `cli-classifier` and `mcp-tooling`
- READMEs, changelogs, `CROSS-CLI.md`, agent and command index files and the root `README.md`
- Whether anything outside this repository consumes the mode or the agent, and where that is recorded

### Out of Scope
- Editing or deleting any file. This phase only reads and reports.
- The `model-benchmark` mode, which `001-model-benchmark-inventory` covers. Shared surfaces are recorded here with the note that the sibling owns the other half.
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
| REQ-002 | Classify every reference | Each entry in `research.md` is tagged delete, edit, keep-as-history or shared-with-model-benchmark, with a `[SOURCE: path:line]` tag |
| REQ-003 | Stay read-only outside `research/` | `git status` shows no change outside this folder that the run made |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Name indirect wiring | `research.md` lists alias folds, projection maps, drift guards, compiled contracts and generated mirrors separately from plain text mentions |
| REQ-005 | Name what else imports the `deep-improvement` packet | `research.md` lists every caller of its scripts and runtime libraries outside the two modes, so deleting the packet breaks nothing unplanned |
| REQ-006 | Name the gates the removal must keep green | `research.md` lists the tests, validators and doctor checks that cover the touched surfaces |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reviewer can open five random `[SOURCE: path:line]` tags from `research.md` and each one resolves to a real agent-improvement or deep-improvement reference.
- **SC-002**: A repo-wide search for `agent-improvement`, `agent improvement` and `deep-improvement` outside `specs/` returns no file that `research.md` fails to account for.
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

- Does any other deep-loop mode or skill import code from the `deep-improvement` packet?
- Does any repository outside this one, such as a consumer of the Skilled framework, call `/deep:agent-improvement` or the `deep-improvement` agent?
<!-- /ANCHOR:questions -->

---
