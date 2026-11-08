---
title: "Feature Specification: Phase 1: spec-kit-core"
description: "Forced-depth deep research over spec-kit-core across the nineteen v4 releases, v4.0.0.0 to v4.0.2.0, for drift, misalignment, bugs, improvements, UX, over-engineering and extension ideas, each backed by file and line evidence."
trigger_phrases:
  - "spec kit core"
  - "phase 1 spec kit core"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: spec-kit-core

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-08 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-authoring-hubs |
| **Handoff Criteria** | `research/research.md` holds ranked findings with `[SOURCE: path:line]` citations, the release that introduced each one and a way to verify it, and the depth checkpoint in `decision-record.md` clears. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Deep research of the Skilled v4 release line v4.0.0.0 to v4.0.2.0: drift, bugs, alignment, over-engineering and extension opportunities specification.

**Scope Boundary**: Research only, over the spec-kit core: `.skilled/skills/system-spec-kit/**` and `.skilled/commands/speckit/**`. Every write stays inside this folder.

**Dependencies**:
- The `/deep:research:auto` workflow and its cli-devin executor running `deepseek-v4-1-flash-max`, with the same-family fallbacks recorded in `decision-record.md`.

**Deliverables**:
- `research/research.md` with ranked, verified findings across the seven finding types.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every v4 release from v4.0.0.0 to v4.0.2.0 changed the spec-kit core: `.skilled/skills/system-spec-kit/**` and `.skilled/commands/speckit/**`, and no pass has read the release notes, the code and the docs against each other. Drift, latent bugs, standard misalignment and over-built surfaces in this cluster are likely and unmeasured.

### Purpose
A ranked list of findings for this cluster, each typed, given a severity, cited to `file:line`, tied to the release that introduced it, and paired with a command that verifies it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git diff --shortstat <prev>..<tag> -- .skilled/skills/system-spec-kit .skilled/commands/speckit
v4.0.0.0-beta.1..v4.0.0.0: 1889 files
v4.0.0.0..v4.0.0.1: 164 files
v4.0.0.1..v4.0.0.2: 210 files
v4.0.0.2..v4.0.0.3: 744 files
v4.0.0.3..v4.0.0.4 (covers .4 to .10): 448 files
v4.0.0.4..v4.0.0.11: 22 files
v4.0.0.11..v4.0.0.12: 4 files
v4.0.0.12..v4.0.0.13: 82 files
v4.0.0.13..v4.0.0.14: 140 files
v4.0.0.14..v4.0.0.15: 224 files
v4.0.0.15..v4.0.0.16: 104 files
v4.0.0.16..v4.0.1.0: 258 files
v4.0.1.0..v4.0.2.0: 183 files
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run one `/deep:research:auto` loop over the Gate 3 classifier, `validate.sh` and its rules, the trigger index and retrieval, continuity save and resume, the goal system, upgrade and `/doctor:update`, the level templates and `create.sh`, ten iterations with no early stop, extended by five while the depth checkpoint fails.
- Steer every iteration toward unread releases, unprobed finding types and unverified claims, and check at least two citations per iteration.
- Close with `research/research.md`, a coverage table of release against finding type, and a strict validation pass on this folder.

### Out of Scope
- Fixing any finding - this phase researches only, and remediation belongs to packets the parent synthesis proposes.
- Surfaces owned by the sibling phases - each cluster has its own child, so overlap is cited and handed over, not researched twice.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` (this folder only) | Create | Run state, iteration files, deltas and `research.md` |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `decision-record.md` | Modify | Research charter, plan, task state, coverage table and run decisions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The research loop records at least ten iterations of type `iteration` in its state log. | Counting `"type":"iteration"` rows in `research/deep-research-state.jsonl` gives 10 or more. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Every finding in `research/research.md` carries a type, a severity, a `[SOURCE: path:line]` tag, an introducing release and a verify step. | Reading the findings tables in `research/research.md` shows all five fields on every row. |
| REQ-003 | The coverage table in `implementation-summary.md` shows every release that touched this cluster and every finding type. | The table has one row per release range and one column per finding type. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
- **SC-002**: The two strongest citations of every iteration were opened by the orchestrator and their verdict is logged in `decision-record.md`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-devin with `deepseek-v4-1-flash-max` | No iterations run | Switch to cli-deepseek-harness, then cli-pi, then cli-opencode, all DeepSeek V4.1 Flash, and log each switch with its error. |
| Risk | An iteration restates the release notes or cites a line that does not say what it claims | Med | The orchestrator opens two citations per iteration and redirects the next focus to redo shallow ground. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Audit the Skilled v4 spec-kit core, .skilled/skills/system-spec-kit/** and .skilled/commands/speckit/**, across releases v4.0.0.0 to v4.0.2.0: what drift, misalignment, bugs, UX friction, over-engineering and extension room does each release leave? The twelve key questions in `research/deep-research-strategy.md` break this down.

### Research Context

A deep-research run is active for this topic, and `research/research.md` stays the canonical synthesis.
<!-- BEGIN GENERATED: deep-research/spec-findings -->
### Research Findings

Spec-kit core mostly enforces what its notes promise, but several gates fail open or give a different answer depending on how they are called. Gate 3 depends on word order, the resume branch can skip it despite its own always-required comment, and a phase parent passes ANCHORS_VALID without any anchor being read. Root resolution is the widest risk: four resolvers disagree, and the continuity writer falls back to the shared runtime checkout when a project is not recognised, writing there after one stderr line. The save writer itself is an untracked build output that the install probe does not check and the printed repair does not build. Exit codes are the most common UX defect: check-goal --all, the trigger lookup and the post-edit placeholder check each return a status that disagrees with the result they print.

120 findings after removing 1 withdrawn or rejected ones: 0 P0, 35 P1, 85 P2. By type: 31 bug, 30 drift, 9 misalignment, 20 ux, 10 over-engineering, 13 improvement, 7 extension.

The ranked findings live in `research/research.md`, which stays canonical.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
