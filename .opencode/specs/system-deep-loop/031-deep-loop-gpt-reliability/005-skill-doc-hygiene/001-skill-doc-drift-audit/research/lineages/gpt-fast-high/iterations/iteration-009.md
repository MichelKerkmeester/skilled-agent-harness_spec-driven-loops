# Iteration 9: Negative Sweep of Top-Level and Neutral Candidate Docs

## Focus

Check whether broad top-level docs or neutral deep-loop rosters contain 031-caused stale claims.

## Findings

1. `AGENTS.md` mentions `/deep:ai-council` and `ai-council/**` artifacts, but does not claim direct top-level `--agent ai-council` reachability or `mode: all`; no phase 010 contradiction found. [SOURCE: AGENTS.md:453]
2. Root `README.md` says `@ai-council` runs seats and `/deep:ai-council` handles multi-topic sessions. That is not stale by itself because phase 010 preserved Task-dispatch reachability to the `@ai-council` subagent. [SOURCE: README.md:850] [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/010-ai-council-subagent-only/implementation-summary.md:60-61]
3. Root `README.md` line 920 says native agent names include `@ai-council` and commands are unchanged; that matches `mode-registry.json` agent `ai-council` and is not a stale direct-invocation claim. [SOURCE: README.md:920] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:66-72]

## Sources Consulted

- `AGENTS.md`
- `README.md`
- `.opencode/skills/deep-loop-workflows/mode-registry.json`
- `010-ai-council-subagent-only/implementation-summary.md`

## Assessment

- newInfoRatio: 0.35
- Novelty: mostly negative knowledge and confirmation.
- Confidence: high for no top-level stale finding in checked lines.

## Reflection

- Worked: separating `@ai-council` as a Task subagent from direct `--agent ai-council` avoided false positives.
- Failed: broad grep output was noisy; only exact direct-invocation/mirror/plugin claims were reliable.
- Ruled out: neutral `ai-council` roster/artifact references are not stale.

## Recommended Next Focus

Deduplicate findings into final clusters and produce the synthesis.
