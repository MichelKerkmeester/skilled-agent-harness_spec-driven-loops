---
title: "022: Skill-advisor pluggable architecture and writer wiring (phase parent)"
description: "Skill-advisor embedder work delivered the pluggable architecture, registry, schema, and writer wiring. The active runtime remains gemma; default alignment to mk-spec-memory Nomic is deferred to 003/006-shared-embedder-logic."
trigger_phrases:
  - "022 skill advisor embedder parity"
  - "skill-advisor jina swap"
  - "skill-advisor pluggable embedder"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/007-skill-advisor-embedder-stack"
    last_updated_at: "2026-05-17T21:25:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded skill-advisor embedder parity packet"
    next_safe_action: "Implement 001 pluggable architecture"
    blockers: []
    key_files:
      - "001-pluggable-architecture/spec.md"
      - "002-jina-swap-and-reindex/spec.md"
      - "003-install-guide-docs/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000022000"
      session_id: "022-skill-advisor-embedder-parity"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-parent | v1.0 -->
<!-- SPECKIT_LEVEL: phase-parent -->

# Skill-advisor embedder stack (phase parent)

This hub also holds 3 items migrated in from elsewhere in `system-speckit/026`, all from the same May 2026 wave: `006-skill-advisor-zombie-launcher-fix`, `007-skill-advisor-compat-contract-consolidation`, and `008-skill-advisor-interface-and-env-vars`. See `system-skill-advisor/context-index.md` for the migration record.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The 020 deep-review's legacy-DB audit surfaced a gap: **skill-advisor is the only system in this repo still on gemma**.

| System | Embedder layer | Current default |
|---|---|---|
| mk-spec-memory | 016 `EmbedderAdapter` + `MANIFESTS` + `vec_metadata` pointer | jina-embeddings-v3 (per ADR-012) |
| CocoIndex | 019 `registered_embedders.py` + `_resolve_device` MPS auto-detect | sbert/jinaai/jina-embeddings-v2-base-code |
| Code Graph | (uses CocoIndex bridge) | jina-code (transparently) |
| **skill-advisor** | Pre-016 cascade via `shared/embeddings/factory.ts` symlink | **gemma** ❌ |

User directive: make skill-advisor "work with all possible embedding setups and auto-detected just like spec memory and use jina for us atm".

This packet delivered the pluggable registry, adapter interface, schema, and writer wiring needed for skill-advisor embedder parity. The production pointer flip did not land here: skill-advisor remains gemma-active, and alignment to mk-spec-memory's Nomic default is deferred to `003/006-shared-embedder-logic`.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:scope -->
## 2. SCOPE

In scope:
- TypeScript embedder adapter + registry for skill-advisor (mirroring 016 mk-spec-memory pattern, NOT the Python pattern from 019 CocoIndex)
- skill-graph.sqlite schema additions: `vec_metadata` table + dim-tagged `vec_<dim>` indexes
- Default flip from gemma → jina-embeddings-v3
- Reindex of skill-graph.sqlite with jina-v3 embeddings
- INSTALL_GUIDE + README docs (covering swap mechanism + auto-detect note)
- Operator runbook (daemon restart + reindex)

Out of scope:
- Refactoring the shared `system-spec-kit/shared/embeddings/factory.ts` cascade itself (large blast radius; defer to a separate cascade-retirement packet if needed)
- Adding skill-advisor-specific MCP tools like `skill_advisor_embedder_set` (defer — current MCP surface is read-only for advisor; embedder selection stays operator-driven via env var + daemon restart)
- Migrating the daemon's internal model cache (out of scope; daemon restart suffices)
<!-- /ANCHOR:scope -->

<!-- ANCHOR:children -->
## 3. CHILDREN

| Child | Purpose | Status |
|---|---|---|
| `001-pluggable-architecture/` | 022/001 Pluggable embedder architecture for skill-advisor | Complete |
| `002-jina-swap-and-reindex/` | 022/002 Jina-v3 swap + skill-graph reindex | Planned (blocked on 022/001) |
| `003-install-guide-docs/` | 022/003 Skill-advisor INSTALL_GUIDE + README docs | Planned (blocked on 022/001+002) |
| `004-skill-graph-db-writer-cross-wire/` | 010/004 skill-graph-db Writer Cross-Wire to EmbedderAdapter Layer | Planned (created 2026-05-18 from 010/002 discovery) |
| `006-shared-embedder-logic-with-spec-memory/` | Extract shared embedder factory/registry and align skill-advisor default with spec-memory `sbert/nomic-ai/CodeRankEmbed` | Planned |
<!-- /ANCHOR:children -->

<!-- ANCHOR:dependencies -->
## 4. DEPENDENCIES

- 016/001-003 mk-spec-memory pluggable architecture (reference + reuse via TS import where possible)
- 019/001 `registered_embedders.py` pattern (mirrored conceptually, not literally)
- skill-graph daemon (must restart to pick up swap)
- Active jina-embeddings-v3 model already pulled via Ollama (from 016/004 swap)
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:success -->
## 5. SUCCESS CRITERIA

- skill-advisor has pluggable registry, schema, and writer/read path wiring without breaking the gemma-active runtime
- Semantic-shadow lane continues to return non-empty results under the active gemma runtime
- `skill_advisor.py` recommend tool still scores skills correctly (smoke regression — top-3 picks for "memory save" / "code search" / "spec folder" stay sane)
- Operator docs distinguish writer wiring shipped from production pointer flip deferred
- All packets strict-validate PASSED
<!-- /ANCHOR:success -->
