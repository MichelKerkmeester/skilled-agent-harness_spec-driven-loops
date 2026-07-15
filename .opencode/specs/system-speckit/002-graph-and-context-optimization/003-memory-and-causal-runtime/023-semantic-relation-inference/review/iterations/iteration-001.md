# Deep Review — Iteration 001

- **Dimension**: correctness
- **Budget profile**: verify (read scope + ADRs, grep semantics, ran vitest + 2 runtime probes)
- **Mode**: review (READ-ONLY)
- **Verdict**: PASS (no active P0/P1; 2 active P2 advisories)

## Dispatcher

Single-dimension correctness review of the relation-inference backfill subsystem (spec 023, inheriting 021). Focus areas (a)-(h) from dispatch: supersession edge direction, similarity dedup direction-safety, dryRun zero-write across all 4 collectors, guard inheritance for the 2 new collectors, byRelation accounting, idempotency, threshold/top-K boundary, and whether the 200 contradicts candidates are genuine.

## Files Reviewed

- `lib/causal/relation-backfill.ts` (all 4 collectors + backfill driver + helpers)
- `lib/causal/relation-coverage.ts` (backfillJob stat + hint)
- `handlers/causal-graph.ts` (`handleMemoryCausalStats` backfill arg path)
- `schemas/tool-input-schemas.ts` (`memoryCausalStatsSchema.backfill`)
- `tools/types.ts` (`CausalStatsArgs.backfill`) — read via handler mirror
- `lib/storage/causal-edges.ts` (insertEdge guards, insertEdgesBatch, window cap)
- `lib/storage/lineage-state.ts:1140-1259` (supersession/predecessor write semantics)
- `lib/storage/reconsolidation.ts:359-369` (canonical `supersedes` edge direction)
- `lib/graph/contradiction-detection.ts:62-130` (insert-time guard semantics)
- `decision-record.md` ADR-001..003, both vitest suites (19 tests)

## Findings — New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **`written`/`byRelation` count upserts of pre-existing edges as freshly "written" on idempotent re-runs** — `lib/causal/relation-backfill.ts:577` (`written = execute()`), root cause `lib/storage/causal-edges.ts:326-338,380-394` and `:437` — On a second committed run the DB has zero NEW rows, yet `result.written` still equals the full candidate count. `insertEdge`'s `existing` branch performs an UPDATE then re-SELECTs and returns a non-null row id; `insertEdgesBatch` increments `inserted` for any non-null id (`:437`), so upserts of already-present edges are tallied as inserts. `countWrittenByRelation` (`:660-692`) then re-reads every matching `created_by='auto'` pair (including pairs written by a PRIOR run) and re-tallies them into `byRelation`. RUNTIME-CONFIRMED via probe: spec-chain fixture, RUN1 `written=3 dbCount=3`, RUN2 `written=3 dbCount=3` (no new rows) with `byRelation={"caused":3}` both times. The handler hint `Relation-inference backfill: wrote ${written} auto edges` (`handlers/causal-graph.ts:902`) therefore over-reports on every re-run, and `skipped = inferred - written` (`:604`) under-reports. No data corruption — the DB state is correct and idempotent; only the reported counts mislead. Idempotency test (5) checks DB count delta, not `result.written`, so the gap is untested.
   Finding class: reporting-accuracy (observability)
   Scope proof: confirmed inside declared target `relation-backfill.ts` + its direct storage dependency `causal-edges.ts`; runtime probe used dist build of the same files.
   Affected surface hints: `result.written`, `result.skipped`, `result.byRelation`; `memory_causal_stats` non-dry hint text; any operator/dashboard consuming the backfill summary.

   ```json
   {
     "type": "correctness",
     "claim": "On an idempotent committed re-run, result.written and byRelation report the full candidate count as if freshly written even though zero new rows are inserted.",
     "evidenceRefs": ["lib/causal/relation-backfill.ts:577", "lib/causal/relation-backfill.ts:660-692", "lib/storage/causal-edges.ts:326-394", "lib/storage/causal-edges.ts:437", "handlers/causal-graph.ts:902", "runtime-probe: RUN2 written=3 dbCount=3 unchanged"],
     "counterevidenceSought": "Checked whether insertEdge's existing-branch returns null (it returns the upserted rowId, non-null) and whether insertEdgesBatch distinguishes insert vs upsert (it does not — any non-null id counts as inserted). Confirmed test (5) asserts DB count not result.written.",
     "alternativeExplanation": "Could be intended as 'edges affected' rather than 'edges newly created', but the handler hint phrasing 'wrote N auto edges' and the field name 'written' assert new writes; dryRun path labels the same population 'skipped' candidates, so the non-dry 'written' is meant to be the actual inserts.",
     "finalSeverity": "P2",
     "confidence": 0.9,
     "downgradeTrigger": "Severity stays P2 because DB state is correct, idempotent, and bounded — only the summary numbers mislead; no wrong edges, no corruption, no unsafe mutation."
   }
   ```

2. **Inner `backfill` schema object is not strict — unknown/typo'd option keys are silently accepted and ignored** — `schemas/tool-input-schemas.ts:417` (`backfill: z.object({ ... }).optional()`) — The outer `memoryCausalStatsSchema` is built via `getSchema` which applies `.strict()` (`:28-32`), but the nested `backfill` object is a bare `z.object` with no `.strict()`. RUNTIME-CONFIRMED via probe: `{ backfill: { dryRun:false, bogusKey:1 } }` is ACCEPTED, while `{ bogusOuter:1 }` is correctly REJECTED. Consequence: a mistyped opt-in flag (e.g. `contradict` instead of `contradicts`, or `threshold` instead of `similarityThreshold`) is dropped silently, so the collector stays OFF / runs at the default with no error surfaced to the operator. Given ADR-003 makes the collectors strictly opt-in, a swallowed typo means the operator believes a collector ran when it did not. Test (9) only covers wrong-typed values and out-of-range thresholds, never an unknown inner key.
   Finding class: input-validation-hygiene
   Scope proof: confirmed inside declared target `schemas/tool-input-schemas.ts`; runtime probe used dist build of the same schema module.
   Affected surface hints: `memory_causal_stats({ backfill: {...} })` callers; the opt-in flags `similarity` / `contradicts` / `similarityThreshold`; operator UX when a flag is mistyped.

   ```json
   {
     "type": "correctness",
     "claim": "The nested backfill schema object accepts unknown keys (not strict), so typo'd opt-in option names are silently ignored rather than rejected.",
     "evidenceRefs": ["schemas/tool-input-schemas.ts:417", "schemas/tool-input-schemas.ts:28-32", "runtime-probe: inner bogusKey accepted, outer bogusOuter rejected"],
     "counterevidenceSought": "Checked whether getSchema strictness propagates into nested z.object (it does not — strict()/passthrough() apply only to the object getSchema wraps). Checked test (9) for an unknown-inner-key case (absent).",
     "alternativeExplanation": "Zod nested objects being non-strict by default is standard; could be deemed acceptable laxity. But the parent schema deliberately enforces strict, so the nested looseness is an inconsistency, not an intentional passthrough.",
     "finalSeverity": "P2",
     "confidence": 0.92,
     "downgradeTrigger": "Severity stays P2 because it cannot corrupt data or produce wrong edges — worst case a collector silently stays at its safe default (off / default threshold)."
   }
   ```

## Traceability Checks

- **(a) Supersession edge direction** — VERIFIED CORRECT. `collectSupersessionEdges` (`relation-backfill.ts:304-323`) emits `contradicts` from `row.memory_id` (predecessor / older) -> `row.superseded_by_memory_id` (successor / newer). Confirmed against the lineage writer `lib/storage/lineage-state.ts:1172-1173,1238-1239`: a row's `superseded_by_memory_id = successor.id` and `predecessor_memory_id = predecessor.id`, so `memory_id` IS the older version. ADR-002 (`decision-record.md:153-159`) and test (4) (`relation-backfill-similarity.vitest.ts:233-250`, predecessor 20 -> successor 21) both assert this exact direction. No reversal.
- **Supersedes vs contradicts direction non-conflict** — VERIFIED. The canonical `supersedes` edge is written NEW->OLD (`reconsolidation.ts:360` `insertSupersedesEdge(db, newId, existingMemory.id)`). The new collector emits OLD->NEW but under a DIFFERENT relation (`contradicts`), so it neither overwrites nor contradicts the `supersedes` convention; `contradicts` is a symmetric-conflict assertion where direction is not semantically loaded. ADR-002 deliberately chose `contradicts` over `supersedes`.
- **(b) Similarity dedup direction-safety** — VERIFIED CORRECT. `pairKey` (`:221-223`) is order-independent; `excludedPairs` is built from spec-chain DIRECTED edges (`:450-455`) and consulted via `pairKey` in `collectSimilarityEdges` (`:282`), so a `supports` inference is suppressed in EITHER direction for an already-structurally-linked pair. Test (8) (`:341-371`) asserts no supports edge in either direction for the spec-chain pair {200,201}.
- **(c) dryRun writes ZERO across all 4 collectors** — VERIFIED. The dry-run branch (`:477-501`) returns before the write transaction is even constructed/executed; it only tallies candidate `byRelation`. No `insertEdgesBatch` call on the dry path. Tests (1)(2) assert `after === 0` rows including with both opt-in collectors on.
- **(d) Guard inheritance for the 2 NEW collectors** — VERIFIED. Both new collectors route through `insertEdgesBatch` -> `insertEdge` with `createdBy:'auto'` (`:548-571`). `insertEdge` applies, for auto edges: strength clamp `Math.min(strength, 0.5)` (`causal-edges.ts:270-272`), per-node cap `MAX_EDGES_PER_NODE=20` (`:283-289`), and window cap via `enforceRelationWindowCap` (`:340`). Tests (3)(4) assert `created_by='auto'` and `strength <= MAX_AUTO_STRENGTH` on the new edges.
- **(f) Idempotency** — DB-state CORRECT (UNIQUE(source,target,relation) upsert; test (5) confirms unchanged count). Reporting layer has the P2 accounting gap above.
- **(g) Threshold / top-K boundary** — VERIFIED. `n.similarity >= threshold` inclusive (`:276`), self excluded (`n.id !== row.id`), deterministic sort `b.similarity - a.similarity || a.id - b.id`, `slice(0, SIMILARITY_TOP_K=5)` (`:277-278`). Threshold clamped to 1-100 (`:353-355`). Tests (3)(3b)(3) cover the 75/85 boundary and the 6->5 top-K clamp.
- **(h) Are the 200 contradicts genuine?** — VERIFIED genuine. They derive ONLY from `memory_lineage.superseded_by_memory_id` (a recorded structural fact), never from embedding similarity (ADR-002 forbids that and `detectContradictions` as a candidate source). Each candidate is a real predecessor/successor supersession pair, not a mislabeled similarity. No semantic false-positive risk in the candidate set.

## Integration Evidence

- `handlers/causal-graph.ts:825-839` threads `dryRun/limit/actor/similarity/contradicts/similarityThreshold` into `backfillRelationInference`; defaults `dryRun !== false` (dry by default). `:898-904` emits the summary hint (subject to P2 #1 over-reporting on re-run).
- `lib/causal/relation-coverage.ts:53,122` advertises the exact opt-in command string; consistent with ADR-003.
- `enforceRelationWindowCap` (`causal-edges.ts:203-227`, `CAP_PER_WINDOW=100`): the LIVE 200-candidate-per-relation runs (200 contradicts / 200 supports) will be silently capped near 100/relation/15-min window on a real commit. This is correct safeguard behavior and is absorbed into `skipped`; flagged as an OPERATIONAL note, not a defect — a full commit needs multiple windowed runs.

## Edge Cases

- Bare numeric ids in `related_memories` carry no similarity and are dropped (`parseRelatedNeighbors:243-255`) — can never clear `>=1` threshold. Correct.
- Unparseable / empty / NULL `related_memories` -> `[]`, no throw (`:232-240`). Test (6)(6b) confirm.
- Absent `related_memories` column or `memory_lineage` table -> `columnExists`/`tableExists` no-op guards (`:407,423-427`). Test (7) confirms zero edges, no throw.
- Window cap and per-node cap both silently reduce `written` below `inferred`; `skipped` absorbs the difference correctly, but combined with P2 #1 the upsert-counting muddies interpretation across re-runs.

## Confirmed-Clean Surfaces

- Supersession direction (a) and similarity dedup direction-safety (b) — clean.
- dryRun zero-write across all 4 collectors (c) — clean.
- Guard inheritance for both new collectors (d) — clean.
- Threshold/top-K boundary math (g) — clean.
- Genuineness of the contradicts candidate set (h) — clean.
- DB-state idempotency (UNIQUE upsert) — clean.

## Ruled Out

- **Reversed supersession `contradicts` direction (suspected P0/P1)** — RULED OUT. Direction matches lineage writer semantics, ADR-002, and test (4).
- **`supersedes` (NEW->OLD) vs new `contradicts` (OLD->NEW) directional conflict** — RULED OUT. Different relation types; no overwrite; `contradicts` direction is not semantically load-bearing.
- **dryRun leaking writes through one of the 4 collectors** — RULED OUT. Single early-return dry branch precedes any write path.
- **Guard bypass on the 2 new collectors** — RULED OUT. All route through `insertEdge` auto path.
- **Mislabeled similarity-as-contradiction** — RULED OUT. Contradicts derive solely from structural supersession.
- **Threshold off-by-scale (0-1 vs 0-100)** — RULED OUT. Consistent 0-100 across ADR-001, code, and fixtures.

## Next Focus

- **Dimension**: security / db-safety-determinism (next iteration)
- **Focus area**: transaction atomicity of `execute()` partial-failure path (`written=0` on catch at `:578-580`) and whether `invalidateEntityDensityCache()` is reached on a thrown/rolled-back transaction; cap/window behavior on the recovered ~9258-edge production DB.
- **Reason**: correctness dimension is clean (PASS); the only residual risks are operational/db-safety, not logic.
- **Rotation status**: correctness COMPLETE.
- **Blocked/productive carry-forward**: productive — runtime-probe technique (dist + in-mcp_server node script) worked well; reuse for db-safety verification.
- **Required evidence**: file:line + runtime probe for any P0/P1 in the next dimension.
