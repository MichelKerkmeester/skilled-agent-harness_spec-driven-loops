---
title: "Acceptance Criteria: Phase 7: status-index"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "status index acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/007-status-index"
    last_updated_at: "2026-11-22T10:48:33Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-status-index"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 7: status-index

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 007-status-index
**Level:** 2
**Status:** Draft
**Date:** 2026-11-22
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given an index built from three run records, When the index file is deleted and `bots status --rebuild` runs, Then `bots status --json` prints the same rows as before, ignoring `builtAt`, and a test with the runs folder made unreadable after the build still prints every row | The rebuild parity test and the unreadable-runs test in `status-index.vitest.ts` and `status.vitest.ts` | Unmet | - |
| AC-002 | REQ-002 | Given an index whose generation stamp is older than the newest run, When `bots status` runs, Then it prints `stale` and the `builtAt` time | The stale test in `status-index.vitest.ts` | Unmet | - |
| AC-003 | REQ-006 | Given a checkout moved to a new path with the same identity, When `bots status` runs, Then its rows show the new path and the previous path | The relink test in `status.vitest.ts` | Unmet | - |
| AC-004 | REQ-003 | Given one checkout path deleted and one made unreadable, When `bots status` runs, Then the first row is `missing`, the second is `unreadable`, and the row count is unchanged | The row-state test in `status.vitest.ts`, with a row count before and after | Unmet | - |
| AC-005 | REQ-004 | Given one bot installed by phase 6 that never ran and one whose last launchd fire exited non-zero with no run record, When `bots status` runs, Then both appear, as `never-run` and `launchd-failed` | The merge test over captured `launchctl print` output, plus the manual check on one real disabled label | Unmet | - |
| AC-006 | REQ-008 | Given more runs than each ADR-002 bound, When retention runs, Then the index rows, run directories and skipped-slot summary each count exactly their bound | The retention test in `status-index.vitest.ts` | Unmet | - |
| AC-007 | REQ-009 | Given terminal rows written before retention, When more runs are added and retention runs, Then every kept terminal row is byte-identical to its first write | The immutability test comparing row dumps before and after | Unmet | - |
| AC-008 | REQ-005 | Given a freshly opened index, When the pragmas are read back, Then `journal_mode` is `wal`, `busy_timeout` is `5000` and `synchronous` is `2` | The pragma test in `status-index.vitest.ts` | Unmet | - |
| AC-009 | REQ-007 | Given a registered repository, When `bots status --unregister <identity>` runs, Then its rows are hidden and the file count under the state root is unchanged | The unregister test with `find "$T" -type f \| wc -l` before and after | Unmet | - |
| AC-010 | REQ-010 | Given two present registered roots for one identity, When `bots status` runs, Then it flags the identity, names both paths and leaves every row's path unchanged | The two-clones test in `status.vitest.ts` | Unmet | - |
| AC-011 | REQ-011 | Given an index row whose run folder under `.skilled/skills/.state/system-skilled-bots/<identity>/runs/` was deleted, When `bots status` and then `bots status --rebuild` run, Then status exits 0, the row shows `run-folder-gone` and the row is still there after the rebuild | The gone-folder test in `status.vitest.ts` | Unmet | - |
| AC-012 | REQ-012 | Given a symlink in the runs folder that points outside it and a second identity's runs folder, When retention runs past the run folder bound, Then both outside targets are unchanged | The prune-boundary test in `status-index.vitest.ts` | Unmet | - |
| AC-013 | REQ-013 | Given one open, one answered and one past-expiry needs-you item, When `bots status` runs, Then it prints one `needs-you` row and one `expired` row with no question text, and every item file is byte-identical afterwards | The needs-you rows test in `status.vitest.ts` | Unmet | - |
| AC-014 | REQ-014 | Given more answered or expired items than `retention.closedNeedsYouPerIdentity` plus 3 open items, When retention runs, Then the closed items count exactly the bound and all 3 open items remain | The item retention test in `status-index.vitest.ts` | Unmet | - |
| AC-015 | REQ-015 | Given one install record whose runner path was deleted, one whose `.skilled` symlink was retargeted and one untouched, When `bots status` runs, Then the first two show `needs-reinstall`, the third shows no flag and no plist changes | The reinstall flag test in `status.vitest.ts`, with a plist checksum before and after | Unmet | - |
| AC-016 | REQ-016 | Given one bot with an open needs-you item and one with none, When `bots status` runs, then the item is answered and status runs again, Then the first run shows the first bot as `held` with the item id and the second bot without it, and the second run shows neither as `held` | Status test over a temp state root (T024) | Unmet | - |

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

**Closeable:** No

Nothing is built yet, so every criterion is unmet.
<!-- /ANCHOR:closure -->
