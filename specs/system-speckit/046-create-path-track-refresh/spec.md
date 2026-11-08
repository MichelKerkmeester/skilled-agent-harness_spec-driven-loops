---
title: "Feature Specification: create.sh --path refreshes the track root of the folder it creates"
description: "create.sh --path never refreshed the track root of the folder it created, so the new packet started as drift that the pre-push track gate blocked."
trigger_phrases:
  - "create path track refresh"
  - "create sh path refreshes the track root"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: create.sh --path refreshes the track root of the folder it creates

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-11-08 |
| **Branch** | `scaffold/046-create-path-track-refresh` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
`create.sh --track` adds a new packet to its track root's `children_ids`, but `--path` never did. `TRACK` is set only by `--track`, so `refresh_track_root` returned at once. A packet made with `--path specs/system-skilled-doctor/003-...` was missing from its track root until the pre-push gate blocked the push.

### Purpose
A packet created with `--path` under `specs/<track>/` is declared by its track root, exactly as with `--track`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
Before the fix, in the new test:
create.sh --path specs/tools/007-by-path  ->  children_ids stays [ 'tools/001-first' ]
AssertionError: expected [ 'tools/001-first' ] to deeply equal [ 'tools/001-first', …(1) ]
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Derive the track from a `--path` folder under `specs/` when `--track` is not given.
- Use it at both track-root refresh calls, the flat one and the phase one.
- Add a happy-path test and a nested-folder edge case.

### Out of Scope
- Changing how `--path` numbers or places a folder - the path stays exactly as named.
- The two existing shellcheck warnings in create.sh - they predate this change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | `explicit_path_track` and its two call sites |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts` | Modify | Two `--path` tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `--path specs/<track>/<packet>` declares the packet in the track root | The test `declares a packet created by path in its track root` passes, and failed before the fix |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | A `--path` folder nested inside a packet leaves the track root unchanged | The test `leaves the track root alone for a folder nested inside a packet` passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The four track suites pass 66 of 66, up from 64.
- **SC-002**: `validate.sh --strict` on this folder prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `refresh-track-roots.mjs` | No refresh | create.sh already warns and still scaffolds |
| Risk | A `--path` outside `specs/` or deep inside a packet touches a track root | Low | Outside `specs/` yields no track; a deeper path is judged by the existing sub-track check, and a test covers it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None.
<!-- /ANCHOR:questions -->

---


