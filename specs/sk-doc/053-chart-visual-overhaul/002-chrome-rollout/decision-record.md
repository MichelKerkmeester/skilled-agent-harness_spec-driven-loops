---
title: "Decision Record: Roll the settled chrome across the whole chart corpus"
description: "Why every printed number binds to the corpus formatter, why the corner radius becomes a token ladder with a check behind it, and why one chrome row is carried without being applied."
trigger_phrases:
  - "chart chrome decisions"
  - "chart radius token decision"
  - "chart formatter binding"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/053-chart-visual-overhaul/002-chrome-rollout"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Resolved ADR-005 to Route B and added ADR-006"
    next_safe_action: "Hand phase 003 a corpus whose chrome is settled and whose corners are enforced"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json"
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-002-chrome-rollout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "ADR-001: every number binds to the corpus formatter"
      - "ADR-002: the ladder is the change and tokens make it checkable"
      - "ADR-003: the mono face is a system stack"
      - "ADR-004: round tick dots are carried and not applied"
      - "ADR-005: Route B, the rungs live beside chrome rather than inside it"
      - "ADR-006: a fill that carries a value does not fade"
---
# Decision Record: Roll the settled chrome across the whole chart corpus

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Every printed number binds to the corpus formatter, never to a locale-dependent one

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-03 |
| **Deciders** | Both research lineages, phase 2 implementer |
| **Satisfies** | REQ-003, REQ-004 |

---

### Context

The vendored source sets tooltip values in a mono face with tabular figures at
`src/registry/ui/recharts-tooltip.tsx:152-156`, and formats them with `toLocaleString` on the same
line. One lineage adopted the whole line in its first iteration. Its fourth iteration inspected
the corpus formatter and reversed itself, and the other lineage arrived at the same correction
independently.

The corpus formatter at `assets/templates/daily-line.html:122` fixes the thousands separator to a
comma rather than reading the host locale, rounds at six decimals to strip the dust binary
arithmetic leaves on an axis step, and prints an em dash for a value that is not a finite number.
A delivered file has to look on the machine that opens it exactly as it looked on the machine that
made it.

### Decision

The corpus adopts the visual treatment and rejects the formatting call. Every number keeps going
through the file's own `fmt`, and `toLocaleString` appears nowhere in the corpus.

### Consequences

- A chart emailed to a reader in another locale prints the same digits as the one the author saw.
- The mono treatment lands without touching the value pipeline, so the label diff after this phase
  should be empty apart from the face itself.

### Alternatives Rejected

- **Adopt the vendored line whole.** It would make grouping depend on the reader's operating
  system, which contradicts contract rule 12 and the reason the formatter exists.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The radius ladder is the change, and tokens are what make it checkable

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-03 |
| **Deciders** | Both research lineages, phase 2 implementer |
| **Satisfies** | REQ-006 |

---

### Context

The two lineages split on the corner radius and the split resolves by merging rather than by
choosing. One proposed a contextual ladder where a card, a tooltip, a swatch and a bar end each
sit on their own step, citing `src/app/globals.css:47-56` where a single knob drives four steps by
calculation. The other measured the corpus and found `border-radius: 10px` identical across all
twenty forms, then proposed writing that uniformity down as a formal convention.

Writing it down is close to what the corpus already does. The value is repeated twenty times and
nothing asserts that the twenty agree. The packet's own scripts document says a rule the tooling
does not check is a wish.

### Decision

Both land. The ladder is the change, so the corpus gains steps for the surfaces it actually draws.
Tokens are how the ladder becomes checkable, so the values live in the palette source and the
corpus check asserts them the way it already asserts colour.

### Consequences

- A twenty-first form copied from the skeleton inherits the ladder without its author knowing the
  ladder exists.
- A hand-typed corner fails the same way a hand-typed colour already fails.
- The phase pays for a checker change it could have deferred, which ADR-000 in `plan.md` argues is
  the right trade.

### Alternatives Rejected

- **Formalize 10px as a documented convention with no check.** That is the current state described
  more confidently, and the current state is one careless file away from breaking.
- **Ship the ladder and add the check in a later phase.** The later phase would inherit
  twenty-nine files that may already have drifted, with no baseline to compare against.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The mono face is a system stack

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-03 |
| **Deciders** | Both research lineages, phase 2 implementer |
| **Satisfies** | REQ-003, NFR-P02 |

---

### Context

The vendored source reaches its mono face through a bundled web font, declared at
`src/app/globals.css:16`. The template contract at section 5 forbids a web font along with every
other remote dependency, and the reason is stated there: a remote dependency keeps the file
working only while the network is up and the host still exists.

### Decision

The mono role resolves from a system stack. Every operating system the corpus targets ships a
monospaced face with tabular figures, and `font-variant-numeric: tabular-nums` is already in use
in the corpus at `assets/templates/daily-line.html:58`.

### Consequences

- The file still opens on a laptop with no network, which is the property the whole contract
  protects.
- The exact face differs between operating systems, so column alignment is guaranteed and letter
  shapes are not. Alignment is what tabular figures are for.
- Mono advances are wider than the sans advances the current label spacing was tuned against, so
  every width estimate in the corpus needs re-checking against a rendered page.

### Alternatives Rejected

- **Embed a mono face as a data URI.** It satisfies the no-network rule and breaks the
  one-file-a-reader-can-edit property, because the file grows by tens of kilobytes of base64 that
  nobody can read or change.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Round tick dots are carried and not applied

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-03 |
| **Deciders** | Phase 2 implementer |
| **Satisfies** | REQ-009 |

---

### Context

One lineage kept a chrome row proposing round tick dots in place of tick marks, drawn from the
ECharts twin at `src/registry/charts/echarts-line-chart.tsx:775`. The row is real and it survived
that lineage's own sweep, so dropping it silently would lose a recommendation the research paid
for.

The corpus draws no tick marks. `grep -rn 'tick' assets/templates/` returns tick text and nothing
that draws a mark beside it, and the corpus notes elsewhere that it prints no axis lines either.

### Decision

The row is recorded here with its evidence and it is not applied. A replacement needs something to
replace.

### Consequences

- The recommendation stays findable, so a later phase does not rediscover it as a new idea.
- If phase 006 adds tick marks while correcting the contract, this row arrives with them rather
  than as an afterthought.

### Alternatives Rejected

- **Add tick marks so the dots have something to replace.** That inverts the recommendation into a
  reason to add chrome nobody asked for.
- **Drop the row.** A dropped row with no written reason is indistinguishable from an oversight.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Where the radius tokens live

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-03 |
| **Deciders** | Phase 2 implementer |
| **Satisfies** | REQ-006 |

---

### Context

`customProperties` in `scripts/check-corpus.cjs` walks `palette.chrome` and emits one custom
property per key, and `canonicalBlock` prints the result as the exact text every file has to carry
between its `CHART_PALETTE` sentinels. `checkPaletteSource` computes contrast ratios on
`chrome.ink` and `chrome.muted` only, so a non-colour key would flow through without a ratio being
taken of it.

That makes the cheap route available and it does not make it correct. The template contract says
the palette block is the only place in the file where a colour value appears, and a length is not
a colour.

### Decision

**Route B.** The rungs live in a `radius` object beside `chrome` in the palette source, and
`customProperties` emits them into the same block as `--chart-radius-mark` through
`--chart-radius-card`.

Route A was tested rather than reasoned about, because the record said to test it. A rung was added
to `palette.chrome`, the check was run, and the result is in `scratch/route-a-test.txt`: the length
survived `customProperties` and `canonicalBlock` intact, appearing in the printed block as
`--chart-radius-card: 10px;` between the colour properties, and `palette-source` reported the same
22 assertions and 0 failures as the baseline, so no contrast ratio was taken of it. Route A works.

It was still rejected. Phase 005 adds a second copy of this block under a media query, and that
block exists precisely so its values can differ between a light and a dark theme. A corner cannot.
Putting a length inside `chrome` would put a value that must never change into the one structure
whose purpose is to change, and every dark-theme block after this phase would carry five properties
its author has to remember not to touch.

The cost of Route B was five lines in `customProperties` and a five-line sanity rule in
`checkPaletteSource` that fails a rung which is not a pixel length.

### Consequences

- `chrome` still means colour, which is what the contract says it means.
- The block a template carries now holds two kinds of shared value, and the contract says so in the
  skeleton section rather than leaving a reader to infer it from the property names.
- Phase 005's media-scoped block redeclares colours only.

### Alternatives Rejected

- **Route A, rungs inside `palette.chrome`.** Tested and working, rejected on the phase 005 argument
  above. The evidence that it works is kept, because a later phase that wants to move a non-colour
  value into the block should not have to re-run the experiment.
- **A second sentinel pair for a corner block.** A new region, a new comparison and a new failure
  message, to carry five values that the existing region already carries for free.
- **Put the radius tokens in each file's stylesheet outside the sentinels.** That is where they
  already effectively are, and it reproduces the unenforced duplication this phase exists to end.
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: A fill that carries a value does not fade, and a form without a line has no dot language

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-03 |
| **Deciders** | Phase 2 implementer |
| **Satisfies** | REQ-005 |

---

### Context

The A9 row names three forms: `daily-line`, `daily-range` and `stacked-area`. The first was done in
phase 001. Reading the other two against the row rather than against their names changes the answer.

`daily-range` draws one rect per day, from that day's low to its high, rounded to half its own
width. There is no area path in the file and `grep -rn 'fill-opacity' assets/` returns one match in
the whole corpus, in a delivery. A vertical fade across a range bar would say the low end of a
range matters less than the high end, which is the opposite of what the form exists to show.

`stacked-area` draws bands, and a band's fill is its magnitude. The neutral system ranks series by
lightness and the corpus check enforces that ranking with `rampStepSeparation` and
`emphasisAgainstFirstSeries`, computed from the palette source. An opacity ramp painted over those
fills would change the rendered lightness while the gate kept reading the source values, so the
encoding would be corrupted by a change the check certifies as green. That is the exact failure the
packet's own scripts document warns about.

The A7 row names `stacked-area` as well. It draws no marks at all, so there is no one-weight dot
language to make two-weight.

### Decision

A9 reaches a fill that is decoration under a mark that carries the value, and stops at a fill that
is the value. In this corpus that is `daily-line` and its delivery twin
`orders-after-the-price-change`, both of which now fade from the series token at 0.18 to nothing at
the baseline. A7 reaches the same two files.

`daily-range` and `stacked-area` are recorded here as not reached, with the reason, rather than left
looking like an oversight.

### Consequences

- Two files carry the fade instead of the four the row implied, and the two that do not carry it
  each have a written reason.
- The delivery and the form in the line family now look alike, which is the property the six
  deliveries exist to demonstrate.
- AC-007 named three files and is superseded by AC-018, which names the two that draw an area.

### Alternatives Rejected

- **Fade the stacked bands anyway.** It would satisfy the row as written and break the lightness
  ranking the palette gates exist to protect, in a way no check would catch.
- **Fade the range bars anyway.** A range has two real ends. Fading one of them is an encoding, and
  it is one nobody asked for.
- **Drop the row for those two forms with no record.** A row dropped without a reason is
  indistinguishable from a row nobody read.
<!-- /ANCHOR:adr-006 -->
