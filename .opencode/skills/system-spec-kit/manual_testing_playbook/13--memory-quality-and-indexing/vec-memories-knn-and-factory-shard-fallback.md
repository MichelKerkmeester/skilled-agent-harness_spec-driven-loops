---
title: "416 -- vec_memories KNN dual-write and factory shard fallback"
description: "This scenario validates that reindex dual-writes vec_<dim> and vec_memories per shard and that the factory resolves the active ollama embedder through the per-embedder shard when the main DB lacks the dim-tagged table."
audited_post_018: true
version: 3.6.0.4
---

# 416 -- vec_memories KNN dual-write and factory shard fallback

## 1. OVERVIEW

This scenario validates the two cooperating patches that restore `memory_search` semantic confidence: reindex dual-write of `vec_<dim>` and `vec_memories` in the active per-embedder shard, plus the factory's ADR-012 shard-aware fallback when resolving the active ollama embedder.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm reindex writes embeddings to both the canonical blob table and the vec0 KNN virtual table in the active shard, and confirm the factory resolves the active embedder when the dim-tagged table lives in the shard rather than the main DB.
- Real user request: `` Memory search keeps coming back with weak ranked results and the daemon log says the factory is falling back to jina-embeddings-v3 even though I have nomic active. Please validate that a reindex now lands rows in both vec_<dim> and vec_memories in the active shard, that the factory resolves nomic correctly through the shard, and that the daemon log no longer prints `[factory] Active embedder ... points to vec_<dim>, but that table is missing in <main_db>`. Return a pass/fail verdict with evidence. ``
- RCAF Prompt: `As a memory-system operator, validate the vec_memories KNN dual-write and the factory ADR-012 shard fallback after a daemon restart.`
- Expected execution process: Run the documented commands against the active embedder shard, capture row counts and the daemon log, compare against the expected signals, and return a concise pass/fail verdict with cited evidence.
- Expected signals: vec_<dim> and vec_memories have matching row counts in the active shard; KNN self-probe returns the seed row at rank 1 with distance 0 and real neighbors at distances 0.5 to 0.6; daemon startup log emits `[factory] Using provider: ollama (vec_metadata active_embedder_name=...)` with no preceding cascade warning.
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if both tables match counts, KNN self-probe returns rank-1 with distance 0, and the factory log shows the positive `Using provider` line with no cascade warning. FAIL if vec_memories is empty, if vec_<dim> count differs from vec_memories count after reindex, or if the factory cascade warning still fires.

---

## 3. TEST EXECUTION

### Prompt

```
Validate vec_memories KNN dual-write and factory ADR-012 shard fallback against the active embedder shard plus the daemon startup log.
```

### Commands

**Block A: shard subset invariant**

1. Identify the active shard from `<repo>/.opencode/skills/system-spec-kit/mcp_server/database/vectors/context-vectors__<provider>__<model>__<dim>.sqlite`.
2. From `mcp_server/`, run:
   ```
   node -e "const D=require('better-sqlite3'); const V=require('sqlite-vec'); const db=new D('<shard-path>'); V.load(db); const a=db.prepare('SELECT count(*) AS n FROM vec_<dim>').get().n; const b=db.prepare('SELECT count(*) AS n FROM vec_memories').get().n; const missing=db.prepare('SELECT count(*) AS n FROM vec_<dim> v WHERE NOT EXISTS (SELECT 1 FROM vec_memories m WHERE m.rowid = v.id)').get().n; console.log({vec_dim: a, vec_memories: b, missing_from_vec_memories: missing});"
   ```
3. Assert `vec_dim > 0`, `vec_memories >= vec_dim`, and `missing_from_vec_memories === 0`. The vec_memories table may exceed vec_<dim> because the daemon's save-time indexing path writes incremental new memories directly into vec_memories without invoking the reindex orchestrator. The contract is "every reindexed id has a vec_memories row", not strict equality.

**Block B: KNN self-probe**

4. From the same node script, pick a seed: `db.prepare('SELECT id, vec FROM vec_<dim> LIMIT 1').get()`.
5. Run KNN: `db.prepare("SELECT rowid, distance FROM vec_memories WHERE embedding MATCH ? AND k = 5 ORDER BY distance").all(seed.vec)`.
6. Assert rank 1 has `rowid === seed.id` and `distance === 0`. Assert ranks 2..5 have non-zero distances under 0.7.

**Block C: factory resolution via shard**

7. Restart the daemon clean. From repo root:
   ```
   SPECKIT_IPC_SOCKET_DIR=/tmp/mk-spec-memory node .opencode/bin/mk-spec-memory-launcher.cjs &
   ```
8. Grep the startup log for the positive factory line and the absence of the cascade warning:
   ```
   grep -E "factory.*Using provider|factory.*points to vec_|continuing provider cascade" /tmp/mk-spec-memory-daemon.log
   ```

### Expected

- Block A: `vec_memories >= vec_<dim>` AND every rowid in `vec_<dim>` exists in `vec_memories` (the subset invariant). Strict equality is not required because daemon-side incremental saves can push vec_memories ahead.
- Block B: rank-1 self-distance is 0, neighbors fall in the 0.5 to 0.65 range for nomic at 768-dim.
- Block C: log contains `[factory] Using provider: ollama (vec_metadata active_embedder_name=...)` and contains zero matches for `points to vec_<dim>, but that table is missing` or `continuing provider cascade` when the shard is populated.

### Evidence

Active embedder lookup via `mk-spec-memory_embedder_list`:

```json
{
  "name": "nomic-embed-text-v1.5",
  "dim": 768,
  "backend": "ollama",
  "active": true,
  "ready": true,
  "notes": "Drop-in 768-dim swap candidate. Retrieval-specialist trained on 235M pairs with hard negatives. Requires prefix tokens. Local-first cascade default per ADR-014."
}
```

Active shard used: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite`

Block A row-count output:

```text
{ vec_dim: 18464, vec_memories: 17, missing_from_vec_memories: 18456 }
```

Block B KNN top-5 output:

```text
{
  seed_id: 1,
  knn: [
    { rowid: 1, distance: 1.369869589805603 },
    { rowid: 2, distance: 1.3783988952636719 },
    { rowid: 3, distance: 1.3940675258636475 },
    { rowid: 10, distance: 1.6755623817443848 },
    { rowid: 11, distance: 1.7352088689804077 }
  ]
}
```

Block C daemon launcher output:

```text
[mk-spec-memory-launcher] loaded 1 env(s) from .env.local
[mk-spec-memory-launcher] loaded 5 env(s) from .env
[mk-spec-memory-launcher] staleReclaimed: true
[mk-spec-memory-launcher] stale-reclaim adopting live daemon pid 58287 via bridge instead of reaping
[mk-spec-memory-launcher] bridging to lease holder pid=54495 socket=/tmp/mk-spec-memory/daemon-ipc.sock
```

Block C grep output:

```text
grep: /tmp/mk-spec-memory-daemon.log: No such file or directory
```

### Pass / Fail

- **FAIL**: Block A failed because `vec_memories` had 17 rows while `vec_768` had 18464 rows with 18456 missing from `vec_memories`; Block B failed because rank 1 returned the seed row but distance was `1.369869589805603` instead of `0`; Block C could not confirm the expected factory log because `/tmp/mk-spec-memory-daemon.log` did not exist.

### Failure Triage

- Block A mismatch: inspect `mcp_server/lib/embedders/reindex.ts::writeVectorsToShard` and `writeVectorsToKnn`. Check sqlite-vec extension load. Confirm dual-write transaction covers both INSERT statements.
- Block B distance != 0 at rank 1: vec_memories blob format does not match vec_<dim>. Confirm `to_embedding_buffer(embedding)` is identical for both tables.
- Block C cascade warning: inspect `shared/embeddings/factory.ts::readActiveOllamaEmbedderFromDb`. Confirm the shard fallback path constructs the correct filename pattern `context-vectors__ollama__<name>__<dim>.sqlite`. Confirm the file exists at the expected location.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [13--memory-quality-and-indexing/vec-memories-knn-and-factory-shard-fallback.md](../../feature_catalog/13--memory-quality-and-indexing/vec-memories-knn-and-factory-shard-fallback.md)
- Source files: `mcp_server/lib/embedders/reindex.ts`, `shared/embeddings/factory.ts`, `mcp_server/lib/search/vector-index-store.ts`
- Shipping packets: `016/002/016-reindex-populates-vec-memories-knn-table`, `016/002/017-factory-shard-fallback-for-hf-voyage-openai`

---

## 5. SOURCE METADATA
- Spec doc identifier: `416`
- Group: Memory Quality And Indexing
- Canonical playbook source: `manual_testing_playbook.md`
