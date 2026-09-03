---
title: "Decision Record: The interaction layer for the chart corpus"
description: "The two questions this phase had to settle before it could build, and what was decided about each one."
trigger_phrases:
  - "chart interaction decisions"
  - "independent percentages legend"
  - "chart interaction hygiene decision"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/053-chart-visual-overhaul/004-interaction-layer"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Recorded the two decisions the phase's open questions needed"
    next_safe_action: "Read acceptance-criteria.md, which cites both"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates/independent-percentages.html"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-004-interaction-layer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "independent-percentages has no colour key to bring inside the figure"
      - "The hygiene pair is one line, and text stays selectable"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: The interaction layer for the chart corpus

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

Two of the phase's open questions had to be answered before anything could be built. Both
answers narrow the phase rather than widening it, and both are written here because a
criterion elsewhere is superseded by one of them.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: `independent-percentages` gains no legend

**Status:** Accepted
**Date:** 2026-09-03

### The question

Section 10 of `spec.md` left it open. One research lineage listed the form among those that
earn a legend. The corpus describes it as several percentages that share no whole, which is a
set of independent measures rather than a set of series. The plan's per-form table said
`legend: yes`, and said the doubt was to be settled before any legend was built.

### What the file actually does

Each of the five rows draws its own track, prints its own name in the gutter to the left of
that track, and prints its own value to the right of it. Colour carries no identity here: four
rows take the first series role and the fifth takes the emphasis role because it is the row the
headline is about. There is no colour-to-name mapping anywhere in the picture, so there is
nothing for a key to publish.

### Decision

The form gains no legend, no dim and no tooltip, which leaves it with nothing a pointer can
reach and therefore no hygiene line either. It joins the untouched set.

The reason is the corpus's own, already written against `unit-grid` in the same table: every
part carries its own label beside its block, so there is no detached key to bring inside the
figure. A legend on this form would be a second copy of five names that are already printed
where the reader is looking.

### What this costs

The legend count drops from five to four and the hygiene count from thirteen to twelve, which
is the outcome section 10 of `spec.md` predicted for exactly this reading. Two counting
criteria are superseded rather than softened: AC-004 becomes AC-015 and AC-016, which name the
four files that carry a legend and the one that must not, and the goal's legend criterion is
rewritten the same way. Asserting an exact set is stricter than asserting a count, because a
count of four passes on any four files.

---

<!-- /ANCHOR:adr-001 -->

<!-- ANCHOR:adr-002 -->
## ADR-002: The hygiene pair becomes one line, and text stays selectable

**Status:** Accepted
**Date:** 2026-09-03

### The question

The two research lineages disagreed. One adopted focus-outline suppression and text-selection
locking from the vendored source. The other rejected both, on the argument that a delivered
chart is a document rather than a dashboard, so keyboard focus and copyable numbers are
features rather than noise. Section 10 of `spec.md` carried the disagreement forward and left
an operator free to cut the rows outright.

### Decision

The hygiene is one line, not two:

```css
.figure svg :focus:not(:focus-visible) { outline: none; }
```

The focus half is adopted in the narrowed form. `:focus-visible` is the selector that separates
a reader who clicked from a reader who tabbed, so the ring is dropped for the pointer and kept
for the keyboard. Nothing a reader can reach with a keyboard loses its indicator, which is what
the objecting lineage was protecting and what the phase's own D5 requires.

The text-selection half is dropped. `user-select: none` on the drawing would stop a reader
copying a value out of a delivered chart, and the numbers in a delivered chart are meant to be
copyable. The objection is decisive on this half and nothing is lost by honouring it: the marks
that answer a pointer are shapes rather than text, so a drag over them was never selecting an
axis label in the first place.

### What this costs

Nothing measurable. The suppression rule stands in all twelve interactive files. On the five
with a focusable control it does real work. On the seven whose marks answer only a pointer it
is a standing declaration, because those marks are deliberately not keyboard-reachable and the
table under the chart remains the complete reading.

---

<!-- /ANCHOR:adr-002 -->

<!-- ANCHOR:adr-003 -->
## ADR-003: The legend is rebuilt where one already existed

**Status:** Accepted
**Date:** 2026-09-03

### The question

The plan's per-form table says three of the four legend forms carried their key only in the
subtitle. They did not. `grouped-bars`, `stacked-bars` and `stacked-area` already drew a key
inside the figure, left-aligned above the plot, with a thirteen or fourteen unit swatch and a
twelve pixel name. The plan's legend recipe names a right-aligned row with an eight unit
swatch and the name at the tick size, and `tasks.md` item CHK-FIX-001 classes the whole phase
as additive, with no existing mark, label or value changing position.

### Decision

The recipe wins and the existing key is rebuilt to it. CHK-FIX-001 is read as protecting the
data: no mark, no axis label and no printed value moves, and the paint comparison in
`scratch/first-paint.txt` shows the eight forms that gain no legend painting byte-identically
before and after. The key itself is the deliverable of REQ-003, and a criterion about the
interaction layer being additive cannot also forbid building the thing the phase exists to
build.

`parallel-axes` is the fourth, and it is not a row. It names each line where that line ends,
which is a better key than a detached swatch row because it costs the reader no colour
matching. Each name gains an eight unit swatch and becomes the button that drives the dim, so
the form gets the recipe's swatch and its control without losing direct labelling.
<!-- /ANCHOR:adr-003 -->
