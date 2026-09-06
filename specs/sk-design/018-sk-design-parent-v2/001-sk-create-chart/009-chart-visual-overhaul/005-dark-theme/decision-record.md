---
title: "Decision Record: The dark theme for the chart corpus"
description: "The amendment the operator answered, the derivation rule the dark values were chosen under, and the four calls the phase had to make on its own."
trigger_phrases:
  - "chart dark theme decisions"
  - "palette block amendment decision"
  - "dark chrome warm cast"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/009-chart-visual-overhaul/005-dark-theme"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Recorded the amendment answer and the five calls the phase made"
    next_safe_action: "Read acceptance-criteria.md, which cites this record"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json"
      - ".opencode/skills/sk-doc/sk-create-chart/references/color-system.md"
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-005-dark-theme"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The dark ground keeps the paper's hue angle at a cut chroma"
      - "The deliveries and the proof sheets are themed with the twenty forms"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: The dark theme for the chart corpus

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

One of these was the operator's to make and the phase would not have started without it. The
other five were the phase's own, and three of them were open questions the spec left standing.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Re-hue across themes rather than lighten

**Status:** Accepted
**Date:** 2026-09-03

### The question

The colour system said a lighter value comes from mixing toward `surface` and a darker one from
mixing toward `ink`, and that a hue is never introduced. That rule was written for one ground.
Mixing toward a near-black surface is what makes a mark disappear on it, so applying the rule
across two grounds produces washed values that fail the mark gate.

### Decision

Accepted, and the derivation it needed turned out to be one sentence rather than a licence. A
dark value is re-chosen at a hue the dark ground can carry, and its lightness is set so it holds
the same ratio against near-black that its light counterpart holds against paper.

That rule did the whole palette. Every dark value lands within a twentieth of a ratio point of
its light counterpart: `neutral` runs 13.95, 8.24, 5.10 and 3.15 against 13.91, 8.23, 5.10 and
3.20, and the ordered ramp reproduces its light ladder exactly. Because the ladder is mirrored,
the emphasis separations come out unchanged without being aimed at, at 2.72 and 2.19 against the
light theme's 2.71 and 2.20.

### Why a hue has to move, in numbers

A hue reaches its own ceiling of lightness. Pure blue tops out near a tenth of the luminance pure
yellow reaches, so the categorical navy that carries the brightest slot on paper cannot carry the
brightest slot on ink without desaturating into a pale grey-blue. Each hue therefore lands in the
slot whose lightness it can reach with its chroma intact, and the set rotates: navy at 212
degrees, rust at 21, green at 108 and violet at 282 become gold at 44, cyan at 192, rose at 8 and
violet-blue at 258. Every slot moved, which is what the criterion asking for a rotation rather
than a lightness shift wanted to see.

### What does not rotate, and why that is also the decision

`neutral` has no hue to move. Its dark values stay warm greys on the same 30 to 45 degree cast the
light ones carry.

`ordered` stays in the teal family. A magnitude ramp needs one hue, and the family has to reach
the lightness its carrying end needs without washing out, which teal and cyan do and blue and
violet do not. What changes is direction and chroma: the light ramp falls to 24 percent saturation
at the end nearest paper, and the dark ramp holds 40 percent at the end nearest ink. Rotating it
for the sake of showing a rotation would have been a worse ramp chosen to satisfy a criterion.

### What this costs

Two sets of values now exist per system, so a colour edit has two places to reach. The check
catches a half-edit in both directions, which is the only reason the cost is bearable.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The contract carries one palette block per theme, two at most

**Status:** Accepted, by the operator on 2026-09-03
**Date:** 2026-09-03

### The question

Rule 4 said exactly one palette block per file, matched against the source in both directions, and
a media-scoped twin makes two. Both research lineages recommended shipping the dark theme anyway.
The counter was that a second block doubles the surface a drift can hide in. The adjudication left
the call to the operator rather than to an implementer, and every task in this phase was blocked
on the answer.

### Decision

The operator answered yes on 2026-09-03. The amendment reads, in the contract:

> A file carries one palette block per theme and no more than two, each matched against its own
> projection of the palette source in both directions.

The ceiling stayed a ceiling. Two is every theme this corpus has, and the check counts sentinel
pairs rather than trusting the count, so a third block or a repeated pair fails rather than
passing unseen.

### What this costs

The old rule was protecting something real: one block per file is one place a colour can drift,
and a diff shows it. The corpus now carries fifty-eight blocks where it carried twenty-nine. Three
things pay that back. Each region is matched against its own projection in both directions, the
region count is asserted, and a dark block that sits outside its media query is rejected on sight.
All three were watched failing before the corpus was allowed to go green.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The dark ground keeps the warm cast, at a cut chroma

**Status:** Accepted
**Date:** 2026-09-03

### The question

The spec left it open. The light surface is a warm paper and a neutral near-black is what the
reference ships. Warm on dark can read as muddy, and neutral on dark abandons the voice the light
theme was built around.

### Decision

The ground keeps the paper's hue angle and cuts its chroma. `#FAF8F5` is `hsl(36, 33%, 97%)`, and
the dark ground is `#161513`, which sits on the same warm angle with a three unit spread between
its red and blue channels.

Transferring the cast literally is what would have made it muddy. Thirty-three percent saturation
reads as paper at 97 percent lightness and reads as brown at 8 percent, and the same *relative*
spread of five parts in 250 becomes one part in 22, which disappears. So the angle is kept and the
chroma is chosen for the lightness it has to survive.

The corpus already held the proof that this is the right family. The light theme's own ink,
`#1A1917`, is a near-black carrying exactly this three unit cast, so the dark ground is a value
the product already had rather than one invented for the theme. It sits one step deeper than that
ink, which is what gives the alpha card edge something to sit on.

### The rest of the chrome, by the same rule

Dark ink `#F2F0EC` reads 16.03:1 where light ink reads 16.57:1, and dark muted `#A8A5A0` reads
7.43:1 where light muted reads 7.57:1. The dark rule is ink at nine percent, `#F2F0EC17`, and the
alpha was solved for rather than copied: the light edge holds 1.26:1 against paper, and nine
percent is the alpha that composites to 1.26:1 against ink. The reference's 7.5 percent was the
starting point and is not what shipped.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: The deliveries and the proof sheets are themed with the forms

**Status:** Accepted
**Date:** 2026-09-03

### The question

The spec left it open. Twenty of the twenty-nine files are chart forms. Six are family deliveries
and three are palette proof sheets, and the question was whether those nine need the same
treatment.

### Decision

All twenty-nine, and the proof sheets went first.

A delivery is what a reader actually meets, so a themed corpus whose deliveries are not themed
would answer the theme for the files nobody opens. The proof sheets settle it outright: the
contract tells an author to copy `palette-sheet-neutral.html` as the skeleton, so a proof sheet
without a dark block would make every future template non-conformant on the day it was created,
and a proof sheet is also the one file whose whole job is to show what a colour system contains.
A proof sheet that showed one ground would be showing half of one.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Two gate names keep their light-ground wording

**Status:** Accepted, with an amendment proposed rather than folded in
**Date:** 2026-09-03

### The question

`rampDarkestOnSurface` and `rampLightestOnSurface` name the ends of a ramp by lightness. On ink
the end this table calls the darkest is the brightest one, so both names now read wrong on one of
the two grounds.

### Decision

The check tests the end by its distance from the ground rather than by its position in the array
or its lightness, and it says which end it tested in the message it prints. The keys keep their
names.

Renaming them to something like `rampFarEndOnSurface` and `rampNearEndOnSurface` would be the
honest fix and it is proposed rather than done. The keys reach the palette source, the colour
document and an earlier phase's decision record, and a rename is a separate change with its own
blast radius rather than a rider on this one. Both documents now say the names are wrong and what
the check actually tests, so a reader is not left to infer it.
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: The render pins its colour scheme and gains a dark open

**Status:** Accepted
**Date:** 2026-09-03

### The question

A block that matches the source in both directions, sits inside a `prefers-color-scheme` query and
never paints anything is invisible to every text check in the packet. Nothing in the corpus could
observe whether twenty-nine pasted blocks reached the paint.

There was also a latent problem the dark theme made visible. A headless run inherited whatever
colour scheme the operator's machine was set to, which was measured on this machine: with no flag,
the browser reported the dark scheme, because the operating system is set to dark. Two people
running the same check would have compared different pictures.

### Decision

Both opens of the settled pair pin the light scheme, and a third open pins the dark one and
requires a different picture. The run costs one more browser launch per file, about ninety seconds
across the corpus.

The spec's in-scope list named the gate section rather than the render, and the plan's testing
strategy names "every file opened headless under both colour schemes", which is what this is. It
earns its place on the narrower ground too: it fails for a real reason no other check catches, and
it was watched doing so on a file whose block was left intact and given a condition that can never
be true.
<!-- /ANCHOR:adr-006 -->
