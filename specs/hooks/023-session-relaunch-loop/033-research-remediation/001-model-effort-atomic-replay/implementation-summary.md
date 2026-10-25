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
    last_updated_at: "2026-10-25T18:05:00Z"
    last_updated_by: "builder-001"
    recent_action: "Live Sonnet low to Opus medium hop relaunched with --effort medium"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files:
      - ".skilled/bin/skilled-loop"
      - ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs"
      - ".skilled/hooks/session-relaunch/lib/context-usage.cjs"
      - ".skilled/hooks/session-relaunch/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "builder-001-model-effort-atomic-replay"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Claude Code writes a /model or /effort switch to the session log before the next assistant turn, as a local command entry and its stdout, and readClaudeSettings now reads it"
      - "A Pi launch provider/model and a recorded provider plus bare model could wrongly drop the launch thinking level; the wrapper now treats them as one model"
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
| **Completed** | 2026-10-25 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A relaunch onto a new model no longer carries the effort you picked for the old one. When the record names a different model and brings no usable effort, the receiver starts on the runtime's default effort instead of a level the new model may reject.

### Phase 1: model-effort-atomic-replay

The wrapper keeps the launch model in a local before the live override and asks one function, `live_model_voids_launch_effort`, whether the launch effort still applies. It drops the effort only when the runtime is not Hermes, the launch model was non-empty, the accepted live model differs from it and no valid live effort came with it. The function takes its four inputs as arguments and reads no globals, so the manual command template can reuse it. When it fires on an invalid live effort, the warning now says the hop relaunches on the runtime default rather than on the launch effort.

`armLocked` applies the same rule at arm time: an arm that brings a new model and no effort writes the record without its old `effort` field. An arm with the same model keeps the recorded effort.

`readClaudeSettings` now sees a `/model` or `/effort` switch made after the last assistant turn. Claude writes each confirmed switch as a command entry followed by its stdout, so the reader walks the entries after the last main-chain assistant entry and applies each confirmed one. `/effort` takes the level from `Set effort level to <level>`. `/model` takes the typed id, or the confirmed name when the picker shows an id; a picker display name such as `Opus 5.5` proves a switch but no id, so the model reads as unproven. A new model clears the old turn's effort unless an `/effort` switch set one, and a `Cancelled` stdout changes nothing.

The predicate also takes the live provider as an optional fifth argument. For Pi, a launch model equal to `<live provider>/<live model>` is the same model, so the launch thinking level stands.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/skilled-loop` | Modified | New `live_model_voids_launch_effort` function; the live settings block saves the launch model and calls it with the live provider, so a Pi `provider/model` launch is no switch |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | `armLocked` drops the recorded effort on a model change with no effort |
| `.skilled/hooks/session-relaunch/lib/context-usage.cjs` | Modified | `readClaudeSettings` applies a `/model` or `/effort` switch logged after the last assistant entry |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Modified | AC-001 table (three rows), AC-002 table (three rows), AC-003, AC-007 and AC-008 guards, and the Pi provider-prefix test |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modified | AC-004 arm test, which also checks that a same-model arm keeps its effort |
| `.skilled/hooks/session-relaunch/tests/context-usage.test.cjs` | Modified | Four `readClaudeSettings` tests over the logged switch shapes |
| `.skilled/hooks/session-relaunch/README.md` | Modified | Replay rule paragraph, the Claude switch reader and the Pi spelling rule |
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
| Claude medium hop | `--model claude-sonnet-5-5 --effort low`, then `/model claude-opus-5-5` (dialog confirmed), `/effort medium` and a turn | model `claude-opus-5-5`, effort `medium` | `claude --model claude-opus-5-5 --effort medium` |
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
| The medium hop ran under the operator's real config, with a restore | `/model` and `/effort` save themselves as the default in `~/.claude/settings.json`, and a throwaway `CLAUDE_CONFIG_DIR` cannot sign in. On the operator's approval the file was backed up, and the lines the switches rewrote were put back afterwards, line by line, so other sessions' writes during the run survive |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| New tests before the change | 10 run, 6 pass, 4 fail (the AC-001 rows and AC-004), `scratch/test/red-before.txt` |
| New tests after the change | 10 pass, 0 fail, `scratch/test/green-after.txt` |
| Full relaunch suite | Baseline 868 pass, 0 fail. After the effort rule: 892 pass. After the reader and Pi changes: 907 pass, 0 fail against a stated baseline of 896; 5 of the 11 new tests are this phase's, the rest belong to the builder working beside it (`scratch/test/full-node-after-t008.txt`) |
| Pi extension vitest | 59 pass (`scratch/test/vitest-after-t008.txt`) |
| Reader tests | 4 new: 3 fail and 1 pass before the change (`scratch/test/reader-red-before.txt`), 25 of 25 in the file pass after (`scratch/test/reader-green-after.txt`) |
| Pi provider-prefix test | Fails before with the launch `--thinking low` dropped (`scratch/test/pi-prefix-red-before.txt`), passes after with the 19 other effort-rule tests (`scratch/test/pi-prefix-green-after.txt`) |
| `bash -n` and `shellcheck -S warning` on `skilled-loop` | Both exit 0, no findings |
| Operator `~/.claude/settings.json` | shasum `9ffe4047f7516b5691164fd39a54e8e1688b129a` before the medium hop, and identical to that backup after the restore (`scratch/claude-hop-medium/global-settings-before.txt`, `global-settings-after.txt`) |
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

The old `readClaudeSettings` read only main-chain assistant entries, so a switch with no later turn was invisible to it even though the entry existed. The entry carries the argument as typed and a display name, not a model id.

`/effort` writes the same pair. The live run could not show it, so the shape comes from the operator's own transcripts (`scratch/claude-hop/effort-entries.txt`, Claude Code 2.1.284):

```
{"type":"user","content":"<command-name>/effort</command-name> <command-message>effort</command-message> <command-args></command-args>"}
{"type":"user","content":"<local-command-stdout>Set effort level to medium (saved as your default for new sessions): Balanced approach ..."}
{"type":"user","content":"<local-command-stdout>Cancelled</local-command-stdout>"}
```

A survey of all 44 transcripts holding either command found the forms the reader handles. Every `/effort` had empty arguments, from the picker, with `Set effort level to <level>` in either the "saved as your default" or the "this session only" form, or `Cancelled`. `/model` had empty arguments with a display name (`Opus 5.5`, `Sonnet 5.5 (default)`) or once an id (`claude-sonnet-5-5`), or typed arguments `claude-opus-5-5`. `readClaudeSettings` now applies these. Run on the real transcript cut at line 53, right after the `/model` confirmation, it returns `claude-opus-5-5` with no effort, where the old reader returned `claude-sonnet-5-5` and `low` (`scratch/test/reader-real-transcript.txt`).

### Pi provider spelling

The difference could wrongly drop the effort, so it is fixed at the source. The wrapper takes the launch model as written (`.skilled/bin/skilled-loop:565` sets `SKILLED_LOOP_MODEL` from `pi:--model`, so `openai/gpt-6-luna` stays whole) and saves it before the live override (`:859`). The Pi extension records `ctx.model.id` and `ctx.model.provider` apart (`.skilled/hooks/session-relaunch/pi/session-relaunch.ts:422-424`), so the record says `gpt-6-luna` beside `openai`. Pi does not record an effort on every arm: its one arm call (`session-relaunch.ts:456-461`) adds `effort` only when the host has `getThinkingLevel` and the call does not throw (`:425-431`), a path the extension tests cover (`session-relaunch.test.ts:447`). On that arm the old predicate saw `openai/gpt-6-luna` and `gpt-6-luna` as different models and dropped the launch `--thinking low`, which the new test reproduced red. The predicate now takes the live provider (`skilled-loop:226-233`, call at `:889`) and treats `<provider>/<model>` as the same model for Pi. A prefix naming another provider, `azure/gpt-6-luna`, still counts as a switch, and the same test checks that. `armLocked` is not affected, because it compares two models recorded by Pi in the same spelling.

### Claude medium-effort hop

The hop ran under the operator's real config. Before it, `~/.claude/settings.json` was copied aside and its shasum recorded. The sender launched as `--model claude-sonnet-5-5 --effort low`, typed `/model claude-opus-5-5`, answered the "Switch model?" confirm dialog, typed `/effort medium` and took one turn. The record at relaunch held model `claude-opus-5-5` and effort `medium`, and the receiver came up as `claude --model claude-opus-5-5 --effort medium`, a child of wrapper pid 58459 (`scratch/claude-hop-medium/processes-receiver.txt:1`). `relaunch.log` holds `relaunch loopId=58459 reason=ready`, and the note ended `status: done`.

`/effort medium` saved itself as the per-model default under `modelSettings`, while `/model` saved the top-level `model` key, which already held `claude-opus-5-5`. Afterwards the file differed from the backup on that one per-model line only. Putting it back made the file identical to the backup, shasum `9ffe4047f7516b5691164fd39a54e8e1688b129a`.

Two earlier attempts did not prove the criterion and are kept. In the first, the confirm dialog swallowed `/effort medium`, and the sandbox goal kept the session from going idle until the watcher timed out (`scratch/claude-hop-medium-attempt1-*/`). The harness now answers the dialog, and the medium run starts with no goal, which this criterion does not need.

The first rerun pointed `CLAUDE_CONFIG_DIR` at a throwaway directory in this session's temporary scratchpad, outside the repository, so `/model` and `/effort` could not write `~/.claude/settings.json`. It held copies of `settings.json`, `.claude.json` and `.credentials.json`. Claude stopped at authentication: `claude -p` exited 1 with "Failed to authenticate: OAuth session expired and could not be refreshed" (`scratch/claude-hop-medium/blocked-auth.txt`). The copied credentials file dates from 14 October, and under a custom config dir Claude uses a keychain item of its own, `Claude Code-credentials-636b909c`, created by this attempt at 17:53:37Z, instead of the operator's `Claude Code-credentials`. Copying the live keychain secret was not tried, because a token refresh in the sandbox could rotate the refresh token the operator's own login uses. The live part stopped there, as the brief required. The throwaway directory was removed.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A live Claude switch writes the operator's defaults.** `/model` and `/effort` save themselves to `~/.claude/settings.json`, and an isolated `CLAUDE_CONFIG_DIR` cannot sign in with the operator's keychain login, so a live switch test needs a backup and restore of that file.
2. **A picker `/model` names no id.** A switch made in the `/model` picker confirms a display name, so the reader proves the switch but not the new model, and the hop relaunches on the launch model and effort.
3. **A Pi launch `--provider` is not compared.** A launch `--provider openai --model gpt-6-luna` and a record of provider `azure` with model `gpt-6-luna` compare as the same model, so a recorded hop with no effort keeps the launch thinking level. Only the `provider/model` spelling is handled here.
4. **A keychain item is left behind.** The sandbox attempt created `Claude Code-credentials-636b909c` in the login keychain, holding the expired copied credentials. Removing it: `security delete-generic-password -s "Claude Code-credentials-636b909c"`.
<!-- /ANCHOR:limitations -->

---
