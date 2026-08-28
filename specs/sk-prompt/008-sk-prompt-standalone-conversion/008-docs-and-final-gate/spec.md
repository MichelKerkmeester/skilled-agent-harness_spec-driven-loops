---
title: "Feature Specification: Phase 8: docs-and-final-gate"
description: "Refresh the operator-facing documentation that mandated or advertised the retired capability, and re-run every gate from the final state."
trigger_phrases:
  - "008 phase 008"
  - "sk-prompt docs-and-final-gate"
  - "docs-and-final-gate"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: docs-and-final-gate

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-28 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-compiled-routing-withdrawal |
| **Successor** | None |
| **Handoff Criteria** | Every phase-001 gate passes from the final state, and routing accuracy is no worse than baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the sk-prompt standalone conversion.

**Scope Boundary**: Changelog entries and benchmark reports, which record what was true when written

**Dependencies**:
- The generated bridge file has a generator script; it was used rather than hand-editing.
- The runtime framework document is a symlink, so one edit covers both paths.

**Deliverables**:
- Remove the small-model dispatch mandate from the framework document
- Rewrite the skill's entry in the root README, the skills index and the install guide
- Repoint the advisor's owner-mode values and regenerate the derived command bridges

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The framework document carried a hard rule requiring consultation of the deleted packet before any small-model dispatch, and several catalogs still described sk-prompt as a parent hub with two packets. A stated MUST that points at nothing is worse than no rule, and the remaining references spanned advisor runtime data, generated bridge files and test fixtures rather than prose alone.

### Purpose
No operator-facing document mandates or advertises the retired capability, the advisor's own runtime data names the surviving mode, and every gate captured in phase 001 passes from the final state.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove the small-model dispatch mandate from the framework document
- Rewrite the skill's entry in the root README, the skills index and the install guide
- Repoint the advisor's owner-mode values and regenerate the derived command bridges
- Repoint the model-benchmark output path to the lane that produces it
- Re-run every gate from the final state

### Out of Scope
- Changelog entries and benchmark reports, which record what was true when written
- A synthetic parser fixture that names a retired mode as an example but resolves nothing

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AGENTS.md` | Modify | Remove the small-model dispatch mandate; the runtime document is a symlink to it |
| `README.md` | Modify | Rewrite the skill's entry for a standalone identity |
| `.opencode/skills/README.txt`, `install-guides/README.md` | Modify | Refresh the catalog rows |
| advisor `skill_advisor.py`, `allow-list.json`, golden-prompt fixture | Modify | Owner mode and expected mode now name the surviving skill |
| `command-bridges.generated.json` | Modify | Regenerated from its authored inputs |
| `.claude/agents/`, `.opencode/agents/` prompt-improver | Modify | Repoint at the flattened skill |
| deep-improvement and command assets | Modify | Model-benchmark output moves to the lane that owns it |
| sk-doc directory fixtures | Modify | Drop entries for directories this program removed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No operator document mandates the retired capability | The framework document's dispatch rules no longer name it |
| REQ-002 | The advisor's runtime data names the surviving mode | The generated bridge file regenerates with no reference to the retired mode |
| REQ-003 | Every gate captured in phase 001 passes from the final state | All gates exit 0 and the advisor suites pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The model-benchmark lane writes somewhere that exists | Its output path resolves under the lane that produces it |
| REQ-005 | No task-created residue remains | The scoped diff contains no temporary output |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every phase-001 gate passes from the final state, and routing accuracy is no worse than baseline
- **SC-002**: Historical records are preserved rather than rewritten
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing a generated file by hand | It reverts on the next generation | Edited the authored inputs and regenerated, confirming the output came back clean |
| Risk | Rewriting changelogs to remove the retired name | The historical record is falsified | Left every changelog and benchmark report intact and recorded them as deliberate residue |
| Risk | A doc edit inside a hub invalidates its compiled policy | A hub silently drops to legacy routing | One hub went stale from an edit in this phase; caught by the freshness guard and re-minted before closing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None; the phase closed against its recorded acceptance checks.
<!-- /ANCHOR:questions -->
