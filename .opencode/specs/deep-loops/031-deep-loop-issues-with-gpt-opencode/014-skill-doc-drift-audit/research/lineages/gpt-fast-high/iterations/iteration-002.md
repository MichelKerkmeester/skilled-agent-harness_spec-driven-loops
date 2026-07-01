# Iteration 2: ai-council Direct-Invocation and Mode Claims

## Focus

Search live docs for claims that `ai-council` remains a primary/direct `--agent` target after phase 010 converted it to `mode: subagent`.

## Findings

1. `cli-opencode/SKILL.md` still lists `ai-council` among primary agents directly invokable via `--agent`. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:31]
2. The same skill later says OpenCode defines `ai-council` as a primary agent and says to pin `--agent plan|orchestrate|ai-council` when needed. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:285]
3. This contradicts phase 010: `ai-council` is no longer directly selectable as a top-level OpenCode agent and `.opencode/agents/ai-council.md:4` is `mode: subagent`. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/010-ai-council-subagent-only/implementation-summary.md:48-60] [SOURCE: .opencode/agents/ai-council.md:4]
4. `cli-opencode/README.md` repeats the stale direct-primary exception by saying top-level `--agent` is conditionally allowed for primary agents such as `plan`, `orchestrate`, or `ai-council`. [SOURCE: .opencode/skills/cli-opencode/README.md:76]
5. The README troubleshooting row repeats the stale fix: use `orchestrate` or `ai-council` when they are the documented primary route. [SOURCE: .opencode/skills/cli-opencode/README.md:164]

## Sources Consulted

- `.opencode/skills/cli-opencode/SKILL.md`
- `.opencode/skills/cli-opencode/README.md`
- `.opencode/agents/ai-council.md`
- `010-ai-council-subagent-only/implementation-summary.md`

## Assessment

- newInfoRatio: 0.9
- Novelty: multiple independent stale claims found in the same skill family.
- Confidence: high. The contradiction is directly established by current agent frontmatter and phase 010 verification.

## Reflection

- Worked: exact `ai-council`/`--agent` grep produced direct evidence.
- Failed: none.
- Ruled out: `cli-opencode/references/agent_delegation.md` is not stale here; it now says direct `opencode run --agent ai-council` is forbidden as of `mode: subagent`. [SOURCE: .opencode/skills/cli-opencode/references/agent_delegation.md:197]

## Recommended Next Focus

Check `cli-opencode` assets and playbook examples for copy-paste stale `--agent ai-council` commands.
