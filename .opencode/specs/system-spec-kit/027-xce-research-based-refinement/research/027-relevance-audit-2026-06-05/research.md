# 027 Relevance Audit — vs. last ~100 commits (Jun 2–5 2026)

**Date:** 2026-06-05 · **Method:** 10 read-only `openai/gpt-5.5-fast --variant high` passes via cli-opencode (one per phase/assumption) · **Verdicts:** evidence-first with commit + `file:line` citations · **Raw per-pass output:** `logs/iter-*.out`.

## Headline

**Nothing in 027 has been implemented yet — but most of it needs a rescope pass before execution, not abandonment.**

| Verdict | Count | Phases |
|---|---|---|
| ALREADY-DONE | 0 | — |
| STILL-RELEVANT | 2 | 002, 003 |
| NEEDS-RESCOPE | 7 | 001, 004, 005, 006, 007, 008, vocab/constants |
| INVALIDATED | 1 | embedding assumption (drives 007) |

The dominant cause of "NEEDS-RESCOPE" is **drift, not completion**: stale file paths, one invalidated infrastructure assumption (embedding provider), and two cases where a recently-landed mechanism now overlaps planned work (reuse-not-duplicate). No recent commit shipped any 027 phase's actual deliverable.

## Verdict table

| Phase | Verdict | Why (evidence) | Action |
|---|---|---|---|
| **001** peck-teachings | NEEDS-RESCOPE | 028 packet (`a101cbacfa`) was **not** a competitor — it's the same peck work, later folded *into* 027/001 (`e39a6a8e63`). Children unimplemented. | Keep 002 (self-check-templates) & 004 (constitutional-review) as-is; rescope **003** from `warn`→`INFO` severity (validator already supports INFO). |
| **002** memory-write-safety | **STILL-RELEVANT** | All 3 P0s absent: no `isAutoEdgeCreator`/`auto-session` predicate; `insertEdge` still clobbers `created_by` on conflict; retention sweep deletes by `delete_after` only. | Keep — but **fix stale paths**: live files are `lib/storage/causal-edges.ts`, `lib/storage/consolidation.ts`, `lib/governance/memory-retention-sweep.ts` (spec says `lib/causal/`, `lib/memory/`). |
| **003** incremental-index | **STILL-RELEVANT** | No `memoization_records`/`dependency_edges`/chunk-fingerprint columns/`canonical-fingerprint.ts`/`memo.ts`. Indexing still file-level mtime/hash (`incremental-index.ts:173-224`). Recent async/orphan commits didn't add memo/DAG. | Keep as-is. |
| **004** causal-tombstones | NEEDS-RESCOPE | No tombstone schema/`sweep.ts`; deletes still hard-delete. But: (a) `lifecycle_generation` name-collides with the existing in-memory `causalEdgesGeneration` cache counter; (b) caller inventory is **stale** — extra hard-delete paths exist (`vector-index-mutations.ts:137`, `checkpoints.ts:1668`, `corrections.ts:611`). | Keep design; distinguish persisted lifecycle gen from the cache counter; expand caller routing to **all** raw `DELETE FROM causal_edges` sites. |
| **005** metadata-promoter | NEEDS-RESCOPE | `relation-backfill.ts` (`d32d90c3f1`+) overlaps the *broad* goal but scans document-chain/lineage/similarity — **not** index-time promotion from packet metadata. `manual.depends_on/supersedes/related_to` already wired (but as `created_by='manual'`). `parent_id`/`children_ids`/`parentChain` parsed but not promoted. No `extraction_method`/`confidence` columns. | Narrow the promoter: skip the already-wired `manual.*`; implement only parent/children/parentChain promotion + provenance columns; dedupe vs relation-backfill. |
| **006** write-path/statediff | NEEDS-RESCOPE | No `statediff`/`DiffAction`/target-sink code anywhere. Still imperative writes. But async post-insert enrichment (`0060a097b3`) changed the model. | Keep; rescope `memory_save` conversion to model enrichment as **async/pending-marker replay**, not same-response graph writes. |
| **007** semantic-triggers | NEEDS-RESCOPE | Feature unbuilt (lexical-only triggers; only an ENV placeholder). But the **Voyage-4 1024-dim assumption is dead** (see below), and the soft-dep `028/004-code-graph-adoption-eval` folder **doesn't exist**. | Rescope around the active embedding profile (768d Nomic); parameterize threshold/goldens; replace the missing dependency with "equivalent shadow/promotion evidence." |
| **008** learning-reducers | NEEDS-RESCOPE | `feedback_events` dependency **met**. But `batch-learning.ts:195-241` already does overlapping bounded aggregation (`aggregateEvents`/`weightedScore`); `f05bdac2cf` refined its formula. `STATE_LIMITS` (needed by 008.4) is **not exported** (only `__testables`). | 001-aggregator: reuse/extract `batch-learning` (don't duplicate); 003 & 004: fix amendments (relation-target & STATE_LIMITS export) first; 002 & 005 mostly as-is. |
| **embedding assumption** | **INVALIDATED** | Active default is **local Ollama `nomic-embed-text-v1.5` 768d** (live runtime metadata: `active_embedder_dim=768`), not Voyage-4 1024d. `79cb4e4d21` made resolution local-first; llama-cpp was later purged (`138d2e9320`) & consolidated to Nomic (`1639aadc02`). Cache is **profile-scoped** (`profile_key`+`input_kind`), so a Voyage cache can't be assumed reusable. | Rescope every Voyage/1024 reference in 007 (and any 008 embedding refs) to the active `EmbeddingProfile`. |
| **vocab/constants** | NEEDS-RESCOPE | `RELATION_TYPES` stable ✓. But `DEFAULT_RELATION_TARGETS` is **misaligned** with it (includes `produced`/`cited_by`, omits `enabled`/`derived_from`) — and 008.3 plans `ENABLED` edges. `STATE_LIMITS` exists but isn't a production export. | Treat `RELATION_TYPES`/schema as the vocabulary source; align or document `DEFAULT_RELATION_TARGETS` as coverage-only; add a production `STATE_LIMITS` export. |

## Cross-cutting themes (the real story)

1. **Systemic path drift.** Nearly every phase's affected-file list points at paths that have since moved: `lib/causal/`→`lib/storage/`, `lib/memory/`→`lib/governance/`, `lib/embeddings/`→`shared/embeddings/`, `lib/triggers/` (absent), `lib/storage/vector-index-schema.ts`→`lib/search/vector-index-schema.ts`. **A path-refresh sweep across the whole packet is prerequisite to any implementation.**
2. **Embedding migration is the one true invalidation.** Voyage-4/1024d → local Nomic/768d, profile-scoped cache. Anything assuming a reusable Voyage cache (007 most directly) must be rewritten.
3. **Reuse-not-duplicate, twice.** 005 partially overlaps `relation-backfill.ts`; 008.1 overlaps `batch-learning.ts` aggregation. Both should adapt/extend the landed code rather than add parallel mechanisms.
4. **Stale inventories & missing exports.** 004's delete-path list is incomplete; `STATE_LIMITS` isn't exported; `DEFAULT_RELATION_TARGETS` is out of sync with `RELATION_TYPES`. Small but blocking specifics.
5. **Zero completion.** No phase is ALREADY-DONE — 027's *intent* is intact; the work is real. This is a rescope, not a rewrite.

## Recommended re-planning sequence

1. **Packet-wide path-refresh** (mechanical, do first) — update every phase's affected-file table to current paths; add the embedding-profile reality to 007/008.
2. **Ship the two clean ones**: 002 (P0 safety, just repath) and 003 (foundation, as-is). 002 should land first — 008 depends on it.
3. **Rescope-then-ship**: 001/003-discipline (warn→info), 004 (caller inventory + lifecycle naming), 005 (narrow promoter), 006 (async model), 008 (reuse batch-learning; fix STATE_LIMITS/relation-target).
4. **007 last** — biggest rescope (embedding profile rewrite + replace missing eval dependency).
5. Propagate these verdicts into each child `spec.md` (a separate, Gate-3-gated edit) before implementation.

## Provenance & caveats

- **Coverage:** all 8 phases + 2 cross-cutting assumptions, every pass `confidence: high`.
- **Two-source on phases 1–5:** an earlier sequential gpt-5.5 run also produced verdicts for 001–005 (`logs/iter-01..05.out`); this report uses those, and phases 006–010 from the parallel run — verdicts agreed on direction.
- **Single-model audit** (gpt-5.5-fast only, per operator choice) — not cross-model-verified, so the few judgment calls (e.g. "relation-backfill overlaps but doesn't deliver 005") carry single-model risk; spot-check 005 and the embedding finding against the cited lines before acting.
- One pre-resolved signal hash was slightly off (`bb61e8614e` → actually `bb61e8864e`); the audit caught and corrected it.
- Verdicts intentionally kept **out of the phase-parent `spec.md`** per its content-discipline rule; canonical here.
