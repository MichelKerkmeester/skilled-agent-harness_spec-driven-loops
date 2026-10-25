---
title: "Implementation Summary"
description: "A relaunch onto a new model no longer replays the effort chosen for the old one: the wrapper and armLocked now move model and effort as one set, with Hermes exempt."
trigger_phrases:
  - "model effort atomic replay implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/033-research-remediation/001-model-effort-atomic-replay"
    last_updated_at: "2026-10-25T16:05:00Z"
    last_updated_by: "builder-001"
    recent_action: "Built the effort rule, ran the tests red then green, ran six live hops"
    next_safe_action: "Operator decides the Claude medium-effort live hop and the readClaudeSettings change"
    blockers:
      - "AC-005 needs a live Claude /effort medium switch, which persists to the operator's global settings"
    key_files:
      - ".skilled/bin/skilled-loop"
      - ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs"
      - ".skilled/hooks/session-relaunch/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "builder-001-model-effort-atomic-replay"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Should readClaudeSettings read the /model local command entry? context-usage.cjs was outside this build's write scope"
    answered_questions:
      - "Claude Code writes a /model switch to the session log before the next assistant turn, as a local command entry"
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
| **Spec Folder** | 001-model-effort-atomic-replay |
| **Completed** | Not yet: AC-005 is open |
| **Level** | 2 |
| **Status** | In Progress |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A relaunch onto a new model no longer carries the effort you picked for the old one. When the record names a different model and brings no usable effort, the receiver starts on the runtime's default effort instead of a level the new model may reject.

### Phase 1: model-effort-atomic-replay

The wrapper keeps the launch model in a local before the live override and asks one function, `live_model_voids_launch_effort`, whether the launch effort still applies. It drops the effort only when the runtime is not Hermes, the launch model was non-empty, the accepted live model differs from it and no valid live effort came with it. The function takes its four inputs as arguments and reads no globals, so the manual command template can reuse it. When it fires on an invalid live effort, the warning now says the hop relaunches on the runtime default rather than on the launch effort.

`armLocked` applies the same rule at arm time: an arm that brings a new model and no effort writes the record without its old `effort` field. An arm with the same model keeps the recorded effort.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/skilled-loop` | Modified | New `live_model_voids_launch_effort` function; the live settings block saves the launch model and calls it |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | `armLocked` drops the recorded effort on a model change with no effort |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Modified | AC-001 table (three rows), AC-002 table (three rows), AC-003, AC-007 and AC-008 guards |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modified | AC-004 arm test, which also checks that a same-model arm keeps its effort |
| `.skilled/hooks/session-relaunch/README.md` | Modified | Replay rule paragraph and the Claude `/model` logging limit |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The tests came first. Ten new tests were run before any code change: the four failing-first rows failed on the old effort replaying, and the six guards passed (`scratch/test/red-before.txt`). After the change, all ten pass (`scratch/test/green-after.txt`), and the full suite went from 868 to 892 passing with 0 failing. The extra 14 beyond my 10 belong to the other builders working in this checkout.

Six live hops ran through the real wrapper, each with its own tmux socket and `XDG_RUNTIME_DIR` under its `scratch/` folder. Claude and Pi ran in throwaway sandboxes built by `scratch/harness/build-sandbox.sh` and removed afterwards. Codex ran in this checkout, because its project hooks are trusted by path here.

| Run | Sender | Record at relaunch | Receiver |
|-----|--------|--------------------|----------|
| Claude hop | `--model claude-sonnet-5-5 --effort low`, then `/model claude-opus-5-5` and a turn | model `claude-opus-5-5`, effort `low` | `claude --model claude-opus-5-5 --effort low` |
| Claude control | same | model `claude-opus-5-5`, effort removed | `claude --model claude-opus-5-5`, no `--effort` |
| Codex hop | `-m gpt-5.6-luna -c model_reasoning_effort="low"` | edited to model `gpt-6-luna`, effort `medium` | `codex --no-daemon -m gpt-6-luna -c model_reasoning_effort="medium"` |
| Codex control | same | edited to model `gpt-6-luna`, effort removed | `codex --no-daemon -m gpt-6-luna`, status bar `GPT-6-Luna max` (config default) |
| Pi hop | `--model openai/gpt-5.6-luna --thinking low`, then Ctrl+P and Shift+Tab | armed `openai` `gpt-6-luna`, effort `off` | session opened on `openai gpt-6-luna`, thinking `off` |
| Pi control | same | armed, then effort removed | session opened on `openai gpt-6-luna`, thinking `max` (model default) |

In every control the old code would have replayed the launch `low`. Each `relaunch.log` holds the `relaunch loopId=<id> reason=ready` hop line. Pi rewrites its process title to `pi`, so its receiver settings come from the receiver transcript (`transcript-settings.txt`), not from `ps`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One predicate function with four arguments | The manual command template needs the same rule, and arguments keep it free of wrapper globals |
| Compare against the launch model saved before the override | Line 793 overwrites `SKILLED_LOOP_MODEL` with the live model, so the comparison has to read it first |
| Codex switch made by editing the pending record | The Codex `/model` picker cannot be driven reliably from tmux. The receiver and the wrapper path are real; only the sender-side switch is simulated |
| No `/effort medium` in the Claude sender | `/model` printed "saved as your default for new sessions" and rewrote the operator's `~/.claude/settings.json`. `/effort` would likely do the same to the operator's `effortLevel` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| New tests before the change | 10 run, 6 pass, 4 fail (the AC-001 rows and AC-004), `scratch/test/red-before.txt` |
| New tests after the change | 10 pass, 0 fail, `scratch/test/green-after.txt` |
| Full relaunch suite | Baseline 868 pass, 0 fail. After: 892 pass, 0 fail |
| `bash -n` and `shellcheck -S warning` on `skilled-loop` | Both exit 0, no findings |
| Live hops | Six runs, table above, evidence under `scratch/{claude,codex,pi}-{hop,control}/` |

### Claude `/model` logging investigation

Claude Code writes a `/model` switch to the session log right away, before any assistant turn. The command opens a confirm dialog first, and nothing is written until it is confirmed: the transcript stayed at 49 lines after the command and grew to 53 on confirmation. The four new entries (`scratch/claude-hop/switch-entries.txt`, from `transcript-c9dc66b7-...jsonl` lines 50-53):

```
{"line":"file-history-snapshot"}
{"line":"user","isMeta":true,"content":"<local-command-caveat>The command below was run directly in Claude Code, not sent to you as a request, ..."}
{"line":"user","content":"<command-name>/model</command-name> <command-message>model</command-message> <command-args>claude-opus-5-5</command-args>"}
{"line":"user","content":"<local-command-stdout>Set model to `Opus 5.5` and saved as your default for new sessions</local-command-stdout>"}
```

The main-chain assistant entries around it:

```
line 39 requestedModel=claude-sonnet-5-5 effort=low
line 73 requestedModel=claude-opus-5-5 effort=low
line 86 requestedModel=claude-opus-5-5 effort=low
```

`readClaudeSettings` reads only main-chain assistant entries, so a switch with no later turn is invisible to it even though the entry exists. The entry carries the argument as typed (an alias such as `opus` would appear as typed) and a display name, not a model id. The README now documents this limit. Changing the reader is the conditional `context-usage.cjs` change, which was outside this build's write scope, so it was not made. A `/effort` entry was not observed, because the `/effort medium` keystrokes confirmed the `/model` dialog instead of running.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **AC-005 medium effort is not proven live.** The Claude sender switched model but kept effort `low`, so the hop shows `--effort low`, not `--effort medium`. A rerun needs a `/effort medium` in the sender, which may rewrite the operator's global `effortLevel`.
2. **A spelling difference counts as a switch.** Pi launched as `--model openai/gpt-6-luna` records the live model as `gpt-6-luna`, so the wrapper sees two different strings. Pi always records a thinking level and Claude always records an effort, so today this only matters for a record with no effort, where the runtime default applies.
3. **The Claude switch reader limit stays.** A `/model` with no later assistant turn does not reach the relaunch. `prepare` runs mid-turn, so in practice an assistant turn follows the switch.
<!-- /ANCHOR:limitations -->

---
