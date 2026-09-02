---
title: "Goal: Fidelity and Library Research"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/051-sk-create-chart/007-fidelity-and-library-research"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed the twelve unapplied recommendations: nine applied, two refused in writing"
    next_safe_action: "Run the library half of the research on an executor with live web search"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
      - "research/lineages/deepseek-flash-max/research.md"
    session_dedup:
      fingerprint: "sha256:ec1764036846efb062b8f92a142ae2001a5c7bebb8d95929d1c9d8bf09435f4f"
      session_id: "2026-09-02-051-007-fidelity-and-library-research"
      parent_session_id: null
    completion_pct: 85
    open_questions:
      - "Which executor with live web search runs the upstream re-verification"
    answered_questions:
      - "Nothing is copied from the PolyForm Noncommercial reference"
      - "No charting library is adopted"
      - "C1 through C5 are decided: four applied, C5 refused, ADR-004 is Accepted"
      - "T10 is refused: a pattern fill changes the register for a problem every form already solves"
---
# Goal: Fidelity and Library Research

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close the twelve fidelity recommendations the research left open, and re-verify the half of that research that ran with no web access.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Nothing is copied from `lieflat-charts`, which is PolyForm Noncommercial. Fidelity is reached through independent work and MIT-class sources |
| D2 | No charting library is adopted. A template stays one file with no build step and no remote dependency |
| D3 | A fan-out lineage and local authoring never share a working tree. The lineage gets its own worktree |
| D4 | A contract-level change is the operator's call, not the implementer's |
| D5 | An item closes either applied or refused in writing. A silent skip does not close it |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] T2, T3, T5, T6, T7, T8 and T10 of `research/lineages/deepseek-flash-max/research.md:118-126` are each applied to `.opencode/skills/sk-doc/sk-create-chart/assets/templates/` or refused in a new ADR in `decision-record.md`
- [x] C1 through C5 of `decision-record.md:205-209` are each applied or refused, and ADR-004 leaves `Proposed`
- [x] `candlestick.html:153` no longer passes a raw number to `String()`, and no rendered tick label in the corpus matches `/\.\d{6,}/`
- [ ] The library half of `research.md` sections 3 to 11 is re-run on an executor with live web search, and every upstream URL it cites is marked resolved or unverified
- [x] `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render` prints `RESULT: PASSED`
- [x] `validate.sh specs/sk-doc/051-sk-create-chart/007-fidelity-and-library-research --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| The phase as shipped | Done | `abf77df9d0` on 2026-09-02, the only commit touching this folder besides `08eb67a0de` |
| T1 per-mark hover titles | Done | `parallel-axes.html:118-120` documents the native tooltip, and `scatter.html` builds one `title` per mark |
| T4 measured legend labels | Done | Recorded at `implementation-summary.md` with legend x values of `59`, `150.92`, `243.35` |
| T2 number formatter | Done | Every template defines `fmt` and routes each printed figure through it. Label diff over the corpus: nine ticks gained a comma, the candlestick ladder now reads `87.5 · 100.0 · 112.5 · 125.0 · 137.5 · 150.0`. A 0.2 step printed `0.6000000000000001` before and `0.6` after |
| T3 null and NaN filtering | Done | `daily-line`, `daily-range` and `stacked-area` break at a gap. Fixture with two null days: the old line dived to the baseline and labelled the low point `null`; the new one draws two segments, labels `96`, and prints `2 days have no reading and are left out of the line.` |
| T5 series-mapping descriptions | Done | The five forms with a detached key now map each series to its swatch in the `<desc>`, against key and stack order rather than colour names. `stacked-bars.html` names platform, services and support bottom upward |
| T6 minimum-size guard | Done | All 29 files under `assets/` carry `overflow-x: auto` on the figure and `min-width: 480px` on the drawing. Confirmed by screenshot at 390 by 900: the heat matrix keeps its drawn size and pans, where before it squashed to roughly 6px labels |
| T7 budget comments | Done | Seven forms carry the arithmetic: 144-unit gutter in `bar-rows`, 136 in `distribution-strip`, 98 in `heat-matrix`, 143-unit axis spacing in `parallel-axes`, and the thinning divisors in `daily-line`, `stacked-area` and `calendar-grid` |
| T8 gradient ramp legends | Done, in a different shape | `heat-matrix` had no legend at all and gained a stepped ramp reading `from 6 … up to 101`. Neither shaded form got a gradient: both band into five steps, and a continuous bar would claim a resolution the encoding lacks. ADR-006 |
| T10 pattern fills | Refused | Every form already satisfies the colour rule another way, so a decal buys a redundant cue at the cost of the shared visual register. Written into `references/color-system.md` section 8 with the condition that would reopen it |
| C1 narrow-viewport assertion | Done | `narrow-viewport` in `check-corpus.cjs`, 87 assertions, rule 14 in the contract. Proven to fail three ways on a mutated `scatter.html`. Asserted from the stylesheet because a headless run returns the DOM and the answer lives in layout, and both documents say so |
| C2 display-ready time labels | Done | `references/catalog.md` section 3 now states it, and states the opposite for numbers |
| C3 computed-value exception | Done | `references/template-contract.md` section 4 names the waterfall total and the stacked-area total, and gives the test that stops the exception generalising |
| C4 in-figure notice | Done | `scatter` past 20 points and `heat-matrix` past 100 cells grow their frame and print the count against the ceiling. Fixtures at 28 points and 112 cells both fired; the shipped data fires neither |
| C5 diverging colour system | Refused | No catalog form consumes a midpoint ramp, and shipping a scale with no consumer repeats the fourth-system mistake section 7 documents. `references/color-system.md` section 8 names the form that would reopen it |
| Upstream citation re-verification | Open, deliberately | Excluded from this pass by the operator's brief. It needs a separate dispatch on an executor with live web search, and ADR-005 requires that lineage to run in its own worktree. `tasks.md` T027 holds it |
| The corpus check after the second read | Done | Sixteen checks over 29 files, 0 failures, `RESULT: PASSED`, exit 0, read directly rather than through a pipe |
| Packet version and changelog | Done | `1.0.0.0` to `1.1.0.0` across `SKILL.md`, `README.md`, the three references and `scripts/README.md`, with `changelog/v1.1.0.0.md` added |

### Deviations and findings

| Item | Note |
|------|------|
| T5 and T7 are partly present | Both were listed as unapplied. Half of each was already there before this phase: the descriptions carry data-derived clauses, and one template documents its collision rule. What is missing is the series-to-colour mapping and the numeric budgets |
| The tick fix reduced float dust rather than removing it | Counting from an integer index left one dusty label, because the multiplication is itself inexact. T2 is the fix, which makes T2 the first item to work |
| The preferred executor was unavailable | GPT-5.6 LUNA at max reasoning returned a usage limit on `cli-codex`, and the same credential backs `cli-opencode`. DeepSeek V4 Flash ran instead, without web search, which is why the upstream half needs a second run. The operator still prefers LUNA at max fast for that re-run |
| A concurrent agent lost uncommitted work | The fan-out guard restored twenty-three tracked files from `HEAD` at 19:09:22Z. Nineteen belonged to another agent and were never committed. D3 exists to stop a repeat |
| T8 was applied in a different shape than it was written | A gradient legend over a five-band encoding tells the reader the scale is continuous, which is a fidelity regression wearing a fidelity improvement's name. The recommendation was right that a legend was missing from `heat-matrix` and wrong about its form |
| C1 could not be implemented as written | It asked for a phone-width render assertion. A headless run returns the DOM, and whether the page overflowed lives in layout, which no `--dump-dom` exposes. What the check can prove is that the affordance is declared and that its floor is not wider than the drawing, and the contract states the limit rather than hiding it |
| T6 went to nine files outside `assets/templates/` | The skeleton the contract tells authors to copy is `assets/color/palette-sheet-neutral.html`, so skipping it would make every future template non-conformant on creation, and the examples are deliveries, which is where a phone-width reader actually meets a chart. ADR-006 records the widening |
| T2 broke a caller and the caller was fixed | `progress-single` positioned its unit at `String(value).length * 34`. The formatter can insert a group separator, so the estimate went from imprecise to wrong. It now advances by the measured text length |
| The render check flaked twice | A different file each run, each rendering when opened alone, and the next full run clean. That is the playbook's own discriminator for the browser rather than for a chart drawing nothing |
<!-- /ANCHOR:log -->
