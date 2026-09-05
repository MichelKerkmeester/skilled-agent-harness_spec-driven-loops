---
title: "Decision Record: The composed form and the packet closeout"
description: "Which family the new row joined and why, the eight assertions this phase chose to write and the two it found already written, the version story the packet actually keeps, and the disposition on the range window."
trigger_phrases:
  - "composed form decisions"
  - "chart checker extension decisions"
  - "chart version convention"
  - "chart range window disposition"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/051-sk-create-chart/009-chart-visual-overhaul/007-composed-form-and-closeout"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Recorded the seven calls the closing phase made"
    next_safe_action: "Read acceptance-criteria.md, which cites this record"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-line-composed.html"
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
      - ".opencode/skills/sk-doc/sk-create-chart/references/catalog.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-007-composed-form-and-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The composed row joins relationship, on the family prose rather than on the axis"
      - "The packet keeps per-document versions, so one string everywhere was never the target"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: The composed form and the packet closeout

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

One of these was the operator's and the phase would not have built the form without it. The other
six were the phase's own, and two of them overturn something an earlier document treated as
settled.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The composed row joins `relationship`

**Status:** Accepted
**Date:** 2026-09-03

### The question

Section 10 of the spec left the family open with `relationship` as the default and `time` as the
recorded alternative. `relationship` fits the reader's question and `time` fits the axis, and the
implementer was asked to settle it against the catalog's own family prose rather than against
preference.

### Decision

`relationship`, and the catalog settles it in one line. The family's own entry reads "Do two
variables move together", which is the question this form answers word for word. The `time`
entry reads "What happened over days, weeks or a year, how a period opened and closed, and how
far along a target is", which is a question about one measure's trajectory rather than about two
measures against each other.

The catalog also says outright what kind of thing a family is: "A family here is a group of
questions, not a rendering style." A period axis is a rendering fact. `waterfall` sits under
`time` with steps rather than dates and `scatter` sits under `relationship` with no time in it at
all, so neither the presence nor the absence of an axis of periods has ever decided a shelf here.

### What it costs, and what was done about it

A reader whose question runs over periods would plausibly look under `time` first and not find
the row. Two small edits answer that rather than leaving it. The `relationship` family entry now
reads "Do two variables move together, including across a run of periods", which is the one
clause that makes the shelf findable. And section 5, the table of names a reader actually
arrives with, gained a row: `combo chart`, `dual axis chart` and `bar and line chart` all route
to `bar-line-composed`. None of those three strings appears anywhere in the index, and section 5
exists precisely because a row id says what a form draws rather than what a reader calls it.

### What was not done

No seventh family delivery. The spec puts one in scope only if the audit finds the new form
represents its family better than the current one, and it does not: `van-age-against-repair-cost`
is a scatter, and a scatter is the canonical picture of two variables moving together. The
composed form answers the same family question through a narrower door.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The second scale is a condition, and the form ships on the side that needs one

**Status:** Accepted, following the frozen decision that the condition is computed
**Date:** 2026-09-03

### The question

D2 fixed the rule and left the arithmetic and the shipped shape to the implementer. A dual axis
is the easiest way to lie with a chart, because two ladders can be placed so the marks cross
wherever the author wants and a reader takes the crossing for a finding.

### Decision

The file divides the larger of the two series peaks by the smaller. At a factor of ten or more it
draws a right-hand ladder, and below that one ladder carries both. The condition sits in the
drawing code under a heading an editor cannot miss, with the arithmetic written beside it and the
shipped numbers worked through: 2,040 orders over a 4.0 percent rate is 510, so the shipped file
draws two.

Three consequences follow from making it a condition rather than a setting, and all three were
rendered rather than assumed.

The right inset opens only when there is a ladder to print in it. A form that reserved the gutter
either way would carry a permanent empty margin on the single-scale picture, which reads as a
chart that has lost something.

The single-scale picture prints one axis name carrying both units, "orders and percent". A reader
who takes a shared ladder for a single measure reads one of the two series against the wrong unit
and never finds out, so the ladder says out loud that it is carrying two.

A peak of zero means one measure has nothing to place, so there is nothing to separate and one
ladder carries both. Without that guard the ratio is a division by zero rather than a decision.

### What the axis names carry, and why it changed during the build

The first draft printed the series names beside each ladder and the picture showed why that was
wrong twice over. "Conversion rate" ran off the right edge of the frame and reached a reader cut
in half, and the two words were already printed twenty units above in the key. The names now
carry the unit rather than the series, in the colour of the marks measured against them, and both
are anchored to the edges of the frame so a longer unit grows inward across empty space instead
of off the side of the drawing. The key says which mark is which. What the key cannot say is
which ladder a mark is measured against, and on a two-scale chart that is the whole question.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Two of the plan's eight invariants were already asserted, and two others took their place

**Status:** Accepted
**Date:** 2026-09-03

### The question

The plan listed eight invariants from phases 004 to 006 and asked for one assertion each. Writing
an assertion for something already asserted is not verification, it is a second name for the same
run, so the list was read against the check before any of it was coded.

### What the reading found

Two rows were already enforced by the phase that introduced them.

`palette-block` already counts the palette regions per theme, fails a third block and a repeated
sentinel pair, and matches each region against its own projection of the source in both
directions. That is the row the plan describes, assertion for assertion.

`palette-source-dark` already runs every contrast gate against the dark surface and prints its own
line with its own assertion count, which is what "every gate is computed per theme" asks for. It
reported thirty-four assertions on the baseline run, so it is neither missing nor vacuous.

A third row needed narrowing rather than replacing. "An interactive file paints identically
without pointer input" is what `settled-render` has compared since phase 003, on both the document
and the painted picture. What no render comparison can see is the state a file ships in: a
drawing that opens already dimmed, or with a hover card already filled, paints the same picture on
both of its pointer-free opens and agrees with itself exactly as a correct file does. That half is
the unasserted half, and `interaction-state` is what holds it.

### Decision

Eight assertions were written, and the two rows already covered were replaced by two invariants
the same three phases introduced and left unasserted.

| Check | The invariant, and where it came from |
|---|---|
| `interaction-hygiene` | A form declaring an interaction register carries the hygiene line, and no file widens it into an unconditional `outline: none` or brings back the `user-select: none` that phase 004 refused. Phase 004 |
| `interaction-state` | The dim attribute ships empty and the tooltip group ships without content, so a file paints what it painted before it gained a pointer. Phase 004 |
| `number-format` | No host-locale formatter anywhere, and a file carrying a hover card defines a formatter of its own. Phase 004 |
| `empty-notice` | Every form carries the guard, below the data block it reads, with the labelled block and the break that let it stop the drawing. Phase 006 |
| `geometry-block` | The shared geometry record is byte-identical across every chart form and every proof sheet. Phase 006 |
| `catalog-system` | Every row's system cell names a defined system and matches the file it points at. Phase 006 |
| `type-scale` | Every size a file sets is one of the six published rungs or one of the three named departures. Phase 006 |
| `gradient-sweep` | A gradient naming two different series values appears only in a file declaring `ordered`. Phase 006 |

The second half of `interaction-hygiene` is the one worth naming separately. Phase 004's D5 says
no element a reader can reach with a keyboard loses its focus indicator, and that rule had nothing
behind it. An unconditional `outline: none` and a `user-select: none` both pass every other rule
in the corpus and both take something away from a reader, so the check fails each by selector and
says which reader it protects.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: The type scale moves into the palette source rather than into the check

**Status:** Accepted, as a scope amendment named rather than absorbed
**Date:** 2026-09-03

### The question

`type-scale` needs the nine sizes from somewhere. The phase's file list does not include
`assets/color/palettes.json`, and the scripts README forbids the obvious alternative in as many
words: "Facts a check needs live in structured data: the palette file, the sentinel-marked catalog
table, the identity tags."

Restating the nine numbers inside the check would have satisfied the file list and created exactly
the drift the rule exists to prevent, with the contract publishing a scale and the check enforcing
a copy of it.

### Decision

A `typeScale` object joins the palette source, and the check reads it. The precedent is in the
same file: the corner ladder sits there in its own object for the same reason, since a rung is not
a colour and the block that carries it is the one every file already has.

The addition is inert to everything else that reads the file. `customProperties` emits from
`chrome`, `radius` and `systems`, so no palette block changed and the block checks were unaffected,
which the run confirms at 120 `palette-block` assertions and zero failures.

This is a deviation from a frozen file list, and it is written here rather than left in a diff.
The alternative was a check that restates a document, which the packet's own rules refuse.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: The packet keeps per-document versions, so one string everywhere was never the target

**Status:** Accepted, overturning a premise D7 and AC-010 were built on
**Date:** 2026-09-03

### The question

D7 says the version string is identical across every file that carries one, and AC-010 asks that
`grep -rn '^version:'` return one distinct value. Phase 006 recorded a supporting finding, that
`references/README.md` reads 1.0.0.0 while the rest of the packet reads 1.1.0.0 and the bump would
correct the drift.

The inventory does not support any of it.

### What the files actually say

Before this phase: `SKILL.md` and `README.md` at 1.1.0.0, `catalog.md` at 1.2.0.0,
`color-system.md` at 1.4.0.0, `template-contract.md` at 1.6.0.0, `scripts/README.md` at 1.4.0.0,
`references/README.md` and the ten playbook files at 1.0.0.0, and the two changelog entries at
1.0.0.0 and 1.1.0.0.

Those are not seven copies of one number that drifted. They are per-document versions, and the
pattern is exact: the four documents phase v1.1.0.0 edited sit above the packet version by however
many times each has been edited since, and every document nothing has touched since the first
release still reads 1.0.0.0. `references/README.md` was not stale. It was correct.

The changelog files settle it beyond argument. A changelog entry's `version` names the release it
describes. Making `changelog/v1.0.0.0.md` read 1.2.0.0 to satisfy a grep would put a false claim
into a historical record, and no reading of D7 is worth that.

### Decision

D7's premise is wrong and the criterion it produced names a subject that does not exist. Both are
replaced by a stricter obligation rather than softened, recorded here and applied in
`acceptance-criteria.md`:

- The packet version moves in `SKILL.md` and `README.md`, from 1.1.0.0 to 1.2.0.0, and the newest
  changelog file is named for it.
- Every document whose content this overhaul changed carries a version that moved by one minor
  step, and no document it did not change carries a version that moved.
- The changelog set stays contiguous and each entry keeps the version of the release it describes.

That is more than one string everywhere, not less. Uniformity would pass a packet that bumped
every file including the ones it never opened, and would fail a packet that is telling the truth.
What D7 was protecting is a reader trusting a stale claim, and the replacement holds exactly that:
a document that changed says so, and a document that did not stays where it was.

### What moved

`SKILL.md` and `README.md` to 1.2.0.0, `references/README.md` to 1.1.0.0, `catalog.md` to 1.3.0.0,
`color-system.md` to 1.5.0.0, `template-contract.md` to 1.7.0.0, `scripts/README.md` to 1.5.0.0,
and `manual-testing-playbook/manual-testing-playbook.md` to 1.1.0.0. The two existing changelog
entries did not change and did not move. The convention is now written into the changelog, so the
next reader does not rediscover it.

### The scenario file this inventory got wrong

The sentence above first read that the nine scenario files under the playbook did not change and
did not move. Eight of them are covered by it. Seven were untouched by the overhaul and correctly
hold 1.0.0.0, and `delivery-and-routing/a-delivery-on-a-dark-system.md` is a first release phase 005
wrote, so 1.0.0.0 is its correct value rather than a version that failed to move.

The ninth is `corpus-integrity/colour-comes-from-one-source.md`, and the inventory read it as
untouched when it was not. Phase 005 rewrote three passages in it: the expected `palette-block`
signal became four assertions per file rather than one, because a file now carries a light block and
a dark one, and two troubleshooting steps were rewritten around one block per theme instead of one
block per file. That is a change to what an operator is told to expect from a run, and the version
stayed at 1.0.0.0. The inventory was taken by reading versions rather than by reading the phases
against the files, and a document that changed without moving its version is exactly the case that
method cannot see.

Packet 054 later edited the same file again and took it to 1.1.0.0, one step for its own round, so
the phase 005 round stayed unpaid. Under the convention this ADR states, two editing rounds since
the first release put the file at 1.2.0.0, and it now reads that. The earlier `abf77df9d0` edit is
not counted: it repointed one cross-reference from section 5 to section 6 across six playbook
files, and none of the six moved for it, so a mechanical pointer repair is the class this packet
has consistently left unversioned.

Nine documents this overhaul changed therefore carry a version that moved, and ten correctly did
not. The obligation itself is unchanged. It was the count under it that was wrong.
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: The range window is refused, and the density arithmetic is the weaker of the two reasons

**Status:** Accepted
**Date:** 2026-09-03

### The question

The adjudication allows a draggable range window last and only where a form is genuinely dense, at
more than thirty points, opening at the full range so first paint is identical every time. D6
requires a recorded disposition either way.

### The density arithmetic

Every form with a continuous or period axis, read against the threshold.

| Form | Documented shape | Ships | Clears thirty |
|---|---|---|---|
| `daily-line` | One reading per day, 30 days or fewer | 28 | No, and the ceiling forbids it |
| `daily-range` | A minimum and a maximum per day | 14 | No |
| `stacked-area` | 2 to 5 series over a continuous axis | 24 periods | No |
| `candlestick` | Four values per period | 14 | No |
| `waterfall` | 6 or fewer signed steps | 6 | No, and the ceiling forbids it |
| `bar-line-composed` | One count and one rate per period, 6 to 12 | 8 | No, and the ceiling forbids it |

Three forms hold more than thirty marks and none of them has a range to drag. `calendar-grid` is a
fixed year with weekdays down and weeks across, so a window over it would remove the one thing a
calendar is for. `heat-matrix` and `distribution-strip` place marks by category and by group, so
position along the axis is membership rather than a range.

No form in the corpus is dense past thirty points on a continuous axis, and the new form is
documented at six to twelve, so it does not change the answer.

### The reason that survives a raised ceiling

Density is the weaker argument, because a documented shape can be raised. The stronger one is that
the contract already forbids the behaviour. Section 10, under what a handler may not do: "Move a
mark, a label or a printed value. The card floats above the drawing rather than rearranging it."

A range window rescales an axis and moves every mark on it. That is not a borderline reading of
the clause, it is the clause. So even a form dense past thirty could not carry the window without
amending section 10 first, and that amendment would need an argument about what a delivered chart
is rather than an argument about how many points it holds.

### Decision

Refused. Not built, and not left as a gap either: the two reasons are recorded, the second one is
the one to answer if this comes back, and it is a contract question rather than a density question.
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: The scenario audit changes nothing, and the two ramp gate keys stay unrenamed

**Status:** Accepted
**Date:** 2026-09-03

### The audit

Six deliveries read against the headline-as-argument rule, verdict and quoted headline each, in
the implementation summary. All six pass. Every filename names a scenario, and every headline
states a conclusion with something at stake rather than labelling a chart.

The failure mode this criterion was written against is the more likely one. The six already looked
correct, so the temptation was either to skip the reading or to invent a rewrite that justified the
task, and D5 forbids the second in as many words. The finding is that the recommendation was
already satisfied, and the evidence is six quoted headlines rather than an assertion that they were
fine.

### The ramp gate keys

Phase 006 left `rampDarkestOnSurface` and `rampLightestOnSurface` unrenamed, with the target names
written down and one blocker: the check reads the keys by name and was the one file that phase
could not touch. This phase can touch it, so the blocker is gone.

The rename is still not done, and the reason is now scope rather than reach. It appears in no
requirement, in no acceptance row and in no file list this phase owns, and a three-file edit taken
on because it became possible is exactly the drift the packet's own rules refuse. It is recorded
in the changelog as the one thing this release deliberately carries forward, with both target
names and all three files, so the next reader has a decision to make rather than a discovery.
<!-- /ANCHOR:adr-007 -->
