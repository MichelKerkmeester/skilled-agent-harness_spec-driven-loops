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
| **Date** | 2026-09-02 |
| **Executor** | cli-devin, `deepseek-v4-flash-max` |
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

The corpus check opens every file in a headless browser under `--render` and asserts the figure
region holds real elements. It does not judge whether the picture is right, which is why the three
applied changes each carry their own observation above.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

**The tick fix reduces float dust rather than removing it.** Counting from an integer index turned
four dusty labels into one in the reproduction above, because the multiplication is itself
inexact. Removing the last one needs the number formatter recorded as T2.

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

**Seven template-level and five contract-level recommendations are unapplied.** They are listed
above and in ADR-004, each with the finding that supports it.

**No `SKILL.md` change was needed.** The renumbering touched no section `SKILL.md` cites, and none
of the applied changes alters what the mode promises, so there is no prepared text to record.
<!-- /ANCHOR:limitations -->
