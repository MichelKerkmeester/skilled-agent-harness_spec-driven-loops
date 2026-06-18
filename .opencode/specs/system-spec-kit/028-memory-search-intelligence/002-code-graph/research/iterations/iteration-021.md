# Iteration 21: Round I Implementation Sketch — Q6-C2 soft generation watermark (ready-to-spec)

## Focus
Round I: build sketch for Q6-C2 (additive generation int on the freshness envelope). Read-only.

## Build sketch (newInfoRatio 0.35) — **READY-TO-SPEC**
- **TOUCH:** `code-graph-context.ts:52` (freshness envelope type — add `generation:number`); `:313-326` `computeFreshness()` (sole builder, surfaced at `:251` main + `:278` empty-fallback); `code-graph-db.ts:559-567` `setMetadata`/`getMetadata` (add typed `getCodeGraphGeneration()`/`bumpCodeGraphGeneration()` beside exports :574-580, mirroring the int-as-string precedent at :238); **`ensure-ready.ts:497`** — the real per-scan bump point (co-located with `setLastGitHead`), NOT code-graph-db.ts (which only owns the KV helper).
- **CHANGE:** `bumpCodeGraphGeneration()` = read `graph_generation` → parseInt||0 → setMetadata(n+1), called once at scan finalize; `computeFreshness()` adds `generation: getCodeGraphGeneration()` (default 0). No error gate, no consumer reacts.
- **TEST:** two scans → generation n then n+1; unset → 0; context result `metadata.freshness.generation` equals the counter; queries return identical node/edge set (no read-filter change).
- **WHAT-BREAKS:** nothing — purely additive; both freshness producers flow through `computeFreshness()`; the separate compact-merger freshness type ignores it.
- **READINESS:** ready-to-spec.

## Next Focus
Q6-C2 is fully spec'd (additive generation counter; bump at ensure-ready.ts:497). The staged predecessor to Q6-C1's hard gate. Feeds Round J (Code Graph Wave-0).
