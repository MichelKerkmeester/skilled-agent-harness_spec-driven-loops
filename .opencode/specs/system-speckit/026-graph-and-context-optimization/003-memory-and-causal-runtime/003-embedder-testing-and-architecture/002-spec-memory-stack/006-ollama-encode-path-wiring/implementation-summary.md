---
title: "Summary: 016/002/006 Ollama encode-path wiring"
description: "Shared embeddings factory now routes active Ollama/Jina query encoding through Ollama instead of loading llama-cpp EmbeddingGemma."
trigger_phrases:
  - "016/006 summary"
  - "ollama encode path summary"
  - "jina query encode fixed"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/006-ollama-encode-path-wiring"
    last_updated_at: "2026-05-18T19:15:12Z"
    last_updated_by: "codex"
    recent_action: "Verified shared Ollama encode path"
    next_safe_action: "Main agent can commit and operator can restart daemon"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/factory.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/providers/ollama.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/profile.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedder-ollama.vitest.ts"
      - ".opencode/skills/system-spec-kit/references/memory/embedder_architecture.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-006-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Summary: 016/002/006 Ollama encode-path wiring

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| Status | Implemented and verified |
| Branch | main |
| Strategy | A: shared `OllamaProvider` in factory |
| Primary outcome | Active Jina v3 query encoding now resolves to Ollama and returns 1024-dim vectors |

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT
- Added `shared/embeddings/providers/ollama.ts`, an `IEmbeddingProvider` implementation for Ollama `/api/tags`, `/api/embed`, and legacy `/api/embeddings`.
- Added `ollama` to shared factory provider validation, dimensions, startup profile, provider creation, and fallback handling.
- Added active `vec_metadata` detection: if `active_embedder_name` is an Ollama manifest and `vec_<active_dim>` exists with rows, auto mode selects `ollama`.
- Added dim mismatch protection: missing, empty, or manifest-mismatched active dim tables log a warning and continue to EmbeddingGemma-capable fallback.
- Added factory regression coverage to `mcp_server/tests/embedder-ollama.vitest.ts`.
- Added `references/memory/embedder_architecture.md` and refreshed provider README/SKILL routing notes.
- Regenerated `shared/dist` via the package build.

<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED
The change keeps `mcp_server/lib/providers/embeddings.ts` as a thin shared facade. Query callers do not need to change; they continue calling `generateEmbedding()`, `generateDocumentEmbedding()`, or `generateQueryEmbedding()`.

The shared factory now decides whether the active DB points at an Ollama-backed embedder. This mirrors the re-index path's registry/adapter behavior without importing MCP server code into `shared`.

<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS
- Strategy A was chosen because the shared factory is the canonical search-side encode path.
- The shared provider duplicates the Ollama manifest rows instead of importing `mcp_server/lib/embedders/registry.ts`, preserving package direction.
- `MEMORY_DB_PATH` and `SPEC_KIT_DB_DIR` are treated as explicit active-pointer boundaries before scanning the default package database directory.
- Explicit provider env still wins. Auto mode consults active Ollama metadata before cloud/local cascade.
- Daemon restart is intentionally left to the operator; no running process was touched.

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION
| Check | Result |
|-------|--------|
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck` | Pass |
| `npx vitest --run embedder-ollama` | Pass, 16 tests |
| `npm --prefix .opencode/skills/system-spec-kit run build` | Pass |
| Live compiled-dist explicit probe | `dim: 1024 provider: OllamaProvider` |
| Live compiled-dist auto probe | `provider: ollama reason: vec_metadata active_embedder_name=jina-embeddings-v3 (1024-dim)` |

<!-- /ANCHOR:verification -->

## Commit Handoff
```bash
git add \
  .opencode/skills/system-spec-kit/shared/embeddings/factory.ts \
  .opencode/skills/system-spec-kit/shared/embeddings/providers/ollama.ts \
  .opencode/skills/system-spec-kit/shared/embeddings/profile.ts \
  .opencode/skills/system-spec-kit/mcp_server/tests/embedder-ollama.vitest.ts \
  .opencode/skills/system-spec-kit/references/memory/embedder_architecture.md \
  .opencode/skills/system-spec-kit/references/memory/embedding_resilience.md \
  .opencode/skills/system-spec-kit/shared/embeddings/providers/README.md \
  .opencode/skills/system-spec-kit/SKILL.md \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/006-ollama-encode-path-wiring/
```

The build also regenerated `shared/dist/embeddings/` on disk. That tree is ignored in this checkout; use `git add -f .opencode/skills/system-spec-kit/shared/dist/embeddings/` only if the main commit policy requires checked-in dist artifacts.

Commit subject:

```text
feat(016/002/006): wire OllamaAdapter into shared/embeddings factory - closes the half-migration
```

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS
- `embedder_status` still reports re-index job state, not active shared-provider metadata. That handler was outside the frozen source scope for this packet.
- Live RSS reduction requires restarting the existing `context-server.js` process so it loads the new compiled dist and drops old llama-cpp state.
- Shared and MCP registry manifest rows must stay symmetric until a package-safe shared manifest source exists.

<!-- /ANCHOR:limitations -->
