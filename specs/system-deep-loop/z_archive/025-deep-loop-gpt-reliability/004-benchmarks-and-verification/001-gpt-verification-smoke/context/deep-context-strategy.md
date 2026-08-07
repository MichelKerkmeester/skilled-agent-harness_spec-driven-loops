# Deep Context Strategy

**Scope**: Phase 004 route proof smoke for context
**Execution mode**: auto
**Max iterations**: 1
**Convergence threshold**: 0.01
**Relevance gate**: 0.55
**Agreement min**: 2

## Frontier

Frontier source: `glob_grep_fallback` because the code graph readiness state was stale.

| rank | path | symbol/unit | kind | freshness |
|------|------|-------------|------|-----------|
| 1 | `.opencode/commands/deep/context.md` | router contract / general-agent verification | command-router | unverified |
| 2 | `.opencode/commands/deep/assets/deep_context_presentation.txt` | auto setup and presentation contract | presentation-contract | unverified |
| 3 | `.opencode/commands/deep/assets/deep_context_auto.yaml` | auto YAML workflow | workflow-yaml | unverified |
| 4 | `.opencode/skills/deep-loop-workflows/deep-context/SKILL.md` | deep-context skill contract | skill-contract | unverified |
| 5 | `.opencode/skills/cli-opencode/SKILL.md` | CLI executor self-invocation contract | executor-contract | unverified |
| 6 | `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/004-gpt-verification-smoke/verification-smoke.md` | phase smoke procedure | spec-doc | unverified |

## Executor Pool

| label | kind | model | prompt framework | status |
|-------|------|-------|------------------|--------|
| gpt-context-smoke | cli-opencode | openai/gpt-5.5 | none; frontier model out of sk-prompt-models scope | blocked by cli-opencode self-invocation guard |

## Known Context

Prior context loading via `memory_context` failed with `E_SESSION_SCOPE`; the run continued with direct spec-doc reads.

## Next Focus

If rerun from a non-OpenCode dispatch surface, sweep the same frontier and require at least two executor seats or lower `agreementMin` explicitly for a one-seat smoke.
