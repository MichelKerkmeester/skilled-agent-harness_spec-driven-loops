---
title: "Feature Specification: Phase 6: one row per file in the ripgrep wrapper"
description: "Shape the ripgrep wrapper's structured results to one best-ranked row per file with a --limit cut, report hidden files and matches, and delete the unused capped recipe."
trigger_phrases:
  - "rg flood control"
  - "ripgrep one row per file"
  - "phase 6 rg flood control"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: one row per file in the ripgrep wrapper

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-09 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | ../005-stale-index-fallback/spec.md |
| **Successor** | None |
| **Handoff Criteria** | Structured recipe returns one row per file with totals; all three build phases validate |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the sweet-search integration packet: a build phase for one retrieval improvement that phase 3 designed in full.

**Scope Boundary**: Only the files listed under Files to Change, all inside `.skilled/skills/system-spec-kit/` (plus the one command asset named there). No embeddings, MCP, daemon or new persistent index.

**Dependencies**:
- Design: `../003-retrieval-feature-design-research/research/research.md` and `../003-retrieval-feature-design-research/research/iterations/iteration-003.md` (lines 38-183). [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research/research/iterations/iteration-003.md:38]
- Predecessor phase complete (see Handoff Criteria in `../spec.md`).

**Deliverables**:
- The code, contract text and tests listed below, with the full retrieval suite passing against its baseline.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The ripgrep wrapper ranks every match and only slices the first 20 for display, so one file with many matches fills the whole view and hides every other file with no sign anything was hidden. JSON output returns every row uncut.

### Purpose
Each matching file appears once at its best-ranked line, the list is cut to `--limit`, and the output says how many more matches and files were hidden.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node rg-wrapper.mjs structured iteration --search-root <002 research folder> --json
rows 382, files 14, top 20 rows from 2 files, 19 of them from one file
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `shapeRankedMatches()` and `DEFAULT_LIMIT = 20` in `lib/rg-lane.mjs`; delete the unused `structuredCappedRecipe`.
- Add `--limit` to the wrapper, the record fields `matchCount`, `fileCount`, `hidden`, `limit`, `truncated`, and `moreInFile` per row; bump `SCHEMA_VERSION` to 2.
- Print `(+N more in this file)` and `+N more files with M matches` in the human summary.
- Update `ops/retrofit-convention.mjs:488`, `search-presentation.txt`, the READMEs and sections 2.1 and 5.

- Ship the feature with its docs: feature-catalog entry, conversational playbook scenario 491, every README that describes the changed tool, and a system-spec-kit changelog entry.
- Run `/local-skilled-alignment` on the phase change and resolve its findings until a recheck shows none open.
- Benchmark before and after on a fixed query set and publish the comparison table.

### Out of Scope
- Body line classes (feature 4) - deferred until a recorded query triggers it.
- A `--scope` flag or out-of-scope hint (feature 5) - deferred until a caller scopes searches.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs` | Modify | `DEFAULT_LIMIT` (after 66), delete `structuredCappedRecipe` (100-112), new `shapeRankedMatches` (after 436) |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs` | Modify | Usage, imports, `SCHEMA_VERSION` 2, `search()` record and structured branch, `parseArgs` `--limit`, `main`, `formatSummary` |
| `.skilled/skills/system-spec-kit/runtime/cli/ops/retrofit-convention.mjs` | Modify | Line 488 reads `record.matchCount` first |
| `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Modify | Section 2.1 shaping paragraph, section 5 fourth item |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/rg-wrapper-recipes.vitest.ts` | Modify | Fix the body-vs-frontmatter fixture and add the shaping cases |
| `.skilled/commands/speckit/assets/search-presentation.txt` and retrieval READMEs | Modify | Hidden-count slot and row suffix |
| `.skilled/skills/system-spec-kit/feature-catalog/retrieval/rg-flood-control.md` | Create | Catalog entry for the feature (sk-doc feature-catalog standard) |
| `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` | Modify | Index row for the new entry |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/rg-flood-control.md` | Create | Scenario 491: conversational prompt, commands, expected signals, pass/fail |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` | Modify | Row 491 in section 7.8 |
| `.skilled/skills/system-spec-kit/README.md` | Modify | Describe the new behavior and output; keep counts and examples true |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` | Modify | Describe the new behavior and output; keep counts and examples true |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/README.md` | Modify | Describe the new behavior and output; keep counts and examples true |
| `.skilled/skills/system-spec-kit/runtime/cli/ops/README.md` | Modify | Describe the new behavior and output; keep counts and examples true |
| `.skilled/commands/speckit/README.txt` | Modify | Describe the new behavior and output; keep counts and examples true |
| `.skilled/skills/system-spec-kit/changelog/v2.12.41.0.md` and `SKILL.md` version | Create / Modify | Changelog entry; use the next free version at build time |
| `.skilled/changelog/skilled/` newest open release notes | Modify | One line for the user-visible change, if the notes are still open |
| `benchmark/` (this phase folder) | Create | `queries.txt`, `before.json`, `after.json`, `results.md` |
| `alignment/` (this phase folder) | Create | Copy of the alignment `report.md` and `recheck.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Structured results hold at most one row per file, cut to `--limit`, with exact totals | Test: one file with 25 matches plus three with 1 at `limit: 20` returns 4 rows, first `moreInFile: 24`, `matchCount: 28` |
| REQ-002 | Hidden counts are reported | Test: 30 files of 3 matches at `limit: 20` returns `hidden: { files: 10, matches: 30 }`, `truncated: true` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The retrofit baseline keeps total-match semantics and the human strings match exactly | Tests 5 and 11 in the phase 3 design pass |
| REQ-004 | Docs ship with the code: catalog entry, scenario 491, READMEs and changelog | The alignment report lists no open S3, S4, S5 or S6 finding for this change |
| REQ-005 | The change aligns with sk-code and sk-doc across every surface it fires | `/local-skilled-alignment` recheck shows 0 open P0 and P1 findings; any P2 left open is listed with a reason in `implementation-summary.md` |
| REQ-006 | Before and after results are measured on the same query set | `benchmark/results.md` holds the comparison table below with real numbers |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npx vitest run rg-wrapper-recipes.vitest.ts retrofit-convention-pipeline.vitest.ts` passes.
- **SC-002**: The measured command above shows 14 files, each once, with `+N more` suffixes.
- **SC-003**: `/local-skilled-alignment` recheck on this change shows 0 open P0 and P1 findings.
- **SC-004**: `benchmark/results.md` shows these rows filled with measured values:

| Metric | Before | After target |
|--------|--------|--------------|
| Distinct files in the shown rows (measured query) | 2 (measured today) | 14 |
| Most rows from one file (measured query) | 19 of 20 | 1 |
| Queries that report hidden files and matches | 0/8 | 8/8 where anything was hidden |
| Median query time, 5 runs per query | record | within 10% of before |
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 3 design line numbers | Line ranges drift before the build | Re-read each cited range before editing |
| Risk | Changing what `results` means breaks a consumer | Low | Only one non-test caller exists (`retrofit-convention.mjs`), updated in the same phase; `SCHEMA_VERSION` 2 signals the change |
| Risk | The benchmark compares runs on different index or worktree states | Med | Record the `trigger-index.json` sha256 and the `git status` line count in both JSON files; do not rebuild the index between runs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The design in phase 3 settles the field names, output strings and test cases.
<!-- /ANCHOR:questions -->

---
