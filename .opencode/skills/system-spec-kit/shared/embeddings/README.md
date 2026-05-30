---
title: "Embeddings"
description: "Provider selection, profile resolution, the shared embedder registry and embedding provider construction for shared memory search code."
trigger_phrases:
  - "embeddings factory"
  - "embedding provider selection"
  - "embedding profile"
  - "embedder auto-select"
---

# Embeddings

---

## 1. OVERVIEW

`embeddings/` owns provider selection, profile naming, the shared embedder registry and the auto-select cascade for embedding generation. It chooses an embedding provider from configuration, validates supported dimensions and returns provider instances that implement the shared `IEmbeddingProvider` contract.

Current state:

- Supported provider names are `ollama`, `voyage`, `openai`, `hf-local` and `auto`.
- `auto-select.ts` runs a local-first cascade: `ollama` -> `hf-local` -> `openai` -> `voyage`. An explicit `EMBEDDINGS_PROVIDER` (other than `auto`) is tried first, then the cascade resumes as fallback, mirroring `resolveProvider()` precedence.
- `registry.ts` holds the canonical frozen `MANIFESTS` list and derives the local canonical fallback model from `MANIFESTS[0]`; cloud fallbacks are held per provider.
- Profiles derive provider, model, dimension, optional dtype, optional base URL and database filename.
- Provider modules isolate external API and local model behavior from the factory.

---

## 2. PACKAGE TOPOLOGY

```text
embeddings/
+-- factory.ts              # Provider resolution, validation and construction
+-- auto-select.ts          # Local-first bootstrap cascade with explicit-provider precedence
+-- registry.ts             # Canonical MANIFESTS, adapter lookup and canonical fallbacks
+-- adapter.ts              # EmbedderAdapter contract and input-type hints
+-- types.ts                # BackendKind and EmbedderManifest shared types
+-- profile.ts              # Profile slugs, dtype resolution and database path derivation
+-- adapters/               # Manifest-driven adapters (ollama)
+-- providers/              # IEmbeddingProvider implementations (ollama, hf-local, openai, voyage)
+-- profile.test.ts         # Profile slug and path tests
+-- registry.test.ts        # Registry and canonical fallback tests
`-- README.md
```

Allowed dependency direction:

```text
callers -> factory.ts
factory.ts -> auto-select.ts
factory.ts -> profile.ts
factory.ts -> providers/*
auto-select.ts -> registry.ts
auto-select.ts -> providers/hf-local.ts
registry.ts -> adapters/*
registry.ts -> adapter.ts, types.ts
profile.ts -> ../types.ts
providers/* -> ../types.ts
```

Disallowed dependency direction:

```text
providers/* -> factory.ts
providers/* -> MCP handlers
providers/* -> database adapters
profile.ts -> providers/*
registry.ts -> factory.ts
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `factory.ts` | Resolves the configured provider, validates API keys and supported dimensions, and creates `IEmbeddingProvider` instances. |
| `auto-select.ts` | Probes embedders in a local-first cascade, honors an explicit `EMBEDDINGS_PROVIDER` first, persists the active embedder, and serializes selection with an optional lock. |
| `registry.ts` | Holds the frozen `MANIFESTS`, looks up manifests and adapters by name, and derives canonical fallback model names for local and cloud providers. |
| `adapter.ts` | Declares the `EmbedderAdapter` contract (`embed`, `ready`) and the `document`/`query` input-type hint. |
| `types.ts` | Declares `BackendKind` and the `EmbedderManifest` shape consumed by the registry and adapters. |
| `profile.ts` | Creates and parses profile slugs, resolves the active provider and dtype, and maps profiles to SQLite database paths. |
| `adapters/ollama.ts` | Manifest-driven ollama embedder adapter used by the registry. |
| `providers/*` | Concrete `IEmbeddingProvider` implementations; see `providers/README.md`. |

---

## 4. STABLE API

| Export | File | Contract |
|---|---|---|
| `SUPPORTED_PROVIDERS` | `factory.ts` | Lists accepted provider names, including `auto`. |
| `VALID_PROVIDER_DIMENSIONS` | `factory.ts` | Maps provider and model names to supported vector dimensions. |
| `validateConfiguredEmbeddingsProvider(value)` | `factory.ts` | Returns a valid provider name or `null`. |
| `resolveProviderDimension(provider, model)` | `factory.ts` | Returns the dimension for a provider and model. |
| `getStartupEmbeddingDimension()` | `factory.ts` | Returns the dimension selected for startup configuration. |
| `getStartupEmbeddingProfile()` | `factory.ts` | Returns the startup `EmbeddingProfile`. |
| `resolveStartupEmbeddingConfig(options)` | `factory.ts` | Resolves provider, profile info, dimension and validation result. |
| `resolveProvider()` | `factory.ts` | Returns provider selection details and reason. |
| `createEmbeddingsProvider(options)` | `factory.ts` | Creates the selected `IEmbeddingProvider`. |
| `getProviderInfo()` | `factory.ts` | Returns current provider metadata and fallback metadata. |
| `validateApiKey(options)` | `factory.ts` | Checks cloud provider credentials with timeout support. |
| `autoSelectActiveEmbedder(options)` | `auto-select.ts` | Runs the cascade, persists, and returns the active embedder with probe results. |
| `providerResolutionFromAutoSelect(result)` | `auto-select.ts` | Maps an auto-select result to a `ProviderResolution`. |
| `getManifest(name)` / `listManifests()` | `registry.ts` | Look up one manifest or list all registered manifests. |
| `getAdapter(name)` | `registry.ts` | Construct the concrete adapter for a registered embedder. |
| `getCanonicalFallback(provider)` | `registry.ts` | Return the canonical fallback model name for a provider. |
| `MANIFESTS` | `registry.ts` | The frozen canonical manifest array. |
| `createProfileSlug(provider, model, dim, dtype?)` | `profile.ts` | Create a filesystem-safe profile slug. |
| `parseProfileSlug(slug)` | `profile.ts` | Parse a slug back into provider, model and dimension. |
| `EmbeddingProfile` | `profile.ts` | Holds profile data and derives database paths. |

Keep this API provider-neutral. Provider-specific settings belong in `providers/*` or environment variables read by `factory.ts` and `auto-select.ts`.

---

## 5. BOUNDARIES

| Boundary | Rule |
|---|---|
| Provider choice | `factory.ts` and `auto-select.ts` own provider selection and fallback metadata. |
| Provider IO | `providers/*` and `adapters/*` own external API calls or local model loading. |
| Registry | `registry.ts` owns the canonical manifests and canonical fallback derivation. |
| Profile naming | `profile.ts` owns slugs, dtype resolution and database filename derivation. |
| Storage | This folder returns paths but does not open SQLite connections. |
| Retrieval | Search ranking and result assembly live outside this folder. |

Main flow:

```text
caller
  -> resolveProvider, autoSelectActiveEmbedder or createEmbeddingsProvider
  -> factory/auto-select read environment, honor explicit provider, then cascade
  -> provider instance generates query or document vector
  -> caller stores or searches with the vector
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `createEmbeddingsProvider` | Function | Main provider construction path. |
| `autoSelectActiveEmbedder` | Function | Run the local-first cascade and persist the active embedder. |
| `resolveProvider` | Function | Inspect the selected provider without creating one. |
| `resolveStartupEmbeddingConfig` | Function | Get startup profile, dimension and validation state. |
| `getProviderInfo` | Function | Report active provider metadata. |
| `getCanonicalFallback` | Function | Resolve the canonical fallback model for a provider. |
| `EmbeddingProfile` | Class | Derive display strings, JSON data and database paths. |

---

## 7. VALIDATION

Run from the repository root:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/shared/embeddings/README.md
```

Expected result: the validator exits with code `0`.

Sibling unit tests (`profile.test.ts`, `registry.test.ts`) run under the shared test runner; run them after changing profile or registry logic.

---

## 8. RELATED

- [`../README.md`](../README.md)
- [`../types.ts`](../types.ts)
- [`providers/README.md`](providers/README.md)
- [`adapters/README.md`](adapters/README.md)
