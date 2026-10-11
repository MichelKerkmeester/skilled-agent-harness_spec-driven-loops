---
title: "Feature Specification: Phase 1: package-strict"
description: "Make all 13 failing skill units pass package_skill.py --check --strict without losing a routing keyword."
trigger_phrases:
  - "package strict"
  - "phase 1 package strict"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: package-strict

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-11 |
| **Branch** | `worktrees/099-residual-closeout` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 7 |
| **Predecessor** | None |
| **Successor** | 002-hooks-readme-voice |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the residual closeout phase parent. It closes item 1 of the residual list: the 13 skill units that fail the strict package check.

**Scope Boundary**: Only the files in the table below change.

**Dependencies**:
- None beyond the files named below.

**Deliverables**:
- Make all 13 failing skill units pass package_skill.py --check --strict without losing a routing keyword.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Thirteen units failed `package_skill.py --check --strict`. The 015 ledger closed them as other tracks' work and named version keys in older changelogs and three SKILL.md word limits. A word-limit error stops the check early, so it also hid three more findings: changelog version keys in cli-devin and cli-opencode, and a long description in sk-design-fundamentals. Two long descriptions, an example asset without frontmatter and a RULES check that read the wrong heading made up the rest.

### Purpose
All 13 units pass the strict check, every SKILL.md keeps its routing keywords, and the advisor batteries and compiled-route canaries read the same before and after.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Version keys in 89 older changelog entries across 10 units
- Word trims in three SKILL.md files, moving probe records to a reference where the text has no other home
- Three descriptions and one asset frontmatter block
- The RULES-section pattern in package_skill.py and its regression test
- A version bump with a changelog entry for each skill whose files changed, plus the derived manifests and Hermes copies

### Out of Scope
- Hub releases for hubs whose own files did not change
- Any routing keyword, router signal or registry alias

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/*/changelog/v*.md` (89 entries) | Modify | Add the `version` key |
| cli-devin `SKILL.md`, `references/agent-delegation.md` | Modify | Move probe records to §10 |
| cli-opencode `SKILL.md` | Modify | Shorten rule 15 and the subagent block |
| sk-design-fundamentals `SKILL.md` | Modify | Shorten Reading Versus Authoring and the description |
| mcp-notion and mcp-obsidian `SKILL.md` | Modify | Shorter descriptions |
| mcp-obsidian `assets/plugins/health-md/health-viz-blocks.example.md` | Modify | Frontmatter |
| sk-create-skill `scripts/package_skill.py`, sk-doc `scripts/tests/test_package_skill_regressions.py` | Modify | Anchored RULES pattern and its test |
| 14 changelog entries, version carriers, three activation manifests and their authored copies, 14 Hermes copies | Create, Modify | Release |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 13 units pass | package_skill --check --strict prints Result: PASS for each |
| REQ-002 | No routing keyword is lost | No keywords line, router signal or registry alias changes, and both batteries and the canaries read the same |
| REQ-003 | The RULES fix is at the checker | The new test fails on the old pattern and passes on the new one, and no other skill's RULES result changes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-090 | Strict validation of this phase passes | validate.sh --strict prints RESULT: PASSED |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every completion criterion in goal.md passes when the orchestrator reruns it.
- **SC-002**: The phase lands as one conventional commit in the worktree.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A change reaches a caller the phase did not name | Med | The gates named in goal.md are rerun from the final state |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
