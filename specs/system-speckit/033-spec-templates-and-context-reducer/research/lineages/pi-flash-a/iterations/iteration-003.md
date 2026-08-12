# Iteration 3: Context/Memory System & Reducer Prior Art Verification

## Focus
Verify whether the context/memory system (memory_context/memory_search) has a token-budget / dedup / synthesis-input reducer pass, and confirm deep-loop reducer prior art (findings-registry, contradiction-supersession, conditional fan-in) so template and doc-logic findings are classified against what actually ships.

## Findings

### F3.1 — memory_context HAS an enforced per-layer token budget (already-exists, axis: context-reduction, surface: context-system)
- `handlers/memory-context.ts:551` `enforceTokenBudget`: estimates serialized-result tokens (1 token ≈ 4 chars), truncates from lowest score until within budget, reports `enforcement` metadata (budgetTokens, truncated, preEnforcementTokens); `resolveEffectiveTokenBudget` computes the per-mode budget. A dedicated test suite exists: `tests/memory-context-token-budget.vitest.ts`. The charter hypothesis "memory_context retrieval may lack a token-budget pass" is refuted — the budget pass exists and is enforced (not advisory) in the context handler.
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-context.ts:551], [SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/memory-context-token-budget.vitest.ts:1]

### F3.2 — Result dedup exists at multiple pipeline stages (already-exists, axis: context-reduction, surface: context-system)
- `stage1-candidate-gen.ts:528` (Set dedup before slicing), `:1106` (variant merge dedup by id), `:1207` (baseline-first ordering); `handlers/memory-search.ts:1271` session-scoped `filterSearchResults` dedup with `dedupStats`; `chunk-reassembly.ts` collapses chunk-level hits into parent-level results; `graph-search-fn.ts:130` id-dedup. Residual nuance: dedup is id-based — there is no claim-level near-duplicate collapse (two memories saying the same thing with different ids both surface). That specific slice of the Reducer Engineering "group by normalized claim" idea is a minor genuine gap, but the deep-loop findings registry already groups findings by content (see F3.4), so the pattern exists in-repo.
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/pipeline/stage1-candidate-gen.ts:528], [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-search.ts:1271]

### F3.3 — The dynamic token budget is advisory-only in the search pipeline; enforcement lives only in the context handler (genuine-gap, minor, axis: context-reduction, surface: context-system)
- `search/dynamic-token-budget.ts:5-9` header: "ADVISORY-ONLY: This module computes a token budget... but does NOT enforce that budget downstream... callers who are solely responsible for respecting it". `memory-context.ts` does enforce its own budget, so the gap is a split-brain: search results are not trimmed by the computed tier budget before fusion/rerank, so wasted candidate tokens flow through stages 1-3. Fix shape (report-only): wire the tier budget into stage4-filter as a hard cap, or have orchestrator.ts consume BudgetResult.
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/dynamic-token-budget.ts:5-9]

### F3.4 — Reducer Engineering's core is already shipped in deep-loop machinery (already-exists, axis: general-opt, surface: context-system/prior-art)
- `contradiction-supersession/` is an audited shadow ledger for claim contradictions + supersession ("order-independent pair", replay-verified projection) — the Reducer Engineering "grouping surfaces disagreement" guard, implemented as a full ledger.
- `deep-research/scripts/reduce-state.cjs:2353/2379` dedups keyFindings by id and ruledOutDirections by content (`uniqueById`, `uniqueRuledOutByContent`) — the "keep one entry per group" reducer behavior.
- `conditional-fanin/reduction.ts` deterministically binds leaf result envelopes to a finalized fan-in decision — the deterministic-between-workers-and-synthesis pattern, with digest-verified inputs.
- Conclusion: porting `reduce_findings()` into speckit would duplicate shipped machinery; the charter's "do NOT reinvent" constraint is confirmed correct.
- [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/contradiction-supersession/README.md:1-16], [SOURCE: .opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2353], [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/conditional-fanin/reduction.ts:1-24]

### F3.5 — Generate-context.js is the deterministic metadata reducer for memory saves (already-exists, axis: context-reduction, surface: context-system)
- The SKILL.md Memory Save Rule routes saves through `scripts/dist/memory/generate-context.js` (refreshes description.json/graph-metadata.json, hands off DB indexing; no canonical doc content written by the AI directly except ADR-004 continuity frontmatter) — a model-free reducer between session state and the memory index, matching the Reducer Engineering playbook ("deduping, dropping malformed entries... are code problems").
- [SOURCE: .opencode/skills/system-spec-kit/SKILL.md §Memory Save Rule]

### F3.6 — Cross-check: iteration 1/2 findings stand against the memory surface (synthesis-input, axis: context-reduction, surface: context-system)
- The one place the "synthesis-input reducer" idea is NOT yet applied is research synthesis input: deep-research fan-out lineages each produce a full research.md, and the final convergence report is assembled by the orchestrator reading all lineages — no deterministic cross-lineage claim-collapse before the synthesis model reads them. But `reduce-state.cjs` + findings-registry partially cover this per-lineage, and multi-lineage fusion is the workflow's design (each lineage converges independently). Classified genuine-gap-but-out-of-charter (would touch deep-loop runtime, not the scoped speckit surfaces); noted for the refutation list as "would reinvent conditional-fanin semantics if built inside speckit".
- [SOURCE: .opencode/skills/system-deep-loop/deep-research/SKILL.md §Multi-lineage fan-out]

## Sources Consulted
- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-context.ts`, `handlers/memory-search.ts`
- `.opencode/skills/system-spec-kit/mcp-server/lib/search/` (dynamic-token-budget, stage1-candidate-gen, stage4-filter, chunk-reassembly, graph-search-fn, memory-summaries, pipeline/orchestrator)
- `.opencode/skills/system-spec-kit/mcp-server/tests/memory-context-token-budget.vitest.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/contradiction-supersession/`, `conditional-fanin/`
- `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`
- `.opencode/skills/system-spec-kit/SKILL.md`

## Assessment
- newInfoRatio: 0.7
- Novelty justification: the advisory-only dynamic budget split-brain (F3.3) and the id-based-only dedup nuance (F3.2) are new; F3.1/F3.4 confirm prior art with handler/line evidence.
- Confidence: high for F3.1/F3.4 (direct reads); medium for F3.3 impact (depends on stage1 candidate volume vs final result count).

## Reflection
- Worked: reading handler code + its dedicated token-budget test file resolved the charter's open hypothesis with hard evidence.
- Ruled-out: building a memory-side synthesis reducer inside speckit (duplicates conditional-fanin + contradiction-supersession); claim-level near-dedup in memory_search (minor, id-dedup already present; content-grouping lives in findings-registry).
- Failed: none.

## Recommended Next Focus
Synthesis: compile all three iterations into the ranked shortlist (F1.2 research.md.tmpl gating; F2.2 AC_COVERAGE promotion; F2.3 scope-adherence rule; F3.3 budget wiring) + refutation list (raw-LOC reduction, reduce_findings port, new evaluator, Gate-3-as-reducer, memory token-budget gap).
