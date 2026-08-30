---
title: "Acceptance Criteria: Phase 2: Orphan Daemon Reaping"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/045-daemon-and-test-harness-hardening/002-orphan-daemon-reaping"
    last_updated_at: "2026-08-30T09:56:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files:
      - ".opencode/bin/system-spec-memory-launcher.cjs"
      - ".opencode/bin/lib/model-server-supervision.cjs"
      - ".opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-orphan-daemon-reaping"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: Phase 2: Orphan Daemon Reaping

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/045-daemon-and-test-harness-hardening/002-orphan-daemon-reaping
**Level:** 2
**Status:** Draft
**Date:** 2026-08-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a running launcher, When its stdio peer closes, Then the launcher exits | stdin close triggers shutdown; fixture verified | Met | - |
| AC-002 | REQ-002 | Given a launcher whose child is already dead, When it is reparented to init, Then it terminates within one heartbeat interval | reparented fixture terminates on the existing heartbeat | Met | - |
| AC-003 | REQ-003 | Given a respawn lock naming an orphaned pid, When another session evaluates staleness, Then the lock is reclaimable | orphan-held lock reclaimed; `lockReleased:true` | Met | - |
| AC-004 | REQ-004 | Given an orphan the launcher failed to clear, When the sweep runs, Then it terminates that process and only that process | `appliedPids:[24912]` — that fixture only, `orphanSurvived:false` | Met | - |
| AC-005 | REQ-005 | Given the chosen lifecycle event, When it fires, Then the sweep is invoked | session-start trigger fires the sweep from the cleanup plugin | Met | - |
| AC-006 | REQ-004 | Given a launcher with a live parent, When the sweep runs, Then it is never signalled | live parent -> `appliedPids:[]`, `signals:[]`; connected peer -> no signal | Met | - |
| AC-007 | REQ-006 | Given a shipped apply path, When `ops/README.md` is read, Then it no longer states that none exists | README now documents an ownership-checked apply sweep | Met | - |
| AC-008 | REQ-007 | Given the autonomous sweep, When its kill switch is set, Then no process is signalled and the reason is reported | kill switch -> `reason:"kill-switch-disabled"`, orphan alive, lock retained | Met | - |

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

[Write this when the packet is closed, not before. AC-006 is the row to watch: this phase's failure mode is terminating a working session's daemon, which is worse than the leak it fixes.]
<!-- /ANCHOR:closure -->
