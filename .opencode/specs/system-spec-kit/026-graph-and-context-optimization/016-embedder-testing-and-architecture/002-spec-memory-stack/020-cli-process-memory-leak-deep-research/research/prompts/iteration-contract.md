# Deep Research Iteration Contract

You are executing exactly one `/spec_kit:deep-research` iteration for the packet below.

Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/020-cli-process-memory-leak-deep-research`

Research root: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/020-cli-process-memory-leak-deep-research/research`

Target path: `.opencode/skills/system-spec-kit`

Related paths in scope: `.opencode/commands/spec_kit`, `.opencode/skills/cli-claude-code`, `.opencode/skills/cli-codex`, `.opencode/skills/cli-devin`, `.opencode/skills/cli-opencode`, `.opencode/skills/cli-gemini`, `.opencode/skills/deep-research`, `.opencode/agents/deep-research.md`.

Hard rules:

- Execute exactly one iteration.
- Do not ask questions.
- Do not dispatch sub-agents.
- Do not launch nested `claude`, `codex`, `opencode`, `devin`, or `gemini` processes.
- Do not implement fixes.
- Do not inspect or print secrets, env vars, API keys, OAuth tokens, or auth files.
- Write only inside the research root.
- Preserve existing JSONL lines. Append one line only to `deep-research-state.jsonl`.
- Create exactly one markdown file at `research/iterations/iteration-NNN.md`.
- Create exactly one delta file at `research/deltas/iter-NNN.jsonl`.
- Every finding must cite `[SOURCE: path:line]` or `[INFERENCE: ...]`.

Before writing, read:

- `research/deep-research-config.json`
- `research/deep-research-state.jsonl`
- `research/deep-research-strategy.md`
- this iteration prompt

Iteration markdown format:

```markdown
# Iteration NNN: <focus>

## Focus
<what this iteration investigated>

## Findings
1. <finding> [SOURCE: path:line]
2. <finding> [SOURCE: path:line]

## Ruled Out
<approaches tried that did not yield useful evidence>

## Dead Ends
<paths eliminated>

## Edge Cases
- Ambiguous input: <none or details>
- Contradictory evidence: <none or details>
- Missing dependencies: <none or details>
- Partial success: <none or details>

## Sources Consulted
- `path:line-line`

## Assessment
- New information ratio: <0.0-1.0>
- Questions addressed: <list>
- Questions answered: <list>

## Reflection
- What worked and why: <text>
- What did not work and why: <text>
- What I would do differently: <text>

## Recommended Next Focus
<next focus>
```

JSONL record format for both state append and delta file:

```json
{"type":"iteration","iteration":N,"run":N,"mode":"research","status":"complete","focus":"<focus>","findingsCount":0,"newInfoRatio":0.0,"noveltyJustification":"<one sentence>","keyQuestions":["..."],"answeredQuestions":["..."],"ruledOut":[],"toolsUsed":["Read","Grep","Glob"],"sourcesQueried":["path:line"],"executor":{"kind":"<executor>","model":"<model>","reasoningEffort":"<effort>","serviceTier":"<tier-or-null>"},"timestamp":"<ISO-8601>","durationMs":0}
```

Status values: `complete`, `timeout`, `error`, `stuck`, `insight`, `thought`.

If you cannot complete enough research, still write the iteration file and JSONL record with an honest status and evidence of what blocked you.
