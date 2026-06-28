# Iteration 005: System Code Graph Fit

## Focus

Evaluate Headroom against code-graph readiness, structural outputs, and graph context payloads.

## Evidence

- System Code Graph is structural AST indexing with SQLite-backed graph storage and MCP-facing code intelligence. [SOURCE: .opencode/skills/system-code-graph/SKILL.md:10]
- The code-graph glossary distinguishes structural indexing from semantic search and says read paths refuse non-fresh states. [SOURCE: .opencode/skills/system-code-graph/SKILL.md:20]
- The routing model uses `code_graph_classify_query_intent`, then structural, semantic, or hybrid paths. [SOURCE: .opencode/skills/system-code-graph/SKILL.md:57]
- Code-graph read tools are `code_graph_query`, `code_graph_context`, and `detect_changes`; all are readiness-gated. [SOURCE: .opencode/skills/system-code-graph/references/runtime/tool_surface.md:40]
- `code_graph_context` builds compact graph neighborhoods and returns `blocked` with `requiredAction:"code_graph_scan"` unless readiness is fresh. [SOURCE: .opencode/skills/system-code-graph/references/runtime/tool_surface.md:62]
- Readiness evaluates graph emptiness, scope fingerprint, Git HEAD drift, mtime staleness, manifest drift, and deleted tracked files. [SOURCE: .opencode/skills/system-code-graph/references/readiness/code_graph_readiness_check.md:42]
- Readiness diagnostics include canonical readiness and trust state. [SOURCE: .opencode/skills/system-code-graph/references/readiness/code_graph_readiness_check.md:104]
- SmartCrusher can be schema-preserving for arrays and supports a strict `lossless_only` mode that avoids CCR markers and keeps content byte-recoverable. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/smart_crusher.py:156]

## Findings

System Code Graph already solves a compression-adjacent problem with domain-specific compact neighborhoods and token budgets. Headroom should not sit inside structural graph storage, diff parsing, readiness diagnostics, or blocked payloads.

Potential fit:

- Compress only large natural-language presentation surfaces after graph tools return, when the caller is assembling a long prompt.
- Consider strict lossless modes for non-authoritative copied JSON arrays, never for source-of-truth graph DB state.

New information ratio: 0.62.

## Dead Ends / Ruled Out

- Compressing unified diffs before `detect_changes` is ruled out; line-range overlap depends on exact text.
- Compressing readiness diagnostics is ruled out; blocked payloads are safety signals.
