---
title: "Acceptance Criteria: Phase 2: consume-locked-withdraw"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "consume locked withdraw acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/033-research-remediation/002-consume-locked-withdraw"
    last_updated_at: "2026-10-25T17:00:00Z"
    last_updated_by: "builder-002"
    recent_action: "Met all five criteria with test evidence"
    next_safe_action: "Orchestrator commits the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "builder-002-consume-locked-withdraw"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: consume-locked-withdraw

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/033-research-remediation/002-consume-locked-withdraw
**Level:** 2
**Status:** Complete
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-002 | **Given** a record disarmed with a withdrawn reason, **When** `consume` runs, **Then** its JSON holds `withdrawn: true` and the record file is gone | CLI test in `session-relaunch-cli.test.cjs`, red before the change. Evidence: "consume reports withdrawn for a record cancelled before it" and "... user-message before it" failed on the unchanged code with the `withdrawn` key missing, and "consume reads the record under the same lock as its unlink" failed with `lockHeld: false` (`scratch/red-before-full-suite.txt:638`); all three pass after (`scratch/green-after-full-suite.txt:642`). Tests at `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:1676` and `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:1701` | Met | - |
| AC-002 | REQ-003 | **Given** an armed record, **When** consume runs, **Then** the output has no `withdrawn` key and the exact-shape tests pass with unedited expectations | `session-relaunch-cli.test.cjs`. Evidence: "consume output has no withdrawn key for an armed record or another disarm reason" passes before and after; the exact-shape consume tests pass and `git diff --numstat` on the test file shows 69 added, 0 removed. Test at `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:1729` | Met | - |
| AC-003 | REQ-004 | **Given** the wrapper got `relaunch: true` and the record is withdrawn before consume (test barrier or stub), **When** the wrapper continues, **Then** it prints the withdrawn warning, starts no second runtime and exits with the runtime's code | `skilled-loop.test.cjs`. Evidence: "a withdraw between approval and consume declines with the runtime exit code" uses a node stub that runs the real `cancel` right before consume. Before the change the runtime started twice (actual 2, expected 1); after, one runtime, exit 7, the withdrawn warning, no claim command. Test at `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:2729` | Met | - |
| AC-004 | REQ-005 | **Given** that withdrawn decline, **When** the hop history is read, **Then** it holds no `handed-over` line | Test on the history file. Evidence: the same test asserts `handOverLines(sandbox)` is empty, read from `hop-history.log`, and passes. Assertion at `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:2749` | Met | - |
| AC-005 | REQ-004 | **Given** a withdrawn record on the Ctrl-C path (runtime exit 130, not signalled), **When** consume runs, **Then** no claim command prints | `skilled-loop.test.cjs`. Evidence: "a withdrawn record on the Ctrl-C path prints no claim command" failed before the change (no withdrawn warning) and passes after: exit 130, the withdrawn warning, no `skilled-loop ` line. Test at `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:2752` | Met | - |

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

Every row is Met with evidence observed in this build. The full relaunch suite has three failing `readClaudeSettings` tests in `context-usage.test.cjs`; they belong to the concurrent phase 001 follow-up and exercise code this phase does not touch.
<!-- /ANCHOR:closure -->
