# Deep-Research Iteration 7 — K1.6 (non-port confirmation) + K2.1 (prefix construction across runtimes)

## BINDING CONTRACT (pre-answered)

- **Gate 3**: **A) Use existing** = `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/009-cocoindex-memory-port-research/`. Do NOT ask.
- **Skill routing**: Do NOT invoke other skills. You ARE the iteration.
- **Sub-agent dispatch**: FORBIDDEN. LEAF.
- **Mode**: Direct execution. No menus, no clarification questions.

## STATE

Iteration: 7 of 10
Answered: K2.4, K1.1, K1.2, K1.3, K1.4, K1.5 (5/11 cocoindex-port + 1/11 callsite)
Remaining: **K1.6, K2.1** (this iter — bundled), K2.2, K2.3, K2.5
Stuck: 0

## FOCUS

This iteration bundles two complementary questions:

### Part A — K1.6: Confirm query intelligence is a non-port axis

**Question**: cocoindex-main is ingest/transform-focused with retrieval delegated to backends (no built-in router, intent classifier, RRF fusion, channel-based search). Our `lib/search/query-router.ts` has a 5-channel router (vector/fts/bm25/graph/degree) with entity-density routing + intent classifier. Confirm cocoindex offers nothing portable here and document the negative finding clearly so future research doesn't revisit.

**Required outputs:**
- Survey `external/cocoindex-main/python/cocoindex/` for any retrieval / query / search / router / rank / fuse modules. Cite file paths if any are found.
- Survey `external/cocoindex-main/python/cocoindex/connectors/` to confirm retrieval is per-backend (e.g., postgres pgvector queries, qdrant search).
- Document what cocoindex DOES offer that's adjacent but not query intelligence (e.g., `statediff` reconciliation is upstream of retrieval, not retrieval itself).
- Final verdict on K1.6: **NON-PORT CONFIRMED** or **PARTIAL-PORT-POSSIBLE** + justification.

### Part B — K2.1: Prefix construction mechanism across 4 runtimes

**Question**: Where does the `mcp__` prefix originate in tool names like `mcp__mk_spec_memory__memory_context`? Is it added by Claude Code runtime only, by each MCP host, or is it a cross-runtime MCP standard? How does the server-name segment (`spec_kit_memory`) get registered in each runtime?

**Investigation targets:**
1. Read `opencode.json` (project root) — how is `spec_kit_memory` registered there?
2. Search for MCP server config across runtimes:
   - Claude Code: any `.claude/` config or runtime docs in this repo?
   - OpenCode: `.opencode/` config (especially `opencode.json`)
   - Codex: `.codex/` config + `~/.codex/config.toml` (if mentioned in docs)
   - Gemini: `.gemini/` config
3. Search for "mcp__" literal across the repo: `rg -n 'mcp__' --type md --type ts --type json -l | head -20` — where does the prefix appear in our docs/code?
4. Determine the MCP standard: is `mcp__<server>__<tool>` a Claude Code naming convention or specified by the MCP protocol? Check if other runtimes use a different format (e.g., `<server>.<tool>`).
5. From our `mcp_server/tool-schemas.ts`: tools are defined WITHOUT the prefix (iter-1 confirmed). So the prefix is added externally. By what? Where?

**Required outputs:**
- Confirm origin of `mcp__` prefix.
- Confirm origin of server-name segment (registration mechanism per runtime).
- Cross-runtime compat matrix: do all 4 runtimes display tools with the same `mcp__<server>__<tool>` shape, or do they differ?

## ANALYSIS DELIVERABLE

For Part A: a clean "non-port confirmed" finding with explicit boundaries (what's NOT portable from cocoindex's retrieval surface, and what IS adjacent but distinct).

For Part B: a runtime/registration matrix:

| Runtime | Config file | How `spec_kit_memory` registered | Prefix in displayed tool names | Tool-name regex constraint |
|---------|-------------|----------------------------------|-------------------------------|----------------------------|
| Claude Code | `?` | `?` | `mcp__<server>__<tool>` | `^[a-zA-Z0-9_-]+$` (memory: feedback_*) |
| OpenCode | `opencode.json` | `?` | `?` | `?` |
| Codex | `.codex/?` | `?` | `?` | `?` |
| Gemini | `.gemini/?` | `?` | `?` | `?` |

## VERDICTS

- **K1.6**: NON-PORT CONFIRMED / PARTIAL-PORT-POSSIBLE.
- **K2.1**: Document mechanism + cross-runtime compat fully.

## CONSTRAINTS

- LEAF. Max 12 tool calls. Cite file:line.
- No special regex chars in JSONL `focus`.

## OUTPUT CONTRACT

1. `research/iterations/iteration-007.md` — Focus, Actions Taken, **Part A: K1.6 Findings + Verdict**, **Part B: K2.1 Findings + Matrix + Verdict**, Questions Answered, Questions Remaining, Next Focus.

2. JSONL appended `{"type":"iteration","iteration":7,...,"focus":"k1-6-nonport-confirm-and-k2-1-prefix-construction",...,"answeredQuestions":["K1.6","K2.1"]}`.

3. `research/deltas/iter-007.jsonl`.

Stop: 10 min wall, ≤12 tool calls.

Go.
