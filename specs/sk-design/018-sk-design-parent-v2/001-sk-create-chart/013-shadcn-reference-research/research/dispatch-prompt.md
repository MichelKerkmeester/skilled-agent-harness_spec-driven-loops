GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_DISABLED=1` are set in your environment, which this repository defines as
the autonomous child-dispatch exemption. Nobody is at a prompt; no answer can reach you.

Your write authority is:
  specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research

Write nothing outside it. Proceed directly to the work.

---

# TASK

Decide which of shadcn's chart decisions our 26-form standalone-HTML corpus should adopt, and
which of ours are already better. Evidence, not preference.

# THE CORPUS IS ALREADY LOCAL. DO NOT FETCH IT.

  scratch/shadcn/chart.tsx        the machinery, 373 lines
  scratch/shadcn/charts/*.tsx     all 70 registry charts

The shadcn site renders its code client-side, so a fetch returns nothing. Everything you need
is on disk, frozen. Read it there.

Ours is at `.opencode/skills/sk-design/sk-design-chart/`:
  assets/templates/*.html   the 26 forms
  assets/examples/*.html    six deliveries
  scripts/check-corpus.cjs  31 checks, and the contract that actually binds

# TWO FACTS THAT ARE NOT UP FOR DEBATE

**1. Seventy charts is not seventy forms.** The area family is `default`, `axes`, `gradient`,
`icons`, `interactive`, `legend`, `linear`, `stacked`, `stacked-expand`, `step` — ten entries,
of which two are distinct forms and eight are feature variants of one. Counted naively the
corpus looks like 70 types and we look 44 short. That conclusion is wrong. Radar at 14 entries
is where the miscount is worst.

**2. Nothing ports.** `checkNoExternalResources` errors on any external reference at all, so
React, Recharts and Tailwind are a constraint, not a trade-off to weigh. An angle that drifts
toward wrapping, vendoring or "just importing" Recharts has failed. Decisions transfer; code
never.

# THE SIX ANGLES, ONE PER ITERATION, IN ORDER

**1 — Catalog delta, form versus variant.** Classify all 70 into distinct forms versus restyles
of a form we already carry. For each distinct form name the reader question it answers and say
whether one of our 26 already answers it. Decide whether radar is a real gap or a form we
deliberately do not carry.

**2 — Adjustability, the config surface.** shadcn puts one `ChartConfig` object between author
and chart: series key to label, icon, colour, or per-theme colour, with everything downstream
reading `var(--color-<key>)`. Count the distinct edit sites needed to retarget one of our
templates to new data today. Then decide whether a single adjustment point is reachable inside
our constraints. It must clear `checkDeterminism`, `checkColourLiterals`, `checkDataBlock` and
`checkSeriesMapping`.

**3 — Hover, tooltip and the pointer contract.** `ChartTooltipContent` decides things we leave
to each template: `indicator` dot/line/dashed, `hideLabel`, `hideIndicator`, `labelFormatter`,
`formatter`, `nameKey`, `labelKey`. Decide which belong in corpus-wide contract. Separately
compare Recharts' `accessibilityLayer` against our `role="img"` plus mandatory
`data-chart-table`, and do an actual keyboard walk rather than reasoning about one.

**4 — Colour, measured not admired.** Compare shadcn's five oklch ramp tokens with light/dark
pairs against our palette on adjacent-hue distinguishability, contrast against both grounds,
and the three common colour-vision deficiencies. **This angle fails if it returns adjectives.**
Numbers or nothing.

**5 — Data accuracy, where charts lie.** Axis domain and whether the baseline is zero, stacking
order, curve interpolation (`linear`/`natural`/`monotone`/`step`), null and gap handling, tick
generation. Establish what the 70 do at each point, what our 26 do, and where either default
draws a picture the data does not support. Concretely: does any area example smooth with
`natural` and thereby invent values between real points? Highest chance of changing shipped
templates.

**6 — What the checker learns.** Sort every finding from angles 1 to 5 into enforceable in
`check-corpus.cjs` versus per-template judgement. For each enforceable one name the assertion
and what it errors on. Without this the output is a mood board.

# DO

- Cite every claim to a file and line in the local corpus.
- Append each iteration to `research/research.md` under its own heading. Never overwrite another.
- Rank recommendations, and mark each implementable-today or needs-a-corpus-change.
- Say plainly when one of ours is better than shadcn's. That is a finding too.

# DO NOT

- Do not fetch anything. The corpus is local and frozen.
- Do not propose adding a dependency, a build step or a framework.
- Do not rebuild a template. This phase produces findings; a later one implements.
- Do not repeat siblings `007-fidelity-and-library-research` or `008-evilcharts-reference-research`.
- Do not write outside your bound spec folder.

# OUTPUT SHAPE

```
## Iteration <n> — <angle name>

### What was read
<files, with line references>

### What was measured
<commands or comparisons, and their actual output>

### Findings
<numbered, each with its evidence>

### Recommendations
<ranked; each [implementable today] or [needs a corpus change]>

### What this iteration could not settle
<explicit, or "nothing">
```
