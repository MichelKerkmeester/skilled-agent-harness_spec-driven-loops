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
    recent_action: "Authored the durable directive for the catalog and contract corrections"
    next_safe_action: "Work Phase 1 of tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/references/catalog.md"
      - ".opencode/skills/sk-doc/sk-create-chart/references/color-system.md"
      - "specs/sk-doc/051-sk-create-chart/008-evilcharts-reference-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-006-catalog-and-contract"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether a single series may carry a gradient along its own system ramp"
      - "Whether any catalog row besides grouped-bars changes system"
    answered_questions:
      - "A system reassignment is a paired edit across the catalog row and the template"
      - "The composed gap entry is written to be removed by phase 007"
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

- [ ] The written twenty-row system re-check exists and accounts for every row, including the ones that do not change
- [ ] `grep -E '^\| grouped-bars \|' .opencode/skills/sk-doc/sk-create-chart/references/catalog.md` and `grep 'chart-color-system' .opencode/skills/sk-doc/sk-create-chart/assets/templates/grouped-bars.html` name the same system
- [ ] `grep -l 'CHART_EMPTY_NOTICE' .opencode/skills/sk-doc/sk-create-chart/assets/templates/*.html | wc -l` prints `20`, and every one is proved to fire on an empty fixture and stay silent on its shipped data
- [ ] `grep -c 'sankey' .opencode/skills/sk-doc/sk-create-chart/references/catalog.md` prints a number greater than `0`
- [ ] `grep -c 'GEOMETRY DEFAULTS' .opencode/skills/sk-doc/sk-create-chart/assets/color/palette-sheet-neutral.html` prints `1`
- [ ] `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render` prints `RESULT: PASSED` with `catalog` at 0 failures
- [ ] `NODE_PRESERVE_SYMLINKS=1 bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-doc/053-chart-visual-overhaul/006-catalog-and-contract --strict` prints `RESULT: PASSED` with Errors 0
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
| The twenty-row system re-check | Pending | |
| The system reassignment | Pending | |
| The empty-data notice on twenty forms | Pending | |
| The type scale as named roles | Pending | |
| The catalog gap prose | Pending | |
| The shared geometry defaults | Pending | |
| The gradient clause | Pending | Drafted text is in `plan.md` and in spec section 10. It is not applied |

### Deviations and findings

| Item | Note |
|------|------|
| The parent's aggregate file table omits this phase | The parent `spec.md` lists `assets/templates/*.html` and `assets/color/*.html` as changed in phases 001 to 005 and 007. This phase changes both, for the empty-data notice and the shared geometry defaults. The row needs one edit when the orchestrator reconciles the parent |
| One correction changes a picture | The system reassignment is a colour change by definition, which sits oddly inside a phase named for documentation. D3 exists so it is reported with the picture rather than buried in a list of doc edits |
| The composed gap entry has a one-phase life | Phase 007 builds the composed form, so the gap prose written here is deliberately shaped to be deleted rather than rewritten |
| Two corrections came from reading the corpus against itself | The system mismatch and the missing empty-data notice are not in the vendored source at all. They surfaced because two lineages read both sides, which is worth remembering the next time a reference read looks like it only produces adoption rows |
<!-- /ANCHOR:log -->
