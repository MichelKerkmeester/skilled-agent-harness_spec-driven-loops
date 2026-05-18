---
title: "Spec: 016/002/007 Auto-Embedder Selection + llama-cpp Purge"
description: "Replace the hardcoded embeddinggemma-300m default with a smart precedence-chain auto-selection at bootstrap. Probe environment in order — Voyage API key → OpenAI API key → Ollama daemon+jina-v3 → hf-local — and persist the choice to vec_metadata. Purge all llama-cpp / embeddinggemma in-process loader code (Metal GGUF, node-llama-cpp deps, the 750 MB legacy DB), replacing the legacy fallback path. Ollama becomes the always-available local fallback when cloud APIs aren't configured."
trigger_phrases:
  - "016/002/007 auto embedder selection"
  - "llama-cpp purge"
  - "smart embedder precedence chain"
  - "auto-select bootstrap"
  - "voyage openai ollama hf-local fallback"
  - "embeddinggemma removal"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/007-auto-embedder-selection-and-llama-cpp-purge"
    last_updated_at: "2026-05-18T19:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded packet for cli-codex gpt-5.5 xhigh fast dispatch"
    next_safe_action: "Dispatch cli-codex to implement; main agent commits on handoff"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002007"
      session_id: "016-002-007"
      parent_session_id: null
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 016/002/007 Auto-Embedder Selection + llama-cpp Purge

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Planned (2026-05-18 evening; just-after 006 ship) |
| Type | Implementation (purge + new bootstrap probe + tests) |
| Owner | cli-codex gpt-5.5 xhigh fast (dispatched); main agent commits on handoff |
| Parent | `../spec.md` (002-spec-memory-stack) |
| Predecessor | `../006-ollama-encode-path-wiring/` (just shipped — closed the half-migration; this packet finishes the job) |
| Builds on | Live measurement showed -834 MB RSS in context-server.js after 006 wired Ollama (1080→246 MB); we now want to delete the dead llama-cpp code path entirely |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

After `016/002/006` wired OllamaAdapter into the shared/embeddings factory, two issues remain visible in production:

1. **Hardcoded `DEFAULT_ACTIVE_EMBEDDER = embeddinggemma-300m`** in `mcp_server/lib/embedders/schema.ts`. When a fresh DB is created (e.g., after a daemon restart or on a new machine), `getActiveEmbedder(db)` reads an empty `vec_metadata` table and falls through to this hardcoded default. Result: even though Ollama + jina-v3 are available and the standing decision (ADR-012) is "jina-v3 is production", a fresh daemon comes up running gemma — operator must call `embedder_set('jina-embeddings-v3')` to fix.

2. **llama-cpp surface is still present** — `node-llama-cpp`, the embeddinggemma-300m GGUF (~313 MB on disk), and all factory.ts branches/providers/tests referencing them. ADR-012 selected jina-v3; the rerank work (016/004/004) selected `BAAI/bge-reranker-v2-m3` via sentence-transformers (separate stack). llama-cpp is dead weight: not the production choice, not the fallback the architecture wants, and a ~300-450 MB RSS hit when it loads.

**This packet** replaces both with a smart precedence-chain auto-selection at bootstrap that persists its decision to `vec_metadata`. Fresh daemons just work. llama-cpp + embeddinggemma get purged. Ollama becomes the always-available local fallback when cloud APIs aren't configured.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In scope

**A. Auto-selection precedence chain** at daemon bootstrap (executed when `getActiveEmbedder(db)` finds empty `vec_metadata`):

1. **Voyage API key** — if `VOYAGE_API_KEY` env set: probe `voyage-code-3` reachability; if OK, persist `{name: 'voyage-code-3', dim: <model-dim>, provider: 'voyage'}` to `vec_metadata`.
2. **OpenAI API key** — if `OPENAI_API_KEY` env set: probe `text-embedding-3-small` reachability; if OK, persist `{name: 'text-embedding-3-small', dim: 1536, provider: 'openai'}`.
3. **Ollama** — probe `http://127.0.0.1:11434/api/tags`; if reachable, walk the manifest list in ADR-012 priority (`jina-embeddings-v3` > `nomic-embed-text-v1.5` > `bge-m3` > `mxbai-embed-large-v1`); if any are pulled, persist that manifest as active.
4. **hf-local** — if `sentence-transformers` is importable + `HF_LOCAL_MODEL` env (or a sane default like `BAAI/bge-base-en-v1.5`) is set, persist that.
5. **Fail with clear error** if nothing reachable — do NOT silently fall back to gemma (purged).

Each step persists `vec_metadata.active_embedder_name` + `active_embedder_dim` + `active_embedder_provider`. Subsequent starts read from `vec_metadata` (operator override always wins).

**B. Purge llama-cpp surface:**
- Remove `LlamaCppProvider` from `shared/embeddings/factory.ts` (delete branch, delete entry from `SUPPORTED_PROVIDERS`)
- Delete `shared/embeddings/providers/llama-cpp.ts` (if exists as a separate provider) AND/OR remove llama-cpp branch from factory inline
- Delete `shared/embeddings/llama-cpp-availability.ts` (the probe helper)
- Remove `node-llama-cpp` from `package.json` dependencies (if no other consumer)
- Delete the embeddinggemma-300m GGUF artifact (`~/.cache/...` or wherever it lives — codex investigates + lists for confirmation before deletion)
- Delete `embeddinggemma-300m` entry from `mcp_server/lib/embedders/registry.ts` MANIFESTS
- Delete the legacy `__llama-cpp__embeddinggemma__768.sqlite` DB (~750 MB) and any `vec_768` table references that are llama-cpp-specific
- Remove llama-cpp / embeddinggemma references from tests; replace with ollama / voyage / hf-local equivalents
- Remove llama-cpp / embeddinggemma mentions from INSTALL_GUIDE.md + the new `embedder_architecture.md`
- Update changelog with the purge

**C. Schema constant cleanup:**
- Change `DEFAULT_ACTIVE_EMBEDDER` in `mcp_server/lib/embedders/schema.ts` from `{name: 'embeddinggemma-300m', dim: 768}` to a sentinel that triggers auto-detection rather than encoding a specific embedder. Possible patterns:
  - Set to `{name: 'auto', dim: 0}` and special-case in `getActiveEmbedder()`
  - Remove entirely + have `getActiveEmbedder()` invoke `autoSelectActiveEmbedder()` when vec_metadata is empty
  - Codex picks the cleanest pattern at implementation time.

**D. Tests + verification:**
- New vitest suite `embedder-auto-selection.vitest.ts` covering the precedence chain (mock env + mock probes; assert correct provider picked under each scenario)
- Update existing `embedder-ollama.vitest.ts` + any tests that referenced `DEFAULT_ACTIVE_EMBEDDER = gemma`
- Live smoke after dispatch:
  - Fresh DB → auto picks jina-v3 (Ollama is running with it pulled on this machine)
  - Set `VOYAGE_API_KEY=stub` + ensure probe is mocked → auto picks voyage
  - Unset everything → auto picks ollama-jina (still available)
  - Stop Ollama (test only) → auto picks hf-local if sentence-transformers available

**E. Documentation:**
- Update `references/memory/embedder_architecture.md` with the new precedence chain
- Update `INSTALL_GUIDE.md` Troubleshooting + Quickstart sections — no more "embeddinggemma is the default"; explain the auto chain
- Add a "Migration from llama-cpp" section to the changelog (operators upgrading from pre-007 need to know the legacy DB will be cleaned up)

### Out of scope

- Don't touch the cocoindex-code skill (different MCP server, separate factory)
- Don't change the rerank model (BGE-reranker-v2-m3 stays per 016/004/004 + the rerank-model-fit investigation in 016/004/011)
- Don't add new embedders to the registry (jina-v3, nomic-v1.5, bge-m3, mxbai, snowflake — those are already there)
- Don't change the `embedder_set` MCP tool's contract (operators can still force a specific embedder; auto only fires on empty vec_metadata)
- Don't refactor the registry/adapter pattern (those are correct; this packet only changes the factory + the bootstrap defaults)
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0

| ID | Requirement | Acceptance |
|----|-------------|-----------|
| REQ-001 | `autoSelectActiveEmbedder()` exists + implements the 4-step precedence chain | function exists + has tests |
| REQ-002 | `DEFAULT_ACTIVE_EMBEDDER` no longer encodes embeddinggemma | grep shows no `embeddinggemma-300m` literal in `schema.ts` `DEFAULT_ACTIVE_EMBEDDER` |
| REQ-003 | `LlamaCppProvider` removed from factory + SUPPORTED_PROVIDERS | grep shows no `'llama-cpp'` in `SUPPORTED_PROVIDERS` |
| REQ-004 | `node-llama-cpp` removed from package.json (if no other consumer) | `package.json` diff confirms |
| REQ-005 | embeddinggemma-300m removed from manifest registry | `registered_embedders.py` / `registry.ts` no longer lists it |
| REQ-006 | Fresh-DB bootstrap test: with Ollama+jina-v3 available, daemon starts with active = jina-embeddings-v3 | vitest mock + integration |
| REQ-007 | Voyage / OpenAI key-detection logic correctly short-circuits before Ollama probe | unit tests |

### P1

| ID | Requirement | Acceptance |
|----|-------------|-----------|
| REQ-008 | Legacy DB `__llama-cpp__embeddinggemma__768.sqlite` deleted from local machine after operator confirmation | `ls` shows file gone (codex documents path in implementation-summary; main agent or operator does the actual `rm` to keep the destructive step explicit) |
| REQ-009 | INSTALL_GUIDE + embedder_architecture updated | grep no longer mentions "default is embeddinggemma" |
| REQ-010 | `embedder_status` MCP tool returns the auto-selected provider + model + dim | manual MCP probe |
| REQ-011 | strict-validate PASSED on this packet | exit 0 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- A fresh spec-memory daemon on this machine starts with `active_embedder_name='jina-embeddings-v3'` without any operator action (the standing ADR-012 default applies automatically).
- A machine WITHOUT Ollama running but WITH `VOYAGE_API_KEY` set starts with active = voyage-code-3.
- A machine WITHOUT any cloud key AND WITHOUT Ollama running uses hf-local (sentence-transformers) — only fails entirely if even sentence-transformers isn't importable.
- llama-cpp / node-llama-cpp / embeddinggemma references are GONE from source, tests, docs, dist artifacts.
- Strict-validate PASSED.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Risks

- **Existing operators with non-Ollama, non-cloud setups** — they may have been relying on gemma. After this packet, hf-local is the no-Ollama fallback. If `sentence-transformers` isn't installed in the spec-memory venv, the daemon would fail to start. Mitigation: `sentence-transformers` is already a dep for the cross-encoder reranker; verify it's importable + add a clear error message if not.
- **Legacy DB deletion is destructive.** The 750 MB `__llama-cpp__embeddinggemma__768.sqlite` has 9,164 rows of indexed memory state. After 006, the new `__ollama__jina-v3__1024.sqlite` only has 165 rows (will repopulate via `embedder_set` reindex). Mitigation: do NOT delete the legacy DB in the codex dispatch — codex documents the path; operator (or a follow-on step) actually `rm`s after verifying reindex completed.
- **Network-dependent auto-selection.** Voyage / OpenAI probes can timeout / hang. Mitigation: 2-3s timeout per probe; fall through on any error.
- **vec_metadata write race.** If two daemons bootstrap concurrently, both could write `vec_metadata` with conflicting active embedders. Mitigation: file lock around the auto-select+persist step (mirror the existing PID-lease pattern from launchers).

### Dependencies

- `016/002/006-ollama-encode-path-wiring/` (just shipped — provides the OllamaProvider; this packet builds on it)
- Existing `shared/embeddings/factory.ts` + `providers/ollama.ts`
- `mcp_server/lib/embedders/schema.ts` (DEFAULT_ACTIVE_EMBEDDER lives here)
- `mcp_server/lib/embedders/registry.ts` (manifest list)
- ADR-012 (embedder priority order)
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should auto-detection re-probe on every daemon start, or only when vec_metadata is empty? Decision: only when empty. Operators can force re-detection by clearing vec_metadata.
- Should Voyage `voyage-code-3` (paid) outrank OpenAI `text-embedding-3-small`? Decision: yes if both keys are present, since voyage-code-3 is code-specific.
- Are there existing operators on hf-local that need migration paths? Codex investigates: any `EMBEDDINGS_PROVIDER=hf-local` envs in `.env` / `.env.local` / launcher configs.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:cross-links -->
## 8. CROSS-LINKS

- **Predecessor:** `../006-ollama-encode-path-wiring/`
- **Production decision:** `../004-spec-memory-embedder-bake-off/decision-record.md` ADR-012 (jina-v3 + rescue)
- **Embedder architecture doc:** `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` (created in 006; will be updated by this packet)
- **Related rerank investigation:** `../../004-code-index-stack/011-rerank-model-fit-investigation/` (different stack — cocoindex code retrieval; this packet does NOT touch reranker)
<!-- /ANCHOR:cross-links -->
