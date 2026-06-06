---
title: "Providers: Embeddings and Retry"
description: "Embedding provider exports and retry queue management for Spec Kit Memory indexing."
trigger_phrases:
  - "embedding providers"
  - "retry manager"
  - "embedding retry"
---

# Providers: Embeddings and Retry

---

## 1. OVERVIEW

`providers/` owns the MCP server edge for embedding generation and retry handling. It re-exports shared embedding helpers and manages retry timing for records whose embedding generation fails.

Current state:

- `embeddings.ts` delegates provider logic to `@spec-kit/shared/embeddings`.
- `retry-manager.ts` tracks pending, retry, success and failed embedding states.
- The retry manager can run one batch on demand or keep a background interval active.
- Provider failures can open a cooldown circuit so retry paths pause outbound embedding calls.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                         PROVIDERS                                │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────┐      ┌────────────────────┐      ┌───────────────────┐
│ Indexing caller│ ───▶ │ embeddings.ts      │ ───▶ │ Shared providers  │
└───────┬────────┘      └────────────────────┘      └───────────────────┘
        │
        │               ┌────────────────────┐      ┌───────────────────┐
        └─────────────▶ │ retry-manager.ts   │ ───▶ │ Memory DB rows    │
                        └─────────┬──────────┘      └───────────────────┘
                                  │
                                  ▼
                        ┌────────────────────┐
                        │ Background timer   │
                        └────────────────────┘

Dependency direction: indexing callers ───▶ providers ───▶ shared embeddings or DB helpers
```

---

## 3. PACKAGE TOPOLOGY

```text
providers/
+-- embeddings.ts     # Shared embedding helper re-export
+-- retry-manager.ts  # Retry queue, backoff and background processing
`-- README.md         # Local developer orientation

Allowed direction:
indexing callers → providers/embeddings.ts
indexing callers → providers/retry-manager.ts
providers/embeddings.ts → @spec-kit/shared/embeddings
providers/retry-manager.ts → storage and provider helpers

Disallowed direction:
providers/ → MCP response formatting
providers/ → search ranking formulas
providers/ → generated dist files
```

---

## 4. DIRECTORY TREE

```text
providers/
├── embeddings.ts
├── retry-manager.ts
└── README.md
```

---

## 5. KEY FILES

| File | Role |
|---|---|
| `embeddings.ts` | Re-exports shared embedding generation functions for query, document and batch embedding paths. |
| `retry-manager.ts` | Loads retry candidates, applies backoff, retries embeddings, records final failure and controls the background retry interval. |

Retry constants:

| Constant | Role |
|---|---|
| `BACKOFF_DELAYS` | Delay sequence for retry attempts. |
| `MAX_RETRIES` | Maximum attempts before a record is marked failed. |
| `BACKGROUND_JOB_CONFIG` | Default interval and batch settings for background retry work. |

---

## 6. BOUNDARIES AND FLOW

Boundaries:

- Own embedding helper access and failed-embedding retry orchestration.
- Do not own chunking, search fusion, score ranking or user-facing response envelopes.
- Keep provider selection in the shared embedding package unless MCP retry behavior needs local state.
- Keep background work opt-in through exported start and stop functions.

Retry flow:

```text
╭──────────────────────────────────────────╮
│ Embedding generation fails               │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Retry row enters pending or retry state  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Backoff window decides eligibility       │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ retryEmbedding calls provider helpers    │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ Row becomes success, retry or failed     │
╰──────────────────────────────────────────╯
```

---

## 7. ENTRYPOINTS

| Entrypoint | File | Used For |
|---|---|---|
| `generateDocumentEmbedding` | `embeddings.ts` | Build an embedding for indexed document content. |
| `generateQueryEmbedding` | `embeddings.ts` | Build an embedding for semantic search queries. |
| `getRetryQueue` | `retry-manager.ts` | Load rows eligible for retry. |
| `getFailedEmbeddings` | `retry-manager.ts` | Inspect permanently failed rows. |
| `getRetryStats` | `retry-manager.ts` | Read persisted retry queue counts. |
| `getEmbeddingRetryStats` | `retry-manager.ts` | Read in-memory retry health. |
| `retryEmbedding` | `retry-manager.ts` | Retry one record. |
| `processRetryQueue` | `retry-manager.ts` | Retry a batch of records. |
| `startBackgroundJob` | `retry-manager.ts` | Start interval-based retry processing. |
| `stopBackgroundJob` | `retry-manager.ts` | Stop interval-based retry processing. |

---

## 8. VALIDATION

Run from the repository root:

```bash
pnpm --dir .opencode/skills/system-spec-kit typecheck
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/mcp_server/lib/providers/README.md
```

---

## 9. RELATED

| Resource | Relationship |
|---|---|
| [../contracts/README.md](../interfaces/README.md) | Shared data shapes used by provider-facing paths. |
| [../search/README.md](../search/README.md) | Vector search path that consumes embeddings. |
| [../storage/README.md](../storage/README.md) | Database rows used by retry state. |
| [../README.md](../README.md) | Parent library map. |
