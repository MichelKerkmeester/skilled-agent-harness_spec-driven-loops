---
title: "Acceptance Criteria: Give every chart form a hover and pointer state"
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
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states"
    last_updated_at: "2026-09-06T02:55:00Z"
    last_updated_by: "glm-5.3-flash"
    recent_action: "AC-002 met on repair: every card value now appears in its table"
    next_safe_action: "Reconcile spec.md status and regenerate packet metadata"
    blockers: []
    key_files:
      - "008-closure-and-proof/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "20260906-closure-proof-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "AC-002 is met on a repair, not a waiver: the strips carry every record and card-readout enforces it (ADR-006)."
      - "AC-005 was restated against the declaration surface (ADR-001) rather than met as written or left open."
      - "AC-006 was satisfied by executing the mutation on the real heat-matrix.html and watching RESULT: FAILED name the form, then restoring."
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Give every chart form a hover and pointer state

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states
**Level:** 2
**Status:** Complete
**Date:** 2026-09-05
**Closed:** 2026-09-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 21 templates in `assets/templates/`, When the contract reference is read, Then every one of them appears with a named pointer contract, and a contract of `inert` carries the reason the static figure already suffices | Observed: `template-contract.md` section 10 table lists all 21 forms with a contract per row; `ls assets/templates/*.html \| wc -l` returns 21 and every filename appears in the table. The six inert rows carry reasons in the table and the reasons are enforced verbatim in the files: `grep -h "data-chart-inert=" assets/templates/*.html` returns six declarations each with a non-empty reason. `waterfall` is terminal via its native `<title>` and carries no register, which is the decided state, not a gap | Met | - |
| AC-002 | REQ-002 | Given any form whose contract promises a revealed value, When the figure is driven by keyboard alone, Then the same value is reachable without a pointer | MET across all 21 templates and all 6 deliveries, after a repair. The original closure evidence stands: the accessibility floor is `data-chart-table`, present in 21 of 21 and an error when absent (`check-corpus.cjs:834`); a CDP keyboard walk of `stacked-bars` reaches each legend entry with a 5px `:focus-visible` outline and latches on Enter, and all six legend forms pass; `box-plot`'s card values were all found in its table; `waterfall` prints its values above the bars. That evidence sampled one form per class. Widening it to all 27 corpus files found two genuine failures and one false alarm: `distribution-strip` and its delivery `pick-times-by-depot` revealed an individual observation the table did not carry, while `stacked-area`'s 851/769/502/244 proved to be exactly its four series-column sums over 24 rows. Phase `009-close-the-deferrals` repaired all three: both strips gained a table column carrying every record behind the five-number summary, and `stacked-area` gained a table foot of whole-period series totals so the new rule could ship without a carve-out. The re-sweep reports no card outrunning its table on any of the 27 files. The property is now enforced rather than measured once: `card-readout` opens each card under a pointer and fails any value the table lacks (17 assertions, 0 failures), and it was watched failing by name on a deliberate mutation before being trusted. Final gate from the repaired state: `RESULT: PASSED`, 0 errors | Met | - |
| AC-003 | REQ-003 | Given any form, When it is opened with scripting unavailable, Then it renders the same readable static figure it renders today | Observed per ADR-002's interpretation: with `Emulation.setScriptExecutionDisabled`, visible page text and SVG text content compared byte-for-byte between the pre-packet baseline (HEAD `45fe10c`) and the final tree on six forms spanning every class (`box-plot`, `waterfall`, `bar-columns`, `stacked-bars`, `daily-range`, `heat-matrix`): all six identical. The packet's mechanism ships an empty tooltip group and drawing-code-only fills, so no-script output is unchanged by construction and by measurement. A true static-SVG `noscript` variant never existed in this corpus and is not this packet's deliverable | Met | ADR-002 |
| AC-004 | REQ-003 | Given any form, When it first paints, Then the figure is readable before any pointer logic has run | Observed: on all 21 templates the figure's static node count is full at `Page.loadEventFired` (sample: `calendar-grid` 392 nodes, `heat-matrix` 138, `bar-line-composed` 53). Drawing code runs at script evaluation; listeners attach after; no listener gates the draw. The "heaviest form" named in the task text (`calendar-grid`) is not the heaviest by measurement; the check was run on all 21, which includes the actual heaviest (`bar-line-composed`, 35,377 bytes). File-choice correction recorded in ADR-004 | Met | ADR-004 |
| AC-005 | REQ-004 | Given a new form added to the corpus, When it is built from the shared surface, Then it inherits its pointer contract without reimplementing the behaviour | UNSATISFIABLE AS WRITTEN: the verification step (wire only a declaration, watch behaviour appear) assumes a shared runtime that the packet's own constraint forbids. Restated against the declaration surface per phase 001's recorded recommendation and ADR-001: the restated criterion is what `checkInteractionHygiene` enforces (register declarations must be internally consistent, an inert declaration must carry a reason, a carried register must carry the hygiene line). The no-shared-runtime cost is measured, not asserted: 7,016 bytes per copied mechanism (research.md section 6), +6,306 observed on `grouped-bars` | Superseded | ADR-001 |
| AC-006 | REQ-005 | Given a form whose rendered output contradicts its declared contract, When `check-corpus.cjs --render` runs, Then it fails and names the form | Observed (structural mutation, no `--render` needed: the contradiction branch fires from markup): `data-chart-inert="every encoded value is printed beside its mark"` added to `heat-matrix.html`'s figure wrapper in place, which already carries `data-chart-tooltip`. Checker output: `x interaction-hygiene: 120 assertion(s), 1 failure(s)` and `FAIL [interaction-hygiene] assets/templates/heat-matrix.html: the markup declares data-chart-inert and data-chart-tooltip. A form cannot both refuse the pointer and answer it. Remove the inert declaration or the carried register`, then `Summary: errors: 1` and `RESULT: FAILED`. Restored from a byte-identical copy (sha256 `746ba037…df720b56` before and after, `git status` clean for the file, re-run printed `RESULT: PASSED`). The mutation recipe's `<figure>` wording is corrected by ADR-005: the element is the figure wrapper div | Met | - |
| AC-007 | REQ-005 | Given the corpus in its final state, When `check-corpus.cjs --render` runs, Then it prints `RESULT: PASSED` | Observed: `node scripts/check-corpus.cjs --render` from the final state printed 29 checks with 0 failures across 30 files (21 chart forms), `Summary: errors: 0`, literal `RESULT: PASSED`, with render checks present (`render: 30`, `settled-render: 60`, `dark-render: 30`, `determinism: 30` assertions). Full log kept at this phase's `scratch/closure-render-gate.log`. The structural re-run after the mutation restore also printed `RESULT: PASSED` | Met | - |
| AC-008 | REQ-006 | Given the seven partial forms, When the contract reference is read, Then each either gained the missing tooltip or records why a legend or dim is its correct terminal state | Observed row-by-row in `template-contract.md` section 10: `parallel-axes` terminal (native `<title>` per dot, both axis bounds printed), `stacked-bars` tooltip (segment under 22 units prints nothing), `stacked-area` tooltip (band total in card per the readout table), `grouped-bars` tooltip (column values are geometry), `bar-line-composed` tooltip (two ladders share one gridline set), `daily-line` tooltip (only the low prints), `waterfall` terminal (deltas printed above bars, native `<title>` per bar). The mechanism is present on disk: the four gainers declare `data-chart-tooltip` and their cards were exercised in the AC-002 walks | Met | - |
| AC-009 | REQ-007 | Given a touch device, When a mark is tapped, Then the packet records the decided behaviour, even where the decision is that a single static file cannot normalise it | Observed: `template-contract.md` section "Touch" states the decided behaviour (tap pins, tap re-pins, second tap or outside tap dismisses, hover yields while pinned) and explicitly names what is not guaranteed (drag to scrub, long press, dismissal from inside) rather than leaving it silent. The pin path was exercised: a CDP tap on a `box-plot` mark opened and pinned the card (`data-open` set) and a tap outside dismissed it (`data-open` cleared). The contract also states plainly that `check-corpus.cjs` asserts none of this | Met | - |
| AC-010 | REQ-008 | Given every changed file, When it is inspected, Then it references no external runtime, framework, CDN or build step | Observed: checker-pattern grep `(src\|href)\s*=\s*"(https?:)?//\|@import\|fetch\s*\(\|XMLHttpRequest\|import\s*\(` returns zero matches in all 30 corpus files at HEAD and in the final tree; the checker's own `no-external` check reports 180 assertions, 0 failures in the AC-007 gate run. The only `http` literals in the corpus are the SVG namespace `http://www.w3.org/2000/svg` (a namespace identifier, not a fetch target). A looser grep matching the English words "import from" in prose comments returned 21 false positives and was discarded | Met | - |
| AC-011 | NFR-P02 | Given the shared surface is in place, When per-file size is measured against the current corpus, Then the delta is reported as a number rather than asserted negligible | Observed (`wc -c`, HEAD baseline vs final tree, per changed file): the six card copies carry the mechanism: `daily-range` +7,081, `daily-line` +7,038, `bar-line-composed` +7,196, `stacked-area` +6,976, `stacked-bars` +6,866, `grouped-bars` +6,306. Register-only forms moved by tens of bytes: `bar-columns` +59, `bar-rows` +80, `independent-percentages` +92, `progress-single` +105, `unit-grid` +126, `unit-ring` +125. Deliveries: `calls-by-day-and-hour` +8,208, `orders-after-the-price-change` +8,458, `pick-times-by-depot` +8,053, `van-age-against-repair-cost` +8,045, `staff-hours-by-service` +80, `where-the-budget-went` +126. Reference and checker: `template-contract.md` +7,516, `scripts/README.md` +1,354, `check-corpus.cjs` +959. The card copies land 100-710 bytes under the excerpt's 7,016 (name/rows/adaptation differences per form), which is the expected neighbourhood rather than the exact figure | Met | - |

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

**Closeable:** Yes. Ten rows close as `Met` and AC-005 as `Superseded`; nothing is waived and
nothing is open.

AC-002 took the long way. It closed `Met` at first on a sample of one form per class, was
reopened and then `Waived` when a verification pass widened that sample to all 27 corpus files
and found `distribution-strip` and `pick-times-by-depot` hiding each individual observation
behind the pointer, and is now `Met` on a repair rather than on a waiver: both tables carry every
record, `stacked-area` carries the totals its card reads out, and `card-readout` enforces the
property so the next form cannot reintroduce it. That history is left visible on purpose. The
criterion was never ticked while it was false.

Everything below this paragraph was true when written and remains so.

Nine rows close as `Met` on evidence produced in the closure phase: the render gate from
the final state (`RESULT: PASSED`, 29 checks, 0 failures), the AC-006 mutation watched
failing on the real `heat-matrix.html` and naming the form before a proven restore, the
keyboard and no-script walks over one form per contract class and the six legend forms
(sampling per class, which is what ADR-006 later widened to all 21),
the touch pin walk, the external-reference greps at zero, and the byte table across all
27 changed corpus files. AC-005 closes as `Superseded` against ADR-001, restated against
the declaration surface the packet actually ships, because the original criterion's
verification step cannot exist under the packet's own no-shared-runtime constraint.

Three things were left out in writing at closure, and none of them is still out. The O3
completeness question, deferred by ADR-003, was taken by `009-close-the-deferrals` as
`pointer-contract-coverage` with its mutation proof run in both directions. The static-SVG
`noscript` variant, named as future work by ADR-002, is now closed as decided against with its
reason: it is either a build step the corpus forbids by name or 21 hand-maintained duplicates
that drift from their data blocks, and the requirement it was imagined to serve is already met
by the data table. The heaviest-form file choice is corrected by measurement in ADR-004. `waterfall` carries no register
attribute: it is terminal via its native `<title>`, and 20 of 21 forms carrying a register
is the decided state, not a gap.
<!-- /ANCHOR:closure -->
