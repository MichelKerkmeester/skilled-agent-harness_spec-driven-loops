# Iteration 2: Dispatch Path and Loop-Like Signal

## Focus

Define what "loop-like" should mean mechanically by reading the actual command/agent dispatch contracts.

## Findings

1. `cli-opencode/SKILL.md` now states that command-owned loop executors (`deep-research`, `deep-review`, `deep-improvement`, `prompt-improver`) are owned by their parent commands, and that `orchestrate` may perform exactly one bounded hand-off but must not re-implement iteration, convergence, or continuity [SOURCE: .opencode/skills/cli-opencode/SKILL.md:279-295].
2. The deeper `agent_delegation.md` reference is stricter for direct CLI routing: `deep-research` and `deep-review` are dispatched only by parent commands, their parent commands own state and convergence, and direct `opencode run --agent deep-research|deep-review` is forbidden [SOURCE: .opencode/skills/cli-opencode/references/agent_delegation.md:203-214], [SOURCE: .opencode/skills/cli-opencode/references/agent_delegation.md:227-230]. This distinction matters: the new guard target is not all command-owned direct dispatch, but repeated orchestrate-mediated hand-offs.
3. `orchestrate.md` routes `/deep:review` to `@deep-review` only when there is an explicit deep-loop convergence request, not for one-shot review [SOURCE: .opencode/agents/orchestrate.md:71-80]. It also marks leaf agents as unable to dispatch further [SOURCE: .opencode/agents/orchestrate.md:83-93].
4. `orchestrate.md` requires a `Deep Route:` field for deep routes with `mode=<workflowMode>`, `target_agent=@<agent>`, `execution=<single_iteration|loop|session>`, and `source_of_truth=.opencode/skills/deep-loop-workflows/mode-registry.json` [SOURCE: .opencode/agents/orchestrate.md:186-210]. The current plugin's `subagent_type`-only lookup is therefore too weak for orchestrate paths: the true target may be visible in prompt text even when runtime `subagent_type` is the generic wrapper.
5. `deep-review.md` is explicit that the agent executes one review iteration and the `/deep:review` command manages the loop [SOURCE: .opencode/agents/deep-review.md:34-39]. It hard-blocks nested Task dispatch [SOURCE: .opencode/agents/deep-review.md:54-64] and names `/deep:review`, its YAML workflows, and orchestrate as caller/coordinator only surfaces [SOURCE: .opencode/agents/deep-review.md:276-284].
6. `mode-registry.json` provides stable target identities for research and review (`workflowMode`, `command`, `agent`) [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:33-63] and for improvement (`deep-improvement`) [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:81-99]. The prompt-improver target is not in this registry, so a hardening design must either add a small explicit list for it or route it through a separate prompt command registry.

## Mechanical Definition

Recommended core signal:

`loop-like = same sessionID + callerAgent=orchestrate + same command-owned loop target + more than one non-retry hand-off inside the active session/window`.

Detection fields:

- `sessionID`: from `tool.execute.before` input.
- `callerAgent`: infer from `chat.message` hook's `agent` field when available, or from prompt fields such as `Agent: @orchestrate`; `tool.execute.before` alone does not expose `agent` [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:187-199], [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:235-241].
- `target`: prefer parsed `Deep Route: target_agent=@...` and `mode=...`; fall back to `args.subagent_type` only when it is already a registry agent.
- `window`: session lifetime for strict mode; 10-15 minutes for warn-only mode if preserving multi-topic long sessions is important.

## Sources Consulted

- `.opencode/skills/cli-opencode/SKILL.md:279-295`
- `.opencode/skills/cli-opencode/references/agent_delegation.md:203-230`
- `.opencode/agents/orchestrate.md:71-93`
- `.opencode/agents/orchestrate.md:186-210`
- `.opencode/agents/deep-review.md:34-64`
- `.opencode/agents/deep-review.md:276-284`
- `.opencode/skills/deep-loop-workflows/mode-registry.json:33-99`

## Assessment

- `newInfoRatio`: 0.74
- Novelty justification: This iteration corrected the naive assumption that `args.subagent_type` is always the true deep target and produced a key that matches the actual orchestrate Task schema.
- Confidence: High for research/review/improvement registry keys. Medium for prompt-improver until its command-owned identity source is read or added to a registry.

## Reflection

- Worked: Cross-reading orchestrate and cli-opencode exposed the precise allowed path: one bounded hand-off only.
- Failed: The current plugin's target resolution is not enough for orchestrate's generic wrapper pattern.
- Ruled out: Blocking every direct deep-review/deep-research Task dispatch from all callers; the user's requested hardening is narrower and must preserve the one orchestrate hand-off.

## Recommended Next Focus

Turn the signal into concrete design options with thresholds and false-positive analysis, using phase 012 benchmark evidence.
