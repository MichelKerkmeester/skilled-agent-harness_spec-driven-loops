===FINDINGS START===

## ConvergenceSignal (formula + inputs + default threshold + justification)

**5 signals, matching existing 5-signal pattern:**

| Signal | Formula | Input |
|---|---|---|
| `scopeCoverage` | target_scope_nodes_with_≥2_rels / total_target_scope_nodes | SCOPES_TO edges on SCOPE nodes |
| `newRelevantInfoRatio` | new_relevant_context_units_above_gate / total_context_units_this_iteration | per-iteration diff of REVEALS/REFERENCES edges |
| `relevanceFocus` | mean_relevance_of_collected_context_units | edge.weight on REVEALS edges (0–1) |
| `patternReuseRate` | identified_reusable_patterns / total_symbols_analyzed | REUSES edges from SYMBOL to PATTERN |
| `frontierRemaining` | unvisited_frontier_nodes / initial_frontier_size | VISITED edges on FRONTIER nodes |

**Composite score** (mirrors `computeCompositeScore` at convergence.cjs:116):
```
scopeCoverage        × 0.30
patternReuseRate     × 0.25
relevanceFocus       × 0.20
(1 - newRelevantInfoRatio) × 0.15
(1 - frontierRemaining)    × 0.10
```

**Default threshold for `newRelevantInfoRatio`: 0.12**

Justification: research=0.05 (noisy external web, high novelty variance), review=0.10 (severity-filtered audit). Code context is more predictable than web research (structural, graph-traversable) but broader than severity audit (breadth-first sweep). 0.12 reflects moderate diminishing returns — after ~12% of a slice yields new relevant context, the loop should consider saturation. Higher than research because code is richer per-slice; slightly above review because context sweeps are breadth-first, not severity-gated.

## RelevanceGate (mechanism, where enforced)

**Two-part gate:**

1. **Edge-weight gate** (filters collection): each context unit (REVEALS edge) carries `metadata.relevance ∈ [0,1]`. Only units with `relevance ≥ 0.5` count toward `newRelevantInfoRatio` numerator. This prevents tangentially related code from inflating "new info" and blocking saturation.

2. **Mean-relevance blocker** (blocks convergence): `relevanceFocus < 0.4` → blocker `low_relevance_focus` with severity=blocking. Ensures the loop doesn't converge while collecting mostly-low-relevance context.

**Enforced at:** `evaluateContext()` in convergence.cjs (new function), analogous to `evaluateResearch()` at line 189 and `evaluateReview()` at line 223. The gate is applied when computing `newRelevantInfoRatio` — edge weights below threshold are excluded from the numerator.

**Why 0.5 gate / 0.4 blocker:** 0.5 gate = "must be at least moderately relevant to count as discovered context." 0.4 blocker = "if the mean of all collected context drops below moderate relevance, the loop is chasing noise — stop it even if other signals pass."

## SignalFunctionsToAdd

**coverage-graph-signals.ts:**
- `ContextConvergenceSignals` interface (after line 45): `{ scopeCoverage, newRelevantInfoRatio, relevanceFocus, patternReuseRate, frontierRemaining }`
- Add `'context'` to `ConvergenceSignals` union at line 47
- `computeContextSignals(ns: Namespace): ContextConvergenceSignals` (new function after `computeReviewSignals` at line 553)
- `computeContextScopeCoverageFromData(nodes, edges): number` — mirrors `computeResearchQuestionCoverageFromData` (line 284)
- `computeContextNewRelevantInfoRatioFromData(nodes, edges, previousSnapshot): number` — compares current vs previous edge set, filters by `edge.weight >= 0.5`
- `computeContextRelevanceFocusFromData(edges): number` — mean of REVEALS edge weights
- `computeContextPatternReuseRateFromData(nodes, edges): number` — REUSES edges / SYMBOL nodes
- `computeContextFrontierRemainingFromData(nodes, edges): number` — unvisited / total FRONTIER nodes
- Extend `computeSignals` dispatch at line 565: add `if (ns.loopType === 'context') return computeContextSignals(ns);`

**convergence.cjs:**
- `evaluateContext(signals, gaps, contradictions)` — new function after `evaluateReview` (line 249), with thresholds:
  - `scopeCoverage: 0.65` (blocking_guard — analogous to review's dimensionCoverage:0.8 but lower because context scope is fuzzier)
  - `newRelevantInfoRatio: 0.12` (weighted — the saturation trigger)
  - `relevanceFocus: 0.4` (blocking_guard — the relevance gate)
  - `patternReuseRate: 0.3` (weighted — must find reusable patterns)
  - `frontierRemaining: 0.2` (weighted — diminishing returns)
- Extend `computeCompositeScore` at line 116: add `if (loopType === 'context')` branch with weights above
- Extend loopType validation at line 268: add `'context'` to allowed values
- Extend main signal computation at line 324: add `context` branch calling `computeContextSignals`

**coverage-graph-db.ts:**
- Extend `LoopType` at line 10: `'research' | 'review' | 'context'`
- Add `ContextNodeKind = 'SCOPE' | 'MODULE' | 'FILE' | 'SYMBOL' | 'PATTERN' | 'DEPENDENCY' | 'INTERFACE' | 'FRONTIER'` (after line 24)
- Add `ContextRelation = 'SCOPES_TO' | 'CONTAINS' | 'IMPORTS' | 'CALLS' | 'IMPLEMENTS' | 'USES' | 'DUPLICATES' | 'REVEALS' | 'REFERENCES' | 'REUSES' | 'VISITED'` (after line 45)
- Extend `VALID_KINDS` at line 130: add `context: [...]`
- Extend `VALID_RELATIONS` at line 146: add `context: [...]`
- Extend CHECK constraint at line 156: add `'context'`
- Extend CHECK constraint at line 171: add `'context'`

**New ADR required** per deep-loop-runtime/SKILL.md §4 — `context` as 3rd consumer of coverage-graph.

## OpenQuestions

1. **Frontier node lifecycle:** Should FRONTIER nodes be created at iteration 0 (full target scope) and pruned as VISITED edges are added? Or dynamically expanded as new dependencies are discovered? Dynamic expansion risks infinite loops; static frontier risks missing transitive dependencies.

2. **Scope definition mechanism:** How does the user specify the target scope? Via a glob pattern (e.g., `src/services/**/*.ts`), a set of entry-point files, or a symbolic description? This determines the initial SCOPE node set and directly affects `scopeCoverage` denominator.

3. **Pattern reuse threshold:** `patternReuseRate` assumes the loop identifies reusable patterns. Should this be binary (pattern found or not) or weighted by confidence? A SYMBOL→PATTERN edge with `weight=0.3` (weak match) vs `weight=0.9` (exact match) should probably count differently.

4. **Interaction with @context agent:** Should deep-context's Context Report subsume the @context agent's one-shot Context Package, or should they coexist (deep-context for iterative refinement, @context for quick lookups)? This affects whether deep-context output replaces or supplements memory_context calls in /speckit:plan.

5. **Slice granularity:** How is a "slice" defined for fanout? Per-module, per-file, per-directory, or per-dependency-cluster? This affects node creation patterns and whether `computeSignals` needs per-slice vs global aggregation.

===FINDINGS END===
