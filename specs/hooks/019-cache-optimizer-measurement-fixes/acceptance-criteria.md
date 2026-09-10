---
title: "Acceptance Criteria: cache optimizer measurement and pricing fixes"
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
    packet_pointer: "hooks/019-cache-optimizer-measurement-fixes"
    last_updated_at: "2026-09-09T12:46:42Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: cache optimizer measurement and pricing fixes

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** [PACKET-ID]
**Level:** [2/3/3+]
**Status:** [Draft/In Progress/Complete]
**Date:** 2026-09-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a response with input tokens and no cache fields, when it is recorded, then cost and tokens record and the hit ratio excludes it | `{input:500}` → `unmeasuredRequests +1`, `totalInputTokens +500`, cost recorded, `hitRequests` and measured denominator unchanged | Met | - |
| AC-002 | REQ-002 | Given defined all-zero usage, when it is recorded, then the same rule applies | Explicit `{cacheRead:0,cacheWrite:0,totalInput:500}` counts as one measured miss, not unmeasured | Met | - |
| AC-003 | REQ-003 | Given an authoritative zero cached-read rate, when pricing resolves, then it prices as free | Zero prices; missing and negative stay unpriced; `readModelInputPricing` tested apart from the registry fallback | Met | - |
| AC-004 | REQ-004 | Given a record written before this work, when it loads, then no counter is lost and nothing crashes | A pre-change record loads; the new counter defaults to 0 | Met | - |
| AC-005 | REQ-005 | Given a model declaring it does not report cache usage, when it is recorded, then it routes to unmeasured | Declaring model → unmeasured; unset flag changes nothing | Met | - |
| AC-006 | REQ-006 | Given a candidate prefix, when it has been seen once, then it is not lifted until seen unchanged again | A/A/B/B: no lift on 1, lift on 2; session and model isolation hold; reset clears | Waived | ADR-001 |
| AC-007 | REQ-007 | Given a learned key rejection, when the process restarts, then it is remembered | After a matching 400 and restart, the next request omits the key without a second 400 | Met | - |

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

**Closeable: yes.** Six of the seven rows are `Met` against observed command output. AC-006 is `Waived` against ADR-001, because the work it described was reverted: a controlled
experiment showed the prefix is already byte-identical from the first turn, so the gate it specified
prevented nothing while introducing a break between turns one and two. A criterion for work that no
longer exists cannot be satisfied, and recording it as met would be false.

Every other requirement is closed by a test that fails when its change is neutralised, and the
pricing, capability-flag and migration paths are additionally confirmed against live provider
traffic.

<!-- /ANCHOR:closure -->
