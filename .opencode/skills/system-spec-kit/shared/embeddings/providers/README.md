---
title: "Embedding Providers"
description: "Concrete embedding provider implementations for Ollama, ollama, HuggingFace Local, OpenAI and Voyage AI backends."
trigger_phrases:
  - "embedding providers"
  - "ollama embeddings"
  - "hf local provider"
  - "openai embeddings"
  - "voyage embeddings"
---

# Embedding Providers

> Concrete implementations of the shared embedding provider contract. The parent embeddings package selects one provider, then callers use the same stable API regardless of backend.

---

## 1. OVERVIEW

This folder contains provider adapters for the `IEmbeddingProvider` interface from `../../types.ts`. Providers hide backend-specific calls, model dimensions and task hints behind one embedding surface.

The parent package owns provider selection in `../factory.ts`. Files in this folder should stay focused on backend behavior: request shaping, retries, task prefixes, metadata and health checks.

Ollama closes the 016/002 dual-path migration: the MCP registry/re-index path writes Ollama vectors to `vec_<dim>`, while the shared factory path encodes queries. Both paths must use the same active manifest.

> **Auto-migration on first startup.** When the active provider resolves to `ollama` and a pre-existing `context-index__hf-local__*.sqlite` store is present, the Memory MCP server re-embeds the rows into the new ollama store and deletes the source. The logic lives in the MCP server startup path, not in this folder. See the MCP server README and packet 018 for the full lifecycle.

---

## 2. STRUCTURE

```text
providers/
├── README.md      # This file
├── ollama.ts      # Ollama provider for active registry manifests
├── ollama.ts   # ollama GGUF provider (default local)
├── hf-local.ts    # HuggingFace local ONNX provider (fallback)
├── openai.ts      # OpenAI embeddings provider
└── voyage.ts      # Voyage AI embeddings provider
```

| File | Provider | Default model | Dimensions | Role |
| ---- | -------- | ------------- | ---------- | ---- |
| `ollama.ts` | Ollama | `jina-embeddings-v3` | 384, 768, 1024 | Active embedder provider for Jina v3, Nomic, mxbai, BGE, and Snowflake manifests |
| `ollama.ts` | ollama | `nomic-embed-text-v1.5` | 768 | Default local provider. Metal GPU acceleration, nomic-embed-text local-first default (ADR-014) |
| `hf-local.ts` | HuggingFace Local | `onnx-community/bge-base-en-v1.5-ONNX` | 768 | Fallback local provider. ONNX q8 quantization on CPU when ollama is unavailable |
| `openai.ts` | OpenAI | `text-embedding-3-small` | 1536 | Cloud provider with OpenAI usage tracking and retry handling |
| `voyage.ts` | Voyage AI | `voyage-4` | 1024 | Cloud provider using Voyage `input_type` for document and query embeddings |

---

## 3. STABLE API

Each provider implements the same public contract:

| Method | Purpose |
| ------ | ------- |
| `generateEmbedding(text)` | Return a `Float32Array` embedding for raw text |
| `embedDocument(text)` | Produce a document embedding with provider-specific document hints |
| `embedQuery(text)` | Produce a query embedding with provider-specific query hints |
| `warmup()` | Prepare local model state or verify remote readiness |
| `healthCheck()` | Return backend availability without changing caller control flow |
| `getMetadata()` | Report provider name, model and dimensions |
| `getProfile()` | Report profile data used by the embeddings package |

Cloud providers also expose usage data for logging and diagnostics. Do not call provider internals from outside `shared/embeddings`. Use the interface or factory entry points.

---

## 4. BOUNDARIES

Import direction is inward from provider implementations to shared contracts and helpers:

- Providers may import shared types from `../../types.ts`.
- Providers may import retry and chunking helpers from shared packages.
- Parent embeddings files may import providers to construct the selected backend.
- Code outside `shared/embeddings` should not import `providers/*` directly.
- Provider files should not depend on MCP server endpoints, spec-folder workflows or database code.

Keep backend-specific behavior in the provider file that owns it. Put provider-neutral selection logic in `../factory.ts` and profile path logic in `../profile.ts`.

---

## 5. VALIDATION

Run targeted provider tests or TypeScript checks after changing provider logic:

```bash
npm test -- --runInBand embeddings
npx tsc --noEmit
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/shared/embeddings/providers/README.md
```

For README-only edits, `validate_document.py` is the required file-level check.

---

## 6. RELATED DOCUMENTS

| Document | Purpose |
| -------- | ------- |
| [embeddings/README.md](../README.md) | Parent embeddings package overview |
| [embeddings/factory.ts](../factory.ts) | Provider selection and auto-detection logic |
| [embeddings/profile.ts](../profile.ts) | Per-profile database path generation |
| [embedder_architecture.md](../../../references/memory/embedder_architecture.md) | Dual registry/factory architecture, active pointer, and operator runbook |
| [shared/types.ts](../../types.ts) | `IEmbeddingProvider` and shared retrieval types |
| [shared/utils/retry.ts](../../utils/retry.ts) | Retry helper used by cloud providers |
| [mcp_server/README.md](../../../mcp_server/README.md) | Memory MCP server entry point, auto-migration lifecycle, env vars |
| packet 018 | hf-local to ollama auto-migration spec |

---
