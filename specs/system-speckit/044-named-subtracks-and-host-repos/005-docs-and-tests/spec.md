---
title: "Feature Specification: Phase 5: docs-and-tests"
description: "Several 044 docs state things the code does not do, two reader docs never mention sub-tracks, and two tests cannot fail for the reason they name or leave a create.sh case unchecked. This phase plans the doc corrections and the test repairs, with a negative control for each test."
trigger_phrases:
  - "docs and tests"
  - "phase 5 docs and tests"
  - "044 doc drift remediation"
  - "archive parent derivation test cannot fail"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: docs-and-tests

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-07 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-doctor-symlink-gaps |
| **Successor** | None |
| **Handoff Criteria** | Every doc correction in `tasks.md` is made and its before-and-after `rg` check printed, both repaired tests pass and fail under their negative control, and `validate.sh` on the 044 packet with `--strict --recursive` prints `RESULT: PASSED` for every folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the 044 remediation, and the last. The parent, `specs/system-speckit/044-named-subtracks-and-host-repos`, shipped docs and tests that the deep review found drifting from the code (P2-11 to P2-14 in `../review/review-report.md` and `../review/p2-verification.md`).

**Scope Boundary**: Documentation text and test files. The one optional code change is the reader's return shape (P2-9, P3).

**Dependencies**:
- Phases 001 to 003, because the reader docs and one test describe their final behavior: whether `create.sh` refuses an undeclared sub-track (D-001), the agreed predicate (phase 002) and the refresh guard and seed (phase 003).
- The sub-track fixture builder `runtime/cli/tests/fixtures/subtrack-tree.mjs`.

**Deliverables**:
- Corrected `folder-structure.md`, `runtime/cli/lib/README.md`, the feature-catalog track-root page and three 044 packet docs.
- Two new `create-track-refresh.vitest.ts` cases and a rewritten archive parent-derivation case.
- Optional, P3: one agreed shape for the two reader views (P2-9).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`folder-structure.md:115` requires a sub-track `description.json` to carry `specId` set to `<track>/<sub-track>`, but nothing produces or checks it and existing tracks carry only `specFolder` (P2-11). `runtime/cli/lib/README.md:121` and `feature-catalog/tooling-and-scripts/track-root-children-lists.md` describe the reader without sub-tracks (P2-12). Three 044 docs are wrong: `tasks.md:38` cites `red-E.log`, which `scratch/` does not hold (P2-13a); `plan.md:84` omits `validate-subtrack.vitest.ts` from its test command, and the review cites it as line 85 (P2-13b); `implementation-summary.md:129` says a deeper layout is reported as an undeclared folder, and the sweep prints nothing for it (P2-13c). Two test gaps remain: no case covers a declared sub-track with no `graph-metadata.json`, or a refresh failure on the sub-track path (P2-14a), and the archive parent-derivation case at `graph-metadata-refresh.vitest.ts:120-135` uses a four-segment identity, so the `segments.length` check returns before the `z_` check it is named for (P2-14b).

### Purpose
Each doc says what the code does, and each repaired test fails when the behavior it names breaks.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
# Observed 2026-11-07 in a scratch workspace: the 044 fixture tree plus demo/sub/deeper/001-deep-probe/ with a description.json of {"level":"sub-track"}.
$ node .skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs --specs specs      # exit=0
demo/linked: symlinked folder skipped, not followed
demo/loose: undeclared folder ignored
demo: declared=2 actual=2
demo/sub: declared=1 actual=1
$ <the same output> | grep -c deeper
0
# Observed at the checkout root:
$ grep -c "sub-track" .skilled/skills/system-spec-kit/runtime/cli/lib/README.md .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/track-root-children-lists.md
...lib/README.md:0
...track-root-children-lists.md:0
$ ls specs/system-speckit/044-named-subtracks-and-host-repos/scratch | grep red
red-A.log red-B.log red-C.log red-D.log red-F.log red-G.log
```
The `specId` line is `folder-structure.md:115`, and no producer sets that field for a sub-track (`p2-verification.md` row P2-11).
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Correct the `specId` requirement in `folder-structure.md` to match what the producers and the fixture write (P2-11).
- Add sub-tracks to `runtime/cli/lib/README.md` and the feature-catalog track-root page (P2-12).
- Correct `tasks.md:38`, `plan.md:84` and `implementation-summary.md:129` (P2-13a, b, c).
- Add the two uncovered `create.sh` cases and repair the archive parent-derivation case, each with a negative control (P2-14a, P2-14b).
- Optional, P3: give the two reader views one return shape, or document both (P2-9).

### Out of Scope
- A test for the new `create.sh` write path - verified already covered at `create-track-refresh.vitest.ts:146-170` in `p2-verification.md` row P2-14c, so no work.
- Regenerating `red-E.log` - a log written now would not be the red run that existed then.
- Generating `specId` for sub-tracks - D-005b recommends correcting the doc, not the generator.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/references/structure/folder-structure.md` | Modify | The `description.json` row at `:115` |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/README.md` | Modify | The `track-roots.mjs` row at `:121` |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/track-root-children-lists.md` | Modify | Sections 2 and 3, and the page `version` |
| `specs/system-speckit/044-named-subtracks-and-host-repos/tasks.md`, `plan.md`, `implementation-summary.md` | Modify | Line 38, line 84 and line 129 only |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts` | Modify | Two new cases (P2-14a) |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/graph-metadata-refresh.vitest.ts` | Modify | The case at `:120-135` (P2-14b) |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs` | Modify, optional | The two return shapes at `:162-164` and `:266-268` (P2-9) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | P2-14b: the archive parent-derivation case fails when the `z_` check breaks (`graph-metadata-refresh.vitest.ts:120-135`) | With `name.startsWith('z_')` removed from `isDeclaredSubtrackFolder` locally, the repaired case fails; with the line restored it passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | P2-14a: a case pins `create.sh --track` into a declared sub-track with no `graph-metadata.json` | The case asserts exit 0, the packet written, no `was not refreshed` warning and the sub-track metadata still absent; with `create.sh`'s `[[ -f ... graph-metadata.json ]] \|\| return 0` guard removed locally it fails |
| REQ-003 | P2-14a: a case pins a refresh failure on the sub-track path | The case makes the sub-track's metadata invalid JSON and asserts exit 0 with stderr containing `demo/sub/graph-metadata.json was not refreshed` |
| REQ-004 | P2-11: `folder-structure.md:115` states what producers write | `rg -n 'specId' folder-structure.md` no longer prints a requirement that `specId` is `<track>/<sub-track>` (D-005b) |
| REQ-005 | P2-12: the reader README row and the feature-catalog page describe sub-tracks | `grep -c 'sub-track'` on each prints at least 1, where it printed 0 |
| REQ-006 | P2-13a, b, c: the three 044 doc lines say what is true | `tasks.md:38` names the six logs that exist and says E was not kept; the `plan.md` command lists `tests/validate-subtrack.vitest.ts` and passes; `implementation-summary.md:129` says a deeper layout is not reported (D-005a) |
| REQ-007 | Optional, P3, P2-9: the two reader views have one documented return shape | The README row names both shapes, or a case asserts one shape (D-005c) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each doc correction has a before-and-after `rg` or `grep` check, and the after output shows the corrected text.
- **SC-002**: `validate.sh specs/system-speckit/044-named-subtracks-and-host-repos --strict --recursive` prints `RESULT: PASSED` for every folder after the doc edits.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 001 to 003 and their open decisions | Med: a doc written before them describes behavior that then changes | T003 blocks the doc tasks until those phases are Complete |
| Risk | A negative control edits `create.sh` or the parser temporarily | Med: a left-behind edit ships | Each control names its restore step, and T014 checks `git diff --stat` shows only the files in scope |
| Risk | Editing 044's packet docs after its closure | Low: the packet states a different truth than its sealed summary | Each edit is one line, and the validator reruns on the whole packet at T015 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **D-005a (operator decision): P2-13c.** A declared `demo/sub/deeper` produces no diagnostic, because discovery never looks inside a sub-track. Recommended: correct `implementation-summary.md:129` to say deeper layouts are not reported, since REQ-008 never asked for it. Option B adds a diagnostic to the reader and both sweep views, which is new behavior for a layout the parent put out of scope. Decided 2026-11-07 by operator: Recommended — correct `implementation-summary.md:129` to say deeper layouts are not reported. Status: answered.
- **D-005b (operator decision): P2-11.** Recommended: correct the doc so `specFolder` is the required path and `specId` is not required, because every existing track carries only `specFolder` and the fixture does the same. Option B has the description generator write `specId` for a sub-track and adds a check, which is new code for a field nothing reads. Decided 2026-11-07 by operator: Recommended — correct the doc so `specFolder` is the required path and `specId` is not required. Status: answered.
- **D-005c (operator decision, optional): P2-9.** Recommended: document both reader shapes in the README row and leave the code, since only `sweep-track-roots.mjs:72-82` consumes both and the split predates the range. Option B returns one shape from both views and edits that consumer. Decided 2026-11-07 by operator: Recommended — document both reader shapes in the README row and leave the code. Status: answered.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Evidence**: `../review/review-report.md`, `../review/p2-verification.md`
