---
title: "Acceptance Criteria: Phase 2: embedding-population"
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
    packet_pointer: "system-skill-advisor/023-semantic-lane-enablement/002-embedding-population"
    last_updated_at: "2026-09-03T00:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the acceptance criteria for this phase"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-023-002-embedding-population"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: embedding-population

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skill-advisor/023-semantic-lane-enablement/002-embedding-population
**Level:** 2
**Status:** Draft
**Date:** 2026-09-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the five uncovered nodes, When the refresh is run against a copy, Then the skip is reproduced and its code path is named | `research/population.md` names a file and a line, and the copied run reproduces the same five skips | Unmet | - |
| AC-002 | REQ-002 | Given a completed refresh, When the table is counted, Then every skill node has a row | `select (select count(*) from skill_nodes) - (select count(*) from vec_768);` returns 0 | Unmet | - |
| AC-003 | REQ-003 | Given the run, When its network use is inspected, Then every embed request went to the local backend | The run log names the local endpoint and the model, and no remote provider appears | Unmet | - |
| AC-004 | REQ-004 | Given an unchanged corpus of descriptions, When the refresh runs a second time, Then it embeds nothing | The second run reports `embedded: 0` and the row timestamps do not move | Unmet | - |
| AC-005 | REQ-005 | Given a stopped backend, When the refresh runs against a copy, Then existing rows survive and the run reports an outage | The row count on the copy is unchanged and the result carries an outage warning | Unmet | - |
| AC-006 | REQ-006 | Given a node with no vector, When the suite runs, Then it fails | A deliberately deleted row makes `tests/skill-graph/refresh-roundtrip.vitest.ts` exit non-zero | Unmet | - |
| AC-007 | REQ-002 | Given full coverage, When the frozen 180-row corpus is re-measured at the unchanged weight, Then the result is recorded | `research/population.md` carries the new Gate B count beside the 8 of 172 it started from | Unmet | - |

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

Nothing has run yet. This phase closes when every hub carries a current vector, the reason the
five were missing is written down, and the corpus has been re-measured at the unchanged weight so
the effect of coverage is separated from the effect of any later weight change.
<!-- /ANCHOR:closure -->
