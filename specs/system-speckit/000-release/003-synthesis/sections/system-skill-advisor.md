### Skill Advisor

- Routing is markedly more accurate: recommendations now blend semantic similarity, keyword, and graph signals through a single metadata-driven resolver shared by both scoring engines, so intent-described prompts land on the right skill and misroutes (e.g. agent-scoring queries) are fixed.
- Near-tie matches are now flagged as ambiguous instead of collapsed into one confident pick, while clearly superior recommendations are still selected decisively.
- Routing defaults are safer: `--threshold` no longer silently disables uncertainty guarding (opt into confidence-only behavior explicitly), and command bridges are deprioritized for natural-language prompts unless you use an explicit slash command.
- The warm path is roughly 25x faster thanks to in-process caching and frontmatter-only parsing, and batch mode (`--batch-file`/`--batch-stdin`) cuts subprocess overhead.
- The advisor runs as a standalone MCP server with a native TypeScript scorer and a reindexed, validated skill graph, plus a 9-command CLI whose schemas are byte-identical to the MCP tools.
- Proactive skill suggestions now surface through prompt hooks across Claude, Gemini, Copilot, Codex, and Devin runtimes, failing open quickly (with a warm-only CLI fallback) when the advisor is unavailable.
- The advisor is more resilient: it detects and reports stalled deep-loop runs, recovers from dead sockets, shares one bridge call for concurrent identical prompts, and fails closed with a stale-vector warning rather than serving untrusted matches.
- You can now see *why* a skill was recommended via `includeAttribution`'s prompt-safe `why_recommended` breakdown, and check vector-lane health on demand through `advisor_status`.
- The embedder is pluggable: pick from six options (including jina-embeddings-v3, nomic-embed-text-v1.5, and bge-m3) and swap the active one with a single operator call backed by a documented runbook.
- A new `/doctor:skill-advisor` command analyzes your skills, optimizes scoring tables, and re-indexes the graph, while skill CLI dispatches are checked against hard rules before running.
