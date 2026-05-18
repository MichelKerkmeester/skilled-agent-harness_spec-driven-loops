---
title: "Spec: 016/013/001 Indexer Surface Investigation"
description: "Map each retrieval/dispatch system (CocoIndex, mk-spec-memory, code-graph, AI council, deep-research, deep-review, sk-doc, skill-advisor) to its indexer + content type (code / text / both / none). Read-only research packet producing a single research.md table + per-system evidence."
trigger_phrases:
  - "016/013/001 indexer investigation"
  - "what does AI council index"
  - "deep loop indexer surface"
  - "system to embedder mapping"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 016/013/001 Indexer Surface Investigation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Planned (2026-05-18) |
| Type | Research-only (no code changes) |
| Owner | Main agent or @context agent |
| Parent | `../spec.md` (013-ollama-and-bge-promotion-arc) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Embedder swaps in CocoIndex don't directly affect AI council / deep-research / deep-review unless those systems retrieve from CocoIndex. We need to know **which system retrieves from which indexer** before any default-promotion decision.

Current partial knowledge (to verify):
- **CocoIndex** indexes code: ~30 source-code extensions (settings.py:18-49). Excludes `.md` by design (014-local-embeddings-setup-a / 010-cocoindex-code-only-patterns).
- **Code Graph** is structural-only — no embeddings, no embedder. (Verified.)
- **mk-spec-memory** has its own embedder registry (`lib/embedders/`) and indexes... what exactly? Markdown specs? Memory records? Both?
- **AI Council** (`deep-ai-council.md`): mcpServers lists `mk-spec-memory` + `sequential_thinking`. So it queries mk-spec-memory. Does it also query CocoIndex?
- **deep-research, deep-review**: unknown.
- **sk-doc, skill-advisor**: unknown.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- Read each consumer system's agent definition / command YAML / skill SKILL.md / MCP server config.
- Identify MCP tool calls or library imports that route to an indexer (CocoIndex `search` tool, mk-spec-memory `memory_search` / `memory_context` tools, code-graph `code_graph_query` / `code_graph_context`).
- Record findings in `research.md` as a table with columns: System | Retrieval calls | Content indexed | Embedder used.
- Identify any system using a code embedder for text content or vice-versa (mismatch hints).

Out of scope:
- Any code changes.
- Deep-dive into individual handler internals — only the retrieval-call layer.
- Performance measurement.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | `research.md` table covers at minimum: CocoIndex, mk-spec-memory, code-graph, deep-ai-council, deep-research, deep-review, sk-doc, skill-advisor, sk-code. |
| R2 | For each system, cite at least one file path + line number as evidence (e.g., `deep-ai-council.md:19 → mcpServers: mk-spec-memory`). |
| R3 | Output a "Mismatches" section flagging any system using a wrong-tier embedder for its content (e.g., code embedder on text content). |
| R4 | Output a "Sub-phase implications" section feeding back into 002 / 003 / 004 of this arc. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:approach -->
## 5. APPROACH

1. Read `.opencode/agents/*.md` for each consumer agent (council, research, review, code, debug, context, sk-doc, skill-advisor mentions). Extract `mcpServers:` and tool-use patterns.
2. Read `.opencode/commands/spec_kit/*.md` (and assets/) for deep-research and deep-review command workflows.
3. Grep for `memory_search`, `memory_context`, `code_graph_query`, `code_graph_context`, `cocoindex` / `ccc search` invocations.
4. Read mk-spec-memory's indexer scope (`lib/utils/index-scope.ts` — already saw `EXCLUDED_FOR_MEMORY` and `EXCLUDED_FOR_CODE_GRAPH`).
5. Read CocoIndex's `settings.py` INCLUDED_PATTERNS (already saw — code only).
6. Compile a single mapping table.
<!-- /ANCHOR:approach -->

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- Research.md exists with a complete mapping table + mismatches section + sub-phase implications.
- All claims backed by file:line evidence.
- Strict-validate PASSES.
- 002 / 003 / 004 scopes can be refined based on findings without further investigation.
<!-- /ANCHOR:success-criteria -->
