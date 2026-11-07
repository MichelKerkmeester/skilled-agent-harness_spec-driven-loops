---
title: "Acceptance Criteria: Named sub-track support in spec-kit, plus project-owned doctor entries, the vendored .skilled/specs link and a host-repository trigger index"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "sub-track acceptance criteria"
  - "named subtracks closure gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/044-named-subtracks-and-host-repos"
    last_updated_at: "2026-11-07T13:53:46Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: Named sub-track support in spec-kit, plus project-owned doctor entries, the vendored .skilled/specs link and a host-repository trigger index

<!-- SPECKIT_LEVEL: 2 -->

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `044-named-subtracks-and-host-repos`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the fixture tree, When `readWorkingTreeTracks` and `readCommitTracks` run, Then both return `demo/sub` with `001-nested-probe` and list `demo/sub` in `demo`'s children | `track-roots.vitest.ts` sub-track cases | Unmet | - |
| AC-002 | REQ-002 | Given the Measured Behavior tree, When `refresh-track-roots.mjs --track demo/sub --apply` runs, Then it exits 0 and `demo/sub/graph-metadata.json` lists `demo/sub/001-nested-probe` | The reproduction command output | Unmet | - |
| AC-003 | REQ-003 | Given `demo/sub` holds `001-*`, When `create.sh --track demo/sub` runs, Then the new packet is `demo/sub/002-*` and both `children_ids` lists contain it | `create-track-refresh.vitest.ts` | Unmet | - |
| AC-004 | REQ-004 | Given the fixture tree, When `validate.sh specs/demo/sub --strict` and `validate.sh specs/demo --recursive` run, Then the first prints `RESULT: PASSED` and the second lists the nested packet | Validate output | Unmet | - |
| AC-005 | REQ-005 | Given a packet moved into or between sub-tracks, When `repair-derived.cjs --apply` runs, Then its `parent_id` is its new sub-track and no `parent_id_review_required` is set | `repair-derived.vitest.ts` move cases | Unmet | - |
| AC-006 | REQ-006 | Given the baseline in `scratch/baseline.txt`, When the plan's test command runs, Then every baseline case passes and a flat-only tree's metadata is byte-identical | Test totals against the baseline | Unmet | - |
| AC-007 | REQ-007 | Given a sub-track packet, When it is archived and restored, Then it moves through `demo/sub/z_archive/` and both levels' `children_ids` follow | `archive-track.vitest.ts` sub-track cases | Unmet | - |
| AC-008 | REQ-008 | Given an undeclared folder and a symlinked sub-track, When the sweep runs, Then it prints one diagnostic for each in both views | Sweep test output | Unmet | - |
| AC-009 | REQ-009 | Given a host with a real `.env.example`, When the symlink engine plans and checks, Then it reports `project-owned` and the file's bytes are unchanged | `symlink-engine.test.cjs` | Unmet | - |
| AC-010 | REQ-010 | Given vendored copies with and without a host `specs/`, When setup runs, Then neither leaves a dangling `.skilled/specs` link | Two engine fixture cases | Unmet | - |
| AC-011 | REQ-011 | Given the docs, When a reader looks for host index mode, Then `runtime/data/README.md` and `folder-structure.md` name the generate command and the Gate 1 lookup with `--index` | `rg -n -- '--index' <both files>` | Unmet | - |
| AC-012 | REQ-012 | Given the docs, When a reader looks for the sub-track level, Then the search guide, README and `folder-structure.md` show it | `rg -n 'sub-track' <each file>` | Unmet | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** No

No criterion is met yet; implementation has not started.
<!-- /ANCHOR:closure -->
