---
title: "Acceptance Criteria: Capture Folders out of the Containment Snapshot"
description: "The criteria this packet must satisfy before it may be closed, covering the snapshot guard, the detection guard, the untracked captures and the live worktree removal proof."
trigger_phrases:
  - "containment capture snapshot"
  - "capture folders untracked"
  - "worktree remove path limit"
  - "capture folders detection"
  - "readme verdict parity"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot"
    last_updated_at: "2026-09-23T20:30:00Z"
    last_updated_by: "cli-pi-mimo-v2.6-pro"
    recent_action: "Closed the packet with every acceptance criterion met"
    next_safe_action: "None. The packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-021-capture-folders-out-of-snapshot"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Capture Folders out of the Containment Snapshot

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot
**Level:** 2
**Status:** Complete
**Date:** 2026-09-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a fan-out snapshot with capture folders an earlier run left in the tree, When the snapshot loop runs in write-containment.ts, Then the snapshot never copies a capture folder into the containment baseline | write-containment.vitest.ts ran the new snapshot test in the baseline content capture group and reported 79 passed. Anchor: .skilled/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:334. | Met | - |
| AC-002 | REQ-002 | Given capture folders an earlier run left in the tree, When the detection forward loop runs in write-containment.ts, Then detection never reports an earlier run capture as a new violation | write-containment.vitest.ts ran the new detection test in the baseline content capture group and reported 79 passed. Anchor: .skilled/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:351. | Met | - |
| AC-003 | REQ-003 | Given the capture output under the containment baseline and quarantine dirs, When git ls-files runs under both capture kinds, Then no capture output is tracked and both capture kinds are ignored through the two .gitignore patterns | git ls-files under both capture kinds reported 0 files and the longest tracked path went from 971 before to 353 after, rechecked after rebase. Anchor: .gitignore:369. | Met | - |
| AC-004 | REQ-004 | Given the fixed tree at the final HEAD, When a fresh worktree is added with git worktree add --detach and removed with plain git worktree remove, Then the removal exits 0 with the folder gone and no worktree entry left | The live removal proof reported both commands exit 0 on a worktree of 115,878 tracked files with the longest absolute path at 448 characters. Anchor: evidence/dispatch/evidence.md:58. | Met | - |
| AC-005 | REQ-005 | Given the sk-doc README verdict baseline after dropping the 246 capture READMEs from 1,304 entries to 1,058, When test_readme_verdict_parity.py runs, Then the baseline stays in parity | test_readme_verdict_parity.py reported PARITY PASS with 1,058 files and 0 diffs. Anchor: evidence/dispatch/evidence.md:57. | Met | - |
| AC-006 | REQ-006 | Given the two new tests in write-containment.vitest.ts, When each test runs before and after its guard, Then each guard has a test that failed before it and passes after it | Both new tests were red before their guard and pass after it, and the six containment-related test files reported 395 passed and 1 skipped. Anchor: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:956. | Met | - |

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

Every criterion is met and no row needed a waiver.
<!-- /ANCHOR:closure -->
