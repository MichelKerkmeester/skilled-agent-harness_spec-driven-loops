---
title: "148 -- Community-level search fallback"
description: "Validates searchCommunities() word-overlap scoring against community summaries and the fallback surfacing when primary channels return weak results."
audited_post_018: true
version: 3.6.0.5
---

# 148 -- Community-level search fallback

## 1. OVERVIEW

This scenario validates the community-level fallback layer. It exercises word-overlap scoring against community summaries, the surfacing path when vector and BM25 channels return weak results, and the `SPECKIT_COMMUNITY_SEARCH_FALLBACK` kill-switch.

---

## 2. SCENARIO CONTRACT

- Objective: Verify community search returns topic-level matches via word-overlap scoring and that it surfaces as fallback when primary channels are weak.
- Real user request: `Please validate community-level fallback: prove searchCommunities matches queries against summaries using word overlap and surfaces when primary retrieval is weak, with SPECKIT_COMMUNITY_SEARCH_FALLBACK=false reverting behavior.`
- Prompt: `Validate community-level search fallback and confirm word-overlap matches against community summaries surface when primary channels are weak.`
- Expected execution process: Pick a query that returns weak primary results, run the search, inspect the fallback section for community matches, toggle the flag.
- Expected signals: community summaries are scored by word overlap with the query; matches surface as fallback when primary results are weak or empty; results carry a provenance marker indicating community origin; `SPECKIT_COMMUNITY_SEARCH_FALLBACK=false` removes the fallback surfacing.
- Desired user-visible outcome: Pass/fail verdict with cited fallback evidence.
- Pass/fail: PASS when community matches surface with word-overlap scoring and the kill-switch reverts behavior. FAIL when no fallback surfaces despite weak primary results, scores look random, or the kill-switch has no effect.

---

## 3. TEST EXECUTION

### Prompt

```
Validate community-level search fallback and confirm word-overlap matches against community summaries surface when primary channels are weak.
```

### Commands

1. Confirm at least one community summary exists in the database (`community_summaries` table or equivalent). Pick a query `<Q>` that shares 2+ content words with a known community summary but does not have strong primary-channel hits.
2. `memory_search({ query: "<Q>", limit: 10, includeTrace: true })` and capture the response. Inspect the fallback section.
3. Assert the response surfaces at least one community match. Inspect the trace for word-overlap scoring against the matched community.
4. Compare the scored community to a deliberately unrelated community summary. Assert the related one ranks higher.
5. Set `SPECKIT_COMMUNITY_SEARCH_FALLBACK=false` in MCP env, restart, repeat step 2. Assert no community matches surface even when primary channels stay weak.
6. Targeted Vitest: `cd .opencode/skills/system-spec-kit/mcp_server && npm exec -- vitest run tests/community-search.vitest.ts`.

### Expected

- Community match surfaces in the fallback section with provenance marker.
- Word-overlap scoring ranks related summaries above unrelated ones.
- Flag-off run suppresses community matches.
- Vitest exits 0.

### Evidence

- Two `memory_search` responses (default-on, flag-off)
- Community summary row dump for the matched and unrelated communities
- Vitest summary

### Pass / Fail

- **Pass**: community match surfaces, scoring is sane, kill-switch reverts, Vitest exits 0.
- **Fail**: no fallback surfacing, random scoring, kill-switch ineffective, or Vitest fails.

### Failure Triage

Inspect `mcp_server/lib/search/community-search.ts:searchCommunities` for the word-overlap scorer. Verify the fallback invocation site reads weak-result thresholds correctly. Confirm `SPECKIT_COMMUNITY_SEARCH_FALLBACK` is read at request time.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [15--retrieval-enhancements/community-search-fallback.md](../../feature_catalog/15--retrieval-enhancements/community-search-fallback.md)
- Source: `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts`
- Regression tests: `.opencode/skills/system-spec-kit/mcp_server/tests/community-search.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Retrieval enhancements
- Playbook ID: 148
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `15--retrieval-enhancements/community-search-fallback.md`
