---
title: "Goal: Chrome Rollout"
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
    packet_pointer: "sk-doc/053-chart-visual-overhaul/002-chrome-rollout"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Rolled the settled chrome across the corpus and put the corner ladder behind a check"
    next_safe_action: "Start phase 003 on a corpus that passes --render from its final state"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json"
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
      - ".opencode/skills/sk-doc/sk-create-chart/assets/color/palette-sheet-neutral.html"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-002-chrome-rollout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Every number binds to the corpus formatter, never to a locale-dependent one"
      - "The mono face is a system stack, so the no-web-font rule holds"
      - "Round tick dots are carried and not applied"
      - "The rungs live beside chrome, not inside it, because a corner cannot differ by theme"
      - "A fill that carries a value does not fade"
---
# Goal: Chrome Rollout

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Roll the chrome settled in phase 001 across all twenty templates, the six family deliveries and the skeleton, and turn the corner radius into a token ladder the corpus check can assert.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every printed number keeps going through the file's own formatter. `toLocaleString` appears nowhere, because a delivered file has to look the same on the machine that opens it |
| D2 | The mono face resolves from a system stack. A web font is banned by the contract and an embedded one breaks the file a reader can edit |
| D3 | The ladder and the check that enforces it ship together. A convention nothing checks is a wish, and the current uniform radius is already in that state |
| D4 | The skeleton is edited last, so a form copied from it inherits the final state rather than a midpoint |
| D5 | The round tick dots row is carried in the decision record and not applied, because the corpus draws no tick marks to replace |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render` prints `RESULT: PASSED` with `Summary: errors: 0`
- [x] `grep -rc 'border-radius: 10px' .opencode/skills/sk-doc/sk-create-chart/assets/` returns 0 in every file, against a recorded before-count of 20
- [x] `grep -rn 'toLocaleString' .opencode/skills/sk-doc/sk-create-chart/assets/` returns no match
- [x] `grep -rl 'ui-monospace' .opencode/skills/sk-doc/sk-create-chart/assets/` lists all twenty-nine asset files, which was the whole corpus at this phase's close. Phase 007 added `templates/bar-line-composed.html` and it carries the mono stack too, so the same command returns 30 of 30 today
- [x] The corpus check names a radius rule with a nonzero assertion count, and that rule printed `RESULT: FAILED` on a mutated template before the template was restored
- [x] `decision-record.md` carries ADR-001 through ADR-005, with ADR-005 resolved to Route A or Route B on tested evidence
- [x] `validate.sh specs/sk-doc/053-chart-visual-overhaul/002-chrome-rollout --strict` prints `RESULT: PASSED`
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
| A1 dashed grid across the grid-bearing files | Done | 13 of 13, not the 10 the row predicted: three deliveries draw a grid too |
| A1b muted tick ink across the corpus | Done, no-op | All 14 `.tick` declarations already read `var(--chart-muted)` before the phase began |
| A2 mono face with tabular figures across twenty-nine files | Done | `grep -rl 'ui-monospace' assets/` returns 29 of 29, against a before-count of 2 |
| A7 two-weight dot language in the line family | Done, narrowed | `daily-line` and `orders-after-the-price-change`. ADR-006 records why `stacked-area` is out of reach |
| A9 area and band fills fading to the baseline | Done, narrowed | The same two files. ADR-006 records why `daily-range` and `stacked-area` are out of reach |
| Radius ladder as tokens, plus its check | Done | Five rungs in `palettes.json`, a `radius` check at 58 assertions, watched failing three times |
| Bar-end radius on the six bar-family forms | Done | Five build a path so only the outer edge rounds, and `progress-single` is a pill that keeps both ends |
| Round tick dots, carried and not applied | Recorded | ADR-004 in `decision-record.md` |
| Series stroke at the settled 1px | Done | `orders-after-the-price-change` 2 to 1, `parallel-axes` four lines 2.5 to 1 |
| The glow verdict | Done, no-op | No filter was authored anywhere |
| Both reference documents and the scripts README | Done | Rule 15, the corner roles table, and how to break both branches of the new check |

### Deviations and findings

| Item | Note |
|------|------|
| The before-counts in the packet docs were the templates-only counts | The tree holds 29 `border-radius: 10px` declarations and 13 grid declarations, not the 20 and 10 the spec and this goal predicted. The six deliveries and the three proof sheets type the same chrome the templates do. The inventory in `scratch/counts-before.txt` was taken over `assets/` whole, which is the only reason the nine extra files were not missed |
| A length does survive the palette block machinery | Route A was tested rather than argued about, and it works: `scratch/route-a-test.txt` shows the rung emitted into the printed block with `palette-source` unchanged at 22 assertions and 0 failures. Route B was chosen anyway, because phase 005 duplicates that block under a media query and a corner is the one value that cannot differ by theme |
| Three rows named files that cannot carry them | An area fade for a form drawing range bars, a dot language for a form drawing no marks, and an `rx` attribute to verify a one-edge requirement that an `rx` cannot express. ADR-006 records all three and AC-018, AC-019 and AC-020 replace them |
| Mono advances are wider, and it changed nothing | Every rendered label in all 29 files is character-identical before and after, proven by diffing two headless renders. The measured overlaps are the same three that existed before, and two of those are an artefact of a rotated axis name |
| One real defect, found by looking rather than by checking | `progress-single`'s 56px headline figure in a mono face put the decimal point in a cell as wide as a digit, so 6.7 read as 6 . 7. That figure keeps the body face: nothing is set under it to line up with |
| `git checkout --` destroyed uncommitted work during the negative control | It reverts to the last commit rather than to the working state, so it wiped this phase's edits to `bar-columns.html` and the run that followed failed for an unrelated reason. The edits were re-applied and the control was redone against a kept copy. `scripts/README.md` now warns about it in the section that teaches the technique |
<!-- /ANCHOR:log -->
