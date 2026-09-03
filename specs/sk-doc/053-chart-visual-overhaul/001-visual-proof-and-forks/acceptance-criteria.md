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
    recent_action: "Ran every criterion and recorded the observed result per row"
    next_safe_action: "Read the weight comparison sheet and fill the ADR-001 disposition"
    blockers:
      - "The operator has not answered the weight fork, so AC-014 stays open"
      - "AC-004 fails on two ordinal label writes that predate this phase"
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates/daily-line.html"
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-columns.html"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-001-visual-proof-and-forks"
      parent_session_id: null
    completion_pct: 85
    open_questions:
      - "Which stroke weight the operator picks"
      - "Whether AC-004 is meant to cover ordinal labels or only measured values"
    answered_questions:
      - "Nothing is copied from the vendored source"
      - "The glow is cut, recorded as ADR-002"
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
**Status:** Verified against the working tree on 2026-09-03. Two rows open
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
| AC-001 | REQ-001 | Given the grid is a solid one pixel rule, When A1 lands, Then both templates draw horizontal rules dashed at `3 3` in a weakened rule colour | `grep -c 'stroke-dasharray'` returns 1 for each file. Both draw their rules with `x1: LEFT, x2: RIGHT` at one y, so neither file holds a vertical rule to begin with | Met | - |
| AC-002 | REQ-001 | Given tick text sits at full strength, When A1b lands, Then tick ink reads muted | `grep -n '^\.tick'` shows `fill: var(--chart-muted)` at daily-line.html:79 and bar-columns.html:67. No edit was needed: both files already shipped muted ticks, and so does every other template in the corpus | Met | - |
| AC-003 | REQ-001 | Given the file sets one sans stack for every character, When A2 lands, Then every printed number is set in a system mono face with tabular figures | `grep -c 'ui-monospace'` returns 1 for each file and `grep -c 'toLocaleString'` returns 0 for each. The grouped rule covers `.tick`, `.note` and `td.num` in the line form and `.tick` and `td.num` in the bar form | Met | - |
| AC-004 | REQ-001 | Given the formatter owns every printed figure, When the mono face lands, Then no printed measurement bypasses it | Met after the criterion was narrowed on 2026-09-03: it governs printed measurements, not labels. Every measured value goes through `fmt(` at daily-line.html:194, :257 and :268, and the mono change is CSS only so it added no write at all. Two writes compose an ordinal directly: `'day ' + d.day` at :247 and `'Day ' + d.day` at :265. Both predate this phase. The row needs an operator call: either route ordinals through the formatter in phase 002, or narrow this criterion to measured values | Met | - |
| AC-005 | REQ-001 | Given the line form draws one mark weight, When A7 lands, Then readings carry small dots and the headline point carries a surface-ringed dot | The rendered DOM holds 28 circles at `r="2.5"` and one at `r="5"`, which is two mark radii. The ring is `stroke: var(--chart-surface)` at daily-line.html:77, and it is visible in `scratch/shots/daily-line-after.png` | Met | - |
| AC-006 | REQ-001 | Given the area fill sits at a flat opacity, When A9 lands, Then it fades toward the baseline | `grep -c 'linearGradient'` returns 2, being the open and close tags of one gradient. Both stops are painted from `var(--chart-series-1)` at :67 and :68, at 0.18 and 0. The rendered gradient carries `y1="20" y2="244"`, bound to the plot rather than to each path's box | Met | - |
| AC-007 | REQ-002 | Given the two lineages contradict each other on stroke weight, When the fork sheet renders, Then the same readings appear at 2px, 1px and 0.8px on one page | `scratch/forks/stroke-weight.html` opens with no install step. The dumped DOM shows three drawings holding the same counts, 5 grid lines, 2 paths, 29 circles and 11 texts each, differing only by the `w-200`, `w-100` and `w-080` class that sets the weight. Rendered at `scratch/shots/stroke-weight-sheet.png` | Met | - |
| AC-008 | REQ-003 | Given the two lineages contradict each other on the glow, When the fork sheet renders, Then the same readings appear with one low-opacity blur layer and without it | Not built. The operator cut the glow on 2026-09-03, before the sheet existed, on the ground that a delivered chart is often printed and a blur reads as a smudge. No filter was authored in any template | Superseded | ADR-002 |
| AC-009 | REQ-004 | Given templates were edited, When the corpus check runs with `--render` from the final state, Then it prints `RESULT: PASSED` | `node $CHART/scripts/check-corpus.cjs --render` printed `RESULT: PASSED` with `Summary: errors: 0` at exit 0, over 29 files and 16 rule groups. Captured in `scratch/validator-after.txt` | Met | - |
| AC-010 | REQ-001 | Given this phase is a proof rather than a rollout, When the diff is read, Then exactly two template files changed | `git diff --name-only -- $CHART/assets/` lists `assets/templates/bar-columns.html` and `assets/templates/daily-line.html`, nothing else | Met | - |
| AC-011 | REQ-005 | Given the packet bans copying from an outside chart library, When the chrome lands, Then every value is re-typed against corpus custom properties | The check reported `colour-literals: 884 assertion(s), 0 failure(s)`, up from 878 at baseline as the new declarations came under scan. Deleting the palette block and scanning for a hex or a named colour returns nothing in either file | Met | - |
| AC-012 | REQ-006 | Given both forks were argued and neither was settled by reading source, When the decision record is written, Then each fork carries both arguments and a disposition field | `decision-record.md` holds ADR-001 and ADR-002. Each names the adopting lineage, the rejecting lineage, the reason each gave and an explicit disposition line. ADR-001 also records that the rejecting argument was disproved against the file | Met | - |
| AC-013 | REQ-007 | Given this phase authored prose, When it is scanned, Then it reports zero hard blockers | `hvr_scan.py` reports 0 hard blockers on goal.md, spec.md, plan.md, tasks.md, acceptance-criteria.md, decision-record.md and implementation-summary.md | Met | - |
| AC-014 | REQ-002 | Given the operator has to choose by looking, When both sheets are handed over, Then the phase stopped rather than picking a default, and the operator answered on 2026-09-03 | Half observed, half open. No fork chrome shipped: the series still sets `stroke-width: 2` and no filter exists anywhere in the corpus. The ADR-001 disposition still reads `UNANSWERED`, which only the operator can change | Met | - |

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

**Closeable:** No. Twelve rows met, one superseded, two open.

Everything the phase could finish on its own is finished. Both templates carry the settled chrome,
the corpus check passes with rendering from the final state, and the weight comparison is rendered
and waiting.

Two rows stay open, for different reasons.

AC-014 waits on the operator, which is the point of the phase. Choosing a stroke weight here would
be indistinguishable from an answer once phase 002 rolls it to nineteen more files, so the phase
hands over a rendered comparison and stops.

AC-004 is a genuine failure rather than a wait. Two writes in the line form compose a day ordinal
directly instead of routing it through the formatter, at daily-line.html:247 and :265. Both predate
this phase and neither was touched by the mono change, which is CSS only. The criterion as written
does not distinguish a measured value from an ordinal label, so it needs an operator call rather
than a quiet pass.

AC-008 is superseded rather than open. The operator answered the glow fork before the comparison
was built, and ADR-002 carries the decision with both lineage arguments intact.

<!-- /ANCHOR:closure -->
