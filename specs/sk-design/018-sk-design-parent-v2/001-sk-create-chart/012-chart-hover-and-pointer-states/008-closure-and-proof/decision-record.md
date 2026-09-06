---
title: "Decision Record: closure rulings for the pointer-contract packet"
description: "Six rulings. Five recorded at closure: AC-005 restated against the declaration surface, the no-script and first-paint rows closed on a measured interpretation, the completeness question held for a bounded follow-up, the heaviest-form file choice corrected by measurement, and the mutation element named as the figure wrapper. One added by the verification pass that followed: the readout rule did not hold corpus-wide. All three that were left pending are now resolved or closed in writing by the follow-up phase."
trigger_phrases:
  - "ac-005 restatement"
  - "pointer contract closure rulings"
  - "no-script interpretation ruling"
  - "o3 silence-passes decision"
  - "heaviest form correction"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states/008-closure-and-proof"
    last_updated_at: "2026-09-06T02:55:00Z"
    last_updated_by: "glm-5.3-flash"
    recent_action: "Authored the four closure rulings after the render gate and the mutation"
    next_safe_action: "Fill acceptance-criteria.md rows and reconcile the packet metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates/heat-matrix.html"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "20260906-closure-proof-012"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: closure rulings for the pointer-contract packet

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

Four things needed a ruling before the packet could close honestly. Each entry names
what was observed, the ruling, and what changed. One rule held throughout: no check was
edited to make a red run green, and no row was advanced past the evidence it could name.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: AC-005 is restated against the declaration surface, not met as written

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-06 |
| **Deciders** | Closure phase, per phase 001's recorded recommendation |
| **Related AC** | AC-005 |
| **Related REQ** | parent REQ-004, REQ-008 |

### Context

AC-005 asks that a new form "inherits its pointer contract without reimplementing the
behaviour", verified by adding a throwaway form, wiring only its contract declaration
and confirming the behaviour appears. The packet's own constraint forbids a shared
runtime, so the behaviour cannot appear from a declaration alone: the mechanism is
copied into each form at a measured 7,016 bytes, and phase 003 proved exactly that
(`grouped-bars.html`, 19,671 → 25,977 bytes, +6,306).

Phase 001 recorded the recommendation to restate AC-005 against the declaration surface
in its `tasks.md` open-questions section, because `plan.md` was outside that session's
scope. This record is where the recommendation lands.

### Decision

AC-005 is **restated** (not met as written, not waived):

> Given a new form added to the corpus, When it declares a pointer register and its
> mechanism, Then `check-corpus.cjs` verifies the declaration is internally consistent,
> a register with no mechanism fails, and the form is in the contract's per-form table.

The restatement is what the shipped checker actually enforces. The four-registers
hygiene check (`checkInteractionHygiene`) fails a form whose markup declares
`data-chart-inert` alongside a carried register, a form whose inert declaration carries
no reason, and a carried-register form with no `:focus:not(:focus-visible)` rule. The
no-shared-runtime constraint stays intact: the restatement does not reintroduce the
shared runtime the original criterion assumed.

### Consequences

The row in `acceptance-criteria.md` carries the restated wording and marks the row
`Superseded` against this record. The original criterion's intent, that a new form
should not silently ship inert, is preserved: the checker now fails a form that
declares a register without the mechanism behind it, and the contract's per-form table
names every form's decided contract.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The no-script and first-paint rows close on the measured interpretation of what no-script can mean for script-drawn figures

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-06 |
| **Deciders** | Closure phase |
| **Related AC** | AC-003, AC-004 |
| **Related REQ** | parent REQ-003 |

### Context

The corpus's figures are script-drawn: every template draws its marks inside a
`<script>` block at load, and no template carries a `<noscript>` fallback. Observed
with scripting disabled on all 21 templates: the headline, subtitle and source
sentences render, the figure's static SVG holds only the `title` and `desc` elements
and the declared empty `data-chart-tooltip` group, and the table body is empty because
the drawing code fills it. The same measurement on the pre-packet baseline (HEAD)
shows the identical output, and `check-corpus.cjs`'s `--render` path proves the
script-enabled figure reads correctly, so the static figure the rows describe is the
script-drawn figure at first paint, not a `noscript` variant that never existed.

The rows' intent is that the packet's changes must not make the no-script read worse
than the pre-packet baseline, not that a static-SVG variant must appear.

### Decision

AC-003 is closed as **Met** on the interpretation that "renders the same readable
static figure it renders today" means "identical to the pre-packet baseline with
scripting disabled", measured per form: visible page text and SVG text content
compared byte-for-byte between HEAD and the working tree with
`Emulation.setScriptExecutionDisabled` active. Six forms were compared: one per
contract class (`box-plot` tooltip, `waterfall` terminal, `bar-columns` inert), the
transfer target `daily-range`, the pointer-contract reference `heat-matrix`, and the
largest legend form `stacked-bars`. All six identical.

AC-004 is closed as **Met** on the interpretation that first paint is the load event:
observed on all 21 forms that the figure's content exists at `Page.loadEventFired`
before any pointer listener has fired (a pointer listener cannot fire without input,
and no listener gates the drawing code, verified by reading each template's script:
the drawing runs at script evaluation, listeners attach after). The pre-packet
comparison in the AC-003 walk doubles as the first-paint evidence: with scripting
disabled nothing draws, so the packet's changes introduce nothing that could gate a
static first paint on pointer logic.

### Consequences

`acceptance-criteria.md` AC-003 and AC-004 name this record in their Verification
cells and mark the rows `Met`.

**CLOSED as decided against by `009-close-the-deferrals`, rather than carried as future work.**
The static-SVG variant was written here as something a future packet might want. Asked to leave
nothing deferred, the question was put properly rather than deferred again, and the answer is no.
A pre-drawn variant has exactly two implementations and the corpus forbids both. Generating the
marks at author time is a build step, which the constraint that shapes every one of these files
rules out by name. Hand-authoring them is 21 pre-drawn duplicates that must be re-drawn by hand
whenever a data block changes, which converts a self-contained file into two files that silently
disagree, and a figure that disagrees with its own data is worse than one that needs script to
draw. The corpus already meets the requirement the variant was imagined to serve: every reading
is in the data table, which is plain HTML and needs no script at all. This is not a gap left
open; it is a design the corpus declines.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The O3 completeness question was held for a bounded follow-up, which then took it: silence no longer passes an unannotated form

### Metadata

| Field | Type |
|-------|------|
| **Status** | Accepted, then resolved by `009-close-the-deferrals` |
| **Date** | 2026-09-06 |
| **Deciders** | Closure phase |
| **Related AC** | AC-001, AC-008 |
| **Related REQ** | parent REQ-001 |

### Context

Research section 9 (O3) asks whether silence should keep passing an unannotated form
now that all 21 templates carry a decided contract, or whether that should become an
error. The corpus's own history warns against an unverified tightening:
`checkEmptyNotice` was removed after it was checked and found unearned. The strict-reading
precedent already errors on a template on disk with no catalog row, so the checker
already refuses one kind of silence.

The decided state is 20 of 21 forms annotated: `waterfall` is terminal via its native
`<title>`, recorded as such in the contract's per-form table, and carries no register
attribute. Its absence is correct, not a gap.

### Decision

Defer. Silence keeps passing an unannotated form. Reason: making unannotated an error
is a checker change, and this packet's closure phase exists to prove the checker
behaves, not to change it. Converting silence to an error would also need its own
mutation proof before it could claim enforcement, and that proof has not been run. The
question is recorded here so a future phase can pick it up with a bounded scope:
`check-corpus.cjs` gains an error branch for a form absent from the contract's
per-form table, the contract table gains a row for any new form at the same time the
form lands, and the mutation recipe for it lands in `scripts/README.md` section 5.

### Consequences

None for this packet's rows: AC-001 and AC-008 close on the per-form table's current
completeness, not on the checker enforcing completeness. The deferral is written, not
silent.

**RESOLVED by `009-close-the-deferrals`.** The deferral lasted one phase. The bounded scope this
record specified was implemented exactly as written: `check-corpus.cjs` gained
`pointer-contract-coverage`, an error branch for a form absent from the per-form table, and the
mutation recipe landed in `scripts/README.md` section 5. The rule also runs in the other
direction, failing a row that names a form nobody ships, because a table describing a form that
does not exist is the same defect seen from the other side. Both directions were watched failing
before the rule was trusted. Silence no longer passes.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: The heaviest-form first-paint check names the actual heaviest form

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-06 |
| **Deciders** | Closure phase |
| **Related AC** | AC-004 |
| **Related REQ** | closure-phase REQ-004 (AC-004 first-paint) |

### Context

The closure phase's `tasks.md` names `calendar-grid.html` as "the heaviest form" for
the first-paint check. Measured sizes say otherwise: `bar-line-composed.html` is the
heaviest template at 35,377 bytes, with `calendar-grid.html` at 21,762 bytes (7th of
21) and `stacked-area.html` second heaviest at 31,164 bytes. The check's intent is the
heaviest form, not a named file, so the check ran on the actual heaviest.

### Decision

The first-paint walk covered all 21 templates rather than one, which supersedes the
file choice: every template's figure content exists at `Page.loadEventFired` before
any pointer listener can fire. The task text's "heaviest form" is read as
`bar-line-composed.html` by measurement. This record exists so the deviation from the
task text is written rather than silent.

### Consequences

AC-004's Verification cell cites the all-forms walk and the byte sizes, and names this
record for the file-choice correction. No document change is needed: the task text
stays as written, and this record is the correction.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: The AC-006 mutation recipe's element is the figure wrapper, not a literal `<figure>` tag

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-06 |
| **Deciders** | Closure phase |
| **Related AC** | AC-006 |
| **Related REQ** | closure-phase REQ-002 |

### Context

The closure phase's `tasks.md` and plan.md mutation recipe say to add
`data-chart-inert` to "heat-matrix.html's root `<figure>` element". No template in the
corpus uses a `<figure>` element; the figure wrapper is
`<div class="figure" data-chart-part="figure">` in all 21 templates, and the contract's
register table states this explicitly ("the chart's figure wrapper (the `<div
class="figure" data-chart-part="figure">` element, not a literal `<figure>` tag)"). The
recipe's intent is the figure wrapper.

### Decision

The mutation landed on `heat-matrix.html`'s figure wrapper
(`<div class="figure" data-chart-part="figure" data-chart-inert="every encoded value is
printed beside its mark">`), which already carries `data-chart-tooltip` on its tooltip
group inside the drawing. The checker's contradiction branch fired and named the form
and the conflict. The recipe's element wording is corrected by this record, not by
editing the task text.

### Consequences

AC-006's evidence stands: the mutation was executed on the real file in place, the
`RESULT: FAILED` named the form and the contradiction branch, and the restore is
proven by byte-identical sha256, a clean git status for the file, and a re-run
`RESULT: PASSED`.
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: REQ-002 does not hold corpus-wide, and AC-002 is waived for `distribution-strip`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-06 |
| **Deciders** | Post-closure verification pass |
| **Related AC** | AC-002 |
| **Related REQ** | REQ-002 |

### Context

AC-002 closed `Met` on a keyboard and card-versus-table walk that sampled one form per
class: `stacked-bars` for the legend classes, `box-plot` for the tooltip class,
`waterfall` for the terminal class. That sample is defensible per class and it happens to
miss the one form where the property fails.

The verification pass re-ran the card-versus-table comparison against all 21 templates
rather than one per class: for each form, drive `pointermove` onto a sample of marks,
read the card's own `text`/`tspan` nodes, and look for each numeric value in the data
table's cells. Nineteen forms pass. Two do not, and they are not the same kind of thing.

`stacked-area` reports four values the table does not print: 851, 769, 502, 244. Each is
exactly the sum of one of the table's own series columns over its 24 rows, verified
arithmetically. The contract specifies this readout deliberately, because a band's path
spans the whole width and cannot carry a reading at a point. Every encoded datum is in
the table; only the aggregate is not. This is a derived convenience, not hidden data, and
REQ-002 holds for it.

`distribution-strip` is different. Each mark is an individual observation, and the card
reveals that observation's own value. The table carries five summary cells per cohort
(`Cohort`, `Records`, `Lowest`, `Median`, `Highest`) and no individual value. A sampled
walk found eight card values, none present or derivable: 38, 40, 51, 51, 49, 69, 43, 54.
A reader without a pointer can obtain the distribution's shape and cannot obtain any
observation in it.

The tooltip is not this packet's work. It shipped in `009-chart-visual-overhaul/004-interaction-layer`
and this packet's Non-Goals keep the seven working tooltips unless a defect is shown in
them. A defect is now shown. This packet did propagate it: phase 007 transferred the same
mechanism into the `pick-times-by-depot` delivery, which fails identically.

### Decision

AC-002 moves from `Met` to `Waived`, bounded to `distribution-strip` and
`pick-times-by-depot`. It is not met and is not claimed to be: the criterion is true of 20
of the 21 templates and false of those two files, and a P0 blocker that is false of a form
in the corpus cannot be ticked.

Waived rather than left open because the repair does not belong to this packet. The tooltip
is inherited from `009-chart-visual-overhaul/004-interaction-layer`, and both repairs are
design decisions with consequences outside a verification pass: printing 48 observations per
cohort changes what the data table is for on this form, and reducing the card to the summary
statistics the table already carries removes the only reason the form answers a pointer at
all. The choice belongs to the operator, so the defect is recorded and handed over.

### Consequences

**RESOLVED by `009-close-the-deferrals`.** The waiver stood for the length of one phase. The
repair the operator directed took the route this record called the more valuable of the two:
`distribution-strip` and `pick-times-by-depot` gained a table column carrying every record behind
the five-number summary, and the class was closed by a new corpus rule, `card-readout`, which
opens each card under a pointer and requires every number it shows to appear in the table. The
sweep that found the defect now reports no card outrunning its table across all 27 files, and
AC-002 moves from `Waived` to `Met` on that measurement. `stacked-area` was repaired in the same
pass, not because REQ-002 demanded it but because leaving one exception would have forced the new
rule to ship with a carve-out.

The packet's other work stands: the register, the
checker branches, the contract, the six new cards and the six deliveries are unaffected,
and the corpus prints `RESULT: PASSED`.

The checker cannot currently catch this class. `check-corpus.cjs` enforces that a declared
contract matches the declarations in the markup; it does not compare what a card renders
against what the table carries. Making that a rule would close the class rather than the
instance, and it is the more valuable of the two repairs.
<!-- /ANCHOR:adr-006 -->
