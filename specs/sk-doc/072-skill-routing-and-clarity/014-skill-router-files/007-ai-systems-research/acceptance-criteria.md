---
title: "Acceptance Criteria: Phase 7: ai-systems-research"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "ai systems research acceptance criteria"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/007-ai-systems-research"
    last_updated_at: "2026-10-29T12:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Merged the lineage into research.md and checked the citations in the AI Systems checkout"
    next_safe_action: "Scope phase 008 from the findings"
    blockers: []
    key_files:
      - "specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/007-ai-systems-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0271-ai-systems-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 7: ai-systems-research

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 007-ai-systems-research
**Level:** 2
**Status:** Complete
**Date:** 2026-10-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the DeepSeek lineage, When it runs on `deepseek-v4.1-flash-1017` through cli-pi, Then three iteration files exist and the run ends `completed` | `research/lineages/deepseek/iterations/iteration-001.md` to `-003.md`; `research/observability-events.jsonl` records the run `completed` | Met | - |
| AC-002 | REQ-002 | Given the synthesis, When it is written, Then RQ-1 to RQ-5 each have an answer covering all 16 skills, with cited lines or an unconfirmed mark | `research/research.md` sections 6 to 10; the RQ-1 table has 16 rows | Met | - |
| AC-003 | REQ-002 | Given the load-bearing claims, When their cited lines are read in the AI Systems checkout, Then each matches | `research/research.md` "Verification by the conductor"; one line number corrected | Met | - |
| AC-004 | REQ-003 | Given the Claude Project question, When the synthesis recommends a way, Then it names one and says why the others lose | `research/research.md` section 10.2 | Met | - |
| AC-005 | REQ-002 | Given the 16 skills, When the synthesis designs the move, Then each has a target shape | `research/research.md` section 10.1 | Met | - |

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

Every criterion is met with observed evidence.
<!-- /ANCHOR:closure -->
