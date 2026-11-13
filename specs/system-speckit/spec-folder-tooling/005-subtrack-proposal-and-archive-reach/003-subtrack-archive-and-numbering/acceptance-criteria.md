---
title: "Acceptance Criteria: Phase 3: subtrack-archive-and-numbering"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "subtrack archive and numbering acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/003-subtrack-archive-and-numbering"
    last_updated_at: "2026-11-13T10:07:30Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-subtrack-archive-and-numbering"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: subtrack-archive-and-numbering

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/003-subtrack-archive-and-numbering
**Level:** 2
**Status:** Draft
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`C` is `.skilled/skills/system-spec-kit/runtime/cli/spec`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a scratch tree with a declared subtrack `demo/sub` and no archive folder, When `node C/refresh-track-roots.mjs --track demo/sub --apply` runs, Then `demo/sub/z_archive/.gitkeep` exists, a second run changes nothing and a run without `--apply` writes nothing | Scratch tree with declared sub-track `demo/sub`. Dry run: printed `demo/sub: create z_archive/.gitkeep`, exit 1, nothing written. `--apply`: printed `demo/sub: create z_archive/.gitkeep (written)`, exit 0, `.gitkeep` present. Second `--apply`: printed only `demo/sub: up to date`, exit 0. With `z_archive` a symlink: printed `demo/sub: z_archive is a symlink, not written`, exit 2, and the link target stayed empty | Met | - |
| AC-002 | REQ-002 | Given the same scratch tree before seeding, When `node C/sweep-track-roots.mjs` runs, Then it prints one line that names `demo/sub` as lacking `z_archive/`, and no such line after seeding | Same scratch tree. Before seeding the sweep printed `demo/sub: sub-track has no z_archive/; seed it with refresh-track-roots.mjs --apply`, exit 0. After seeding it printed no such line, exit 0. Real tree after seeding: no missing-archive line, exit 0, the exit code in `scratch/sweep-before.txt` | Met | - |
| AC-003 | REQ-003 | Given the real tree after seeding and the operator's commit, When `git ls-files 'specs/*/*/z_archive/.gitkeep'` runs, Then it prints 40 lines | Real tree: `refresh-track-roots.mjs --apply` wrote 40 `.gitkeep` files, exit 0. After commit `5f3e19712e`, `git ls-files 'specs/*/*/z_archive/.gitkeep' | wc -l` printed 40 | Met | - |
| AC-004 | REQ-004 | Given `specs/demo/001-a` live and `specs/demo/z_archive/007-b` archived in a scratch tree, When `create.sh --track demo --skip-branch` runs, Then the new folder is `specs/demo/008-*` | Throwaway clone with `specs/demo/001-a` live and `specs/demo/z_archive/007-b` archived: `create.sh --track demo --skip-branch --short-name next-one "Next one"` exit 0 and created `specs/demo/008-next-one`. With `005-c` live and `z_archive/002-low` archived it created `006-lower`. `bash -n create.sh` exit 0 | Met | - |
| AC-005 | REQ-005 | Given `create-root-numbering.vitest.ts`, When the suite runs before and after the `create.sh` change, Then the archive case fails before and passes after | Before: the build dispatch of the earlier session reported that the case `numbers after an archived packet so its number is not reused` failed before the `create.sh` change. The orchestrator did not rerun that failure. After: the dispatch reported the 17 tests of the file passing, and the orchestrator's full `npm test` rerun exited 0 with 2525 tests passed against a baseline of 2524 | Met | - |
| AC-006 | REQ-006 | Given the two docs, When they are searched for the subtrack archive, Then each names it | `rg -c -i "sub-track"` on `spec-lifecycle-automation.md` printed 1, and its line 41 names the sub-track's own `z_archive/`. The `archive.sh` row of `C/README.md`, at line 114 since the phase 002 row was added above it, names the sub-track's own `z_archive/` beside the track and phase archives | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All 6 criteria are Met with evidence the orchestrator observed on 2026-11-13, in a scratch tree and a throwaway clone for the fixture runs and on the real tree for the seeding. AC-003 was observed after commit `5f3e19712e`. AC-005 rests in part on a report: the failure of the new case before the fix was reported by the build dispatch and was not rerun. `npm test` after the change exits 0 with one test more than the baseline in `scratch/baseline.txt`, the new numbering case.
<!-- /ANCHOR:closure -->
