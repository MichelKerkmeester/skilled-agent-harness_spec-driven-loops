---
title: "Implementation Summary"
description: "The thin relaunch evidence is captured, the Claude nudge retry is measured and explained, and the playbook lines that disagreed with a run now state what the run printed."
trigger_phrases:
  - "relaunch evidence gaps implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/029-relaunch-evidence-gaps-and-playbook-drift"
    last_updated_at: "2026-10-24T23:10:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Ran the live evidence, corrected the playbook lines and closed every acceptance row"
    next_safe_action: "Hand the nudge-floor follow-up to the owner of the relaunch hook code"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-29-relaunch-evidence-gaps-and-playbook-drift"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 029-relaunch-evidence-gaps-and-playbook-drift |
| **Completed** | 2026-10-24 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The live runs and the re-measurements that the earlier certification left thin are now on record, and three playbooks say what a run prints. No code changed.

### Phase 29: relaunch-evidence-gaps-and-playbook-drift

**Codex withdraw reply.** Two live runs through `skilled-loop codex -m gpt-6-luna --sandbox danger-full-access` (Codex 0.164.0) polled the pane for the reply instead of waiting a fixed 30 seconds. The replies came 64 s and 31 s after the prompt, so the old wait missed the second by one second and the first by half a minute. Both quoted the withdraw notice and the extra nudge word for word and ended with `STAYING`, the record read `disarmed` with `user-message`, and the wrapper printed its one withdrawn warning with no claim command. In the 64 s run Codex also obeyed the nudge, rewrote the note, ran `prepare` and then `cancel`, so the record ended `cancelled`. Evidence: `scratch/codex-cx2/run-1/` and `run-2/`.

**Claude nudge retry.** The extra nudge after a withdraw did not arrive on the first tool call in any of seven runs with `echo staying` (0 of 7). It arrived about 85 s later, on the prompt that Claude delivered when the background task finished. With `sleep 3; echo staying` it arrived on the first tool call in 3 of 3 runs, 5 to 6 s after the notice. A probe hook registered through a `--settings` overlay, beside the repository hooks and changing none of them, showed why. The nudge reads the context fill from the transcript, and the transcript file trails each entry's own timestamp by about 0.2 s. Of 57 `PostToolUse` hooks across the ten runs, 38 read a transcript that lacked a newer entry, and every one of those entries was younger than 0.18 s (stale reads up to 181 ms, fresh reads from 173 ms, `scratch/claude-cl3/staleness-report.txt` and `scratch/claude-cl3-slow/staleness-report.txt`). A hook for an instant tool runs about 0.1 s after the assistant entry, so it sees the fill from before the prompt, which is the floor the withdraw just set, and stays quiet. The nudge then waits for the next hook that reads a grown fill.

**Pi baseline.** `.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` ran 52 of 52 on 2026-10-24, exit 0, before and after, the same total as the earlier certification. The Pi extension load smoke could not run: the provider answered `402 ... daily pacing allowance on the pro plan ... billing_error`, so it is SKIP (`scratch/pi/extension-smoke.txt`).

**Playbook lines.** The OpenCode import smoke printed `object`, exit 0, on two runs (Node v26.8.2). The default export has been the dual-plugin object (`id`, `server`, `setup`) since the 2026-10-19 merge `fe1f8a9a53`, and the playbook line dates from 2026-10-18, when it was the bare function. The shim suite reports 18 tests on three runs, one with the loop variables unset: nine cases, each under bash and zsh, and the count rose from 16 when `79e9a72882` added the snapshot case on 2026-10-22. The earlier run was right and the playbook was stale.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md` | Modified | Import smoke says `object` in three places, shim suite says 18, version 1.0.11.0 |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md` | Modified | Shim count 18, CX-2 polls for the reply and records the observed reply times and the nudge-obeying run, version 1.0.10.0 |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` | Modified | Shim count 18, CL-3 uses a tool call of about 3 s and records the transcript lag and the 0 of 7 and 3 of 3 rates, version 1.0.11.0 |
| `scratch/` in this folder | Created | Runs, rate tables, staleness reports, suite baselines and the harness that produced them |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The runs went through private state: every live session used its own tmux socket and its own `XDG_RUNTIME_DIR`, so no record, nudge file or log of another session was read, and the shared relaunch state was never armed. Claude ran as `skilled-loop claude --model claude-sonnet-5-5 --settings <overlay>` in a detached tmux pane (the repository setting already runs it in bypass mode, so no extra permission flag was passed). Codex ran with `--sandbox danger-full-access`, the one flag the operator approved for it, and asked for no approval. The Claude self-invocation guard was overridden as the operator approved: the harness drops `CLAUDECODE` and the other session variables from the launch.

The first Claude trial was read in full before the other six ran, which showed that the first `PostToolUse` after the withdraw saw the same fill as the withdraw prompt. The slow-tool control then tested the explanation: it could have failed, and it did not. The analysis scripts judge each trial from the probe log and the transcript, not from the harness's own `delivered_by_state_file` line, which polls loosely and says `no` even on the delivered runs, so ignore that line in the `summary.txt` files.

Cleanup: each tmux server was killed and its socket removed, and no tmux server, `ev029` socket or runtime process of this phase remains. Three Claude runs had left a record armed (two) or pending (one) after the model followed the late nudge, so each was cancelled with `cancel --loop-id` and read `disarmed`; the Codex records were consumed by the wrapper at exit. The private runtime directories were then removed. The hand-over notes and hop-history lines these sessions wrote live in the gitignored `.skilled/skills/.state/session-relaunch/` of this worktree and were left, as the playbooks say every live check does.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Count first attempts instead of retrying until a pass | A retry hides the behavior the gap is about |
| Add a slow-tool control to the Claude runs | The explanation (a lagging transcript) predicted that a longer tool call would succeed, so the control could have contradicted it |
| Record the Claude retry as a follow-up and change no code | The build brief bars edits to the relaunch hook code and a capture that finds a defect records it with evidence |
| Make CL-3 use `sleep 3; echo staying` | An instant tool cannot deliver the nudge on the first call, so the old step failed 7 of 7 times by design |
| Poll the Codex pane for the reply instead of sleeping | The reply took 31 s and 64 s, and a poll needs no guess |
| Correct the shim count in two sibling playbooks too | The same stale 16 sat in `session-relaunch-command-runtimes.md` and `session-relaunch-claude.md`, and the build re-measured it once for all three |
| Correct the playbook to the observed output | A doc that disagrees with a run misleads the next reader |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Relaunch gate, `node --test --test-reporter=tap .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs` | Baseline 806 of 806, exit 0. Final 806 of 806, exit 0. Delta 0 (`scratch/baseline-relaunch-gate.tap`, `scratch/final-relaunch-gate.tap`) |
| Pi vitest suite | 52 of 52 before and after, exit 0 (`scratch/pi/`) |
| Pi extension load smoke | SKIP: provider 402 billing error, exit 1 |
| Codex CX-2 live | Two runs, replies at 64 s and 31 s, both with the notice and the extra nudge |
| Claude CL-3 live | 0 of 7 first-attempt deliveries with `echo staying`, 3 of 3 with `sleep 3; echo staying` |
| OpenCode import smoke | `object`, exit 0, twice |
| Shim suite | 18 of 18, three runs, one with the loop variables unset |
| `validate_document.py --type reference` on the three playbooks | `VALID`, 0 issues each |
| `validate-playbook-package.cjs --package system-spec-kit` | `PASS`, 0 violations, 1 warning in a file this phase did not touch |
| `git diff -- .skilled/hooks/session-relaunch .skilled/bin` | Empty: no code changed |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` | `Errors: 0  Warnings: 0` and `RESULT: PASSED` (`scratch/validate-strict.txt`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The Claude retry is explained and measured but not fixed.** Follow-up for the owner of `.skilled/hooks/session-relaunch/lib/nudge.cjs` and `claude/context-nudge.mjs`: the withdraw grant waits for the fill to grow a step past a floor, and the fill comes from a transcript that trails the hook by about 0.2 s, so the first hook after a withdraw on a short tool call cannot clear the floor. The same lag can delay any threshold nudge on a short tool call. Options: key the floor on the identity of the newest assistant entry instead of a ratio, or skip only the prompt that withdrew and nudge on the next hook. The change needs a failing-first test and the whole gate, and is outside this phase.
2. **The Claude evidence is one model and one version.** Claude Code 2.1.310 with `claude-sonnet-5-5`. The 0.2 s flush delay is Claude's, so another version can move the 0.18 s boundary.
3. **The Codex evidence is two runs.** Both replies carried the two sentences, and one run showed the model obeying the nudge, so a third behavior is possible.
4. **The Pi extension load smoke has no result.** It needs a provider with quota, and the Pi suite baseline stands without it.
5. **A closed record still says `function`.** `specs/hooks/023-session-relaunch-loop/002-pi-opencode-adapters/implementation-summary.md` records the 2026-10-19 smoke as `function`, which was true when it ran, and is left as history.
6. **No benchmark report folder was written for these runs.** The playbook results contract places run records under `benchmark/reports/`, which was outside this phase's file list, so the evidence stays in `scratch/`.
<!-- /ANCHOR:limitations -->

---
