---
title: "Acceptance Criteria: Give the shared-checkout churn detector a cumulative arm so slow drift trips it"
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
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/005-churn-cumulative-arm"
    last_updated_at: "2026-09-14T13:30:00Z"
    last_updated_by: "deepseek-v4.1-flash-max"
    recent_action: "Met every criterion and recorded its evidence"
    next_safe_action: "Close the phase once the commit lands"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-14-005-churn-cumulative-arm"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Give the shared-checkout churn detector a cumulative arm so slow drift trips it

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/005-churn-cumulative-arm
**Level:** 2
**Status:** Complete
**Date:** 2026-09-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a neighbour dirtying one new path per heartbeat, When the running total passes the cumulative threshold, Then the detector trips with no window above the per-window threshold | `fanout-run.vitest.ts:3145`; observed event `newly_dirty_paths: 1`, `cumulative_dirty_paths: 4`, `churn_cumulative_threshold: 3` | Met | - |
| AC-002 | REQ-002 | Given a fan-out config, When `containment.churnCumulativeThreshold` is omitted, zero, or an explicit positive integer, Then it reads as 12, 0 or that value, and a negative or fractional value is rejected | `executor-config.vitest.ts:470`; `executor-config.ts:706`, `:715` | Met | - |
| AC-003 | REQ-003 | Given a cumulative detection, When the run settles, Then preserve is latched, sampling stops, and the event carries both counts and both thresholds alongside every existing field | `fanout-run.vitest.ts:3145` (six tracked files keep the stub's bytes under a requested restore); `fanout-run.cjs:3722` | Met | - |
| AC-004 | REQ-004 | Given the burst-only detector, When the cumulative case runs, Then it fails, and it passes once the cumulative arm exists | `fanout-run.vitest.ts:3145`, red before the arm existed (`expected [] to have a length of 1 but got +0`) and green after, with both files exiting 0 at 237 passed | Met | - |
| AC-005 | REQ-001 | Given a burst in one window, When the next sample runs, Then the per-window arm still trips within that window | `fanout-run.vitest.ts:3114` (unchanged case, still green) | Met | - |

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

AC-001 and AC-003 carried the packet: the cumulative arm trips on a writer no single window can see, and the detection keeps the latch and the ledger contract it had. AC-005 guards the arm that was already there. Left out deliberately: a CLI flag for the new threshold, and any change to the per-window default.
<!-- /ANCHOR:closure -->
