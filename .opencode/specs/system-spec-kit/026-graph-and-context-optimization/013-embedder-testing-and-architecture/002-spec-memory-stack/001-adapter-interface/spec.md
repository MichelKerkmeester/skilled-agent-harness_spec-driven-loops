---
title: "016/001: EmbedderAdapter interface + EmbedderRegistry"
description: "Phase 1 of 016 pluggable embedder architecture. Foundational types: define EmbedderAdapter interface + EmbedderRegistry lookup. Pure TypeScript design work — no runtime wiring yet."
trigger_phrases:
  - "016/001 embedder adapter interface"
  - "EmbedderAdapter typescript"
  - "EmbedderRegistry lookup"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/001-adapter-interface"
    last_updated_at: "2026-05-17T08:15:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded phase 001"
    next_safe_action: "Pick up via native Claude @code agent"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-001-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# 016/001: EmbedderAdapter interface + EmbedderRegistry

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| Level | 1 |
| Priority | P1 |
| Status | Scaffolded |
| Branch | main |
| Runtime | **Native Claude `@code` agent** (TypeScript design + iteration in same context) |


<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Define the foundational types every other phase will build on. The `EmbedderAdapter` interface abstracts backend differences (prefix tokens, dimensions, batch sizes, error formats). The `EmbedderRegistry` provides name-based lookup. Pure types + small registry — no actual inference runtime wiring in this phase.


<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `mcp_server/lib/embedders/adapter.ts` — the `EmbedderAdapter` interface
- `mcp_server/lib/embedders/registry.ts` — name → adapter factory
- `mcp_server/lib/embedders/types.ts` — supporting types (EmbedderManifest, BackendKind, etc.)
- `mcp_server/lib/embedders/index.ts` — barrel
- Initial registry entries (skeleton only, no impl yet): `embeddinggemma-300m`, `nomic-embed-text-v1.5`, `mxbai-embed-large-v1`, `bge-small-en-v1.5`, `bge-large-en-v1.5`, `jina-embeddings-v3`
- Unit tests: registry lookup, manifest validation
- TSDoc comments on the public interface

### Out of Scope
- Actual adapter implementations (phase 002)
- Schema changes (phase 002)
- MCP tools (phase 003)
- Re-index orchestrator (phase 003)
- Model swap (phase 004)


<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0
| ID | Requirement | Acceptance |
|----|-------------|-----------|
| REQ-001 | `EmbedderAdapter` interface exists with `name`, `dim`, `backend`, `prefixQuery?`, `prefixDocument?`, `embed()`, `ready()` | `tsc --noEmit` passes |
| REQ-002 | `EmbedderRegistry.get(name)` returns typed adapter or undefined | vitest covers hit/miss |
| REQ-003 | Registry has 6 skeleton entries with correct dim + backend declared | grep confirms |

### P1
| ID | Requirement | Acceptance |
|----|-------------|-----------|
| REQ-004 | Public interface has TSDoc | inspection |
| REQ-005 | `npm run build` clean | exit 0 |
| REQ-006 | strict-validate on 016/001 packet | exit 0 |


<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- Interface compiles + registry lookup tested
- Next phase (002) can implement the Ollama adapter against this interface without breaking changes


<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- Dep: mk-spec-memory `mcp_server/lib/` structure (read-only inspection)
- Risk: interface shape needs revision in 002/003 — mitigate by keeping it minimal in this phase

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Defer to phase parent (`013-embedder-testing-and-architecture/spec.md`) for orchestration-level open questions.
<!-- /ANCHOR:questions -->
