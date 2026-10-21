---
title: "Feature Specification: Phase 50: sk-doc-ci-outside-failures"
description: "sk-doc Script Tests was red on main, so the session's goal of green CI on the final main commit could not close, and the operator approved fixing it in this phase on 2026-10-21. Two one-line defects from other sessions' commits caused it: a validator imported a module its own folder never put on sys.path, and a feature catalog row named AGENTS.md as plain text where the catalog validator requires a markdown link."
trigger_phrases:
  - "sk doc ci outside failures"
  - "phase 50 sk doc ci outside failures"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 50: sk-doc-ci-outside-failures

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-21 |
| **Branch** | `worktrees/194-sk-doc-ci-outside-failures` |
| **Parent Spec** | ../spec.md |
| **Phase** | 50 of 50 |
| **Predecessor** | 049-review-rows-reconciliation |
| **Successor** | None |
| **Handoff Criteria** | sk-doc Script Tests passes on CI at the pushed commit, and strict validation of this folder passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 50** of the OpenCode v1 and v2 dual compatibility packet. It closes a CI failure that two other sessions introduced, so the packet's final main commit can be green.

**Scope Boundary**: One import line in `validate_skill_package.py`, one cell in the mcp-figma `feature-catalog.md`, this phase's four docs and two rows of `../spec.md`. What both other sessions built is out of bounds: the hub-repository exemption stays, and the vendored-copy fixes stay.

**Dependencies**:
- Commit `31d07499ec`, "feat(sk-doc): let a hub that is also a repository pass the checkers" from spec `sk-doc/068-hub-repo-folder-exemption`, which added the failing import.
- Commit `cd3564317a`, "fix(mcp-tooling): fix the defects a review of Product Owner's vendored copies found", which replaced the catalog link with plain text. Its CI has been red since `1573bb664f`.
- `test_create_skill_contract.py` and `validate_catalog_package.py` as the two checks that replay the failures.

**Deliverables**:
- One `sys.path.insert` line before the `package_skill` import, so the validator runs when importlib loads it.
- A reworded init-agent row that keeps the other session's intent and satisfies the phantom-root-row rule.
- This phase's four docs, the description file and two parent rows.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The session's `/goal` requires green CI on the final main commit, and sk-doc Script Tests was red on main. The operator approved fixing main's red sk-doc Script Tests in this phase on 2026-10-21. Both causes came from other sessions' commits. `validate_skill_package.py` imports `package_skill` by bare module name, and the test loads the validator with importlib, so the script's own folder is not on `sys.path`: `ModuleNotFoundError: No module named 'package_skill'`, 5 failures in `test_create_skill_contract.py`, CI run 39637734898 at `c2550f5451`. The init-agent row of the mcp-figma feature catalog names `AGENTS.md` as plain text, and the catalog validator's `phantom_root_row` rule rejects any `*.md` name in a root-table row that is not a markdown link.

### Purpose
sk-doc Script Tests passes on main, with the other sessions' features intact.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One `sys.path.insert(0, str(Path(__file__).resolve().parent))` line before the import, the pattern the file already uses for the shared scripts folder.
- The init-agent row reworded to "the target repo's agent instructions file (AGENTS)".
- This phase's four docs, `description.json` and two parent rows.

### Out of Scope
- The hub-repository exemption from `31d07499ec` - it is another session's feature, and it is unchanged.
- The vendored-copy fixes from `cd3564317a` - that session's intent stands, and only the catalog cell's wording changes.
- Any other sk-doc or mcp-tooling file - neither check reported a defect there.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py` | Modify | One `sys.path.insert` line before the `package_skill` import, so the validator loads under importlib |
| `.skilled/skills/mcp-tooling/mcp-figma/feature-catalog/feature-catalog.md` | Modify | The init-agent row says "the target repo's agent instructions file (AGENTS)" instead of a bare `AGENTS.md` |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | This phase's packet, filled from the scaffold |
| `description.json` | Modify | The description field carries this phase's scope rather than its folder name |
| `../spec.md` | Modify | The phase map row for 050 and the 049 to 050 handoff row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `test_create_skill_contract.py` passes with the validator loaded through importlib. | 29 passed, and no `ModuleNotFoundError` in the output. |
| REQ-002 | `validate_catalog_package.py` accepts the reworded row. | Exit 0 with 0 FAIL packages, 0 phantom-root-row findings. |
| REQ-003 | Both other sessions' intent survives. | The hub-repository exemption and every vendored-copy fix still read as before; only the catalog cell's wording and the one import line differ. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | sk-doc Script Tests is green on CI at the pushed commit. | The workflow's run for that commit passes. |
| REQ-005 | Strict validation of this folder passes. | `validate.sh 050-sk-doc-ci-outside-failures --strict` prints `RESULT: PASSED`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both local checks pass: 29 tests in `test_create_skill_contract.py`, and exit 0 from `validate_catalog_package.py`.
- **SC-002**: The CI run for the pushed commit has sk-doc Script Tests green, so the session's goal of green CI on the final main commit can close. The operator approved fixing main's red sk-doc Script Tests in this phase on 2026-10-21.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The two other sessions' commits staying as they are | Med | Both fixed here in place, with no revert and no rewrite of either feature |
| Risk | The path line fixes the test but not the CI runner, if the runner loads the validator differently | Med | The test is the same importlib path CI uses, and the file already used the pattern for a sibling folder, so the mechanism is proven in that file |
| Risk | A run of the full sk-doc runner fails elsewhere | Low | The two focused checks cover the two reported causes; the full runner passes locally with CI's skip list and is confirmed on CI |
| Risk | The reworded cell drifts from the other session's intent | Low | The cell still describes what the CLI writes into the target repo, without pointing at this repo's file |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this phase. The full sk-doc runner result and the CI run at the pushed commit are tracked as tasks, not questions.
<!-- /ANCHOR:questions -->

---
