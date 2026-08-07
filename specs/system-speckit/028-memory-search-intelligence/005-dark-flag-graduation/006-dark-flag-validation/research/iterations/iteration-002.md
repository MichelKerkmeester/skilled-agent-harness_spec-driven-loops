# Iteration 002: Implementation Code Analysis

## Focus
Read the implementation code for the 4 GRADUATE clusters to understand exactly what each flag gates on the production path.

## Findings

### 1. MULTIHOP TAIL-APPENDS (001)

**Flags gated at:** `orchestrator.ts:207-209` — post-fusion tail-append stage, runs AFTER Stage-4 final-limit cap.

**Deterministic Multihop (`orchestrator.ts:224-240`, `deterministic-multihop.ts:195-292`):**
- Reads top-5 recalled docs and extracts folder-slug patterns (`\b\d{3}-[a-z0-9]+(?:-[a-z0-9]+)*\b`) from content_text
- Resolves each slug 1:1 to a unique spec_folder via SQL. Ambiguous (0 or 2+ matches) → skipped
- Fetches that folder's spec.md, dedupes against the already-fused "protected window"
- Appends up to 10 tail candidates with strictly decreasing scores below the weakest baseline hit
- Source tag: `multihop`

**Lane Champion Backfill (`orchestrator.ts:242-251`, `lane-champion-backfill.ts:100-162`):**
- For each lane (vector, fts, bm25, trigger), takes the first candidate not already in fused results
- Each lane contributes at most one champion. Appended with decreasing scores.
- Source tag: `lane-champion:<lane>`

**Classification:** Additive — purely appends candidates, never evicts or reorders baseline hits. OFF = byte-identical.

**Structural note:** Previously unreachable — ran inside `enrichFusedResults` which was skipped when `stopAfterFusion=true` (production default). Rewired to run AFTER the stage-4 cap.

### 2. CODE-GRAPH STALENESS REPAIR + BITEMPORAL READS (006)

**Staleness Repair (`structural-indexer.ts:2258-2366`):**
- During incremental scan, checks `symbolIdentityChanged()` for stale files
- For files where identity changed (rename, kind-flip, move), collects file paths
- Applies degree cap — drops importers exceeding cap from re-parse
- Calls `queryImportersOf()` and force-parses every qualifying importer to rebind cross-file edges
- OFF: unchanged files never re-parsed, broken edges persist until importer is next edited
- ON: broken edges repaired proactively
- Classification: Corrective — fixes correctness bug. Default-off because fan-in cost.

**Bitemporal Reads (`code-graph-db.ts:284,293-295`):**
- `closeEdgesForSources`: Stamps `invalid_at` on live edges (preserves row, never deletes)
- `insertEdgeWithValidity`: Stamps `valid_at` on new edges
- `asOfEdgesFrom`: Filters by validity window — as-of past generation returns old edge target
- OFF: `closeEdgesForSources` is no-op, `insertEdgeWithValidity` does plain INSERT, `asOfEdgesFrom` falls back to live-only `queryEdgesFrom()`
- Classification: Additive — schema columns always present, consumption gated. Consumer built but not yet wired to re-index edge replacement path.

### 3. ADVISOR RRF FUSION (007)

**RRF Fusion (`fusion.ts:304-331`, gated at `fusion.ts:648`):**
- OFF: Weighted-sum fusion — rawScore × weight per lane, summed. Conflicts are signed (negative scores added directly). Tiebreak = confidence.
- ON: Rank-based RRF — each lane contributes `1/(8 + rank)`. `graph_causal` lane split into positiveMatches (fed to RRF) and conflictMatches (reserved for post-fusion adjustment). Conflict-rerank seam applies raw conflict score as comparator demotion. Tiebreak = RRF rank order.
- Classification: Substitutive — ON replaces weighted-sum entirely. Proven byte-identical when OFF across 42 prompts.

**Key difference from weighted-sum:** No single lane can dominate (rank-based cap per lane ≈ 0.125). Conflict suppression is post-fusion (demotion) rather than in-fusion (signed addition).

**Conflict-rerank seam:** Applies raw conflict score at the sort comparator level. When conflicts exist, the conflict delta can be larger than the RRF score gap, making conflict suppression the dominant sort factor. Benched: 4/5→5/5 correct on conflict band.

### 4. DEEP-LOOP FINDING DEDUP (008)

**Near-duplicate dedup (`fanout-merge.cjs:280-283, 294-421`):**
- OFF: Exact `id||title` first-write-wins dedup. Two workers restating same finding under different ids survive as separate records.
- ON: Content-normalized bucketing — identity key built from `[summary, description, finding, question, direction]` (excludes title). Whitespace-collapsed, case-insensitive comparison. `chooseCanonicalRecord()` picks best id/title. Review findings preserve strongest severity. Same-id/different-content = conflict variants with `_conflicts` markers.
- Classification: Substitutive — changes merge algorithm. OFF = byte-identical.

**Lag ceiling (`fanout-pool.cjs:320-384`):**
- Tracks `oldestPendingLagMs`. Fires `lag_ceiling_exceeded` warning once when exceeded. Zero = disabled.

**Progress heartbeat (`fanout-run.cjs:293-315`):**
- Per-lineage `setInterval` writing `progress` events to status ledger. `unref()`d. Zero cadence = disabled.

### Sources
[SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:207-270`] — multihop tail-append stage
[SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:2258-2366`] — staleness repair
[SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:1888-1960`] — bitemporal reads
[SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/skill-advisor/fusion.ts:304-331,648,773-774`] — RRF fusion + conflict seam
[SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:129-421`] — near-dup dedup algorithm
[SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:320-384`] — lag ceiling
[SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:293-315,666-671`] — progress heartbeat

## Novelty
- newInfoRatio: 0.90 — Established detailed implementation understanding for all 4 clusters: additive (multihop), corrective (staleness), additive (bitemporal), substitutive (RRF, dedup), additive (gauges). Found critical structural detail: multihop was previously unreachable on production path (ran inside `enrichFusedResults` skipped by `stopAfterFusion`), now rewired AFTER stage-4 cap.

## Next Focus
Triangulate across implementation, benchmark evidence, and retrieval/graph/routing theory: for each graduate, map tested vs untested scenario classes, predict where each genuinely helps/hurts/is a no-op, and identify benchmark coverage gaps.
