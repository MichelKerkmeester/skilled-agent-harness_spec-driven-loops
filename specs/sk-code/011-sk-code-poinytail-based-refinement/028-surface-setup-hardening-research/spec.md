---
title: "Feature Specification: Phase 28: surface-setup-hardening-research"
description: "Two-lineage deep research into what still breaks the rule that every sk-code surface except sk-code-opencode and sk-code-review is irrelevant to an external user and that a new surface outranks sk-code-opencode, the external user's journey from clone to a green battery, and whether the setup belongs in a doctor command or a hub mode. Research only."
trigger_phrases:
  - "surface setup hardening research"
  - "phase 28 surface setup hardening research"
  - "doctor sk-code-setup versus hub mode"
  - "external user sk-code surface journey"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 28: surface-setup-hardening-research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-13 |
| **Branch** | `worktrees/132-surface-setup-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 28 of 28 |
| **Predecessor** | 027-surface-tie-order-warning |
| **Successor** | None |
| **Handoff Criteria** | Every criterion in `goal.md` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 28** of the sk-code Ponytail refinement epic. It follows 025 (the research), 026 (its build) and 027 (doctor check 5l).

**Scope Boundary**: Read-only research. The run writes only under this folder and the epic's phase rows. No skill, command, script or README changes. Experiments run in throwaway copies under the session scratchpad's `028/` folder, never in a worktree or the main checkout.

**Dependencies**:
- The `/deep:research` auto workflow as a two-lineage fan-out, five iterations each, stop policy `max-iterations`, concurrency 2.
- Lineage `deepseek-max`: `cli-devin` with model `deepseek-v4-1-flash-max`. Lineage `swe-max`: `cli-devin` with model `swe-2-max`.
- If Devin returns `resource_exhausted`, only that lineage switches to `pi -p --no-extensions --model llmgateway/deepseek-v4.1-flash --thinking max`.
- `devin`, `node` and `git` on the PATH.

**Deliverables**:
- `research/research.md`: findings marked NEW or ALREADY-COVERED and CONFIRMED or REJECTED, ranked recommendations, the doctor-command versus hub-mode answer with a name, rejected ideas and proposed build phases with nested-goal sketches.
- Each lineage's state and iterations under `research/lineages/`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Skilled assumes that every sk-code surface except sk-code-opencode and sk-code-review means nothing to an external user, and that any surface the user adds outranks sk-code-opencode. Phases 025 to 027 made the scaffold place a new surface ahead of opencode, made the drift guards tolerate removed examples, pointed the doctor, guard and sync messages at the fix, wrote the README adaptation block and added doctor check 5l. The assumption can still break through paths those phases did not cover, and the setup an external user performs is still a manual sequence spread across a README block, two registries, a scaffold command and a doctor battery.

### Purpose
Find what still breaks the assumption, walk the external user's journey from clone to a green battery, decide whether the setup belongs in a new doctor command or a new sk-code mode and what to call it, and recommend the smallest changes, each with the failure it prevents.

### Research Questions

1. Where can the assumption still break: hand edits to `tieBreak` or the registries, the skill advisor, compiled routing, the Hermes copies, the other runtimes' mirrors, playbooks, benchmarks, canaries, feature catalogs and fresh clones?
2. What does an external user do from clone to a green battery, and where is each friction point?
3. Which manual steps can existing automation absorb, and which need judgment?
4. Should the setup be a new doctor command (for example `/doctor sk-code-setup`) referenced from the sk-code hub, or a new sk-code mode (for example `sk-code-setup`)? What should it be called, where would each be referenced and what does each cost?
5. Which ideas should be rejected, and why?
6. Which findings are new, and which are already covered by 025, 026 or 027?
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The sk-code hub, its registries, router and surfaces; the compiled-routing manifest and runtime; the skill advisor; the doctor commands and scripts; the scaffold command; runtime mirrors; playbooks, benchmarks, canaries, feature catalogs; the root README adaptation block.
- Observed behavior in throwaway copies, including a copy with the two examples removed.
- Ranked recommendations, the doctor-versus-mode answer and proposed build phases.

### Out of Scope
- Changing any skill, command, script, README or release note. The operator decides the build later.
- Changing sk-code-opencode's generic language keywords. Operator ruling R5 stands; its UX cost may be reported.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | Lineage configs, state, iterations and the merged synthesis |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, `implementation-summary.md` | Modify | Charter, outcome and log |
| `../spec.md`, `../goal.md` | Modify | Phase row 28, handoff row, binding row and criteria counts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run five iterations in each lineage; a convergence stop before five does not count | Each lineage's `deep-research-state.jsonl` holds five iteration records |
| REQ-002 | Write finding rows `\| F<n> \| <class> \| <claim> \| <evidence path:line or command> \| <NEW or ALREADY-COVERED> \| <CONFIRMED or REJECTED> \| <lineage> \|` | Every F row names its coverage and verdict and cites a path:line |
| REQ-003 | Verify every load-bearing finding against the tree with a command or a file read before it reaches a recommendation | Each F row carries CONFIRMED or REJECTED from the orchestrator's own check |
| REQ-004 | Rank recommendations as R rows, each naming the failure it prevents, the smallest change and its target files | At least one R row exists and each cites a path:line |
| REQ-005 | Answer the doctor-command versus hub-mode question with a recommended name and where it is referenced | `research/research.md` has a section on it |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Record rejected ideas as X rows with the reason | At least one X row exists |
| REQ-007 | Propose build phases as P rows, each with a nested-goal sketch | Each P row carries a goal sketch |
| REQ-008 | Pass every recommendation through `.skilled/repo-rules/prevent-overengineering.md` | Each R row names the cheaper move and why it fails |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each research question has an answer backed by path:line or command evidence, or is marked UNKNOWN with what would settle it.
- **SC-002**: Every criterion in `goal.md` passes, strict validation included.
- **SC-003**: No file outside this folder and the epic's phase rows differs from the base commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `devin` with `deepseek-v4-1-flash-max` and `swe-2-max` | A lineage stops on a usage limit | Switch only that lineage to the named `pi` fallback and record it |
| Risk | An executor writes outside its lineage folder | Tracked files change | The prompt bars it; the write-containment guard and `git status` after every iteration catch it |
| Risk | A model cites a line or a result it did not check | A wrong recommendation reaches the operator | The orchestrator rereads every load-bearing citation and reruns experiments in its own copy |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking the run. The research questions are in section 2.
- Deep-research topic: surface setup hardening for external sk-code users, the setup journey from clone to a green battery, and a doctor command versus a sk-code hub mode for the setup.
- Research Context: deep-research is active for this topic in two lineages under research/lineages/; research/research.md is canonical.
<!-- BEGIN GENERATED: deep-research/spec-findings -->
Abridged from `research/research.md`, which stays canonical:
- A fresh clone fails the battery before any adaptation; `worktree-naming.sh provision` fixes it and the adapting block does not name it, nor the per-clone hook trust flag (R1).
- The guard's stale-manifest line names no command, and the battery's route probe exits 0 on the legacy stub (R2, R3).
- The removal and add recipes miss the derived-metadata regenerator, the feature catalog, `leaf-scopes.json` and the surface-count files (R4).
- The setup belongs in a read-only doctor command, `/doctor:sk-code setup`; a `sk-code-setup` hub mode is rejected (X1).
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
