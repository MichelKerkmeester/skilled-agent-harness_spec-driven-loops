---
title: "Feature Specification: Phase 12: authoring-speed-fixes-and-alignment"
description: "Build the three speed changes phase 011 ranks as safe tonight, then make the skill, README, catalog and playbook docs match what phases 010 and 012 changed."
trigger_phrases:
  - "authoring speed fixes and alignment"
  - "phase 12 authoring speed fixes and alignment"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->
# Feature Specification: Phase 12: authoring-speed-fixes-and-alignment

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-25 |
| **Branch** | `worktrees/217-weak-model-spec-authoring` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 011-authoring-speed-research |
| **Successor** | None |
| **Handoff Criteria** | The goal's four criteria hold and strict validation of this folder passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of packet 054. It builds what phase 011's research ranked as safe tonight and closes the doc drift phases 010 and 012 leave behind.

**Scope Boundary**: Lanes 1 to 3 of `../011-authoring-speed-research/research/phase-012-proposal.md`, plus the doc surfaces its section 6 lists and the open items phase 010's lanes reported.

**Dependencies**:
- Lane 2 waits until phase 010 lane A finishes, because both touch the scaffold snapshot.

**Deliverables**:
- The scanner git calls skip the file-system monitor.
- One answer in the card for a plan longer than four steps, and a tasks template description that matches its task format.
- No stale size labels in `level-specifications.md`.
- Docs that match the shipped behavior.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The citation scanner behind `SOURCE_TAGS` spends 6.9 to 9.9 seconds on a git listing that takes 0.9 seconds without the file-system monitor, and once hung for 28 minutes. The card gives three answers for a plan longer than four steps, and several docs still describe behavior that phases 010 and 012 changed.

### Purpose
Validation upkeep gets faster with the same verdicts, and every doc a model reads tells it one thing that matches the code.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `-c core.fsmonitor=false` to the scanner's git calls in two scripts.
- Replace the card's "Split it or raise the level." with a pointer to section 11, and add `Verify:` to the tasks template description.
- Remove the stale size labels and checklist wording from `level-specifications.md`.
- Update the catalog, playbook, README and reference docs that describe what changed.

### Out of Scope
- Ranks 4 to 8 and 10 to 12 - each needs the 2026-10-26 timing run or would change an existing verdict.
- Any benchmark - the operator moved timing to 2026-10-26.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs` | Modify | Skip fsmonitor in git calls |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | Modify | Skip fsmonitor in git calls |
| `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` | Modify | One answer for long plans |
| `.skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl` | Modify | Description names `Verify:` |
| `.skilled/skills/system-spec-kit/references/templates/level-specifications.md` | Modify | Drop stale labels |
| Catalog, playbook, README and reference docs | Modify | Match the shipped behavior |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The scanner keeps its output and gets faster | Before and after output is identical, and `check-source-tags.vitest.ts` passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The card and template changes keep the guards green | `check-card-sync.sh` and `check-example-drift.sh` exit 0 and the scaffold snapshot test passes |
| REQ-003 | Each stale doc surface is updated or recorded | The proposal's section 6 list has an outcome per line in `tasks.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The `SOURCE_TAGS` rule on the 054 parent finishes in under 3 seconds with the same verdict.
- **SC-002**: `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 010 lane A owns the scaffold snapshot until it finishes | Lane 2 cannot start early | Run lane 2 after lane A and record the order |
| Risk | Doc edits drift from the code again | Low | Each doc edit cites the file and line it describes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator moved timing to 2026-10-26.
<!-- /ANCHOR:questions -->

---
