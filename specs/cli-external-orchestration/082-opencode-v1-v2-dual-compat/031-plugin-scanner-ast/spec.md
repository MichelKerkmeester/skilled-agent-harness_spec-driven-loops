---
title: "Feature Specification: Phase 31: plugin-scanner-ast"
description: "The plugin inventory guard matched event checks with regular expressions, so eight review rounds kept finding spellings it misread: escaped names, case text inside strings, case labels under unrelated switches and literal lists changed after they were built. This phase replaces the text scan with a real JavaScript parser already installed in the repository, brings the sk-vision symlink under the plugins purity test, and lists every suite in the plugin tests README."
trigger_phrases:
  - "plugin scanner ast"
  - "phase 31 plugin scanner ast"
  - "plugin inventory parser"
  - "sk-vision symlink purity"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 31: plugin-scanner-ast

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-10-20 |
| **Branch** | `worktrees/170-plugin-scanner-ast` |
| **Parent Spec** | ../spec.md |
| **Phase** | 31 of 31 |
| **Predecessor** | 029-unrun-tests-ci-coverage |
| **Successor** | None |
| **Handoff Criteria** | The four recorded scanner limits each have a fixture that fails on the old scanner, the sk-vision link fails the purity test when broken, and Spec-Kit Check passes on CI at the pushed main commit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 31** of the OpenCode v1 and v2 dual-compatibility specification. It closes items 8 and the last two small fixes of item 9 on the open-work list the operator approved on 2026-10-20.

**Scope Boundary**: The inventory scanner and its test, the plugins purity test and the build step it needs, the plugin tests README, and the lines of `ARCHITECTURE.md` and the plugins README that describe them. Phases 027, 028 and 030 own the other open-work items; the two kill-switch limits in `ARCHITECTURE.md` belong to 028.

**Dependencies**:
- `../024-plugin-inventory-guards/`, which added the scanner and recorded its limits as follow-ups.
- `../020-plugins-purity-dual-export/`, which taught the purity test the dual export.

**Deliverables**:
- The parser-based scanner, its fixtures, the purity test change, the Spec-Kit Check build step, the README rows, and the mutation evidence under `scratch/mutation/`.
- This folder's spec, plan, tasks and implementation summary, and the parent phase map row.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.opencode/plugins/tests/helpers/plugin-inventory.cjs` found event checks with regular expressions over comment-stripped text. Review of phase 024 patched one spelling per round for eight rounds and left four recorded as known limits: an escaped name such as `"session.bogus"` was not read, `case` text inside a string counted as handled, `case` labels under a `switch` that is not on the event type counted as handled, and a literal list changed later by `push` or `add` was trusted. Separately, the plugins purity test lists entries with `isFile()`, which is false for a symlink, so `.opencode/plugins/sk-vision.js` was never imported or checked. The plugin tests README also omitted five suites, `session-relaunch.test.cjs` among them.

### Purpose
The scanner reads plugin source as a syntax tree, the sk-vision link meets the purity rules, and the README lists every suite on disk.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Item 8: section 4 of the inventory helper parses each plugin with `rolldown/parseAst`, which `.skilled/node_modules` already holds at 1.2.12 through vite; no dependency is added.
- Item 8: a fixture in `plugin-inventory.test.cjs` per recorded limit and per review finding, plus aliases of the event type and a parse failure.
- Item 9: the purity test checks a symlinked entry (relative link, inside the repository, resolves to a built file with a plugin extension) and then applies the same export contract.
- Item 9: Spec-Kit Check builds the sk-vision bundle with bun before the runtime vitest project, because the link's target is a gitignored build output.
- Item 9: `.opencode/plugins/tests/README.md` lists every suite and the full tree.
- `ARCHITECTURE.md` and the plugins README describe the guard and the purity test as they now work.

### Out of Scope
- The two kill-switch bullets in `ARCHITECTURE.md` - phase 028 fixes those plugins.
- Running `.opencode/plugins/tests` in CI - no workflow runs that directory today; recorded as a finding.
- Adding `.opencode/plugins/**` to Spec-Kit Check's path filter - recorded as a finding.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/tests/helpers/plugin-inventory.cjs` | Modify | Section 4 reads a syntax tree instead of matching text; `stripComments` is no longer exported |
| `.opencode/plugins/tests/plugin-inventory.test.cjs` | Modify | Drops the `stripComments` test, puts the case-label fixture under a switch on the event type, adds fifteen fixtures, one per closed gap or review finding |
| `.skilled/skills/system-spec-kit/runtime/tests/opencode-plugins-folder-purity.vitest.ts` | Modify | Lists and checks symlinked entries; keeps sk-vision's GPU flag off while it runs |
| `.github/workflows/spec-kit-check.yml` | Modify | Builds the sk-vision bundle before the vitest projects |
| `.opencode/plugins/tests/README.md` | Modify | Five missing rows and the full directory tree |
| `.opencode/plugins/ARCHITECTURE.md` | Modify | The guard's known-limit bullet and a purity-test paragraph |
| `.opencode/plugins/README.md` | Modify | The inventory-test row and the tests README sentence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Item 8: each recorded limit is closed by the parser, not by another pattern. | The escaped-name, string-text, unrelated-switch and mutated-collection fixtures pass on the new helper and fail on the old one (`scratch/mutation/scanner-old-helper.txt`). |
| REQ-002 | Item 8: the real plugins read the same as before. | The old and new helpers return identical handled and unscanned lists for all 16 bridged plugins (`scratch/mutation/scan-parity.txt`), and the full plugin suite passes. |
| REQ-003 | Item 9: the sk-vision link is checked. | With the link made absolute, pointed at a missing file and pointed at a non-plugin module, the old purity test exits 0 and the new one exits 1 (`scratch/mutation/purity-symlink.txt`); the real link passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Item 9: the purity test can run on CI. | Spec-Kit Check builds the bundle and passes on CI at the pushed main commit; `actionlint` and `check-gate-inputs.sh` pass. |
| REQ-005 | Item 9: the tests README matches the files. | Every `*.test.cjs` in the folder is named in the README. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No fixture for a recorded limit passes on the old scanner, and every one passes on the new scanner.
- **SC-002**: Every CI run on the pushed main commit is read, and Spec-Kit Check and the dual-version battery are green there.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `rolldown` reaches `.skilled/node_modules` only through vitest's vite | Med | The helper loads it once with a clear module-not-found error; a vitest bump that drops rolldown fails the suite loudly rather than passing |
| Risk | The event type is still recognized by name | Low | Stated in `ARCHITECTURE.md` as the remaining limit; aliases declared from an event-type field are now followed |
| Risk | The bun build adds time to Spec-Kit Check | Low | One bundle build; the battery workflow already runs the same build |
| Dependency | Phases 027, 028 and 030 edit the same parent phase map and, for 028, `ARCHITECTURE.md` | Low | The merge keeps every row and line from both sides |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
