---
title: "Feature Specification: Phase 1: doc-version-contract"
description: "Deep research into why frontmatter-version.mjs verify fails on every skill it checks, what doc versions should mean for an external author, and whether the per-doc version should exist at all."
trigger_phrases:
  - "doc version contract"
  - "frontmatter version verify failures"
  - "per-doc version contract"
  - "phase 1 doc version contract"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: doc-version-contract

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-11 |
| **Branch** | `worktrees/104-open-ends-scaffold` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-fresh-clone-onboarding |
| **Handoff Criteria** | Every criterion in `goal.md` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the open ends research.

**Scope Boundary**: Read-only research. The run writes only under this folder. No product file changes.

**Dependencies**:
- The `/deep:research` workflow, run for 10 iterations by an executor its orchestrator chooses.
- `node` on the PATH, to rerun the verify command on each skill.

**Deliverables**:
- `research/research.md`, the checked synthesis.
- The loop's state and iterations under `research/`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`node .skilled/skills/sk-doc/scripts/frontmatter-version.mjs verify --skill <name>` exits 1 on every skill checked: 340 files flagged in sk-code, 320 in sk-doc and 115 in system-skill-advisor. Most are mismatches between a doc's stored 4-part version and the derived one. The standard is `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md`. A check that fails everywhere tells an author nothing, and nobody knows whether the rule, the derivation or the missing enforcement is at fault.

### Purpose
Name the cause, define what a doc version should mean for an external author, and recommend the smallest contract that stays green by construction, or recommend removing the per-doc version.

### Research Questions

1. Why does verify fail: the rule, the derivation, or the fact that nothing enforces it?
2. What should doc versions mean for an external author?
3. What is the smallest contract that stays green by construction?
4. Should the per-doc version exist at all?
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.skilled/skills/sk-doc/scripts/frontmatter-version.mjs` and how it derives a version.
- The standard in `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md`.
- The flagged docs in sk-code, sk-doc and system-skill-advisor, sampled by mismatch class.
- Every hook, generator or CI step that writes or checks a doc version, or the evidence that none does.

### Out of Scope
- Changing any version, doc or script. Fixes are a later phase.
- Skill package versions and changelog version minting, unless the per-doc rule depends on them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | Loop config, state, iterations and the synthesis |
| `implementation-summary.md`, `goal.md` | Modify | Outcome and log once the run ends |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run all 10 iterations of `/deep:research`; a convergence stop before 10 does not count | Each `deep-research-state.jsonl` under `research/` holds 10 iteration records |
| REQ-002 | Write `research/research.md` with a Recommendations table whose rows read `\| R<n> \| <recommendation> \| <path:line evidence> \| <move> \| <why the cheaper move fails> \|`, ranked so R1 matters most | At least one R row exists |
| REQ-003 | Cite a path:line for every recommendation | Every R row carries a `path:line` reference |
| REQ-004 | Pass every recommendation through `.skilled/repo-rules/prevent-overengineering.md` | Each row names its move from that file's reversal-cost order (Build nothing, Change a value, Extend in place, Add a function, Add a file, Add an abstraction, Add a dependency) and, above Build nothing, says what fails at the cheaper move |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Spot-check every cited path:line before it reaches the synthesis | The goal log records the spot-check |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

Done means:

- **SC-001**: Each research question above has an answer backed by path:line evidence, or is marked UNKNOWN with what would settle it.
- **SC-002**: Every criterion in `goal.md` passes, strict validation included.
- **SC-003**: No file outside this folder differs from the base commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The executor the run's orchestrator picks | The loop cannot start | Switch executor; the goal does not fix one |
| Risk | The model cites a line or a count it did not check | A wrong recommendation reaches a later fix phase | The orchestrator spot-checks every cited path:line before synthesis |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking the run. The research questions are in section 2.
<!-- /ANCHOR:questions -->

---
