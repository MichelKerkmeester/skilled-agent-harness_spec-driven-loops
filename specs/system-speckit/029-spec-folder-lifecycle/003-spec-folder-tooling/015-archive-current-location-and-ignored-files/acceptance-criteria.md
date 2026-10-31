---
title: "Acceptance Criteria: Phase 15: archive-current-location-and-ignored-files"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "archive current location and ignored files acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/015-archive-current-location-and-ignored-files"
    last_updated_at: "2026-10-08T01:00:00Z"
    last_updated_by: "claude-opus-5.5"
    recent_action: "Archived and restored a real packet and closed the criteria"
    next_safe_action: "None, the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-archive-current-location-close"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 15: archive-current-location-and-ignored-files

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/015-archive-current-location-and-ignored-files
**Level:** 2
**Status:** Complete
**Date:** 2026-10-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a track packet whose graph metadata names its track as parent, When `archive.sh` archives it and then restores it, Then strict validation passes after each move. | A temporary track packet reported RESULT: PASSED before the move, after `archive.sh --force` and after `--restore`, with `specFolder` `zz-e2e/z_archive/001-e2e` and `parent_id` null while archived. `archive-track.vitest.ts` asserts both moves call `repair-derived.cjs --roots <new folder> --apply`. | Met | - |
| AC-002 | REQ-002 | Given an archived packet, When the repair or the upgrade runs on it, Then its documents keep their bytes apart from the recorded pointer and folder row. | `upgrade-legacy.vitest.ts` asserts every archived `.md` file is byte-identical after `--apply --include-archive`. The repair writes only `description.json`, `graph-metadata.json`, the frontmatter pointer and the Spec Folder row. | Met | - |
| AC-003 | REQ-003 | Given an archived packet with a stale `specFolder`, pointer and parent, When `repair-derived.cjs --roots` walks its tree, Then all three name its current place. | `repair-derived.vitest.ts` covers the archived fixture. The previous version of the tool inspected 0 packets on the same fixture and left `specFolder` stale. | Met | - |
| AC-004 | REQ-004 | Given a failing archived packet, When `upgrade-legacy --apply --include-archive` runs, Then only `repair-derived` runs on it. | `upgrade-legacy.vitest.ts` asserts the `step repair-derived (archived): ok` line and unchanged documents, and the suite passes 17 of 17. | Met | - |
| AC-005 | REQ-005 | Given untracked files the committed ignore rules exclude, When the corpus is walked, Then they are skipped, a tracked file matching an ignore rule stays, and neither is listed as skipped. | `trigger-index.vitest.ts` covers all three. The rebuild dropped 30 untracked containment copies, `git ls-files` confirms none was tracked, and `--check` exits 0. | Met | - |
| AC-006 | REQ-006 | Given the final code, When the spec-kit CLI suite runs, Then nothing fails. | `npx vitest run runtime/cli/tests`: 161 files passed and 3 skipped, 1,639 tests passed and 19 skipped, 0 failed, against a baseline of 1,636 passed. | Met | - |

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

All six criteria are Met: a real archive and restore pass with no manual step, archived documents keep their content, the repair and upgrade tools handle archived packets, the index walk skips ignored files, and the CLI suite passes. A phase parent's `children_ids` is consciously left to the reviewed prune.
<!-- /ANCHOR:closure -->

---
