---
title: "Acceptance Criteria: Prove the chrome on two forms and settle the weight and glow forks"
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
    packet_pointer: "sk-doc/053-chart-visual-overhaul/001-visual-proof-and-forks"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the closure gate for the chrome proof and both forks"
    next_safe_action: "Capture the baseline corpus check before editing a template"
    blockers:
      - "The operator has not answered the weight fork or the glow fork"
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates/daily-line.html"
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-columns.html"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-001-visual-proof-and-forks"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which stroke weight the operator picks"
      - "Whether one glow layer survives a print test"
    answered_questions:
      - "Nothing is copied from the vendored source"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Prove the chrome on two forms and settle the weight and glow forks

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/053-chart-visual-overhaul/001-visual-proof-and-forks
**Level:** 2
**Status:** Draft
**Date:** 2026-09-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

Every command below runs from the repository root. `CHART` stands for
`.opencode/skills/sk-doc/sk-create-chart`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the grid is a solid one pixel rule, When A1 lands, Then both templates draw horizontal rules dashed at `3 3` in a weakened rule colour | `grep -c 'stroke-dasharray' $CHART/assets/templates/daily-line.html $CHART/assets/templates/bar-columns.html` reports at least 1 per file, and neither file gains a vertical rule | Unmet | - |
| AC-002 | REQ-001 | Given tick text sits at full strength, When A1b lands, Then tick ink reads muted | `grep -n '^\.tick' $CHART/assets/templates/daily-line.html $CHART/assets/templates/bar-columns.html` shows the muted role on both | Unmet | - |
| AC-003 | REQ-001 | Given the file sets one sans stack for every character, When A2 lands, Then every printed number is set in a system mono face with tabular figures | `grep -c 'ui-monospace' $CHART/assets/templates/daily-line.html $CHART/assets/templates/bar-columns.html` reports at least 1 per file, and `grep -c 'toLocaleString' ` over the same two files reports 0 | Unmet | - |
| AC-004 | REQ-001 | Given the formatter owns every printed figure, When the mono face lands, Then no printed number bypasses it | `grep -n 'textContent' $CHART/assets/templates/daily-line.html` shows every numeric write routed through `fmt(` | Unmet | - |
| AC-005 | REQ-001 | Given the line form draws one mark weight, When A7 lands, Then readings carry small dots and the headline point carries a surface-ringed dot | Open `daily-line.html` and count two mark radii in the rendered figure, with the ring filled from the surface token | Unmet | - |
| AC-006 | REQ-001 | Given the area fill sits at a flat opacity, When A9 lands, Then it fades toward the baseline | `grep -c 'linearGradient' $CHART/assets/templates/daily-line.html` reports at least 1, and the stops are painted from `var(--chart-series-1)` | Unmet | - |
| AC-007 | REQ-002 | Given the two lineages contradict each other on stroke weight, When the fork sheet renders, Then the same readings appear at 2px, 1px and 0.8px on one page | `scratch/forks/stroke-weight.html` opens in a browser and holds three drawings whose only difference is the stroke weight | Unmet | - |
| AC-008 | REQ-003 | Given the two lineages contradict each other on the glow, When the fork sheet renders, Then the same readings appear with one low-opacity blur layer and without it | `scratch/forks/emphasis-glow.html` opens in a browser and holds two drawings whose only difference is the filter, with the no-glow variant marked as the default | Unmet | - |
| AC-009 | REQ-004 | Given templates were edited, When the corpus check runs with `--render` from the final state, Then it prints `RESULT: PASSED` | `node $CHART/scripts/check-corpus.cjs --render` prints `RESULT: PASSED` and `Summary: errors: 0` | Unmet | - |
| AC-010 | REQ-001 | Given this phase is a proof rather than a rollout, When the diff is read, Then exactly two template files changed | `git diff --name-only -- $CHART/assets/` lists `daily-line.html` and `bar-columns.html` and nothing else | Unmet | - |
| AC-011 | REQ-005 | Given the packet bans copying from an outside chart library, When the chrome lands, Then every value is re-typed against corpus custom properties | `node $CHART/scripts/check-corpus.cjs` reports 0 failures on `colour-literals`, and no line in either template matches a hex or a named colour outside the palette block | Unmet | - |
| AC-012 | REQ-006 | Given both forks were argued and neither was settled by reading source, When the decision record is written, Then each fork carries both arguments and a disposition field | `decision-record.md` holds an ADR per fork, each naming the adopting lineage, the rejecting lineage and the reason each gave | Unmet | - |
| AC-013 | REQ-007 | Given this phase authored prose, When it is scanned, Then it reports zero hard blockers | `python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <file>` reports no hard blocker on each document in this folder | Unmet | - |
| AC-014 | REQ-002 | Given the operator has to choose by looking, When both sheets are handed over, Then the phase stops rather than picking a default | The decision record's disposition field is filled by the operator, and no chrome from either fork appears in a template before that | Unmet | - |

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

**Closeable:** No.

Nothing has run. Every row above is open, which is the expected state for a phase that has been
planned and not yet worked.

Two rows will stay open longer than the rest by design. AC-014 waits on the operator, and AC-012
cannot be filled in until that answer arrives. The phase is allowed to report itself finished on
the other twelve rows and hold those two, because handing over a rendered comparison is the
deliverable and choosing for the operator would defeat it.
<!-- /ANCHOR:closure -->
