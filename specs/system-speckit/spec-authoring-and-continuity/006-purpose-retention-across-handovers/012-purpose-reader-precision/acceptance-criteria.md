---
title: "Acceptance Criteria: Phase 12: purpose-reader-precision"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "purpose reader precision acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/012-purpose-reader-precision"
    last_updated_at: "2026-11-14T11:26:57Z"
    last_updated_by: "scaffold"
    recent_action: "Met every criterion from the build and verification"
    next_safe_action: "Build phase 013"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-purpose-reader-precision"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 12: purpose-reader-precision

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `012-purpose-reader-precision`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given every live `spec.md`, When the probe runs on the built reader, Then it prints `combinedOpening":0` and `layout sentence as own purpose: 0` | T030 output. Observed: `combinedOpening":0` and `layout sentence as own purpose: 0`, with `own purpose read: 2721 of 2985` | Met | - |
| AC-002 | REQ-001 | Given a combined-heading packet with no parent purpose and no `goal.md`, When the reader runs, Then it returns null, and under a parent it returns the parent's purpose with the packet's own problem | `packet-purpose.vitest.ts` tests from E14, in T029. Observed: `(14 tests)` passed, including the combined-heading null case and the inherited purpose with the child's own problem | Met | - |
| AC-003 | REQ-002 | Given the four rule texts, When `nudge.test.cjs` and the workflow test run, Then the nudge names `## PURPOSE`, `## ROOT PURPOSE`, `UNKNOWN`, the repo-relative label and both layout sentences, and the workflow test still passes 150 | T031 and T032 output. Observed: nudge `pass 89`, `fail 0` with the new parts, and `Result: passed=150 failed=0` | Met | - |
| AC-004 | REQ-003 | Given a Pi session whose recorded folder is a packet's `scratch` subfolder, When it compacts, Then the recovery prints that packet's purpose | E17 test in T029. Observed: `history-locator-adapters.vitest.ts (20 tests)` passed, including `walks up from a packet subfolder to the packet purpose` | Met | - |
| AC-005 | REQ-004 | Given a stale brief that names a packet and no pinned folder, When a Claude compaction recovers, Then no purpose from that packet is printed | E15 edit eleven test in T029. Observed: `hook-session-start.vitest.ts (29 tests)` passed, including `takes no purpose from the folder a stale brief names` | Met | - |
| AC-006 | REQ-005 | Given transcript lines citing `spec.md:12` and `spec.md:40:3`, When the folder detector runs, Then it returns the packet folder | E16 test in T029. Observed: `hook-precompact.vitest.ts (19 tests)` passed, including `counts a path with a line suffix toward its folder` | Met | - |
| AC-007 | REQ-006 | Given the session-start suite, When it runs, Then it makes no folder in the repository | T018 count of `process.cwd()` is 1 and T036 lists no `.tmp-session-prime-` folder. Observed: 1, and no such folder | Met | - |
| AC-008 | REQ-007 | Given a lead-in, bold markers, a bell character and an astral character at the cut, When the reader runs, Then the line reads whole and clean | E14 tests in T029. Observed: the lead-in, bold, control-character and surrogate-cut tests passed | Met | - |
| AC-009 | REQ-008 | Given the Pi hook, When its helper import fails, Then it writes a `WARN [speckit-hook:session-compact-context]` line, and it declares no local purpose type | T015 counts and T033 typecheck. Observed: `type PacketPurpose =` counts nothing, `packet purpose unavailable` counts 1 and typecheck exits 0 | Met | - |
| AC-010 | REQ-009 | Given phases 006 to 011, When their docs are read, Then each `goal.md` says `completion_pct: 100` and no summary names a pre-merge next action | T035 output. Observed: no `goal.md` in phases 006 to 011 holds `completion_pct: 100`, and all six summaries read `None. The phase is built and merged` | Met | - |
| AC-011 | REQ-010 | Given the edits, When the runtime typechecks, lints and builds and the continuity and mirror checks run, Then each prints its baseline value | T028, T032, T033 and T034 output. Observed: build exit 0, typecheck exit 0, eslint exit 0 after the `join` import fix, continuity 42 and 1, 256 mirrors and three prompt syncs at 45 | Met | - |

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

Yes.
<!-- /ANCHOR:closure -->
