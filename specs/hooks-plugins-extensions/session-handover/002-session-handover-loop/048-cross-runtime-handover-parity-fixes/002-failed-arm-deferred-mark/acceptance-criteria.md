---
title: "Acceptance Criteria: Phase 2: failed-arm-deferred-mark"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "failed arm deferred mark acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/002-session-handover-loop/048-cross-runtime-handover-parity-fixes/002-failed-arm-deferred-mark"
    last_updated_at: "2026-11-15T19:49:25Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-failed-arm-deferred-mark"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: failed-arm-deferred-mark

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `002-failed-arm-deferred-mark`
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
| AC-001 | REQ-001 | Given a pending Codex record, When Stop runs with no transcript path, no session process or an arm that throws, Then the record stays pending with `deferredAt` set | Three `codex-adapters.test.cjs` cases, each failing with its mark removed. Observed: three branch tests pass, and four tests fail with the marks removed: the three branch tests and the Codex conformance row | Met | - |
| AC-002 | REQ-002 | Given a pending Pi or OpenCode record, When `arm` throws at the turn end, Then the record stays pending with `deferredAt` set | A Pi suite case and an OpenCode case, each failing with its mark removed. Observed: the Pi `agent_settled marks the pending record deferred when arming throws` test and the OpenCode `session.idle marks the pending record deferred when arming throws` test pass, and each fails with its mark removed | Met | - |
| AC-003 | REQ-003 | Given a deferred record and separately a fresh pending record, When an operator prompt reaches Codex, Pi or OpenCode, Then the deferred one is withdrawn and the fresh one stays pending | Withdraw cases per runtime; each fails with `pending: 'none'` restored. Observed: the deferred-withdraw test on each runtime passes and fails with `pending: 'none'` restored. A fresh pending record stays pending on all three | Met | - |
| AC-004 | REQ-004 | Given the baseline count, When the handover and Pi suites run, Then 0 fail and no Claude or Vibe expectation was edited | Suite summary lines. Observed: handover `tests 1039`, `fail 0`; Pi vitest `69 passed`. No Claude or Vibe expectation changed. The Codex conformance row now expects the deferral stamp, because Codex stamps now | Met | - |
| AC-005 | REQ-005 | Given a failed Codex Stop, When the hook writes its output, Then one `systemMessage` line names the cause and says the next prompt withdraws the hand-over | A `codex-adapters.test.cjs` case reading the hook output. Observed: the codex-adapters tests read one `systemMessage` per failed branch naming its cause. After the review, the text says the next prompt withdraws the hand-over and a later nudge asks for a new one | Met | - |

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
