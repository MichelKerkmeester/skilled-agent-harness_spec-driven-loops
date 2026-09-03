---
title: "Goal: The Dark Theme"
description: "The durable directive this phase executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "chart dark theme goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/053-chart-visual-overhaul/005-dark-theme"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive for the dark theme"
    next_safe_action: "Put the contract amendment to the operator"
    blockers:
      - "The contract amendment in spec section 12 is unanswered"
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json"
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
      - "specs/sk-doc/051-sk-create-chart/008-evilcharts-reference-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-005-dark-theme"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the contract gains a second palette block per file"
      - "Whether the dark chrome keeps the warm cast the light chrome has"
    answered_questions:
      - "Dark series values are re-chosen hues rather than lightened light ones"
      - "Every contrast gate is computed per theme against that theme's own surface"
---
# Goal: The Dark Theme

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the phase. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give every file in the chart corpus a second, media-scoped palette that answers a dark operating system, with every contrast gate re-run per theme and the contract amended out loud.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The contract amendment is the operator's call. No asset file gains a second palette block until the answer is recorded |
| D1a | Answered yes on 2026-09-03. A file carries one palette block per theme and at most two, each matched against its own projection of the palette source in both directions. The phase proceeds |
| D2 | Dark series values are re-chosen for the dark ground, not lightened. The existing derivation rule keeps governing steps inside one theme |
| D3 | Every gate is computed from the palette source per theme, against that theme's own surface. No threshold is restated in a test |
| D4 | A gate failure is fixed by re-deriving the value, never by lowering the threshold |
| D5 | The operating system preference is the only theme signal. No control ships inside the file |
| D6 | The order is amendment, palette source, checker, then the twenty-nine files. Nothing is pasted before the check understands it |
| D7 | Nothing is copied from the vendored source. The construction is read and re-authored |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] The operator's answer on the palette-block amendment is recorded in the progress table below, with the drafted sentence beside it
- [ ] `grep -rl 'CHART_PALETTE_DARK:BEGIN' .opencode/skills/sk-doc/sk-create-chart/assets/ | wc -l` prints `29`
- [ ] `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs` prints both a `palette-source` line and a `palette-source-dark` line, each with a nonzero assertion count and `0 failure(s)`
- [ ] `grep -c 'exactly one palette block' .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md` prints `0`
- [ ] The dark section is shown to fail on a below-gate value and on a drifted block, then restored, with all three runs recorded in the implementation summary
- [ ] `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render` prints `RESULT: PASSED`
- [ ] `NODE_PRESERVE_SYMLINKS=1 bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-doc/053-chart-visual-overhaul/005-dark-theme --strict` prints `RESULT: PASSED` with Errors 0
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
| Recommended level | Done | `recommend-level.sh --loc 700 --files 33 --architectural` returned Level 3 at 71 of 100, and a phase score of 30 of 50 |
| Baseline corpus check | Done | 15 checks over 29 files, 0 failures, `RESULT: PASSED`, captured before any edit in this packet |
| The contract amendment | Pending | Drafted in spec section 12. It reads: a file carries one palette block per theme and no more than two, each matched against its own projection of the palette source in both directions |
| Dark chrome values | Pending | |
| Dark values for the three systems | Pending | |
| Checker dark section | Pending | |
| The twenty-nine second blocks | Pending | |
| Both gate lines green | Pending | |

### Deviations and findings

| Item | Note |
|------|------|
| The level score suggested two phases | `recommend-level.sh` reported a phase score of 30 of 50 and suggested two. The work stays one phase, because splitting a palette from the check that proves it produces two phases neither of which can close alone |
| The derivation rule has to bend | The colour system says derive light and dark and never introduce a hue. That rule was written for one ground. ADR-001 in `plan.md` bounds the exception to a theme boundary rather than removing the rule |
| The lightest-step gate tests the wrong end on a dark ground | The 1.15 to 1 floor keeps a low cell distinguishable from an empty one, which means the step nearest that theme's surface. On the dark ground that is the darkest step, not the lightest. Task T012 fixes the end the check tests |
| The three proof sheets are also the skeleton | The contract tells an author to copy `palette-sheet-neutral.html`, so a proof sheet without the dark block would make every future template non-conformant on creation. They are themed first, in task T017 |
<!-- /ANCHOR:log -->
