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
    recent_action: "Shipped the dark theme across the corpus and proved both grounds"
    next_safe_action: "Run phase 006, the catalog and contract pass"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json"
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
      - "specs/sk-doc/051-sk-create-chart/008-evilcharts-reference-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-005-dark-theme"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The operator approved one palette block per theme, two at most"
      - "The dark ground keeps the paper's hue angle at a cut chroma"
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

- [x] The operator's answer on the palette-block amendment is recorded in the progress table below, with the drafted sentence beside it
- [x] `grep -rl 'CHART_PALETTE_DARK:BEGIN' .opencode/skills/sk-doc/sk-create-chart/assets/ | wc -l` prints `29`
- [x] `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs` prints both a `palette-source` line and a `palette-source-dark` line, each with a nonzero assertion count and `0 failure(s)`
- [x] `grep -c 'exactly one palette block' .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md` prints `0`
- [x] The dark section is shown to fail on a below-gate value and on a drifted block, then restored, with all three runs recorded in the implementation summary
- [x] `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render` prints `RESULT: PASSED`
- [x] `NODE_PRESERVE_SYMLINKS=1 bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-doc/053-chart-visual-overhaul/005-dark-theme --strict` prints `RESULT: PASSED` with Errors 0
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
| Baseline corpus check | Done | 18 checks over 29 files, 0 failures, `RESULT: PASSED`, captured with `--render` before any edit in this packet |
| The contract amendment | Done | Answered yes by the operator on 2026-09-03. It reads: a file carries one palette block per theme and no more than two, each matched against its own projection of the palette source in both directions. ADR-002 records it |
| Dark chrome values | Done | Surface `#161513`, ink `#F2F0EC` at 16.03:1, muted `#A8A5A0` at 7.43:1, rule `#F2F0EC17`. Each holds the ratio its light counterpart holds against paper, and the rule's alpha was solved for rather than copied |
| Dark values for the three systems | Done | Every value mirrors its light counterpart's ratio against its own ground. `neutral` 13.95, 8.24, 5.10, 3.15. `ordered` 11.27, 7.08, 4.41, 2.71, 1.76. `categorical` 10.00, 6.87, 4.77, 3.38, with every hue slot rotated |
| Checker dark section | Done | `palette-source-dark` at 34 assertions, a two-region `palette-block` at 116, and a `dark-render` open that proves the second block reaches the paint |
| The twenty-nine second blocks | Done | 20 forms, 6 deliveries, 3 proof sheets, each pasted from the exact text the check printed for that file |
| Both gate lines green | Done | `palette-source: 38 assertion(s), 0 failure(s)` and `palette-source-dark: 34 assertion(s), 0 failure(s)` |
| Final verification | Done | `--render` from the final state: 20 checks, `Summary: errors: 0`, `RESULT: PASSED`, exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| The level score suggested two phases | `recommend-level.sh` reported a phase score of 30 of 50 and suggested two. The work stayed one phase, because splitting a palette from the check that proves it produces two phases neither of which can close alone |
| The derivation rule had to bend, and bent less than expected | ADR-001 bounded the exception to a theme boundary. What it needed turned out to be one sentence: a dark value is re-chosen at a hue the dark ground can carry, and its lightness is set so it holds the same ratio against near-black that its light counterpart holds against paper. That rule produced the whole palette, and the emphasis separations came out unchanged without being aimed at |
| The lightest-step gate tested the wrong end on a dark ground | Fixed by testing the end by its distance from that theme's ground, after asserting the array's ordering so a reversal cannot pass by having its ends relabelled |
| Two gate names now read wrong on one ground | `rampDarkestOnSurface` and `rampLightestOnSurface` name a ramp's ends by lightness, and on ink the darkest end is the brightest one. The check tests the right end and says which, both documents say the names are wrong, and the rename is proposed in ADR-005 rather than folded into this phase |
| The three proof sheets were also the skeleton | Themed first, in T017, since the contract tells an author to copy `palette-sheet-neutral.html` |
| The render inherited the operator's own colour scheme | Measured rather than assumed: with no flag this machine's headless browser reported the dark scheme, because the operating system is set to dark. Both opens of the settled pair now pin the light scheme and a third pins the dark one, so a run means the same thing on any machine |
| The check gained a third open, which the in-scope list did not name | The plan's testing strategy did name it, at "every file opened headless under both colour schemes". It earns its place independently: a block that matches the source, sits inside a `prefers-color-scheme` query and never paints is invisible to every text check in the packet, and that is exactly what was mutated to watch it fail |
| Two documents outside the file list carried statements the amendment falsified | `scripts/README.md` described the checks, and the manual playbook's `CHT-005` said the contract allows exactly one block per file. Both were corrected, and the playbook gained `CHT-009` for reading a delivery on a dark system, which its own checklist item asked for. The package validator passes at 9 scenarios and 0 violations |
| One hard blocker sits in the contract and predates this phase | `hvr_scan.py` reports a semicolon in section 10 of `template-contract.md`, in a sentence phase 004 wrote. It reports the same blocker against the committed file, so it is not this phase's and it is left for phase 006, which owns the contract pass. Every document authored here reports zero |
| The light theme paints byte-identically to the committed state | All 29 files rendered from `HEAD` and from the working tree under a pinned light scheme, and every pair of pictures matched. The dark theme adds a second ground rather than moving the first |
<!-- /ANCHOR:log -->
