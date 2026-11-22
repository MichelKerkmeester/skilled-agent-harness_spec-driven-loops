---
title: "Acceptance Criteria: Allow a declared sub-track to hold declared sub-tracks (max two sub-track levels under a track)"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "nested subtracks acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/007-nested-subtracks"
    last_updated_at: "2026-11-21T06:36:29Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-nested-subtracks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Allow a declared sub-track to hold declared sub-tracks (max two sub-track levels under a track)

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `007-nested-subtracks`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-21
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a track with a declared level-2 sub-track, When both reader views read it, Then `mcp/tooling/clickup` is a track entry and `mcp/tooling` lists `clickup` | `.skilled/skills/system-spec-kit/runtime/cli/tests/nested-subtrack.vitest.ts` reader and commit cases pass | Met | - |
| AC-002 | REQ-002 | Given a declared level-2 sub-track, When `create.sh --track mcp/tooling/clickup` runs, Then `002-*` is created and both sub-track lists are current; When the value has four segments, Then it exits 1 with `has more than three path segments` | `.skilled/skills/system-spec-kit/runtime/cli/tests/nested-subtrack.vitest.ts` create cases pass | Met | - |
| AC-003 | REQ-003 | Given a level-2 sub-track, When `validate.sh` runs on it, Then it reports `TRACK_ROOT` sub-track; When run recursively on the track, Then the level-2 packet is validated | `.skilled/skills/system-spec-kit/runtime/cli/tests/nested-subtrack.vitest.ts` validate case passes against the rebuilt `dist/` | Met | - |
| AC-004 | REQ-004 | Given a declared folder inside a level-2 sub-track, When the reader runs, Then it is not listed and the diagnostic `nested past two sub-track levels` prints | `.skilled/skills/system-spec-kit/runtime/cli/tests/nested-subtrack.vitest.ts` reader and sweep cases pass | Met | - |
| AC-005 | REQ-005 | Given this repository, When the cli suite and the sweep rerun, Then no test that passed at baseline fails and the sweep prints no new diagnostic | `scratch/vitest-cli-after.txt` 210 passed, 0 failed files; `scratch/sweep-after.txt` same one diagnostic as baseline; `scratch/one-level-parity.txt` identical=true on all eight lines | Met | - |
| AC-006 | REQ-006 | Given a level-2 sub-track with no graph metadata, When `refresh-track-roots.mjs --apply` runs, Then `parent_id` is `mcp/tooling`; When a packet in it is refreshed or repaired, Then its parent is `mcp/tooling/clickup` | `.skilled/skills/system-spec-kit/runtime/cli/tests/nested-subtrack.vitest.ts` refresh, graph and repair cases pass | Met | - |
| AC-007 | REQ-007 | Given a committed two-level tree, When `relocate.mjs --from mcp/browser/002-move-me --to mcp/tooling/clickup/002-move-me --apply` runs, Then the packet moves and both lists update; When the destination is three levels deep, Then it exits 2 with `deeper than two sub-track levels` | `.skilled/skills/system-spec-kit/runtime/cli/tests/nested-subtrack.vitest.ts` relocation cases pass; `relocate.vitest.ts` three-level refusal passes | Met | - |
| AC-008 | REQ-008 | Given a level-1 sub-track holding a packet beside a sub-track, When the sweep runs, Then it exits 1 naming `001-flat` | `.skilled/skills/system-spec-kit/runtime/cli/tests/nested-subtrack.vitest.ts` sweep case passes | Met | - |
| AC-009 | REQ-009 | Given a packet in a level-2 sub-track, When `archive.sh --force` runs, Then it lands in that sub-track's `z_archive/` and leaves its list | `.skilled/skills/system-spec-kit/runtime/cli/tests/nested-subtrack.vitest.ts` archive case passes | Met | - |

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

**Closeable:** Yes

Every criterion is Met with observed evidence.
<!-- /ANCHOR:closure -->
