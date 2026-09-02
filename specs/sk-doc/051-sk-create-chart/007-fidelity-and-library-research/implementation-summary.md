---
title: "Implementation Summary: Fidelity and library research for sk-create-chart"
description: "Three reference overviews now number from one, a ten-iteration research loop measured the corpus against six open-source charting libraries, and three of its ten template-level recommendations shipped behind the corpus check."
trigger_phrases:
  - "chart fidelity summary"
  - "chart research results"
  - "chart template improvements"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/051-sk-create-chart/007-fidelity-and-library-research"
    last_updated_at: "2026-09-02T00:00:00Z"
    last_updated_by: "phase-7-fidelity"
    recent_action: "Applied three template-level improvements and recorded the rest"
    next_safe_action: "Decide the five contract-level recommendations in ADR-004"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
      - "research/lineages/deepseek-flash-max/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-7-fidelity-and-library-research"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Five contract-level recommendations await an operator decision"
      - "Seven template-level recommendations are recorded and unapplied"
    answered_questions:
      - "The overviews number from one, and seven citations were corrected with them"
      - "No library is adopted, because the no-dependency clause is load-bearing"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/051-sk-create-chart/007-fidelity-and-library-research |
| **Level** | 3 |
| **Status** | Complete |
| **Date** | 2026-09-03 |
| **Executor** | cli-devin, `deepseek-v4-flash-max` for the research. The second read was authored locally |
| **Gate** | `node scripts/check-corpus.cjs --render`, `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three reference overviews now start at section one instead of section zero, and the seven
citations that named a section the shift moved were corrected in the same pass. A ten-iteration
deep-research loop then measured the corpus against Chart.js, D3, Vega-Lite, Plotly, Observable
Plot and ECharts, producing 51 cited findings, ten ranked template-level recommendations, five
contract-level ones and fifteen eliminated alternatives. Three of the ten shipped.

### The renumbering

| File | Sections before | Sections after |
|------|-----------------|----------------|
| `references/catalog.md` | 0 to 7 | 1 to 8 |
| `references/color-system.md` | 0 to 7 | 1 to 8 |
| `references/template-contract.md` | 0 to 9 | 1 to 10 |

The brief said no citation named those numbers. That was wrong, and the grep is why it was
caught. Seven citations did:

| File | Was | Now |
|------|-----|-----|
| `references/catalog.md:72` | families, section 3 | section 4 |
| `manual-testing-playbook/delivery-and-routing/opens-with-no-build-step.md:100` | section 4 | section 5 |
| `manual-testing-playbook/corpus-integrity/colour-comes-from-one-source.md:105` | section 5 | section 6 |
| `manual-testing-playbook/corpus-integrity/catalog-resolves-both-ways.md:104` | section 7 | section 8 |
| `manual-testing-playbook/corpus-integrity/a-chart-that-draws-nothing.md:106` | section 8 | section 9 |
| `manual-testing-playbook/reading-the-chart/axis-ladder-fits-the-tallest-mark.md:100` | section 8 | section 9 |
| `manual-testing-playbook/reading-the-chart/headline-agrees-with-the-data.md:50,99` | sections 1 and 8 | sections 2 and 9 |

Three further citations name `SKILL.md` sections, which did not shift, and were left alone.

### What the research applied

| Change | Files | Finding |
|--------|-------|---------|
| Per-mark `<title>` hover text | scatter, heat-matrix, calendar-grid, candlestick, box-plot, treemap, waterfall, parallel-axes | The largest measured gap: every surveyed library ships hover by default and the corpus shipped none |
| Counted rather than accumulated ticks | candlestick | The loop added a fractional step repeatedly, and the drift reached the label |
| Measured rather than estimated label widths | stacked-bars, stacked-area, waterfall, candlestick, unit-grid, unit-ring | A character count times a constant assumes a fixed advance, which this font stack does not give |

### What the research recommended and this phase did not apply

| Ref | Recommendation | Why not now |
|-----|----------------|-------------|
| T2 | A per-template number formatter, for thousands separators and precision | Twenty files of new helper code, and the corpus check cannot tell a better label from a worse one |
| T3 | Filter null and NaN out of the line, range and area path builders | Changes what a chart shows when data is missing, which is a reading decision rather than a defect fix |
| T5 | A series-mapping sentence in each figure description, with a data-derived clause | Twenty hand-written descriptions, each needing review against its own data |
| T6 | A minimum-size guard so a narrow screen pans instead of shrinking | Changes the layout of every template, and nothing verifies the result |
| T7 | Budget comments for label lengths, thinning rules and unit widths | Documentation of existing constants, worth doing beside T2 |
| T8 | A gradient ramp legend in calendar-grid and heat-matrix | Replaces a legend that already reads correctly |
| T9 | A console warning when data exceeds a form's documented shape | ADR-004 C4 offers a visible notice instead, and the two should be decided together |
| T10 | Pattern fills as non-colour encoding on the stacked forms | Changes the shared visual register of the corpus |
| P1 | A colour-blindness rationale note in `color-system.md`, and optionally align the categorical hues with Okabe-Ito | Touches the palette source, whose gates are recomputed by the check |
### The second read, 2026-09-03

The operator asked for the twelve unapplied items to be taken up one at a time, judged against the
template contract and the restraint ladder, and either applied or refused in writing. Nine are
applied and two are refused. ADR-006 records the reasoning and the one deviation.

| Ref | Disposition | What landed |
|-----|-------------|-------------|
| T2 | Applied | One formatter per template, and every printed figure routed through it. Grouping is fixed to a comma rather than read from the locale, and rounding at six decimals removes float dust. A numeric ladder now prints every rung to the decimal count of its own step |
| T3 | Applied | `daily-line` breaks into segments at a gap, `daily-range` leaves the day undrawn while keeping its slot, and `stacked-area` breaks the whole stack rather than substituting a zero. Each prints how many readings it left out |
| T5 | Applied | A series-to-swatch sentence in the description of the five forms whose colours are only resolvable through a detached key. Written against key order and stack order rather than colour names, so a palette swap cannot make it wrong |
| T6 | Applied | Every file under `assets/` gives its figure region a horizontal scroll and its drawing a floor of 480 units |
| T7 | Applied | The arithmetic behind seven gutters, thinning divisors and axis spacings, written as author comments: units available, characters that buys at the label size, and what to change when it runs out |
| T8 | Applied, in a different shape | `heat-matrix` had no legend at all and received a stepped ramp. Neither shaded form received a gradient, because both band their values into five steps. ADR-006 carries the reasoning |
| T10 | Refused | Pattern fills would change the visual register of every chart carrying one, for a problem the colour rule already solves another way in every form. Written into `color-system.md` section 8 |
| C1 | Applied | Rule 14 and the `narrow-viewport` check. Asserted from the stylesheet, because a headless run returns the DOM and the answer lives in layout |
| C2 | Applied | `catalog.md` section 3 states that time labels arrive display-ready and that numbers do not |
| C3 | Applied | `template-contract.md` section 4 names the two computed totals and states the test that stops the exception generalising |
| C4 | Applied | `scatter` past twenty points and `heat-matrix` past a hundred cells grow their frame and print the count against the ceiling |
| C5 | Refused | No catalog form consumes a midpoint ramp. `color-system.md` section 8 records the refusal and names the form that would reopen it |

The packet version went to `1.1.0.0` and `changelog/v1.1.0.0.md` carries the entry. Nothing was
committed.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The loop ran through `/deep:research` in autonomous mode, with `--stop-policy max-iterations` so
convergence was telemetry rather than a stop condition, and all ten iterations ran. Execution went
through the deep-loop fan-out runtime, which owns CLI lineage execution, with one lineage.

The executor was chosen by availability, not preference. GPT-5.6 LUNA at max reasoning was tried
first through `cli-codex` and returned `You've hit your usage limit`, and the same ChatGPT OAuth
credential backs the `openai` provider on `cli-opencode`, so both named routes to that model were
closed for the hour. DeepSeek V4 Flash at its max thinking tier through `cli-devin` was the third
permitted option, and it ran. Twelve minutes of wall time for ten iterations.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

Full records in `decision-record.md`.

- **ADR-001**: fidelity comes from independent work and MIT-class libraries, never from the
  PolyForm Noncommercial reference, which no part of this phase opened.
- **ADR-002**: three of the ten template-level recommendations are applied, chosen because each
  closes a defect present in the corpus today and each can be proven by observation.
- **ADR-003**: no library is adopted. Ideas were borrowed and named at each site, code was not.
- **ADR-004**: five contract-level recommendations stay open for the operator.
- **ADR-005**: a fan-out lineage and local authoring must not share a working tree.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Every command below was run and its output read.

| Check | Result |
|-------|--------|
| `grep -rn '## 0\. OVERVIEW' .opencode/skills/sk-doc/sk-create-chart/` before | three hits, one per reference file |
| The same grep after | no output |
| `grep -rniE 'section [0-9]' .` over the mode, before and after | ten citations found, seven corrected, three confirmed as `SKILL.md` references |
| `node scripts/check-corpus.cjs --render` baseline, before any edit | fifteen checks, 0 failures, `RESULT: PASSED` |
| The same command from the final state | fifteen checks, 0 failures, `RESULT: PASSED` |
| Negative control for the tick drift | accumulating from 2.4 by 0.3 printed four labels carrying float dust, counting from an integer index printed one |
| Proof the label measurement fires | the rendered legend x positions are `59`, `150.92269897460938`, `243.3527946472168`, which the character estimate cannot produce |
| Proof the hover text renders | each of the eight patched forms dumps one `title` element per mark, from 6 in box-plot to 365 in calendar-grid |
| `hvr_scan.py` on every document in this folder | zero hard blockers on each |

Added by the second read on 2026-09-03. Every command below was run and its output read.

| Check | Result |
|-------|--------|
| `check-corpus.cjs --render` before any second-read edit | fifteen checks, 0 failures, `RESULT: PASSED`, exit 0 |
| The same command from the final state | sixteen checks over 29 files, 0 failures, `RESULT: PASSED`, exit 0 |
| Full rendered label list, before against after | nine ticks gained a comma, three candlestick rungs gained `.0`, nothing else moved across the twenty forms |
| Negative control for float dust | a ladder stepping by 0.2 printed `0.6000000000000001` before the formatter and `0.6` after |
| Negative control for a missing reading | two null days made the old `daily-line` dive to the baseline and print `null` as the low-point label. The new one draws two segments, prints `96`, and states `2 days have no reading and are left out of the line.` |
| The same fixture on the other two builders | `daily-range` printed `1 day has no complete range and is left undrawn.` and `stacked-area` split each of its four bands into two runs |
| Proof `narrow-viewport` can fail | stripping the overflow and the floor from `scatter.html` failed it twice, raising the floor to 900px failed it a third way, and restoring the file returned `RESULT: PASSED` |
| Proof the ceiling notice fires and stays quiet | a 28-point scatter and a 112-cell heat matrix each grew their frame and printed the notice. The shipped data produced none |
| Phone-width screenshots at 390 by 900 | `heat-matrix` before the change squashed the whole grid into the card at roughly 6px labels. After, it keeps its drawn size, the figure region carries a scrollbar and the new ramp legend reads `from 6 … up to 101` |
| `hvr_scan.py` on every markdown file the second read touched | zero hard blockers on each, against a zero baseline |

The corpus check opens every file in a headless browser under `--render` and asserts the figure
region holds real elements. It does not judge whether the picture is right, which is why the three
applied changes each carry their own observation above.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

**The tick fix reduced float dust rather than removing it, and T2 has since removed it.** Counting
from an integer index turned four dusty labels into one, because the multiplication is itself
inexact. The formatter rounds at six decimals and the reproduction above now prints clean.

**The research had no live web tooling on this executor.** The fan-out runtime rejects a live
web-search policy for `cli-devin`, so the loop ran without that flag. Its findings still carry
named upstream URLs, and every corpus citation spot-checked resolved to the line it named, but the
upstream half rests on the model's own knowledge of those documents rather than on a fetch this
phase can replay.

**A concurrent agent lost uncommitted work to this phase's dispatch.** The fan-out runtime
snapshots dirty paths before dispatch, then restores from `HEAD` any tracked file that becomes
dirty outside the lineage directory. At 19:09:22Z it restored twenty-three tracked files. Four
were this phase's own documents, which were rewritten from context. The other nineteen belonged to
a concurrent agent, across `.opencode/skills/mcp-tooling/`,
`.opencode/skills/sk-doc/sk-create-with-human-voice/`, `specs/sk-doc/039-create-with-human-voice/`
and one file under `specs/sk-doc/052-routing-completeness/`. Untracked files were preserved. The
tracked edits are not recoverable from git, because they were never committed. ADR-005 records the
rule that prevents a repeat.

**Two recommendations are refused rather than unapplied.** T10 and C5 are the only items still not
in the corpus, and both carry a written reason in `references/color-system.md` section 8 plus the
condition that would reopen them. Nothing is left as a silent skip.

**Rule 14 is asserted from the stylesheet, not measured on a narrow screen.** A headless browser
returns the DOM and the DOM does not say whether the page overflowed. The check proves the pan
affordance is declared and that its floor is not wider than the drawing. Whether a chart is legible
at that floor stays a review question, and the 480-unit floor is a corpus-wide judgement rather
than a per-form measurement.

**The render check flaked twice during this pass.** A different file failed each time, each failed
file rendered when opened alone, and the next full run passed. That is the discriminator the
playbook already documents for the browser rather than for a chart drawing nothing. The
authoritative run recorded above is clean.

**The formatter is duplicated twenty times.** That is the delivery unit's cost, not an oversight: a
template is one file a recipient edits by hand, so a shared helper has nowhere to live. `niceStep`
is already duplicated nine times for the same reason. Unifying either one is the open question O1
in the research.

**No `SKILL.md` change was needed.** The renumbering touched no section `SKILL.md` cites, and none
of the applied changes alters what the mode promises, so there is no prepared text to record.
<!-- /ANCHOR:limitations -->
