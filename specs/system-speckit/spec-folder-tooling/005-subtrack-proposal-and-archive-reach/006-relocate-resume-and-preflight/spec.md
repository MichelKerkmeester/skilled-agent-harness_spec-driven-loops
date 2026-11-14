---
title: "Feature Specification: Phase 6: relocate-resume-and-preflight"
description: "A relocate.mjs run that stops partway cannot always be finished by rerunning the same map, and its preflight accepts a source that never existed and two spellings of one folder. This phase makes the rerun finish every step and makes the preflight refuse both inputs."
trigger_phrases:
  - "relocate resume and preflight"
  - "phase 6 relocate resume and preflight"
  - "relocate rerun finishes late steps"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: relocate-resume-and-preflight

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
| **Phase** | 6 of 10 |
| **Predecessor** | 005-tests-and-closeout |
| **Successor** | 007-phase-map-and-prearchive-rewrites |
| **Handoff Criteria** | After a late step fails once, a second `relocate.mjs --apply` of the same map prints that step as `ok` and exits 0, and a third run prints `relocate: nothing to do` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Subtrack proposal, deterministic packet relocation, z_archive on every subtrack and opt-in archive search specification.

**Scope Boundary**: Resume and preflight state inside `relocate.mjs` and its suite. No reference rewrite rule, no `archive.sh` change and no `create.sh` change.

**Dependencies**:
- The two code reviews of 2026-11-14 in `../scratch/`, which name the findings this phase closes
- The stubbed harness in `runtime/cli/tests/relocate.vitest.ts`, which this phase extends with stubs that fail once

**Deliverables**:
- A rerun that finishes the redirect table, the trigger index and the sweep of the close after any of them failed
- A rerun that completes a half-finished move step and a failed identity step
- A preflight that refuses a source that never existed and two spellings of one folder
- Suite cases for each of the above
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`relocate.mjs` tells the operator to rerun the same map after a failed step, but the rerun cannot always finish the work. The work check below has no term for the redirect table, the trigger index or the close, so a rerun after one of them failed prints `nothing to do` and exits 0. A half-finished move step is refused by the tool's own dirty-tree check, a failed identity step is skipped when the folder kept its name, and the preflight reads a mistyped source as a finished move and two case spellings of one folder as two folders.

### Purpose
Rerunning the same map after any failed step finishes that step, and the preflight refuses a map that names a source that never existed or names one folder twice.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ sed -n '961,964p' .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs
function hasWork(plan) {
  return plan.pending.length > 0 || plan.newSubtracks.size > 0 || plan.rewrites.length > 0
    || plan.identity.length > 0 || plan.trackWork.length > 0 || plan.unrecorded.length > 0;
}
```
The six terms cover moves, new sub-tracks, rewrites, identity, track roots and the ledger. None covers the two steps at lines 1122 and 1123 or the close at line 1285. The run outputs quoted in section 4 are reviewer reports from a `mktemp` copy, not runs made while planning.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

`C` is `.skilled/skills/system-spec-kit/runtime/cli`. Finding ids are those of the two reviews: `A` is `../scratch/review-20261114-core-code.md` and `B` is `../scratch/review-20261114-merge-fixes-and-hub-vocabulary.md`.

### In Scope
- Count the redirect table, the trigger index and the sweep of the close as work until each has passed once (A1). A moved packet's own validation verdict is printed and never counts as work.
- Let a rerun pass the dirty-tree check for folders the same map already moved (A3).
- Rerun the identity step for a moved folder whose `description.json` `parentChain` still names the old place (A4).
- Refuse a `from` that does not exist unless a record shows the move happened (A5).
- Compare sources and targets by device and inode instead of by spelling (B6).
- Add one happy-path case and one edge case per changed surface to `relocate.vitest.ts`.

### Out of Scope
- The renumber resume limit - a stopped `--renumber` derives its map from the live tree, so no map is left to rerun. Reviewer A reports it under the handover claims and not as a numbered finding. It is listed here for the operator and is not planned.
- Bare folder names in a phase map - phase 007 owns the rewrite rules (A2).
- The exit status `archive.sh` reads after a restore - phase 008 owns it (A6).
- A suite that runs the true writers - phase 010 owns it (A10). The cases here keep the stubbed harness and make a stub fail once.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `C/spec/relocate.mjs` | Modify | Work check, dirty-tree check, stale-identity check and preflight state and duplicate checks |
| `C/tests/relocate.vitest.ts` | Modify | Cases for REQ-001 to REQ-006, with stubs that fail once |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

Every check runs in `SCRATCH`, a `mktemp -d` copy of the tooling with its own git repository. `R` is `node C/spec/relocate.mjs`.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Closes A1 at `relocate.mjs:961-964`, `:1122-1123` and `:1280`. Failing scenario: `R --from <a> --to <b> --apply` prints `step ledger: ok (1 move(s))` then `step redirect table (cite-drift-scan --rebuild-redirects): FAILED exit 1` and exits 2, and the same command again prints `relocate: nothing to do` and exits 0. A rerun must finish the redirect table and the trigger index | The fixture move keeps the folder name, for example `alpha/001-a` to `alpha/sub/001-a`, because the stubbed harness never rewrites `specId` and a move that changes the number reports identity work on every run. With `cite-drift-scan.mjs` made to exit 1 once: run 1 exits 2. A dry run of the same map exits 1. Run 2 with `--apply` prints `step redirect table (cite-drift-scan --rebuild-redirects): ok` and `step trigger index (generate-trigger-index): ok` and exits 0. Run 3 prints `relocate: nothing to do` and exits 0 |
| REQ-002 | Closes A1 for the close at `relocate.mjs:1129-1149`. Failing scenario: the sweep fails in the close, the run exits 2, and the rerun prints `relocate: nothing to do` and exits 0 without running the close again. A rerun must run the close again until the sweep has passed once. A moved packet's own validation verdict is printed by every run that reaches the close and never keeps the map open | With `sweep-track-roots.mjs` made to exit 1 once: run 1 prints `close sweep-track-roots: FAILED` and exits 2. Run 2 with `--apply` prints `close sweep-track-roots: ok` and a `close validate specs/<b>: RESULT: PASSED` line and exits 0. Run 3 prints `relocate: nothing to do` and exits 0. With `validate.sh` failing for the moved packet on every call, run 1 exits 2 and run 2 prints `relocate: nothing to do` and exits 0 |
| REQ-003 | Closes B6 at `relocate.mjs:482-489`. Failing scenario on a case-insensitive volume: a map with sources `nu/001-a` and `nu/001-A` moves the first and fails the second with ENOENT, and a map with targets `nu/sub/001-a` and `nu/SUB/001-a` lands one packet inside the other at `specs/nu/sub/001-a/001-a`. Both exit 2 with the tree changed. The preflight must refuse both before any write. Existing paths are compared by device and inode. For a path that does not exist yet, the longest existing prefix is compared that way and the rest case-insensitively when a probe shows the volume folds case | On a case-insensitive volume, each of the two maps exits 2 with a `relocate: refused:` line that names both entries, and `git status --porcelain` prints nothing afterwards. On a case-sensitive volume the same two maps name distinct folders and are not refused for that reason |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Closes A3 at `relocate.mjs:1252-1268`. Failing scenario: a two-entry map where one folder is already moved and uncommitted is refused with `relocate: refused: specs/eps/sub/001-a/description.json: has uncommitted changes and would be rewritten`, exit 2. A rerun must complete a move step that stopped halfway | With a two-entry map, one entry moved by `git mv` and left uncommitted: `R --map <file> --apply` exits 0 and `ls` shows both folders at their destinations. With an uncommitted edit in a file outside both entries that the run would rewrite, the same command still exits 2 and prints `has uncommitted changes and would be rewritten` for that file |
| REQ-005 | Closes A4 at `relocate.mjs:780-803`. Failing scenario: a move into a sub-track where `step description identity (migrate-generated-json --only)` fails once. Run 2 reports `identity=0`, prints no such step and leaves `parentChain` as it was. A rerun must rerun the identity step for that folder | With `migrate-generated-json.ts` made to exit 1 once and a `create.sh` scaffold as the moved packet: run 1 prints `step description identity (migrate-generated-json --only): FAILED` and exits 2. Run 2 prints the same step as `ok` and exits 0. A folder whose `parentChain` already differed from its place before the move is not reported as identity work |
| REQ-006 | Closes A5 at `relocate.mjs:474-477`. Failing scenario: `R --from zeta/999-typo --to zeta/001-a`, where the source never existed, prints `moved specs/zeta/999-typo -> specs/zeta/001-a (already at its destination)` and plans `ledger ... record 1 move(s)`, exit 1. A missing source counts as moved only when a record shows the move | The same command exits 2 with a `relocate: refused:` line that names `specs/zeta/999-typo`, and prints no `ledger` line. After a real move of a tracked, uncommitted source whose run stopped before the ledger step, the same map still prints `moved ... (already at its destination)` and finishes. An untracked source is moved by plain rename at `relocate.mjs:1037`, so a run that stops before the ledger step leaves neither record, and neither does a tracked move the operator committed between runs. In both cases the same map exits 2 with a `relocate: refused:` line that names the source and the destination and tells the operator to move the folder back to the source path and rerun the map. After that move back, the map finishes with exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: In `SCRATCH`, after `cite-drift-scan.mjs` fails once, the second `R --apply` of the same map exits 0 with both late steps printed as `ok`, and the third prints `relocate: nothing to do`.
- **SC-002**: From `C`, `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/relocate.vitest.ts` exits 0 with the new cases included, each of which failed before its fix.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The relocation ledger, which only `relocate.mjs` reads and writes | The completion mark is an added field in a batch. No other reader exists to break | T002 saves the search that shows `relocate.mjs` as the only reader before the shape changes |
| Risk | The dirty-tree exemption lets a rerun overwrite an operator's uncommitted edit | High: an edit is lost | The exemption covers only folders the same map already moved. REQ-004 keeps the refusal for every other file and tests it |
| Risk | The goal's first completion criterion stops holding, a second apply exiting 0 with nothing to do | Med: a finished map would report work forever | REQ-001 and REQ-002 each end on a run that prints `relocate: nothing to do` and exits 0, and REQ-002 holds that for a moved packet whose validation never passes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- A4: reviewer A's fixture held `"parentChain": []` after the failed run. Whether that packet held `[]` before the move is UNKNOWN, because the fixture was deleted. T001 reproduces with a `create.sh` scaffold and records the value before and after. It decides whether the check compares against the old place only, as `relocate.mjs:776-779` asks, or against the new place.
- A5: which record proves a move is UNKNOWN until T001 lists the candidates. The plan names two, a ledger batch and the source path at `HEAD`. Neither covers an untracked source or a move committed between runs, so REQ-006 refuses those and names the move back. Whether moving the folder back lets the map finish is the verifier's inference, and T001 runs it before the refusal names it.
<!-- /ANCHOR:questions -->

---
