DEEP-RESEARCH

# Iteration 001: CLI Memory Leak Audit

Framework: CRISPE.

## Role
You are a deep-research LEAF agent running via cli-claude-code. You must not dispatch sub-agents, must not start nested deep-research/deep-review/council loops, and must not implement fixes.

## Research Topic
Memory leaks and process lifecycle hazards in .opencode/skills/mcp-coco-index and .opencode/skills/system-code-graph during CLI deep-flow orchestration.

## Iteration
1 of 10. Executor lane: cli-claude-code, model requested: claude-opus-4-7, effort high.

## Focus
Inventory mcp-coco-index process spawn, daemon, sidecar, local model, indexing, and cleanup surfaces.

## Required Sources
Read and cite file:line evidence from these areas when relevant:
- .opencode/skills/mcp-coco-index/
- .opencode/skills/mcp-coco-index/mcp_server/
- .opencode/skills/mcp-coco-index/SKILL.md
- .opencode/skills/mcp-coco-index/README.md
- .opencode/skills/cli-claude-code/SKILL.md
- specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/024-cli-deep-research-memory-leak-audit/spec.md

## Questions To Answer
- Which mcp-coco-index code paths start subprocesses, daemons, local model runtimes, sidecars, search helpers, or indexing jobs?
- Which paths document cleanup but do not enforce it in code?
- Which processes could survive parent CLI exit or timeout?
- Which findings are P0/P1/P2 and what follow-up remediation packet should own each?

## Output Contract
Write all three artifacts. Do not only print findings.

1. Write markdown narrative to specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/024-cli-deep-research-memory-leak-audit/research/iterations/iteration-001.md with headings: Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.
2. Append one single-line JSON object to specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/024-cli-deep-research-memory-leak-audit/research/deep-research-state.jsonl with fields: type='iteration', iteration=1, newInfoRatio, status, focus, executor, findingsCount, timestamp. Include executor={kind:'cli-claude-code',model:'claude-opus-4-7',reasoningEffort:'high',serviceTier:null}.
3. Write specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/024-cli-deep-research-memory-leak-audit/research/deltas/iter-001.jsonl. It must include the same type='iteration' record plus finding/observation/ruled_out records as JSON lines.

## Evidence Rules
- Cite concrete file paths and line numbers.
- If line numbers are unavailable after a search, cite path and symbol/function name and mark line as UNKNOWN.
- Do not claim a leak without an owner, process kind, and cleanup boundary.
- Do not modify source files outside this research packet.

## Expected Depth
Prioritize broad source coverage and high-signal findings over prose. Return only a short status in stdout after writing artifacts.
