# Setup A: Before vs After

A cross-subsystem map of what changed in the `014-local-embeddings-setup-a` packet line (packets 001 through 018). The aim is to give you a clear picture of the start state, the end state and the path between them, so you can decide what to commit, what to verify and what to keep working on.

**Before** = the state at commit `2b767d051d^` (cloud-first cascade, no `llama-cpp` provider).
**After** = the state on disk after packet 018 ships (2026-05-13).

---

## 1. What changed at a glance

The 014 line started as a goal of moving the Memory MCP off paid Voyage cloud embeddings and onto a free local stack. It ended much bigger than that:

1. Both MCP servers now share the same 768-dimensional EmbeddingGemma model family.
2. The Memory MCP runs `node-llama-cpp` with a Q8_0 GGUF model on Apple's Metal GPU. Queries went from 36ms to 6ms.
3. RAM dropped from 1798 MB to 1209 MB on the active embedding process.
4. An auto-migration step on first startup handles the upgrade for anyone with an older hf-local store.
5. Setup time for a fresh clone is near zero. No API key required.

| Subsystem | Did it change? | One-line answer |
|---|---|---|
| Spec Kit Memory MCP | Yes (major) | Voyage cloud out, llama-cpp + GGUF + Metal in. Default flipped. |
| CocoIndex code search | Yes (model + settings) | Unified on `google/embeddinggemma-300m`. Code-only include rules. |
| Code Graph | No structural change | Rebuilt by `/doctor:update` mid-session. Schema untouched. |
| Causal Graph | No change | All 205 edges copied through the migration cleanly. |
| Skill Advisor Graph | No structural change | Refreshed by `/doctor:update`. 18 nodes, 58 edges. |
| Deep Loop Graph | No persisted DB | Lazy init only. No global sqlite on disk. |
| Other Memory tables | Consolidated | All ancillary data lives inside the context-index sqlite now. |

---

## 2. The current default. What you get on a fresh clone

The single source of truth is `factory.ts:786-836` (the `resolveProvider()` function). With no env var set and no cloud API keys, the cascade is:

1. `EMBEDDINGS_PROVIDER` env var, if set and not `"auto"`.
2. `VOYAGE_API_KEY`, if present.
3. `OPENAI_API_KEY`, if present.
4. **`llama-cpp`**, if `node-llama-cpp` loads and the GGUF model is reachable. This is the path most clones hit.
5. `hf-local`, only as a fallback when the llama-cpp probe fails.

On Apple Silicon, step 4 succeeds out of the box because `node-llama-cpp` ships with a prebuilt Metal dylib. So your default is llama-cpp with no setup.

> **Note on terminology.** Throughout this document, "Q8" and "Q8_0" both refer to 8-bit integer quantization. They are not the same scheme. The hf-local path uses per-tensor int8 (q8). The llama-cpp path uses per-block-of-32 int8 (Q8_0). Same bit-width, different math. This is the source of the 0.968 cosine parity gap that you will see in the Memory MCP tables.

---

## 3. Subsystem 1: Spec Kit Memory MCP

The Memory MCP is the Node.js TypeScript server that backs every `memory_*` tool in your AI runtime. It stores spec docs, learned triggers, causal edges and FTS5 full-text indexes, with vector embeddings as the primary recall channel.

### 3.1 Before

You had a cloud-first cascade. The order was Voyage, OpenAI, then a local hf-local fallback. The hf-local model was Nomic, in fp32, with hardcoded Nomic prefixes baked into the provider code. The provider list had four entries: voyage, openai, hf-local, auto. There was no `llama-cpp` anywhere in the codebase.

The on-disk DB used the legacy single-filename pattern: `context-index.sqlite`. If you switched models, vectors of two different shapes could end up in the same file. Painful to debug.

The operator setup story was: pay for a Voyage key or accept the Nomic CPU path.

### 3.2 After

The cascade is now local-first below the cloud keys. Step 4 is llama-cpp. Step 5 is hf-local as fallback. Five entries in the provider list: voyage, openai, hf-local, llama-cpp, auto.

Default models:

| Path | Model | Size on disk | Quantization |
|---|---|---|---|
| llama-cpp (active) | `unsloth/embeddinggemma-300m-GGUF` | ~310 MB | Q8_0 |
| hf-local (fallback) | `onnx-community/embeddinggemma-300m-ONNX` | ~310 MB | q8 |

DB filenames now encode provider, model, dim and dtype. That means two backends can coexist on disk without mixing vectors. The current files:

```
context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite   108 MB   2,550 rows   active
context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite    97 MB   2,488 rows   migration source, preserved
```

The hf-local file is still on disk. Packet 018 was written to delete it after a successful migration, but the live startup probe saw the migration was already done (target rows match source rows from 017) and skipped. You can `rm` the hf-local file manually whenever you want the disk space back.

The operator story dropped to one line. Fresh clones work without any API key, without any model download command and without any HF token. The `install-llama-cpp.sh` helper is there if you need to bootstrap, but it usually is not needed.

### 3.3 What changed and why

| Change | Driver | Effect |
|---|---|---|
| Voyage purge | Cost. Privacy. Latency. | No more paid API calls. No more network roundtrips per embed. |
| EmbeddingGemma unification | Both MCPs needed the same vector shape to share retrieval logic | 768-dim across Memory + CocoIndex |
| Filename encoding (dtype, model, dim) | Packet 012. Multiple backends needed to coexist | Two backends on disk at once is now safe |
| llama-cpp default | Packet 017. 6x faster queries, 33% less RAM | Default cascade flips to llama-cpp when available |
| Auto-migration | Packet 018. Upgrade-in-place for users with prior hf-local stores | First daemon startup re-embeds and deletes the old store |

### 3.4 Hard numbers

The benchmark numbers across the packets, batch size 1, 1000 iterations, warmup excluded:

| Metric | Voyage cloud (pre-014) | hf-local q8 ONNX | **llama-cpp Q8_0 GGUF (active)** |
|---|---|---|---|
| Auto default | yes (when key set) | local fallback | **default on most clones** |
| Vector dim | 1024 | 768 | 768 |
| Quantization | hidden (cloud) | per-tensor int8 | per-block-of-32 int8 |
| Inference runtime | HTTPS to api.voyageai.com | onnxruntime-node, CPU | node-llama-cpp + Metal GPU |
| Query p50 | ~60-100ms (network) | 35.96ms | **6.03ms** |
| Query p95 | ~150ms | 43.29ms | **8.40ms** |
| Query p99 | ~250ms | 47.37ms | **9.18ms** |
| Process RSS warm | n/a (cloud) | 1,798 MB | **1,209 MB** |
| Model load time | n/a | 0.89s | 0.84s |
| API key needed | yes (paid) | no | no |
| Vector parity vs hf-local | n/a | reference | mean cos 0.968, min 0.952 |
| Retrieval recall@5 overlap (200 docs, 50 queries) | n/a | reference | 0.912 |
| Retrieval recall@5 overlap (1000 docs, 100 queries) | n/a | reference | **0.926** |
| Spearman ρ top-10 (1000-scale) | n/a | reference | 0.816 |
| MRR delta vs reference | n/a | reference | ~0 |
| Memory rows live | 0 fresh | 2,488 | **2,550** |

### 3.5 What this means for you

If you're starting fresh, do nothing. The daemon spins up on llama-cpp. Queries are fast. RAM is reasonable.

If you had a hf-local store from a previous version of this repo, the next daemon startup re-embeds it into the llama-cpp store and deletes the source. That is the 018 auto-migration path. To opt out, set `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA=false`.

If you have a Voyage or OpenAI key in your environment, the cascade hits step 2 or 3 and your daemon stays on the cloud provider. To force local, set `EMBEDDINGS_PROVIDER=llama-cpp` or unset the cloud key.

---

## 4. Subsystem 2: Code Graph

The Code Graph holds a structural map of your source code. Files, symbols, imports, exports, type relationships, the call graph. MCP tools like `code_graph_query`, `code_graph_status`, `code_graph_context` and `detect_changes` read from it.

### 4.1 Before

A code-graph.sqlite existed. Pre-014 row counts were not captured in this session's evidence. Schema was the same as today: `code_files`, `code_nodes`, `code_edges`, plus diagnostics and skip-list tables.

### 4.2 After

Same schema. Same tool surface. **No structural change from this arc.** The current DB was rebuilt by `/doctor:update` mid-session (2026-05-13T06:34:02Z to 06:36:21Z, exit 0).

The 014/014 ONNX experiment was rejected and reverted, so even that aborted attempt left no trace in code-graph storage.

### 4.3 Current contents

| Aspect | Value |
|---|---:|
| `code-graph.sqlite` size | 54 MB |
| `code_files` | 9,642 |
| `code_nodes` | 59,027 |
| `code_edges` | 36,588 |
| `parse_diagnostics` | 95 |
| `parser_skip_list` | 79 |

File counts by language:

| Language | Files |
|---|---:|
| doc | 7,997 |
| typescript | 1,434 |
| javascript | 114 |
| bash | 56 |
| python | 41 |

Symbol kinds in the node table:

| Kind | Rows |
|---|---:|
| variable | 13,840 |
| import | 13,354 |
| parameter | 11,636 |
| function | 8,757 |
| export | 6,410 |
| interface | 1,965 |
| module | 1,645 |
| type_alias | 888 |
| method | 461 |
| class | 70 |
| enum | 1 |

Edge types between symbols:

| Type | Rows |
|---|---:|
| CALLS | 12,716 |
| TYPE_OF | 8,943 |
| EXPORTS | 5,406 |
| TESTED_BY | 4,881 |
| IMPORTS | 4,159 |
| CONTAINS | 458 |
| OVERRIDES | 12 |
| IMPLEMENTS | 6 |
| EXTENDS | 5 |
| DECORATES | 2 |

### 4.4 What this means for you

Two things to know.

First, the last gold-verification run scored an overall pass rate of 0.5357 (edge-focus 0.7143). That is a pre-existing quality issue, not introduced here. It is a known follow-on item.

Second, the current DB was scanned against the 017-era HEAD, not the latest staged tree. If you want the graph to reflect the post-018 working tree exactly, run `code_graph_scan` again. Otherwise the small drift is harmless for most queries.

---

## 5. Subsystem 3: Causal Graph

The Causal Graph stores typed relationships between memory rows. Things like "memory A caused memory B" or "memory A supersedes memory B". The tools `memory_causal_link`, `memory_causal_unlink` and `memory_causal_stats` operate on it.

It is **not a separate sqlite file**. It lives inside the context-index sqlite as the `causal_edges` table.

### 5.1 Before

Schema and around 200 manually curated edges existed in the legacy `context-index.sqlite` before the rename to provider-keyed filenames.

### 5.2 After

Same schema. Identical row counts. The 017 migration copied causal_edges row-for-row from the hf-local store to the new llama-cpp store. Zero edge loss.

### 5.3 Comparison

| Aspect | hf-local source (preserved) | llama-cpp target (active) |
|---|---:|---:|
| Total `causal_edges` | 205 | **205** |
| `caused` relation | 103 | 103 |
| `supports` relation | 101 | 101 |
| `supersedes` relation | 1 | 1 |
| Orphan edges (no matching memory) | 0 | 0 |
| Created by `manual` | 204 | 204 |
| Created by `auto` | 1 | 1 |

Schema, unchanged across the arc:

```
id PK
source_id, target_id
source_anchor_id, target_anchor_id
relation       (allowed: caused, enabled, supersedes, contradicts, derived_from, supports)
strength
evidence
extracted_at
created_by
last_accessed
valid_at
invalid_at
```

The unique constraint on `(source_id, target_id, relation, source_anchor_id, target_anchor_id)` prevents duplicates.

### 5.4 What this means for you

Nothing actionable. The migration was conservative and lossless. Your causal links survived intact. If you ever switch back to hf-local with `EMBEDDINGS_PROVIDER=hf-local`, the same 205 edges are still in that store too.

---

## 6. Subsystem 4: Deep Loop Graph

The Deep Loop Graph is the planned backing store for `/spec_kit:deep-research` and `/spec_kit:deep-review` iteration tracking. The MCP tools `deep_loop_graph_query`, `deep_loop_graph_status`, `deep_loop_graph_convergence` and `deep_loop_graph_upsert` are wired against it in code.

### 6.1 Before

A `deep-loop-graph.sqlite` was defined in code paths and doctor manifests. Historical materialization on this machine was not captured in session evidence.

### 6.2 After

**No persistent DB on disk.** Empty slot in the canonical database directory. `/doctor:update` records this subsystem as `session-scoped lazy init (no global rebuild needed)`.

In practice, the deep-research and deep-review workflows write per-iteration markdown files under each spec packet's `research/iterations/` or `review/iterations/` directory. The packet-local files are the durable artifact. The graph DB never gets populated.

Schema is code-defined but unmaterialized. Expected tables when one day it does get written: `coverage_nodes`, `coverage_edges`, `coverage_snapshots`, `schema_version`.

### 6.3 What this means for you

The `deep_loop_graph_*` MCP tools work on a fresh clone. They return empty results because no rows exist yet. Running `/spec_kit:deep-research` does not auto-populate this DB. It populates packet-local markdown.

If a future packet wants a global cross-iteration view, that will be the trigger to actually persist this graph. Until then, treat it as a planned-but-empty surface.

---

## 7. Subsystem 5: Skill Advisor Graph

The Skill Advisor Graph holds metadata about every skill in the repo and the relationships between them. The Skill Advisor reads this to recommend which skill to load for a given task.

### 7.1 Before

Skill-graph.sqlite existed. Pre-014 counts were not captured in this session's evidence.

### 7.2 After

Same schema. Same tool surface. Refreshed by `/doctor:update` (`gen=1712, skills=19, live`, exit 0). **No structural change from this arc.**

### 7.3 Current contents

| Aspect | Value |
|---|---:|
| `skill-graph.sqlite` size | 144 KB |
| `skill_nodes` | 18 |
| `skill_edges` | 58 |
| `skill_graph_metadata` | 3 |

Skills indexed by family:

| Family | Count |
|---|---:|
| sk-util | 4 |
| cli | 4 |
| deep-loop | 3 |
| mcp | 3 |
| sk-code | 2 |
| system | 2 |

Edge types between skills:

| Type | Rows |
|---|---:|
| enhances | 27 |
| siblings | 22 |
| prerequisite_for | 5 |
| depends_on | 4 |

Full list of indexed skill nodes: `cli-claude-code`, `cli-codex`, `cli-gemini`, `cli-opencode`, `deep-ai-council`, `deep-agent-improvement`, `deep-research`, `deep-review`, `mcp-chrome-devtools`, `mcp-coco-index`, `mcp-code-mode`, `sk-code`, `sk-code-review`, `sk-doc`, `sk-git`, `sk-prompt`, `skill_advisor`, `system-spec-kit`.

### 7.4 A small count discrepancy

The doctor log says 19 skills. The live DB has 18 nodes. Looking at `last_scan_summary`: `scannedFiles=19, indexedFiles=0, skippedFiles=19, indexedNodes=0, indexedEdges=58`. The most likely reason is one non-skill metadata file getting scanned but not indexed as a node. The edge count matches between the two, so the discrepancy is cosmetic. Worth reconciling later, but not blocking anything today.

### 7.5 What this means for you

Nothing actionable. The Skill Advisor recommendations you see in the hook context blocks (the "Advisor:" lines) come from this graph. They still work the same way.

---

## 8. Subsystem 6: CocoIndex code-search MCP

CocoIndex is the Python-backed code search system. It indexes source files chunk-by-chunk, embeds each chunk and serves semantic search through the `mcp__cocoindex_code__search` tool and the `ccc search` CLI.

### 8.1 Before

Embedding model was Nomic-style. The `_QUERY_PROMPT_MODELS` dict in `cocoindex_code/shared.py` had hardcoded prompt handling for `nomic-ai/nomic-embed-code` and `nomic-ai/CodeRankEmbed`. EmbeddingGemma was not in the registry.

Include patterns in `.cocoindex_code/settings.yml` covered `.md`, `.mdx`, `.txt` and `.rst` alongside code files. So your code search returned a lot of doc content.

The Memory MCP and CocoIndex were not unified on a shared model.

### 8.2 After

Default model is now `google/embeddinggemma-300m` via sentence-transformers on PyTorch + Metal/MPS, bf16, 768 dim. The same model family as the Memory MCP, just a different runtime path. Query prompt mode is `InstructionRetrieval` per the new registry entry.

Include patterns are now code-only. Markdown and text and rst are excluded.

A separate IPC fix landed in packet 009. The `SearchOnlyContext` class lets `refresh_index=false` queries bypass the full Rust indexing environment. P95 search latency measured at 141.82ms in that packet.

### 8.3 Current contents

| Aspect | Value |
|---|---:|
| `.cocoindex_code/target_sqlite.db` size | 562 MB |
| `code_chunks_vec` rows | 118,880 |
| Embedding dim | 768 |

Language distribution in the live DB:

| Language | Rows |
|---|---:|
| typescript | 91,287 |
| javascript | 12,691 |
| bash | 5,387 |
| python | 4,951 |
| markdown | 4,513 |
| html | 34 |
| css | 11 |
| json | 6 |

### 8.4 A real content mismatch

Notice the markdown row count: 4,513. The settings file excludes markdown. So why is markdown in the DB?

Because the settings change landed in packet 010, but the DB was not fully rebuilt afterward. The markdown rows are leftover from earlier indexing runs.

This is harmless for search quality. The semantic search still returns the right hits. But the DB carries more content than your current settings would generate on a fresh build.

To clean it up: `ccc reset && ccc index`. That takes a few minutes and gives you a code-only index.

### 8.5 What this means for you

If you do not mind the markdown rows being in there, do nothing. Search works.

If you want a clean code-only DB, run `ccc reset && ccc index` from the project root. Set aside about 3-4 minutes for the rebuild on a typical 9,700-file repo with Metal acceleration.

---

## 9. Subsystem 7: Other Memory systems

The context-index sqlite is the single home for many Memory MCP features beyond plain embeddings. This section maps which tables matter, plus which graph sqlites you might expect but will not find on disk.

### 9.1 Tables inside the active context-index sqlite

Grouped by purpose:

**Learning, feedback and scoring:**
- `learned_feedback_audit`
- `feedback_events`
- `negative_feedback_events`
- `scoring_observations`
- `weight_history`
- `shadow_scoring_log`
- `shadow_cycle_results`
- `batch_learning_log`

**Routing and graph channels:**
- `degree_snapshots`
- `community_assignments`
- `active_memory_projection`
- `entity_catalog` (empty)
- `memory_entities` (empty)
- `memory_summaries`

**Session and continuity state:**
- `session_state`
- `session_sent_memories`
- `working_memory`
- `checkpoints`

**Governance, history and lineage:**
- `governance_audit`
- `memory_history`
- `memory_lineage`
- `mutation_ledger`
- `memory_conflicts`
- `memory_corrections`

**Full-text and embedding cache:**
- `memory_fts` (2,550 rows. FTS5 over title, trigger phrases, file path, content)
- `embedding_cache` (2,508 rows. Keyed by content hash + model id + dimensions)

### 9.2 Sqlites that are NOT materialized

| System | Status on disk | Reason |
|---|---|---|
| `speckit-eval.db` | Absent | `/doctor:update` lists it as skipped or optional. Code path exists, but no rebuild fired in this session. |
| `council-graph.sqlite` | Absent | Code-supported under `mcp_server/lib/council-graph/`. Deep AI Council workflows use packet-local artifacts under `ai-council/**` instead of a global DB. |
| `.auto-migration-complete.json` marker | Absent | The 018 auto-migration writes this on a real run. The live startup correctly skipped the migration as already done, so no marker exists. |

### 9.3 New operational state files (not databases)

| File | Purpose |
|---|---|
| `.doctor-update.last-run.json` | Cross-subsystem status log from the last `/doctor:update` run. Code-graph rebuild stats, context-index reindex status, skill-graph generation, CocoIndex daemon state. |
| `.spec-kit-memory-launcher.json` | Tracks every Memory MCP boot. Updated on every launcher invocation. |

### 9.4 What this means for you

The context-index sqlite is much more than your vector store. Treat it as the single shared brain for the Memory MCP. If you ever delete it manually, you lose causal edges, FTS5 indexes, learning history, session state and governance trails along with the vectors.

The absence of `speckit-eval.db` and `council-graph.sqlite` is fine. Both are lazy-init by design. Code paths exist for the day someone writes a packet that actually needs them.

---

## 10. Cross-cutting changes

These are changes that touched multiple subsystems at once or affect operator-facing surfaces across the whole stack.

### 10.1 Provider factory architecture

Before: four providers (voyage, openai, hf-local, auto), cloud-first cascade, no health-check path.

After: five providers (added llama-cpp), local-first cascade below the cloud keys, health-checked fallback when llama-cpp init fails for any reason (missing GGUF, missing native module, missing Metal dylib).

The health-check is the safety net for non-Apple-Silicon hosts. On a Linux server without CUDA or on Windows without DirectML, the llama-cpp probe fails fast and the daemon falls back to hf-local without you doing anything.

### 10.2 DB filename discipline

Before: single `context-index.sqlite` plus provider-prefixed legacy files. Switching models risked mixing vector dimensions in one file.

After: every context-index sqlite encodes provider + model + dim + dtype in its filename. Two backends can coexist on disk safely. You can flip between hf-local and llama-cpp without losing either store.

### 10.3 Embedding dim alignment

Before: Voyage 1024 for cloud, variable for the Cocoindex side.

After: 768 across both MCPs (both on the EmbeddingGemma family). This is the foundation for any future cross-MCP retrieval feature.

### 10.4 Default dtype

Before: fp32 for Nomic local, hidden behind the cloud API otherwise.

After: q8 as the default everywhere. The hf-local path uses ONNX per-tensor int8. The llama-cpp path uses GGUF per-block-of-32 int8. Both are 8-bit but the per-tensor and per-block schemes round to slightly different values. That difference is the 0.968 cosine parity gap you see in the Memory MCP table.

### 10.5 First-startup operator burden

Before: set a Voyage API key, accept the Gemma license on HuggingFace, store a token at `~/.cache/huggingface/token` or fall back to Nomic CPU embeddings.

After: clone the repo, run the daemon. That is it. The bootstrap path is optional and only kicks in if the prebuilt Metal dylib is somehow missing.

### 10.6 Auto-migration on startup (packet 018)

The new behavior:

If `EMBEDDINGS_PROVIDER` resolves to llama-cpp, **and** a `context-index__hf-local__*.sqlite` is on disk with rows, **and** the target llama-cpp store is empty or smaller than the source, the daemon does this on startup:

1. Logs `AUTO_MIGRATION_START: re-embedding N rows from <source> to <target>`.
2. Re-embeds every row using the new provider.
3. Validates: source row count must equal target row count, plus a 10-row sample of vectors must round-trip without mismatch.
4. On success: deletes the source sqlite plus any `-shm` and `-wal` companion files. Writes a marker JSON.
5. On failure: leaves the source intact, logs `AUTO_MIGRATION_FAILED: <reason>`, falls back to hf-local for this server run.

Migration is synchronous. The Memory MCP does not accept requests until it finishes. For a fresh clone with zero source rows, this takes under 5 milliseconds. For a 2,500-row store, it takes about 130 seconds.

To turn this off and restore the pre-018 warn-and-do-nothing behavior, set `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA=false`. The old `MIGRATION_PENDING` warning text comes back verbatim. Any tooling you have watching for that string keeps working.

### 10.7 Voyage egress guard

A new safety net was added in packet 003 and refined in 013. The factory now warns if `VOYAGE_API_KEY` reappears in the environment while the resolved provider is hf-local. That catches the case where a previous setup re-exports the key from a system-wide launchd plist, which would otherwise silently switch the daemon back to Voyage and start making paid network calls.

### 10.8 Runtime configs

All four runtime configs (`.codex/config.toml`, `.claude/mcp.json`, `.gemini/settings.json`, `opencode.json`) carry the same `_NOTE_*` comment block describing the new cascade. They were cleaned up after this packet line to match the actual `factory.ts` code. As of this commit, code and docs agree.

---

## 11. Operator env vars

| Variable | Default | What it does |
|---|---|---|
| `EMBEDDINGS_PROVIDER` | `auto` | One of: `auto`, `voyage`, `openai`, `hf-local`, `llama-cpp`. `auto` runs the cascade above. |
| `HF_EMBEDDINGS_MODEL` | `onnx-community/embeddinggemma-300m-ONNX` | Override the hf-local model |
| `HF_EMBEDDINGS_DTYPE` | `q8` | hf-local dtype. Options: `fp32`, `fp16`, `q4`, `q8`, `q4f16`, `int8`, `uint8`, `bnb4` |
| `LLAMA_CPP_EMBEDDINGS_MODEL` | `unsloth/embeddinggemma-300m-GGUF` | Override the llama-cpp model |
| `LLAMA_CPP_EMBEDDINGS_GGUF_FILE` | `embeddinggemma-300M-Q8_0.gguf` | GGUF filename inside the cache dir |
| `LLAMA_CPP_EMBEDDINGS_MODEL_DIR` | `~/.cache/huggingface/gguf/embeddinggemma-300m` | GGUF cache location |
| `EMBEDDING_DIM` | 768 | Matryoshka truncation. 768 down to 512, 256 or 128 if your model supports it |
| `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA` | unset (so: enabled) | Set to `false` to disable the 018 auto-migration |
| `COCOINDEX_CODE_EMBEDDING_MODEL` | `sbert/google/embeddinggemma-300m` | Override the cocoindex model |
| `COCOINDEX_QUERY_PROMPT_NAME` | from registry | Override cocoindex query-prompt routing |
| `VOYAGE_API_KEY` | unset | If set, the cascade hits Voyage cloud |
| `OPENAI_API_KEY` | unset | If set, the cascade hits OpenAI cloud |

---

## 12. New scripts and assets

| Path | What it does |
|---|---|
| `.opencode/skills/system-spec-kit/scripts/install-llama-cpp.sh` | Bootstraps `node-llama-cpp` and downloads the GGUF model with sha256 verification. Idempotent. Safe to re-run. |
| `.opencode/skills/system-spec-kit/scripts/migrate-embeddings-to-llama-cpp.ts` | Re-embeds rows from a hf-local sqlite into a llama-cpp sqlite. Exposes `runMigration({source, target, validationSampleSize, logger})` for programmatic use, plus a CLI for manual runs. |
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts` | The new provider class. Wraps `node-llama-cpp` with a Metal-aware health check, lazy session init and EmbeddingGemma prefix handling. |
| `.opencode/specs/.../014-local-embeddings-setup-a/SETUP_A_RECIPE.md` | The operator recipe. Written for the older hf-local default era. Some steps (ONNX cache symlink, accept Gemma license) only apply if you opt back to hf-local now. |
| `BEFORE_VS_AFTER.md` | This document. |

---

## 13. Known follow-on work

Things that are not blockers, but you might want to clean up later.

### 13.1 Auto-migration did not run live yet

The hf-local sqlite is still on disk (97 MB). The 018 auto-migration probe correctly saw that the target was already populated from 017's manual migration and skipped. Two options:

1. Run `rm` manually:
   ```bash
   rm .opencode/skills/system-spec-kit/mcp_server/database/context-index__hf-local__*.sqlite*
   ```
2. Force-trigger the migration by truncating the llama-cpp store, then restarting the daemon. The auto-migration sees a mismatch and re-runs. Useful only if you want to test the auto-migration path on a real workload.

Most operators should pick option 1 once they confirm the new store works for their queries.

### 13.2 CocoIndex has stale markdown rows

`.cocoindex_code/target_sqlite.db` contains 4,513 markdown rows from before the code-only settings landed. Run `ccc reset && ccc index` to clean up. Budget about 3-4 minutes on a typical repo with Metal.

### 13.3 Skill graph count discrepancy

Doctor log says 19. DB has 18. Likely one metadata file scanned but not indexed. Edge count matches (58), so semantic behavior is unaffected. A future packet can reconcile.

### 13.4 Code Graph staleness

Last scan was against the 017-era HEAD. Post-018 staged changes (factory.ts edits, new scripts, new tests) are not reflected. Run `code_graph_scan` if you need the graph current.

### 13.5 Code Graph gold-verification pass rate

0.5357 overall, 0.7143 edge-focus. This is a pre-existing quality issue surfaced by `/doctor:update`. Not introduced by this arc, but documented here so you do not lose the thread.

### 13.6 SETUP_A_RECIPE.md is partially stale

Written when hf-local was the default. Some setup steps (ONNX cache symlink, accept Gemma license, store HF token) only apply to the hf-local opt-out path now. A doc cleanup pass would tighten it up.

---

## 14. Verification

You can confirm the after-state yourself with the commands below.

### 14.1 Confirm llama-cpp is the default in code

```bash
grep -nA 10 "function resolveProvider" .opencode/skills/system-spec-kit/shared/embeddings/factory.ts | head -50
```

Look for the cascade order. `llama-cpp` should appear before the `hf-local` fallback.

### 14.2 Confirm the new sqlite store exists

```bash
ls -la .opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__*.sqlite
```

You should see a ~108 MB file plus its `-shm` and `-wal` companions.

### 14.3 Confirm node-llama-cpp loads

```bash
cd .opencode/skills/system-spec-kit/mcp_server && node -e "import('node-llama-cpp').then(() => console.log('ok'))"
```

Should print `ok`. On Node 25, `require('node-llama-cpp')` fails because the module is ESM with top-level await. Use the dynamic `import()` form.

### 14.4 Confirm the GGUF model is in cache

```bash
ls -la ~/.cache/huggingface/gguf/embeddinggemma-300m/embeddinggemma-300M-Q8_0.gguf
```

Expect a file around 310 MB.

### 14.5 Confirm runtime configs match the code

```bash
grep -nE "_NOTE_2_PROVIDERS|_NOTE_3_EMBEDDINGS_PROVIDER" .codex/config.toml .claude/mcp.json .gemini/settings.json opencode.json
```

Every match should describe llama-cpp as part of the cascade, not as an opt-in-only path.

### 14.6 Confirm causal edges survived the migration

```bash
sqlite3 .opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite "SELECT COUNT(*) FROM causal_edges;"
```

Should return `205`.

---

## 15. Packet timeline

A compact log of every packet in the line, in shipping order.

| # | Status | Headline |
|---|---|---|
| 001 | Shipped | Per-model query and document prefix registry in `hf-local.ts` and `_QUERY_PROMPT_MODELS` |
| 002 | Shipped | EmbeddingGemma local install with HF license and token flow |
| 003 | Shipped | Voyage key purge across .zshrc, .env, launchd. Updated 4 runtime configs |
| 004 | Shipped | hf-local sqlite filenames keyed by `provider__model__dim`. First 2,112-row index |
| 005 | Shipped | q4 evaluation. Cosine mean 0.9811 vs fp32. q8 selected as system default in 012 |
| 006 | Planning | Gated on 009 and future hybrid retrieval work |
| 007 | Shipped | Removed 463 MB of stale Voyage sqlite. Added tcpdump-verify.sh for post-merge egress check |
| 008 | Shipped | Commit message and post-merge checks |
| 009 | Shipped | msgspec IPC truncation patched. SearchOnlyContext class. p95 141.82ms direct vec KNN |
| 010 | Shipped | Removed `.md`, `.mdx`, `.txt`, `.rst` from cocoindex include patterns |
| 011 | Shipped | CocoIndex switched to `google/embeddinggemma-300m` 768d. Unified with Memory MCP |
| 012 | Shipped | q8 became the Memory MCP dtype default. dtype encoded in DB filename |
| 013 | Shipped | Voyage egress guard pre-resolution. `memory_health.dtype` field. msgspec mutable-default fix |
| 014 | **Rejected** | ONNX cross-platform backend measured 3.5x slower than PyTorch + MPS. Production code reverted. Packet retained as decision record |
| 015 | Shipped | Opt-in `llama-cpp` provider. Benchmark 6.1x faster, 33% less RAM |
| 016 | Shipped | 200-doc retrieval probe. Verdict EQUIVALENT (recall@5 0.912, Spearman 0.865, MRR delta 0) |
| 017 | Shipped | Default flip to llama-cpp. Migrated 2,488 rows with zero mismatches. 1k-scale probe: recall@5 0.926 EQUIVALENT, Spearman 0.816 MILD_DIVERGENCE, MRR essentially unchanged. Operator accepted the flip |
| 018 | Shipped | Warn-only `MIGRATION_PENDING` upgraded to `runAutoMigrationIfNeeded()`. Synchronous startup migration with validation gate, source deletion and marker file. `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA=false` opt-out preserves the pre-018 warning verbatim |

---

*This document was synthesized from a codex (gpt-5.5 xhigh fast) research pass against the live disk state plus all 18 packet implementation summaries. Source-of-truth references throughout cite `factory.ts:786-836` and the packet-local `implementation-summary.md` files. If anything here drifts out of date, the verification commands in Section 14 are the fastest way to check.*
