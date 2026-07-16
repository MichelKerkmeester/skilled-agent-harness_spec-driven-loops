# Deep-Research Iteration 7 of 10

You are cli-codex (gpt-5.5, xhigh reasoning, standard tier). Read-only research investigation. Output one iteration file at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/005-context-server-memory-reduction-research/research/iterations/iteration-007.md`.

## ROLE

Investigate how to reduce memory usage of the spec-memory MCP server (`context-server.js`) without limiting features or restricting the embedding-model choice.

## CONTEXT

- Repo root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`
- Target file: `.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js` (compiled from `src/`).
- POST-006 baseline (post-commit 75b4391e3): RSS dropped 1080 MB → 246 MB (-70%) by wiring OllamaAdapter into the encode path. Live PID is 4791 with active embedder=jina-embeddings-v3/ollama (no node-llama-cpp loaded in-process).
- Iter 1 + iter 2 (under prior 1080 MB baseline) already completed and stay in iterations/ as historical context. Iters 3-10 investigate the NEW 246 MB baseline.
- Parent: `mk-spec-memory-launcher.cjs` (PID 3176) — single-writer-lease lockstep with skill-advisor + code-graph daemons.
- Embedders in scope: Voyage (external API), node-llama-cpp (local GGUF), Ollama (local server), future BGE / mxbai-embed-large.
- Recent context: arc 006 (mcp-launcher-concurrency) just closed; embedder umbrella 016/002-spec-memory-stack is the parent track.

## NON-NEGOTIABLES

- No feature reduction (continuity save, vector search, code-graph mirror, embedder swap, hot-reload — all keep working).
- No embedding-model restriction (must remain pluggable across Voyage / llama-cpp / Ollama / future BGE / mxbai).
- Optimizations must be measurable (RSS delta in MB, ideally with a profile or back-of-envelope estimate).

## PRIOR ITERATIONS

6 prior iter files at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/005-context-server-memory-reduction-research/research/iterations/. Read them ALL first, then build on (do not duplicate).

## DIMENSION FOR THIS ITERATION

**code-graph mirror representation (in-memory vs SQLite-backed, partial loading by query scope)**

Investigate THIS dimension specifically. Other dimensions are covered by other iterations. Do NOT duplicate prior iter findings — cross-reference them.

## ACTION

1. **Read the relevant source code** in:
   - `.opencode/skills/system-spec-kit/mcp_server/src/context-server.ts` (or wherever the source is — `dist/` is compiled)
   - `.opencode/skills/system-spec-kit/mcp_server/lib/` for sub-modules
   - Any embedder integration files (Voyage, llama-cpp, Ollama)
   - SQLite schema + pragma setup
2. **Identify memory-resident structures** relevant to this iteration's dimension.
3. **Quantify** where possible (lines of code carrying state, estimated RSS contribution, model size tables).
4. **Propose specific changes** — not vague "consider X" but concrete "in file Y at line Z, replace pattern A with pattern B because…".
5. **Document trade-offs** — what does this optimization cost (cold-start latency, first-query latency, code complexity, debugging cost).

## OUTPUT FORMAT

Write a single iteration file to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/005-context-server-memory-reduction-research/research/iterations/iteration-007.md` with this structure:

```markdown
# Iteration 7 — code-graph mirror representation (in-memory vs SQLite-backed, partial loading by query scope)

## Summary

<2-3 sentence headline.>

## Findings

### Finding 1: <one-line title>
- Evidence: <file:line citation or quoted source>
- Memory impact: <estimated RSS contribution or % of total>
- Proposed change: <concrete code change>
- Trade-off: <what we give up>
- Effort: <S | M | L>

### Finding 2: ...

## Cross-references

<Mention which prior iter findings this builds on or contradicts.>

## Negative knowledge (ruled-out)

<List anything investigated but rejected; why it doesn't work.>

## Open questions

<Any sub-questions for future iters.>
```

## CONSTRAINTS

- **Read-only.** Do NOT modify any source file. The only file you create is your iteration markdown.
- **No new commit.** The main agent will commit the research artifacts.
- **xhigh reasoning** + **standard service tier** are configured in your dispatch — use them. Depth, not length.
- Be specific. "Reduce SQLite cache" is not actionable; "set `PRAGMA cache_size=-4096` (~4MB cap) on memory.sqlite — currently default 2000 pages × ~4KB ≈ 8MB" is actionable.

Begin.
