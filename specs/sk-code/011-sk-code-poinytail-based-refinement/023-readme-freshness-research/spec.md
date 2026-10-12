---
title: "Feature Specification: Phase 23: readme-freshness-research"
description: "Ten-iteration deep research into whether the root README and the READMEs it links to still match the repository after the v4.0.0.4 release. Research only; no README is edited."
trigger_phrases:
  - "readme freshness research"
  - "phase 23 readme freshness research"
  - "root readme after v4.0.0.4"
  - "stale readme statements"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 23: readme-freshness-research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-12 |
| **Branch** | `worktrees/122-readme-freshness-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 23 of 23 |
| **Predecessor** | 022-doc-version-and-playbook-paths |
| **Successor** | None |
| **Handoff Criteria** | Every criterion in `goal.md` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 23** of the sk-code Ponytail refinement epic.

**Scope Boundary**: Read-only research. The run writes only under this folder. No README or product file changes; the operator decides the fixes later.

**Dependencies**:
- The `/deep:research` workflow, run for 10 iterations on `cli-devin` with model `deepseek-v4-1-flash-max` (DeepSeek V4.1 Flash, max effort).
- `devin` and `node` on the PATH.

**Deliverables**:
- `research/research.md`, the checked synthesis with a ranked fix list per README.
- The loop's state and iterations under `research/`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The v4.0.0.4 release note, `.skilled/changelog/skilled/v4.0.0.4.md`, lists changes to install steps and Node 24, per-doc versions, unknown-option refusal, playbook and catalog path checks, advisor agreement in CI, retired deep-loop modes and more. The root `README.md` and the READMEs it links to may still describe the older behavior. A reader who follows a stale README hits a command or a claim that no longer holds.

### Purpose
Produce a ranked list of stale, missing or wrong README statements, each with README path:line, the claim, repository evidence and the smallest wording fix, plus what was checked and found accurate.

### Research Questions

1. Which statements in the root `README.md` contradict a change described in the v4.0.0.4 release note?
2. Which v4.0.0.4 user-facing changes does the root README leave out where a reader would need them?
3. Which related READMEs (linked from the root README, or documenting the same setup or features) are stale, missing or wrong, judged against the repository?
4. Which README statements were checked and found accurate?
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The root `README.md`, read against every section of `.skilled/changelog/skilled/v4.0.0.4.md`.
- Related READMEs: those the root README links to and those that document the same setup or features, such as `.skilled/README.md` and the hub READMEs for sk-doc, sk-code, sk-git, system-spec-kit, system-skill-advisor and cli-pi. Iteration 1 builds the inventory from links and grep.
- Repository evidence for each claim: files, scripts, configs and command output.

### Out of Scope
- Editing any README or product file. Fixes are the operator's later decision.
- Restructuring a README. Each proposal is the smallest correct wording fix.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | Loop config, state, iterations and the synthesis |
| `implementation-summary.md`, `goal.md`, `plan.md`, `tasks.md` | Modify | Outcome and log once the run ends |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run all 10 iterations of `/deep:research` on `cli-devin` with `deepseek-v4-1-flash-max`; a convergence stop before 10 does not count | `research/deep-research-state.jsonl` holds 10 iteration records |
| REQ-002 | Write `research/research.md` with a fix list grouped per README, whose rows read `\| F<n> \| <README path:line> \| <claim> \| <evidence path:line or command> \| <STALE, MISSING or WRONG> \| <severity> \| <proposed replacement or addition> \|`, ranked so F1 matters most | At least one F row exists |
| REQ-003 | Cite a README path:line and repository evidence for every fix row | Every F row carries a `path:line` reference |
| REQ-004 | Record what was checked and found accurate (OK-VERIFIED) | `research/research.md` has an OK-VERIFIED section |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Spot-check every cited path:line before it reaches the synthesis | The goal log records the spot-check |
| REQ-006 | Pass every proposed fix through `.skilled/repo-rules/prevent-overengineering.md`: the smallest correct wording change, no restructure | Each proposal edits a sentence, a line or a short addition |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

Done means:

- **SC-001**: Each research question above has an answer backed by path:line evidence, or is marked UNKNOWN with what would settle it.
- **SC-002**: Every criterion in `goal.md` passes, strict validation included.
- **SC-003**: No file outside this folder and the epic's phase rows differs from the base commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `devin` with `deepseek-v4-1-flash-max` | The loop cannot start, or stops on a usage limit | Stop and report; no fallback executor |
| Risk | The model cites a line or a count it did not check | A wrong fix reaches the operator | The orchestrator spot-checks every cited path:line before synthesis |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking the run. The research questions are in section 2.
- Deep-research topic: whether the root README and its related READMEs are still accurate after every change in the v4.0.0.4 release note, with the smallest wording fix for each stale, missing or wrong statement.
- Research Context: deep-research is active for this topic; research/research.md is canonical.
<!-- BEGIN GENERATED: deep-research/spec-findings -->
Abridged from `research/research.md`, which stays canonical:
- The root README install path (Node 24, build steps, `skilled.trustRepoHooks`, seven runtimes) matches v4.0.0.4.
- Stale in the root README: the ClickUp key requirement and MCP capability list, and five counts (agents 12 to 11, commands 39 to 37, rules 42 to 41, warn-only rules two to seven, doctor workflows 19 to 20).
- Related READMEs miss three v4.0.0.4 changes: `surfaceHint`, the skill-authoring pre-commit sub-gate and the mirror checker's new home in `.skilled/bin`.
- Five hub README versions fail or warn on the parent-skill doctor's README check, which contradicts the per-doc version rule; that needs an operator decision.
- Fixes F1 to F28 are in `research/research.md` Section 11.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---


