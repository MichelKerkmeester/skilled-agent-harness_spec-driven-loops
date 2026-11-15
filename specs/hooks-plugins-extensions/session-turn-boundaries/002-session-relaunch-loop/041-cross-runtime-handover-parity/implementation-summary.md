---
title: "Implementation Summary: Cross-runtime session handover parity for Pi, OpenCode and Codex"
description: "Pi and OpenCode did not hop at all in a live test that Claude Code and Codex passed. Three fixes at the producer and one change to the claim output bring all four runtimes to a completed hop with no operator input, measured by one harness before and after."
trigger_phrases:
  - "cross runtime handover parity implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/041-cross-runtime-handover-parity"
    last_updated_at: "2026-11-14T22:26:03Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed four handover gaps and measured four runtimes live, all hop now"
    next_safe_action: "Commit worktree 392 and ask the operator before merge and push"
    packet_purpose: "Purpose: Pi and OpenCode complete the same scripted hop as Claude Code with no operator input, and one harness measures all four runtimes before and after the fix."
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs"
      - ".skilled/hooks/session-relaunch/pi/session-relaunch.ts"
      - ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs"
      - "specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/041-cross-runtime-handover-parity/scratch/harness/live-hop.sh"
      - "specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/041-cross-runtime-handover-parity/scratch/harness/score.cjs"
    session_dedup:
      fingerprint: "sha256:73efbe80fa0b147c5533a0c5b16ba37cfcf9b930ec82cc2598611c55abbf9a42"
      session_id: "scaffold-041-cross-runtime-handover-parity"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "b726ec67-1d85-4833-b219-c038e184d696"
      workspace: "/Users/michelkerkmeester/worktrees/public/392-cross-runtime-handover-parity"
      savedAt: "2026-11-14T22:26:03Z"
      locatorKind: "transcript_path"
      version: 1
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
| **Spec Folder** | 041-cross-runtime-handover-parity |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Pi and OpenCode now complete the same live hop as Claude Code. Before this phase, neither hopped at all. Codex already hopped, and now it also closes the note it claimed.

### Cross-runtime session handover parity

The harness starts one runtime under `skilled-loop` in tmux with the same task, a code word, a 0.05 threshold and a hop cap of one. It answers only first-launch trust dialogs and records each runtime process the wrapper starts. The scorer reads the relaunch log, the note and the screen and scores five steps: note prepared, signalled, relaunched, note closed and receiver answered.

The baseline found three producers and the first repeat found a fourth:

- **OpenCode 2 read its own session as a nested run.** OpenCode 2.3 runs a tool shell under `opencode-pty`, which `opencode.exe serve` starts below the `opencode` launcher. `hostRuntimePid` stopped at the pty daemon, two processes below the runtime, so `dropNestedLoop` stripped the loop variables and `prepare` printed a claim command instead of arming. The walk now also skips an OpenCode process whose parent is an OpenCode process.
- **Pi held its nudge until the whole run ended.** A run that kept calling tools never saw it. In the baseline the model wrote its own note under a made-up session id that nothing could arm. The held nudge now goes out at the next `turn_end` whose tool calls ran, as a `steer`, so the model reads it before its next call. A turn with no tool calls still hands it to `agent_end`.
- **Pi's receiver lost its claim instructions.** The advisor, goal and spec-gate extensions append their blocks to the prompt after a blank line, and the seed parser rejects a prompt with a newline. The receiver then asked Gate 3 again. The Pi extension now reads the seed from the prompt's first block.
- **Codex claimed its note and never closed it.** Codex shows the claim instructions once, with the seed, and Luna at low effort answered straight from the note body. `claim` now prints the `complete` command after the note body, on every runtime.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | `isOpenCodeHelper` and its use in `hostRuntimePid` |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` | Modified | `turn_end` steer through a shared `deliverHeldNudge`, first-block seed read |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modified | `claim` prints the `complete` command |
| `relaunch-core.test.cjs`, `session-relaunch-cli.test.cjs`, `pi/session-relaunch.test.ts` | Modified | Three OpenCode host-walk tests, one claim-output test, three Pi tests |
| `session-relaunch/README.md`, `pi/README.md`, `injection-contract.md`, `speckit/handoff.md`, the Pi and OpenCode playbook, the relaunch feature catalog entry | Modified | Pi delivery, the host walk and the claim output |
| `scratch/harness/live-hop.sh`, `scratch/harness/score.cjs` | Created | The live-hop harness and scorer, with every run under `scratch/runs/` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The harness ran first on all four runtimes, which gave the baseline. Each fix started from a test that failed on the old code: 2 of 3 OpenCode host-walk tests, both Pi `turn_end` tests, the Pi appended-block test and the claim-output test. After each fix that runtime ran live again. The full gate ran from the final tree, then four rounds ran on all four runtimes. Rounds 1 and 2 ran before the `claim` change and rounds 3 and 4 after it.

Live results, steps scored out of five, seconds from start to the closed note:

```text
baseline   claude 5/5 49 s   codex 5/5 51 s   pi 2/5 no hop   opencode 1/5 no hop
round 1    claude 5/5 35 s   codex 4/5 open   pi 5/5 39 s     opencode 5/5 95 s
round 2    claude 5/5 32 s   codex 3/5 open   pi no hop, finished in place   opencode 5/5 56 s
round 3    claude 5/5 37 s   codex 5/5 51 s   pi 4/5 36 s     opencode 5/5 51 s
round 4    claude 5/5 35 s   codex 5/5 62 s   pi 5/5 41 s     opencode 5/5 106 s
```
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Skip only an OpenCode process whose parent is an OpenCode process | An OpenCode started straight from a shell stays the host, so an OpenCode run nested in another OpenCode session is still read as nested |
| Fix the Pi seed in the Pi adapter, not the shared parser | Claude Code, Codex and OpenCode read an untouched seed, and the parser's test pins the single-line form |
| Steer only when the turn's tool calls ran | The tools have finished, so a prepare call they made already left its record and the re-check is accurate, and a turn with no tools ends the loop |
| Repeat the closing step in the `claim` output, not in a Codex hook | A hook reminder on every tool call would pile up in the transcript, and a Stop block would add a turn to every reply |
| Keep the `Goal packet:` line last | An existing test pins it there, so the new line goes between the body and the goal line |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test` relaunch and plugin suites | 1,560 passed, 0 failed, twice (baseline 1,556) |
| `node --test .skilled/hooks/shared/hook-flags.test.cjs` | 29 passed, 0 failed |
| Pi vitest suite | 65 passed (baseline 62) |
| `tsc -p tsconfig.pi.json` | exit 0 |
| Goal hook suites under `.skilled/hooks/goal` | 133 passed, 0 failed |
| `sync-hook-registrations.cjs --check`, `sync-runtime-mirrors.cjs --check` | PASS, PASS |
| Live rounds 3 and 4 on the final code | 8 of 8 runs hopped, 7 scored 5/5 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A small task can finish without a hop.** The nudge lets a session finish when the rest fits in a few steps. Pi did that in round 2, so the harness's task is too short to force a hop every time.
2. **One suite run failed one unrelated test once.** "stop-arm stamps the payload permission mode on the armed record" failed in one full run, then passed in three runs alone and in two full runs. It did not reproduce, and no code it covers changed.
3. **Gaps a code read found that no live run exercised stay open.** OpenCode 2 cannot carry a mid-session model change, because its root command has no model flag. `OPENCODE_CONFIG_CONTENT` is a likely route. Codex has no compaction pointer and carries no goal. Pi and OpenCode do not tell the model when a hand-over is withdrawn. Only Claude Code refuses a question dialog after `prepare`.
4. **Pi's flags are not visible to the harness.** Pi renames its process to `pi`, so the scorer reports its carry as unobservable. The wrapper suite covers Pi's relaunch arguments.
<!-- /ANCHOR:limitations -->

---
