# Iteration 1: Generic-Query Recall — why "weak" despite HyDE + multi-query ON

## Focus

Problem 1: generic short queries ("Semantic Search", "agent improvement") still read
"weak" even though `multiQueryEnabled` and HyDE report ON. Find the real activation
gate and design a query-class routing change that lifts generic-query recall.

## Findings

1. **HyDE never fires for generic short queries — it is gated to "deep + low-confidence
   queries only".** The module header is explicit: `Gate: SPECKIT_HYDE — deep + low-confidence
   queries only.` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/hyde.ts:6].
   So the global flag being ON (live `featureFlags.multiQueryEnabled:true`) is necessary but
   not sufficient — the per-query activation path also requires `mode=deep` and/or a
   low-confidence trigger. A 2-term query routed to the cheap path bypasses HyDE entirely.

2. **Multi-query/synonym expansion is also a deep-mode-only path.** `query-expander.ts` is
   documented as "Rule-based synonym expansion for mode=\"deep\" multi-query RAG"
   [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/query-expander.ts:5]. The
   expansion itself is shallow: a fixed `DOMAIN_VOCABULARY_MAP` of ~30 stems and `MAX_VARIANTS=3`
   [SOURCE: query-expander.ts:12,23-56]. For "Semantic Search", only "search"→["retrieval","query"]
   matches; "semantic" has no entry, so expansion yields at most one useful variant. "agent
   improvement" matches nothing in the map → zero expansion.

3. **The complexity router actively *removes channels* for simple-tier queries.** A query of
   ≤3 terms (or any trigger match) is classified `simple`
   [SOURCE: query-classifier.ts:28,186-189], and the resulting query plan records skipped
   channels with reason `Skipped by ${complexity} complexity route`
   [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/query/query-plan.ts:239]. Both live
   test queries are 2 terms → `simple` → channel-reduced route. This is the opposite of what
   recall needs: short, vague queries carry the *least* lexical signal and most need vector +
   expansion breadth, yet they get the *narrowest* route.

4. **Live confirmation of the recall collapse.** `memory_search "Semantic Search"` returns
   `count:1`, `requestQuality:"weak"`, `recovery.reason:"low_signal_query"`,
   `citationPolicy:"do_not_cite_results"`, with `stage1.candidateCount:10` but only 1 surviving
   to output [SOURCE: live `node .opencode/bin/spec-memory.cjs memory_search --json
   '{"query":"Semantic Search","limit":5}'`, 2026-06-17]. The recovery payload sets
   `recommendedAction:"ask_disambiguation"` but emits `suggestedQueries:[]` — the system detects
   the low-signal query but offers the user no expansion path.

5. **The architecture already contains the missing escalation primitive.** HyDE exposes a
   `lowConfidence()` baseline check [SOURCE: hyde.ts:66-72 `BaselineResult`], and there is an
   `embedding-expansion.ts`, `llm-reformulation.ts`, and `query-surrogates.ts` already in the
   tree. The pieces to lift generic recall exist; they are simply not wired to the
   simple/low-confidence path.

## Sources Consulted

- `.opencode/skills/system-spec-kit/mcp_server/lib/search/hyde.ts` (gate + budget header)
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-expander.ts` (full)
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-classifier.ts` (full)
- `.opencode/skills/system-spec-kit/mcp_server/lib/query/query-plan.ts:200-262`
- Live: `spec-memory.cjs memory_search` for "Semantic Search" and "agent improvement"

## Assessment

- **newInfoRatio: 1.0** — First iteration; the activation-gating root cause (simple-tier route
  *suppresses* the very recall machinery generic queries need) is net-new beyond the grounding
  doc, which only noted the symptom.
- Confidence: HIGH. Gate documented in-code; channel-skip confirmed at query-plan.ts:239; live
  symptom reproduced.

## Reflection

- **Worked:** reading the module-header gates (not just the flag accessors) revealed that
  "flag ON" ≠ "path active". The flag-vs-activation gap is the crux.
- **Ruled out:** "the flags are off" — they are on; the problem is per-query routing, not flags.
- **Ruled out:** "embedding model is too weak for short queries" — not investigated as primary;
  the channel-reduction + no-expansion path explains the symptom without invoking model quality.

## Recommended Next Focus

Iteration 2 → Problem 2: request-quality aggregation. Even when a strong top hit exists
(0.751), the `topScore≥0.7 AND qualityRatio≥0.6` AND-gate drags the set to "weak". Design a
top-weighted / margin-aware aggregation.
