---
title: "Resource Map — cocoindex-main → spec_kit_memory MCP port (causal graph, memory database, automatic indexing, embedding pipeline) + MCP tool-namespace shortening from mcp__mk_spec_memory__* to mk_*"
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 59
- **By category**: READMEs=1, Documents=15, Commands=0, Agents=0, Skills=23, Specs=5, Scripts=11, Tests=0, Config=4, Meta=0
- **Missing on disk**: 27
- **Scope**: research convergence output for 013-cocoindex-memory-port-research
- **Generated**: 2026-05-13T08:28:25.304Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| external/cocoindex-main/examples/conversation_to_knowledge/README.md | Cited | MISSING | Citations=1; Iterations=1 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| external/cocoindex-main/examples/conversation_to_knowledge/design.md | Cited | MISSING | Citations=1; Iterations=1 |
| external/cocoindex-main/examples/conversation_to_knowledge/spec.md | Cited | MISSING | Citations=1; Iterations=1 |
| external/cocoindex-main/rust/core/src/engine/component.rs | Cited | MISSING | Citations=1; Iterations=1 |
| external/cocoindex-main/rust/core/src/engine/execution.rs | Cited | MISSING | Citations=2; Iterations=2 |
| external/cocoindex-main/rust/core/src/engine/live_component.rs | Cited | MISSING | Citations=1; Iterations=1 |
| external/cocoindex-main/rust/core/src/state/db_schema.rs | Cited | MISSING | Citations=2; Iterations=2 |
| external/cocoindex-main/rust/py/src/memo_fingerprint.rs | Cited | MISSING | Citations=1; Iterations=1 |
| research/iterations/iteration-001.md | Cited | MISSING | Citations=1; Iterations=1 |
| research/iterations/iteration-002.md | Cited | MISSING | Citations=1; Iterations=1 |
| research/iterations/iteration-003.md | Cited | MISSING | Citations=1; Iterations=1 |
| research/iterations/iteration-004.md | Cited | MISSING | Citations=1; Iterations=1 |
| research/iterations/iteration-005.md | Cited | MISSING | Citations=1; Iterations=1 |
| research/iterations/iteration-006.md | Cited | MISSING | Citations=1; Iterations=1 |
| research/iterations/iteration-007.md | Cited | MISSING | Citations=1; Iterations=1 |
| research/iterations/iteration-008.md | Cited | MISSING | Citations=1; Iterations=1 |

---

## 5. Skills

> `.opencode/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature_catalog/`, `manual_testing_playbook/`, `scripts/`, `shared/`, `mcp_server/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts | Cited | OK | Citations=3; Iterations=3 |
| .opencode/skills/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-alias.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts | Cited | OK | Citations=3; Iterations=3 |
| .opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts | Cited | OK | Citations=4; Iterations=4 |
| .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts | Cited | OK | Citations=3; Iterations=3 |
| .opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/skill_advisor/tools/advisor-rebuild.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/skill_advisor/tools/advisor-recommend.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/skill_advisor/tools/advisor-status.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/skill_advisor/tools/advisor-validate.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts | Cited | OK | Citations=2; Iterations=2 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/007-track-rereview/review/iterations/iteration-001.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-coco-intent-steering/description.json | Cited | OK | Citations=1; Iterations=1 |
| .opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-coco-intent-steering/graph-metadata.json | Cited | OK | Citations=1; Iterations=1 |
| .opencode/specs/system-spec-kit/027-xce-research-based-refinement/017-cocoindex-memory-port-research/description.json | Cited | OK | Citations=1; Iterations=1 |
| .opencode/specs/system-spec-kit/027-xce-research-based-refinement/017-cocoindex-memory-port-research/graph-metadata.json | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| external/cocoindex-main/examples/code_embedding/main.py | Cited | MISSING | Citations=1; Iterations=1 |
| external/cocoindex-main/examples/meeting_notes_graph_neo4j/main.py | Cited | MISSING | Citations=1; Iterations=1 |
| external/cocoindex-main/python/cocoindex/connectorkits/statediff.py | Cited | MISSING | Citations=2; Iterations=2 |
| external/cocoindex-main/python/cocoindex/connectors/postgres/_target.py | Cited | MISSING | Citations=2; Iterations=2 |
| external/cocoindex-main/python/cocoindex/connectors/qdrant/_target.py | Cited | MISSING | Citations=1; Iterations=1 |
| external/cocoindex-main/python/cocoindex/ops/entity_resolution/__init__.py | Cited | MISSING | Citations=1; Iterations=1 |
| external/cocoindex-main/python/cocoindex/ops/entity_resolution/llm_resolver.py | Cited | MISSING | Citations=1; Iterations=1 |
| external/cocoindex-main/python/cocoindex/ops/text.py | Cited | MISSING | Citations=1; Iterations=1 |
| external/cocoindex-main/python/cocoindex/query_handler.py | Cited | MISSING | Citations=1; Iterations=1 |
| external/cocoindex-main/python/cocoindex/resources/chunk.py | Cited | MISSING | Citations=1; Iterations=1 |
| external/cocoindex-main/python/cocoindex/resources/id.py | Cited | MISSING | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/mcp.json | Cited | OK | Citations=2; Iterations=2 |
| .codex/config.toml | Cited | OK | Citations=2; Iterations=2 |
| .gemini/settings.json | Cited | OK | Citations=2; Iterations=2 |
| opencode.json | Cited | OK | Citations=2; Iterations=2 |

---
