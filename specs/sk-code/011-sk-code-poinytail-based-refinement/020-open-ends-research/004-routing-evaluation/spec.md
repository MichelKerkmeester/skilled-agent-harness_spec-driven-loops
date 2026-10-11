---
title: "Feature Specification: Phase 4: routing-evaluation"
description: "Deep research into a realistic held-out evaluation set and a cross-path parity check for system-skill-advisor, kept cheap and honest."
trigger_phrases:
  - "routing evaluation"
  - "advisor held-out evaluation set"
  - "advisor cross-path parity"
  - "phase 4 routing evaluation"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: routing-evaluation

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
| **Phase** | 4 of 5 |
| **Predecessor** | 003-playbook-catalog-truth |
| **Successor** | 005-silent-input-sweep |
| **Handoff Criteria** | Every criterion in `goal.md` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the open ends research.

**Scope Boundary**: Read-only research. The run writes only under this folder. No product file changes.

**Dependencies**:
- The `/deep:research` workflow, run for 10 iterations by an executor its orchestrator chooses.
- `node` and `python3` on the PATH, to run both advisor paths on the same prompts.

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
The advisor batteries are 17 prompts plus 5 negatives. Ties land at confidence 0.82. The Python (`skill_advisor.py`) and Node (`.skilled/bin/skill-advisor.cjs`) paths can rank the same prompt differently (probe P7). Hub admission runs in CI with `--warn-only`. A small battery tuned against the same prompts it scores says little about prompts it has not seen, and nothing fails when the two paths disagree.

### Purpose
Recommend what a realistic held-out evaluation set and a cross-path parity check should look like for system-skill-advisor, and how to keep both cheap and honest.

### Research Questions

1. What should a realistic held-out evaluation set look like: size, source of prompts, negatives, and how it stays held out?
2. What should a cross-path parity check between `skill_advisor.py` and `.skilled/bin/skill-advisor.cjs` compare, and when should it fail?
3. How do both stay cheap to run and honest, given ties at 0.82 and admission running with `--warn-only`?
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The advisor batteries, the 0.82 tie behavior and hub admission in CI.
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` and `.skilled/bin/skill-advisor.cjs`, as the two paths to compare.

### Out of Scope
- Changing the advisor, its batteries or CI. Fixes are a later phase.
- Probes P4 and P7 and admission scenario DOC-331. A separate fix for those three rows is in flight; their current state is moving.

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
