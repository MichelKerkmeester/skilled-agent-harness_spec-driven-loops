---
title: "Acceptance Criteria: Keep every track root's children_ids equal to its packets on disk, and block a push that breaks it"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "track root children_ids"
  - "track-root pre-push gate"
  - "acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/037-track-root-children"
    last_updated_at: "2026-09-24T12:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded evidence for all eight criteria"
    next_safe_action: "Push the skill doc integration"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs"
      - ".skilled/scripts/git-hooks/pre-push"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-037-track-root-children"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Keep every track root's children_ids equal to its packets on disk, and block a push that breaks it

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/037-track-root-children
**Level:** 2
**Status:** Complete
**Date:** 2026-09-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a track listing `001-p` that holds only `002-q`, When the sweep runs, Then it exits 1 and names both | `track-roots.vitest.ts` "reports a track whose names differ even when the counts agree"; a count-only comparison fails it | Met | - |
| AC-002 | REQ-002 | Given a drifted track, When the writer runs with `--apply`, Then `children_ids` equals its packets and every other field, the key order and the format are unchanged | `track-roots.vitest.ts` "sets children_ids to the numbered packets on disk and changes nothing else"; the same check on all 13 refreshed files | Met | - |
| AC-003 | REQ-003 | Given a pushed commit with a packet its track does not list, When the hook runs, Then the push is blocked, and a clean commit passes whatever the working tree holds | `pre-push.test.sh`, 41 passing; reading the working tree instead of the commit fails two cases | Met | - |
| AC-004 | REQ-004 | Given this repository, When the sweep runs, Then it exits 0 | `sweep-track-roots.mjs --specs specs` prints "all track roots match their declared children" | Met | - |
| AC-005 | REQ-005 | Given a track with a `graph-metadata.json`, When `create.sh --track` scaffolds a normal or a phase packet, Then the track lists it and `--json` stdout stays one payload | `create-track-refresh.vitest.ts`, 6 passing; removing either call site fails it | Met | - |
| AC-006 | REQ-006 | Given an empty `graph-metadata.json`, When the writer runs with `--apply`, Then it reports the track, exits 2 and leaves the file empty | `track-roots.vitest.ts` "reports unreadable metadata, writes nothing to it and fails" | Met | - |
| AC-007 | REQ-007 | Given a push, When the toolchain is absent, the track is symlinked, the sweep is missing or the skip variable is set, Then the gate stays silent, leaves the track out, blocks, or skips | `pre-push.test.sh` track-root cases and `track-roots.vitest.ts` "skips a symlinked track under --rev" | Met | - |
| AC-008 | REQ-008 | Given the linked `ai-systems` and `anobel.com` tracks, When the sweep runs, Then neither is reported | The same sweep run as AC-004 reads both through their links | Met | - |

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

All eight criteria are met. The drift was fixed once, and the writer, the `create.sh` hook-up and the push gate keep it fixed. Left out on purpose: the stale `last_active_child_id` fields, and making `archive.sh` aware of tracks.
<!-- /ANCHOR:closure -->
