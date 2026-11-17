---
title: "Implementation Summary"
description: "The harness for a fair off and on arm was built, 36 blind rows were frozen and the arenas ran, but the operator stopped the arm before any scoring, so it gives no verdict."
trigger_phrases:
  - "untuned behaviour arm implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/026-untuned-behaviour-arm"
    last_updated_at: "2026-11-15T07:45:00Z"
    last_updated_by: "claude"
    recent_action: "Closed the phase after the operator stopped the arm before scoring"
    next_safe_action: "Phase 025 writes the release notes, naming this arm as built but not scored"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/behaviour-fresh-prompts.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "77af2d6d-58e8-4180-b6da-697f12833f71"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 026-untuned-behaviour-arm |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The harness can now run a fair test of whether the advisor makes models follow the right workflow: the same rows, the same commit and the same models, with only the advisor switched off or on. The test itself was not scored. The operator stopped it before any scoring, so this phase gives no verdict on the core need.

### Phase 26: untuned-behaviour-arm

The runner gained `off` and `on` arms, a `fresh` row set, a run number per line and a delivery check that drops a run whose brief contradicts its arm. The scorer pairs the arms per row, counts rows only one arm scored as unpaired, and prints a pooled one-sided sign test with the decline and skill-only start counts. A blind DeepSeek author wrote 36 fresh rows from a brief that held only the class definitions, the command listing and the skill names. The rows were frozen before the first session.

The arm then exposed that the Gate 2 direct call ignored the off switch, which phase 028 fixed before any arena was built.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `RAD/run-command-behaviour.mjs` | Modified | Off and on arms, fresh set, run numbers, the `CLAUDE.md` pointer restore, and the Pi and OpenCode models |
| `RAD/prepare-behaviour-arena.mjs` | Modified | Arena `CLAUDE.md` pointer kept out of the restore |
| `RAD/score-command-transcripts.mjs` | Modified | Arm pairing, unpaired rows, pooled sign test, start counts |
| `RAD/README.md` | Modified | The two arms and how a paired block reads |
| `RAD/behaviour-fresh-prompts.jsonl` | Created | 36 blind fresh rows, frozen in `c4f1b1452a` |
| `runtime/tests/command-behaviour-guards.vitest.ts` | Modified | Runner cases |
| `runtime/tests/command-transcript-score.vitest.ts` | Modified | Scorer cases |

`RAD` is `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy`, and `runtime` sits under `.skilled/skills/system-skill-advisor/`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek workers built the runner and scorer tasks in three lanes, each checked by an Opus verifier, and a fresh Fable review found one P1 and four P2 that became T054 to T057. The harness was committed as `f2aff786c0`, the rows as `c4f1b1452a`, and six arenas were built at `6ccb2b5157`. Ten smoke sessions on five runtimes delivered the brief as expected. The measured passes then started and were stopped by the operator at 07:2x on 2026-11-15, before any scoring.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Codex left out (Q001) | Its `/hooks` approval never reached the Codex config, so its on arm could not be measured |
| Pi and OpenCode on `opencode-go/deepseek-v4.1-flash` (Q002) | The max-effort route took about three minutes a turn |
| Run 1 of both arms plus decline rows only in run 2 (Q003) | A fresh Fable review judged run 2 to add noise reduction only, and kept every on-arm decline session |
| Stop before scoring (Q004) | Operator decision |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Suites at the harness commit | VALL 2121 passed, 0 failed. Guard tests 33 of 33 after each model change |
| Stored summaries unchanged | Both `cmp` checks of T031 print nothing |
| Switch probe after phase 028 | Hooks print no `Advisor:` under OFF and 1 without it, the direct call abstains on 5 of 5 off lines |
| Fresh rows | Opus verifier PASS: counts 10, 5, 5, 8 and 2 of each decline kind, 19 distinct commands. Freeze numstat prints nothing |
| Arenas | Each at its commit with no remote, an empty status, `@AGENTS.md` and the B-6 sentence |
| Smoke | Claude, Pi, Devin and DSH read `false` off and `true` on. OpenCode reads `unknown` in both arms |
| Sessions kept | Claude off 1 and on 1, 36 each. Devin 23, DSH 23, Pi 12, OpenCode 8 off 1 lines. No scoring ran |
| Advisor-only check on the fresh rows | Expected command offered on 6 of 20 fit rows, expected skill first on about 12 of 20 fit rows and 4 of 8 skill-only rows, a command offered on 4 of 8 decline rows. This is deterministic advisor output, not a model outcome |
| Blocked tasks | T040 (Codex), T042 (stopped) and T043 to T049 (not run) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No verdict.** The core need, whether models follow the right workflow more often with the advisor on, is still unmeasured on untuned rows. The harness, the frozen rows and the arenas recipe stand ready, so a later run needs only the sessions and the scoring tasks.
2. **The fit guards leak on fresh wording.** The advisor offers a command on 4 of 8 fresh decline rows. These rows must not be used to tune the guards, or they stop being untuned.
3. **Claude's 72 lines are unscored.** They could give one runtime's direction, but the pre-registered target pools the runtimes, so they were not scored here.
<!-- /ANCHOR:limitations -->
