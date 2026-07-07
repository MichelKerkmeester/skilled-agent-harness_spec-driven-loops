# Iteration 7: KQ7 Hook Latency Fit

## Focus

Measure current CLI/scorer costs and decide whether prompt-submit hooks can shell out per prompt.

## Findings

1. Current hook handlers build a brief directly via `buildSkillAdvisorBrief()` and render it; Claude and Gemini return additional context only when the brief is non-empty [SOURCE: file:.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:164], [SOURCE: file:.opencode/skills/system-skill-advisor/hooks/gemini/user-prompt-submit.ts:178].
2. Codex passes a subprocess timeout into brief construction; the default environment reference is 3000ms [SOURCE: file:.opencode/skills/system-skill-advisor/hooks/codex/prompt-wrapper.ts:170], [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:169].
3. One-shot timing medians: Python local recommend 74.9ms; Python native recommend 824.8ms; Node startup 39.6ms; health 49.8ms; validate-only 73.8ms [SOURCE: command:5-sample timing sweep].
4. Batch timing medians for 10 prompts: local 275.2ms, native 277.5ms [SOURCE: command:batch timing sweep].
5. The sharp conclusion: native scoring is not inherently slow in batch; the per-call Python-to-Node bridge/probe dominates hook latency.
6. Warm-only policy verdict: acceptable only if hooks talk to a warm resident daemon/IPC path or in-process compat module. A new CLI may be used for manual invocation and fallback, but prompt-submit must not spawn one native bridge per prompt.

## Sources Consulted

- Hook sources
- ENV reference
- Timing sweeps

## Assessment

`newInfoRatio`: 0.74. Confidence high: timing deltas are large enough that minor measurement noise does not change the policy.

## Reflection

What worked: measuring one-shot and batch paths. What failed: treating subprocess timeout budget as performance target. Ruled out: one subprocess per hook invocation.

## Recommended Next Focus

KQ8: lifecycle races and orphan launcher reaping requirements.
