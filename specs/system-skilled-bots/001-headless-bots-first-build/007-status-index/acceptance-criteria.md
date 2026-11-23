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
    last_updated_at: "2026-11-23T11:20:00Z"
    last_updated_by: "implement-007-status-index"
    recent_action: "Marked 15 of 16 rows Met with evidence"
    next_safe_action: "Run scratch/live-status-check.sh after the operator approves it, then close AC-005"
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
**Status:** In Progress
**Date:** 2026-11-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given an index built from three run records, When the index file is deleted and `bots status --rebuild` runs, Then `bots status --json` prints the same rows as before, ignoring `builtAt`, and a test with the runs folder made unreadable after the build still prints every row | The rebuild parity test `.skilled/skills/system-skilled-bots/runtime/tests/status-index.vitest.ts:104` (snapshot equal ignoring `builtAt`) and the CLI parity test `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts:349` (`bots status --json` before the delete equals `--rebuild --json` after, ignoring `builtAt`); the unreadable-runs case `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts:206` prints both rows with the runs folder at mode 000. Observed: whole suite 355 of 355 passed (`specs/system-skilled-bots/001-headless-bots-first-build/007-status-index/scratch/bots-suite-after-2.txt:73`) | Met | - |
| AC-002 | REQ-002 | Given an index whose generation stamp is older than the newest run, When `bots status` runs, Then it prints `stale` and the `builtAt` time | The stale test `.skilled/skills/system-skilled-bots/runtime/tests/status-index.vitest.ts:125` (report `stale: true`, text holds `stale` and `2026-11-21T00:00:00.000Z`) and the CLI text check `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts:349`. Observed passing | Met | - |
| AC-003 | REQ-006 | Given a checkout moved to a new path with the same identity, When `bots status` runs, Then its rows show the new path and the previous path | The relink test `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts:177`: the renamed checkout's row shows `path` the new path and `previousPath` the old one. Observed passing | Met | - |
| AC-004 | REQ-003 | Given one checkout path deleted and one made unreadable, When `bots status` runs, Then the first row is `missing`, the second is `unreadable`, and the row count is unchanged | The row-state test `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts:131` (4 bot rows before and 4 after, `missing` and `unreadable`) and the locked-parent case `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts:158`. Observed passing | Met | - |
| AC-005 | REQ-004 | Given one bot installed by phase 6 that never ran and one whose last launchd fire exited non-zero with no run record, When `bots status` runs, Then both appear, as `never-run` and `launchd-failed` | Live, 2026-11-23: one bot installed held disabled and never run shows as installed and `never-run`, read through a real `launchctl print` that answered `not-loaded` with 0 runs (`specs/system-skilled-bots/001-headless-bots-first-build/007-status-index/scratch/live-status-result.txt:26`, `specs/system-skilled-bots/001-headless-bots-first-build/007-status-index/scratch/live-status-result.txt:30`, `specs/system-skilled-bots/001-headless-bots-first-build/007-status-index/scratch/live-status-result.txt:38`). The `launchd-failed` half is proven over captured-format print output in `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts:131`, since a real failing fire would need an enabled bot, which this check does not do | Met | - |
| AC-006 | REQ-008 | Given more runs than each ADR-002 bound, When retention runs, Then the index rows, run directories and skipped-slot summary each count exactly their bound | The retention test `.skilled/skills/system-skilled-bots/runtime/tests/status-index.vitest.ts:146` with bounds 5, 3 and 4 from `bots/config.json`: 5 index rows, 3 run folders, 4 stored slots of 10. Observed passing | Met | - |
| AC-007 | REQ-009 | Given terminal rows written before retention, When more runs are added and retention runs, Then every kept terminal row is byte-identical to its first write | The immutability test `.skilled/skills/system-skilled-bots/runtime/tests/status-index.vitest.ts:173`: 9 runs written, one re-indexed with a different exit, retention to 5; each kept row's dump equals its first write. Observed passing | Met | - |
| AC-008 | REQ-005 | Given a freshly opened index, When the pragmas are read back, Then `journal_mode` is `wal`, `busy_timeout` is `5000` and `synchronous` is `2` | The pragma test `.skilled/skills/system-skilled-bots/runtime/tests/status-index.vitest.ts:60` reads back `wal`, `5000` and `2`. Observed passing | Met | - |
| AC-009 | REQ-007 | Given a registered repository, When `bots status --unregister <identity>` runs, Then its rows are hidden and the file count under the state root is unchanged | The CLI unregister test `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts:402` compares `find "$T" -type f \| wc -l` before and after and finds the rows hidden; the library case `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts:315` compares the full file list, and `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts:424` unregisters, deletes the index and runs `--rebuild`: the rows stay hidden and the `find` count is unchanged, because the retirement lives in the registered-roots file (Q004). `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts:437` unregisters over a missing index and builds nothing, so no run folder or state file is deleted. Observed passing | Met | - |
| AC-010 | REQ-010 | Given two present registered roots for one identity, When `bots status` runs, Then it flags the identity, names both paths and leaves every row's path unchanged | The two-clones test `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts:189`: `duplicateRoots` names both paths, the present row keeps its path and a missing row with two candidates stays `missing`. Observed passing | Met | - |
| AC-011 | REQ-011 | Given an index row whose run folder under `.skilled/skills/.state/system-skilled-bots/<identity>/runs/` was deleted, When `bots status` and then `bots status --rebuild` run, Then status exits 0, the row shows `run-folder-gone` and the row is still there after the rebuild | The gone-folder test `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts:206` (the row reads `run-folder-gone` before and after a rebuild) and the CLI case `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts:371` (exit 0). Observed passing | Met | - |
| AC-012 | REQ-012 | Given a symlink in the runs folder that points outside it and a second identity's runs folder, When retention runs past the run folder bound, Then both outside targets are unchanged | The prune-boundary test `.skilled/skills/system-skilled-bots/runtime/tests/status-index.vitest.ts:204`: the link's outside target and the other identity's folder keep their files, both are listed as refused, and only the in-bound old folder is deleted. Observed passing | Met | - |
| AC-013 | REQ-013 | Given one open, one answered and one past-expiry needs-you item, When `bots status` runs, Then it prints one `needs-you` row and one `expired` row with no question text, and every item file is byte-identical afterwards | The needs-you rows test `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts:230`: one `needs-you` and one `expired` row, no question text in the JSON or the text output, the item folder hash unchanged. Observed passing | Met | - |
| AC-014 | REQ-014 | Given more answered or expired items than `retention.closedNeedsYouPerIdentity` plus 3 open items, When retention runs, Then the closed items count exactly the bound and all 3 open items remain | The item retention test `.skilled/skills/system-skilled-bots/runtime/tests/status-index.vitest.ts:228` with the bound 4, 14 closed and 3 open items: 7 files remain, all 3 open among them. `.skilled/skills/system-skilled-bots/runtime/tests/status-index.vitest.ts:252`: answered items whose resume is queued, claimed or not yet recorded stay past the bound. `.skilled/skills/system-skilled-bots/runtime/tests/status-index.vitest.ts:293`: an identity whose checkout cannot be read prunes nothing. Observed passing | Met | - |
| AC-015 | REQ-015 | Given one install record whose runner path was deleted, one whose `.skilled` symlink was retargeted and one untouched, When `bots status` runs, Then the first two show `needs-reinstall`, the third shows no flag and no plist changes | The reinstall flag test `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts:286`: `runner-missing` and `runner-retargeted` rows read `needs-reinstall` with the fix `bots schedule install tick`, the untouched one does not, and the agents folder hash is unchanged. Observed passing | Met | - |
| AC-016 | REQ-016 | Given one bot with an open needs-you item and one with none, When `bots status` runs, then the item is answered and status runs again, Then the first run shows the first bot as `held` with the item id and the second bot without it, and the second run shows neither as `held` | The held test `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts:249`: the first run shows `held` with item `h1` on `alpha` only; after the answer (item file plus generation stamp, as `bots answer` writes them) and no rebuild, neither row lists `held` and the identity still reads stale (Q005). Observed passing | Met | - |

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

Every row is Met, AC-005 by the live status check of 2026-11-23 in `scratch/live-status-result.txt`.
<!-- /ANCHOR:closure -->
