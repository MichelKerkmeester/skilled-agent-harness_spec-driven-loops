---
title: "Feature Specification: Phase 29: main-ci-regenerations"
description: "Three checks were red on main because other commits changed sources without regenerating what is derived from them: two Hermes skill copies, the frozen README directory manifest and two compiled deep-loop command contracts."
trigger_phrases:
  - "main ci regenerations"
  - "hermes skill copy drift"
  - "stale compiled command contract"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 29: main-ci-regenerations

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-05 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 29 of 29 |
| **Predecessor** | 028-advisor-stress-fixtures |
| **Successor** | None |
| **Handoff Criteria** | Command Tree Parity, sk-doc Script Tests and Deep-Loop Runtime Tests pass on main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 29** of the doctor audit follow-ups. While pushing phases 027 and 028, three CI checks were found failing on main from other commits. The operator approved regenerating the derived files.

**Scope Boundary**: Generated files only: two `.hermes/skills/*/SKILL.md` copies, `sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` and two `.skilled/commands/deep/assets/compiled/*.contract.md` files. No source changes.

**Dependencies**:
- `sync-skills-hermes.cjs`, which writes the Hermes skill copies
- `test_readme_manifest.py --write`, which freezes the durable directory list
- `compile-command-contracts.cjs`, which records source digests in each compiled contract

**Deliverables**:
- Regenerated Hermes copies of `sk-create-changelog` and `sk-create-repo-rule`
- The manifest with the tracked `rule-experiment-fixture` directory
- Recompiled `deep/review` and `deep/research` contracts

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A changelog formatting commit edited two sk-doc packet SKILL.md files without regenerating their Hermes copies. A repo-rule commit added a tracked fixture directory without refreshing the frozen directory manifest. A deep-loop docs commit edited the review and research SKILL.md files without recompiling the command contracts that record their digests.

### Purpose
A green main, so the next real failure stands out.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run each generator in write mode
- Confirm the new manifest directory is tracked and deliberate before freezing it
- Rerun every affected gate

### Out of Scope
- Editing any source file the generators read
- Changing the generators or the checks

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.hermes/skills/sk-create-changelog/SKILL.md`, `.hermes/skills/sk-create-repo-rule/SKILL.md` | Modify | Regenerated copies |
| `durable-directory-manifest.json` | Modify | One added directory |
| `deep-review.contract.md`, `deep-research.contract.md` | Modify | Source digests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each check passes locally | Hermes skill and prompt checks pass, the sk-doc suite passes, the contract drift check reports OK |
| REQ-002 | Only generated files change | The diff holds the five generated files and nothing else |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | CI is green | The three checks pass on the pushed commit |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The two contract diffs change only a recorded digest each.
- **SC-002**: The manifest diff adds only `rule-experiment-fixture`, which `edba53daeb` added as tracked content.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Regenerating blesses an accidental source edit | Low | Each source edit is a dated, deliberate commit; the generated diffs are reviewed before commit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

