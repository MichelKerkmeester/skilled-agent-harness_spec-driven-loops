---
title: "Feature Specification: Phase 1: authoring-ux-research"
description: "The 092 epic kept hitting the same authoring errors: generated skill artifacts that drift from their sources, a hub version spread over six files, advisor routes pulled off course by file paths and generic words, and doctor checks that catch drift only after it lands. This phase researches how sk-create-skill and system-skill-advisor could make those errors near impossible at authoring time."
trigger_phrases:
  - "skill authoring ux research"
  - "phase 14 skill authoring ux research"
  - "sk-create-skill authoring errors"
  - "skill advisor routing ux"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: authoring-ux-research

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
| **Branch** | `worktrees/095-skill-authoring-ux-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 9 |
| **Predecessor** | None |
| **Successor** | 002-parent-goal-budget |
| **Handoff Criteria** | research/research.md ends with ranked implementation phases, each naming the file it changes and the check that proves it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the skill authoring UX phase parent: the research the remediation phases 002 to 009 build on.

**Scope Boundary**: Research only. The run writes under this phase's `research/` folder and the packet docs. No product file under `.skilled/` changes.

**Dependencies**:
- The 092 children 001 to 011 under `../`, read for the errors they recorded.
- The cli-pi executor with DeepSeek V4.1 Flash at max effort through the LLM Gateway route.

**Deliverables**:
- A ten-iteration `/deep:research` lineage under `research/lineages/`.
- `research/research.md`, with root causes, verified or inferred labels, rejected ideas and ranked implementation phases.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
During the 092 epic, authors repeatedly shipped generated artifacts that had drifted from their sources (leaf-manifest.json, hub-router.json, mode-registry.json, compiled-route manifests, Hermes skill copies, the trigger index) and had to re-mint them by hand. A hub version lives in six files plus a changelog whose number collided at merge, and the advisor routed 13 of 17 positive battery prompts and let 2 of 5 negatives through. Doctor and router-sync checks report this drift only after it is committed.

### Purpose
Find the root cause of each error class inside sk-create-skill and system-skill-advisor, and rank the smallest authoring-time changes that would stop it, for repository maintainers and for external users who write their own skills.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.skilled/skills/sk-doc/sk-create-skill/`: its scripts, templates, references and generators.
- `.skilled/skills/system-skill-advisor/`: its runtime, scorer, compiled-route front door, doctor checks and leaf manifest.
- The errors recorded in the Known Limitations, Deviations and goal logs of `../001-ponytail-deep-research/` to `../011-round-four-remediation/`.

### Out of Scope
- Changing any product file. This phase recommends; a later phase builds.
- The post-merge review (phase 12) and the general root-cause research (phase 13), which run in parallel.
- Advisor model training or new dependencies.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | Deep-research config, lineage state, iterations and the synthesis |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, `implementation-summary.md` | Modify | Packet docs for this phase |
| `../../spec.md`, `../../goal.md` | Modify | One phase-map row and one binding row for the 014 phase parent |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run `/deep:research` in `:auto` mode on DeepSeek V4.1 Flash at max effort through cli-pi, up to ten iterations | The lineage state log holds one iteration record per completed iteration, at most ten |
| REQ-002 | Name a root cause inside sk-create-skill or system-skill-advisor for each 092 error class | `research/research.md` has a root-cause entry per class with a path:line citation |
| REQ-003 | Mark each load-bearing claim verified or inferred, verified only when the orchestrator ran the command or read the cited line | Each root-cause entry carries a Verified or Inferred label |
| REQ-004 | End the synthesis with implementation phases ranked by errors prevented per unit of cost | Each phase names the file it changes and the check that proves it |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Test each recommendation against `.skilled/repo-rules/prevent-overengineering.md` | `research/research.md` lists rejected ideas with the reason |
| REQ-006 | Cover both repository maintainers and external skill authors | The synthesis names which audience each phase helps |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every ranked phase names one file and one command whose output proves the change.
- **SC-002**: Strict validation of this packet prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | LLM Gateway route for DeepSeek V4.1 Flash | The lineage cannot start | Fall back to `cline-pass/deepseek-v4.1-flash`, which the runner pins at xhigh |
| Risk | A model finding is a hypothesis | High | The orchestrator reruns the command or reads the line before marking a claim verified |
| Risk | Recommendations that grow the tooling | Med | Each one passes the reversal-cost order in prevent-overengineering.md, and rejected ideas are recorded |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at start. Questions the research raises are recorded in `research/research.md`.
<!-- /ANCHOR:questions -->

---
