---
title: "Feature Specification: Phase 48: skilled-loop-shared-nudge-formatter"
description: "The relaunch seed's spec-folder suffix text was written twice: the shared core formatter and a hand-written function in the skilled-loop wrapper. The wrapper now asks the core for the suffix, warns on stderr if that call fails, and an ownership test fails on the old hand-written function."
trigger_phrases:
  - "skilled loop shared nudge formatter"
  - "phase 48 skilled loop shared nudge formatter"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 48: skilled-loop-shared-nudge-formatter

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
| **Branch** | `worktrees/192-skilled-loop-shared-nudge-formatter` |
| **Parent Spec** | ../spec.md |
| **Phase** | 48 of 48 |
| **Predecessor** | 047-diagram-corpus-ci |
| **Successor** | None |
| **Handoff Criteria** | The wrapper builds the seed suffix through the shared core formatter, the suffix compare matches 8 of 8, the wrapper suite passes 111 of 111 and Hook Node passes 872 of 872 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 48** of the OpenCode v1 and v2 dual compatibility packet. It closes the last open P1 from phase 039, `b05-relaunch-lib-006`.

**Scope Boundary**: `.skilled/bin/skilled-loop`'s `spec_folder_suffix()` and the wrapper test that proves which formatter owns the suffix. `relaunch-core.cjs`, `nudge.cjs`, the CLI's prepare and consume checks and the printed suffix text itself are out of bounds.

**Dependencies**:
- Finding `b05-relaunch-lib-006` in `../039-sk-code-opencode-alignment-audit/review.md`, which records the duplicate suffix text.
- `specFolderSuffix` exported by `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`, which `nudge.cjs` already uses.
- The `relaunch_core` path and the node calling style the wrapper already uses for the manual command.

**Deliverables**:
- A `spec_folder_suffix()` that calls node and prints `require(core).specFolderSuffix(folder)`.
- A stderr warning and a bare seed when that call fails, with the relaunch still happening.
- An ownership test that fails on the old hand-written function, a throwing-formatter test, and the before and after compare and suite logs under `scratch/`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` owns the seed's spec-folder suffix in `specFolderSuffix`, and `nudge.cjs` already shares it. `.skilled/bin/skilled-loop` wrote the same two sentences by hand in `spec_folder_suffix()`, so a change to the printed text could miss the wrapper while the parser still expected the core's wording.

### Purpose
One owner for the suffix text, with the wrapper following whatever the core prints.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.skilled/bin/skilled-loop`: `spec_folder_suffix()` delegates to the core formatter, and warns on stderr when the call fails.
- `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`: the ownership test and the throwing-formatter test.
- Evidence in `scratch/`: the before and after suffix compare, the mutation runs and the suite logs.

### Out of Scope
- `relaunch-core.cjs` and `nudge.cjs` - the shared formatter and its other caller already own and use the text.
- The CLI's prepare and consume validation - it already drops an invalid folder before the wrapper runs, so no change is needed there.
- The printed suffix text itself - this phase changes who writes it, not what it says.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/skilled-loop` | Modify | `spec_folder_suffix()` calls node and prints the core's `specFolderSuffix(folder)`, warning on stderr if it fails |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Modify | Ownership test over a copied core with a changed suffix, plus a test for a throwing formatter |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The wrapper gets the seed suffix from the shared core formatter. | `spec_folder_suffix()` prints `require(core).specFolderSuffix(folder)`; the ownership test fails on the old function (`scratch/mutation/old-function.tap`, exit 1) and passes now (`scratch/after/skilled-loop.tap`). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | A failed node call warns on stderr and relaunches with a bare seed. | The throwing-formatter test fails without the warning (`scratch/mutation/no-warning.tap`, exit 1) and passes now (`scratch/after/skilled-loop.tap`); the wrapper does not return non-zero. |
| REQ-003 | The change is behaviour-neutral for every value that reaches the wrapper. | The suffix compare reports 8 same and 0 DIFF (`scratch/after/suffix-compare.txt`), against 4 same and 4 DIFF before for the invalid inputs (`scratch/before/suffix-compare.txt`). |
| REQ-004 | The suites stay at or above their baselines. | The wrapper suite passes 111 of 111 against a 109 baseline (`scratch/after/skilled-loop.tap`); Hook Node passes 872 of 872 over 29 files against 870 of 870 (`scratch/after/hook-node.tap`, `scratch/before/hook-node.tap`). |
| REQ-005 | The live relaunch still works on both OpenCode versions. | On OpenCode 1 and 2 with `llmgateway`, each runner exits 0, the relaunch marker is present and a tool call completes (`scratch/after/live-session-relaunch.txt`). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The suffix text has one owner, and the wrapper test fails if the wrapper stops following the core.
- **SC-002**: The suffix compare is 8 of 8, the wrapper suite passes 111 of 111 and Hook Node passes 872 of 872.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The `specFolderSuffix` export in `relaunch-core.cjs` | High | The ownership test changes the copied core's formatter and requires the wrapper's seed to follow it, so a rename breaks the test rather than the relaunch |
| Risk | Node is missing or the core throws mid-relaunch | Med | The wrapper prints one warning on stderr and appends an empty suffix, so the relaunch still happens; the throwing-formatter test covers it |
| Risk | An invalid folder reaches the wrapper | Low | The CLI drops invalid folders at prepare and consume, and the core returns `''` for one anyway; the compare records both sides as empty |
| Risk | The test edits copied source text with a regex | Low | Replaced in `1159acb5c5` with a shim over the real core that overrides only `specFolderSuffix` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this phase. The review's two P2s, the silent node failure and the brittle regex edit in the test, were both fixed in `1159acb5c5`.
<!-- /ANCHOR:questions -->

---
