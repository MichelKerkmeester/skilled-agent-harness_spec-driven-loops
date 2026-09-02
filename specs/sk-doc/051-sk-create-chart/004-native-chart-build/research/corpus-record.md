---
title: "Corpus Record: The Chart Forms, What They Cover and What Was Left Out"
description: "The twenty authored chart forms and six deliveries, how the count reconciles against the capability analysis, the decisions taken where the analysis withheld an answer, and the eight defects the eye caught that every automated check passed."
trigger_phrases:
  - "chart corpus record"
  - "chart form coverage"
  - "chart forms left out"
  - "chart visual pass defects"
importance_tier: "important"
contextType: "implementation"
---

# Corpus Record: The Chart Forms, What They Cover and What Was Left Out

This records the chart forms alone. The colour system, the template contract and the corpus check
are the foundation layer, and `foundation-record.md` covers them.

Everything below was built from `../../002-translation-and-voice/research/capability-analysis.md`.
The reference tree was not opened at any point during this work.

---

## 1. WHAT WAS BUILT

Twenty template files under `assets/templates/`, one catalog row each, plus six finished
deliveries under `assets/examples/`, one per question family.

### The first pass, by family

| Family | Forms |
|---|---|
| comparison | `bar-rows`, `bar-columns`, `grouped-bars` |
| composition | `unit-grid`, `unit-ring`, `stacked-bars`, `independent-percentages`, `treemap` |
| time | `daily-line`, `daily-range`, `calendar-grid`, `waterfall`, `progress-single` |
| distribution | `distribution-strip` |
| relationship | `scatter` |

### The second pass

| Family | Forms | Why it has no substitute |
|---|---|---|
| time | `candlestick` | No general form encodes four values per period this compactly |
| time | `stacked-area` | A stacked bar loses the continuity and a line set loses the total |
| distribution | `box-plot` | A five-number summary is a different claim from a cloud of records |
| relationship | `parallel-axes` | Below six dimensions nothing else shows an entity's whole profile at once |
| matrix | `heat-matrix` | Two discrete dimensions by value has no one-dimensional equivalent |

### The deliveries

| File | Family | Form | Why this one is the most characteristic |
|---|---|---|---|
| `staff-hours-by-service.html` | comparison | `bar-rows` | The analysis calls the horizontal bar the safest chart in existence, and word-shaped category names are the common case rather than the exception |
| `where-the-budget-went.html` | composition | `unit-grid` | The family's whole argument is that a grid of countable marks beats a pie for any share a reader has to compare, so the grid is the argument rather than an example of it |
| `orders-after-the-price-change.html` | time | `daily-line` | The most requested shape in the family, so it shows the family doing its ordinary work rather than handling an edge |
| `pick-times-by-depot.html` | distribution | `distribution-strip` | Its honesty claim, that every record is on the chart, is the claim the whole family rests on |
| `van-age-against-repair-cost.html` | relationship | `scatter` | The only first-pass member, and the two-variable question is what the family means |
| `calls-by-day-and-hour.html` | matrix | `heat-matrix` | Weekday by hour is the shape operations teams receive, which is the matrix at work rather than in the abstract |

A delivery differs from a template in four places and nowhere else: a headline that states a
conclusion about real numbers, a subtitle that describes this chart rather than the form, a source
line naming a real extract, and a data block carrying real figures. The drawing code is the same
code, which is the point of having a form at all.

---

## 2. HOW THE COUNT RECONCILES

The analysis recommends fourteen forms in the first pass and five more in the second. This corpus
holds twenty files for those nineteen forms.

The extra file is the first item on its list. "Comparison across few categories in both
orientations" is one form and two files, because the orientation is decided by whether the
category names are words or codes and a reader picking a chart needs both files to exist. They
carry separate catalog rows for the same reason.

Nothing else was added and nothing was dropped.

---

## 3. DECISIONS TAKEN WHERE THE ANALYSIS LEFT A GAP

Three, recorded as ADR-009 through ADR-011 in `../decision-record.md`. Each fills a gap rather
than reading an answer out of the analysis.

| Gap | What was decided |
|---|---|
| The analysis uses "family" for a reading contract, and only one reading register ships | A family here is a question group, and the catalog carries it as a column |
| Nothing said how a label sitting on a coloured mark picks its own colour | The file computes it at runtime from the resolved palette value |
| A form needs demo data and nothing may call the platform random function | The numbers are literal in the data block, and any spacing derived from a record's position uses an integer mixer |

---

## 4. WHAT WAS DELIBERATELY LEFT OUT

| Left out | Why |
|---|---|
| The close-read register, as a second visual register | The analysis recommends one register first and names the trade-off. Two full registers is roughly double the corpus for a distinction most requests never exercise |
| Every animated form | Racing bars, streaming series and drawn-in counters are demo formats for video. They answer no question a static chart does not |
| Geographic charts | They need boundary data fetched at runtime, which ADR-004 forbids outright |
| Node-link networks and flow diagrams | They need a layout engine, and ADR-004 says a form that needs a library leaves the corpus rather than entering it with one attached |
| The packed swarm, the density outlines and the histogram | All three are distribution forms, and the strip plus the box already answer the two distribution questions a general request arrives with. The third would be added on a request rather than ahead of one |
| The radial time-of-day layout | Its encoding is overlapping opacity, and every mark in this corpus is drawn at the opacity its contrast gate was computed for |
| The funnel and the ranking-over-time strip | The analysis says the funnel has to be refused more often than it is offered, and that the ranking strip is a static substitute for something that wants animation |
| Report mode | ADR-007 cut it |

The corpus is sized by data-shape coverage rather than by chart count. Every question in section 4
of the analysis that a general request arrives with now has a row. The ones without a row are
listed above with the reason, so a later reader can tell a decision from an omission.

---

## 5. VERIFICATION

### The automated gate

**OBSERVED.** `node scripts/check-corpus.cjs --render`, from the final state:
`RESULT: PASSED`, exit 0, 28 files scanned with 20 chart forms under `assets/templates`, fifteen
checks each reporting an assertion count and zero failures.

The catalog check was watched failing in the direction that matters most here. Every template
authored before its catalog row existed produced `RESULT: FAILED` naming the file and its
identity, which is the second of the two directions ADR-006 exists to cover.

### The visual pass, which is the part that mattered

Every template was opened from a `file://` URL in a browser and the rendered page was read.
**OBSERVED**, eight defects across seven files, none of them caught by any static check and none
of them caught by `--render`:

| Form | What was wrong | Fixed at |
|---|---|---|
| `bar-rows` | The longest bar's value label ran past the edge of the drawing | The bar area was too wide for a label drawn outside it |
| `bar-columns`, `grouped-bars`, `daily-line` | The axis ladder stepped from five to ten with nothing between, so the tallest bar filled half the plot | The ladder, which now carries eight rungs |
| `grouped-bars` | The lighter bar was the current period, which contradicts both the subtitle and the rule that lightness ranks importance | The class the drawing code assigns per series |
| `treemap` | The last group's label ran off the right edge, and its leaves were below the width at which labels are drawn | The label anchor, which now flips when the column would overflow |
| `treemap` | The headline said a third of the bill and the data said nearly half | The headline |
| `daily-line` | The last tick label was centred on the plot edge and clipped | The anchor of the first and last tick |
| `scatter` | The vertical axis name was a sentence under the chart, clipped by the card | Replaced with a rotated label on the axis |
| `distribution-strip` | The headline said the cohort was not slower, and its median is above the first cohort's | The headline |
| `parallel-axes` | Two axis names overlapped, and staggering them collided with a legend that turned out to be redundant | The stagger, and the legend was removed because every line is already named where it ends |

Three of those are wrong claims in a headline rather than drawing faults. That is the failure mode
worth naming: a chart renders perfectly while its headline contradicts the numbers beneath it, and
no check in this packet looks at that. It is a review question and it stays one.

### The one failure that was not a chart

**OBSERVED.** Render failures appeared in four runs across the session, reported as "the browser
did not return a document". They landed on four different files, and every one of those files
passed the same check in another run.

Diagnosed rather than assumed, in three steps. All 29 files were run through the exact command the
check issues, serially from a shell: 29 succeeded and 0 failed. The same 29 were then run the way
the check runs them, from Node with the same arguments: 29 succeeded and 0 failed. Giving each
launch its own profile directory was tested and made no difference except to slow the run down,
which rules out profile contention.

What separates a clean run from a red one is what came before it. Every clean run followed a pause.
Every red run was issued immediately after other browser work. So the failure is Chrome
intermittently refusing to start under sustained back-to-back headless launches on this machine,
and the check reports the symptom because it discards the browser's own error stream.

That distinction matters for anyone reading a future red run. A render failure that names a
different file each time and does not reproduce by hand is the browser, and the answer is to
re-run after a pause. A render failure that reproduces on the same file is a chart drawing
nothing, which is the failure this mode exists to catch.

---

## 6. NOTHING HERE TRACES BACK TO THE REFERENCE

The reference tree was never opened. The scan tests the output against the withholding table in
section 1 of the capability analysis, which is the only available check.

| What the analysis withheld | What is in the output |
|---|---|
| The reference's coined chart names | Every form is named in standard vocabulary or by what it draws: `bar-rows`, `unit-ring`, `waterfall`, `heat-matrix` |
| Its per-chart table columns | The catalog's columns are `id`, `family`, `question`, `data shape`, `system` and `file`, chosen for the two-way resolution check |
| Its card headlines | Every headline here was written for demo data invented here |
| The markup, the class names and the stylesheet | Written here, on the skeleton the foundation phase authored |
| Easing names, timings and the reveal helper | No form animates. The reduced-motion rule stands for any form that later does |
| The twelve report layouts | None. ADR-007 cut report mode |

**OBSERVED.** No colour literal outside a palette block anywhere in the package, which the
`colour-literals` check asserts 878 times. No occurrence of the reference project's name.

**The one thing this cannot prove**, unchanged from the foundation record: independent creation is
what was done and non-collision is what cannot be checked, because checking it would mean opening
the clone.

---

## 7. UNKNOWNS

| # | UNKNOWN | The check that would settle it |
|---|---|---|
| C-01 | Whether the six families are the right shelves, or whether a reader looking for a chart thinks in different groups | Watching real requests route through the catalog. The grouping is a reading aid rather than a contract, so it is cheap to change |
| C-02 | Whether twenty forms leaves a common question without a row | The first request that reaches the catalog and finds nothing. Section 4 lists what was skipped and why, so that report has somewhere to land |
| C-03 | Whether the per-template duplication of drawing code has become painful | The first change that has to be made in all twenty files at once. Four of them already share a copy of the same axis ladder, which is where that pain would first show |
| C-04 | Whether a headline that misstates its own numbers would survive review | Nothing in this packet checks it, and three were caught here by reading the picture. A second reader is the only control |
| C-05 | Whether the render check should run by default | Running the corpus check on a machine with no browser. Today it is opt-in so a missing browser can never look like a silent skip |

---

## RELATED DOCUMENTS

- **The foundation this was authored on**: See `foundation-record.md`
- **Decisions**: See `../decision-record.md`
- **Capability analysis this was built from**: See `../../002-translation-and-voice/research/capability-analysis.md`
- **Specification**: See `../spec.md`
