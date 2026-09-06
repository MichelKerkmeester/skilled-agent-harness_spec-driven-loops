---
title: "Capability Analysis: What the Chart Reference Does, and What to Build From It"
description: "A written description of the reference chart skill, its families, its colour logic, its template architecture, its validator and its defects, written so a later phase can build a native corpus without opening the reference tree."
trigger_phrases:
  - "chart capability analysis"
  - "chart family definitions"
  - "chart corpus sizing"
  - "chart validator design"
importance_tier: "important"
contextType: "implementation"
---

# Capability Analysis: What the Chart Reference Does, and What to Build From It

> The reference is PolyForm Noncommercial and this repository is MIT and public, so nothing
> from it crosses. This document carries the facts and the ideas, in my own words, so the
> build phase never has to open the reference tree.

---

## 1. WHAT THIS DOCUMENT IS, AND THE LINE IT HOLDS

The build phase is forbidden from working with the reference open. This is what it reads
instead. Everything a builder needs to choose a corpus, size it, shape a template, design a
colour system and write a validator is below.

### What I Took and What I Left

Free to use and used freely: counts, family structure, what a chart type is for, what data
shape it wants, what problem a colour system solves, architectural choices and every place
the reference gets something wrong.

Not used, deliberately: its prose, its code, its markup, its stylesheets, its palette values
as a set and any description close enough that someone could rebuild a file from it.

### Where I Described Purpose Instead of Implementation

Five places, named here so a reader can see the choice rather than find it later.

| Subject | What I wrote | What I withheld, and why |
|---|---|---|
| Colour systems | The colour logic each one encodes, the capacity ceiling, the role vocabulary | Every hex value and every ramp ordering. A palette taken whole is the palette, not an idea about palettes |
| Chart forms | The question each form answers, its data shape, where it breaks | The reference's coined chart names, its per-chart table columns and its card headlines. Standard vocabulary such as treemap, ridgeline or candlestick is shared property and I use it |
| Template shape | What a delivery file contains and what it depends on | The markup, the class names and the stylesheet. The shape of a page is an idea. That page is a file |
| Motion | What the entrance behaviour is for and the accessibility duty it carries | The easing names, the timings and the reveal helper's code |
| Report layouts | That a report mode exists, how many layouts it carries and why I recommend leaving it out | The layouts themselves. Twelve page designs are the work product, not a fact about it |

### Provenance

Read from a scratch clone of `https://github.com/larashero3-dotcom/lieflat-charts.git` at
commit `4eef5ce`, plus the English translation of its six main documents that phase 2
produced and then removed from this repository under the same licence reasoning. The clone
and the translation both live outside the repository and neither is copied into it.

Measurements below marked OBSERVED were run against the clone during this phase. Two scripts
were written and thrown away, and their outputs are quoted inline.

---

## 2. THE THREE FAMILIES, AND WHAT DECIDES MEMBERSHIP

A family is not a subject area. It is a reading contract, and the contract is about how long
the reader will look and whether the chart is allowed to aggregate before showing them
anything.

### The Axis That Separates Them

| | Fast-read register | Close-read register |
|---|---|---|
| The mark | A shape. One bar is a whole category | A record. One dot is one row of the data |
| Aggregation | Pre-computed. The chart hands over the conclusion | Refused. The chart lays out the raw material and lets the shape emerge |
| Line weight | Heavy enough to survive a thumbnail | Hairline, and it depends on the reader being close |
| Time budget | Under ten seconds | Thirty seconds and up |
| Where it lives | A dashboard, a weekly summary, a chat message | An annual report, a long article, a poster |
| Who draws it | A chart library, styled | Hand-written vector output |

The reference ships a third family, and it exists for a specific failure. When the data is
only four categories and three percentages, the close-read register has nothing to lay out.
One dot per record, with eleven records, looks threadbare. Its answer is to keep the
close-read grammar and borrow the familiar silhouettes of the fast-read register: a bar
chart whose bars are made of countable ticks, a donut whose ring is made of marks you can
count. From across the room you recognise the chart type. Up close every unit is a unit.

That third family is a technique, not a reading contract. I say so in section 10, and I
recommend against shipping it as a separate family.

### The Four Tests for Membership

A chart belongs to the close-read register when all four hold. Fail one and it belongs in
the fast-read register instead.

1. Every visible mark corresponds to something real in the data or to a stated aggregation.
   A line with no record behind it is decoration.
2. The reader has a reason to spend thirty seconds. A monitoring surface does not.
3. The density is honest. Density comes from the data or from non-data structure the reader
   can tell apart from the data.
4. The shape itself carries the judgment. If the shape only holds numbers and the headline
   does the arguing, the fast-read register is the cheaper answer.

### Two Things That Are Not Families

**Geographic charts.** The reference keeps two of them and gates them hard: a region column
in the data never triggers a map, only an explicit request for one does. That gate is the
right instinct and it is worth carrying. A country column is a join key far more often than
it is a subject.

**Standalone interactive charts.** Three of them, one chart per file, full page, built for
networks and multi-segment flows too dense for a card. They are a different delivery format
rather than a different reading contract.

### Selection Order, and Why It Is Load-Bearing

The reference states a fixed order: audit the close-read register in full, then the sparse
data variant, and reach the fast-read register only when neither fits or the user asked for
a dashboard. It also requires the agent to name at least three candidates it rejected, and
to state why, before it may fall back.

The order is not aesthetic preference. Without it an agent picks the chart it can produce
fastest, which is always a library default, and the whole point of the skill evaporates. The
rejected-candidates rule is the part that makes the order checkable rather than aspirational.
Carry both.

---

## 3. THE COUNT DISCREPANCY, SETTLED

The earlier phase found two chart counts in the reference and could not decide which was
authoritative. Its own skill document says 15, 13 and 18 by family and 49 in total. Its
catalog says 20, 17 and 22 and 64 in total.

I settled it by counting the implemented charts rather than reading either document.

**OBSERVED**, by counting card containers and per-chart code blocks in the four gallery
files:

| Gallery | Cards | Code blocks | Catalog rows |
|---|---:|---:|---:|
| Close-read | 20 | 20 | 20 |
| Sparse-data | 17 | 17 | 17 |
| Fast-read | 22 | 22 | 22 |
| Geographic | 2 | 2 | 2 |
| **Total** | **61** | **61** | **61** |

Add the three standalone interactive charts and the implemented total is 64, which is the
catalog's number exactly.

**DERIVED**: the smaller number counts a different thing. The reference splits each family
into a primary tier and a backup tier, and the primary tiers are the first 15, the first 13
and the first 18 of the three families. That is 46, and 46 plus the three standalone charts
is 49. The two figures never disagreed about what exists. One counts the library and the
other counts what an agent is allowed to reach for without justifying itself.

**Verdict for the build phase.** The catalog is authoritative for what exists. The skill
document is authoritative for what to reach for first. Neither number is a target for us,
and section 10 sizes our corpus on coverage instead.

I'M UNCERTAIN ABOUT THIS: the reference never says "primary tier" where it prints 49, so the
derivation is mine and not the author's stated intent. It reconciles to the digit, which is
strong evidence, and it is still a reconstruction of someone else's arithmetic.

---

## 4. THE CHART FORMS WORTH BUILDING

Organised by the question a reader arrives with, because that is how the choice gets
made. The reference organises by family and then by number, which reads well as a catalog and
badly as a decision aid.

I name forms by their standard vocabulary. Where the reference coined a name, I describe the
form instead.

### Comparison and Ranking

| The question | Data shape it needs | Where it works, and where it breaks |
|---|---|---|
| Which category is biggest | 8 or fewer categories, one value each | The safest chart in existence. Breaks the moment a category label is long and vertical, so prefer horizontal rows when names are words rather than codes |
| Which is biggest, in countable units | Same, plus a unit that means something to a person | Better than a plain bar when the unit is a person, an incident or a currency step, because the reader can count instead of estimating against an axis |
| How this year compares to last | 2 series across 6 or fewer categories | Paired bars work. A connected pair of dots per category works better when the reader cares about the gap rather than the two levels |
| Who moved up the ranking | Multiple entities across discrete time periods | Fine as a static strip of columns. The animated version of this is a demo, not a chart, and it is the first thing to leave out |

### Composition and Share

| The question | Data shape it needs | Where it works, and where it breaks |
|---|---|---|
| How does the whole split up | Parts summing to 100, 6 or fewer | A grid of unit marks beats a pie for any share a reader has to compare. A ring of countable ticks keeps the familiar silhouette and fixes the angle-estimation problem |
| How do the parts stack per category | 4 or fewer categories by 3 or fewer segments | Readable. Past those bounds only the bottom segment is comparable and the chart quietly lies |
| How much of each, when items are independent | Several yes-or-no percentages that need not sum to 100 | Needs its own form, because a stacked bar implies a whole that does not exist. Teams reach for a stacked bar here more often than for any other shape, and it is wrong every time |
| Where did the budget go, across a hierarchy | Two-level hierarchy, non-negative weights | Area encoding reads well down to about 30 leaves. Past that, merge the tail before drawing, because a rectangle too small to click is a rectangle too small to mean anything |

### Change Over Time

| The question | Data shape it needs | Where it works, and where it breaks |
|---|---|---|
| What did the daily number do | One reading per day, 30 days or fewer | A hairline works. Adding an area fill helps when the reader is reading shape rather than values |
| What was the daily spread | A minimum and maximum per day | A range mark per day. Do not average a range into a line, which is the most common quiet dishonesty in this shape |
| What happened across a full year | 52 weeks by 7 days of dates and quantities | A calendar grid, and nothing else in a corpus substitutes for it. This is one of the shapes where forcing a substitute produces the wrong chart |
| How did the composition shift over continuous time | 2 to 5 series over a continuous axis, total also readable | A stacked flowing band. Also unsubstitutable, because a stacked bar loses the continuity and a line set loses the total |
| Where did it open, high, low and close | Four values per period | The market convention exists and readers already know it. No general form encodes four values per period as compactly |
| How far to the target | One value against a goal | A single progress mark. Cheap and constantly requested |
| What was the step-by-step movement from gross to net | 6 or fewer signed steps with a running total | A waterfall. Breaks past about 8 steps because the connectors dominate |

### Distribution

| The question | Data shape it needs | Where it works, and where it breaks |
|---|---|---|
| How are the individual values spread | A few hundred records, one variable, grouped | Jittered points along a strip. Honest, because every record is present |
| What does the spread look like as a summary | Grouped records where a five-number summary is legitimate | The box form. It hides multimodality, which is exactly when you should not use it |
| Where do the values pile up | 40 to 180 records where the piling itself is the point | The packed swarm. Slower to compute and slower to read, so keep it for when the pile is the finding |
| How do several distributions compare in shape | 3 to 8 continuous distributions | Stacked density outlines. Strong at shape comparison, poor at reading any single value |
| How often does each bin occur | One variable, bins with business meaning | A histogram, and only when the bins mean something. Arbitrary binning that produces a nicer shape is the failure mode |

### Relationship, Attribution and Structure

| The question | Data shape it needs | Where it works, and where it breaks |
|---|---|---|
| Do these two variables move together | 20 or fewer points, two dimensions | A scatter. Past a few dozen points it becomes a distribution chart and should be treated as one |
| What connects to what | Networks up to about 15 nodes | Small node-link forms read fine. Above that they need interaction or they are texture |
| How do many things attribute to few | 50 or 60 records collapsing onto a handful of groups | A radial bundle keeps every record visible while showing the collapse. A grouped roster does the same job when the reader needs to read names |
| How much flows from each source to each destination | Two-sided aggregate flow | Width-encoded flow. Do not use it when the reader needs to trace one path, which needs interaction instead |
| Where does the funnel lose people | Monotonically decreasing stage counts | A narrowing form. Refuse it when the stages are not nested, which is more often than people think |
| How does one entity compare across several dimensions | Same entity set across 3 to 6 continuous dimensions | Parallel axes. Unsubstitutable below 6 dimensions and unreadable above them |
| What belongs to what | 2 to 3 level hierarchy, membership only | A tree. Use it when nobody is comparing sizes, and a treemap when they are |

### Matrix and Cyclical

| The question | Data shape it needs | Where it works, and where it breaks |
|---|---|---|
| Which combinations are hot | Two discrete dimensions by value, 100 cells or fewer | A heat matrix. Print the numbers when it has to be read fast, and drop them when the pattern is the finding |
| When in the week does this happen | Weekday by hour by volume | The same matrix with a fixed shape. Common enough in operations work to deserve its own entry |
| When in the day does this happen | Event timestamps within 24 hours | A radial layout where angle is time of day. The one legitimate use of overlapping opacity as a density encoding |

That is 26 forms. Section 10 cuts it further.

---

## 5. THE COLOUR SYSTEMS

### The Problem They Solve

Two problems, and they pull in opposite directions.

An agent producing charts with no colour instruction will either invent a palette per chart,
which makes a set look like it came from four people, or it will use the chart library's
defaults, which are tuned for distinguishability and not for looking like anything. A named
system fixes the first and a considered one fixes the second.

The second problem is that colour is a channel, and a channel spent on decoration cannot
carry data. The reference's central claim is that lightness is the data: the most important
series is the darkest, and the skill assigns multiple series along a lightness ladder by
importance rather than by the order they arrived in. A colour system either preserves that
claim or replaces it with a different one, and it has to say which.

### How Many There Should Be

Four, and the count is not arbitrary. Each one answers a different question about what the
colour means.

| System | What colour encodes | Use it when |
|---|---|---|
| Neutral default | Nothing. Lightness alone carries importance and value | The default, and the fallback whenever the other three would carry no stable meaning |
| Single-hue ramp | Position on an ordered scale | The data is ordered: a value, a rank, a time position, a progress figure |
| Categorical hues | Category membership | The categories are unordered and there are 4 or fewer of them |
| Neutral plus one accent | Emphasis, nothing else | You want restraint and exactly one thing to stand out |

The reference ships these four and retired a fifth for overlapping in function with the
categorical one. That retirement is the useful signal: a system that answers a question
another system already answers is not a fifth option, it is a second skin.

### What Varies Between Them, and What Does Not

Only the colour role values change. Typeface, corner radius, spacing, layout and motion stay
identical across all four, which is what makes a set of charts in different systems still
read as one product.

Every system defines the same roles, and a chart takes its colours from the role rather than
from a raw value. Background, foreground text, muted text, gridlines and the main data colour
are required in all of them. Three more appear when the data needs them: an emphasis colour,
an ordered ramp and a categorical set. A custom palette built from user-supplied brand
colours defines the same roles or it is not a palette, it is a pile of hex.

I am not reproducing any values. What a builder needs is the role list, the capacity ceiling
and the derivation rule below.

### The Rules Worth Carrying

**Capacity is a hard ceiling.** Four unordered categories is comfortable, five or six is a
stretch. Past six no categorical palette works and the answer is to go neutral. Stating
the ceiling in the skill is what stops an agent generating an eleven-hue chart on request.

**One system per delivery.** A single file or a single set of sibling charts locks one system.
If one chart in the set cannot be expressed in the chosen system, the set changes system or
goes neutral. Recolouring the one exception is what makes a deck look assembled from parts.

**Derive light and dark, never introduce a hue.** Lighter values come from mixing the chosen
colour toward the background and darker values from mixing it toward the text colour.
Borrowing a value from another system to fill a gap breaks the encoding, because the borrowed
value carries the other system's meaning.

**Colour is never the only cue.** Categories keep labels, ordered data keeps position or
length and emphasis keeps a headline. With colour removed the chart still has to be readable,
which is both an accessibility floor and a hedge against a reader printing it in greyscale.

**Contrast is a gate, not a preference.** Body text and small labels need 4.5 to 1 against
their background and large text needs 3 to 1. Adjacent data shapes and interaction states need
3 to 1 against each other. When a user-specified brand colour fails, adjust lightness rather
than changing their hue.

That last rule is the one the reference states most firmly and enforces least. Section 7
covers what that costs.

---

## 6. WHAT A TEMPLATE IS

### The Delivery Unit

One HTML file. It opens on a double click. There is no build step, no package manager, no
bundler and no install. The person receiving it is a writer or an operations analyst, not a
developer, and the file has to survive being emailed.

Inside, the visible unit is a card with four parts in a fixed order: a headline that states a
conclusion rather than a chart type, a subtitle carrying the legend and the time range, the
chart itself and a source line. The fixed set of four is what makes a chart legible without
a caption, and the headline rule is the highest-value writing rule in the whole reference. A
chart titled "Revenue by plan" is a chart. A chart titled "Where we gained, where we bled" is
an argument.

### What It Depends On

| Dependency | When it applies | Consequence |
|---|---|---|
| Nothing | Hand-written vector charts | Opens offline, forever, on any browser |
| A charting library from a public CDN | Anything the library draws better than hand-written output would | Needs network on first open, and the CDN has to still exist |
| A web font from a font CDN | The typography rules as written | Needs network, and degrades to a fallback stack rather than breaking |
| Geographic boundary data fetched at runtime | Geographic charts only | Needs network every time, and is the most fragile dependency in the set |

**OBSERVED**, across the reference's 50 templates: 25 reference a font CDN, 18 load one
charting library, 4 load a second and every one of the 50 carries a viewport meta tag.
"Opens with no build step" is true. "Runs offline" is true only for the hand-written subset.

### How It Receives Data

One named array near the top of the inline script, immediately under a comment marking it as
the only part the user changes. Everything below is rendering. That is the whole contract,
and it is the right one, because the person editing it is looking for the numbers and nothing
else.

Demo data is generated by a seeded pseudo-random helper rather than by the platform random
function, so a refresh produces an identical picture. That sounds fussy until a screenshot
review compares two renders of the same file and finds them different.

### Gallery Versus Delivery

The reference keeps two shapes and they are easy to conflate. A gallery is many cards on one
page, used as a reference to find a form and read its code. A delivery is one card in one file,
assembled on a documented skeleton. What reaches the user is always a delivery. The gallery is
the workbench.

Getting this distinction into the skill early matters, because an agent that hands over a
gallery has handed over 22 charts of demo data with the user's one real chart somewhere inside.

### What No Build Step Constrains

The cost is duplication, and it is not small. With no module system, every template carries its
own copy of the helpers, the stylesheet and the colour values. **OBSERVED**: the reference
publishes two shared modules, one for its neutral design tokens and one for its colour presets,
and not a single template imports either. The token module is referenced by name in the skill
document and by nothing else in the tree. The colour module is loaded only by the validator,
which executes it in a sandbox to learn which colour values each system is allowed to use.

So the shared modules are a specification that a linter checks, not a library that code calls.
Change one token and 50 files change. That is a real design decision with a real price, and the
build phase should take it deliberately rather than inherit it. The alternative, a small runtime
the delivery file inlines at generation time, keeps one source of truth and still ships a single
file. It costs a generation step the reference does not have.

---

## 7. WHAT THE REFERENCE'S VALIDATOR CHECKS

A structural validator of about 320 lines, run over the whole tree. It is worth studying in
both directions, because roughly half of it is the right idea and the other half is a trap.

### The Checks Worth Copying as Ideas

| Check | The failure it prevents |
|---|---|
| Parse every inline script with the JavaScript engine's own compiler | A template that throws on open. A syntax error in generated markup is invisible until someone opens the file, and this catches it in a second |
| Flag duplicate element ids per file | Two charts silently rendering into the same container. This is the single most common failure when assembling a card from a gallery |
| Ban the platform random function in executable code, with comments stripped first | Non-reproducible renders. Stripping comments before matching is the detail that stops it firing on documentation |
| Derive the allowed colour values for a themed file by executing the palette module and collecting every value it defines | Colour drift. The allowed set is computed from the palette rather than restated in the test, so the test cannot go stale |
| Flag any hex in a neutral-themed file whose maximum and minimum channels differ by more than a fixed threshold | A colour leaking into a greyscale chart, caught numerically without maintaining a list of permitted greys |
| Require every generated page to be a complete document with a title | A fragment shipped as a deliverable |

The fourth and fifth are the two I would carry with the least modification. Both replace a
list somebody has to maintain with a property somebody cannot forget.

### The Checks That Are Traps

| Check | Why it is a trap |
|---|---|
| A hardcoded list of every required file path, including twelve preview images | It encodes the current layout as a rule. Renaming anything means editing the validator, and the validator has no way to tell a deliberate rename from a deletion |
| Assertions that a specific natural-language sentence appears in the skill document | This is the one that matters. Two of its assertions require exact Chinese strings in the prose, so any faithful translation fails the build. A test that asserts on prose forbids editing the prose |
| Assertions that specific rows appear in the catalog, by exact table-row text | Same failure, one level down. Reformat a table and the build breaks with a message about a missing chart |
| Palette enforcement skipped entirely for the report templates | The largest and most colourful files in the tree have no colour checking at all. The exemption is a path prefix with no comment explaining it |
| No contrast check anywhere | **OBSERVED**: no contrast, luminance or ratio logic exists in either script or in either shared module. The skill states a 4.5 to 1 gate as a hard rule and nothing verifies it |
| No motion-preference check | **OBSERVED**: 14 of the 50 templates carry no reduced-motion fallback, including all three standalone interactive charts, all six of their themed variants, every fast-read gallery variant and the sparse-data gallery. The rule says the fallback is required |

The pattern across all six is the same. The validator checks the things that are cheap to
check and silent about the things the skill says matter most.

---

## 8. WHAT A VALIDATOR FOR A NATIVE CORPUS SHOULD CHECK INSTEAD

Ordered by the cost of the failure each one prevents. The first four are required. The rest
earn their place only if the corpus reaches a size where a human cannot re-read it.

### Required

**Every generated file parses and renders.** Compile each inline script. Then open the file in
a headless browser, scroll the chart container into view because lazy rendering is the norm,
and assert that the container has non-trivial dimensions and more than a couple of child
nodes. Prevents: a chart that is a syntactically valid empty box. The reference's smoke test
does exactly this and it is the single best thing in the tree.

**Contrast passes, computed rather than asserted.** Extract every foreground and background
pairing the palette defines, compute the ratio and fail below 4.5 to 1 for small text and
3 to 1 for large text and for adjacent data shapes. Prevents: shipping the accessibility rule
as a sentence nobody enforces, which is what the reference did.

**Every animated template carries a reduced-motion fallback.** A grep is enough. Prevents: the
28 percent failure rate measured above, in a corpus where the rule is stated as mandatory.

**Colour values in a themed file come from that theme.** Compute the allowed set by reading the
palette definition, then check every colour literal in the file against it. Prevents: theme
drift, without a maintained allowlist.

### Worth Adding Once the Corpus Is Larger

**Element ids are unique per file.** Prevents: two charts rendering into one container.

**No non-deterministic randomness in rendering code.** Prevents: a screenshot review comparing
two renders of the same file and finding them different.

**Every catalog entry resolves to an implementation, and every implementation appears in the
catalog.** Check the link in both directions by a stable identifier. Prevents: the lookup
failure section 9 documents, which is the reference's most damaging defect.

**Every delivery file is a complete document with a title and a viewport tag.** Prevents:
shipping a fragment.

### What It Must Not Do

**Never assert on prose.** No check may require a specific sentence, phrase or table row to
appear in a written document. This is the rule the reference broke, and the consequence was
that translating its own documentation broke its own build. If a document has to carry a fact,
carry the fact in structured data the document renders from, and check the data.

**Never hardcode a file inventory.** Derive the required set from the catalog or from a
manifest that is itself generated. A list of paths in a test is a second source of truth that
will disagree with the first one.

**Never exempt a directory without a comment naming what is exempted and why.** The reference
exempts its whole report tree from colour checking with a bare path comparison. Nobody reading
it can tell whether that is a decision or an oversight.

---

## 9. WHAT THE REFERENCE DOES BADLY

Every item is something to avoid rather than repeat.

### The Lookup Key That Does Not Resolve

The skill documents a two-step lookup: find the card by its headline, then find the code block
carrying the same name. It is the central retrieval instruction, repeated in the skill document
and in the catalog.

**OBSERVED**, by matching every catalog row against the gallery files:

- Headline lookup resolves exactly for 57 of 61 charts. Four resolve only by prefix, because
  the catalog carries a shortened version of the real headline.
- Code-block lookup is worse. Only 15 of 61 blocks are labelled with the catalog identifier.
  The other 46 carry legacy labels from an earlier numbering that restarts, skips values and
  in places uses a different letter prefix than the catalog does for the same chart.

So the documented lookup works reliably for the 15 charts added most recently and degrades to
guesswork for the rest. Nothing detects this, because the validator checks that the catalog
rows exist and never checks that they point anywhere.

The lesson for us: an identifier that appears in a document and in the code it describes has to
be checked in both directions, mechanically, or it rots on the first rename.

### Rules Stated as Mandatory and Enforced Nowhere

Two, both measured above. The contrast gate has no implementation. The reduced-motion fallback
is missing from 14 of 50 templates. A rule the tooling does not check is a rule that describes
the author's intentions rather than the artifact.

### Shared Modules Nothing Imports

Covered in section 6. Two modules declared as the single source of truth, zero templates
importing either. The values are duplicated across 50 files and held in line by a linter. It
works, and the maintenance cost is invisible until the first token change.

### Ninety-Three Percent of the Repository Is Imagery

19,159,589 bytes of the 20,554,403 total are images, and 8.3 MB of that is animated previews
that exist so a project page looks alive. **OBSERVED**, from the earlier phase's file
census, and reconfirmed by directory sizes. Forty-five of the 57 binary files are referenced
only from the two project READMEs. A skill whose consumer is an agent reading a text file does
not need a motion preview of a chart it can render.

### Everything Is Doubled by Language

Twelve report layouts times two languages is 24 files that have to move together. The build
already gets this wrong: the files named as the English variants carry 6,285 characters of the
other language between them, in comments, because the naming describes the rendered page rather
than the source. Two of anything that must stay in sync will drift, and here it already has.

### Small Defects, Recorded Because They Are Cheap to Avoid

| What | Why it matters |
|---|---|
| A cross-reference to a named rule in the skill document, where the skill document has no rule of that name | A dangling pointer in the one file an agent reads first |
| A colour system named after one colour and described everywhere as a different colour | The name and the description disagree, so neither can be trusted |
| The examples index lists two templates that exist in no catalog | They are legitimate out-of-library builds, presented in a table headed as templates |
| Its own documents disagree on the chart count | Settled in section 3, but it cost an earlier phase real time |

### Accessibility Is Absent

**OBSERVED**: across the three main galleries there is one ARIA attribute in total. The charts
are vector output and canvas with no accessible name, no description and no data table
alternative. Colour is not the only cue, which is the one accessibility rule the reference
does hold, and that is the whole of it. A screen reader gets nothing.

This is the largest single gap and it is the cheapest to close at the start. A title element
inside the vector output, an accessible role and a hidden data table cost almost nothing per
chart when the template is written and are close to unaffordable to retrofit across a corpus.

---

## 10. WHAT TO BUILD FIRST, AND WHAT TO LEAVE OUT

### The Sizing Principle

Size the corpus by data-shape coverage, not by chart count. A corpus fails when a common shape
has no honest encoding, because then the agent forces the nearest chart and produces something
misleading. It does not fail for having fewer charts than the reference.

Counting the distinct shapes in section 4 gives 26. Several of them are answered by the same
form, and several are demo formats rather than charts.

### Recommended First Corpus

**Fourteen forms, one visual register.** Comparison across few categories in both orientations,
grouped comparison, part-to-whole as a unit grid, part-to-whole as a ring of countable marks,
stacked composition, independent percentages, daily line, daily range, calendar grid,
distribution strip, scatter, waterfall, single-value progress and a two-level treemap.

Those fourteen cover every shape a general request arrives with. Each one earns its place by
being the only honest answer to a question in section 4, not by rounding out a family.

**Then five more, in a second pass, for the shapes with no substitute.** Four-value period data,
five-number summary, parallel axes across several dimensions, continuous-time composition and
a heat matrix. These are the shapes where forcing the nearest available chart produces a wrong
answer rather than a plain one, which is why they are worth the second pass rather than the
third.

That is 19. If the second pass never happens, the corpus is still usable, and that is the test
of whether the first pass was sized correctly.

### The Registers

Build one register first. Add the close-read register only for the forms where record-level
encoding changes the answer, which is a shorter list than it looks: the unit grid, the
distribution strip, the attribution forms and the ring of countable marks.

**The trade-off, stated rather than buried.** One register means the family concept ships as
documentation before it ships as code, and the selection rule in section 2 has nothing to
choose between on day one. I still recommend it. Two full registers is roughly double the
corpus for a distinction most requests do not exercise, and the reference's own third family is
evidence that the register split creates work: it exists because the close-read register could
not handle sparse data, which is a gap the register split caused.

### Leave Out

| What | Why |
|---|---|
| Report mode, all twelve layouts | It is a second product. Twelve full-page narrative layouts, doubled by language, with their own catalog, their own selection rules and their own preview images. Nothing in the chart capability depends on it |
| Every animated form | Racing bars, streaming series, morphing views, staggered entrances and drawn-in counters are demo formats for video. They cost real implementation effort and answer no question a static chart does not |
| Geographic charts | They need boundary data fetched at runtime, which is the most fragile dependency in the set, and they need a gate to stop a region column triggering them. Add them when someone asks twice |
| The three standalone interactive charts | A different delivery format for dense networks. Worth having eventually, and not before the corpus that gets used daily exists |
| Every preview image | 93 percent of the reference by weight. An agent reads text |
| A second language | Doubling the corpus doubles the drift surface, and the reference already drifted |
| Decorative forms | Isometric dot planes, hand-drawn blob layouts and radial patchwork are beautiful and answer questions the fourteen already answer |

### Build Order Within the First Pass

1. The template skeleton and the design token set, with the accessibility floor built in from
   the first file rather than retrofitted.
2. The neutral colour system and the role vocabulary. One system, all roles.
3. Two charts, end to end, one hand-written and one library-drawn, to prove both paths.
4. The validator, before the corpus grows. Watch it fail on a deliberately broken file, then fix
   the file.
5. The remaining twelve forms.
6. The second colour system, which is the first real test of whether the role vocabulary holds.

---

## 11. UNKNOWNS

| # | UNKNOWN | What would settle it |
|---|---|---|
| U-01 | Whether a chart request in this repository should route to the new mode or to the existing diagram mode, which already claims bar, line, scatter and radar by name | A router replay of real chart phrasings through both stages, once the mode exists. Cannot be measured before then |
| U-02 | Whether the reference's primary-tier reading of its own 49 is the author's intent or my reconstruction | Asking upstream. The clone holds a single squashed commit, so there is no earlier state to compare against |
| U-03 | Whether inlining a small shared runtime at generation time is acceptable here, or whether the delivery file must be hand-editable end to end | An operator preference about who edits a delivered file after it lands |
| U-04 | Whether 14 forms is the right first cut, or whether two or three of them are never requested | Usage, after the first corpus ships. No amount of analysis settles a demand question |
| U-05 | Which charting library, if any, the library-drawn path should use | A comparison of the two the reference loads against what this repository already ships, measured on file size and offline behaviour |

---

## 12. VERIFICATION, AND THE CLOSENESS SELF-CHECK

### What Was Run

| Check | Result |
|---|---|
| Chinese-character scan over this document | 0 characters |
| Voice scanner over this document | 0 hard blockers |
| Card, code-block and catalog-row counts across four gallery files | 61, 61, 61. Reported in section 3 |
| Catalog-to-implementation lookup resolution | 57 exact, 4 prefix-only, 15 of 61 code blocks carrying the catalog identifier |
| Reduced-motion fallback presence across 50 templates | 36 present, 14 absent. Files listed by group in section 7 |
| Search for contrast or luminance logic in both scripts and both shared modules | No match |

### The Closeness Check

Six sections, and the honest answer to whether someone holding only this document could
rebuild a reference file from it. The first three below were chosen for being the most
exposed. The second three came from a random draw over all twelve sections, because picking
your own exam is not a check.

**Section 5, the colour systems.** No. A reader learns that four systems exist, what question
each answers, the role names and the capacity ceiling. They learn no values, no ramp order and
no relationship between the systems beyond function. They would design their own palette and it
would not resemble the original.

**Section 6, what a template is.** No, and this was the one I expected to fail. It describes a
single file, a four-part card, one data array near the top and a dependency table. There is no
markup, no class name, no stylesheet property and no helper signature. A reader would write a
single-file chart, which is an idea old enough to be nobody's property, and it would not be
this one.

**Section 4, the chart forms.** This is the closest of the three and it needed rewriting once.
The first draft carried the reference's coined names next to its data shapes, which left a
reader one step from its catalog. The version here describes forms by the question they answer
and names them only in standard vocabulary. A reader could build a scatter plot from it, which
is true of any book about charts. They could not reproduce a specific card.

**The drawn three came up 1, 3 and 9.** All three clear the bar, and none needed a change.
Section 1 describes only this document and what it withheld, so there is nothing in it to
rebuild from. Section 3 reproduces counts and an arithmetic reconciliation, which is the
category ADR-002 names as surviving the ruling. Section 9 quotes six measurements taken from
the reference's files and names four defects without quoting any defective text. A count of
what is wrong with a work is an observation about it.

**One residual risk, stated rather than hidden.** Section 3 reconstructs the reference's own
arithmetic, and section 9 quotes measurements taken from its files. Both are observations about
a work rather than the work, which is the line ADR-002 drew. Section 4's grouping of questions
is close to the reference's own decision tree in subject, because both are organised by data
shape, and data shape as an organising principle is the correct one rather than a distinctive
one. I judged that reorganising it worse on purpose would serve nobody.

---

## RELATED DOCUMENTS

- **Translation log and source defects**: See `translation-log.md`
- **File inventory and character census**: See `../../001-source-inventory-and-placement/research/inventory.md`
- **Licence ruling**: See `../../001-source-inventory-and-placement/decision-record.md`, ADR-002
- **Phase specification**: See `../spec.md`
