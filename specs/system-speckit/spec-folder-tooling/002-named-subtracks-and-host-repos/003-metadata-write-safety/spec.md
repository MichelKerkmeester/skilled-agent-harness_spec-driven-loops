---
title: "Feature Specification: Phase 3: metadata-write-safety"
description: "refresh-track-roots --apply writes through a symlinked graph-metadata.json, and the pre-push repair it prints cannot clear a declared sub-track that has no metadata file. This phase plans a write guard and a working repair, each from a failing test."
trigger_phrases:
  - "metadata write safety"
  - "phase 3 metadata write safety"
  - "refresh track roots symlinked metadata"
  - "sweep unreadable sub-track metadata repair"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: metadata-write-safety

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-07 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-subtrack-predicate |
| **Successor** | 004-doctor-symlink-gaps |
| **Handoff Criteria** | REQ-001 through REQ-005 pass; the P2-4 and P2-3 red cases pass, the printed sweep repair clears a metadata-less declared sub-track, both operator decisions are recorded, and the required 11-file suite passes with 194 tests (baseline 190 plus four new cases) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the 044 remediation. The parent, `specs/system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos`, made `refresh-track-roots.mjs` and the pre-push sweep handle sub-tracks. The review found that the refresh writer follows a symlinked metadata file (P2-4) and that the sweep's printed repair cannot fix an absent one (P2-3, `../review/review-report.md` section 3 and `../review/p2-verification.md`).

**Scope Boundary**: What `refresh-track-roots.mjs` writes and where, and what it does for a declared sub-track with no `graph-metadata.json`. The readers' name and symlink rules are phase 002.

**Dependencies**:
- Phase 002, because it settles which folders count as declared sub-tracks before this phase seeds metadata for one.
- The sub-track fixture builder `runtime/cli/tests/fixtures/subtrack-tree.mjs`.

**Deliverables**:
- A write guard that refuses a symlinked metadata file, for the sub-track and, per D-003a, for the top-level track.
- A refresh that seeds a missing sub-track metadata file, so the sweep's own repair clears the pre-push block (per D-003b).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`refresh-track-roots.mjs --apply` calls `fs.writeFileSync` on the track's metadata path (`refresh-track-roots.mjs:107`), which follows a symlink, so a symlinked `graph-metadata.json` rewrites a file outside the tree (P2-4). `create.sh` and `archive.sh` call `--apply` themselves, so the write happens with no operator command. Top-level track metadata has the same gap (`track-roots.mjs:118-120`), and it predates sub-tracks. Separately, a declared sub-track with no `graph-metadata.json` makes the sweep exit 1, which blocks the pre-push gate. The sweep tells the operator to run `refresh-track-roots.mjs --apply`, and that command refuses to write the file (`refresh-track-roots.mjs:90-94`), so the printed repair cannot clear the block (P2-3, `track-roots.mjs:151`).

### Purpose
Refresh never writes outside the tree through a link, and the repair the sweep prints clears the block it reports.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
# Observed 2026-11-07 in a scratch workspace: the 044 fixture tree. Case 1 replaces demo/sub/graph-metadata.json with a symlink to a file outside specs/ that holds an empty children_ids. Case 2 deletes demo/sub/graph-metadata.json.
$ node .skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs --specs specs --track demo/sub --apply      # case 1, exit=0
demo/sub: add 001-nested-probe (written)
$ cat <the file outside specs/>      # excerpt
  "children_ids": [
    "demo/sub/001-nested-probe"
  ]
$ node .skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs --specs specs     # case 2, exit=1
demo/sub: declared=? actual=? (graph-metadata.json is unreadable)

sweep-track-roots: 1 track root(s) drifted; rewrite them with refresh-track-roots.mjs --apply
$ node .skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs --specs specs --track demo/sub --apply      # exit=2
demo/sub: graph-metadata.json is unreadable, not written
```
`find specs -maxdepth 3 -name graph-metadata.json -type l`, run at the root of this checkout while planning, printed nothing: no track or sub-track here has a symlinked metadata file. A host's tree is UNKNOWN.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Refuse to write a symlinked `graph-metadata.json` in `refresh-track-roots.mjs`, count it as a failure and exit 2 (P2-4).
- Cover the top-level track in the same guard, as D-003a recommends (P2-4).
- Seed a missing sub-track `graph-metadata.json` in the track-root shape when `--apply` runs, and keep refusing an existing unreadable one (P2-3).

### Out of Scope
- Reading through a symlinked metadata file in the reader or the sweep - reads are harmless; only the write is guarded.
- Changing `create.sh`'s early return for a level with no `graph-metadata.json` (`create.sh:~1013`) - phase 005 pins that behavior with a test.
- Seeding a missing top-level track metadata file - the reader does not list a track without one, so no sweep block arises.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs` | Modify | An `lstat` guard before the write (`:107`), and the seed for an absent sub-track file (`:90-94`) |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/track-roots.vitest.ts` | Modify | Red cases in the `refresh-track-roots` and `sweep-track-roots with sub-tracks` groups |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | P2-4: `refresh-track-roots.mjs --apply` never writes through a symlinked `graph-metadata.json` (`refresh-track-roots.mjs:107`) | With the metadata file a symlink to a file outside the tree, the command exits 2, prints `demo/sub: graph-metadata.json is a symlink, not written`, and the target's bytes are unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | P2-4, top-level case, per D-003a: the same guard covers `<track>/graph-metadata.json` (`track-roots.mjs:118-120`) | The same case on `demo/graph-metadata.json` exits 2 and leaves the target unchanged |
| REQ-003 | P2-3: `--apply` seeds a missing sub-track `graph-metadata.json` (track-root shape, `parent_id` the track, `children_ids` its packets) when the file is absent, per D-003b | After deleting `demo/sub/graph-metadata.json`, `refresh-track-roots.mjs --track demo/sub --apply` exits 0, and `sweep-track-roots.mjs` then exits 0 |
| REQ-004 | An existing unreadable metadata file is still refused, never overwritten | With `demo/sub/graph-metadata.json` holding invalid JSON, `--apply` exits 2 and the file's bytes are unchanged |
| REQ-005 | Flat tracks with readable metadata behave as before (parent REQ-006, NFR-R01) | Every case in the `track-roots.vitest.ts` refresh and sweep groups that passed in the baseline still passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The two Measured Behavior cases, rerun after the fix, give: case 1 exits 2 with the outside file unchanged, and case 2 exits 0 with the sweep then exiting 0.
- **SC-002**: `track-roots.vitest.ts`, `create-track-refresh.vitest.ts` and `archive-track.vitest.ts` pass with zero failures, against the baseline taken before the first change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `create.sh` and `archive.sh` call `refresh-track-roots.mjs --apply` | Med: a refusal now surfaces as their `was not refreshed` warning | T001 records their tests in the baseline, and T010 reruns them |
| Risk | A host deliberately symlinks a track's metadata file to a shared location, and the guard now refuses its refresh | Med: that host's refresh stops until it chooses | D-003a puts the top-level case to the operator; the sub-track case is new in 044 and has no such host yet. A host tree is UNKNOWN, and this checkout has none |
| Risk | Seeding writes a new file where `--apply` only edited before | Low: a new write path | The seed runs only when `lstat` reports the file absent, passes through the same symlink guard, and writes the minimal track-root shape |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **D-003a (operator decision): P2-4 on the top-level track.** The guard is one `lstat` at the write site, and that site is shared by every track.
  - Option A, cover both levels (recommended): one guard, and no existing symlinked track metadata was found in this checkout. It also closes the pre-existing top-level gap `p2-verification.md` row P2-4 names.
  - Option B, sub-track only: name the top-level case as adjacent and leave it. It needs a level check in the guard, to keep a gap that predates sub-tracks.
  - Status: answered. Decided 2026-11-07 by operator: Option A, cover both levels.
- **D-003b (operator decision): the pre-push repair path.** The sweep blocks on a declared sub-track with no metadata, and its printed repair cannot fix that.
  - Option A, seed on `--apply` (recommended): the repair the sweep already prints starts working, with no change to the sweep. It adds a write path, guarded as REQ-001 requires.
  - Option B, change the sweep's message: name a repair that exists. No command creates the file today, so the message could only say to write it by hand.
  - Status: answered. Decided 2026-11-07 by operator: Option A, seed on --apply.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Evidence**: `../review/review-report.md`, `../review/p2-verification.md`
