---
title: "147 -- Causal graph boost graduated"
description: "Validates the causal graph traversal boost: weighted 2-hop CTE walk, relation-type multipliers, hop decay, and the SPECKIT_CAUSAL_BOOST kill-switch."
audited_post_018: true
---

# 147 -- Causal graph boost graduated

## 1. OVERVIEW

This scenario validates the graduated default-ON causal graph boost. It exercises the top-25%-as-seed selection, weighted 2-hop traversal, relation multipliers, per-hop cap of 0.05, combined ceiling of 0.20 with session boost, and the kill-switch.

---

## 2. SCENARIO CONTRACT

- Objective: Verify causal boost amplifies results connected to top-ranked seeds via the weighted CTE walk and respects relation multipliers, hop decay, and the combined ceiling.
- Real user request: `Please validate causal graph boost: prove top-ranked seeds drive a 2-hop walk, relation types apply the documented multipliers, the per-hop cap is 0.05, and SPECKIT_CAUSAL_BOOST=false reverts behavior.`
- Prompt: `Validate causal boost and confirm top-25% seeds drive a 2-hop walk with relation multipliers and hop decay.`
- Expected execution process: Set up causal edges with known relation types, run a search, inspect the Stage 2 trace for the walk path and applied bonus, toggle the kill-switch, and assert reversion.
- Expected signals: top-25% of fused results (max 5) become seeds; 2-hop walk follows `causal_edges` with `supersedes` (1.5), `contradicts` (0.8), `caused`/`enabled`/`derived_from`/`supports` (1.0) multipliers; per-hop boost capped at 0.05; combined session+causal boost capped at 0.20; `SPECKIT_CAUSAL_BOOST=false` removes the boost entirely.
- Desired user-visible outcome: Pass/fail verdict with cited trace evidence.
- Pass/fail: PASS when seed selection, walk path, multipliers, and ceilings match the documented behavior. FAIL when seeds are wrong, multipliers differ, caps are exceeded, or the kill-switch has no effect.

---

## 3. TEST EXECUTION

### Prompt

```
Validate causal boost and confirm top-25% seeds drive a 2-hop walk with relation multipliers and hop decay.
```

### Commands

1. Pick three stable record IDs `<A>`, `<B>`, `<C>` already in `memory_index`. `<A>` should be a strong text/embedding match for a known query `<Q>`. `<B>` and `<C>` should not match `<Q>` directly.
2. `memory_causal_link({ sourceId: "<A>", targetId: "<B>", relation: "supersedes", strength: 0.7 })`
3. `memory_causal_link({ sourceId: "<B>", targetId: "<C>", relation: "supports", strength: 0.6 })`
4. `memory_search({ query: "<Q>", enableCausalBoost: true, includeTrace: true, limit: 10 })` and capture the Stage 2 trace.
5. Assert `<A>` is in the top 25% seed set. Assert `<B>` surfaces with a boost greater than `<C>` because of the `supersedes` 1.5 multiplier on hop 1.
6. Assert `<C>` is also boosted but with a smaller magnitude (hop 2 decay) and the combined boost on any result does not exceed 0.20.
7. Set `SPECKIT_CAUSAL_BOOST=false` in MCP env, restart, repeat step 4. Assert `<B>` and `<C>` no longer surface as boosted.
8. Cleanup: `memory_causal_unlink({ sourceId: "<A>", targetId: "<B>", relation: "supersedes" })` and `memory_causal_unlink({ sourceId: "<B>", targetId: "<C>", relation: "supports" })`.
9. Targeted Vitest: `cd .opencode/skills/system-spec-kit/mcp_server && npm exec -- vitest run tests/causal-boost.vitest.ts tests/stage2-fusion.vitest.ts`.

### Expected

- Top 25% seeds selected correctly (max 5).
- 2-hop walk follows the documented relation multipliers.
- Per-hop boost capped at 0.05; combined session+causal capped at 0.20.
- Flag-off run does not boost `<B>` or `<C>`.
- Both Vitest suites exit 0.

### Evidence

- Two `memory_search` trace envelopes (default-on, flag-off)
- `causal_edges` row dump for the test edges
- Vitest summary

### Pass / Fail

- **Pass**: seeds, multipliers, caps, and kill-switch all match documented behavior; Vitest exits 0.
- **Fail**: wrong seeds, missing multipliers, caps exceeded, kill-switch ineffective, or Vitest fails.

### Failure Triage

Inspect `mcp_server/lib/search/causal-boost.ts` for the seed selection, weighted CTE, relation multipliers, and ceilings. Verify `mcp_server/lib/search/pipeline/stage2-fusion.ts` invokes the boost after RRF. Confirm `isCausalBoostEnabled()` reads `SPECKIT_CAUSAL_BOOST` at request time.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [15--retrieval-enhancements/causal-boost-graduated.md](../../feature_catalog/15--retrieval-enhancements/causal-boost-graduated.md)
- Source: `.opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- Regression tests: `.opencode/skills/system-spec-kit/mcp_server/tests/causal-boost.vitest.ts`, `.opencode/skills/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Retrieval enhancements
- Playbook ID: 147
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `15--retrieval-enhancements/causal-boost-graduated.md`
