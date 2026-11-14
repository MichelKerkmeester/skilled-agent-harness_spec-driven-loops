---
title: "Feature Specification: Phase 8: restore-and-phase-numbering"
description: "archive.sh reports a failed restore after every step landed, restores a track-level packet into a track that holds sub-tracks, and create.sh reuses the number of an archived phase. This phase fixes the restore verdict, refuses the mixed track and counts archived phases."
trigger_phrases:
  - "restore and phase numbering"
  - "phase 8 restore and phase numbering"
  - "phase numbering counts archived phases"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: restore-and-phase-numbering

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/375-subtrack-review-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 10 |
| **Predecessor** | 007-phase-map-and-prearchive-rewrites |
| **Successor** | 009-proposal-search-and-routing |
| **Handoff Criteria** | With `001-alpha` live and `z_archive/002-gamma` archived in a phase parent, `create.sh --phase --parent` creates `003-*` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Subtrack proposal, deterministic packet relocation, z_archive on every subtrack and opt-in archive search specification.

**Scope Boundary**: The restore path of `archive.sh`, the one exit status of `relocate.mjs` that the restore reads with the README row that states it, and the phase numbering loop of `create.sh`. No rewrite rule and no search change.

**Dependencies**:
- Phase 006, which decides when a rerun runs the close again: only until the sweep has passed once. A run that ends on the status this phase adds has landed in that sense
- Phase 007, committed, because it changes `relocate.mjs` and the shared `archive-track.vitest.ts`, which this phase also edits
- Decisions D2 and D4 of the parent goal: mixed tracks stay forbidden, and numbering counts archived packets

**Deliverables**:
- A renumbering restore that reports success when every step landed and names a validation failure apart from it
- A restore that refuses to put a flat packet beside sub-tracks
- A phase numbering loop that reads the parent's `z_archive/`
- Suite cases for each
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three archive paths end in a state the operator decisions forbid. A restore onto a taken number prints `Restore did not finish` and exits 1 after every relocate step landed, when the restored packet fails strict validation for reasons it had before it was archived. A plain restore puts a track-level packet back into a track that has since been grouped into sub-tracks, and the next sweep fails. The loop below, which numbers a new phase, reads only live folders, so a phase appended after the highest phase was archived takes that phase's number.

### Purpose
A restore tells the operator what happened, never creates a mixed track, and a new phase never takes the number of an archived one.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -n 'for dir in "$FEATURE_DIR"' .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh
1808:        for dir in "$FEATURE_DIR"/[0-9][0-9][0-9]-*/; do
```
The glob names live phase folders only. The run outputs quoted in section 4 are reviewer reports from a `mktemp` copy, not runs made while planning.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

`C` is `.skilled/skills/system-spec-kit/runtime/cli`. Finding ids are those of reviewer A, `../scratch/review-20261114-core-code.md`.

### In Scope
- Report a renumbering restore as done when every relocate step landed, and print the packet's validation failure as a separate warning (A6).
- Refuse a restore that would leave a flat packet beside sub-tracks, on both restore paths (A7).
- Read `z_archive/` in the phase numbering loop of `create.sh` (A9).
- Add one happy-path case and one edge case per changed surface to the suites.

### Out of Scope
- Repairing an archived packet so it passes strict validation - the failure predates the restore and belongs to the packet.
- An option that picks the sub-track for a restore - the refusal names the `relocate.mjs` command that moves the packet into one.
- Another copy of the sub-track predicate in `archive.sh` - the parent spec already lists the seven copies as a separate change, so this phase asks the preflight that holds the rule.
- Track and sub-track numbering - phase 003 covered it, and reviewer A found it sound.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `C/spec/relocate.mjs` | Modify | One added exit status for a run whose steps and sweep all passed and whose only failure is a moved packet's validation, and the header lines that list the statuses |
| `C/spec/README.md` | Modify | The `relocate.mjs` row at line 120 states the exit codes and gains the added status |
| `C/spec/archive.sh` | Modify | `restore_on_next_number` reads that status, and both restore paths ask the relocate preflight before they move anything and refuse only on its mixed-track line |
| `C/spec/create.sh` | Modify | The phase numbering loop at line 1808 also reads `"$FEATURE_DIR"/z_archive/` |
| `C/tests/archive-track.vitest.ts` | Modify | Cases for REQ-002 and REQ-003 |
| `C/tests/archive-numbering.vitest.ts` | Modify | The phase-parent depth cases for REQ-001 |
| `C/tests/relocate.vitest.ts` | Modify | The case for the added exit status |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

Every check runs in `SCRATCH`, a `mktemp -d` copy of the tooling with its own git repository. `AR` is `bash C/spec/archive.sh`.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Closes A9 at `create.sh:1808-1821`. Failing scenario: in a phase parent, archive the highest phase and run `create.sh --phase --parent <parent> --phase-names delta`. It exits 0 and `ls` shows live `002-delta` beside `z_archive/002-gamma`. The new phase must take a number above every live and archived phase | With `001-alpha` live and `z_archive/002-gamma` archived, the same command creates `003-delta`, and the new child's Predecessor row names `001-alpha`, the highest live phase. With `002-beta` live and `z_archive/001-old` archived it creates `003-delta` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Closes A6 at `archive.sh:392-395`. Failing scenario: `AR --restore` onto a taken number, for a packet that fails strict validation for its own reasons. Ten `step ...: ok` lines print, then `close validate specs/zeta/005-old: RESULT: FAILED`, then `ERROR: Restore did not finish`, exit 1, with `005-old` live and listed in the track. A restore whose steps all landed must be reported as done | The same command prints the `Restored:` success line and one warning that names `specs/zeta/005-old` and its failed validation, and exits 0. With `repair-derived.cjs` made to exit 1, it still prints `Restore did not finish` and exits 1. The relocate call behind the first case exits 3, and the same call again prints `relocate: nothing to do` and exits 0 |
| REQ-003 | Closes A7 at `archive.sh:658-716`. Failing scenario: after a whole-track map is applied, `AR --restore` of a packet left in the track's own `z_archive/` prints `SUCCESS: Restored: ... -> .../specs/delta/009-old` and exits 0, and `sweep-track-roots.mjs` then prints `flat packets beside sub-tracks: 009-old` and exits 1. The restore must be refused, and only for that reason: it refuses when the preflight output holds the mixed-track line and leaves every other preflight result as the restore handles it today | The same command exits 1 with an error that names the track and the `relocate.mjs --from ... --to <track>/<sub>/NNN-slug --apply` command, `ls specs/delta/z_archive/009-old` still lists the folder and `node C/spec/sweep-track-roots.mjs` exits 0. In a track with no sub-track the same restore still succeeds. Archive then restore with no commit in between still exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: In `SCRATCH`, the three reproductions of T001 end as REQ-001 to REQ-003 state: a new phase numbered `003`, a restore that exits 0 with a warning, and a restore that is refused with the tree unchanged.
- **SC-002**: From `C`, `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/archive-track.vitest.ts tests/archive-numbering.vitest.ts tests/relocate.vitest.ts` exits 0 with the new cases included, each of which failed before its fix.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 006 decides when a rerun runs the close again | The added exit status would be defined against the old close | Start after the phase 006 and 007 commits |
| Dependency | REQ-001 and REQ-012 of phase 001 say `relocate.mjs` exits 2 on any failure | The added status contradicts the requirement text of a Complete phase | The amendment is recorded in the parent `spec.md` Operator Decisions. Phase 001 is not edited |
| Risk | The restore inherits every relocate refusal | High: after an uncommitted archive the preflight refuses the dirty track root with the same exit status 2 as a mixed track, so archive then restore would start failing | The restore reads the preflight output for the mixed-track line and ignores every other result. REQ-003 tests an archive followed by a restore with no commit in between |
| Risk | A caller treats the added exit status as a failed step | Med: a finished restore is still reported as failed | T002 lists every caller of `relocate.mjs`. On 2026-11-14 they were `archive.sh` and the two suites |
| Risk | The numbering loop takes an archived phase as the predecessor of the new one | Med: the handoff row names a folder that is not live | REQ-001 asserts the Predecessor row names the highest live phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- A6: exit 0 with a warning is the planned default, because a plain restore runs no validation and exits 0. The operator may prefer a distinct non-zero status from `archive.sh`.
- A7: whether `relocate.mjs --from <track>/z_archive/NNN-slug --to <track>/<sub>/NNN-slug --apply` works today is UNKNOWN. T001 runs it before the refusal message names it.
<!-- /ANCHOR:questions -->

---
