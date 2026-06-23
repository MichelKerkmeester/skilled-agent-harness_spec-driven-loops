---
title: "217 -- Result provenance (graph evidence)"
description: "Validates the graphEvidence envelope on Stage 2 fusion output, including contributing edge IDs, community IDs, and boost factors per result."
audited_post_018: true
version: 3.6.0.5
---

# 217 -- Result provenance (graph evidence)

## 1. OVERVIEW

This scenario validates the per-result `graphEvidence` field that surfaces on Stage 2 fusion when graph signals contribute to ranking. It exercises the edge ID list, community ID list, boost factor breakdown, and the `SPECKIT_RESULT_PROVENANCE` kill-switch.

---

## 2. SCENARIO CONTRACT

- Objective: Verify `graphEvidence` is attached to results that received graph-derived boosts and contains the contributing edge IDs, community IDs, and boost factors.
- Real user request: `Please validate graph evidence provenance on search results: prove graphEvidence is populated for graph-boosted results with edge IDs, communities, and boost factors, and that SPECKIT_RESULT_PROVENANCE=false strips the field.`
- Prompt: `Validate result provenance and confirm graphEvidence surfaces edge IDs, community IDs, and boost factors per result.`
- Expected execution process: Create a known causal edge, run a search that hits the boost, inspect the envelope, toggle the flag.
- Expected signals: graph-boosted results carry a `graphEvidence` object; the object includes contributing causal edge IDs with relation types, community IDs, and individual boost factors; results without graph contribution do not carry `graphEvidence`; `SPECKIT_RESULT_PROVENANCE=false` strips the field.
- Desired user-visible outcome: Pass/fail verdict with cited envelope evidence.
- Pass/fail: PASS when `graphEvidence` surfaces for graph-boosted results, contains documented fields, and the kill-switch strips the field. FAIL when the field is missing for boosted results, content is incomplete, or the kill-switch has no effect.

---

## 3. TEST EXECUTION

### Prompt

```
Validate result provenance and confirm graphEvidence surfaces edge IDs, community IDs, and boost factors per result.
```

### Commands

1. Pick two stable record IDs `<A>` and `<B>` already in `memory_index`. Pick a query `<Q>` where `<A>` is a strong match.
2. `memory_causal_link({ sourceId: "<A>", targetId: "<B>", relation: "supports", strength: 0.7 })` to create a known boost path.
3. `memory_search({ query: "<Q>", enableCausalBoost: true, includeTrace: true, limit: 10 })` and capture the response.
4. Locate `<B>` (or whichever boosted neighbor surfaces). Inspect its `graphEvidence` field.
5. Assert the field contains: a list of contributing edge IDs (including the one created in step 2) with their relation types; a list of community IDs the result belongs to (or empty if not in any community); a breakdown of boost factors that contributed to the final score.
6. Locate a result that did not receive a graph boost. Assert its envelope does not carry `graphEvidence` (or carries an empty/null value).
7. Set `SPECKIT_RESULT_PROVENANCE=false` in MCP env, restart, repeat step 3. Assert the `graphEvidence` field is absent on all results.
8. Cleanup: `memory_causal_unlink({ sourceId: "<A>", targetId: "<B>", relation: "supports" })`.
9. Targeted Vitest: `cd .opencode/skills/system-spec-kit/mcp_server && npm exec -- vitest run tests/provenance-envelope.vitest.ts`.

### Expected

- Boosted result carries `graphEvidence` with edge IDs, communities, and boost factors.
- Unboosted result has no `graphEvidence`.
- Flag-off run strips the field on all results.
- Vitest exits 0.

### Evidence

- Two `memory_search` responses (default-on, flag-off)
- `graphEvidence` content extracted from the boosted result
- Vitest summary

### Pass / Fail

- **Pass**: `graphEvidence` populated with documented fields on boosted results, absent on unboosted, stripped under kill-switch, Vitest exits 0.
- **Fail**: missing field, incomplete content, kill-switch ineffective, or Vitest fails.

### Failure Triage

Inspect `mcp_server/lib/search/pipeline/stage2-fusion.ts` for the `graphEvidence` population step. Verify `mcp_server/formatters/search-results.ts` preserves the field in serialization. Check `mcp_server/lib/search/pipeline/types.ts` for the `graphEvidence` type definition. Confirm `SPECKIT_RESULT_PROVENANCE` is read at request time.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [18--ux-hooks/result-provenance.md](../../feature_catalog/18--ux-hooks/result-provenance.md)
- Source: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`, `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/types.ts`
- Regression tests: `.opencode/skills/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Ux hooks
- Playbook ID: 217
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `18--ux-hooks/result-provenance.md`
