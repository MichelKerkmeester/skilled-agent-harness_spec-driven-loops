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
    recent_action: "Authored the durable directive for the twenty-nine file chrome pass"
    next_safe_action: "Confirm phase 001 closed with a disposition on both forks"
    blockers:
      - "Phase 001 has not answered the stroke weight fork"
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json"
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
      - ".opencode/skills/sk-doc/sk-create-chart/assets/color/palette-sheet-neutral.html"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-002-chrome-rollout"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the radius tokens live inside the palette sentinels or beside them"
      - "Which rungs the ladder actually needs"
    answered_questions:
      - "Every number binds to the corpus formatter, never to a locale-dependent one"
      - "The mono face is a system stack, so the no-web-font rule holds"
      - "Round tick dots are carried and not applied"
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

- [ ] `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render` prints `RESULT: PASSED` with `Summary: errors: 0`
- [ ] `grep -rc 'border-radius: 10px' .opencode/skills/sk-doc/sk-create-chart/assets/` returns 0 in every file, against a recorded before-count of 20
- [ ] `grep -rn 'toLocaleString' .opencode/skills/sk-doc/sk-create-chart/assets/` returns no match
- [ ] `grep -rl 'ui-monospace' .opencode/skills/sk-doc/sk-create-chart/assets/` lists all twenty-nine asset files
- [ ] The corpus check names a radius rule with a nonzero assertion count, and that rule printed `RESULT: FAILED` on a mutated template before the template was restored
- [ ] `decision-record.md` carries ADR-001 through ADR-005, with ADR-005 resolved to Route A or Route B on tested evidence
- [ ] `validate.sh specs/sk-doc/053-chart-visual-overhaul/002-chrome-rollout --strict` prints `RESULT: PASSED`
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
| A1 dashed grid across ten grid-bearing files | Pending | Row table in `spec.md` |
| A1b muted tick ink across the corpus | Pending | Row table in `spec.md` |
| A2 mono face with tabular figures across twenty-nine files | Pending | Row table in `spec.md` |
| A7 two-weight dot language in the line family | Pending | Row table in `spec.md` |
| A9 area and band fills fading to the baseline | Pending | Row table in `spec.md` |
| Radius ladder as tokens, plus its check | Pending | ADR-002 and ADR-005 in `decision-record.md` |
| Bar-end radius on the six bar-family forms | Pending | Row table in `spec.md` |
| Round tick dots, carried and not applied | Recorded | ADR-004 in `decision-record.md` |

### Deviations and findings

| Item | Note |
|------|------|
| A length may not belong inside the palette block | `customProperties` walks `palette.chrome` and emits a property per key, and `checkPaletteSource` only takes contrast on ink and muted. The cheap route works and is not obviously correct, so ADR-005 decides it by testing |
| The corpus draws no tick marks | One lineage's round tick dots row has nothing to replace. It is recorded rather than dropped so a later phase does not rediscover it as a new idea |
| Mono advances are wider than sans advances | Every character-count width estimate in the corpus is tuned against a sans stack. The check does not judge the picture, so every file has to be opened and read |
<!-- /ANCHOR:log -->
