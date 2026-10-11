---
title: "Feature Specification: Phase 5: silent-input-sweep"
description: "Deep review of every CLI script under .skilled for options accepted silently, exit 0 on a detected problem, and headers that document options the parser rejects."
trigger_phrases:
  - "silent input sweep"
  - "unknown option accepted silently"
  - "cli exit code review"
  - "phase 5 silent input sweep"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: silent-input-sweep

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
| **Phase** | 5 of 5 |
| **Predecessor** | 004-routing-evaluation |
| **Successor** | None |
| **Handoff Criteria** | Every criterion in `goal.md` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the open ends research.

**Scope Boundary**: Read-only review. The run writes only under this folder. No product file changes.

**Dependencies**:
- The `/deep:review` workflow, run for 10 iterations by an executor its orchestrator chooses.
- The interpreters each script needs (`bash`, `node`, `python3`), to run its reproducing command.

**Deliverables**:
- `review/review-report.md`, the checked synthesis.
- The loop's state and iterations under `review/`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
CLI scripts under `.skilled` can accept bad input without saying so. `create.sh` used to glue unknown options into the title. `regenerate-skill-derived.cjs` documented `--skills-dir`, rejected it and returned 0 on a stale dry run. Each such script lets a caller believe a check passed or an option applied when neither is true.

### Purpose
Find every CLI script under `.skilled` that shows either defect class, rate each finding P0, P1 or P2, and give each a reproducing command.

### Review Questions

1. Which scripts accept unknown or misspelled options silently?
2. Which scripts exit 0 on a detected problem, or carry a header that documents an option the parser rejects?
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every CLI script under `.skilled/bin`, `.skilled/skills/**/scripts` (nested mode packets included), `.skilled/skills/*/runtime/cli` and `.skilled/commands/*/scripts`.
- Defect class 1: unknown or misspelled options accepted silently.
- Defect class 2: exit 0 on a detected problem, or a header documenting an option the parser rejects.

### Out of Scope
- Fixing any script. Fixes are a later phase.
- Other defect classes, such as performance or style, unless they cause one of the two classes.
- Test files and vendored code under `node_modules`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `review/` | Create | Loop config, state, iterations and the synthesis |
| `implementation-summary.md`, `goal.md` | Modify | Outcome and log once the run ends |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run all 10 iterations of `/deep:review`; a convergence stop before 10 does not count | Each `deep-review-state.jsonl` under `review/` holds 10 iteration records |
| REQ-002 | Write `review/review-report.md` with a Findings table whose rows read `\| F<n> \| <P0, P1 or P2> \| <path:line> \| Repro: <command and the exit or output it shows> \| <recommendation> \| <move> \| <why the cheaper move fails> \|`, ordered by severity | The report exists; an empty Findings table means no defect was found |
| REQ-003 | Give every finding a severity, a path:line and a reproducing command | Every F row carries P0, P1 or P2, a `path:line` and a `Repro:` command |
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

- **SC-001**: Every script in scope was reviewed for both defect classes, and each finding reproduces with its command.
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

- None blocking the run. The review questions are in section 2.
<!-- /ANCHOR:questions -->

---
