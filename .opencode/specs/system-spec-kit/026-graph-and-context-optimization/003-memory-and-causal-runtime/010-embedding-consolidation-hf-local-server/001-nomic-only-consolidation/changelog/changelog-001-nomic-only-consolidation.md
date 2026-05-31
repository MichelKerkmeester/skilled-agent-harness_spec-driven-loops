# Changelog — 001: Consolidate local embedding models to nomic only

**Shipped**: 2026-05-29
**Commit**: 4b2c5de6a3

## What Changed
- Reduced local embedding model menus, dimension maps, provider mentions, and docs to nomic-ai/nomic-embed-text-v1.5
- Modified `shared/embeddings/registry.ts` to reduce MANIFESTS to nomic entry only
- Modified `shared/embeddings/factory.ts` to reduce VALID_PROVIDER_DIMENSIONS local maps to nomic-only (768)
- Modified `shared/embeddings/providers/{ollama,hf-local}.ts` to trim model menus and PREFIX_REGISTRY to nomic
- Modified `shared/embeddings/{profile,types}.ts` to remove stale local model menu references
- Updated docs (ENV_REFERENCE.md, INSTALL_GUIDE.md, README.md, providers README, vectors README) to nomic-only guidance
- Added graceful unknown-model guard: unlisted user models resolve with runtime dimension derivation
- Updated embedding tests to nomic-only assertions and added runtime-dim regression tests

## Why
The local embedding model menu was scattered and inconsistent across registry.ts, factory.ts, provider/profile/type files, and docs, making the default model contract hard to reason about and creating stale documentation pressure.

## Verification
- `npm run build --workspace=@spec-kit/shared` + `@spec-kit/mcp-server` (tsc): PASS
- `vitest run` embeddings + embedder-* + prefix-system (8 files): PASS (79 passed / 8 skipped / 0 failed)
- 4-lens opus adversarial review: PASS — REQ-003 guard correct, kept-nomic path intact; 1 straggler (prefix-system stale tests) found + fixed
- Unlisted-model runtime-dim path (REQ-003/007): PASS — added regression tests
- Cloud providers + benchmarks untouched (REQ-006/008): PASS
- `validate.sh --strict` on this packet: PASS
