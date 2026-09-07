---
title: "Acceptance Criteria: Phase 1: shadcn-reference-research"
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
    packet_pointer: "scaffold/013-shadcn-reference-research"
    last_updated_at: "2026-09-07T12:45:40Z"
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
# Acceptance Criteria: Phase 1: shadcn-reference-research

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** [PACKET-ID]
**Level:** [2/3/3+]
**Status:** Complete
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the frozen corpus and the shipped corpus, When the lineage finishes, Then six angle sections exist, each with cited claims | `research/lineages/luna/research.md:5`, `:20`, `:36`, `:53`, `:75`, `:90` are the six angle headings; `research/lineages/luna/iterations/` holds six files | Met | - |
| AC-002 | REQ-002 | Given the findings, When the synthesis is read, Then each decision is tagged implementable today or needs a corpus change and each shadcn decision has a verdict | `research/lineages/luna/research.md:119` opens the Final Synthesis; `:127` ranks the recommendations with their tags; `:144` lists the eliminated alternatives with reasons | Met | - |
| AC-003 | REQ-003 | Given the research ran, When the chart skill is diffed, Then no template or checker rule changed | `git log -- .opencode/skills/sk-design/sk-design-chart` shows no commit from this phase; `check-corpus.cjs` prints RESULT: PASSED, recorded at `research/lineages/luna/research.md:92` | Met | - |
| AC-004 | REQ-004 | Given both palettes, When angle 4 reports, Then it reports measured hue gaps, contrast on both grounds and CVD separation | `research/lineages/luna/research.md:59` and `:61` tabulate shadcn light 16.0 degrees and 1.72:1 against standalone categorical 92.9 degrees and 3.37:1 | Met | - |
| AC-005 | REQ-005 | Given no browser was available, When angles 3 and 6 report runtime behaviour, Then they mark it unknown | `research/lineages/luna/research.md:44` and `:142` state the browser inventory was empty and mark runtime behaviour unverified | Met | - |

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

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
