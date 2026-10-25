---
title: "Feature Specification: Phase 1: quality-mode-research"
description: "Ten iterations of deep research on how to make sk-code-quality more repo-agnostic, more useful and better integrated with its sibling modes and with modes a user adds to the hub. Findings only."
trigger_phrases:
  - "quality mode research"
  - "phase 1 quality mode research"
  - "sk-code-quality research"
  - "repo-agnostic quality gate"
  - "user-authored mode integration"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: quality-mode-research

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-25 |
| **Branch** | `worktrees/218-ci-efficiency-build` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 2 |
| **Predecessor** | None |
| **Successor** | 002-review-mode-research |
| **Handoff Criteria** | Ten iteration records in `research/deep-research-state.jsonl`, a ranked `research/research.md` of at least eight rows and no changed file under `.skilled/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the sk-code Quality and Review Modes Research specification.

**Scope Boundary**: Findings only. The run writes under `research/` and makes only the bounded `spec.md` edits the deep-research protocol allows. It changes nothing under `.skilled/`.

**Dependencies**:
- `.skilled/skills/sk-code/sk-code-quality/SKILL.md` and the folders beside it: `scripts/`, `assets/code-quality-checklist/`, `benchmark/reports/`, `manual-testing-playbook/` and `changelog/`
- The hub routing files `.skilled/skills/sk-code/SKILL.md`, `mode-registry.json`, `ROUTER.md`, `hub-router.json` and `leaf-manifest.json`
- `.skilled/skills/sk-code/shared/references/stack-detection.md` and `phase-detection.md`
- `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md`, sections 6 and 7
- `.skilled/repo-rules/skill-hub-routing.md`, for what "integrated" requires

**Deliverables**:
- `research/research.md` with the sections Repo-Agnostic Findings, Usefulness Findings, Integration Findings (with an External-User Modes subsection) and Ranked Recommendations
- `research/iterations/iteration-001.md` through `iteration-010.md`
- `research/deep-research-state.jsonl` with ten iteration records and one synthesis_complete record

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-code-quality` is the author-side gate that runs after implementation and before a completion claim. Its target-path checklist map is keyed to `.skilled/skills/`, `.skilled/agents/`, `.skilled/commands/` and `.opencode/specs/`, and its three comment-hygiene enforcement layers sit under `.skilled/` and `.github/` (`SKILL.md` lines 112 to 131). Its checklists live in the sibling `sk-code-skilled` packet. Its routing is one thin intent over one checklist (`SKILL.md` lines 141 to 159). Its advisory handoff envelope, CODE_QUALITY_RESULT v1, is named only in its own `SKILL.md` (line 210), and no other file under `.skilled/skills/sk-code/` mentions it.

The mode is therefore tied to this framework's layout. Its value to a repository with another layout is unclear, and a mode a user adds to the hub has no documented way to plug into it.

### Purpose

When this phase is done, a ranked list of OBSERVED, DERIVED or INFERRED recommendations says how to make `sk-code-quality` portable across repositories, more useful to the author who runs it and better joined to `sk-code-review`, the surface packets and user-authored modes. The findings live in `research/research.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every repo-bound assumption in the quality packet (`SKILL.md`, `scripts/`, `assets/` and the hook paths it names), each classed portable, configurable or repo-bound.
- What the mode does in a repository with no `.skilled/` tree, where `shared/references/stack-detection.md` resolves the surface to UNKNOWN.
- The usefulness of the gate, judged from its benchmark reports, playbook scenarios, changelog entries and checker scripts.
- Its contract with `sk-code-review`, `sk-code-skilled`, `sk-code-ci` and the shared workflow doctrine under `shared/references/`.
- How a user-authored workflow or surface mode plugs in through the eleven-row integration list, and what the quality mode would have to offer that mode.

### Out of Scope
- Editing any file under `.skilled/`. Recommendations are ranked, not applied.
- `sk-code-review` as a subject, which phase 2 owns. It is read here only to describe the boundary with quality.
- Relaxing the P0 floor, the missing `Write` and `Task` authority or the advisory-only envelope status. These are fixed inputs. A recommendation that needs one of them to change says so and is ranked as needing a decision.
- Implementing a recommendation, adding tests or running a benchmark.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | The synthesis with the ranked recommendations |
| `research/iterations/iteration-001.md` through `iteration-010.md` | Create | One record per iteration |
| `research/deep-research-state.jsonl` | Create | Loop state and the stop reason |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Repo-agnostic findings: every repo-bound assumption in `sk-code-quality` is listed with a source tag and classed portable, configurable or repo-bound. Each repo-bound item has a recommendation that removes or isolates it. |
| REQ-002 | Usefulness findings tied to evidence: what the gate catches, costs and misses is judged from its own benchmark reports, playbook scenarios, changelog entries and the three checker scripts. Each judgement cites a source tag and at least two recommendations raise usefulness. |
| REQ-003 | Integration findings: the contract with `sk-code-review`, `sk-code-skilled`, `sk-code-ci` and the shared workflow doctrine is described, and so is what a user-authored workflow or surface mode needs from quality. Gaps are ranked. |
| REQ-004 | A ranked recommendation list: `research/research.md` ends in a Ranked Recommendations section of at least eight rows. Each row carries rank, gain, an OBSERVED, DERIVED or INFERRED label, a source tag, effort, risk and whether it is ready now or needs a decision. |
| REQ-005 | No change to the hub: nothing under `.skilled/` is edited in this phase. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Run integrity: ten iteration files, ten iteration records in the state log, a recorded stop reason, source tags that resolve and no read of the sibling phase's `research/` folder. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/deep-research-state.jsonl` holds ten iteration records and a synthesis_complete record that names its stop reason.
- **SC-002**: `research/research.md` ranks at least eight recommendations and every row carries an evidence label.
- **SC-003**: Three source tags opened by the orchestrator resolve to the quoted text.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `cli-codex` with Luna and `cli-pi` with the llmgateway credential | The run cannot start | Probe each executor with a one-line dispatch before the loop and read each skill's `SKILL.md` before composing a brief |
| Risk | The model restates the brief instead of reading files | Findings without evidence | The brief carries the reading list and demands a source tag with a path and line |
| Risk | Recommendations fit this framework only | The repo-agnostic goal is not met | Each recommendation names the non-framework repository case it serves |
| Risk | Two executors read the same file differently | Conflicting findings | The state log records the executor per iteration and the synthesis names each conflict |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each iteration writes its record file before the next iteration starts.

### Security
- **NFR-S01**: The run has no write authority outside `research/` and the bounded `spec.md` edits the protocol allows.

### Reliability
- **NFR-R01**: The run is resumable from `research/deep-research-state.jsonl` after any provider failure.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an iteration that writes no record file is a failed iteration, not a converged one.
- Maximum length: ten iterations, no more.
- Invalid format: a source tag that does not resolve is dropped at synthesis or relabelled INFERRED.

### Error Scenarios
- External service failure: a provider capacity error stops the lineage and the orchestrator relaunches from state.
- Network timeout: nothing is fetched, so none applies.
- Concurrent access: the sibling phase may run at the same time, and each run writes only under its own `research/` folder.

### State Transitions
- Partial completion: fewer than ten records means the phase is not closeable and the next relaunch resumes from state.
- Session expiry: the state log and the strategy file carry everything a fresh session needs.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Files: about 14 packet documents, LOC: 0, Systems: 1 read-only skill hub |
| Risk | 3/25 | Auth: N, API: N, Breaking: N |
| Research | 18/20 | Ten-angle investigation across the hub and two sibling modes |
| **Total** | **29/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the executor alternation run per iteration or per child? The parent spec holds the default and the question.
- Are the surface checklists under `sk-code-skilled/assets/checklists/` read in depth, or only as the quality mode's dependency? The default is as a dependency, with depth only where the quality gate loads them.
<!-- /ANCHOR:questions -->

---

