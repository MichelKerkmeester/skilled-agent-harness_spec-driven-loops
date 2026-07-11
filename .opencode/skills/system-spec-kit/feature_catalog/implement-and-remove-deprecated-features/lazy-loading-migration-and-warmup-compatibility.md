---
title: "Lazy-loading migration and warmup compatibility"
description: "Embedding startup now uses permanent lazy initialization, while the old warmup flags remain only as deprecated compatibility surfaces."
trigger_phrases:
  - "lazy-loading migration"
  - "warmup compatibility"
  - "SPECKIT_EAGER_WARMUP deprecated"
  - "permanent lazy embedding initialization"
  - "SPECKIT_LAZY_LOADING shim"
version: 3.6.0.8
---

# Lazy-loading migration and warmup compatibility

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

This entry captures the completed migration from optional startup warmup to permanent lazy embedding initialization.

The requested source files show a split between runtime behavior and compatibility posture. `shared/embeddings.ts` hardens lazy provider creation as the only real embedding startup path, while `mcp_server/context-server.ts` still preserves the older warmup decision point so legacy flag names can be acknowledged without re-enabling eager startup behavior.

---

## 2. HOW IT WORKS

`shared/embeddings.ts` makes lazy loading the permanent default. The module-level `shouldEagerWarmup()` helper now always returns `false`, and `getProvider()` creates the provider with `warmup: false`, which defers model loading until the first embedding request. The same module still records lazy-loading diagnostics such as initialization timing, first-embedding timing, and an `eagerWarmupEnabled` field in `getLazyLoadingStats()`, but that field is fed by an inert helper.

The file also keeps a `preWarmModel()` utility that can call `provider.warmup()`, but the requested startup path does not use it. In other words, warmup support survives as helper-level compatibility code, not as the live startup policy.

`mcp_server/context-server.ts` still asks `embeddings.shouldEagerWarmup()` during startup and retains the old eager branch structure, but the branch is now unreachable through normal runtime configuration because the shared helper always returns `false`. Startup therefore always takes the lazy path, logs that lazy loading is enabled, explicitly warns that `SPECKIT_EAGER_WARMUP` and `SPECKIT_LAZY_LOADING` are deprecated compatibility flags, and immediately marks the embedding model as ready for first-use self-initialization.

The migration outcome is therefore stable: lazy loading is the shipped behavior, and the warmup flags remain only as compatibility shims for older docs, configs, or operator expectations. They no longer act as live knobs that can restore eager warmup at server startup.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `shared/embeddings.ts` | Shared | Defines permanent lazy provider initialization, inert warmup flag behavior, lazy-loading diagnostics, and retained pre-warm helper surface |
| `mcp_server/context-server.ts` | Core | Preserves the startup decision point and emits the deprecation/runtime messaging for legacy warmup flags |

---

## 4. SOURCE METADATA
- Group: Implement And Remove Deprecated Features
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `implement-and-remove-deprecated-features/lazy-loading-migration-and-warmup-compatibility.md`
Related references:
- [category-stub.md](category-stub.md) — Retired runtime shims and inert compatibility flags
- [shadow-scoring-retirement.md](shadow-scoring-retirement.md) — Shadow-scoring retirement
