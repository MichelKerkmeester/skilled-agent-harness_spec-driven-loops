---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "relaunch model and effort implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/031-relaunch-model-and-effort"
    last_updated_at: "2026-10-25T10:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Added the Hermes and Cursor live carry, ran the Hermes live hop and closed the packet"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files:
      - ".skilled/bin/skilled-loop"
      - ".skilled/bin/skilled-loop-shell.sh"
      - ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs"
      - ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-031-relaunch-model-and-effort"
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
| **Spec Folder** | 031-relaunch-model-and-effort |
| **Completed** | 2026-10-25 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A relaunched session now starts on the model and effort the sending session was using, not on the runtime's defaults. Before this phase every receiver ran at default effort, and a model switched inside the session was lost at the hop.

### Phase 31: relaunch-model-and-effort

Two sources feed the next hop. The first is the launch line: the wrapper captures `--effort` on Claude, `-c model_reasoning_effort=` on Codex, `--thinking` on Pi and `--reasoning` on Hermes, and replays each one in that runtime's own syntax, next to the model it already carried. The second is the session itself. At `prepare` the CLI reads the Claude session log's last main-chain assistant entry, the Codex rollout's last turn context, or a Cursor model selection made during this hop. The Pi extension hands its current model, provider and thinking level to the record when it arms, and the Hermes plugin hands over the model and provider its last API request asked for. Those values win over the launch line for that hop and become the fallback for later hops.

Cursor keeps its selection in `~/.cursor/cli-config.json`, one file shared by every Cursor session. The wrapper now stamps each launch as `SKILLED_LOOP_LAUNCHED_AT`, and the CLI trusts the file only when it changed after that stamp, so a model another Cursor session picked does not leak into this hop.

Nothing the wrapper cannot check reaches a command line. A level outside the runtime's own list is dropped with a warning, a model that does not look like an id is ignored, and a Pi provider moves only together with a live model the wrapper accepted. The values live on the relaunch record, never in the note.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/skilled-loop` | Modified | Capture, check and replay the effort flag; apply the live model, provider and effort; stamp each launch |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | `resolveSessionSettings`, the Codex rollout lookup, the Cursor config reader, live fields on `preparePending` and `arm` |
| `.hermes/plugins/repo-guards/__init__.py` | Modified | Keep each request's model and provider and pass them to the arm at session end |
| `.skilled/hooks/session-relaunch/hermes/session-end-arm.mjs` | Modified | Hand the model and provider to `arm` |
| `.skilled/hooks/session-relaunch/tests/hermes-adapters.test.cjs` | Modified | Session end puts the model and provider on the record |
| `.hermes/plugins/repo-guards/tests/test_session_relaunch.py` | Modified | The plugin keeps the requested model and provider, or nothing |
| `.skilled/hooks/session-relaunch/lib/context-usage.cjs` | Modified | Readers for the Claude and Codex settings |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modified | `prepare` records the live values, `consume` reports them |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` | Modified | Hand the model, provider and thinking level to `arm` |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Modified | Effort and live-value cases per runtime |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modified | Record and consume cases |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` | Modified | Pi arm cases |
| `.skilled/hooks/session-relaunch/README.md` | Modified | Model And Effort Across A Hop |
| `.skilled/commands/speckit/handoff.md` | Modified | One line on what the relaunch carries |
| `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` | Modified | What the wrapper carries |
| `scratch/harness/run-*-effort.sh` | Created | Live hops on Claude, Codex, Pi and Hermes |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every behavior got a failing test first. Ten of the eleven wrapper cases failed on the old wrapper, and the no-effort-flag case is the control that passed before and after. Four of the six CLI cases failed, and the two that passed are the no-value controls. One of the two Pi cases failed, and the other is its control. Of the two provider cases added after the Pi change, one failed and one is the control. Each level list came from the runtime's own help. Codex's help lists none, so its list holds the five levels its rollouts record (`low` up to `max`) plus `none` and `minimal`, which were not observed.

Three live hops ran through the real wrapper in private tmux servers and runtime directories. Claude, launched with `--model claude-sonnet-5-5 --effort low`, recorded those values from its log, and the receiver started with the same flags and ran its turns at them. Codex, launched with `-c model_reasoning_effort="low"`, recorded `gpt-6-luna` and `low` from its rollout, and the receiver's own turn ran at them. Pi, launched with `--model openai/gpt-6-luna --thinking low`, armed with `openai`, `gpt-6-luna` and `low`, and the receiver ran on them. Pi's configured defaults are a different provider, model and level, so the hop could not have landed there by chance.

During the Claude hop a human message reached the test receiver through a remote-control bridge: "This handoff started as sonnet low but should have been opus higg". The receiver's turns before it ran at `claude-sonnet-5-5` and `low`, the carried values, and the two turns after it ran at `claude-opus-5-5` and `high`. The evidence keeps both, in `scratch/claude-effort-live/transcript-settings.txt`. The sandboxes were removed afterwards, no process from them is left, and the saved evidence holds no key or token.

The Hermes hop ran later, on the Copilot provider, because `llmgateway` reported its credit for `gpt-6-luna` exhausted and the `openai-codex` provider has no Hermes login. The sender launched on `gpt-4.1` at `--reasoning low` and switched to `gpt-5.4-nano` with `/model`. The harness wrote the note and ran `prepare` itself, because a first attempt showed `gpt-5.4-nano` doing the receiver's task in the sender instead of handing over. The plugin still supplied the values: the armed record held `gpt-5.4-nano` and `copilot`, and the receiver started with `--provider copilot -m gpt-5.4-nano --reasoning low`, so the model came from the session, not the launch flag. `/model` saves its choice to `~/.hermes/config.yaml`, so the harness copies that file first and puts it back on exit. The first attempt's addition was removed by hand.

Cursor had no live hop, because none can run there. Its reader is covered by tests instead: one for a selection made during the hop, one for a selection older than the launch, and one for the bracketed model on the relaunch line. A probe that started `cursor-agent --model gpt-5.6-luna` left the file's modification time unchanged, though it stopped at the workspace-trust prompt. That a launch flag never rewrites the file, and only an in-session switch does, is therefore inferred. A live in-session `/model` switch under the wrapper would confirm it.

Codex `none` and `minimal`, which no rollout had shown, were probed directly (`scratch/codex-effort-live/levels-probe.txt`). Codex accepted both. `gpt-6-luna` answered at `none` and rejected `minimal` with an HTTP 400 that lists its own levels. Both stay on the list, because the list is the runtime's and a model's own limits apply the same with or without the loop.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the live values on the relaunch record, not in the note | A note is text a session writes, while the record is written only by the CLI and the adapter |
| Read Claude, Codex and Cursor at `prepare`, and Pi and Hermes at `arm` | Claude, Codex and Cursor keep the values in files the CLI can open, while Pi and Hermes expose them only to their extension or plugin |
| Trust the Cursor config only when it changed after the hop launched | The file is shared by every Cursor session, so an older selection may be another session's |
| Carry the requested Hermes model, not the response model | The requested id is the one `-m` accepts; a provider may answer with a longer dated id |
| Check every value in the wrapper | A level or id the runtime rejects would end the relaunch at a usage error |
| Carry no live value on Devin or OpenCode | Neither records the session's current values where the CLI can read them, and neither has a flag to pass one |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Relaunch gate | PASS, 867 of 867, from a baseline of 837. The 30 new tests are this phase's 25 and the OpenCode phase's 5; the Hermes and Cursor work added 6 to the 861 of the first commit. One earlier full run failed a killer timing test that passed 64 of 64 alone twice and in every rerun since, and the killer files are unchanged |
| Plugin tests | PASS, 552 of 552, baseline 552 |
| Pi tests and typecheck | PASS, 54 of 54 from a baseline of 52, and `tsc -p tsconfig.pi.json` exits 0 |
| Hermes plugin tests | PASS, 64 of 64 from a baseline of 62, run without the session's inherited `SKILLED_LOOP_ID`, which one existing reaping test reads |
| `check-rule-copies.js`, comment hygiene, `bash -n` | PASS, exit 0 each |
| Live hops | PASS on Claude, Codex, Pi and Hermes. Cursor has no live hop and is covered by tests |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Hermes effort carries from the launch flag only.** Hermes hands its hooks no reasoning level, so a level changed inside the session is lost at the hop. The model and provider carry.
2. **Cursor carries a switch only when the config file changed during the hop.** Two Cursor sessions switching models at once can still race on the shared file, and Cursor had no live hop.
3. **OpenCode 2 and Devin carry no effort.** Neither has an effort flag, and OpenCode 2 has no model flag either.
4. **`keep` records nothing.** A note kept outside the loop is claimed by the same session, so there is no receiver to start.
<!-- /ANCHOR:limitations -->

---


