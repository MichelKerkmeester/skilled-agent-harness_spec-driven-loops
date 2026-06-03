---
title: "Implementation Summary: Embedding Provider Local-First Resolution"
description: "resolveProvider() is now local-first (ollama -> hf-local; cloud opt-in/last-resort), matching the user directive Ollama > HF > OpenAI/Voyage and the two cascades that were already local-first. Two pre-existing stale embedder fixtures were repaired. Verified by the embedder test gate (62 passed, 0 failed)."
trigger_phrases:
  - "embedding local-first summary"
  - "ollama default embedder shipped"
  - "resolveProvider local-first"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-embedding-provider-local-first"
    last_updated_at: "2026-06-02T21:06:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented + tested local-first resolveProvider; gate green (62 passed)"
    next_safe_action: "Generate metadata, validate --strict, commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/factory.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/factory-auto-resolution.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedder-ollama.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "embedding-localfirst-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Embedding Provider Local-First Resolution

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/132-embedding-provider-local-first` |
| **Completed** | 2026-06-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Made `resolveProvider()` in `shared/embeddings/factory.ts` local-first, fulfilling the user directive **Ollama > HF > OpenAI/Voyage**:

1. **resolveProvider() reorder** — removed the auto-mode `VOYAGE_API_KEY`/`OPENAI_API_KEY` branches. Auto-mode precedence is now `explicit EMBEDDINGS_PROVIDER → persisted-ollama → hf-local`. Cloud is never silently auto-selected; it is reached only via an explicit provider or the hard-failure cascade. This makes resolveProvider agree with the two definitions that were already local-first (`auto-select.ts` bootstrap cascade and `getCascadeFallbackOrder()`).
2. **createEmbeddingsProvider() cascade trigger** — added `hf-local` to the error-catch fallback condition (not the warmup-soft-fail path, which tolerates lazy init) so a hard local failure cascades to cloud via `getCascadeFallbackOrder('hf-local') = ['openai','voyage']`, preserving cloud as a genuine last-resort tier.
3. **Removed dead `isPlaceholderKey`** (its only callers were the removed cloud branches) and corrected the now-stale precedence docstring.
4. **Repaired two pre-existing stale test fixtures** (`createActiveNomicDb` in embedder-ollama, inline `createActiveOllamaDb` in factory-auto-resolution): both built `vec_metadata` + `vec_768` but not the `vec_memories_rowids` table the source legitimately requires before honoring an active ollama embedder. Surfaced when rebuilding `shared/dist` made dist consistent with source.
5. **Rewrote the three legacy `it.skip` cloud-preference tests** (T513-01b/c/d) to assert local-first and un-skipped them; dropped the `post-016` packet-id from their comments (comment-hygiene).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Modified | resolveProvider local-first + createEmbeddingsProvider hf-local cascade trigger + drop dead helper |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts` | Modified | Rewrote stale skipped cloud-preference tests to local-first |
| `.opencode/skills/system-spec-kit/mcp_server/tests/factory-auto-resolution.vitest.ts` | Modified | Repaired stale active-ollama fixture (vec_memories_rowids) |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-ollama.vitest.ts` | Modified | Repaired stale active-ollama fixture (vec_memories_rowids) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Single-function surgical reorder in a shared module, verified empirically by the existing embedder vitest suite rather than by review alone. After the code edits, `shared/dist` was rebuilt so the tests imported the changed resolver, the two stale fixtures were repaired, and the targeted embedder gate was run against isolated throwaway DBs (production DB untouched). The live daemon was intentionally not recycled — it already runs on persisted ollama and loaded the pre-rebuild dist, so the change affects only the fallback path until a recycle.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Make `resolveProvider()` local-first (cloud opt-in/last-resort) | The runtime resolver was the lone non-local-first definition: when Ollama was down and a cloud API key was present, it silently selected OpenAI/Voyage above the local hf-local fallback — the opposite of the intended priority and the egress-conscious design (whose own drift warnings already told operators to opt into cloud explicitly). |
| Add `hf-local` to the catch-fallback trigger only, not the warmup-soft-fail path | The warmup path tolerates lazy init, so only a hard create/warmup failure should cascade to cloud; keeps cloud reachable as a genuine last resort without breaking lazy local init. |
| Repair the two stale fixtures rather than mask them | `vec_memories_rowids` is a real source requirement before an active ollama embedder is honored; the fixtures legitimately lacked it, so completing them fixes the root cause. |
| Defer the live daemon recycle | The running daemon already uses persisted ollama; batching the recycle with the pending 015 launcher-`.cjs` restart decision avoids an isolated user-gated restart. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Embedder test gate (6 files) | PASS — 62 passed / 5 skipped / 0 failed |
| `T513-01b/c` auto mode with valid Voyage + OpenAI keys | PASS — resolves `hf-local` (not cloud) |
| Provider-flap recovery | PASS — stays `hf-local` when ollama unreachable; recovers to `ollama` when reachable |
| `factory-auto-resolution` + `embedder-ollama` persisted-ollama path | PASS — resolves `ollama` (fixtures repaired) |
| Cause isolation (`git stash` factory.ts + rebuild) | PASS — 2 fixture failures reproduced against pristine source → confirmed pre-existing |
| `tsc --build` (shared) | PASS — clean |
| Comment hygiene | PASS — `post-016` packet-id removed; no spec-paths in code |
| Test isolation | PASS — isolated test DBs; production DB untouched |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live deploy deferred.** The running daemon (pid 69984) loaded the pre-rebuild `shared/dist`; it currently runs on persisted ollama, so the change affects only the fallback path. A daemon recycle picks up the new `shared/dist`. Deferred and batched with the pending 015 launcher-`.cjs` restart decision (user-gated).
2. **Cloud auto-selection path narrowed.** With no explicit provider and both ollama + hf-local down but a cloud key present, cloud is now reached only via the hard-failure cascade — intended behavior, not a regression.

### Downstream

Packet `131-doctor-install-alignment` documents embeddings as **Ollama default → HF → OpenAI/Voyage (cloud opt-in)**, consuming this change as ground truth.
<!-- /ANCHOR:limitations -->
