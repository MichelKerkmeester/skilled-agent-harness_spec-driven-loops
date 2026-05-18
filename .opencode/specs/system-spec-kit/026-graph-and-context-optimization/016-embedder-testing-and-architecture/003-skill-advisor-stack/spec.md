---
title: "022: Skill-advisor embedder parity — pluggable + jina default (phase parent)"
description: "Bring skill-advisor up to the 016+019 pattern. Today skill-advisor's embedding stack is a symlink to the pre-016 shared cascade (defaults to gemma via llama-cpp.ts). User directive: pluggable like spec-memory + auto-detect Metal/CUDA/CPU + jina-v3 as current default."
trigger_phrases:
  - "022 skill advisor embedder parity"
  - "skill-advisor jina swap"
  - "skill-advisor pluggable embedder"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack"
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

# 022: Skill-advisor embedder parity (phase parent)

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

This packet brings skill-advisor up to the 016+019 pattern: pluggable registry + adapter interface + auto-detect device + jina-v3 as the production default. Three children.
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

| Child | Purpose |
|---|---|
| `001-pluggable-architecture` | Author `mcp_server/lib/embedders/` module mirroring 016 pattern: `EmbedderAdapter` interface + `MANIFESTS` registry + `OllamaAdapter` + dim-tagged `vec_<dim>` schema + `vec_metadata` pointer |
| `002-jina-swap-and-reindex` | Flip default to jina-embeddings-v3, run skill-graph reindex, smoke-test semantic-shadow lane queries |
| `003-install-guide-docs` | INSTALL_GUIDE + README updates explaining the new pluggable mechanism + swap runbook + auto-detect note |
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

- skill-advisor's `vec_metadata.active_embedder_name` reports `jina-embeddings-v3` after daemon restart
- Semantic-shadow lane queries return non-empty results post-reindex
- `skill_advisor.py` recommend tool still scores skills correctly (smoke regression — top-3 picks for "memory save" / "code search" / "spec folder" stay sane)
- Operator can swap embedders via env var + daemon restart per INSTALL_GUIDE
- All packets strict-validate PASSED
<!-- /ANCHOR:success -->
