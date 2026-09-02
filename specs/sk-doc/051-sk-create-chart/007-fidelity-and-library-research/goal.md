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
    last_updated_at: "2026-09-02T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive over the twelve unapplied recommendations"
    next_safe_action: "Apply T2, the number formatter"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
      - "research/lineages/deepseek-flash-max/research.md"
    session_dedup:
      fingerprint: "sha256:ec1764036846efb062b8f92a142ae2001a5c7bebb8d95929d1c9d8bf09435f4f"
      session_id: "2026-09-02-051-007-fidelity-and-library-research"
      parent_session_id: null
    completion_pct: 25
    open_questions:
      - "C1 through C5 need an operator decision before they can be applied or closed"
      - "Which executor with live web search runs the upstream re-verification"
    answered_questions:
      - "Nothing is copied from the PolyForm Noncommercial reference"
      - "No charting library is adopted"
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

- [ ] T2, T3, T5, T6, T7, T8 and T10 of `research/lineages/deepseek-flash-max/research.md:118-126` are each applied to `.opencode/skills/sk-doc/sk-create-chart/assets/templates/` or refused in a new ADR in `decision-record.md`
- [ ] C1 through C5 of `decision-record.md:205-209` are each applied or refused, and ADR-004 leaves `Proposed`
- [ ] `candlestick.html:153` no longer passes a raw number to `String()`, and no rendered tick label in the corpus matches `/\.\d{6,}/`
- [ ] The library half of `research.md` sections 3 to 11 is re-run on an executor with live web search, and every upstream URL it cites is marked resolved or unverified
- [ ] `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render` prints `RESULT: PASSED`
- [ ] `validate.sh specs/sk-doc/051-sk-create-chart/007-fidelity-and-library-research --strict` prints `RESULT: PASSED`
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
| T2 number formatter | Open | No template matches `toLocaleString`, `Intl.NumberFormat` or `function fmt`. `candlestick.html:153` still emits `String(value)` |
| T3 null and NaN filtering | Open | No template matches `isNaN`, `Number.isFinite` or a null test in a path builder |
| T5 series-mapping descriptions | Partly present | Every template carries a `<desc>` with a data-derived clause, such as `daily-line.html:70`. None maps a colour to a series: `stacked-bars.html:72` names three product lines without saying which band is which |
| T6 minimum-size guard | Open | No template matches `min-width` or `overflow-x` |
| T7 budget comments | Partly present | `parallel-axes.html:142-143` explains the label collision rule in prose. No template carries a numeric gutter budget, thinning rule or unit width |
| T8 gradient ramp legends | Open | No template matches `linearGradient`, including `calendar-grid.html` and `heat-matrix.html` |
| T10 pattern fills | Open | No template matches `<pattern` |
| C1 narrow-viewport assertion | Open | `scripts/check-corpus.cjs:235` asserts a viewport meta tag exists. Nothing sets a window size or checks page overflow |
| C2 display-ready time labels | Open | `references/catalog.md` never says "display-ready". The `data shape` gloss at line 74 does not cover label formatting |
| C3 computed-value exception | Open | `references/template-contract.md:87` still reads "never computes the numbers it is displaying" with no exception named |
| C4 in-figure notice | Open | Ceilings live only in author comments, such as `heat-matrix.html:102` and `scatter.html:100`. No template renders a notice or warns |
| C5 diverging colour system | Open | `diverging` appears nowhere in `references/color-system.md` |
| Upstream citation re-verification | Open | The run had no web tooling, recorded under Known Limitations in `implementation-summary.md` |

### Deviations and findings

| Item | Note |
|------|------|
| T5 and T7 are partly present | Both were listed as unapplied. Half of each was already there before this phase: the descriptions carry data-derived clauses, and one template documents its collision rule. What is missing is the series-to-colour mapping and the numeric budgets |
| The tick fix reduced float dust rather than removing it | Counting from an integer index left one dusty label, because the multiplication is itself inexact. T2 is the fix, which makes T2 the first item to work |
| The preferred executor was unavailable | GPT-5.6 LUNA at max reasoning returned a usage limit on `cli-codex`, and the same credential backs `cli-opencode`. DeepSeek V4 Flash ran instead, without web search, which is why the upstream half needs a second run. The operator still prefers LUNA at max fast for that re-run |
| A concurrent agent lost uncommitted work | The fan-out guard restored twenty-three tracked files from `HEAD` at 19:09:22Z. Nineteen belonged to another agent and were never committed. D3 exists to stop a repeat |
<!-- /ANCHOR:log -->
