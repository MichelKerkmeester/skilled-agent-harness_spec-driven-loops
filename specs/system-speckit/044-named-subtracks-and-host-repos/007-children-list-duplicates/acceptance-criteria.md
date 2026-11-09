---
title: "Acceptance Criteria: Phase 7: children-list-duplicates"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "children list duplicates acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/044-named-subtracks-and-host-repos/007-children-list-duplicates"
    last_updated_at: "2026-11-09T20:40:00Z"
    last_updated_by: "claude"
    recent_action: "Met every criterion with observed command evidence"
    next_safe_action: "Commit the worktree changes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-children-list-duplicates"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 7: children-list-duplicates

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `system-speckit/044-named-subtracks-and-host-repos/007-children-list-duplicates`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a track whose `children_ids` names one packet twice, When `sweep-track-roots.mjs` runs over it, Then it prints `    declared more than once: <name>` and exits 1 | `.skilled/skills/system-spec-kit/runtime/cli/tests/track-roots.vitest.ts:203`, `reports a packet declared more than once`, passes under `npx vitest run tests/track-roots.vitest.ts --config ../../vitest.config.ts --project cli` from `.skilled/skills/system-spec-kit/runtime/cli` | Met | - |
| AC-002 | REQ-002 | Given that track, When `refresh-track-roots.mjs --apply` runs, Then `children_ids` names each packet once and the sweep then exits 0 | `.skilled/skills/system-spec-kit/runtime/cli/tests/track-roots.vitest.ts:272`, `drops a repeated entry on --apply and leaves the sweep clean`, passes under the same command | Met | - |
| AC-003 | REQ-003 | Given an unsorted `children_ids` that names each packet exactly once, When the sweep and the writer dry run run, Then the sweep exits 0 and the writer prints `up to date` | A fixture under `scratch/` with two packets listed in reverse order: the sweep printed `demo: declared=2 actual=2` and exited 0, and the writer dry run printed `demo: up to date` and exited 0 | Met | - |
| AC-004 | REQ-004 | Given the 25 existing track-root tests left unchanged, When the test file runs, Then it reports 28 passed of 28 | `npx vitest run tests/track-roots.vitest.ts --config ../../vitest.config.ts --project cli` from `.skilled/skills/system-spec-kit/runtime/cli` printed `Tests 28 passed (28)` and exited 0 | Met | - |
| AC-005 | REQ-005 | Given the fixed writer ran with `--apply` over `barter/ai-speckit/specs`, When the sweep runs over that folder at the working tree, Then it prints no `declared more than once` line | `node .skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs --specs barter/ai-speckit/specs` printed no such line and printed `backend-system/partners-billing: declared=11 actual=11` | Met | - |
| AC-006 | REQ-006 | Given `specs/skilled-barter-overlays/` in the Barter host carries `description.json` and `graph-metadata.json`, When the sweep runs, Then it prints `skilled-barter-overlays: declared=4 actual=4` | The same sweep printed `skilled-barter-overlays: declared=4 actual=4` | Met | - |

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

Every criterion is met with observed command output, and nothing was waived.
<!-- /ANCHOR:closure -->
