---
title: "029 -- code_graph_context seeded-PPR impact ranking (benchmark-only, CUT verdict)"
description: "Verify the default-off SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING flag switches code_graph_context's impact mode to a seeded Personalized PageRank walk with full multi-hop why_included.edgeChain reconstruction, and that the flag stays off by default because the re-benchmark verdict is CUT."
trigger_phrases:
  - "029 seeded ppr scenario"
  - "code graph seeded ppr ranking testing"
importance_tier: "normal"
contextType: "verification"
version: 1.3.0.0
---

# 029 -- `code_graph_context` seeded-PPR impact ranking (benchmark-only, CUT verdict)

## 1. OVERVIEW

This scenario validates the default-off `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` flag on `code_graph_context`'s `impact` query mode. With the flag off, `impact` mode ranks candidates with the default flat single-hop weighted walk. With the flag on, it instead seeds a bounded Personalized PageRank walk from the anchor node (via a lazy-loaded import of the shared memory weighted-walk module) and reconstructs the full multi-hop path for each candidate in `why_included.edgeChain` using the walk's `predecessor` chain, rather than a single one-hop edge. This flag exists to reproduce a specific benchmark re-test, not to change production ranking: the 010 re-benchmark's verdict is **CUT** -- seeded PPR lost on every measured metric against the flat walk even with a real (non-uniform) CALLS confidence gradient available, so this flag must stay off by default and this scenario explicitly checks that it does not silently flip production behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `code_graph_context` impact mode only takes the seeded-PPR path when the flag is explicitly on, that the seeded-PPR path is not byte-identical to the flat-walk path on the same graph, that `why_included.edgeChain` reconstructs the full multi-hop path under seeded-PPR, and that the flag's committed default is off.
- Real user request: `Validate that code_graph_context impact mode only uses seeded-PPR ranking when SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING is explicitly enabled, that it surfaces a real multi-hop edgeChain, and confirm the flag ships off by default per the CUT verdict.`
- Operator prompt: `Validate code_graph_context impact-mode seeded-PPR ranking against the flag off/on states and report cited pass/fail evidence, including a note that CUT is the intended shipping state.`
- Expected execution process: Call `code_graph_context` in `impact` mode with the flag off and capture the flat-walk candidate ordering and edge chains, repeat with the flag on and capture the seeded-PPR candidate ordering and edge chains, and diff the two outputs.
- Expected signals: flag-off impact response uses the flat single-hop walk (one-hop `edgeChain` per candidate); flag-on impact response uses the seeded-PPR walk, is not byte-identical to the flag-off response, and surfaces a deeper caller with a multi-hop `edgeChain` (more than one step, following `predecessor` links back to the anchor) that a one-hop walk could not have reached in the same position.
- Desired user-visible outcome: A concise verdict on whether the flag gate and multi-hop `edgeChain` reconstruction behaved correctly, plus an explicit note that this flag intentionally ships default-off per the CUT verdict.
- Pass/fail: PASS if flag-off stays on the flat path, flag-on switches to seeded-PPR with a non-identical ranking and a correctly reconstructed multi-hop `edgeChain`. FAIL if the flag has no effect, if seeded-PPR output is byte-identical to the flat walk, or if `edgeChain` under seeded-PPR is truncated to one hop when a longer real path exists.

---

## 3. TEST EXECUTION

### Preconditions

- Code graph index is `fresh` (verify via `code_graph_status`).
- Pick an anchor symbol with at least one caller reachable only through an intermediate hop (a caller-of-a-caller), so a multi-hop `edgeChain` is observable.

### Commands

1. **Flag off (flat walk):**
   ```jsonc
   mcp__mk_code_index__code_graph_context({
     queryMode: "impact",
     subject: "<anchor symbol with a multi-hop caller>",
     includeTrace: true
   })
   ```
   Expected: candidates ranked by the flat single-hop walk; each `why_included.edgeChain` is one hop.

2. **Flag on (seeded-PPR):** set `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING=true`, then repeat the same call.
   Expected: candidate ranking differs from step 1 (not byte-identical); the multi-hop caller now appears with an `edgeChain` of more than one step, each step's `from`/`to`/`edgeType`/`confidence`/`evidenceClass` populated by walking the PPR `predecessor` chain back to the anchor.

3. **Default-state confirmation:** with `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` unset (committed default), confirm the response matches step 1's flat-walk shape, proving the shipped default is off.

### Expected

Flag-off and default-unset states both use the flat single-hop walk with one-hop edge chains; flag-on switches to seeded-PPR with a non-identical ranking and correctly reconstructed multi-hop edge chains for deeper callers.

### Evidence

The three impact-mode responses (flag-off, flag-on, default-unset), with candidate ordering and the multi-hop caller's `edgeChain` array called out for the flag-on response.

### Pass / Fail

- **Pass**: flag gate behaves as described, seeded-PPR ranking is not byte-identical to the flat walk, and `edgeChain` correctly reconstructs a real multi-hop path.
- **Fail**: the flag has no observable effect, seeded-PPR output equals the flat-walk output, or `edgeChain` stays one-hop for a caller that is genuinely reached through an intermediate hop.

### Failure Triage

Inspect `shouldUseSeededPprRanking`, `seededPprRankingEnabled`, `computeBoundedPersonalizedPageRank` and `buildPprEdgeChain` in `mcp_server/lib/code-graph-context.ts`. Confirm the lazy import via `loadMemoryWeightedWalkModule()` resolves the shared walker (`system-spec-kit/mcp_server/dist/lib/graph/bfs-traversal.js`) and that `WeightedWalkResult.predecessor` (added to the shared walker for this reconstruction) is populated per reached node. Cross-check the benchmark verdict in `decision-record.md` (010 packet) before treating a flag-on regression as a bug rather than the expected, already-recorded CUT outcome.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Impact-mode ranking and edge-chain reconstruction: `mcp_server/lib/code-graph-context.ts`
- Shared weighted-walk module (lazy-loaded, `predecessor` field): `.opencode/skills/system-spec-kit/mcp_server/lib/graph/bfs-traversal.ts`
- Catalog counterpart: `../../feature_catalog/09--edge-confidence-and-provenance/seeded-ppr-impact-ranking.md`
- Automated test cross-reference: `mcp_server/tests/code-graph-seeded-ppr-ranking.vitest.ts`, `mcp_server/tests/code-graph-seeded-ppr-flag-on-path.vitest.ts`, `mcp_server/tests/code-graph-context-lazy-weighted-walk.vitest.ts`, `mcp_server/tests/weighted-walk-predecessor.vitest.ts`
- Benchmark verdict rationale: `decision-record.md` in `.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/`

---

## 5. SOURCE METADATA

- Group: Context Retrieval
- Playbook ID: 029
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--context-retrieval/code-graph-context-seeded-ppr-ranking.md`
