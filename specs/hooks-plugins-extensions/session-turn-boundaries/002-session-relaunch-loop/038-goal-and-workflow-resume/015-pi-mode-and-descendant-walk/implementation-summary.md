---
title: "Implementation Summary"
description: "A Pi receiver now starts in the Plan or Build mode its sender was last in, and the descendant walk in prepare is declined on the evidence of a live run."
trigger_phrases:
  - "pi mode and descendant walk implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk"
    last_updated_at: "2026-11-13T12:20:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Built the Pi mode carry and recorded the descendant walk decline; suites and validation pass"
    next_safe_action: "None, the phase is complete"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/pi/session-relaunch.ts", ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs", ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs", ".skilled/bin/skilled-loop"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-pi-mode-and-descendant-walk"
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
| **Spec Folder** | 015-pi-mode-and-descendant-walk |
| **Completed** | 2026-11-13 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Pi session that switched to Plan or Build mode now hands that mode to the session that replaces it. Before this phase the receiver started in whatever mode the first launch named. The proposed walk over every descendant of the runtime in `prepare` was not built, and `decision-record.md` holds the reason as ADR-002.

### Phase 15: pi-mode-and-descendant-walk

The mode travels through four layers. When the Pi adapter arms a hop, it reads the last `pi-plan-build-state` entry on the session branch and passes `mode` with the other live settings. The arm keeps the value only when it is `plan` or `build`. `consume` prints it. On a Pi hop the wrapper then drops every `--plan` and `--build` the first launch passed and adds the consumed mode once. Any other runtime, a missing mode and any other value leave the launch line as it was.

A session without the plan-build extension has no such entry, so its record carries no mode and its hop keeps the launch flags. A branch the host cannot read does the same.

Rank 14 changed no code. The live run of 2026-11-13 showed that a worker started with `nohup ... &` had parent pid 1 by the time `prepare` exited, so a walk from the runtime pid cannot reach the worker it was proposed for.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` | Modified | `liveSettings` reads the last plan-build state entry and returns `mode` for `plan` or `build`. |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` | Modified | Three tests: the carried mode, a branch with no entry and a throwing `getBranch`. |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | `armLocked` keeps `settings.mode` only for the two literals. |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modified | One test: `plan` and `build` are kept, `auto` is dropped. |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modified | `consume` prints `mode` with the other recorded keys. |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modified | One test: `consume` prints the recorded mode. |
| `.skilled/bin/skilled-loop` | Modified | A Pi hop replaces the launch mode flag with the consumed mode. |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` | Modified | One test with two cases: a consumed `plan` after a `--build` launch, and a consumed `auto` that changes nothing. |
| `.skilled/hooks/session-relaunch/README.md` | Modified | One sentence on the Pi mode under "Model And Effort Across A Hop". |
| `decision-record.md` | Created | ADR-002, the rank 14 decline. |
| `scratch/confirm-pi-mode.txt`, `scratch/red.txt`, `scratch/green.txt` | Created | The confirmation before the build and the test-first runs. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator confirmed rank 13 before any code edit. The plan-build source at its pinned commit writes the mode to the session branch, 50 session files hold a plan entry, and one Pi 1.5.2 launch through `skilled-loop` with `--plan` started in Plan mode. The verdict line reads `rank 13: build`.

The build went out as five `dsh` briefs on DeepSeek V4.1 Flash, one change each. Four wrote a failing test first, and `scratch/red.txt` holds those four runs with exit 1. The fifth added the two adapter edge-case tests, which passed at once because the source already handled both cases. `scratch/green.txt` holds the passing runs.

The orchestrator then read every diff, checked that each brief stayed in its files and ran the gates from the final state. One builder edit was undone: a quoted `consumed_field "model"` that existed only to make a grep count print 1.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read the mode from the session branch | The extension appends a state entry at every mode change, so the last entry is the live mode. The launch flag only says how the session started. |
| Carry only `plan` and `build` | Those are the two flags the extension accepts at launch. Session text must never reach the launch line. |
| The mode has its own line in the arm | The other live settings take any non-empty string. The mode takes two literals, so it does not belong in that loop. |
| The consumed mode replaces the launch flag | A launch line with both `--plan` and `--build` would leave the outcome to the extension's flag order. |
| Decline the descendant walk | The worker it targets is out of the runtime's process tree before `prepare` runs. ADR-002 holds the cases a walk would still catch. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Pi adapter suite | `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts`: 62 of 62, exit 0. Baseline 59 |
| Relaunch and OpenCode plugin suites | `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs`: 1524 of 1524, `fail 0`, exit 0. Baseline 1521 |
| Four must-fail tests | Each exit 1 before its source edit (`scratch/red.txt`) and exit 0 after (`scratch/green.txt`) |
| Guard tests by title | Vitest `agent_settled`: 13 passed. Node: 28 of 28, `fail 0` |
| Running work check | The only hunk in `bin/session-relaunch.cjs` is `@@ -821,3 +821,3 @@ function consume(args)` |
| Syntax and types | `node --check` on both `.cjs` files and `bash -n .skilled/bin/skilled-loop` exit 0. `./.pi/npm/node_modules/.bin/tsc -p tsconfig.pi.json --noEmit` exit 0 |
| Scope | `git diff --name-only -- .skilled` lists the nine named files |
| Strict validation | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live Pi hop was run with the mode carried.** The tests cover each layer and one live launch confirmed that Pi accepts `--plan`. A full Pi hop from a Plan session to a Plan receiver was not observed.
2. **A mode flag used as another option's value is dropped.** The wrapper filters every replayed `--plan` and `--build` element on a Pi hop that carries a mode. No Pi option takes such a value today.
3. **A shell below a non-shell child of the runtime does not stop a hop.** That is the one case the declined walk would have added. The note's `Running workers:` line covers work the session started itself.
4. **A hop that records no mode falls back to the launch flag.** Unlike the model, a mode used on one hop is not kept for later hops that record none. Each Pi arm reads the branch again, so this matters only when the branch becomes unreadable.
<!-- /ANCHOR:limitations -->

---
