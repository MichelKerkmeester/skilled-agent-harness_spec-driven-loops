---
title: "Goal: The Interaction Layer"
description: "The durable directive this phase executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "chart interaction goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/053-chart-visual-overhaul/004-interaction-layer"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive for the interaction layer"
    next_safe_action: "Work Phase 1 of tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
      - "specs/sk-doc/051-sk-create-chart/008-evilcharts-reference-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-004-interaction-layer"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether independent-percentages counts as a multi-series form"
      - "How far the interaction hygiene should reach"
    answered_questions:
      - "The determinism rule bans automatic variation rather than event handlers"
      - "Tooltip values bind to the corpus formatter and never to a locale-dependent one"
---
# Goal: The Interaction Layer

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the phase. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give the chart corpus its first interaction layer, on the forms that earn one, without a static file ceasing to be static on first paint.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Interaction is added per form against a written reason. The per-form table in `plan.md` is the contract, and a form absent from it gains nothing |
| D2 | Rule 12 bans randomness and a clock. A reader choosing to look closer is not automatic variation, and the proof is two renders with no pointer input |
| D3 | Every tooltip value goes through the file's own formatter. `toLocaleString` never enters the packet |
| D4 | A tooltip, a swatch or a dim value never introduces a colour literal. A derived value goes through `color-mix` on a palette role |
| D5 | No element a reader can reach with a keyboard loses its focus indicator, whatever the hygiene rules say |
| D6 | Nothing is copied from the vendored source. The recipe is read and re-authored in the corpus idiom |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] `grep -l 'data-chart-tooltip' .opencode/skills/sk-doc/sk-create-chart/assets/templates/*.html | wc -l` prints `7`
- [ ] `grep -l 'data-chart-legend' .opencode/skills/sk-doc/sk-create-chart/assets/templates/*.html | wc -l` prints `5`
- [ ] `grep -l 'data-chart-dim' .opencode/skills/sk-doc/sk-create-chart/assets/templates/*.html | wc -l` prints `5`
- [ ] `grep -rn 'toLocaleString' .opencode/skills/sk-doc/sk-create-chart/` prints nothing and exits 1
- [ ] `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render` prints `RESULT: PASSED` with `determinism` at 0 failures
- [ ] Rendering each interactive form twice with no pointer input yields identical figure-region hashes, recorded in the implementation summary
- [ ] `NODE_PRESERVE_SYMLINKS=1 bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-doc/053-chart-visual-overhaul/004-interaction-layer --strict` prints `RESULT: PASSED` with Errors 0
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
| Recommended level | Done | `recommend-level.sh --loc 800 --files 15 --architectural` returned Level 2 at 68 of 100, phases not recommended at 10 of 50 |
| Baseline corpus check | Done | 15 checks over 29 files, 0 failures, `RESULT: PASSED`, captured before any edit in this packet |
| Tooltip on seven forms | Pending | |
| Legend on five forms | Pending | |
| Dim on five forms | Pending | |
| Hygiene on thirteen forms | Pending | |
| First-paint determinism proof | Pending | |

### Deviations and findings

| Item | Note |
|------|------|
| The two lineages disagree about the hygiene pair | One adopts focus suppression and text selection locking from the vendored source, the other rejects both with the argument that a delivered chart is a document rather than a dashboard. This phase scopes the hygiene to pointer-driven marks and removes no keyboard focus indicator, which is why D5 exists |
| The legend set has one doubtful member | `independent-percentages` is listed as multi-series by the research and described by the corpus as measures that share no whole. Task T003 settles it before any legend is built |
| The checker is not extended here | Phase 007 owns the assertions for every invariant phases 004 through 006 introduce, so this phase writes the invariants down rather than checking them |
<!-- /ANCHOR:log -->
