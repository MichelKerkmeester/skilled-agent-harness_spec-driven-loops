# Iteration 3: memory_context/memory_search budgets + ranked shortlist & refutations

## Focus

Answer Q4 on memory token-budget/dedup; produce Q5 ranked implementable shortlist and refutation list across axes (a) context-reduction (b) plan-adherence (c) general-opt. Max-iterations final research pass before synthesis.

Route proof: `mode=research`, `target_agent=deep-research`, executor `cli-cursor`/`cursor-grok-4.5-high`. Write authority: lineage artifact_dir only.

## Actions Taken

1. Inspected `memory_context` mode budgets + `enforceTokenBudget`.
2. Confirmed `memory_search` lacks `tokenBudget`/`enforceTokenBudget`/`estimateTokens` (grep empty).
3. Noted RRF ID dedup, session dedup, MMR rerank, resume-ladder char/item budgets as prior art.
4. Consolidated iterations 1–2 into ranked shortlist + refutation list with classifications.

## Findings

1. **`memory_context` already enforces per-mode token budgets.** Modes: quick 800, deep 3500, focused 3000, resume 2000; `enforceTokenBudget` truncates/drops to fit; tests in `memory-context-token-budget.vitest.ts`. [SOURCE: `mcp-server/handlers/memory-context.ts:539-551,1107-1145,2014`]
   - **Classification:** `already-exists` / axis: **context-reduction** / surface: **context-system**
   - **Refute:** “Add a token-budget pass to memory_context” as net-new work.

2. **Layer architecture already advertises budgets (L1/L2 = 3500 for context/search).** [SOURCE: `mcp-server/lib/architecture/layer-definitions.ts:40-58,202-206`]
   - **Classification:** `already-exists` / axis: **context-reduction** / surface: **context-system**

3. **Genuine gap: direct `memory_search` does not apply `enforceTokenBudget`.** Handler has `rerank`/MMR/session dedup but zero matches for tokenBudget/enforceToken/estimateTokens. Agents calling L2 `memory_search` directly can exceed the layer’s advertised 3500 budget; `memory_context` only budgets after it wraps search. [SOURCE: negative grep on `memory-search.ts`] [SOURCE: `memory-context.ts:1186` wraps `handleMemorySearch` then budgets at `:2014`]
   - **Classification:** `genuine-gap` / axis: **context-reduction** / surface: **context-system**
   - **Implementable idea:** Reuse `enforceTokenBudget` / `getTokenBudget('memory_search')` at end of `handleMemorySearch` (shared helper) — do **not** invent a new reducer.

4. **Dedup prior art is strong; claim-normalize Twitter-style grouping is mostly not-applicable.** RRF `canonicalRrfId` cross-channel dedup; session sent-memory dedup; MMR diversity rerank; compact-merger file-path dedup; resume panel item/char budgets. [SOURCE: `shared/algorithms/rrf-fusion.js:110`] [SOURCE: `memory-search.ts:1267-1276,2088`] [SOURCE: `SKILL.md:427` MMR note] [SOURCE: `resume-ladder.ts:498-505`]
   - **Classification:** `already-exists` for ID/session/diversity dedup / `not-applicable` for porting Reducer Engineering `normalize(claim)` into memory (would overlap MMR + deep-loop claim ledger) / axis: **context-reduction** / surface: **context-system**

5. **Soft gap only: near-duplicate distinct memory IDs can still co-land.** MMR reduces redundancy but does not group equivalent claims with contradiction surfacing the way deep-loop `contradiction-supersession` does. For memory injection, prefer routing synthesis through `memory_context` (budgeted) rather than building a second findings-registry. [SOURCE: `contradiction-supersession/index.ts` prior art]
   - **Classification:** `not-applicable` (as new memory claim-registry) / optional `genuine-gap` only if operators insist on direct `memory_search` synthesis dumps — prefer **already-exists** deep-loop path / axis: **general-opt** / surface: **context-system**

### Ranked implementable shortlist (survives prior-art filter)

| Rank | Opportunity | Axis | Surface | Class | Blast-radius | Evidence |
|------|-------------|------|---------|-------|--------------|----------|
| 1 | Level-gate / lean stubs for ungated optional templates (`research.md.tmpl` ~945 lines all levels; also handover/resource-map) | a | templates | genuine-gap | Low–med | iter1 measured renders |
| 2 | Reuse `enforceTokenBudget` on direct `memory_search` responses | a | context-system | genuine-gap | Low | memory-search.ts lacks budget; memory-context.ts:2014 has it |
| 3 | Optional `validate.sh`/CI scope allowlist: diff paths ⊆ `spec.md` In Scope / Files to Change | b | doc-logic | genuine-gap | Med | validate.sh negative scope grep; AGENTS SCOPE LOCK prompt-only |
| 4 | Authoring helper / checklist: prefer `--level N` rendered view; treat raw `.tmpl` as maintainer-only | a+b | templates+doc-logic | genuine-gap | Low | SKILL.md:452,475 prompt-only |

### Refutation list (do not implement)

| Idea from context/*.md | Class | Why |
|------------------------|-------|-----|
| Port Twitter `reduce_findings` into system-speckit | already-exists / not-applicable | deep-loop reducers + findings-registry + contradiction-supersession |
| Add Default-FAIL framework | already-exists | Iron Law + Completion Verification + validate.sh |
| Add fresh-context evaluator | already-exists | deep-review LEAF read-only fresh passes |
| Add self-authored handoff notes | already-exists | handover.md + continuity ladder + memory save |
| Add complexity-matches-task | already-exists | Levels 1–3+ + recommend-level + phase qualification |
| Cut 5541 LOC templates as primary win | not-applicable / already-exists | `renderInlineGates` already collapses core L1 to ~558 combined lines |
| Add token budget to `memory_context` | already-exists | enforceTokenBudget + mode budgets shipped |
| Use Gate 3 as synthesis token reducer | not-applicable | Gate 3 is write-boundary classifier |

## Ruled Out

- New memory claim-ledger duplicating contradiction-supersession.
- Template rewrite programs justified solely by raw 5541 LOC.
- Harness re-implementation of Iron Law / deep-review / Levels / handover.

## Dead Ends

- Looking for enforceTokenBudget inside memory-search: confirmed absent (gap), not buried under another name.

## Edge Cases

- `memory_context` deep mode 3500 may still feel large vs Reducer Engineering’s 5300→ post-reduce synthesis — but that comparison is multi-agent fan-in; wrong layer for single memory_context call.
- Optional templates may be intentionally level-agnostic; lean stubs must preserve validate contracts.

## Convergence telemetry

- newInfoRatio declining into shortlist consolidation (~0.55); stopPolicy max-iterations → proceed to synthesis after this iteration (3/3).

## Sources Consulted

- `memory-context.ts:539-551,1107-1145,1186,2014`
- `memory-search.ts` (budget grep empty; rerank/dedup present)
- `layer-definitions.ts:40-58,202-206`
- `rrf-fusion.js:110`
- `resume-ladder.ts:498-505`
- Iterations 1–2 findings

## Assessment

- New information ratio: 0.55
- Novelty justification: memory_search budget asymmetry is new; shortlist/refutations consolidate prior iterations with partial novelty.
- Questions addressed: Q4, Q5 (and closes Q1–Q3 via shortlist).
- Questions answered: All five key questions now evidence-backed for this lineage.

## Reflection

- What worked: Contrasting memory_context vs memory_search handlers exposed a precise, reusable gap.
- What failed: None.
- Ruled out: Most of both source essays’ “build the harness” checklist as net-new for this repo.

## Recommended Next Focus

SYNTHESIS — write lineage `research.md` with ranked shortlist + refutations; stopReason `max_iterations`.
