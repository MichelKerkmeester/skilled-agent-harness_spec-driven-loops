# Iteration N6 - Architecture-Fit Audit Against the External Twins (opus, prove-first)

## TITLE

Cohort N6 architecture-fit audit. Model opus. Angle reads the real `lib/search` store and grades it against the three closest external twins the brief names: bozbuilds/AIngram (one SQLite file with sqlite-vec two-pass plus FTS5 plus a knowledge graph plus Ed25519-signed entries), devwhodevs/engraph, and Turso/libSQL (native vector, DiskANN, F8 and F1BIT quantization). The question is narrow: what do we already have, and is anything in the twins worth adopting on a roughly 2022-packet corpus.

## FINDINGS

The store is not a candidate for the twins' headline features. It already is the twin, several schema generations further along.

The AIngram core stack is shipped four-for-four. The single-file store creates a real `vec0` virtual table, `CREATE VIRTUAL TABLE vec_memories USING vec0(embedding FLOAT[${embedding_dim}])` at `vector-index-schema.ts:3766-3768`, gated on `sqlite_vec_available` at `:3763` with `sqlite-vec` and `sqlite-vec-darwin-arm64` both vendored in `mcp_server/node_modules`. FTS5 is the next table, `CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(... content='memory_index', content_rowid='id')` at `:3785-3789`, kept in sync by AFTER-INSERT triggers at `:3793-3796`. The knowledge graph is the `causal_edges` table carrying typed relations plus an `edge_vector_embeddings` companion at `vector-index-schema.ts:721-737`. RRF over all of it is `shared/algorithms/rrf-fusion.ts`, fusing six labelled channels (vector, fts, bm25, graph, degree, keyword at `:12-19`) with a convergence bonus and per-class retrieval-profile weights. AIngram's defining move is the two-pass retrieval, and the store has both passes: the ANN pass is `WHERE embedding MATCH ? AND k = ?` at `vector-index-queries.ts:193`, with the brute-force scalar pass `vec_distance_cosine(v.embedding, ?)` at `:164` as the fallback when `vec0` is absent. This is the same alexgarcia sqlite-vec hybrid the brief cites at section 7, already in production.

The Turso/libSQL angle is dead on arrival as a swap. A repo-wide grep for `libsql`, `turso`, `diskann`, `vector_top_k`, `libsql_vector` across `mcp_server` returns zero hits. Adopting libSQL is a transport migration off `better-sqlite3` plus `sqlite-vec`, and the brief itself flags the whole angle as vendor-validated and not independently benchmarked (section 5, caveat at `stage-0-external-findings.md:57,106`). The two libSQL features that are not pure vendor sync, native `vector_top_k` and DiskANN, are functionally the `MATCH ... AND k` path we already run. The other half, embedded-replica offline sync with read-your-writes, solves a multi-device fan-out the store does not have: it is a single-file local memory for one workstation, already sharded by `db-shard-migration.ts`. Swapping the engine moves zero retrieval numbers and re-pays the entire migration and corruption-repair surface for nothing.

The genuinely net-new items reduce to two, and only one survives scrutiny. First, integrity. The store has `content_hash` everywhere, but as a cache and idempotency key, never as a tamper check: a grep for verify, mismatch, tamper, or recompute against `content_hash` in `lib/search` returns nothing, and the idempotency-receipt schema at `vector-index-schema.ts:771-785` stores `content_hash` only to dedup writes. So AIngram's Ed25519-signed-entries idea is the one feature with no analogue here. But its threat model does not transfer. AIngram signs entries so an untrusted distributor cannot tamper with a shared index; this corpus is a single-author local memory written only by the operator's own save path, with the DB file already inside the same trust boundary as the signing key would be. Signing buys provenance theatre, not a defended boundary. The cheap, in-threat-model version of the same instinct, a stored hash re-checked on read to catch silent disk or migration corruption, is the only adoptable residue, and even that overlaps the existing corruption-repair runbook and `db-shard-migration` integrity path.

Second, quantization. The vector column is `FLOAT[dim]`, F32 only, at `vector-index-schema.ts:3767`; no `int8[]`, `bit[]`, `float8`, or scalar/binary quantization appears anywhere in `lib`. Turso's F8 and F1BIT tiers are real and net-new, and they are textbook premature scale work on this corpus. The brief's own framing is a roughly 2022-packet corpus; the RRF default constant is literally tuned for it, `DEFAULT_K = 40` with the comment "k=40 optimized for ~1000-memory corpus" at `rrf-fusion.ts:37-38`. At low thousands of 768-dim vectors the brute-force scalar scan is already sub-millisecond and the `vec0` ANN pass exists for headroom; quantization trades recall for a latency budget that is not under pressure. It is a lever to pull at 100k-plus vectors, not now.

## CONCRETE CHANGE

Reject the architecture-swap candidates outright and ship nothing from the libSQL angle. If any twin idea is taken, take only the smallest in-threat-model slice of AIngram's integrity instinct: store the existing `content_hash` as a read-time integrity assertion, recomputed and compared when a record is hydrated for retrieval, raising a corruption signal that routes into the existing repair runbook rather than a cryptographic signature scheme. This is a few lines at the hydration seam, reuses the hash the write path already computes, and defends the real failure mode here (silent DB or migration corruption) instead of the absent one (a hostile distributor). Quantization and libSQL are explicitly deferred with a tripwire: revisit only when the active-row count crosses roughly 100k vectors or the `vec0` MATCH p95 latency leaves its budget.

## EVIDENCE

- sqlite-vec two-pass shipped: `vector-index-schema.ts:3763-3768` (vec0 table, `sqlite_vec_available` gate), `vector-index-queries.ts:164` (scalar `vec_distance_cosine`), `:193` (ANN `MATCH ? AND k = ?`); modules vendored at `mcp_server/node_modules/sqlite-vec` and `sqlite-vec-darwin-arm64`.
- FTS5 shipped: `vector-index-schema.ts:1818,3785-3789` plus sync triggers `:3793-3796`.
- KG shipped: `causal_edges` typed relations and `edge_vector_embeddings` at `vector-index-schema.ts:721-737`; schema at v41 (`SCHEMA_VERSION = 41`, `:666`) with bitemporal windows, lineage, and tombstones.
- RRF over six channels: `shared/algorithms/rrf-fusion.ts:12-19`, default `k=40` for ~1000-memory corpus at `:37-38`.
- libSQL/Turso absent: zero hits for `libsql|turso|diskann|vector_top_k|libsql_vector` across `mcp_server`; brief vendor-only caveat at `stage-0-external-findings.md:57,106`.
- content_hash is cache/idempotency only, not verified: idempotency-receipt schema `vector-index-schema.ts:771-785`; no verify/mismatch/tamper/recompute usage in `lib/search`.
- No quantization tier: `FLOAT[dim]` only at `vector-index-schema.ts:3767`; no `int8[]/bit[]/float8` in `lib`.
- Twin sources: AIngram, engraph, Turso, alexgarcia sqlite-vec hybrid at `stage-0-external-findings.md:76,77,79,82`.

## READER

Retrieval, as governance not ranking. None of these candidates change the composition of a retrieved result set, so under the X1 truncation law they are floor-neutral. The integrity-on-read slice serves a durability and trust reader (the operator who must know a corrupt DB silently degraded recall); it does not lift recall and must not be sold as a retrieval win. libSQL and quantization serve a scale reader the corpus does not yet have.

## ON-WRITE OR RETROACTIVE

The integrity-on-read slice is read-time, not a re-index: it asserts against the `content_hash` the write path already stores, so it applies to every existing record with no re-embed and no coverage-gate cost. Both rejected candidates, if ever revisited, would be retroactive by necessity, libSQL via a full engine migration and quantization via a full re-encode of the vector column behind the coverage guard.

## RISK

The strongest finding is the rejection, and its risk is low because it is grounded in absence-of-need on a measured-small corpus plus a wrong-threat-model argument, not in a benchmark that could flip. The one residual risk is over-rejecting the integrity slice: silent DB corruption is a real and already-documented failure mode in this store, so dismissing read-time hash verification entirely would leave a known gap, which is why the slice is kept while the signature scheme is dropped. The opposite risk, that a future operator reads "we already have the twin" as license to stop hardening retrieval, is mitigated by the explicit quantization and libSQL tripwire tied to corpus size and MATCH latency rather than to vibes.
