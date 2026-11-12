---
title: "Implementation Summary"
description: "The advisor now has a command prompt corpus and a captured baseline: typed commands reach their command 19 times in 44, plain chat 0 times in 88, and no must-not-start prompt is offered a command."
trigger_phrases:
  - "command routing baseline corpus implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/001-command-routing-baseline-corpus"
    last_updated_at: "2026-11-12T13:18:05Z"
    last_updated_by: "generate-context"
    recent_action: "Built and verified the command routing corpus, baseline and slice test"
    next_safe_action: "Plan phase 002 command inventory and risk metadata"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json"
      - ".skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts"
    session_dedup:
      fingerprint: "sha256:a3a1ac921e3667e09e25051fc69953e426f98ef5e8f71cb12e30569f9c75b9c7"
      session_id: "scaffold-001-command-routing-baseline-corpus"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3+ -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-command-routing-baseline-corpus |
| **Completed** | 2026-11-12 |
| **Level** | 3+ |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Command routing in the skill advisor is now measured. A typed slash command reaches its own command on 19 of 44 rows, a plain-chat request on 0 of 88, and none of the 35 prompts that should stay quiet is offered a command. Every later phase reports its change against these numbers.

### Phase 1: command-routing-baseline-corpus

You can now ask how often a prompt reaches a slash command and get a committed answer per command. The corpus holds 175 rows: one typed and two plain-chat rows for each of the 44 tracked commands, 22 rows that must not start a command, 9 near misses and 12 slash variants. Half of the plain rows are a holdout that phase 3 does not read.

The baseline also names what the scorer cannot do today. 25 of the 44 commands have no TypeScript-enabled bridge and can never be returned as themselves, including every `/speckit`, `/deep` and `/design` command. A typed `/speckit:plan` returns the skill or a namespace bridge. Of 12 rows where a command sat below a skill, the skill owned the command on 7.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` | Created | 175 gold rows for command routing |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs` | Created | Scores the corpus under the pinned regime and prints or writes the baseline |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` | Created | The captured totals, per-command counts and per-row results |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts` | Created | Fails on any drift from the baseline, row by row |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | Modified | Names the three new files |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The operator asked for a DeepSeek V4.1 Flash swarm at max thinking. Seven workers ran through Pi on `llmgateway/deepseek-v4.1-flash-1017`, each with one file to write: four authored the per-command rows, one the must-not-start, near-miss and slash-variant rows, one the capture script and one the slice test. The briefs and logs are in `scratch/briefs/` and `scratch/logs/`. The orchestrating session did the setup tasks, read every row and both code files, merged the parts and ran every check below.

Two edits to the capture script were made by the orchestrating session after the worker returned: the stale-build refusal, and the per-row `rows` object. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Ratchet on a captured baseline, not on exact picks per row | Most commands cannot be reached yet, so exact-row assertions would fail on day one or be switched off |
| Hold out half of the plain rows | Phase 3 writes phrases this corpus scores, and a gain on rows it never read shows the phrases generalise |
| Record a result per row in the baseline | A total can hold still while one row is gained and another lost, and a changed label is then named by its row id |
| Drop `expected_second`, store `expected_policy` unscored | Decision D2 leaves the order of skill and command open, and no recommendation carries a policy before phase 5 |
| Let DeepSeek author the rows | The operator chose the executor. The rows were read one by one before the merge, and their source is recorded in each row |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Pinned numbers before and after | `[158,50,20,5]` both times, `scorer-eval-baseline.json` unchanged |
| `npx vitest run tests/command-routing-slice.vitest.ts tests/parity/scorer-eval-baseline-ratchet.vitest.ts tests/parity/holdout-independent.vitest.ts` | 3 files, 17 tests passed |
| `npx vitest run tests/command-routing-slice.vitest.ts` alone | 4 passed in 3.6 s, under the 30 s timeout |
| Changed label proof | Failed and named `cmd-create-agent-typed-01`. Restored, 4 of 4 passed |
| Two capture runs | `diff` printed nothing |
| Exit paths | Unknown flag, empty corpus and unknown command each exit 2 with a message |
| `npm test` | 162 files passed, 1,391 tests passed, 8 skipped, 245 s |
| Acceptance criteria | 13 rows, 13 Met, none waived. See `acceptance-criteria.md`. Checklist P0 8 of 8, P1 13 of 13 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One author wrote the prompts.** All 175 rows come from one model in one sitting, so they may share a style the scorer happens to like or dislike. The `source` field marks them, and rows from real transcripts can be added before phase 3 with a re-capture.
2. **The policy label is not scored.** `expected_policy` is stored and nothing compares it until a recommendation carries a policy in phase 5.
3. **Only the TypeScript scorer is measured.** The Python scorer has 50 active bridges against 40 and is not scored here.
4. **The stale-build check can fail the slice test on a developer machine.** A source file newer than `dist` makes it fail with the rebuild message. Run `npm run build` first.
5. **Pi 1.5.2 cannot load this worktree's extensions.** The swarm ran on Pi pinned to 1.5.0 and the pin was restored to 1.5.2 afterwards.
<!-- /ANCHOR:limitations -->

---

