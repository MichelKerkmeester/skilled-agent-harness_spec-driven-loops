---
title: "Acceptance Criteria: Perfect skill routing across the fleet: why an advertised phrase fails to arrive"
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
    packet_pointer: "specs/system-skill-advisor/024-routing-perfection-research"
    last_updated_at: "2026-09-07T09:40:00Z"
    last_updated_by: "implementation"
    recent_action: "Closed every criterion against observed command output"
    next_safe_action: "Decide the gated scorer tranche"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "024-routing-perfection-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Perfect skill routing across the fleet: why an advertised phrase fails to arrive

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `specs/system-skill-advisor/024-routing-perfection-research`
**Level:** 3
**Status:** Complete
**Date:** 2026-09-07

---

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a phrase absent from a hub's `intent_signals`, When it is added and the advisor rebuilt, Then that phrase routes to the hub, and reverting returns it to not routing | `corner radius`: nothing at generation 693, `sk-design` 0.8286 uncertainty 0.24 lane `explicit_author` at 694, nothing again after revert. Control `font size`, same router line, untouched, stayed dead throughout | Met | - |
| AC-002 | REQ-002 | Given the advisor binary is unreachable, When the reach check runs, Then it fails rather than reporting a pass | `ROUTER_REACH_ADVISOR=/nonexistent/advisor.cjs` gives `probe-error=77`, `RESULT: FAILED`, exit 1, against `declared=77 wrong-hub=0 no-reach=0 / RESULT: PASSED / exit 0` before | Met | - |
| AC-003 | REQ-003 | Given a declaring hub above the bar but ranked below another hub, When the reach check runs, Then that phrase is a failure | Predicate now `above.length > 0 && above[0].skillId === hub`; the whole-inventory run surfaced 18 `outranked` rows the old predicate passed | Met | - |
| AC-004 | REQ-004 | Given a hub with authored `intent_signals`, When the generator writes, Then no authored entry is lost and a re-run adds nothing | `sk-design` 159 entries retained, 23 appended; `--check` immediately after `--write` reports `missing=0`, `RESULT: PASSED` | Met | - |
| AC-005 | REQ-005 | Given `sk-design` failed six hub invariants, When they are closed, Then `parent-skill-check` passes and the three skipped checks execute | `OK: parent-skill-check — all hard invariants passed, 0 warnings`; `10b-byte-drift`, `10c-target-collision` and `10d-reachability` all report PASS where they previously reported `INFO: skipped` | Met | - |
| AC-006 | REQ-006 | Given the whole declared inventory, When measured before and after at named generations, Then the change is reported rather than sampled | 439 phrases, generation 698 → 704: wrong-hub 19→0, outranked 18→18, no-reach 136→2, probe-error 0 both times | Met | - |
| AC-007 | REQ-006 | Given the fix lands, When every fleet checker runs, Then none regresses | Six hubs `parent-skill-check` OK; root metadata 13/13; derived freshness 13/13; leaf-manifest freshness 13/13 | Met | - |
| AC-008 | - | Given the residual failures, When they are classified, Then each is attributed to a cause vocabulary cannot fix | 18 cross-hub ownership disputes, 10 of them the review verb resolving to `sk-code`; 2 no-reach (`dom inspect`, `show the full`). Arbitration is a scorer change, out of scope by ADR-001 | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`.

---

<!-- /ANCHOR:criteria -->

<!-- ANCHOR:closure -->
## 3. SCOPE BOUNDARY

The scorer itself is out of scope by decision, not by omission. Both remaining
work items — harvesting lexical evidence from the same candidate set the score is
computed over, and arbitrating a verb across hubs — change how every candidate in
the fleet scores. They need a measured before-and-after against the advisor's own
regression corpus and an operator decision, and neither is attempted here.


<!-- /ANCHOR:closure -->