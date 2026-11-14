---
title: "Feature Specification: Phase 7: phase-map-and-prearchive-rewrites"
description: "relocate.mjs rewrites a packet id only where it is written in full, so a renumbered phase leaves its parent's phase map naming a folder that is gone, and a restore onto a new number leaves references to the id the packet had before it was archived. This phase adds both rewrites."
trigger_phrases:
  - "phase map and prearchive rewrites"
  - "phase 7 phase map and prearchive rewrites"
  - "bare sibling folder name in a phase map"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: phase-map-and-prearchive-rewrites

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/375-subtrack-review-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 10 |
| **Predecessor** | 006-relocate-resume-and-preflight |
| **Successor** | 008-restore-and-phase-numbering |
| **Handoff Criteria** | After `relocate.mjs --renumber <phase parent> --apply`, `rg` for the old folder name in the parent's `spec.md` prints nothing |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Subtrack proposal, deterministic packet relocation, z_archive on every subtrack and opt-in archive search specification.

**Scope Boundary**: The reference rewrites of `relocate.mjs`, section 6 of the script. No resume logic, no `archive.sh` exit handling and no `create.sh` change.

**Dependencies**:
- Phase 006, committed, because it edits the same script
- Decision D3 of the parent goal: moving or renumbering a packet needs no hand edits

**Deliverables**:
- A rewrite of bare sibling folder names inside a phase parent's own documents
- A rewrite of the id a packet had before it was archived, when it leaves `z_archive/` under a new number
- Suite cases for both
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`relocate.mjs` finds an old id with the pattern below, which matches a multi-segment id or a root packet after `specs/`. A phase parent names its children by bare folder name, in the Phase Documentation Map, the handoff table and each child's Predecessor and Successor rows, so a renumbered phase leaves those rows naming a folder that is gone while the run exits 0 and strict validation passes. A packet restored from `z_archive/` onto a new number has the same gap: only the `z_archive` spelling of its id is rewritten, and references written before it was archived still name the old id.

### Purpose
After a renumber, a re-parent or a renumbering restore, no document names the moved folder by a name it no longer has, with no hand edit.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ sed -n '571,575p' .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs
  // A multi-segment id stands alone or follows specs/. A single segment is only
  // ever a root packet, and three digits plus a slug are too common to match bare.
  if (multi.length) parts.push(`(?:(?<![${SEGMENT_CHAR}./])|(?<=specs/))(${multi.join('|')})`);
  if (single.length) parts.push(`(?<=specs/)(${single.join('|')})`);
  if (!parts.length) return null;
```
Neither branch matches `003-gamma` standing alone in a table cell. The run outputs quoted in section 4 are reviewer reports from a `mktemp` copy, not runs made while planning.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

`C` is `.skilled/skills/system-spec-kit/runtime/cli`. Finding ids are those of reviewer A, `../scratch/review-20261114-core-code.md`.

### In Scope
- Rewrite a moved phase child's bare folder name in its parent's Phase Documentation Map and handoff table (A2).
- Rewrite the same bare name in the sibling children's Predecessor and Successor rows and in the parent `goal.md` binding table, the other places a `create.sh --phase` scaffold writes it (A2).
- Leave the moved child's own Spec Folder row in `implementation-summary.md` naming the new folder. `repair-derived.cjs:103` already holds a rule for that row, so T001 records whether it is stale after a renumber today, and the bare-name pass covers it only if it is (A2).
- Limit the bare-name pass to an entry whose parent is unchanged, and to a name with no letter, digit, underscore or hyphen before it. `session_id` values such as `scaffold-003-gamma` stay as written.
- For a re-parented phase, remove these rows from the old parent: its Phase Documentation Map row, each handoff row that names it and its `goal.md` binding row. A remaining sibling's Predecessor or Successor row that names it is set to the nearest remaining phase on that side, or `None` (A2).
- For a re-parented phase, add these rows to the new parent: one Phase Documentation Map row that carries the number of the new folder name and the Focus and Status cells of the old row, and one `goal.md` binding row where that file holds a binding table. The moved child's own Predecessor and Successor rows are set to its neighbours in the new parent, or `None`. No handoff row is added, because its criteria cannot be derived, and a new parent with no Phase Documentation Map gets no map row. The run report names both cases (A2).
- Rewrite the id a packet had before it was archived when it leaves `z_archive/` under a new number (A8).
- Add one happy-path case and one edge case per rewrite to the suites.

### Out of Scope
- Bare names in prose or in any document outside the phase parent's folder - three digits plus a slug are too common to match bare, as `relocate.mjs:572` says.
- The Phase column number of a map row, a `Phase N` title and a `Phase N of M` row - the finding names the folder, so these keep the old number after a renumber or a re-parent. That is a residual against decision D3 of the parent goal, which its log names. T001 records whether any validation rule reads the number.
- The restore exit status and the mixed-track refusal - phase 008 owns them (A6, A7).
- Hard-coded packet paths in code and CI - the parent spec leaves them to the run report.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `C/spec/relocate.mjs` | Modify | Bare-name rewrite scoped to a phase parent's own documents, row removal and addition on re-parent and the pre-archive id as a second spelling of a source under `z_archive/` |
| `C/tests/relocate.vitest.ts` | Modify | Cases for REQ-001 to REQ-003 |
| `C/tests/archive-track.vitest.ts` | Modify | The renumbering restore case asserts REQ-004 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

Every check runs in `SCRATCH`, a `mktemp -d` copy of the tooling with its own git repository. `R` is `node C/spec/relocate.mjs`. `PP` is `specs/omega/core/003-phased-thing`, a `create.sh --phase` scaffold, and `specs/omega/core/004-other` is a second one. Each holds a parent `goal.md` with a binding row per child. T002 records whether the scaffold writes those rows, and the fixture adds them where it does not. `BARE` is the command below. It matches the old name only at the start of a line or after a character that cannot be part of a longer name.

```text
rg -n -e '^003-gamma' -e '[^A-Za-z0-9_-]003-gamma' PP/spec.md PP/goal.md PP/[0-9]*/spec.md PP/[0-9]*/implementation-summary.md
```

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Closes A2 at `relocate.mjs:566-577`. Failing scenario: `R --renumber PP --apply` after one phase was removed prints `move specs/omega/core/003-phased-thing/003-gamma -> .../002-gamma`, ends on `RESULT: PASSED` and exits 0, and `PP/spec.md` still reads `003-gamma/` in the map row at line 102 and `003-gamma` in the handoff row at line 116. The map and the handoff table must name the folder by its new name | After the same run, `rg -n '003-gamma' PP/spec.md` prints nothing and `rg -c '002-gamma' PP/spec.md` prints 2 or more. A second phase parent that holds its own `003-gamma` and is not in the run keeps its rows byte for byte |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Closes A2 for the other bare names a phase scaffold writes: the Predecessor and Successor rows in each sibling's `spec.md` and the binding rows in the parent `goal.md`. Failing scenario: the same run as REQ-001 leaves them naming `003-gamma` | After the same run, `BARE` prints nothing, and `rg -c 'scaffold-003-gamma' PP/002-gamma/implementation-summary.md` prints 1, the `session_id` the run leaves alone. A name the run did not move, such as a phase removed by hand, stays as written |
| REQ-003 | Closes A2 for a re-parent. Failing scenario: `R --from omega/core/003-phased-thing/003-gamma --to omega/core/004-other/002-gamma --apply` leaves the old parent's map naming a folder that is gone. The bare-name pass does not run for this entry, because it would write `002-gamma` into the old parent, a folder that parent does not hold. The rows listed under In Scope are removed from the old parent and added to the new one | After the run, `rg -n 'gamma' PP/spec.md` prints nothing, `rg -n 'gamma' PP/goal.md PP/[0-9]*/spec.md` prints nothing, `rg -c '002-gamma/' specs/omega/core/004-other/spec.md` prints 1, `rg -c '002-gamma' specs/omega/core/004-other/goal.md` prints 1, and the run report prints one line for each row it removed, added or set |
| REQ-004 | Closes A8 at `archive.sh:361-397`. Failing scenario: another packet names `zeta/001-old`, the id the packet had before it was archived. After `archive.sh --restore` onto a taken number the file reads ``See `specs/zeta/005-old/spec.md` and the earlier id zeta/001-old.`` Both spellings must be rewritten | After the same restore, `rg -n 'zeta/001-old' <the referring file>` prints nothing and the line ends `the earlier id zeta/005-old.` With a live `specs/zeta/001-old` present, `R --from zeta/z_archive/001-old --to zeta/005-old --apply` leaves every `zeta/001-old` reference unchanged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: In `SCRATCH`, after `R --renumber PP --apply`, `BARE` prints nothing and `validate.sh PP --strict --recursive` prints `RESULT: PASSED` for each folder.
- **SC-002**: From `C`, `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/relocate.vitest.ts tests/archive-track.vitest.ts` exits 0 with the new cases included, each of which failed before its fix.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 006 is committed | Two phases would edit the same functions | Start after the phase 006 commit |
| Risk | A bare name is rewritten in a document that means another folder | High: a correct reference is corrupted | The bare rewrite reads only the parent folder of an entry whose parent is unchanged, keeps the left-boundary guard that stops `001-a` matching inside a longer name, and the REQ-001 edge case holds a second parent with the same child name |
| Risk | The pre-archive id is rewritten while a live folder still holds it | High: references to a live packet are redirected | REQ-004 skips the second spelling when a live folder holds that id, and tests it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- A2 re-parent: reviewer A confirmed the renumber case only, and the dangling names REQ-003 guards against are the plan verifier's inference from the plan text. T001 reproduces the re-parent case before REQ-003 is built. A refusal is not offered as an alternative, because re-parenting is a shipped capability of phase 001 and refusing it would regress that.
- A2 Phase column: whether any validation rule reads the Phase column number is UNKNOWN. T001 records it.
<!-- /ANCHOR:questions -->

---
