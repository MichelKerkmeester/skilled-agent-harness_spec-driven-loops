---
title: "Acceptance Criteria: Catalog and contract corrections for the chart corpus"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "chart catalog acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/053-chart-visual-overhaul/006-catalog-and-contract"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded the observed evidence against every criterion"
    next_safe_action: "Run phase 007, which asserts every invariant this phase introduced"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/references/catalog.md"
      - ".opencode/skills/sk-doc/sk-create-chart/references/color-system.md"
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-006-catalog-and-contract"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No catalog row changes system, and the twenty-row reading is in the decision record"
      - "The sweep is permitted on three ordered forms and carried by progress-single alone"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Catalog and contract corrections for the chart corpus

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the phase may close. A phase is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in a decision record.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/053-chart-visual-overhaul/006-catalog-and-contract
**Level:** 2
**Status:** Complete
**Date:** 2026-09-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the catalog assigns a system per row, When all twenty rows are read against the colour document's definitions, Then every row carries a verdict, including the rows that do not change | `decision-record.md:67` carries a twenty-row table, one verdict per row, and names the seventeen that were never in doubt separately from the three that took work | Met | - |
| AC-002 | REQ-001 | Given `grouped-bars` compares two series across categories, When the re-check settles, Then its system matches what the colour document says colour encodes there | `catalog.md:46` and `grouped-bars.html:7` both print `neutral`. The reading that settles it is in ADR-001: the two series are ordered in time, which is the one property `categorical` requires and does not have, and `neutral` is the documented default that wins a tie | Met | - |
| AC-003 | REQ-001 | Given a reassignment changes a chart's colours, When the phase closes, Then the before and after pictures are both in the record | Superseded. No row was reassigned, so the criterion had no subject. The replacement is wider: all twenty forms rendered before and after under a pinned light scheme, nineteen byte-identical and one changed. The changed one is `progress-single` carrying the sweep, read by eye in both themes | Superseded | ADR-006 |
| AC-004 | REQ-002 | Given a data block holds nothing readable, When the form draws, Then it prints a notice rather than a blank frame | Twenty of twenty fire, the guard being `bar-rows.html:175` and its nineteen siblings. Each form was rendered with an empty fixture written for its own data shape, and the notice was read out of the figure region | Met | - |
| AC-005 | REQ-002 | Given a data block holds real values, When the form draws, Then the notice does not appear | Twenty of twenty stay silent on their shipped block, recorded at `implementation-summary.md:184`. The first proof run reported the notice present on all twenty, which was the proof script reading the inline source a `--dump-dom` run echoes back rather than the drawing. Scoped to the figure region, the answer is absent on every form | Met | - |
| AC-006 | REQ-002 | Given an array whose entries all carry values that are not finite numbers, When the form draws, Then the notice fires, because length alone is not readability | `bar-rows.html:175` given two rows whose values are `null` and `NaN` fires the notice. This fixture failed first and caught a real defect: the predicate coerced with `Number()` before testing, and `Number(null)` is zero | Met | - |
| AC-007 | REQ-003 | Given the catalog is machine-read in both directions, When the reassignments land, Then every row resolves to a file and every file has a row | `catalog: 41 assertion(s), 0 failure(s)`, unchanged from the baseline and recorded at `implementation-summary.md:176` | Met | - |
| AC-008 | REQ-004 | Given twenty-three files and three references were edited, When the corpus check runs with `--render` from the final state, Then it prints `RESULT: PASSED` | Redirected to a file and read from it, recorded at `implementation-summary.md:176`. 20 checks, 29 files, `Summary: errors: 0`, `RESULT: PASSED`, exit 0 | Met | - |
| AC-009 | REQ-005 | Given the corpus does not draw three forms the reference has, When the catalog is read, Then each is named with the reason it is absent | `catalog.md:149` names sankey and radar in a table and gives the dual-axis composed form its own heading. `grep -c 'sankey'` prints 1, and zero of those lines sit inside the machine-read sentinels | Met | - |
| AC-010 | REQ-006 | Given five type sizes are already in use, When the contract publishes them, Then the published roles match what the corpus does | The roles are published at `template-contract.md:87` and the corpus carries nine distinct sizes before and after. Six are the published roles and three are the named departures. Only the 12px count moved, from 55 to 70, which is the fifteen files that gained a `.notice` rule at the published `note` size | Met | - |
| AC-011 | REQ-007 | Given the corpus varies its geometry by hand, When the shared block lands, Then every difference from it carries a comment saying why | The block is at `palette-sheet-neutral.html:45` and its five values are identical in all 23 files, so there is no departure to comment on. What varies is the four plot insets, which the block states are per-form and why. Every inset is byte-identical to the copy taken before the phase | Met | - |
| AC-012 | REQ-007 | Given the shared block records values the corpus already uses, When it lands, Then no chart is redrawn by it | Nineteen of twenty forms render byte-identical to their pre-phase picture, recorded at `implementation-summary.md:184`. The twentieth changed for the sweep rather than for the block | Met | - |
| AC-013 | REQ-008 | Given the multi-hue question is the operator's, When the phase closes, Then the gradient clause is drafted in the colour document and applied only on a yes | The operator answered yes on 2026-09-03 with a scope. The clause is at `color-system.md:137` with that scope, applied on `progress-single` alone, and the predicate that tests it was watched failing on a mutated copy before it was run on the corpus | Met | - |
| AC-014 | REQ-009 | Given this phase authored prose, When it is scanned, Then every document reports zero hard blockers | Zero on all seven documents in this folder and on all three edited references, recorded at `implementation-summary.md:184`. `template-contract.md` went from the one blocker it inherited to zero | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists. A waiver naming
an ADR that is not there fails validation: the point of a waiver is that someone
recorded the reasoning, so an unbacked waiver is treated as an unmet criterion
rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes. Thirteen rows are `Met` and one is `Superseded` by a criterion that covers
twenty forms where it covered one.

AC-001 was the row that cost the most and looked the cheapest, and it paid differently than
expected. The reading it forced overturned the finding the phase was built around: `grouped-bars`
keeps `neutral`, and the argument for that is three paragraphs rather than a shrug. It also found
what a two-character edit would have missed, which is `progress-single` declaring a system whose
whole content is that colour encodes magnitude while painting a fixed value.

AC-005 was the row an implementer would skip, and skipping it would have been expensive twice
over. Proving silence caught a proof script that was reading the file's own source back and
calling it a rendered notice, and the fixture beside it caught a predicate that read a null
reading as a zero.

<!-- /ANCHOR:closure -->
