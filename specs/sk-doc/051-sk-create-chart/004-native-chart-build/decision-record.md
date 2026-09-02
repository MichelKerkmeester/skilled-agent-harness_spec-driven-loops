---
title: "Decision Record: Phase 4: native-chart-build"
description: "The six foundation decisions the capability analysis deliberately left open: how many colour systems, what varies between them, whether a delivery file carries a shared runtime, what a template may depend on, how the contrast gate is shaped and how the index is checked."
trigger_phrases:
  - "chart colour system count"
  - "chart template dependency decision"
  - "inlined runtime versus hand editable"
  - "chart contrast gate design"
  - "chart catalog resolution"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/051-sk-create-chart/004-native-chart-build"
    last_updated_at: "2026-09-02T12:30:00Z"
    last_updated_by: "phase-4-foundation-implementer"
    recent_action: "Recorded six foundation decisions"
    next_safe_action: "Author the chart forms against the template contract, one catalog row per form"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-4-foundation"
      parent_session_id: null
    completion_pct: 40
    open_questions:
      - "Whether report mode is cut, which would make the assets/reports directory dead"
    answered_questions:
      - "ADR-001: three colour systems, and emphasis is a role rather than a fourth system"
      - "ADR-002: one shared chrome, and only the data roles vary by system"
      - "ADR-003: the palette is inlined declaratively and there is no shared runtime and no build step"
      - "ADR-004: no remote dependency of any kind"
      - "ADR-005: the contrast gate is shaped by what the colour encodes"
      - "ADR-006: the index is structured data inside a document, checked in both directions"
---
# Decision Record: Phase 4: native-chart-build

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> These six decisions cover the foundation alone: the colour system, the template contract and
> the corpus check. The chart forms are authored on top of them and are not decided here.
> Every one of them fills a gap the capability analysis withheld on purpose, so each is an
> invention rather than a reading.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Three colour systems, and emphasis is a role rather than a fourth system

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-02 |
| **Deciders** | Phase 4 foundation implementer |
| **Satisfies** | REQ-002, REQ-005, SC-003 |

---

### Context

The capability analysis describes four colour systems in the reference and withholds every value.
It also records that the reference retired a fifth for overlapping in function with another, and
names the principle behind that retirement: a system that answers a question another system
already answers is a second skin rather than an option.

The four described are a neutral default, a single-hue ramp, a categorical set and a neutral
palette with one accent colour. Applying the retirement principle to that list puts the fourth
one under the same suspicion.

### Decision

Three systems ship: `neutral`, `ordered` and `categorical`. They are separated by what colour
encodes, which is importance, magnitude and category. Emphasis is a required role in all three
rather than a system of its own.

### Why three rather than one

One system was the cheaper move and it fails today, not hypothetically. The first corpus pass
already includes a calendar grid, a stacked composition and a two-level treemap, and each of
those needs either an ordered ramp or a category set before it can be drawn honestly. A purely
neutral palette leaves ordered data and categorical data with no encoding, so the agent forces
the nearest available one and the chart misleads.

### Why three rather than four

A neutral palette with one accent is what `neutral` already produces, because its emphasis value
is the only chromatic colour it defines. The fourth system would have added a name and no answer.

### Alternatives Considered

| Option | Why rejected |
|--------|--------------|
| One system, neutral only | Ordered and categorical data have no honest encoding today |
| Four, matching the reference's count | The fourth is reachable by filling a role, so it is a second skin |
| A system per chart family | Families are a reading contract and colour is an encoding question. Tying them couples two axes that vary independently |

### Consequences

**Positive**: the role vocabulary is exercised by three implementations rather than one, which
is the only real test of whether it holds.

**Negative**: emphasis is now required everywhere rather than optional, so every future system
has to define it. That is the price of the cut and it is the right way round, because a system
that cannot express "this one bar is the point" cannot answer the most common request in the
corpus.

### Implementation

`assets/color/palettes.json` defines all three. `references/color-system.md` carries the rules.
The corpus check computes every gate from the palette file.

<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: One shared chrome, and only the data roles vary by system

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-02 |
| **Deciders** | Phase 4 foundation implementer |
| **Satisfies** | REQ-002 |

---

### Context

The analysis states that only colour role values change between systems, and that the typeface,
the corner radius, the spacing, the layout and the motion stay identical. It does not say whether
the chrome colours themselves are shared or vary, and it withholds every value.

### Decision

The four chrome roles, `surface`, `ink`, `muted` and `rule`, hold identical values in all three
systems. Only `series` and `emphasis` change. The three systems are therefore three data
palettes layered on one ground.

The series role is a single ordered array in every system, and the system's `encodes` field says
what its order means. That collapses what could have been three roles, a ramp, a category set and
an importance ladder, into one role read three ways.

### Alternatives Considered

| Option | Why rejected |
|--------|--------------|
| A ground tinted per system | Three grounds make three charts look like three products, which is the failure the shared vocabulary exists to prevent |
| Separate `ramp`, `category` and `series` roles | A template would then branch on which role its system filled. One array plus a declared meaning removes the branch |

### Consequences

**Positive**: a system swap is one palette block, and a template needs no knowledge of which
system it is rendering under.

**Negative**: a brand palette with a strong ground cannot be expressed without extending the
chrome, which is a change to the contract rather than a configuration. Recorded as a known
limitation rather than solved ahead of a request.

### Implementation

`chrome` sits outside `systems` in the palette file, which is what makes the sharing structural
rather than a convention three copies happen to follow.

<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The palette is inlined declaratively, with no shared runtime and no build step

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-02 |
| **Deciders** | Phase 4 foundation implementer |
| **Satisfies** | REQ-002, NFR-P01 |

---

### Context

This is U-03 from the capability analysis, left open there because it reads as an operator
preference. It has to be resolved before anything can be built.

Two properties are load-bearing and they appear to conflict. A template opens in a browser with
no install and no build step. A delivered file stays hand-editable after it lands. The analysis
frames the tension as a choice between duplicating every value across every file, which is what
the reference does and holds in line with a linter, and inlining a small shared runtime at
generation time, which keeps one source of truth and costs a generation step.

### Decision

Neither, because the dichotomy is false once the inlined thing is declarative rather than
executable.

Each template carries the palette inline as a `:root` block of CSS custom properties, between
`CHART_PALETTE` sentinels. `assets/color/palettes.json` is the single source of truth. The corpus
check parses the block, compares it against the source in both directions and prints the exact
correct block when they disagree. No template imports anything, no generation step exists, and
the delivered file is editable end to end by a person.

The half of the tension that is real is the executable half. An inlined runtime of helper
functions is the part a recipient cannot usefully edit. Values named at the top of the file are
the part they most want to.

### Alternatives Considered

| Option | Why rejected |
|--------|--------------|
| Hardcode values per template with no source of truth | This is the reference's model without the linter, and the analysis measured what it costs: two shared modules declared authoritative and imported by nothing |
| A generator that inlines a runtime at delivery time | Buys a single source for drawing code and costs a build step the contract exists to avoid. No caller needs shared drawing code yet, because the corpus is empty |
| A `--fix` mode on the checker | The failure message already prints the block to paste, which is the whole of what a fixer would do |

### Consequences

**Positive**: one palette edit is mechanical, because the check names every file that drifted and
prints the replacement. The file a user receives has no machinery in it.

**Negative, and accepted**: drawing code is duplicated per template. A change to shared drawing
behaviour is an edit in every file that has it. That cost is real and it lands on the corpus
authors rather than on the reader, which is the right way round for this artifact. If it becomes
painful at 19 forms, the answer is a generation step and the palette block model survives it
unchanged.

**Also accepted**: three near-identical palette sheets exist, one per system, because a system
with no file is a system nothing has ever rendered.

### Implementation

Sentinels, the comparison and the printed replacement all live in `scripts/check-corpus.cjs`.
The workflow is documented in `references/template-contract.md` section 5.

<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: A template depends on nothing

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-02 |
| **Deciders** | Phase 4 foundation implementer |
| **Satisfies** | REQ-002, NFR-S01 |

---

### Context

The analysis lists four dependency tiers a template can sit in: nothing, a charting library from
a public CDN, a web font from a font CDN and geographic boundary data fetched at runtime. It
measured the reference at 25 of 50 templates loading a font and 18 loading a charting library,
and concluded that "opens with no build step" is true of all of them while "runs offline" is true
only of the hand-written subset.

### Decision

No remote dependency of any kind. No charting library, no web font, no icon set, no boundary
data. Marks are drawn as inline vector output by the file's own script, and typography uses a
system font stack.

### Why the stricter line

The no-install property is worth having for a reason, and the reason is that the file has to open
for somebody who was emailed it. A CDN turns "it opens on a double click" into "it opened on a
double click while the network was up and the host still existed". Half a property is worth less
than it looks, because nobody can tell from the file which half they have.

This also settles U-05, which asked which charting library the library-drawn path should use. The
path does not exist, so the question does not arise.

### Alternatives Considered

| Option | Why rejected |
|--------|--------------|
| Allow a font CDN | A system font stack is close enough, and the fallback path is the one most readers would silently get anyway |
| Allow one charting library | It buys the dense forms the analysis already recommends leaving out, and it costs the offline property for every form including the simple ones |

### Consequences

**Positive**: every file in the corpus behaves identically offline, and the licensing exposure
this phase exists to avoid gets no second entrance through a bundled dependency.

**Negative**: each form is hand-drawn, which is more work per form. Forms that genuinely need a
layout engine, such as dense node-link networks, stay out of the corpus rather than entering it
with a library attached. The analysis independently recommends leaving those out.

### Implementation

The `no-external` check fails any remote `src` or `href`, any `@import` and any `fetch`,
`XMLHttpRequest` or dynamic `import`.

<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: The contrast gate is shaped by what the colour encodes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-02 |
| **Deciders** | Phase 4 foundation implementer |
| **Satisfies** | REQ-002, SC-003 |

---

### Context

The analysis states the accessibility rule as a flat gate: 4.5 to 1 for body text and small
labels, 3 to 1 for large text and for adjacent data shapes. It also records that the reference
states this most firmly and enforces it nowhere, with no contrast or luminance logic anywhere in
its scripts.

Implementing the flat reading exposes two arithmetic problems it hides.

First, a pairwise 3 to 1 requirement between data shapes is unsatisfiable past two values. On this
ground, separating luminances by a factor of three twice runs out of room before a third value,
so four categories cannot all clear a pairwise gate. Measured, not asserted.

Second, requiring 3 to 1 of every step in a sequential ramp deletes the light end of the ramp,
which is the half that encodes "low".

### Decision

Three parts.

**Shapes that touch carry a separator stroke in the surface colour.** Stacked segments, pie
slices and treemap cells never share an edge with another data colour. The adjacent colour of
every mark is therefore the ground, and the pairwise gate dissolves into the surface gate.

**The gate is selected by the system's `encodes` field.** An `importance` or `category` system
has every series value clear 3 to 1 against the surface, because its marks are identified one at
a time. A `magnitude` system holds its darkest step to 3 to 1, requires strict monotonic
lightness, requires 1.3 to 1 between adjacent steps for rank readability, and requires the
lightest step to clear 1.15 to 1 so a low cell is distinguishable from an empty one.

**The gridline role is ungated, and the exemption says so where the gates are defined.** A
gridline pushed to 3 to 1 competes with the data drawn over it and carries nothing a reader has
to recover.

### Alternatives Considered

| Option | Why rejected |
|--------|--------------|
| Flat 3 to 1 on every value including pairwise | Arithmetically unsatisfiable past two categories on a light ground |
| Drop the pairwise idea and say nothing about touching shapes | Two similar fills sharing an edge read as one shape, which is the failure the pairwise rule was reaching for |
| Gate the gridline too | Produces a heavy grid that competes with the data, trading a real design defect for a rule nobody asked for |

### Consequences

**Positive**: every threshold is computed from the palette file on every run, so the check cannot
go stale against the values it guards. The measured margins are recorded in the foundation record.

**Negative**: the separator stroke is now a drawing obligation on every form that stacks or packs
shapes. It is written into the colour system document, and a form that omits it will pass the
check while looking wrong, which is a review question rather than a machine one.

### Implementation

`palette-source` in `scripts/check-corpus.cjs`. The thresholds live in `gates` in the palette
file, alongside the named exemption.

<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: The index is structured data inside a document, checked in both directions

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-02 |
| **Deciders** | Phase 4 foundation implementer |
| **Satisfies** | REQ-003, SC-002 |

---

### Context

The analysis records the reference's two worst validator traps. It asserts that specific
natural-language sentences appear in its own documentation, which is why translating that
documentation broke its own build. It also asserts that catalog rows exist without ever checking
that they point anywhere, and the measured result is that 46 of 61 code blocks carry labels the
catalog never resolves to.

The analysis also gives the rule that avoids both: carry the fact in structured data the document
renders from, and check the data.

### Decision

The catalog is one markdown table inside `references/catalog.md`, wrapped in
`CHART_CATALOG` sentinels. The check locates the table by the sentinels, matches columns by
header name rather than by position, and reads the `id` and `file` columns. It then resolves the
index in both directions: every row reaches a file whose own identity tag carries the same id,
and every chart form on disk appears in a row.

No check anywhere asserts that a particular sentence, phrase or row text appears in any document.
Prose outside the sentinels is free to be rewritten.

### Why one table rather than a data file plus a rendered view

A separate `catalog.json` with a markdown view would be a second copy and it would drift, which
is the defect this decision exists to prevent. A markdown table with a fixed column contract is
already structured data. Parsing it generically is the opposite of asserting on its text.

### Alternatives Considered

| Option | Why rejected |
|--------|--------------|
| A JSON index plus a generated markdown view | Two artifacts to keep in step, and a generation step ADR-003 removed |
| A fenced JSON block inside the document | One artifact, but an agent picking a chart reads a table better than a blob |
| Check the forward direction only | This is the reference's exact defect. A row that exists is not a row that points anywhere |

### Consequences

**Positive**: renaming a template fails loudly with a message about the rename. Reformatting the
prose around the table changes nothing.

**Negative**: renaming a column header breaks the parse. That failure is loud and its message
names the headers it found, which is the tradeoff taken deliberately over matching by position.

### Implementation

`parseCatalog` and `checkCatalogResolves` in `scripts/check-corpus.cjs`, proven able to fail in
both directions by breaks 3 and 4 in the foundation record.

<!-- /ANCHOR:adr-006 -->

---

## RELATED DOCUMENTS

- **Foundation record and measurements**: See `research/foundation-record.md`
- **Capability analysis this phase built from**: See `../002-translation-and-voice/research/capability-analysis.md`
- **Licence ruling**: See `../001-source-inventory-and-placement/decision-record.md`, ADR-002
- **Specification**: See `spec.md`

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Report mode is cut, and the directory holding it goes with it

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-02 |
| **Deciders** | Orchestrator, under an instruction to continue open work autonomously |

### Context

The reference ships a report mode carrying twelve page layouts. The capability analysis
recommended cutting it, and the foundation phase left the question open because nothing
measurable settles it.

Two things settle it now. The licensing decision means the layouts cannot be carried across,
so keeping report mode means authoring twelve page designs from nothing. And no request for
this repository has ever asked for one. That is a large build serving a hypothetical.

### Decision

Report mode is out of scope. `assets/reports/` is removed rather than left empty, because an
empty directory named for a feature reads as unfinished work rather than as a decision.

### Consequences

The chart corpus delivers single charts. A reader wanting a multi-chart page composes one, and
if that turns out to be common the decision is cheap to revisit, since nothing was built on the
assumption that it stays cut.
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: The examples directory holds deliveries, one per family

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-02 |
| **Deciders** | Orchestrator, under an instruction to continue open work autonomously |

### Context

The foundation phase flagged that `assets/examples/` has no clear owner, since the palette
sheets already serve as worked examples and the gallery-versus-delivery split means anything
placed there has to be a delivery rather than a catalogue page.

### Decision

`assets/examples/` holds one finished delivery per chart family: a file shaped exactly as a
recipient receives it, chosen to show the family at its most characteristic. The palette sheets
stay where they are and keep their own job, which is proving the colour system rather than
demonstrating a chart.

The forms author owns filling it, since only that author knows which form is most
characteristic once the corpus exists.

### Consequences

A reader gets one honest sample per family without opening the whole corpus, and the directory
has a rule that says when it is finished rather than growing by accretion.
<!-- /ANCHOR:adr-008 -->
