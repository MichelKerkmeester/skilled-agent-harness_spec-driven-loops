---
title: "Plan: 016/002/007 Auto-Embedder Selection + llama-cpp Purge"
description: "5-phase implementation plan for the auto-selection precedence chain and llama-cpp surface purge"
trigger_phrases: ["016/002/007 plan","auto embedder selection plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/007-auto-embedder-selection-and-llama-cpp-purge"
    last_updated_at: "2026-05-18T19:46:36Z"
    last_updated_by: "main_agent"
    recent_action: "Authored plan for codex dispatch"
    next_safe_action: "Execute Phase 1 — codex investigates current llama-cpp surface"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002007"
      session_id: "016-002-007-plan"
      parent_session_id: "016-002-007"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 016/002/007 Auto-Embedder Selection + llama-cpp Purge

<!-- ANCHOR:summary -->
## 1. SUMMARY

Five-phase plan: investigate the current llama-cpp surface, implement the precedence-chain auto-selector, purge the llama-cpp code path, update tests + docs, smoke-verify end-to-end. Codex executes; main agent commits on handoff.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria |
|---|---|
| Investigation completeness | All llama-cpp call sites enumerated before purge |
| Code change atomicity | Source + dist + tests + docs land coherent in one commit |
| Test coverage | New vitest exercises all 4 precedence branches |
| Smoke verification | Fresh-DB daemon → active = jina-v3 (Ollama-resident on this machine) |
| Strict-validate | PASSED on the packet folder |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

New `autoSelectActiveEmbedder()` function in `shared/embeddings/auto-select.ts` (or inline in factory.ts) implementing the 4-step precedence chain. Called from `getActiveEmbedder()` in `schema.ts` when `vec_metadata` is empty. Result is persisted to `vec_metadata.active_embedder_name + dim + provider` so subsequent starts honor it.

Purge surface: `LlamaCppProvider` (in factory.ts), `llama-cpp-availability.ts` (probe helper), `embeddinggemma-300m` manifest entry, `node-llama-cpp` package dep, the legacy `__llama-cpp__embeddinggemma__768.sqlite` DB.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: SETUP — Investigate llama-cpp surface
- `git grep -l 'llama-cpp\|node-llama-cpp\|embeddinggemma\|LlamaCppProvider'` across the workspace
- Catalogue every call site, import, test, doc, dist artifact, on-disk DB
- Document findings in `scratch/llama-cpp-surface-inventory.md`

### Phase 2: IMPLEMENTATION — Auto-selection
- Add `shared/embeddings/auto-select.ts` with the precedence chain
- Wire into `getActiveEmbedder()` in `schema.ts` to invoke on empty vec_metadata
- Persist result back to vec_metadata
- Handle write-race via filesystem lock (mirror launcher PID-lease pattern)

### Phase 3: IMPLEMENTATION — llama-cpp purge
- Remove `LlamaCppProvider` from factory.ts (delete branch + SUPPORTED_PROVIDERS entry)
- Delete `shared/embeddings/llama-cpp-availability.ts`
- Remove `node-llama-cpp` from package.json
- Remove `embeddinggemma-300m` from manifest registry
- Update DEFAULT_ACTIVE_EMBEDDER to a sentinel
- Document the path to the 750 MB legacy DB for operator-confirmed deletion (codex does NOT delete; main agent or operator does)

### Phase 4: TESTS + DOCS
- New `embedder-auto-selection.vitest.ts` covering 4 branches + fail-fast case
- Update `embedder-ollama.vitest.ts` + any tests with embeddinggemma assumptions
- Update `references/memory/embedder_architecture.md` with the precedence chain
- Update `INSTALL_GUIDE.md` Troubleshooting + Quickstart
- Update CHANGELOG with the purge + migration note

### Phase 5: VERIFICATION
- npm typecheck + vitest --run
- strict-validate on packet folder
- Live smoke: kill daemon, clear vec_metadata, restart, observe auto-select picks jina-v3
- Emit Commit Handoff with exact `git add` path list
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | What it verifies |
|---|---|
| `embedder-auto-selection.vitest.ts` | All 4 precedence branches resolve correctly + fail-fast on no-backend |
| Existing tests | No regression on Ollama / OpenAI / Voyage / hf-local providers |
| Live integration | Fresh-DB bootstrap selects jina-v3 on this machine |
| Strict-validate | Spec-folder convention compliance |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `016/002/006` (just shipped — provides the OllamaProvider that this packet builds on)
- `shared/embeddings/factory.ts` + `providers/ollama.ts`
- `mcp_server/lib/embedders/schema.ts` + `registry.ts`
- ADR-012 (embedder priority order)
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If the new auto-selection causes a daemon startup regression:
1. `git revert` the packet's commit — restores LlamaCppProvider + embeddinggemma default
2. Restore the legacy DB from backup (operators who hadn't yet `rm`'d it — most safe path)
3. Re-pull `node-llama-cpp` dep + rebuild dist
4. If operator already deleted the legacy DB, run `embedder_set('embeddinggemma-300m')` manually to bootstrap a new gemma DB

Rollback is reversible up until the legacy-DB delete step (which is gated on operator confirmation, not part of the commit).
<!-- /ANCHOR:rollback -->
