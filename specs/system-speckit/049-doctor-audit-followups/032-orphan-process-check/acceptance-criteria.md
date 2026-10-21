---
title: "Acceptance Criteria: Phase 32: orphan-process-check"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "orphan process check acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/032-orphan-process-check"
    last_updated_at: "2026-10-21T13:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Marked AC-002 to AC-005 Met, AC-001 superseded by ADR-001"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-032-orphan-process-check"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 32: orphan-process-check

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 032-orphan-process-check
**Level:** 2
**Status:** Complete
**Date:** 2026-10-21
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 2026-10-21 fixture, When the scan runs, Then it lists the 22 orphans with PID, age, RSS and command, and no allowlisted daemon | superseded: the 2026-10-21 table was never saved as raw `ps` output | Superseded | ADR-001 |
| AC-002 | REQ-002 | Given a listed PID whose command line changed, When `--reap` runs, Then it is skipped with a reason, and nothing is signalled without confirmation | `.skilled/commands/doctor/scripts/tests/orphan-process-check.test.cjs:287` (command changed), `.skilled/commands/doctor/scripts/tests/orphan-process-check.test.cjs:331` (age differs, so the PID was reused), `.skilled/commands/doctor/scripts/tests/orphan-process-check.test.cjs:350` (uid changed), `.skilled/commands/doctor/scripts/tests/orphan-process-check.test.cjs:271` (no `--yes`, nothing signalled); disabling the age or the uid guard fails a test; live: `--reap` alone left an orphaned `tail -F` running, `--reap --yes` killed it, also under `LC_ALL=fr_FR.UTF-8` | Met | - |
| AC-003 | REQ-003 | Given `/doctor:setup`, When it runs, Then one informational orphan line appears and the command exit status is unchanged | `.skilled/commands/doctor/scripts/tests/doctor-setup-orphan-line.test.cjs:26` asserts the informational step in `doctor-setup.yaml` and the orphan line in `doctor-setup-presentation.txt`, each saying the status never changes; doctor suite 422 passed, 0 failed | Met | - |
| AC-004 | REQ-004 | Given Linux `ps` output, When the scan runs, Then ages and RSS parse the same as on macOS | `.skilled/commands/doctor/scripts/tests/orphan-process-check.test.cjs:149` (Linux and macOS spacing), `.skilled/commands/doctor/scripts/tests/orphan-process-check.test.cjs:142` (all three etime forms); every `ps` call runs with `LC_ALL=C` | Met | - |
| AC-005 | REQ-001 | Given fixture rows for every helper kind plus a live daemon, a stale launcher, a young row, a non-orphan and another user's row, When the scan runs, Then it lists exactly the helper orphans with PID, age, RSS and command; and on this machine a deliberately orphaned `tail -F` is listed | `.skilled/commands/doctor/scripts/tests/orphan-process-check.test.cjs:160`, `.skilled/commands/doctor/scripts/tests/orphan-process-check.test.cjs:197`, `.skilled/commands/doctor/scripts/tests/orphan-process-check.test.cjs:215`; live run 2026-10-21: `--min-age-min 0` listed `tail-monitor 1.2 MB`, and the default scan printed `orphans: none` in 0.13 s | Met | - |

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

The tests and a live orphan carried the phase. AC-001 was superseded by ADR-001, because the 2026-10-21 process table was never saved.
<!-- /ANCHOR:closure -->
