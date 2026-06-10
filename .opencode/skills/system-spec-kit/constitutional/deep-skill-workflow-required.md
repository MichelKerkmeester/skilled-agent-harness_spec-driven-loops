---
title: "DEEP SKILLS — Use the Workflow, Never Hand-Roll"
importanceTier: constitutional
contextType: decision
last_confirmed: "2026-06-07"
last_confirmed_source: "git-log-last-touch"
triggerPhrases:
  # deep skills
  - deep-context
  - deep-research
  - deep-review
  - deep-ai-council
  - deep-improvement
  - deep-loop
  - deep loop
  # deep commands
  - start-context-loop
  - start-research-loop
  - start-review-loop
  - ask-ai-council
  - start-agent-improvement-loop
  # the work these do
  - gather context
  - context gather
  - by-model sweep
  - deep research
  - deep review
  - ai council
  - council deliberation
  - convergence loop
  # the anti-pattern
  - manual cli-opencode dispatch
  - hand-roll the gather
  - deep-context bypass
---

# Deep Skills — Use the Workflow, Never Hand-Roll

## Rule

**When a task calls for a deep skill (`deep-context`, `deep-research`, `deep-review`, `deep-ai-council`, `deep-improvement`), you MUST invoke its actual command, agent or workflow.** Use `/deep:start-context-loop`, `/deep:start-research-loop`, `/deep:start-review-loop`, `/deep:ask-ai-council`, or `/deep:start-agent-improvement-loop` (or the `@ai-council` agent at depth). **NEVER hand-roll a manual substitute** — backgrounded `gtimeout ... opencode run --model ... &` dispatches, hand-written seat prompts, hand-extracted JSONL, hand-synthesized iteration or context-report state. If a plan names the deep workflow, it is frozen like scope (see AGENTS.md §1 PLAN-WORKFLOW LOCK).

## Why

The deep commands already provide the safety AND the value a manual substitute throws away: read-only seats with host-written state (Gate-3-safe), convergence detection, the cross-executor agreement signal, atomic state writes, the single-writer loop-lock, and runtime recursion guards. The friction you assume is usually false. `start-context-loop.md` states verbatim: "Seats are READ-ONLY analyzers; the host writes all merged state (Gate-3-safe)." cli-* executor seats (DeepSeek, MiMo, gpt-5.5) plug into the SAME loops via `--executors`, so a by-model sweep runs INSIDE the workflow with managed state. Reinventing that by hand is redundant and discards convergence plus the agreement signal for no gain.

## How to apply

1. Before substituting any manual approach for a deep workflow, `Read` its command doc and `SKILL.md` to verify the friction you assume actually exists. A remembered manual pattern is not evidence the proper tool has that limitation.
2. Run the proper command, for example `/deep:start-context-loop:auto "<scope>" --spec-folder <packet> --executors='[{"kind":"cli-opencode","model":"deepseek-v4-pro"},{"kind":"cli-opencode","model":"mimo-v2.5-pro"}]'`. Pass cross-AI seats through `--executors`; do not hand-dispatch them.
3. If the command genuinely cannot run in the active runtime, STATE the deviation to the user ("plan names X, I propose Y because Z") and get approval before substituting.
4. The loop executor agents (`@deep-research`, `@deep-review`, `@deep-context`, `@deep-improvement`) are dispatched ONLY by their parent commands. Never dispatch them directly via the Task tool to build your own loop.

## When this rule does NOT apply

- A single read-only analysis dispatch that is genuinely NOT a multi-iteration loop (one quick cli-* confirm) where no convergence or cross-executor agreement is needed.
- The deep skill is genuinely unavailable in the active runtime AND the deviation was flagged to the user and approved.

## Failure mode signal

If you are writing `gtimeout ... opencode run --model ... &` in a loop, hand-extracting JSONL `text` events, and hand-writing the iteration or context-report state, STOP. That is the deep workflow's job, and the command does it Gate-3-safe with convergence you are otherwise discarding. Invoke the command. The first manual attempt was the wrong path by definition.
