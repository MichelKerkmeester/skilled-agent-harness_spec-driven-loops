---
title: "Implementation Summary: Consolidate local embedding models to nomic only"
description: "Implemented. Local embedding model menus consolidated to nomic-ai/nomic-embed-text-v1.5 across registry/factory/providers/docs, with a graceful runtime-dim guard for unlisted user models. Headless-verified (tsc + 79 embedding vitest) and adversarially reviewed."
trigger_phrases:
  - "nomic-only local embedding consolidation implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/001-nomic-only-consolidation"
    last_updated_at: "2026-05-29T07:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented via codex gpt-5.5; review clean; prefix-system stale tests fixed; 79 green"
    next_safe_action: "Proceed to phase 002-hf-model-server when Option B is scheduled"
    blockers: []
    key_files:
      - "shared/embeddings/registry.ts"
      - "shared/embeddings/factory.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000591"
      session_id: "029-001-impl-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-nomic-only-consolidation |
| **Completed** | 2026-05-29 (implemented + headless-verified) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Local embedding model menus are now consolidated to a single default — `nomic-ai/nomic-embed-text-v1.5`. `registry.ts` MANIFESTS holds only the nomic entry (so `getCanonicalFallback` resolves nomic for both ollama and hf-local), and `factory.ts` `VALID_PROVIDER_DIMENSIONS` for the local providers is nomic-only (768). The removed models (mxbai, bge-small/large, jina-v3, bge-m3, snowflake-arctic, e5, bge-base) are gone from the registries, the `PREFIX_REGISTRY`, provider/profile/type copy, and the user docs.

### Graceful unknown-model guard (REQ-003)

Critically, removing the menu did NOT make the code hard-fail on a user-set unlisted model. A model set via `HF_EMBEDDINGS_MODEL`/`OLLAMA_EMBEDDINGS_MODEL` that is absent from the registry resolves with **runtime dimension derivation**: hf-local `resolveInitialDimension` returns 0 for non-default models and ollama `resolveManifest` synthesizes a `dim:0` manifest (instead of throwing); the provider then locks `this.dim` to the first returned vector length, and the per-vector length assertion still guards against mixed-dim corruption. The kept nomic path resolves 768 via the registry map, not the fallback. Cloud providers (voyage/openai `CLOUD_CANONICAL`) are untouched.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `shared/embeddings/registry.ts` | Modify | MANIFESTS reduced to the nomic entry; `getCanonicalFallback` stays nomic |
| `shared/embeddings/factory.ts` | Modify | `VALID_PROVIDER_DIMENSIONS` local maps nomic-only (768) + runtime-dim provisional for unlisted models |
| `shared/embeddings/providers/{ollama,hf-local}.ts` | Modify | Trim model menus + `PREFIX_REGISTRY` to nomic; unlisted-model runtime-dim derivation; `DEFAULT_MODEL` stays derived |
| `shared/embeddings/{profile,types}.ts` | Modify | Remove stale local model menu references |
| `mcp_server/{ENV_REFERENCE.md,README.md}`, `INSTALL_GUIDE.md`, `shared/embeddings/providers/README.md`, `mcp_server/database/vectors/README.md` | Modify | Docs trimmed to nomic-only local guidance |
| `mcp_server/tests/{embeddings,embedder-registry,embedder-ollama}.vitest.ts`, `tests/local-llm-features/prefix-system.vitest.ts` | Modify | Update stale old-registry assertions to nomic-only + add a runtime-dim (REQ-007) regression test |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented by a `cli-codex` dispatch (`gpt-5.5`, high reasoning, fast tier, `--sandbox workspace-write`) fenced to the live embedding files (benchmarks/fixtures/cloud-providers excluded). The orchestrator ran independent `tsc` builds + the embedding vitest and a 4-lens opus adversarial review, which confirmed the REQ-003 guard correct and the kept-nomic path intact, and surfaced one straggler — `prefix-system.vitest.ts` (in `tests/local-llm-features/`, outside the codex sweep) still asserted the removed-model `PREFIX_REGISTRY`. The orchestrator fixed those stale assertions to the nomic-only reality. Final: 79 embedding tests pass / 0 fail.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep implementation status pending | This pass is spec authoring only; implementation must occur in a later scoped session |
| Preserve Level-1 anchors and phase headers from the reference packet | The validator enforces template shape and anchor consistency |
| Include concrete verification command tokens | Future implementers need runnable checks, and implementation-summary verification must not be vague |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build --workspace=@spec-kit/shared` + `@spec-kit/mcp-server` (tsc) | PASS (exit 0) |
| `vitest run` embeddings + embedder-* + prefix-system (8 files) | PASS (79 passed / 8 skipped / 0 failed) |
| 4-lens opus adversarial review (guard / registry-factory / test-triage / scope) | PASS — REQ-003 guard correct, kept-nomic path intact; 1 straggler (prefix-system stale tests) found + fixed |
| Unlisted-model runtime-dim path (REQ-003/007) | PASS — added regression tests (hf-local + ollama unlisted → runtime-derived dim) |
| Cloud providers + benchmarks untouched (REQ-006/008) | PASS — voyage/openai CLOUD_CANONICAL + benchmarks/fixtures unchanged |
| `validate.sh --strict` on this packet | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live re-embed not performed here** — switching the default doesn't re-embed an existing corpus; vectors stay valid because the default was already nomic (768). A genuine model change would require a reindex (documented in ENV_REFERENCE).
2. **Unlisted-model runtime-dim is verified headlessly** (mocked vector length); a live unlisted model on a running daemon is the natural follow-up check.
3. Phases 002-006 (the hf-local HTTP model-server, Option B) remain spec-only/deferred.
<!-- /ANCHOR:limitations -->

