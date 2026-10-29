---
title: "Acceptance Criteria: Phase 1: deep-research"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "skill router files research acceptance criteria"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/001-deep-research"
    last_updated_at: "2026-10-29T09:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Merged both lineages into research.md and checked the citations"
    next_safe_action: "Scope phases 002 to 006 from the findings"
    blockers: []
    key_files:
      - "specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/001-deep-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-router-files-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: deep-research

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 001-deep-research
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
| AC-001 | REQ-001 | Given the Luna lineage, When it runs on `gpt-6-luna` through cli-codex, Then three iteration files exist and the ledger ends `completed` | `research/lineages/luna/iterations/iteration-001.md` to `-003.md`; `research/observability-events.jsonl` | Met | - |
| AC-002 | REQ-002 | Given both lineages, When the synthesis is written, Then RQ-1 to RQ-6 each have an answer with cited lines or an UNKNOWN mark | `research/research.md` sections 4 to 9 and 12 | Met | - |
| AC-003 | REQ-002 | Given the load-bearing claims, When their cited lines are read, Then each matches | Hermes generator writes only SKILL.md; replay fallback; RS-004 in `package_skill.py`; advisor and plugin signatures probe two files | Met | - |
| AC-004 | REQ-003 | Given the findings, When the synthesis recommends a design, Then it names one design and what would change it | `research/research.md` sections 10, 11 and 12 | Met | - |
| AC-005 | REQ-001 | Given the operator's extra request, When one DeepSeek iteration runs on RQ-6, Then its iteration file exists and the merge counts two lineages | `research/lineages/deepseek/iterations/iteration-001.md`; `fanout-merge.cjs` printed `merged_lineages: 2` | Met | - |

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
