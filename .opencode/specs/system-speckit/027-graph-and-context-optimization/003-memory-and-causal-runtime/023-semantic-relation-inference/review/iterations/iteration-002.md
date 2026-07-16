# Deep Review — Iteration 002

## Dispatcher
- Run: deep-review iteration 2
- Dimension: **security**
- Budget profile: `verify` (read scope + guard chain + contradiction side-effect path)
- Mode: READ-ONLY (no reviewed code modified)
- Status: complete

## Files Reviewed
- `lib/causal/relation-backfill.ts` (collectors, scan SQL, JSON parse, threshold/limit clamps)
- `schemas/tool-input-schemas.ts` (`memoryCausalStatsSchema.backfill`, strict mode)
- `tools/types.ts` (`CausalStatsArgs.backfill`)
- `handlers/causal-graph.ts` (`handleMemoryCausalStats` → backfill dispatch, threshold passthrough)
- `lib/storage/causal-edges.ts` (`insertEdge` guards, `insertEdgesBatch`, `detectContradictions` invocation)
- `lib/graph/contradiction-detection.ts` (`detectContradictions`, `relationsConflict`)
- `lib/graph/temporal-edges.ts` (`invalidateEdge` scope)
- `lib/causal/relation-coverage.ts`, `lib/search/entity-density.ts`
- `tests/relation-backfill-similarity.vitest.ts`, `tests/relation-backfill-unit.vitest.ts`
- ADR-001 (decision-record.md)

## Findings — New

### P0 Findings
_None._

### P1 Findings

1. **Opt-in `contradicts` collector can silently invalidate existing higher-confidence edges on the same source→target pair** — `lib/causal/relation-backfill.ts:304-323` (collector) → `lib/storage/causal-edges.ts:300-307` (`detectContradictions` call inside `insertEdge`) → `lib/graph/contradiction-detection.ts:104-110` (Rule 2) → `lib/graph/temporal-edges.ts:83-89` (`invalidateEdge` relation-filtered UPDATE)
   - Description: When `contradicts:true`, the supersession collector emits a `contradicts` edge for the directed pair `predecessor → successor` (relation-backfill.ts:314-319). Persisting it routes through `insertEdge`, which — because `isTemporalEdgesEnabled()` defaults TRUE (search-flags.ts:678-679) — calls `detectContradictions(db, newSourceId, newTargetId, 'contradicts')`. `relationsConflict` (contradiction-detection.ts:38-56) declares `['supports','contradicts']`, `['caused','contradicts']`, `['enabled','contradicts']` mutually exclusive. So if ANY existing valid `supports`/`caused`/`enabled` edge already sits on that exact `predecessor → successor` pair, `invalidateEdge(db, newSourceId, newTargetId, reason, oldRelation)` (contradiction-detection.ts:110) sets `invalid_at` on it (temporal-edges.ts:83-89), soft-removing it from all valid traversal/scoring. The invalidated edge may be a **manually created** (`created_by='manual'`, full-strength) edge. A low-strength (0.3) `created_by='auto'` inference therefore overrides/suppresses a higher-confidence human-authored edge on the shared multi-user DB — silently, with no count of invalidations surfaced in the backfill summary (`written`/`byRelation` count inserts only). This is the security-relevant data-integrity angle in the dimension brief (d): an opt-in collector mutating shared traversal state for ALL users.
   - Concrete collision path: the lineage collector (relation-backfill.ts:195-214) emits `caused` for `predecessor → successor`. The supersession collector emits `contradicts` for the SAME `predecessor → successor` direction (both keyed on `memory_id` as predecessor / superseded-by as successor — relation-backfill.ts:307,314-318 vs 198,205-211). A single `memory_causal_stats({ backfill:{ dryRun:false, contradicts:true } })` run on a DB that already has the lineage `caused` edge (from a prior lineage-only run, or because both collectors are wired into the same insert ordering) will invalidate that `caused` edge. The 200 candidate `contradicts` edges reported in the live dry-run (per strategy.md:17,24) make this a realistic mass-invalidation surface, not a corner case.
   - Adjudication (compact skeptic/referee): Skeptic challenge 1 — "is the conflicting edge ever actually co-present?" The lineage `caused` and supersession `contradicts` collectors emit the same directed pair, so co-presence is reachable in normal use (lineage run, then contradicts run), and manual `caused`/`supports` edges on lineage pairs are plausible. Challenge 2 — "is this NEW behavior or pre-existing?" The `detectContradictions`/`invalidateEdge` chain pre-exists, but packet 023 is what first auto-emits `contradicts` edges in bulk from a maintenance command; before 023 no automated path produced `contradicts` at scale, so 023 is what makes the latent invalidation reachable en masse. Referee verdict: real missing safeguard, severity **P1** (not P0): it is opt-in (`contradicts` default false — relation-backfill.ts:351), edges are soft-invalidated (recoverable via `invalid_at`, not deleted), and it requires `dryRun:false`. It is not a blocker but is a genuine unsafe side effect the prior 3-lens verify did not surface.
   - Recommendation: before emitting an auto `contradicts` edge, skip (or downgrade to no-op) when a valid `caused`/`supports`/`enabled` edge already exists on the same pair; OR pass a guard so `detectContradictions` does not invalidate `created_by='manual'` or higher-strength edges when the incoming edge is a low-strength auto inference; OR surface an `invalidated` count in the backfill summary so the operator sees the side effect. At minimum, document in ADR/checklist that opt-in `contradicts` can invalidate existing edges and add a test asserting an existing `caused` edge on a supersession pair is NOT silently invalidated by the auto collector.
   - Finding class: missing safeguard (unsafe shared-state mutation)
   - Scope proof: full chain cited file:line within reviewed scope + its immediate guard dependencies (contradiction-detection.ts, temporal-edges.ts) named as integration surfaces.
   - Affected surface hints: `memory_causal_stats({ backfill:{ contradicts:true } })`, `causal_edges.invalid_at`, downstream `memory_drift_why` traversal (only-valid-edge filter), `enableCausalBoost` search scoring.

   ```json
   {
     "id": "SEC-001",
     "type": "data-integrity / unsafe-mutation",
     "claim": "Opt-in contradicts collector routes through detectContradictions and can invalidate an existing valid caused/supports/enabled edge (possibly manual, higher-confidence) on the same source->target pair, with no invalidation count surfaced.",
     "evidenceRefs": [
       "lib/causal/relation-backfill.ts:314-319",
       "lib/storage/causal-edges.ts:300-307",
       "lib/graph/contradiction-detection.ts:38-56",
       "lib/graph/contradiction-detection.ts:104-110",
       "lib/graph/temporal-edges.ts:83-89",
       "lib/search/search-flags.ts:678-679"
     ],
     "counterevidenceSought": "Checked whether contradicts default-off (yes, relation-backfill.ts:351) and whether invalidation is hard-delete (no — soft invalid_at, temporal-edges.ts:86). Checked whether co-present conflicting edge is reachable (yes — lineage caused + supersession contradicts share the predecessor->successor direction).",
     "alternativeExplanation": "If SPECKIT_TEMPORAL_EDGES is disabled, detectContradictions/invalidateEdge are no-ops (contradiction-detection.ts:75, temporal-edges.ts:75); but the flag defaults TRUE.",
     "finalSeverity": "P1",
     "confidence": 0.72,
     "downgradeTrigger": "If product intent is that an auto contradicts edge SHOULD supersede a conflicting caused/supports edge, this is by-design and drops to P2 (still warrants surfacing an invalidated count)."
   }
   ```

### P2 Findings

2. **`handleMemoryCausalStats` re-derives `dryRun` but forwards raw `limit`/`similarityThreshold`/`similarity`/`contradicts` to the backfill without the schema's clamps when invoked outside the validated dispatch path** — `handlers/causal-graph.ts:825-834`
   - Description: The strict Zod schema (`memoryCausalStatsSchema`, schemas/tool-input-schemas.ts:417-427) bounds `limit` to 1-2000 and `similarityThreshold` to 1-100 integer, and only validated args reach the handler in the normal MCP dispatch flow. The backfill itself ALSO clamps `limit` (relation-backfill.ts:344-346, `Math.min(rawLimit, MAX_LIMIT=2000)`, default 200) and `similarityThreshold` (relation-backfill.ts:353-355, `Math.max(1, Math.min(100, ...))`, default 75 if non-integer), so a hostile/un-validated `similarityThreshold` of `NaN`, `0.5`, negative, or `1e9` falls through to a safe default or clamp — no overflow, no scale-mismatch promotion of every neighbour. DoS via crafted `limit` is bounded at 2000 rows per collector. This is defense-in-depth and currently SAFE; the P2 is only that the dual-clamp split (schema + collector) is implicit and a future caller that bypasses both layers would rely solely on the collector clamp. No action required beyond awareness.
   - Finding class: defense-in-depth (informational)
   - Scope proof: schema + handler + collector clamp sites all cited within scope.
   - Affected surface hints: `memory_causal_stats` direct handler callers (non-dispatch).

3. **`columnExists` interpolates the table name directly into `PRAGMA table_info(${table})`** — `lib/causal/relation-backfill.ts:145`
   - Description: `PRAGMA table_info(${table})` string-interpolates `table`. PRAGMA arguments cannot be bound parameters in sqlite, so interpolation is the only option here — this is the standard pattern. It is SAFE because every call site passes a hardcoded string literal (`'memory_index'` at relation-backfill.ts:407; `'memory_lineage'` at relation-backfill.ts:426); `table` is never derived from user input. Flagged only so a future refactor does not start passing caller-supplied table names through this helper. No SQL injection reachable today.
   - Finding class: latent-pattern (informational)
   - Scope proof: helper + both call sites cited.
   - Affected surface hints: none (no user-reachable path).

## Traceability Checks
- ADR-001 (decision-record.md) claims the similarity collector reads ONLY the pre-computed `related_memories` column (no live vector scan, no O(n^2)). Verified against relation-backfill.ts:404-419 + `collectSimilarityEdges` (267-295): single bounded `SELECT ... LIMIT ?`, top-K=5 per row, no all-pairs — matches ADR. ACCURATE.
- The decision-record does NOT document the `contradicts`→`invalidateEdge` side effect (SEC-001); this is a traceability gap feeding the P1 recommendation but is filed under security here.

## Integration Evidence
- `detectContradictions` (contradiction-detection.ts) and `invalidateEdge` (temporal-edges.ts) inspected directly as the guard chain the `contradicts` collector inherits — these are the exact integration surfaces that turn an insert into an invalidation. Feature gate `isTemporalEdgesEnabled()` (search-flags.ts:678-679, default TRUE) confirmed as the activation condition.
- `insertEdge` guards confirmed: MAX_AUTO_STRENGTH=0.5 clamp (causal-edges.ts:270-272), MAX_EDGES_PER_NODE=20 reject (causal-edges.ts:283-288), self-loop reject (causal-edges.ts:275-277), relation window cap (causal-edges.ts:340-342). All edges are fully parameterized (causal-edges.ts:344-365). The new scan SQL in relation-backfill.ts (378-435) is fully parameterized — `limit` is the only bound value and is passed via `?`.

## Edge Cases
- JSON.parse on `related_memories` (relation-backfill.ts:232-256): wrapped in try/catch → `[]` on throw; non-array → `[]`; only `{id:number, similarity:number}` with `Number.isFinite` survive. No prototype-pollution surface (parsed object's `id`/`similarity` are read by direct property access, never spread/merged into a target; `__proto__` keys in the JSON cannot reach `Object.prototype` here). Hostile/malformed input is safely dropped — sub-question (e) clears.
- Type confusion on `similarityThreshold` (sub-question c): `Number.isInteger` gate (relation-backfill.ts:353) rejects floats/NaN/strings and falls back to default 75; clamp bounds to 1-100. Bare numeric neighbour ids (no similarity) can never clear a `>=1` threshold (parseRelatedNeighbors drops them) — SAFE.
- DoS (sub-question b): every collector scan is `LIMIT ?` bounded at ≤2000; similarity is top-K=5 per row, no all-pairs; no pathological-chain recursion in the collectors. Bounded.

## Confirmed-Clean Surfaces
- (a) SQL injection: all new scans + edge inserts fully parameterized; PRAGMA interpolation is hardcoded-literal only. CLEAN.
- (b) DoS/unbounded work: bounded by LIMIT≤2000 + top-K=5. CLEAN.
- (c) strict-schema completeness: dual clamp (schema 1-100/1-2000 + collector clamp). CLEAN.
- (e) JSON.parse hostile input: try/catch + shape filter, no prototype pollution. CLEAN.

## Ruled Out
- SQL injection in `related_memories` / supersession / limit scans — all parameterized (relation-backfill.ts:378-435).
- Prototype pollution via `JSON.parse(related_memories)` — direct property read only, no merge/spread.
- Integer overflow / scale-mismatch via `similarityThreshold` — `Number.isInteger` + clamp.
- DoS via crafted `limit` — clamped to MAX_LIMIT=2000.

## Next Focus
- Dimension: traceability
- Focus area: ADR-001..004 / checklist evidence vs implementation, esp. whether the `contradicts`→`invalidateEdge` side effect (SEC-001) is documented anywhere; verify the live dry-run distribution (218 caused / 200 contradicts / 3 supports) against design intent.
- Reason: security dimension complete; the undocumented invalidation side effect is also a traceability gap worth confirming.
- Rotation status: security done; correctness covered in iter-001; traceability + maintainability remain.
- Blocked/productive carry-forward: SEC-001 (P1) carry forward for synthesis re-check; productive category = guard-chain side-effect analysis.
- Required evidence: decision-record.md ADR bodies, checklist.md evidence rows.

## Verdict
**CONDITIONAL** — no active P0; one active P1 (SEC-001) requires a safeguard or explicit by-design documentation before promotion. P2s are advisory.
