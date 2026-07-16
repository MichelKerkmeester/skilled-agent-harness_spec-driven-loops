# Iteration 002 - Command and Agent Contract Drift

## Focus

Where the deep-research command contract, generated workflow, iteration prompt pack, and runtime-specific LEAF agent definitions diverge from current behavior.

## Actions Taken

1. Read the externalized state log, strategy, prior iteration, and deep-research quick reference before investigating the selected focus.
2. Compared the `/deep:research` command entrypoint and compiled contract with the active auto-workflow dispatch and post-dispatch validator.
3. Compared the rendered iteration prompt contract with the OpenCode and Claude deep-research agent definitions.
4. Cross-checked sibling agent definitions where they expose the same runtime-path and reducer-ownership conventions.

## Findings

### F-ITER002-001 - Canonical agent emits a schema rejected by the active validator (P1)

Both OpenCode and Claude deep-research agents instruct the leaf to append a record keyed by `run` and do not require `mode`, `target_agent`, `agent_definition_loaded`, or `resolved_route`. The active prompt pack and YAML validator instead require `iteration` plus all four route-proof fields. A native agent following its own canonical definition can therefore produce an otherwise valid-looking record that `post_dispatch_validate` rejects and re-dispatches, increasing cost and risking duplicate iteration artifacts. [SOURCE: .opencode/agents/deep-research.md:250-281] [SOURCE: .claude/agents/deep-research.md:233-264] [SOURCE: .opencode/skills/system-deep-loop/deep-research/assets/prompt_pack_iteration.md.tmpl:61-69] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:1218-1257]

### F-ITER002-002 - Canonical agent omits the mandatory delta artifact (P1)

The prompt pack and validator require `deltas/iter-NNN.jsonl` with a canonical iteration record, but the agent's workflow, write boundary, state-management table, completion report, and verification checklist mention only the narrative, state-log append, and optional progressive synthesis. The validator explicitly treats a missing delta as failure and may redispatch once. This is a contract-level reliability gap, not merely missing explanatory prose. [SOURCE: .opencode/agents/deep-research.md:69-73] [SOURCE: .opencode/agents/deep-research.md:79-93] [SOURCE: .opencode/agents/deep-research.md:390-400] [SOURCE: .opencode/skills/system-deep-loop/deep-research/assets/prompt_pack_iteration.md.tmpl:55-83] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:1239-1257]

### F-ITER002-003 - Agent definitions point to a registry filename that runtime never creates (P1)

The OpenCode and Claude agents repeatedly name `deep-research-findings-registry.json`, while the YAML workflow creates and reduces `findings-registry.json`. Because the agent treats the registry as optional, the mismatch silently removes deduplication and continuity evidence rather than producing a hard failure. The prompt pack receives the correct YAML path, but the canonical agent documentation remains contradictory. [SOURCE: .opencode/agents/deep-research.md:95-103] [SOURCE: .opencode/agents/deep-research.md:390-399] [SOURCE: .claude/agents/deep-research.md:78-85] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:95-105] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:1306-1319]

### F-ITER002-004 - Native fan-out dispatch violates the LEAF single-iteration boundary (P1)

The agent and prompt pack define `deep-research` as a LEAF that executes exactly one iteration, but the native fan-out branch dispatches that same agent with the instruction `Run to convergence`. Unlike CLI fan-out, this branch does not invoke a loop host; it asks the leaf itself to absorb loop ownership. That conflicts with the command's dispatch-per-iteration architecture and can yield either a refusal/partial run or an unaudited inline loop. [SOURCE: .opencode/agents/deep-research.md:24-40] [SOURCE: .opencode/skills/system-deep-loop/deep-research/assets/prompt_pack_iteration.md.tmpl:1-6] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:147-183] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:1018-1066]

### F-ITER002-005 - Prompt write allowlist contradicts reducer ownership (P1)

The prompt says the reducer owns strategy machine-owned sections and the registry, then explicitly lists both files as allowed in-place write targets. The compiled command contract and canonical agent classify those files as read-only. A CLI executor prioritizing the concrete allowlist can mutate reducer-owned state before reduction, creating nondeterministic state or overwriting machine-owned sections. [SOURCE: .opencode/skills/system-deep-loop/deep-research/assets/prompt_pack_iteration.md.tmpl:33-49] [SOURCE: .opencode/commands/deep/assets/compiled/deep_research.contract.md:389-411] [SOURCE: .opencode/agents/deep-research.md:69-73] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:1306-1325]

### F-ITER002-006 - Generated executor setup text contains duplicate and blank choices (P2)

The compiled contract lists `cli-opencode` twice in accepted executor values and twice in the interactive menu, while one menu entry has a blank command name and another repeats `cli-opencode` for a different invocation. The executor-hint omission check also contains an empty inline token. This makes the operator contract ambiguous and suggests stale executor renaming survived compilation despite the generated file presenting itself as the grep-checkable authority. [SOURCE: .opencode/commands/deep/assets/compiled/deep_research.contract.md:176-195] [SOURCE: .opencode/commands/deep/assets/compiled/deep_research.contract.md:246-255] [SOURCE: .opencode/commands/deep/assets/compiled/deep_research.contract.md:293-317]

### Ruled-Out Direction

No substantive OpenCode-versus-Claude body drift was established for deep-research or deep-review: their bodies are near mirrors and their frontmatter differences mostly reflect runtime permission syntax. The actionable divergence is between both mirrors and the prompt/YAML runtime contract, not between the two mirrors themselves. [SOURCE: .opencode/agents/deep-research.md:1-26] [SOURCE: .claude/agents/deep-research.md:1-19] [SOURCE: .opencode/agents/deep-review.md:1-38] [SOURCE: .claude/agents/deep-review.md:1-21]

## Questions Answered

- Command and runtime-specific agent definitions diverge on the canonical iteration schema, required artifacts, registry path, native fan-out ownership, and reducer-owned write boundaries.
- The most consequential drift can cause validator-triggered redispatch, missing continuity/deduplication input, or LEAF role absorption.
- Runtime-specific Claude/OpenCode mirror differences are not the primary defect in this focus area.

## Questions Remaining

- Do deep-review and deep-ai-council prompt packs have equivalent schema, delta, or reducer-ownership drift against their agents?
- Are async executor provenance guarantees intentionally weaker than synchronous dispatch, and is that documented?
- Which operator ergonomics and cost/performance issues dominate actual loop runs beyond validator-triggered redispatch?
- How do the four subskills invoke shared runtime surfaces in ways that trigger or mask the iteration-001 defects?

## Next Focus

Rotate to operator ergonomics and cost/performance across setup, dispatch, resume, fan-out, timeout handling, and redundant validation/re-dispatch paths. Quantify avoidable process launches and token-heavy prompt duplication where evidence permits.

## SCOPE VIOLATIONS

None. No researched command, workflow, skill, runtime, or agent file was modified; reducer-owned strategy and registry files were left untouched.
