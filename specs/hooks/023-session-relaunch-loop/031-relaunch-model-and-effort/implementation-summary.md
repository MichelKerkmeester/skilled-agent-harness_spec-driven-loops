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
    last_updated_at: "2026-10-25T09:18:16Z"
    last_updated_by: "generate-context"
    recent_action: "Specified phase 031; operator approved the reviewed design"
    next_safe_action: "Fix the OpenCode 2 standalone replay, then build 031"
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
    completion_pct: 10
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

Two sources feed the next hop. The first is the launch line: the wrapper captures `--effort` on Claude, `-c model_reasoning_effort=` on Codex, `--thinking` on Pi and `--reasoning` on Hermes, and replays each one in that runtime's own syntax, next to the model it already carried. The second is the session itself. At `prepare` the CLI reads the Claude session log's last main-chain assistant entry or the Codex rollout's last turn context. The Pi extension hands its current model, provider and thinking level to the record when it arms. Those values win over the launch line for that hop and become the fallback for later hops.

Nothing the wrapper cannot check reaches a command line. A level outside the runtime's own list is dropped with a warning, a model that does not look like an id is ignored, and a Pi provider moves only together with a live model the wrapper accepted. The values live on the relaunch record, never in the note.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/skilled-loop` | Modified | Capture, check and replay the effort flag; apply the live model, provider and effort |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | `resolveSessionSettings`, the Codex rollout lookup, live fields on `preparePending` and `arm` |
| `.skilled/hooks/session-relaunch/lib/context-usage.cjs` | Modified | Readers for the Claude and Codex settings |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modified | `prepare` records the live values, `consume` reports them |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` | Modified | Hand the model, provider and thinking level to `arm` |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Modified | Effort and live-value cases per runtime |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modified | Record and consume cases |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` | Modified | Pi arm cases |
| `.skilled/hooks/session-relaunch/README.md` | Modified | Model And Effort Across A Hop |
| `.skilled/commands/speckit/handoff.md` | Modified | One line on what the relaunch carries |
| `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` | Modified | What the wrapper carries |
| `scratch/harness/run-*-effort.sh` | Created | Live hops on Claude, Codex and Pi |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every behavior got a failing test first. Ten of the eleven wrapper cases failed on the old wrapper, and the no-effort-flag case is the control that passed before and after. Four of the six CLI cases failed, and the two that passed are the no-value controls. One of the two Pi cases failed, and the other is its control. Of the two provider cases added after the Pi change, one failed and one is the control. Each level list came from the runtime's own help. Codex's help lists none, so its list holds the five levels its rollouts record (`low` up to `max`) plus `none` and `minimal`, which were not observed.

Three live hops ran through the real wrapper in private tmux servers and runtime directories. Claude, launched with `--model claude-sonnet-5-5 --effort low`, recorded those values from its log, and the receiver started with the same flags and ran its turns at them. Codex, launched with `-c model_reasoning_effort="low"`, recorded `gpt-6-luna` and `low` from its rollout, and the receiver's own turn ran at them. Pi, launched with `--model openai/gpt-6-luna --thinking low`, armed with `openai`, `gpt-6-luna` and `low`, and the receiver ran on them. Pi's configured defaults are a different provider, model and level, so the hop could not have landed there by chance.

During the Claude hop a human message reached the test receiver through a remote-control bridge: "This handoff started as sonnet low but should have been opus higg". The receiver's turns before it ran at `claude-sonnet-5-5` and `low`, the carried values, and the two turns after it ran at `claude-opus-5-5` and `high`. The evidence keeps both, in `scratch/claude-effort-live/transcript-settings.txt`. The sandboxes were removed afterwards, no process from them is left, and the saved evidence holds no key or token.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the live values on the relaunch record, not in the note | A note is text a session writes, while the record is written only by the CLI and the adapter |
| Read Claude and Codex at `prepare`, and Pi at `arm` | Claude and Codex keep the values in a log the CLI can open, while Pi exposes them only to its extension |
| Check every value in the wrapper | A level or id the runtime rejects would end the relaunch at a usage error |
| Carry no live value on Hermes, Cursor, Devin or OpenCode | None of them was found to record the session's current values where the CLI can read them, and OpenCode 2 and Devin have no flag to pass one |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Relaunch gate | PASS, 861 of 861, from a baseline of 837. The 24 new tests are this phase's 19 and the OpenCode phase's 5. One earlier full run failed a killer timing test that passed 64 of 64 alone twice and in the rerun, and the killer files are unchanged |
| Plugin tests | PASS, 552 of 552, baseline 552 |
| Pi tests and typecheck | PASS, 54 of 54 from a baseline of 52, and `tsc -p tsconfig.pi.json` exits 0 |
| `check-rule-copies.js` | PASS, exit 0 |
| Live hops | PASS on Claude, Codex and Pi. Hermes and Cursor were not run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Hermes and Cursor carry only the launch flags.** Neither reads the session's current model or effort, so a change made inside the session is lost at the hop. Neither had a live hop in this phase.
2. **OpenCode 2 and Devin carry no effort.** Neither has an effort flag, and OpenCode 2 has no model flag either.
3. **`keep` records nothing.** A note kept outside the loop is claimed by the same session, so there is no receiver to start.
<!-- /ANCHOR:limitations -->

---


