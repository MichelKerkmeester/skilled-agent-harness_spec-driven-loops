---
title: "Research: Indexer Surface Investigation"
description: "Maps consumer agents, commands, skills, and MCP surfaces to retrieval calls, indexed content type, and embedder tier for the Ollama + BGE promotion arc."
status: "draft"
date: "2026-05-18"
contextType: "research"
importance_tier: "important"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion/001-indexer-surface-investigation"
    last_updated_at: "2026-05-22T16:19:13Z"
    last_updated_by: "codex"
    recent_action: "Preserved indexer surface research after parent rename."
    next_safe_action: "Keep research packet closed; no implementation action."
    blockers: []
    key_files:
      - "research.md"
    session_dedup:
      fingerprint: "sha256:0010010010010010010010010010010010010010010010010010010010010011"
      session_id: "001-indexer-surface-investigation-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Indexer surface mapping is captured in the headline table."
---

# Research: Indexer Surface Investigation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

---

<!-- ANCHOR:headline-table -->
## Headline Table

| System | Retrieval calls used | Content type indexed | Embedder used | File evidence |
|---|---|---|---|---|
| CocoIndex / `cocoindex_code` | `mcp__cocoindex_code__search`; `ccc mcp` server | Code chunks only in current repo settings; no Markdown/default prose | CocoIndex embedder config is split: code registry/config says `sbert/nomic-ai/CodeRankEmbed`; local global user settings currently say `google/embeddinggemma-300m` | `settings.py:17-50`; `.cocoindex_code/settings.yml:20-46`; `config.py:11`; `registered_embedders.py:52-61`; `server.py:454-470`; `~/.cocoindex_code/global_settings.yml:1-3` |
| mk-spec-memory | `memory_search`, `memory_context`, `memory_match_triggers`, `memory_save`, `memory_index_scan` | Spec docs, research docs, handover/resource maps, description JSON, memory docs; excludes `z_future` and `external` | Text/document embedder cascade: Voyage `voyage-4`, OpenAI `text-embedding-3-small`, llama-cpp EmbeddingGemma GGUF, then hf-local EmbeddingGemma ONNX | `memory-tools.ts:43-59`; `spec-doc-paths.ts:7-18`; `memory-index-discovery.ts:105-113`; `index-scope.ts:188-191`; `ENV_REFERENCE.md:443-446`; `embedding-pipeline.ts:152-155` |
| mk-code-index / Code Graph | `code_graph_query`, `code_graph_context`, `code_graph_scan`, `detect_changes`; MCP namespace `mcp__mk_code_index__*` | Structural code graph: files, symbols, calls, imports, definitions | None; structural AST + SQLite, not embedding-based | `system-code-graph/SKILL.md:12-23`; `opencode.json:51-65` |
| Skill Advisor / `mk_skill_advisor` | `advisor_recommend`, `advisor_status`, `skill_graph_scan`, `skill_graph_query`; optional semantic-shadow lane | Skill metadata/graph from `.opencode/skills/*/graph-metadata.json` plus skill descriptions for embeddings | Advisor-owned skill-text embedders: default registry target `jina-embeddings-v3`; fresh installs fall back to `embeddinggemma-300m` until active pointer exists | `system-skill-advisor/SKILL.md:160-179`; `skill-graph/scan.ts:49-63`; `skill-graph-db.ts:610-628`; `registry.ts:10-28`; `schema.ts:18-21`; `semantic-shadow.ts:69-78` |
| `@context` agent | `memory_match_triggers`, `memory_context`, `memory_search`, `CocoIndex search`, `code_graph_query`, `code_graph_context` | Both: text memory/spec context plus code semantic search; structural graph when needed | mk-spec-memory text embedder for memory; CocoIndex configured embedder for semantic code; no embedder for code graph | `context.md:20-22`; `context.md:76-84`; `context.md:98-104`; `context.md:150-173`; `context.md:177-185` |
| `@deep-ai-council` | `memory_match_triggers`, `memory_context`, `memory_search`; MCP server `mk-spec-memory`; no CocoIndex server listed | Text/spec memory only for supplemental planning context | mk-spec-memory text/document embedder | `deep-ai-council.md:20-22`; `deep-ai-council.md:66`; `deep-ai-council.md:111-113` |
| `/spec_kit:deep-research` command + `@deep-research` | `memory_context`, `memory_search`, `mcp__cocoindex_code__search`, `code_graph_query`, `code_graph_context`; YAML mcp servers `mk-spec-memory`, `cocoindex_code` | Both: prior research/spec text plus semantic code examples; structural graph permitted | mk-spec-memory text embedder; CocoIndex code embedder; no embedder for code graph | `deep-research.md:4`; `deep-research.md:151`; `deep-research.md:297-303`; `spec_kit_deep-research_auto.yaml:51-58`; `spec_kit_deep-research_auto.yaml:81-89`; `agents/deep-research.md:15-16`; `agents/deep-research.md:72`; `agents/deep-research.md:161` |
| `/spec_kit:deep-review` command + `@deep-review` | `memory_context`, `memory_search`, `mcp__cocoindex_code__search`, `code_graph_query`, `code_graph_context`; YAML mcp servers `mk-spec-memory`, `cocoindex_code` | Both: prior review/spec text plus semantic code examples; structural graph permitted | mk-spec-memory text embedder; CocoIndex code embedder; no embedder for code graph | `deep-review.md:4`; `deep-review.md:344-350`; `spec_kit_deep-review_auto.yaml:40-47`; `spec_kit_deep-review_auto.yaml:69-78`; `agents/deep-review.md:15-16`; `agents/deep-review.md:239-241` |
| `@review` agent | Mostly `Read`, `Grep`, `Glob`, `Bash`; optional `memory_search` only after packet continuity is insufficient | Text memory only when no Context Package and resumed packet context matters | mk-spec-memory text/document embedder only for optional history lookup | `review.md:6-19`; `review.md:45-55`; `review.md:64-66`; `review.md:83-90` |
| `@code` agent | `Read`, `Grep`, `Glob`, `Bash`; consumes Context Package when supplied; no direct CocoIndex/code-graph contract | None directly; delegated context is external to `@code` | None directly | `code.md:6-19`; `code.md:55-60`; `code.md:72-74`; `code.md:96-105` |
| `@markdown` agent / `sk-doc` | `Read`, `Grep`, `Glob`, `Bash`, `Write/Edit`; no memory/CocoIndex/code-graph calls in agent or skill body | None directly; documentation templates and evidence files are read/written, not indexed by this agent | None directly | `markdown.md:6-19`; `markdown.md:130-159`; `sk-doc/SKILL.md:1-16`; `sk-doc/SKILL.md:57-87` |
| `@orchestrate` agent | Delegates exploration to `@context`; direct permissions deny grep/glob/bash/write/edit | None directly | None directly | `orchestrate.md:6-16`; `orchestrate.md:34-35`; `orchestrate.md:93-100` |
| Other agents: `@debug`, `@deep-agent-improvement`, `@prompt-improver` | `@debug` may use memory after packet docs; `@deep-agent-improvement` and `@prompt-improver` deny memory; no direct CocoIndex/code-graph evidence found | Mostly none; `@debug` can use mk-spec-memory text context only in fallback | None directly, except `@debug` optional mk-spec-memory text embedder | `debug.md:6-19`; `debug.md:136-138`; `deep-agent-improvement.md:6-19`; `prompt-improver.md:6-19`; `prompt-improver.md:99-101` |
| `sk-code` skill | No retrieval MCP calls in `SKILL.md`; defines code-surface routing and verification | None directly; it routes implementation standards | None directly | `sk-code/SKILL.md:12-15`; `sk-code/SKILL.md:22-33`; `sk-code/SKILL.md:71-83`; `sk-code/SKILL.md:189-195` |
<!-- /ANCHOR:headline-table -->

<!-- ANCHOR:per-system-analysis -->
## Per-System Analysis

### CocoIndex / `cocoindex_code`

CocoIndex is the semantic code-search surface. The default include list is source-code extensions only, and the comment explicitly states Markdown, MDX, TXT, and RST were removed because documentation belongs in mk-spec-memory (`settings.py:17-50`). The project-local `.cocoindex_code/settings.yml` has the same practical shape: source extensions only in `include_patterns` and explicit spec-folder excludes (`.cocoindex_code/settings.yml:14-46`). Indexing reads each source file, chunks by detected language, and stores `embedding=await embedder.embed(chunk.text)` (`indexer.py:245-302`); query-time search embeds the query with the same embedder (`query.py:579-585`).

There is a configuration ambiguity worth keeping visible. `config.py` and the registry mark `sbert/nomic-ai/CodeRankEmbed` as the production default (`config.py:11`, `registered_embedders.py:52-61`), while `server.py` auto-creates missing user settings from `default_user_settings()` (`server.py:454-470`), and this workstation's global settings currently pin `google/embeddinggemma-300m` (`~/.cocoindex_code/global_settings.yml:1-3`). That is not a content-tier mismatch by itself, but the active profile is now known: CodeRankEmbed is the default; BGE promotion is superseded.

### mk-spec-memory

mk-spec-memory is the text/spec memory surface. Its MCP tool registry includes `memory_search`, `memory_match_triggers`, `memory_save`, and embedder controls (`memory-tools.ts:43-59`), while `memory_context` is the L1 orchestration tool (`context-tools.ts:4-16`). Discovery covers canonical spec artifacts such as `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research.md`, `resource-map.md`, `handover.md`, and `description.json` (`spec-doc-paths.ts:7-18`; `memory-index-discovery.ts:105-113`). Memory scope excludes `z_future` and `external`, while archived and iteration artifacts remain indexed with scoring decay (`index-scope.ts:188-191`; `mcp_server/lib/utils/README.md:108-124`).

The embedder tier is text/document oriented. The save pipeline builds weighted document text and calls `generateDocumentEmbedding()` (`embedding-pipeline.ts:152-155`), and the provider selection cascade chooses Voyage, OpenAI, llama-cpp EmbeddingGemma, then hf-local EmbeddingGemma unless overridden (`ENV_REFERENCE.md:443-446`).

### mk-code-index / Code Graph

Code Graph is not an embedder consumer. It is the structural side: AST-derived files, symbols, calls, imports, and definitions, backed by SQLite and exposed through `code_graph_*` tools (`system-code-graph/SKILL.md:12-23`). The OpenCode MCP config registers `mk_code_index` and its tool namespace with code-graph scan/query/status/context tools, and its default `.opencode` index flags are false for end-user safety (`opencode.json:51-65`). This is correctly out of scope for BGE/Ollama embedding promotion except where callers combine graph traversal with CocoIndex seeds.

### Skill Advisor / `mk_skill_advisor`

Skill Advisor has its own graph and embedding lane. The skill contract says the standalone `mk_skill_advisor` server owns `advisor_*` and `skill_graph_*` public tools, with its own package-local database rather than mk-spec-memory (`system-skill-advisor/SKILL.md:160-179`). `skill_graph_scan` indexes skill metadata and refreshes skill embeddings (`skill-graph/scan.ts:49-63`); the indexer discovers graph metadata files and stores skill nodes/edges in `skill-graph.sqlite` (`skill-graph-db.ts:610-730`).

The embedding content is skill text, specifically skill descriptions: refresh reads the skill description, hashes it, embeds it as `inputType: "document"`, and upserts vectors into the active dimension table (`skill-graph-db.ts:793-918`). The active registry default is `jina-embeddings-v3`, but the fresh-install fallback pointer is `embeddinggemma-300m` (`registry.ts:10-28`; `schema.ts:18-21`). This is a separate text-embedder surface from both CocoIndex and mk-spec-memory.

### `@context`

`@context` is the only live agent that explicitly connects all three retrieval tiers. Its frontmatter lists both `mk-spec-memory` and `cocoindex_code` (`context.md:20-22`), and its routing table sends prior work to packet docs plus memory tools, semantic concept discovery to CocoIndex, and structural questions to code graph (`context.md:76-84`; `context.md:98-104`). Its default sequence combines continuity reads, memory triggers/context/search, code-graph status/query/context, CocoIndex, Grep/Glob, and Read (`context.md:150-173`). This agent is the clearest "both text and code" consumer.

### `@deep-ai-council`

`@deep-ai-council` is text-memory only for retrieval. Its MCP server list includes `mk-spec-memory` and `sequential_thinking`, not `cocoindex_code` (`deep-ai-council.md:20-22`). Its prepare step says to use `memory_match_triggers`, `memory_context`, or `memory_search` only when packet continuity does not answer the planning question (`deep-ai-council.md:66`), and its tool table lists those memory tools (`deep-ai-council.md:111-113`). There is no direct code embedder exposure here.

### `/spec_kit:deep-research` and `@deep-research`

Deep research is a mixed consumer. The command allows `memory_context`, `memory_search`, `mcp__cocoindex_code__search`, `code_graph_query`, and `code_graph_context` (`deep-research.md:4`). Its memory integration loads prior research with `memory_context` and then bootstraps code context via CocoIndex (`deep-research.md:297-303`). The auto YAML confirms startup `memory_context` plus `mcp_servers: [mk-spec-memory, cocoindex_code]` and a tool list containing `mcp__cocoindex_code__search` (`spec_kit_deep-research_auto.yaml:51-58`; `spec_kit_deep-research_auto.yaml:81-89`). The agent itself permits code graph calls and names `memory_search` among research actions (`agents/deep-research.md:15-16`; `agents/deep-research.md:72`; `agents/deep-research.md:161`).

### `/spec_kit:deep-review` and `@deep-review`

Deep review is also a mixed consumer. The command allows memory, CocoIndex, and code graph tools (`deep-review.md:4`). It loads prior review context from `memory_context`, then uses CocoIndex to find relevant code examples before starting review (`deep-review.md:344-350`). The auto YAML again binds startup `memory_context` and exposes `mk-spec-memory` plus `cocoindex_code` (`spec_kit_deep-review_auto.yaml:40-47`; `spec_kit_deep-review_auto.yaml:69-78`). The agent explicitly permits `code_graph_query` and `code_graph_context`, and lists memory, code graph, and CocoIndex as MCP/code intelligence tools (`agents/deep-review.md:15-16`; `agents/deep-review.md:239-241`).

### Read-Only and Writer Agents

`@review` is mostly exact-search and file-read based. It only widens to `memory_search` if no Context Package is provided and packet continuity is insufficient (`review.md:64-66`), and its tool table lists Grep, Glob, Read, and Bash rather than CocoIndex or code graph (`review.md:83-90`). `@code` likewise relies on provided Context Packages and direct file/CLI tools; it has no direct CocoIndex/code-graph contract (`code.md:72-74`; `code.md:96-105`). `@markdown` and `sk-doc` are documentation authoring/quality surfaces with templates and validation, not retrieval-index consumers (`markdown.md:130-159`; `sk-doc/SKILL.md:57-87`). `@orchestrate` delegates exploration to `@context` and has no direct retrieval tools (`orchestrate.md:93-100`).

`@debug` can use memory only after packet docs if no Context Package exists (`debug.md:136-138`), while `@deep-agent-improvement` and `@prompt-improver` deny memory in frontmatter (`deep-agent-improvement.md:6-19`; `prompt-improver.md:6-19`). These are not direct embedder-promotion consumers.
<!-- /ANCHOR:per-system-analysis -->

<!-- ANCHOR:mismatches -->
## Mismatches

1. **No confirmed code/text tier mismatch in the primary runtime routing.** CocoIndex indexes code-only content in the current defaults and project settings (`settings.py:44-50`; `.cocoindex_code/settings.yml:20-46`). mk-spec-memory indexes spec/memory text (`spec-doc-paths.ts:7-18`; `memory-index-discovery.ts:105-113`). Code Graph is structural and has no embedder (`system-code-graph/SKILL.md:16-23`).

2. **CocoIndex active-default ambiguity needs cleanup before promotion.** The code registry/config says `CodeRankEmbed` is default (`config.py:11`; `registered_embedders.py:52-61`), but the MCP server creates default user settings through `default_user_settings()` (`server.py:454-470`), and the local global user profile currently uses `google/embeddinggemma-300m` (`~/.cocoindex_code/global_settings.yml:1-3`). The project spec expects BGE confirmation against the code tier, so 016/007/003 should verify the effective embedder with `ccc` status/config before judging promotion results.

3. **Skill Advisor is a separate text-embedding consumer, not mk-spec-memory.** It embeds skill descriptions for semantic-shadow routing (`skill-graph-db.ts:895-918`) with its own registry (`registry.ts:10-28`). That means newer text-embedder survey work should consider both mk-spec-memory and Skill Advisor if the goal is all text retrieval surfaces, not only memory search.

4. **Mixed consumers do not imply one shared embedder.** `@context`, deep-research, and deep-review call both memory and CocoIndex, but the calls route to separate stores and embedders (`context.md:76-84`; `deep-research.md:297-303`; `deep-review.md:344-350`). A CocoIndex code-embedder promotion will affect their semantic code discovery, not their prior-work/spec-memory retrieval.
<!-- /ANCHOR:mismatches -->

<!-- ANCHOR:sub-phase-implications -->
## Sub-Phase Implications

### 016/007/002 Ollama Adapter Scope

Keep the Ollama adapter implementation scoped to CocoIndex unless a later packet explicitly targets Skill Advisor. The investigation confirms CocoIndex is the code-search surface, and deep-research/deep-review/context reach code semantics through `mcp__cocoindex_code__search`. mk-spec-memory already has a text-provider cascade and should not be bundled into the CocoIndex adapter work.

One caveat: Skill Advisor already has an Ollama-backed text embedder registry with `jina-embeddings-v3` and other text candidates (`registry.ts:21-63`). Do not conflate that with CocoIndex's missing Ollama adapter. If 002 needs reusable patterns, inspect Skill Advisor's adapter only as reference, not as a shared runtime dependency.

### 016/007/004 Newer Text Embedders Survey Scope

The text survey should cover mk-spec-memory first because it is the broad prior-work/spec-memory path used by the global gates, council, context, deep-research, and deep-review. It should also record Skill Advisor as a separate text-embedding surface because advisor routing embeds skill descriptions, and its registry already names `jina-embeddings-v3` as the default parity target.

Do not include CocoIndex code benchmarks in 004. CocoIndex's current content is code chunks, and the code-tier confirmation belongs to 003. Also do not include Code Graph in any embedder survey; it is structural-only.
<!-- /ANCHOR:sub-phase-implications -->

<!-- ANCHOR:commit-handoff -->
## Commit Handoff

Main agent should stage:

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion/001-indexer-surface-investigation/research.md`
<!-- /ANCHOR:commit-handoff -->


Dispatch A correction: research output exists and this packet is complete; graph metadata should no longer derive draft/planned.
