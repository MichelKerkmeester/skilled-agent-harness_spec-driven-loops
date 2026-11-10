# Iteration 2: OpenCode, Pi and Codex ask surfaces and turn-end blocking

## Focus

Extend the runtime matrix beyond Claude Code. Three runtimes are checked together because
their evidence sits in the same hook and decision-capture trees: OpenCode (built-in
`question`), Pi (`@juicesharp/rpiv-ask-user-question`) and Codex (`request_user_input`).
The question is the same for each: exact tool name, availability gate, and whether any
turn-end event can block.

## Actions Taken

- Read the OpenCode decision-capture sweep and the plugin architecture's hook-mapping table.
- Read the OpenCode completion sentinel header, which states what `session.idle` can and
  cannot do.
- Read the Pi sweep's tool set and its comment on where each Pi question tool comes from,
  then the Pi extension type declarations for `agent_end`, `message_end` and `tool_call`.
- Read the Pi project settings and the plugin inventory for the installed extension.
- Read the Codex sweep's tool constant, the Codex feature flags, the Orca hook listener's
  Codex notes, and this repo's Codex hook contract.

## Findings

1. **OpenCode's built-in ask tool is named `question`.** The decision-capture sweep keys on `part.tool === 'question'` and normalizes its `questions` input, so the name is proven against real session storage rather than assumed. [SOURCE: .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:46]
2. **OpenCode's `question` tool is built in and not gated by a mode or flag in this repo.** No agent definition under `.opencode/agents/` sets a `tools:` block, and the `permission:` blocks do not mention `question`, so nothing in the repository removes it. That is an absence of evidence for gating, not proof the host always exposes it to subagents. [SOURCE: .opencode/agents/code.md:1]
3. **OpenCode cannot block a turn end; only `tool.execute.before` can deny anything.** The plugin bridge documents that `tool.execute.before` denies the call on a throw, while `event` is a subscription that replays events. The repository's own completion sentinel consumes `session.idle` and is advisory-only, which confirms the event leg has no blocking channel. [SOURCE: .opencode/plugins/ARCHITECTURE.md:128] [SOURCE: .opencode/plugins/system-completion-sentinel.js:1]
4. **Pi has no built-in question tool; its two ask surfaces are extensions.** `ask_user_question` comes from `@juicesharp/rpiv-ask-user-question` and `question` from `pi-plan-build`; the sweep accepts either because a session may install both. `.pi/settings.json` enables the rpiv package and `pi-plan-build`, so both names are live in this repository. [SOURCE: .skilled/hooks/decision-capture/bin/sweep-pi.mjs:32] [SOURCE: .pi/settings.json:1] [SOURCE: .pi/PLUGINS.md:1]
5. **Pi cannot block a turn end.** The published extension types give `agent_end` no result type, so a handler's return value is discarded; `message_end` may only replace the finalized message; only `tool_call` has a blocking result, which the overlay guard uses as `{ block: true, reason }`. A Pi ask-surface guard therefore has no turn-end enforcement point. [SOURCE: .pi/types/pi-coding-agent.d.ts:136] [SOURCE: .pi/types/pi-coding-agent.d.ts:129] [SOURCE: .skilled/hooks/overlay-guard/pi/overlay-guard.ts:24]
6. **Codex's ask tool is `request_user_input`, and it is gated.** The sweep names the constant, `.codex/config.toml` sets `default_mode_request_user_input = true` and `hooks = true`, and the handoff rule records the narrower truth: Plan mode has it, Default mode only behind that feature, and `codex exec` never. [SOURCE: .skilled/hooks/decision-capture/bin/sweep-codex.mjs:38] [SOURCE: .codex/config.toml:1] [SOURCE: .skilled/repo-rules/communication-handoff.md:152]
7. **Codex `request_user_input` is auto-allowed and reaches `PreToolUse` while the operator is deciding.** That makes `PreToolUse` a reliable *positive* signal that an ask happened, and useless as a negative one: a turn that never asks produces no tool event. [SOURCE: specs/cli-orca/002-consolidate-official-orca-skills/context/orca-main/src/shared/agent-hook-listener/providers/codex-events.ts:114]
8. **Codex's `Stop` hook exists and is wired, but this repository documents no block contract for it.** The hook contract says only `UserPromptSubmit` exit 2 blocks a turn, every other non-zero exit fails open, and a Stop hook's stdout is parsed as a response envelope — which is why the existing Stop sentinel is labelled advisory. Treat Codex Stop as observe-only until a Codex release documents a block decision. [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/references/hook-contract.md:119] [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/references/hook-contract.md:204]

## Ruled Out

- **Blocking an OpenCode turn end from the `event` hook.** The architecture table and the
  completion sentinel both show the event leg is a subscription with no return channel.
- **Treating Codex `PreToolUse` as the enforcement point.** It fires only when a tool runs, so
  it cannot see the failure case, a turn that ends with prose and no tool call.
- **Assuming Pi `turn_end` is a supported blocking event.** `goal-context.ts` registers a
  `turn_end` handler, but the published `ExtensionAPI` type declares no such event and
  `agent_end` has no result type. The registration is untyped at best and cannot block.

## Dead Ends

- Codex Stop blocking: no repository contract, and a web search for the upstream hook contract
  was unavailable in this session. Recorded as unproven rather than guessed.

## Edge Cases

- Ambiguous input: whether OpenCode subagents receive `question`. Recorded as an inference from
  the absence of a `tools:` block, not as a proven host rule.
- Contradictory evidence: the handoff rule's Codex row is narrower than a plain "Codex has
  `request_user_input`". The rule wins because it names the mode and flag gate.
- Missing dependencies: no upstream Codex hook documentation reachable.
- Partial success: OpenCode, Pi and Codex are each partially answered; Codex blocking stays open.

## Sources Consulted

- .skilled/hooks/decision-capture/bin/sweep-opencode.mjs
- .skilled/hooks/decision-capture/bin/sweep-pi.mjs
- .skilled/hooks/decision-capture/bin/sweep-codex.mjs
- .opencode/plugins/ARCHITECTURE.md
- .opencode/plugins/system-completion-sentinel.js
- .opencode/agents/code.md
- .pi/types/pi-coding-agent.d.ts
- .pi/settings.json
- .pi/PLUGINS.md
- .skilled/hooks/overlay-guard/pi/overlay-guard.ts
- .codex/config.toml
- .skilled/repo-rules/communication-handoff.md
- .skilled/skills/cli-external-orchestration/cli-codex/references/hook-contract.md
- specs/cli-orca/002-consolidate-official-orca-skills/context/orca-main/src/shared/agent-hook-listener/providers/codex-events.ts

## Assessment

- New information ratio: 1.0
- Questions addressed: Q1 (OpenCode, Pi, Codex), Q2 (OpenCode, Pi, Codex)
- Questions answered: none fully; Devin, Cursor, DSH and Hermes remain.

## Reflection

- What worked and why: the decision-capture sweeps are a per-runtime registry of proven tool
  names, so one grep settled three runtimes at once.
- What did not work and why: the Codex Stop question could not be closed locally. The repo's
  hook contract is about the events it uses, not the full upstream surface.
- What I would do differently: check the type declarations before the runtime docs for Pi; the
  `agent_end` signature settled the blocking question faster than prose would have.

## Recommended Next Focus

Iteration 3: Devin, Cursor, DSH and Hermes. Prove each ask tool name, then classify each
turn-end event as blocking or observe-only. Hermes is expected to be gone from the repository
and must be verified, not assumed.
