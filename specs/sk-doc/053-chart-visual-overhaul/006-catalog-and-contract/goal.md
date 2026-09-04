---
title: "Goal: Catalog and Contract Corrections"
description: "The durable directive this phase executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "chart catalog goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/053-chart-visual-overhaul/006-catalog-and-contract"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Executed the catalog and contract corrections"
    next_safe_action: "Run phase 007, which asserts every invariant this phase introduced"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/references/catalog.md"
      - ".opencode/skills/sk-doc/sk-create-chart/references/color-system.md"
      - "specs/sk-doc/051-sk-create-chart/008-evilcharts-reference-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-006-catalog-and-contract"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No catalog row changes system, and grouped-bars keeps neutral on the colour document's own decision procedure"
      - "The sweep is permitted on three ordered forms and carried by progress-single alone"
      - "The geometry block goes in every file and the contract restates none of its numbers"
---
# Goal: Catalog and Contract Corrections

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the phase. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the chart corpus tell the truth about itself: the right colour system per row, the gaps named, the type scale published, an empty figure that says it is empty, and one shared block of geometry defaults.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The system re-check covers all twenty rows and is written down, including the rows that do not change. Copying the one finding is not the audit |
| D2 | A system reassignment is a paired edit. The catalog cell and the template's own declaration change together or not at all |
| D3 | This phase changes one picture, and it owes a before and after for it. A documentation phase does not redraw a chart quietly |
| D4 | The gradient clause is drafted and not applied. Only a yes from the operator moves it |
| D4a | Answered yes on 2026-09-03, scoped to systems that already encode magnitude. Permitted on the calendar grid, the heat matrix and the progress form, forbidden on every neutral or categorical series, and enforced by the checker |
| D5 | The shared geometry block records what the corpus already does. A form whose numbers differ keeps them and says why |
| D6 | The empty-data guard is proved on a fixture and proved silent on the shipped data, per form |
| D7 | The checker is not edited here. Phase 007 asserts every invariant this phase introduces |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] The written twenty-row system re-check exists and accounts for every row, including the ones that do not change. ADR-001 of `decision-record.md`, twenty rows, no row changed
- [x] `grep -E '^\| grouped-bars \|' .opencode/skills/sk-doc/sk-create-chart/references/catalog.md` and `grep 'chart-color-system' .opencode/skills/sk-doc/sk-create-chart/assets/templates/grouped-bars.html` name the same system. Both print `neutral`
- [x] `grep -l 'CHART_EMPTY_NOTICE' .opencode/skills/sk-doc/sk-create-chart/assets/templates/*.html | wc -l` prints `20`, and every one is proved to fire on an empty fixture and stay silent on its shipped data. It printed 20, and the fixture run reports twenty firing and twenty silent
- [x] `grep -c 'sankey' .opencode/skills/sk-doc/sk-create-chart/references/catalog.md` prints a number greater than `0`. It printed 1, outside the sentinels
- [x] `grep -c 'GEOMETRY DEFAULTS' .opencode/skills/sk-doc/sk-create-chart/assets/color/palette-sheet-neutral.html` prints `1`. It printed 1
- [x] `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render` prints `RESULT: PASSED` with `catalog` at 0 failures. 20 checks, 29 files, `catalog: 41 assertion(s), 0 failure(s)`, `Summary: errors: 0`
- [x] `NODE_PRESERVE_SYMLINKS=1 bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-doc/053-chart-visual-overhaul/006-catalog-and-contract --strict` prints `RESULT: PASSED` with Errors 0
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
| Phase planning | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and this document authored 2026-09-03 |
| Recommended level | Done | `recommend-level.sh --loc 520 --files 25 --architectural` returned Level 2 at 67 of 100, phases not recommended at 20 of 50 |
| Baseline corpus check | Done | 15 checks over 29 files, 0 failures, `RESULT: PASSED`, captured before any edit in this packet |
| Baseline corpus check | Done | Two runs. The first printed `RESULT: FAILED` on one `dark-render` assertion where the browser died on `waterfall.html`. The second, from the same untouched tree, printed `RESULT: PASSED` at 20 checks and 0 errors |
| The twenty-row system re-check | Done | ADR-001. Twenty verdicts, no row changed, and one row found declaring a system it was not using |
| The system reassignment | Not required | The re-check found no row to move. `grouped-bars` keeps `neutral`, argued in ADR-001 against the research finding that named it |
| The empty-data notice on twenty forms | Done | Marker in exactly the twenty templates. Twenty fire on an empty fixture, twenty stay silent on shipped data, and both edges hold |
| The type scale as named roles | Done | Six roles in the contract's skeleton section, plus the three per-form departures named |
| The catalog gap prose | Done | Catalog section 6, outside the sentinels, with the composed entry shaped for deletion |
| The shared geometry defaults | Done | `GEOMETRY DEFAULTS` byte-identical in all 20 forms and all 3 proof sheets, with the contract naming it and restating no number |
| The gradient clause | Done, applied | The operator answered yes with a scope on 2026-09-03. Written into the colour document and applied on `progress-single` |
| Final corpus check | Done | `RESULT: PASSED` with `--render`, 20 checks, 29 files, 0 errors, read from a file |
| Picture parity | Done | Nineteen of twenty forms render byte-identical to their pre-phase picture. The twentieth is the sweep |

### Deviations and findings

| Item | Note |
|------|------|
| The parent's aggregate file table omits this phase | The parent `spec.md` lists `assets/templates/*.html` and `assets/color/*.html` as changed in phases 001 to 005 and 007. This phase changes both, for the empty-data notice and the shared geometry defaults. The row needs one edit when the orchestrator reconciles the parent |
| One correction changes a picture | The system reassignment is a colour change by definition, which sits oddly inside a phase named for documentation. D3 exists so it is reported with the picture rather than buried in a list of doc edits |
| The composed gap entry has a one-phase life | Phase 007 builds the composed form, so the gap prose written here is deliberately shaped to be deleted rather than rewritten |
| Two corrections came from reading the corpus against itself | The system mismatch and the missing empty-data notice are not in the vendored source at all. They surfaced because two lineages read both sides, which is worth remembering the next time a reference read looks like it only produces adoption rows |
| The finding that named this phase did not survive the audit | The research reported `grouped-bars` as sitting on the wrong system, and the spec's SC-001 wrote that outcome in as a success criterion. The twenty-row reading does not support it. The row's two series are ordered in time, `categorical` is defined for categories that are unordered, and `neutral` is the documented default that wins a tie. SC-001 is corrected under ADR-006 and AC-002, which was always direction-neutral, is met |
| The audit found a different defect than the one it went looking for | `progress-single` declares `ordered`, whose whole content is that colour encodes magnitude, and painted a fixed value. The operator's sweep is what makes the declaration true, which is why the one picture this phase changes is that form rather than the reassigned one |
| A fixture caught the guard reading the wrong emptiness | The first predicate coerced with `Number()` before testing finiteness, and `Number(null)` is zero, so a null reading counted as readable. The corpus already had the right test in the three time forms that break a line at a gap, and the guard now uses it |
| The proof script lied before the guard did | The first proof run reported the notice present on all twenty shipped files. A `--dump-dom` run echoes the inline script back, and the notice text is a string literal in it, so a search over the document finds the notice in files that never drew it. Scoping the search to the rendered figure region is what made the proof mean anything |
| The changelog line in the spec names a folder that does not exist | The phase template's changelog note points at `../changelog/`, which is not present under the parent packet and which no sibling phase created. Nothing was refreshed. The skill's own changelog under `sk-create-chart/changelog/` is outside this phase's file list |
<!-- /ANCHOR:log -->
