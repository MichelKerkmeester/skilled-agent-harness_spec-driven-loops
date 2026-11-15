---
title: "Acceptance Criteria: Phase 1: pi-opencode-history-lookup"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "pi opencode history lookup acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/002-session-handover-loop/048-cross-runtime-handover-parity-fixes/001-pi-opencode-history-lookup"
    last_updated_at: "2026-11-15T19:49:21Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-pi-opencode-history-lookup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: pi-opencode-history-lookup

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `001-pi-opencode-history-lookup`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a Pi session file for id S in the note folder, When `claim` runs on that note, Then it prints `## History Lookup` and the printed command exits 0 with the sender's turns | A claim test that runs the printed command; it fails with the Pi branch removed. Observed: the Pi redeem test passes, the printed command finds `probe-ok`, and it fails with the branch forced off. Live: `../scratch/runs/live1-pi` printed the section and its command returned the sender's turns | Met | - |
| AC-002 | REQ-002 | Given an OpenCode store whose session row for id S records the note folder, When `claim` runs, Then it prints `## History Lookup` and the printed command exits 0 with the sender's turns | A claim test that runs the printed command; it fails with the OpenCode branch removed. Observed: the OpenCode redeem test passes and fails with the branch forced off. Live: in `../scratch/runs/live1-opencode` the receiver loaded the side word through the lookup | Met | - |
| AC-003 | REQ-003 | Given the baseline count, When `node --test .skilled/hooks/session-handover/tests/*.test.cjs` runs, Then 0 fail and no Claude, Codex or Vibe expectation was edited | Suite summary line and `git diff --stat` of the tests. Observed: `tests 1039`, `pass 1039`, `fail 0`. The phase only adds tests to `session-handover-cli.test.cjs` | Met | - |
| AC-004 | REQ-004 | Given a Pi or OpenCode note whose session the reader cannot find, When `claim` runs, Then no `## History Lookup` prints | Claim tests for a missing session on each runtime. Observed: four refusal tests (missing session and another folder, on each runtime) pass, and all four fail with the reader check dropped | Met | - |

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
