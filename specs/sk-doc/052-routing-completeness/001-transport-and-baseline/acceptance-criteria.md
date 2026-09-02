---
title: "Acceptance Criteria: Phase 1: transport-and-baseline"
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
    packet_pointer: "sk-doc/052-routing-completeness/001-transport-and-baseline"
    last_updated_at: "2026-09-02T19:56:10Z"
    last_updated_by: "claude-code"
    recent_action: "Re-ran each criterion and recorded the observed output"
    next_safe_action: "None; every criterion is Met"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-001-transport-and-baseline"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: transport-and-baseline

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/052-routing-completeness/001-transport-and-baseline
**Level:** 3
**Status:** Complete
**Date:** 2026-09-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|---|---|---|---|---|---|
| AC-001 | REQ-001 | Given two scorers answer routing, When the dispatch chain is read end to end, Then one is named as the governing caller | Re-run 2026-09-02: `grep -rn "skill_advisor.py" .opencode/skills/system-skill-advisor/hooks/lib/` exits 1 with no output, and `mcp-server/handlers/advisor-recommend.ts:13` imports `scoreAdvisorPrompt` from `../lib/scorer/fusion.js`. The handler's only fallback is `hooks/lib/skill-advisor-cli-fallback.ts`, a daemon transport | Met | |
| AC-002 | REQ-002 | Given a confidence of 0.8200, When surfaced replies are measured, Then the same value returns as a floor and the score differs underneath it | Re-run 2026-09-02 over the 381 declared signals: 555 recommendations, minimum confidence exactly 0.82, maximum 0.95, 166 rows sitting exactly at 0.8200, and the lowest score among those floor rows 0.10213. The originally cited prompt `refactor the auth module` now returns an empty recommendations array, since `08eb67a0de` changed the vocabulary underneath it | Met | |
| AC-003 | REQ-003 | Given a ranking question, When the comparator is read, Then score alone is shown not to be the sort key | Re-run 2026-09-02: `fusion.ts:749` is `let ranked = recommendations.sort(...)`, and the comparator adds command, intent and conflict adjustments to `score` before falling through to rank fusion | Met | |

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

AC-001 carried the packet: the governing transport is named by a read of the dispatch chain
rather than by comparing outputs, so every later number in this packet has one caller behind
it. Reconciling the two scorers was consciously left out, because changing a scorer would
void every measurement taken here.
<!-- /ANCHOR:closure -->
