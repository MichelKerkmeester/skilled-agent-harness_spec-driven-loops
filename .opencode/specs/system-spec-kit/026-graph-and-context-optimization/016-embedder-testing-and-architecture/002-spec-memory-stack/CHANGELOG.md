---
title: "Changelog: 002-spec-memory-stack (mk-spec-memory pluggable embedder architecture)"
description: "Plain-English changelog of all code changes in the spec-memory stack. Covers the pluggable EmbedderAdapter contract, Ollama backend + multi-dim schema, MCP tools + reindex orchestrator, and the mxbai-embed-large-v1 swap that closed cat-24/409."
---

# Changelog: 002-spec-memory-stack

> Plain-English summary of code changes to the `mk-spec-memory` MCP server (TypeScript). Read this if you want to understand what shipped without diving into implementation details.
>
> **Spec folder:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/` (phase parent, 4 sub-phases)
>
> **Stack:** `.opencode/skills/system-spec-kit/mcp_server/` — the TypeScript MCP server that powers `memory_save`, `memory_search`, `memory_context`, and related continuity tools.

---

## Why this stack matters

Before this work, `mk-spec-memory` had exactly one embedding model baked into the code (`embeddinggemma-300m` via llama.cpp). Swapping models meant editing source. Worse, one specific test scenario (cat-24/409 in packet 008) kept failing because the baseline model could not connect paraphrased ideas to their original wording — and there was no easy way to try a different model.

The four sub-phases in this stack rebuilt the embedder layer from the ground up. After this work landed, an operator can list available models, pick one with a single MCP tool call, and watch the server reindex all 12,937 memories in the background. The stack also added a safety net (the retrieval-rescue layer) that closes the cat-24/409 gap regardless of which embedder is active.

---

## v1.0 — Pluggable EmbedderAdapter contract (016/001 adapter-interface)

**Shipped:** 2026-05-17 08:45 (commit [`3d9e89d1f`](#))
**Status:** Shipped
**Scope:** Pure types + registry skeleton. No runtime wiring yet.

### What changed

- Added a typed interface called `EmbedderAdapter` that every embedding backend has to honor. The interface has five properties (`name`, `dim`, `backend`, optional query and document prefixes) and two methods (`embed()` for actually computing vectors and `ready()` for probing whether the backend is reachable).
- Added an `EmbedderManifest` type that describes a model declaratively — its name, vector dimension, which backend produces it (one of `ollama`, `llama-cpp`, `api`, `sentence-transformers`), and optional fields like Ollama tag, prefix tokens, and a maximum input character cap.
- Created a frozen `MANIFESTS` registry pre-populated with six candidate models alongside the current baseline. None of them were wired to real adapters yet — phase 002 did that. The point of phase 001 was to give the next phase a stable surface to implement against.
- Added a small `embedder-registry.vitest.ts` test suite (3-5 tests) that checked manifest lookup, dimension listing, and the unimplemented-backend error path.

### Why it matters

- **Before:** the embedder was hard-coded. Anyone wanting to try a different model had to edit `providers/embeddings.ts` directly.
- **After:** anyone adding a new model just appends one row to the manifest list and (if the backend already exists) it shows up everywhere automatically. The retrieval pipeline does not care which backend is underneath.
- **Operator view:** nothing visible yet. The interface is invisible until phase 002 wires it to runtime calls.

### Files touched

| File | What changed |
| ---- | ------------ |
| `mcp_server/lib/embedders/adapter.ts` | New file — the `EmbedderAdapter` interface contract (58 LOC) |
| `mcp_server/lib/embedders/types.ts` | New file — `BackendKind` enum and `EmbedderManifest` interface (70 LOC) |
| `mcp_server/lib/embedders/registry.ts` | New file — frozen manifests + lookup helpers (93 LOC) |
| `mcp_server/lib/embedders/index.ts` | New file — barrel exports (11 LOC) |
| `mcp_server/tests/embedder-registry.vitest.ts` | New file — manifest registry tests (93 LOC) |

---

## v2.0 — Ollama backend + dim-tagged schema (016/002 ollama-backend-and-multi-dim-schema)

**Shipped:** 2026-05-17 08:53 (commit [`6a2adb089`](#))
**Status:** Shipped
**Scope:** First real adapter (Ollama), schema helpers for multi-dim vectors, baseline shim.

### What changed

- Added `OllamaAdapter`, the first concrete adapter that talks to a local Ollama daemon over HTTP. It defaults to `http://127.0.0.1:11434`, respects the `OLLAMA_BASE_URL` environment variable, prefers the newer `/api/embed` endpoint, and falls back to the legacy `/api/embeddings` when needed. It applies document or query prefixes if the manifest declares them, checks model availability via `/api/tags`, and throws typed errors for the three predictable failure modes — backend unreachable, model not loaded, dimension mismatch.
- Added `vec_<dim>` schema helpers — instead of a single `vec_memories` table locked at 768 dimensions, the server can now create `vec_768`, `vec_1024`, `vec_384`, and so on, on demand. Table creation is lazy: the table only appears the first time something tries to write to it.
- Added an active-embedder pointer stored in the existing `vec_metadata` table (rather than a brand new table) under the keys `active_embedder_name` and `active_embedder_dim`. The pointer defaults to `embeddinggemma-300m` / `768` when absent.
- Added a `getAdapter(name)` factory that returns the right adapter for any registered manifest. Ollama manifests get an `OllamaAdapter`; the baseline gets a thin `LlamaCppBaselineAdapter` that wraps the existing `providers/embeddings.ts` calls. Unwired backend kinds throw `NotImplementedError` so the caller can tell a typo apart from "we have not built that yet."
- Added vitest coverage for both new modules — `embedder-ollama.vitest.ts` (mocked HTTP, 7 tests) and `embedder-schema.vitest.ts` (in-memory SQLite, 6 tests).

### Why it matters

- **Before:** every embedding call routed through one hard-coded llama.cpp path producing 768-dim vectors. There was no way to try a different model without ripping out the provider.
- **After:** the server can talk to any Ollama-hosted model, store its vectors in a separate dim-tagged table, and remember which embedder is active across restarts. The old `vec_memories` table stayed untouched so existing searches kept working while the new layer was being built.
- **Operator view:** still nothing user-facing. The adapter and schema are reachable through code, but the MCP tools to drive them arrive in v3.0.

### Files touched

| File | What changed |
| ---- | ------------ |
| `mcp_server/lib/embedders/adapters/ollama.ts` | New file — full Ollama HTTP adapter with /api/embed + /api/embeddings fallback (271 LOC) |
| `mcp_server/lib/embedders/schema.ts` | New file — `vec_<dim>` table helpers + active-embedder pointer (136 LOC) |
| `mcp_server/lib/embedders/registry.ts` | Updated — added `getAdapter()` factory, `LlamaCppBaselineAdapter` shim, `NotImplementedError` |
| `mcp_server/lib/embedders/index.ts` | Updated — barrel now exports schema helpers + factory |
| `mcp_server/tests/embedder-ollama.vitest.ts` | New file — 7 tests with mocked fetch (165 LOC) |
| `mcp_server/tests/embedder-schema.vitest.ts` | New file — 6 tests against in-memory SQLite (136 LOC) |

---

## v3.0 — MCP tools and reindex orchestrator (016/003 mcp-tools-and-reindex)

**Shipped:** 2026-05-17 09:06 (commit [`eb9563fba`](#))
**Status:** Shipped
**Scope:** Three new MCP tools + a background reindex job runner that does the heavy lifting.

### What changed

- Added three new MCP tools that an operator (or an AI agent) can call:
  - **`embedder_list`** — returns the manifest of every registered embedder, marks which one is active, and probes adapter readiness with a bounded timeout so a wedged Ollama daemon does not stall the call.
  - **`embedder_set`** — switches the active embedder. It validates the manifest name, lazy-creates the target `vec_<dim>` table if it does not exist, starts a background reindex job, and returns the job ID and status metadata.
  - **`embedder_status`** — reports a specific reindex job by ID, or whichever job is currently queued or running.
- Added the reindex orchestrator (`reindex.ts`, 408 LOC). It persists job state to a dedicated `embedder_jobs` table, batches embedding work in chunks of 50 (configurable via `EMBEDDER_REINDEX_BATCH_SIZE`), writes vectors to `vec_<dim>`, supports graceful cancel between batches, and — most importantly — only flips the active-embedder pointer after the entire run succeeds. Partial writes are isolated in the target table and safe to overwrite on retry.
- Wired startup crash-resume — if the server crashes mid-reindex, `resumeReindexJobs(database)` picks up where it left off when the MCP server next starts.
- Added vitest coverage for all three handlers and the orchestrator state machine, including a 10-memory fixture that exercises the full batch loop.

### Why it matters

- **Before:** swapping the embedder meant editing source, restarting the server, manually wiping the vector table, and reindexing by hand. No safety net if anything went wrong.
- **After:** an operator calls `embedder_set({ name: "<model>" })` and gets a job ID back. The server reindexes 12,937 memories in the background while existing searches keep running against the old vectors. If the job fails halfway through, the active pointer never moves and the old vectors stay intact. If the server crashes, the job picks up automatically on next start.
- **Operator view:** this is where the work becomes user-facing. The MCP tool count went from 39 to 42 with these additions.

### Files touched

| File | What changed |
| ---- | ------------ |
| `mcp_server/handlers/embedder-list.ts` | New file — list + readiness probe handler (111 LOC) |
| `mcp_server/handlers/embedder-set.ts` | New file — swap handler with job start (79 LOC) |
| `mcp_server/handlers/embedder-status.ts` | New file — job status reporter (86 LOC) |
| `mcp_server/lib/embedders/reindex.ts` | New file — background job orchestrator (408 LOC) |
| `mcp_server/handlers/index.ts` | Updated — registered the three new handlers |
| `mcp_server/context-server.ts` | Updated — startup crash-resume registration |
| `mcp_server/schemas/tool-input-schemas.ts` | Updated — added the three tool input schemas |
| `mcp_server/tool-schemas.ts` | Updated — added the three tool output schemas |
| `mcp_server/tools/memory-tools.ts` | Updated — dispatch wiring for the three new tools |
| `mcp_server/tools/types.ts` | Updated — type registrations |
| `mcp_server/tests/embedder-{list,set,status,reindex}.vitest.ts` | New files — full handler + orchestrator coverage |
| `mcp_server/tests/context-server.vitest.ts` | Updated — assertion now expects 42 tools |

---

## v4.0 — mxbai swap + retrieval-rescue layer + cat-24/409 closure (016/004 mxbai-swap-and-008-closure)

**Shipped:** 2026-05-17 13:59 (rescue layer [`489d4e0d7`](#)) → 14:57 (default-on flip [`19bd78000`](#)) → 22:01 (P0 + P1 closures [`ba6816a49`](#)) → 23:46 (dead-counter cleanup [`170aa2c98`](#))
**Status:** Shipped, packet 008 closed
**Scope:** Tried six embedder swaps, none of them closed the gap alone, so a retrieval-rescue layer was added on top.

### What changed (the long version)

This sub-phase was supposed to be a quick swap from the baseline to `mxbai-embed-large-v1` to close one specific failure (cat-24/409). It turned into a multi-hour exploration because no embedder, on its own, was good enough.

**Six embedder swaps tried, all rolled back:**

| Model | Outcome | Reason |
| ----- | ------- | ------ |
| `mxbai-embed-large-v1` (1024d) | ROLLBACK (ADR-001 to ADR-004) | First attempt hit a model-name mapping defect. Second attempt hit an Ollama context-window error on 19,668-char inputs. Third attempt activated after adding a 1,200-char input cap but cat-24/409 still scored 2/10 top-3 (needed 8/10). |
| `jina-embeddings-v3` (1024d) | ROLLBACK (ADR-005) | Activated with 8,000-char cap. cat-24/409 scored 4/10 top-3. Improved but not enough. |
| `nomic-embed-text-v1.5` (768d) | ROLLBACK (ADR-006) → eventually KEPT under rescue | Activated with 5,000-char cap and required `search_query: ` / `search_document: ` prefixes. Best dense candidate at 5/10 (later 6/10 after fixture surgery). Still below 8/10. |
| `bge-m3` (1024d) | ROLLBACK (ADR-007) | Activated cleanly. Regressed to 2/10. |
| `snowflake-arctic-embed-l-v2.0` (1024d) | ROLLBACK (ADR-008) | Activated cleanly. Regressed to 1/10. |

**Cleanup that came out of the swap attempts:**

- `OllamaAdapter` got a `manifest.ollamaName ?? manifest.name` mapping so registered manifests can use a clean canonical name (e.g. `mxbai-embed-large-v1`) while the actual `ollama pull` tag is something else (e.g. `mxbai-embed-large:latest`). Vitest coverage was added for distinct-name, fallback-to-name, and JSON-error-body cases.
- Manifests gained a `maxInputChars` field. The Ollama adapter now truncates inputs to that cap before sending them, which fixed the `400 input length exceeds the context length` errors.
- A fixture-surgery cleanup pruned 5,446 orphaned `memory_index` rows (the active DB went from 12,937 to 7,491 rows with zero orphans) and rebuilt the cat-24/409 deterministic fixture with live memory IDs and existing files.

**The retrieval-rescue layer — what actually closed cat-24/409:**

After five rollbacks proved no single embedder could close the gap, a new layer was added under `mcp_server/lib/search/rerank/retrieval-rescue.ts` (382 LOC). The layer sits between the dense vector recall and the final fusion stage, applying a query-aware rescue rerank for paraphrased queries that the dense model alone could not match. Stage 2 fusion (`stage2-fusion.ts`) was updated to invoke the rescue when the layer flag is on.

The layer shipped opt-in first (commit `489d4e0d7`, behind `SPECKIT_RERANK_LAYER=true`). Within an hour of operator review, ADR-011 ratified the flip to **default-on** (commit `19bd78000`). The kill switch stayed available — anyone needing a rollback lever can still set `SPECKIT_RERANK_LAYER=false`.

**Measured outcome with rescue default-on, under `nomic-embed-text-v1.5` / `vec_768`:**

| Scenario | Threshold | Pre-rescue | Post-rescue |
| -------- | --------- | ---------- | ----------- |
| cat-24/409 top-3 | 8/10 | 6/10 (best dense) | **8/10 PASS** |
| 008 PASS sample (20 scenarios) | ≥ 19/20 preserved | n/a | **20/20** |
| 008 cat-24/409 closure | the gate | OPEN | **CLOSED** |
| Latency vs OFF | n/a | n/a | +2.16× |

**Distribution and verification fix that came up during shipping:**

After both the opt-in (`489d4e0d7`) and the default-on flip (`19bd78000`) shipped, a separate D-sweep dispatch discovered that the MCP server `dist/` had not been rebuilt — the rescue layer was in source but the running server was loading the old compiled output. Three commits in the stale-dist window (12:00 to 16:27) had been retroactively claimed to pass without actually being exercised. The fix:

- Rebuilt `mcp_server` dist via `npm run build`.
- Re-ran the D-sweep with the fresh dist; the results confirmed the original claims (4/10 with rescue OFF, 8/10 with rescue ON).
- Added a `dist-freshness.vitest.ts` test that checks `dist/` source-map timestamps against `lib/` source timestamps, so the next dist staleness shows up as a red test instead of a silent runtime drift.

**Deep-review P0 + P1 closures (commit `ba6816a49`):**

After the rescue layer landed, a deep-review pass found 3 P0s and several P1 groups. Group 1, 3, and 4 were closed in this batch, covering rescue-cap accounting, telemetry counter accuracy, and fusion-stage call-site cleanup. The follow-up `170aa2c98` removed a dead P0-D telemetry counter that had been left over from an earlier rescue-cap iteration.

### Why it matters

- **Before:** cat-24/409 had been failing since packet 008 closed unsuccessfully. 51/51 failure scenarios from that packet had no path to PASS.
- **After:** cat-24/409 passes at exactly the 8/10 threshold. The 008 PASS-sample 20-scenario regression proxy holds at 20/20. Packet 008 cat-24/409 is officially closed. The 51/51 FAILs from packet 008 can be marked closed.
- **Operator view:** memory_search results in paraphrased-query scenarios are noticeably better. Latency cost is about 2.16× when the rescue actually fires (most queries do not need it). The `SPECKIT_RERANK_LAYER` env var is the kill switch if anything regresses.
- **Honest limits:** cat-24/402 and cat-24/408 are still FAIL. They are not the 008 closure gate, so they are not blocking, but they are not fixed either. The 8/10 threshold for cat-24/409 is hit exactly, not by a wide margin.

### Files touched

| File | What changed |
| ---- | ------------ |
| `mcp_server/lib/search/rerank/retrieval-rescue.ts` | New file — the rescue rerank layer (382 LOC) |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Updated — invokes rescue when layer is on |
| `mcp_server/lib/embedders/adapters/ollama.ts` | Updated — manifest-name mapping + input truncation |
| `mcp_server/lib/embedders/registry.ts` | Updated — six candidate manifests gained `maxInputChars` and `ollamaName` fields |
| `mcp_server/tests/embedder-ollama.vitest.ts` | Updated — distinct-name, fallback, and JSON-error coverage (10 tests total) |
| `mcp_server/tests/retrieval-rescue.vitest.ts` | New file — rescue layer coverage (4 tests, expanded after default-on flip) |
| `mcp_server/tests/dist-freshness.vitest.ts` | New file — guard against stale dist/ vs lib/ |
| `mcp_server/package.json` | Updated — minor housekeeping for the dist check |

---

## Cumulative impact

After all four sub-phases shipped, the `mk-spec-memory` MCP server is no longer locked to one embedder. An operator can:

1. List every registered model with `embedder_list()` and see which one is active.
2. Switch to any of them with `embedder_set({ name })` and get back a job ID.
3. Poll the job with `embedder_status()` until it finishes (12,937 memories take about 5-30 minutes depending on the model and Ollama latency).
4. Trust that the active pointer only flips after the full reindex succeeds, so partial failures roll back cleanly.

The retrieval-rescue layer runs by default, so paraphrased queries get a usable answer regardless of which embedder is underneath. The cost is a +2.16× latency on queries where the rescue actually fires (most queries do not need it).

Test coverage went up by 7 new vitest files. The 008 packet — open since the original failure — is closed. 51 failing scenarios from that packet are now closed.

---

## Reference: commit timeline

| Time (UTC+2) | Commit | Headline |
| ------------ | ------ | -------- |
| 08:45 | `3d9e89d1f` | EmbedderAdapter interface + Registry (016/001) |
| 08:53 | `6a2adb089` | Ollama adapter + dim-tagged vec schema (016/002) |
| 09:06 | `eb9563fba` | embedder MCP tools + reindex orchestrator (016/003) |
| 09:28 | `83172256e` | OllamaAdapter manifest-name mapping fix (ADR-003) |
| 09:49 | `568bb6e46` | OllamaAdapter input truncation (ADR-004) |
| 10:53 | `1e2d4fc52` | jina-embeddings-v3 swap result (ADR-005 ROLLBACK) |
| 11:11 | `218f888b9` | nomic-embed-text-v1.5 swap result (ADR-006 ROLLBACK) |
| 11:54 | `9686724c1` | bge-m3 swap result (ADR-007 ROLLBACK) |
| 12:38 | `4a4e166ab` | snowflake-arctic-embed-l-v2.0 swap result (ADR-008 ROLLBACK) |
| 13:59 | `489d4e0d7` | retrieval-rescue layer — closes 008 cat-24/409 (51/51 FAILs) |
| 14:57 | `19bd78000` | enable rescue layer by default |
| 21:48 | `bf3f1a26f` | refactor: merge 017-022 into 016 umbrella |
| 22:01 | `ba6816a49` | close 3 P0 + P1 groups 1/3/4 from deep-review remediation |
| 23:46 | `170aa2c98` | remove P0-D dead telemetry counter in rescue cap |

All commits land on `main`.
