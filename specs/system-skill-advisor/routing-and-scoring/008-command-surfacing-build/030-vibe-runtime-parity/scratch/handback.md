# Hand-back: Vibe gaps this phase does not build

This phase builds Vibe support in the command-surfacing packet's own surfaces. The gaps below belong to the Vibe packet (`specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/`, called 004 here) or to hooks documents main is still changing. Each one is listed with the lines read on 2026-11-15 at `e58d450985c` and the owner it goes to. The close-out rechecks every line with `rg -n` and corrects a number main moved.

## G7 goal binding and resend

- **What was seen.** The goal slice reaches a Vibe session only from `VIBE_SPEC_FOLDER`. The dispatch command in `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:72` is the only place that sets it. An interactive Vibe session gets no slice. 004 phase 011 leaves per-turn refresh out because a strict `post_agent` is rejected (`011-vibe-context-and-goal-hooks/spec.md:101`). 004 phase 019 records that a relaunched Vibe session gets no start slice, because the wrapper exports `SESSION_RELAUNCH_GOAL_PACKET` and the Vibe hook reads `VIBE_SPEC_FOLDER` (`019-vibe-relaunch-command-tier/scratch/manual-hop.md:53-58`).
- **Owner.** 004, its goal hooks under `.skilled/hooks/goal/vibe/`.
- **Question for the operator.** Should an interactive or relaunched Vibe session read the bound packet the way the other runtimes do?

## G9 git-preflight advisory

- **What was seen.** `cli-mistral-vibe/references/guards-and-hooks.md:139` says the advisory was not ported because the same rules sit in sk-git's docs and "no tool hook can inject an advisory". The second reason does not hold. Vibe `post_tool` hooks print `hook_specific_output.additional_context` at `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs:58`, `.vibe/plugins/repo-guards/post-edit-quality.mjs:36` and `.vibe/plugins/repo-guards/dist-freshness.mjs:112`. A live run recorded it reaching the model: 004 phase 018 `implementation-summary.md:30` and `:127` show the next `post_tool_call` result carrying the goal slice. The ask-capture `post_tool` hook prints nothing, so it is no counterexample. `.vibe/plugins/README.md:66` gives only the first reason.
- **Owner.** 004 and sk-git.
- **Question for the operator.** Port the git-preflight advisory as a non-strict Vibe `post_tool` hook, or keep the first reason alone and correct line 139.

## G12 doc drift

- **What was seen.**
  - `.skilled/hooks/README.md:30` and `:36` leave Vibe out of the session handover runtimes and the `SYSTEM_SESSION_HANDOVER_<RUNTIME>_ENABLED` list.
  - `.skilled/hooks/README.md:351-359`, the git concern rows, name no Vibe entry.
  - `.skilled/hooks/goal/vibe/README.md:21` says nothing re-injects the goal after compaction, which 004 phase 018 now does.
  - `.vibe/SYNC.md:71` says turn-start has one part today.
  - 004 `spec.md:136-141` still lists phases 017 to 022 as Pending.
  - 004 phase 015 `tasks.md:75` still lists F001 as blocked.
- **Owner.** 004 and the hooks hub README. All of these files are on this phase's do-not-touch list.

## G8 automatic hop, context nudge and stop arm

- **What was seen.** Deferred by decision in 004 (`spec.md:138`, phase 019 keeps the automatic tier out of scope) and in `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/043-vibe-handover-flag-and-live-hop/spec.md:98`, because Vibe runs mostly as a headless child.
- **Owner.** The session handover packet. Reopen only when that reason no longer holds.

## G10 an unchanged head is dropped

- **What was seen.** `reduceRepeatedHead` in `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs` drops a head equal to the last one, documented at `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:95`: Vibe keeps added context in the conversation, so a repeat adds nothing. This phase adds its document line before the receipt, so equal heads stay equal.
- **Owner.** None. Recorded by design.

## Found while planning

- **The `process_start` matcher.** The strict guards in `.vibe/hooks.toml` (lines 37, 45, 53, 61, 76 and 110) match `re:bash|process_start|...`. The recorded tool registry (004 phase 011 `scratch/first-turn/session/generations/0000000000000001/runtime-state.json`) names `builtin:process.start`, and the journals that mention `process.start` hold it only in the tool list of a completion request, never as a call. So which name the matcher receives is unknown. If it receives `process.start`, a shell started that way may pass the spec gate and the other strict guards unchecked. Owner: 004, its repo guards.
- **Wiring check rows for Pi, DSH and OpenCode.** This phase adds a Vibe row to `.skilled/commands/doctor/scripts/hook-wiring-check.cjs`. Pi, DSH and OpenCode load their prompt hook through an extension or a plugin, not a hooks file, so the check still has no row for them. Owner: the doctor command.
