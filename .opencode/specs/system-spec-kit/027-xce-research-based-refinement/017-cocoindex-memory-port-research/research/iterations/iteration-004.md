# Iteration 004 - K1.3 statediff reconciliation port

## Focus

K1.3 asks whether CocoIndex's `statediff.py` model, `(desired, prior, prev_may_be_missing) -> insert/upsert/replace/delete`, can replace ad-hoc post-mutation hooks and reconciliation flows in `memory-index.ts`, `memory-save.ts`, causal graph writes, alias conflict detection, divergence reconciliation, embedding, FTS/BM25, graph, and cache paths.

Verdict preview: yes with adaptation. The action model transfers cleanly for durable target-state reconciliation, but not for cache invalidation hooks as currently written. Caches should subscribe to an applied action log; they should not be modeled as durable desired/prior rows.

## Actions Taken

- Read `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/cocoindex-main/python/cocoindex/connectorkits/statediff.py` in full.
- Searched CocoIndex connectors for `TrackingRecord`, `CompositeTrackingRecord`, `prev_may_be_missing`, `diff()`, and `diff_composite()` usage.
- Read the PostgreSQL target reconciliation implementation in `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/cocoindex-main/python/cocoindex/connectors/postgres/_target.py`.
- Listed all `runPostMutationHooks` callers in `.opencode/skills/system-spec-kit/mcp_server`.
- Read `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts`.
- Read `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`.
- Read `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-alias.ts`.
- Read `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` around save, reconsolidation, and post-mutation paths.
- Read `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts`.
- Read `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts` and `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`.

## Findings

### CocoIndex statediff semantics

`statediff.py` is not a generic hook runner. It is a target-state reconciler over observed prior tracking records. The module defines `DiffAction = Literal["insert", "upsert", "replace", "delete"]` (`statediff.py:52`) and packages inputs as `TrackingRecordTransition(desired, prev, prev_may_be_missing)` (`statediff.py:85-95`).

The core decision tree is small and portable. `NON_EXISTENCE` plus observed previous rows returns `delete`; any observed row differing from desired returns `replace`; complete prior knowledge with no difference returns `None`; incomplete prior knowledge returns `insert` when no previous row was observed, otherwise `upsert` (`statediff.py:172-186`). That maps well to memory rows, BM25 rows, embedding rows, causal edges, and alias variants because all can be represented as keyed desired/prior records.

Composite reconciliation is also directly relevant. `CompositeTrackingRecord` models a main record plus keyed substates (`statediff.py:55-72`), and `diff_composite()` computes the main action plus keyed sub-transitions (`statediff.py:189-198`). It marks substate priors as potentially incomplete when the parent action is `replace` or `delete` (`statediff.py:230-247`). That is the useful shape for a memory document with child target rows: embedding vector, BM25/FTS row, graph edges, entity rows, summaries, and chunk rows.

The connector pattern confirms the intended plumbing. PostgreSQL builds a table composite tracking record from desired schema: primary key signature as main, non-PK columns and pgvector extension as subrecords (`_target.py:845-865`). Reconcile wraps desired in `MutualTrackingRecord`, resolves system-managed state, runs `diff_composite()`, then diffs each column sub-transition when the table itself does not need replacement (`_target.py:1102-1126`). The action sink applies DDL from the action object: drop on `replace/delete`, create on `insert/upsert/replace`, and column-level actions otherwise (`_target.py:915-947`).

### Our mutation hooks are cache invalidation, not target reconciliation

`runPostMutationHooks` currently clears parser/cache/search-derived state after writes. It clears trigger matcher cache (`mutation-hooks.ts:27-39`), invalidates tool cache (`mutation-hooks.ts:41-52`), clears constitutional cache (`mutation-hooks.ts:54-66`), clears graph/degree caches (`mutation-hooks.ts:68-81`), and clears co-activation cache (`mutation-hooks.ts:83-95`). That is not desired/prior durable state. It should remain an action subscriber or be renamed as such.

The callsites are broad but mostly post-write hygiene. `memory_index_scan` wraps scan invalidation hooks at `memory-index.ts:351-357`, invokes them after stale deletes when no files are found (`memory-index.ts:363-370`), and invokes them after indexed/updated/stale-deleted results (`memory-index.ts:647-654`). `memory_bulk_delete` invokes hooks after a successful delete count (`memory-bulk-delete.ts:277-293`). `memory_save` invokes hooks after atomic saves that are not duplicate or unchanged (`memory-save.ts:3296-3315`).

These callsites should not be replaced by `statediff` one-for-one. The better port is: durable row reconciliation produces typed actions, action sinks apply those actions, and cache invalidation subscribes to the applied actions. That gives hooks richer context while keeping them out of the decision tree.

### Our current durable reconciliation is split across handlers

`memory_index_scan` already has an implicit desired/prior classification. It discovers desired files, canonicalizes aliases, categorizes files for indexing, and computes `toIndex`, `toUpdate`, `toSkip`, and `toDelete` through `incrementalIndex.categorizeFilesForIndexing(files)` (`memory-index.ts:431-440`). It then indexes changed files and only updates mtime markers after successful indexing (`memory-index.ts:557-565`). Stale deletion is explicitly deferred when replacement indexing fails (`memory-index.ts:567-574`). This is conceptually a statediff, but the action vocabulary and downstream targets are scattered.

Alias conflict detection and divergence reconciliation are separate handlers. Alias buckets normalize `.opencode/specs` and `specs` variants into one alias key (`memory-index-alias.ts:97-113`), group rows by canonicalized path and hashes (`memory-index-alias.ts:117-150`), then summarize identical, divergent, and unknown hash groups (`memory-index-alias.ts:153-197`). Divergence reconciliation expands divergent candidates when samples are capped (`memory-index-alias.ts:278-287`) and records retry/escalation hooks through the mutation ledger (`memory-index-alias.ts:309-324`). This is a strong candidate for statediff because it already compares desired canonical variants against prior alias rows, but it needs a conflict action outside CocoIndex's four literals, or a policy layer over `replace`.

`memory_save` has several reconciliation systems of its own. Same-path dedup checks can early-return before write (`memory-save.ts:2194-2205`), embedding is generated before quality/reconsolidation decisions (`memory-save.ts:2210-2217`), save-time reconsolidation runs before chunking and writer lock (`memory-save.ts:2299-2320`), and the final transaction either creates an append-only successor when same-path content hash changed or creates a normal record (`memory-save.ts:2475-2504`). It then records lineage as `SUPERSEDE` or `CREATE` (`memory-save.ts:2516-2525`). This path can use statediff for target rows, but prediction-error/reconsolidation remains a semantic policy layer, not just storage diffing.

Causal graph writes are direct upserts/deletes today. `memory_causal_link` validates inputs and calls `causalEdges.insertEdge(...)` directly (`causal-graph.ts:724-736`). `insertEdge` checks for an existing edge, updates strength/evidence/creator if found, otherwise inserts a new row (`causal-edges.ts:309-366`), and logs weight history when strength changes (`causal-edges.ts:382-384`). Manual unlink calls `deleteEdge(edgeId)` (`causal-graph.ts:936-947`), and storage deletes by id (`causal-edges.ts:743-753`). This would benefit from statediff only for declarative edge sets or generated spec-document chains, not for a user-commanded "create exactly this edge now" API.

## Coverage Map

| Mutation Path | Current Approach | Would benefit from statediff? | Why? |
|--------------|------------------|-------------------------------|------|
| `memory_index_scan` discovery | Incremental categorize into index/update/skip/delete, plus ad-hoc invalidation and alias conflict scan | Yes | This is already desired file set vs prior index rows. `insert/upsert/replace/delete` would make stale cleanup, replacement safety, mtime updates, and downstream target writes one action plan instead of scattered branches. |
| `memory_save` single-doc | Direct parser/quality/reconsolidation flow, then transactional create or append-only successor | Yes, with adaptation | Storage targets fit statediff, but PE/reconsolidation is semantic arbitration. Use statediff after the policy layer to reconcile rows for memory_index, embeddings, BM25, entities, graph edges, and chunks. |
| `memory_bulk_delete` | Direct selected row deletes, causal edge cleanup, ledger, cache hooks | Limited | Bulk delete can be represented as desired `NON_EXISTENCE` for selected memory ids, but the current command is intentionally imperative. Statediff is useful if bulk delete becomes a planned action list with per-target sinks and tombstones. |
| Causal edge upserts | `insertEdge` manually SELECTs existing edge, UPDATEs or INSERTs, and logs weight history | Partial | Declarative/generated edge sets should use statediff. Manual `memory_causal_link` is already an explicit upsert command; statediff adds little unless exposing conflict/replace/no-op metadata. |
| Alias/divergence reconciliation | Separate bucket summarizer plus mutation-ledger retry/escalation hook | Yes, with adaptation | Alias rows are exactly keyed desired/prior state. Need a policy overlay for divergent hashes: `replace` may mean canonicalize, retry, escalate, or block depending on authority. |
| Embedding re-index (K1.1 DAG) | Planned DAG/memo target reconciliation | Yes | Embedding vectors, embedding cache rows, BM25/FTS rows, summaries, and graph projections are child target rows under a memory document composite state. `diff_composite` is the right conceptual model. |
| FTS/BM25 row writes | Currently tied to index/save side effects and repair paths | Yes | Lexical rows are keyed projections of memory content. A target diff can decide insert/replace/delete independently from memory row persistence. |
| Cache invalidation | `runPostMutationHooks` clears process caches after writes | No, not directly | Caches are ephemeral subscribers. They should consume applied actions, not participate as durable desired/prior state. |

## Verdict on K1.3 + Handler Sketch

YES-WITH-ADAPTATION. Port the statediff reconciliation model for durable storage targets and generated projections; do not use it to replace cache invalidation hooks directly. The right architecture is a two-step write pipeline: first build a target-state plan from desired rows and prior rows, then apply typed actions through target-specific sinks. Post-mutation hooks become subscribers to the applied action batch, with enough detail to invalidate embedding, FTS/BM25, graph, entity-density, tool, trigger, and co-activation caches precisely.

Sketch:

```ts
export type DiffAction = 'insert' | 'upsert' | 'replace' | 'delete';

export const NON_EXISTENCE = Symbol('NON_EXISTENCE');
export type NonExistence = typeof NON_EXISTENCE;

export interface TrackingRecordTransition<T> {
  desired: T | NonExistence;
  prior: readonly T[];
  priorMayBeMissing: boolean;
}

export interface DiffPlanEntry<K, T> {
  key: K;
  action: DiffAction;
  desired: T | NonExistence;
  prior: readonly T[];
  reason: 'missing' | 'different' | 'incomplete-prior' | 'non-existence';
}

export interface CompositeTrackingRecord<Main, SubKey extends string, Sub> {
  main: Main;
  sub: Record<SubKey, Sub>;
}
```

Suggested helper location: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/statediff.ts`, with no dependency on MCP handlers. Add small target adapters beside storage modules: `memory-index-target.ts`, `embedding-target.ts`, `lexical-target.ts`, `causal-edge-target.ts`, and later `alias-target.ts`.

First refactor targets:

1. `memory_index_scan` planning: replace `toIndex/toUpdate/toSkip/toDelete` branching with a `MemoryIndexTargetPlan` over desired discovered docs and prior `memory_index` rows. Preserve current safety rule: do not apply delete actions for stale rows when replacement indexing failed.
2. Alias/divergence reconciliation: turn `memory-index-alias.ts` buckets into desired/prior alias target records. `replace` on divergent rows should route to a policy function that chooses canonicalize, retry, escalate, or block.
3. Embedding + FTS/BM25 projections: after `memory_save` commits a memory row, compute child target diffs for embedding cache/vector row, lexical row, entity rows, summaries, and generated graph edges. Cache hooks then invalidate based on applied child actions.

The causal edge API should be second-wave. Generated edge sets such as spec-document chains are excellent statediff candidates; manual `memory_causal_link` and `memory_causal_unlink` can stay imperative until the target abstraction exists.

## Questions Answered

- K1.3 answered: statediff can replace ad-hoc durable reconciliation and planning paths, but cache invalidation hooks should become action subscribers rather than statediff targets.

## Questions Remaining

- K1.4: assess stable path identity across spec folder moves, phase renames, symlinks, canonical path migrations, and delete-plus-recreate reindex behavior.
- K1.5: assess code-hash or logic-hash generation strategy for TypeScript modules.
- K1.6: determine how much DAG/reconciliation state should be exposed through MCP tool responses versus internal telemetry.
- K2.1, K2.2, K2.3, K2.5 remain open from the strategy.

## Next Focus

Recommend K1.4 next: stable path identity. K1.1 established DAG viability, K1.2 established lifecycle adaptation, and K1.3 establishes target-state reconciliation. The next blocker is whether stable identity can survive path aliases, moves, phase renames, and delete-plus-recreate flows without producing false `replace` or `delete` actions.
