---
title: "Plan: 016/002/006 Ollama encode-path wiring"
description: "Implementation plan for routing shared query/document encoding through Ollama when vec_metadata activates an Ollama manifest."
trigger_phrases: ["016/006 plan", "ollama encode path plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/006-ollama-encode-path-wiring"
    last_updated_at: "2026-05-18T19:15:12Z"
    last_updated_by: "codex"
    recent_action: "Planned Strategy A provider integration"
    next_safe_action: "Run strict validation and hand off commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/factory.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/providers/ollama.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-006-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Plan: 016/002/006 Ollama encode-path wiring

<!-- ANCHOR:summary -->
## 1. SUMMARY
Use Strategy A: add `OllamaProvider` to the shared embeddings factory. This keeps `mcp_server/lib/providers/embeddings.ts` as the stable facade and avoids changing every query caller.

<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck`
- `npx vitest --run embedder-ollama`
- Live one-shot compiled-dist probe against Ollama on `127.0.0.1:11434`
- `npm --prefix .opencode/skills/system-spec-kit run build`
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <006 path> --strict`

<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Affected surfaces:

| Surface | Change |
|---------|--------|
| `shared/embeddings/providers/ollama.ts` | New `IEmbeddingProvider` implementation for Ollama `/api/tags`, `/api/embed`, and legacy `/api/embeddings` fallback |
| `shared/embeddings/factory.ts` | Add `ollama` provider, dimensions, active metadata detection, validation, profile config, and fallback handling |
| `shared/embeddings/profile.ts` | Add explicit `ollama` profile support for database-profile metadata |
| `mcp_server/tests/embedder-ollama.vitest.ts` | Add shared factory regression coverage |
| `references/memory/embedder_architecture.md` | Document dual encode/index paths and operator runbook |

Selection flow:
1. Explicit `EMBEDDINGS_PROVIDER` still wins.
2. Auto mode checks `vec_metadata.active_embedder_name` and `active_embedder_dim`.
3. If the active name is an Ollama manifest and `vec_<dim>` exists with rows, choose `ollama`.
4. If the active dim table is missing or empty, warn and continue to the existing cloud/local cascade.

<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Read factory, provider, registry, profile, callers, and llama-cpp availability.
2. Implement shared `OllamaProvider` and factory/profile wiring.
3. Add regression tests for explicit Ollama, active pointer auto-selection, and missing table fallback.
4. Build generated dist outputs.
5. Run typecheck, targeted vitests, live probe, and spec validation.
6. Update architecture docs and commit handoff.

<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
- Unit-level fetch stubs cover `/api/tags` and `/api/embed`.
- Factory tests assert 1024-dim Jina vectors and `OllamaProvider` metadata.
- Active metadata tests create a tiny SQLite fixture with `vec_metadata` and `vec_1024`.
- Existing adapter tests ensure registry Ollama behavior stays unchanged.
- Live probe confirms the compiled dist talks to the running Ollama daemon.

<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- Running local Ollama at `OLLAMA_BASE_URL` or `http://127.0.0.1:11434`.
- Pulled model tag `hf.co/gaianet/jina-embeddings-v3-GGUF:Q4_K_M`.
- Existing populated `vec_1024` table for active Jina v3 production search.
- Existing build pipeline to refresh `shared/dist`.

<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Revert the packet files. Existing `vec_1024` data and `vec_metadata` remain recoverable; setting `EMBEDDINGS_PROVIDER=llama-cpp` or `hf-local` forces the old encode path if an emergency restart is needed.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Setup) -> Phase 2 (Implementation) -> Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Commit handoff |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | Read factory/registry/profile/callers |
| Core Implementation | Medium | Shared provider plus factory/profile wiring |
| Verification | Medium | Build, vitest, live probe, strict validation |
| **Total** | Medium | One focused implementation session |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Existing `vec_1024` data left untouched.
- [x] No running daemon restarted by this packet.
- [x] Commit handoff isolates all changed files.

### Rollback Procedure
1. Revert the packet commit.
2. Restart the spec-memory daemon.
3. Set `EMBEDDINGS_PROVIDER=llama-cpp` or `hf-local` if an immediate old-path fallback is needed.
4. Verify `generateEmbedding("test")` returns the expected fallback dimension.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Not applicable; `vec_metadata` and vector tables are preserved.

<!-- /ANCHOR:enhanced-rollback -->
