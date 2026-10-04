---
title: "Acceptance Criteria: Phase 1: okf-deep-research"
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
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/001-okf-deep-research"
    last_updated_at: "2026-10-04T05:36:11Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: okf-deep-research

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/050-open-knowledge-format-adoption/001-okf-deep-research
**Level:** 2
**Status:** Complete
**Date:** 2026-10-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the loop is configured with the `cli-pi` executor, When it runs, Then each iteration record names `opencode-go/deepseek-v4.1-flash` at max effort (or the documented Cline fallback) | `research/lineages/deepseek-flash-max/invocation-metadata.json:1` (kind cli-pi, model opencode-go/deepseek-v4.1-flash, reasoningEffort max) | Met | - |
| AC-002 | REQ-001 | Given the run ends, When the state log is read, Then it holds ten completed iterations | `research/lineages/deepseek-flash-max/deep-research-state.jsonl:11` (iteration records on lines 2 to 11; their timestamps are invented, see implementation-summary.md) | Met | - |
| AC-003 | REQ-002 | Given the charter lists ten focuses, When the iteration files are read, Then each focus is covered and each claim carries a `file:line` or URL | `research/lineages/deepseek-flash-max/iterations/iteration-001.md:1` and `research/lineages/deepseek-flash-max/iterations/iteration-010.md:1`; 228 of 233 citations resolved by script, cited lines read for content | Met | - |
| AC-004 | REQ-003 | Given agents may search the web, When `research.md` is read, Then at least five non-seed sources are recorded with URL and contribution | `research/research.md:87` (11 sources) and `research/lineages/deepseek-flash-max/deep-research-dashboard.md:15` (16 non-seed); 7 of 7 URLs returned 200 | Met | - |
| AC-005 | REQ-004 | Given the orchestrator reviews each return, When `implementation-summary.md` is read, Then it lists citations opened and the verdict per iteration | `implementation-summary.md:1` | Met | - |
| AC-006 | REQ-002 | Given the research is complete, When `research.md` is read, Then every recommendation is marked adopt, adapt or reject with evidence | `research/research.md:13` (R1 to R8) and `research/research.md:152` (revised list after review) | Met | - |

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

All six criteria are met. Two things were consciously left out: the run's state files were hand-written by the child with invented timestamps and an unusable findings registry, and were not regenerated; and the R1 and R2 disagreement between the lineage and the reviewer is handed to phase 002 unresolved.
<!-- /ANCHOR:closure -->
