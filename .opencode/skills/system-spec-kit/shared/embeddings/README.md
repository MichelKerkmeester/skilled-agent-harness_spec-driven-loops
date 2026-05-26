---
title: "Embeddings"
description: "Provider selection, profile resolution and embedding provider construction for shared memory search code."
trigger_phrases:
  - "embeddings factory"
  - "embedding provider selection"
  - "embedding profile"
---

# Embeddings

---

## 1. OVERVIEW

`embeddings/` owns provider selection and profile naming for embedding generation. It chooses an embedding provider from configuration, validates supported dimensions and returns provider instances that implement the shared `IEmbeddingProvider` contract.

Current state:

- Supported provider names are `ollama`, `voyage`, `openai`, `hf-local` and `auto`.
- `auto` cascades cloud-keys-first then local: `VOYAGE_API_KEY` -> `OPENAI_API_KEY` -> `ollama` (auto when GGUF runtime is installed; Apple Silicon Metal GPU acceleration when available, CPU fallback otherwise) -> `hf-local` (final fallback when ollama runtime is unavailable).
- Profiles derive provider, model, dimension, optional base URL and database filename.
- Provider modules isolate external API and local model behavior from the factory.

---

## 2. PACKAGE TOPOLOGY

```text
embeddings/
+-- factory.ts              # Provider resolution, validation and construction
+-- profile.ts              # Profile slugs and database path derivation
+-- providers/
|   +-- ollama.ts        # Default local GGUF provider (Metal-accelerated)
|   +-- hf-local.ts         # Fallback local ONNX provider
|   +-- openai.ts           # OpenAI provider
|   +-- voyage.ts           # Voyage provider
|   `-- README.md           # Provider-level notes
`-- README.md
```

Allowed dependency direction:

```text
callers -> factory.ts
factory.ts -> profile.ts
factory.ts -> providers/*
providers/* -> shared/types.ts
profile.ts -> shared/types.ts
```

Disallowed dependency direction:

```text
providers/* -> factory.ts
providers/* -> MCP handlers
providers/* -> database adapters
profile.ts -> providers/*
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `factory.ts` | Resolves configured provider, validates API keys and creates `IEmbeddingProvider` instances. |
| `profile.ts` | Creates profile slugs, parses slugs and maps profiles to SQLite database paths. |
| `providers/ollama.ts` | Implements ollama GGUF embedding with Metal GPU health check, lazy session init and BGE local fallback prefixes. |
| `providers/hf-local.ts` | Implements local ONNX embedding (fallback when ollama is unavailable). |
| `providers/openai.ts` | Implements OpenAI embedding requests and model dimensions. |
| `providers/voyage.ts` | Implements Voyage embedding requests, model dimensions and base URL resolution. |
| `providers/README.md` | Documents provider-specific contracts and behavior. |

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
| `createProfileSlug(provider, model, dim)` | `profile.ts` | Creates a filesystem-safe profile slug. |
| `parseProfileSlug(slug)` | `profile.ts` | Parses a slug back into provider, model and dimension. |
| `EmbeddingProfile` | `profile.ts` | Holds profile data and derives database paths. |

Keep this API provider-neutral. Provider-specific settings belong in `providers/*` or environment variables read by `factory.ts`.

---

## 5. BOUNDARIES

| Boundary | Rule |
|---|---|
| Provider choice | `factory.ts` owns provider selection and fallback metadata. |
| Provider IO | `providers/*` owns external API calls or local model loading. |
| Profile naming | `profile.ts` owns slugs and database filename derivation. |
| Storage | This folder returns paths but does not open SQLite connections. |
| Retrieval | Search ranking and result assembly live outside this folder. |

Main flow:

```text
caller
  -> resolveProvider or createEmbeddingsProvider
  -> factory reads environment and validates provider
  -> provider instance generates query or document vector
  -> caller stores or searches with the vector
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `createEmbeddingsProvider` | Function | Main provider construction path. |
| `resolveProvider` | Function | Inspect selected provider without creating one. |
| `resolveStartupEmbeddingConfig` | Function | Get startup profile, dimension and validation state. |
| `getProviderInfo` | Function | Report active provider metadata. |
| `EmbeddingProfile` | Class | Derive display strings, JSON data and database paths. |

---

## 7. VALIDATION

Run from the repository root:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/shared/embeddings/README.md
```

Expected result: the validator exits with code `0`.

---

## 8. RELATED

- [`../README.md`](../README.md)
- [`../types.ts`](../types.ts)
- [`../algorithms/README.md`](../algorithms/README.md)
- [`providers/README.md`](providers/README.md)
