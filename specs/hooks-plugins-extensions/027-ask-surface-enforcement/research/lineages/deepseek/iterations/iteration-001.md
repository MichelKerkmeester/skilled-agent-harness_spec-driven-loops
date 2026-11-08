# Iteration 1: Claude Code ask surface and Stop enforcement

## Focus

Prove the Claude Code half of the research: does a native ask tool exist, what is its exact
name, when is it available, and which turn-end event can block a prose option menu. This is
the runtime with the most local evidence, so it also establishes the enforcement pattern the
other runtimes are compared against.

## Actions Taken

- Read the official Claude Code tools reference for `AskUserQuestion` and its permission and
  availability rules.
- Read the official Claude Code hooks reference for the `Stop` input schema, decision control
  and async semantics.
- Read the official subagent tool-availability filter, which names `AskUserQuestion`.
- Read the repository's live Claude hook wiring and the existing completion-evidence Stop
  sentinel, then the registry renderer that produces that wiring.

## Findings

1. **Claude Code's native ask tool is `AskUserQuestion`.** It asks multiple-choice questions to gather requirements or clarify ambiguity, and it requires no permission (`Permission required: No`). The exact string is the one permission rules, subagent tool lists and hook matchers use. [SOURCE: https://code.claude.com/docs/en/tools-reference.md] [SOURCE: .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs:1]
2. **`AskUserQuestion` is gated out of every subagent, so only the main conversation can ask.** The subagent tool filter removes `AskUserQuestion` "even when listed in the `tools` field", alongside `Agent`, `EndConversation`, `EnterPlanMode`, `ExitPlanMode`, `ScheduleWakeup`, `WaitForMcpServers` and `Workflow`. A dispatched worker therefore cannot satisfy an ask-the-operator obligation, which matters for fan-out lineages. [SOURCE: https://code.claude.com/docs/en/sub-agents.md]
3. **A question can auto-close, which changes what "asked" means.** `askUserQuestionTimeout` accepts `60s`, `5m` or `10m`; after that the dialog submits any selected options and tells Claude the operator may be away. It never starts in background sessions, screen-reader mode or Remote Control. [SOURCE: https://code.claude.com/docs/en/tools-reference.md]
4. **The Claude `Stop` hook is the deterministic turn-end enforcement point and it can block.** `decision: "block"` prevents Claude from stopping, `reason` is required with it, and `last_assistant_message` carries the final assistant text without reading the transcript. `stop_hook_active` is `true` when Claude is already continuing from a prior Stop block, and Claude Code caps consecutive continuations at 8. [SOURCE: https://docs.claude.com/en/docs/claude-code/hooks]
5. **Every Claude Stop hook in this repository is async, so none of them can block today.** `.claude/settings.json` registers three `Stop` handlers (`session-stop`, `completion-evidence-stop`, `stop-arm`) and all three carry `"async": true`; the docs define async as running in the background without blocking. The known failure evidence is therefore confirmed, not assumed. [SOURCE: .claude/settings.json:1]
6. **The existing completion-evidence Stop sentinel is the reusable shape, and it deliberately never blocks.** It reads its own stdin payload, no-ops on `stop_hook_active === true`, detects a completion claim in `last_assistant_message`, and is documented as advisory-only: "NEVER emits {decision:\"block\"}" for the whole v1 rollout. An ask-surface guard can copy this adapter and change exactly one branch. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs:19] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs:112]
7. **Blocking is a registry field, not a settings-file edit.** `hook-registry.json` is the canonical hook set, and `sync-hook-registrations.cjs` renders `hook.async = true` only when the binding sets `async`. Dropping `async` from a Claude binding and re-running the synchronizer is the whole wiring change; the generated settings file must not be hand-edited. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:160] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:1]

## Ruled Out

- **Reading `transcript_path` to recover the last message.** The hooks reference states the
  transcript is written asynchronously and may not include the current turn's most recent
  messages, and directs hooks that need the final assistant text to `last_assistant_message`
  instead. A transcript-based detector would race the Stop event.
- **Blocking from `PostToolUse` on `AskUserQuestion`.** That event proves an ask happened but
  fires only when a tool ran; it cannot detect the failing case, which is a turn with no tool
  call at all.

## Dead Ends

- None this iteration. The Claude path is fully evidenced.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: the repository's completion sentinel says "never block" while the
  platform supports blocking. Resolved as a rollout choice, not a platform limit: the docs
  define `decision: "block"`, the hook simply does not use it.
- Missing dependencies: none.
- Partial success: none. Claude Code is answered; the other runtimes are later iterations.

## Sources Consulted

- https://code.claude.com/docs/en/tools-reference.md
- https://docs.claude.com/en/docs/claude-code/hooks
- https://code.claude.com/docs/en/sub-agents.md
- .claude/settings.json
- .skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs
- .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json
- .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs
- .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs

## Assessment

- New information ratio: 1.0
- Questions addressed: Q1 (Claude Code), Q2 (Claude Code), Q4 (registry mechanics)
- Questions answered: none fully; Q1 and Q2 span all runtimes.

## Reflection

- What worked and why: reading the platform docs beside the live settings file settled the
  central claim in one pass, because the doc defines the blocking contract and the settings
  file shows it is unused.
- What did not work and why: nothing failed. The transcript route was rejected on doc evidence
  before any code was written.
- What I would do differently: fetch the tools reference before the hooks reference next time;
  the tool's availability rule (subagent exclusion) shaped which runtime can even be asked.

## Recommended Next Focus

Iteration 2: OpenCode and Pi. Prove OpenCode's `question` tool and whether any plugin event can
block a turn end, then Pi's `ask_user_question` extension and the blocking limits of its
`agent_end` and `message_end` events.
