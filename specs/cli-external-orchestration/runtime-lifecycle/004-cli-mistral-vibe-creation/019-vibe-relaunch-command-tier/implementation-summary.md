---
title: "Implementation Summary"
description: "Vibe joins the session-relaunch loop on the command-only tier: the runtime list, the wrapper launch case and option tables, the prepare message, the README row and their tests."
trigger_phrases:
  - "vibe relaunch command tier implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/019-vibe-relaunch-command-tier"
    last_updated_at: "2026-11-15T17:26:17Z"
    last_updated_by: "generate-context"
    recent_action: "Closed T015 with a live bound-packet hop"
    next_safe_action: "Await the operator's go-ahead to push the fix to origin/main"
    packet_purpose: "Purpose: A Vibe session started through `skilled-loop vibe` hands off to a fresh Vibe session that claims the note, on the same command-only tier Cursor and Devin use."
    blockers: []
    key_files:
      - "tasks.md"
      - "scratch/manual-hop.md"
      - "scratch/bound-packet-hop/handoff-note.md"
    session_dedup:
      fingerprint: "sha256:f5203bd176184c11b246402841bf27bb7410f101873d4d7750986d16b0d0ec58"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "425e79e1-c5de-4edb-b8bb-77ee620d2538"
      workspace: "/Users/michelkerkmeester/worktrees/public/383-mistral-vibe-runtime"
      savedAt: "2026-11-15T17:26:17Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-vibe-relaunch-command-tier |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Vibe is now a runtime the relaunch loop can launch. `relaunch-core.cjs` accepts `vibe`, so
`prepare`, `keep`, `hand-over` and the wrapper's runtime check no longer refuse it.
`skilled-loop vibe` starts `vibe "<seed>"` from the recorded cwd, replays the value-taking
options the Vibe help documents, and never replays the headless-only model flag or a session
selector. A prepared Vibe hand-over prints the command-only prepare line, and the relaunch
README carries a Vibe row marked COMMAND-ONLY.

### Phase 19: vibe-relaunch-command-tier

A Vibe session started through `skilled-loop vibe` hands off to a fresh Vibe session that
claims the note, on the same command-only tier Cursor and Devin use.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | `vibe` added to the frozen `RUNTIMES` list |
| `.skilled/bin/skilled-loop` | Modified | `vibe` runtime dispatch, a seed-only launch case, and Vibe's value, no-value and denied option tables |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modified | Vibe joins the command-only prepare message |
| `.skilled/hooks/session-relaunch/README.md` | Modified | Vibe matrix row, COMMAND-ONLY, and the runtime list and launch example |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modified | Frozen-list assertion includes `vibe` |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` | Modified | Vibe launch, no-model replay and child-skip cases, plus a Vibe stub for the runtime-identity loop |
| `scratch/baseline.txt` | Created | Pre-change suite baseline: 957 pass, fail 0 |
| `scratch/vibe-options.md` | Created | Vibe's value-taking and no-value options from `vibe -h` |
| `scratch/final-suite.txt` | Created | Post-change suite run: 960 pass, fail 0 |
| `scratch/manual-hop/procedure.md` | Created | Numbered operator steps for the manual hop |
| `scratch/manual-hop.md` | Created | Offline prepare evidence, blocked interactive half and both decisions |
| `scratch/resume-probe.md` | Created | Keyed headless run, resume attempts, exit codes and verdict |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The runtime list came first, because every CLI command checks it. The wrapper then gained the
`vibe` dispatch and a launch case that passes only the seed, with the option tables recording
which Vibe flags consume the following word. The prepare message and the README row followed,
and the tests were extended before the full suite ran.

The command-only flow was exercised up to the prepare line against a temporary note and state
directory. The interactive half needs a terminal: `scratch/manual-hop/procedure.md` holds the
steps. One live manual hop ran on 2026-11-15 and confirmed decision 1; decision 2 was then settled in the Vibe goal adapter. `scratch/manual-hop.md` records both.

The resume probe ran a keyed headless Vibe session to a `--max-turns 1` stop and then tried
the resume forms. Vibe 3.1.2 rejects `--model` on a resume, while the repository's
`vibe-closed-roster` hard rule refuses a resume dispatch without it, so the resume path is
recorded as UNVERIFIED rather than guessed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Command-only tier | Vibe has no idle or compaction event a hook can arm on, and it runs here mostly as a headless child the loop skips |
| No `--model` on the interactive launch | `vibe --help` documents `--model` as headless-only, so the interactive relaunch keeps the config's `active_model` |
| No turn-start claim part | The seed carries the claim, as it does for Cursor and Devin; the live manual hop claimed from the seed alone |
| No `VIBE_SPEC_FOLDER` export | The Vibe goal adapter falls back to `SESSION_HANDOVER_GOAL_PACKET`, which the wrapper exports from the claimed note's `goal_packet`; an operator-named `VIBE_SPEC_FOLDER` still wins |
| A Vibe sender's `prepare` records its packet | Without it the note carried no `goal_packet` and the fallback had nothing to read; the core resolves the packet in the hook's order, `VIBE_SPEC_FOLDER` and then `SESSION_HANDOVER_GOAL_PACKET` |
| Vibe `--model` is denied on a hop | Replaying a headless-only flag into an interactive launch would end the relaunch at a usage error |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node -e 'console.log(require("./.skilled/hooks/session-relaunch/lib/relaunch-core.cjs").RUNTIMES.join(" "))'` | `claude pi opencode codex cursor devin vibe` |
| `bash -n .skilled/bin/skilled-loop` | exit 0 |
| `rg -c '\bvibe\b' .skilled/bin/skilled-loop` | 25 |
| `rg -c 'vibe:--' .skilled/bin/skilled-loop` | 22 |
| `rg -n "runtime === 'vibe'" .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | one line: `611:  const prepared = runtime === 'cursor' \|\| runtime === 'devin' \|\| runtime === 'vibe'` |
| `rg -n '^\| Vibe \|.*COMMAND-ONLY' .skilled/hooks/session-relaunch/README.md` | one line |
| `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` | `tests 960`, `pass 960`, `fail 0` |
| `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` | `tests 225`, `pass 225`, `fail 0` |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` | `RESULT: PASSED (errors=0 warnings=0)` |
| Manual hop (`scratch/manual-hop.md`) | Passed live on 2026-11-15: claimed and completed with runtime `vibe` |
| `node --test .skilled/hooks/goal/vibe/goal-vibe.test.mjs` | `pass 5`, `fail 0`; the claimed-packet case fails without the fallback |
| `node --test .skilled/hooks/session-handover/tests/*.test.cjs` after the `prepare` change | `pass 1002`, `fail 0`; the new Vibe packet test fails without the change |
| Live bound-packet hop (`scratch/bound-packet-hop/`) | Passed on 2026-11-15: the note carried `goal_packet`, and the receiver opened with the packet's goal slice while `VIBE_SPEC_FOLDER` was unset |
| Resume probe (`scratch/resume-probe.md`) | Recorded: first run exit 0; resume attempts exit 1; verdict UNVERIFIED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No automatic hop.** The operator decides when to hand off and exits Vibe by hand.
2. **The headless resume path is UNVERIFIED.** Vibe rejects `--model` on a resume and the
   repository's roster rule refuses a resume without it.
3. **The fallback covers a claimed session only.** A Vibe session started any other way still
   needs `VIBE_SPEC_FOLDER` to get a goal slice at start.
<!-- /ANCHOR:limitations -->

---
