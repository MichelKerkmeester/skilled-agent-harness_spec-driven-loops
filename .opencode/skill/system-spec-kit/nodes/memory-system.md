---
description: "Details on the integrated Spec Kit Memory MCP server (vector search, tiers, chunking)."
---
# Spec Kit Memory System

### Spec Kit Memory System (Integrated)

Context preservation across sessions via hybrid search (vector similarity + BM25 + FTS with Reciprocal Rank Fusion).

**Server:** `@spec-kit/mcp-server` v1.7.2 — `context-server.ts` (~903 lines) with 11 handler files, 17 lib subdirectories, and 22 MCP tools across 7 layers.

**MCP Tools (8 most-used of 22 total — see [memory_system.md](./references/memory/memory_system.md) for full reference):**

| Tool                            | Layer | Purpose                                           |
| ------------------------------- | ----- | ------------------------------------------------- |
| `memory_context()`              | L1    | Unified entry point — modes: auto, quick, deep, focused, resume |
| `memory_search()`               | L2    | Hybrid search (vector + FTS + BM25 with RRF fusion). With optional adaptive fusion (SPECKIT_ADAPTIVE_FUSION) and artifact-class routing |
| `memory_match_triggers()`       | L2    | Trigger matching + cognitive (decay, tiers, co-activation) |
| `memory_save()`                 | L2    | Index a memory file with pre-flight validation    |
| `memory_list()`                 | L3    | Browse stored memories with pagination            |
| `memory_delete()`               | L4    | Delete memories by ID or spec folder              |
| `checkpoint_create()`           | L5    | Create gzip-compressed checkpoint snapshot        |
| `checkpoint_restore()`          | L5    | Transaction-wrapped restore with rollback         |

> Other tools: `memory_stats()` (L3), `memory_health()` (L3), `memory_update()` (L4), `memory_validate()` (L4), `checkpoint_list/delete()` (L5), `task_preflight/postflight()` (L6), `memory_drift_why/causal_link/causal_stats/causal_unlink()` (L6), `memory_index_scan()` (L7), `memory_get_learning_history()` (L7). Full tool names use `spec_kit_memory_` prefix.

**memory_context() — Mode Routing:**

| Mode | Token Budget | When `mode=auto`: Intent Routing |
| --- | --- | --- |
| `quick` | 800 | — |
| `deep` | 2000 | `add_feature`, `refactor`, `security_audit` |
| `focused` | 1500 | `fix_bug`, `understand` |
| `resume` | 1200 | — |

**memory_search() — Key Rules:**
- **REQUIRED:** `query` (string) OR `concepts` (2-5 strings). `specFolder` alone causes E040 error.
- Use `anchors` with `includeContent: true` for token-efficient section retrieval (~90% savings).
- Intent weights auto-adjust scoring: `fix_bug` boosts recency, `security_audit` boosts importance, `refactor`/`understand` boost similarity.
- **Full parameter reference:** See [memory_system.md](./references/memory/memory_system.md)

**Epistemic Learning:** Use `task_preflight()` before and `task_postflight()` after implementation to measure knowledge gains. Learning Index: `LI = (KnowledgeDelta × 0.4) + (UncertaintyReduction × 0.35) + (ContextImprovement × 0.25)`. Review trends via `memory_get_learning_history()`. See [epistemic-vectors.md](./references/memory/epistemic-vectors.md).

**Key Concepts:**
- **Constitutional tier** — 3.0x search boost + 2.0x importance multiplier; merged into normal scoring pipeline
- **Document-type scoring** — 11 document types with multipliers: spec (1.4x), plan (1.3x), constitutional (2.0x), memory (1.0x), readme (0.8x), scratch (0.6x). 7 intent types including `find_spec` and `find_decision` for spec document retrieval
- **Decay scoring** — FSRS v4 power-law model; recent memories rank higher
- **Import-path hardening** - Spec 126 fixed MCP import-path regressions in memory runtime modules (including context server + attention decay wiring)
- **Metadata preservation pipeline** - `memory_save` update/reinforce paths preserve `document_type` and `spec_level`, and vector-index metadata updates stay in sync
- **Causal edge stability** - conflict-update semantics keep causal edge IDs stable during re-link and graph maintenance operations
- **Real-time sync** — Use `memory_save` or `memory_index_scan` after creating files
- **Checkpoints** — Gzip-compressed JSON snapshots of memory_index + working_memory; max 10 stored; transaction-wrapped restore
- **Indexing persistence** — After `generate-context.js`, call `memory_index_scan()` or `memory_save()` for immediate MCP visibility
- **Artifact routing** — 9 artifact classes (spec, plan, tasks, checklist, decision-record, implementation-summary, memory, research, unknown) with per-type retrieval strategies applied at query time
- **Adaptive fusion** — Intent-aware weighted RRF with 7 task-type profiles (fix_bug, add_feature, understand, refactor, security_audit, find_spec, find_decision). Enabled via feature flag `SPECKIT_ADAPTIVE_FUSION` (default: off)
- **Retrieval trace** — Typed ContextEnvelope wraps every retrieval response with pipeline stages and a DegradedModeContract describing fallback behavior
- **Mutation ledger** — Append-only audit trail for all memory mutations (create, update, delete, reinforce); implemented via SQLite triggers; queryable for compliance and rollback
- **Retrieval telemetry** — 4-dimension metrics (latency, retrieval mode, fallback activation, quality score). Enabled via feature flag `SPECKIT_EXTENDED_TELEMETRY` (default: on)

**Feature Flags:**

| Flag                          | Default | Effect                                                                                      |
| ----------------------------- | ------- | ------------------------------------------------------------------------------------------- |
| `SPECKIT_ADAPTIVE_FUSION`     | off     | Enables intent-aware weighted RRF with 7 task-type profiles in `memory_search()`            |
| `SPECKIT_EXTENDED_TELEMETRY`  | on      | Emits 4-dimension retrieval metrics (latency, mode, fallback, quality) per search operation |

Set via environment variable before starting the MCP server (e.g., `SPECKIT_ADAPTIVE_FUSION=1`).

> **Token budgets per layer:** L1:2000, L2:1500, L3:800, L4:500, L5:600, L6:1200, L7:1000 (enforced via `chars/4` approximation).

**Full documentation:** See [memory_system.md](./references/memory/memory_system.md) for tool behavior, importance tiers, and configuration.

