---
title: "Acceptance Criteria: Phase 12: hook-guards-and-audit-log"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "hook guards and audit log acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research/012-hook-guards-and-audit-log"
    last_updated_at: "2026-11-09T12:00:00Z"
    last_updated_by: "remediation-orchestrator-b"
    recent_action: "Recorded acceptance evidence"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-09-047-remediation-b"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 12: hook-guards-and-audit-log

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `012-hook-guards-and-audit-log`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a Stop hook spawned with stdin held open, When the deadline passes, Then it exits 0 with no block decision | `ask-surface-stop.test.mjs` 8/8 and `advisory-stop.test.mjs` 6/6; reviewer saw exit at about 3.0 s | Met | - |
| AC-002 | REQ-002 | Given the fixture suite, When it runs, Then `prose-menu-dotted` and `prose-menu-ten` fire and `howto-list-question` and every older negative fixture do not | `ask-surface-core.test.mjs` 20/0 | Met | - |
| AC-003 | REQ-003 | Given OpenCode or dsh after one send-back, When the agent repeats a menu with no new operator message, Then the guard does not fire again | `ask-surface-guard.test.cjs` 5/0 including the appended-reprompt case; `dsh-ask-surface-guard.test.mjs` 8/0 | Met | - |
| AC-004 | REQ-004 | Given a nested folder of a git repository as the working directory, When a dispatch is audited, Then the log is `<top-level>/.skilled/logs/cli-dispatch-audit.log` | `dispatch-audit.test.mjs` resolveAuditLogPath cases pass in the hooks vitest run (417/0) | Met | - |
| AC-005 | REQ-005 | Given the hook baselines, When the suites rerun, Then no baseline pass is lost and the child-mode failure set is unchanged | plugins 572 to 574, node 228 to 235, vitest 415 to 417; child-mode failure list diff empty | Met | - |

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

Every criterion is Met with observed evidence.
<!-- /ANCHOR:closure -->
