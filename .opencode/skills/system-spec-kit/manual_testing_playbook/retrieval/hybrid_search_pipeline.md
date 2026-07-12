---
title: "EX-004 -- Hybrid search pipeline"
description: "This scenario validates Hybrid search pipeline for `EX-004`. It focuses on channel fusion sanity, caller-preserving fallback, and trace consistency."
audited_post_018: true
version: 3.6.0.19
---

# EX-004 -- Hybrid search pipeline

## 1. OVERVIEW

This scenario validates Hybrid search pipeline for `EX-004`. It focuses on channel fusion sanity, caller-preserving fallback, and trace consistency.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm multi-channel fusion stays coherent when routing and fallback interact.
- Real user request: `` Please validate Hybrid search pipeline against memory_search({ query:"graph rollout trace check", limit:10, includeTrace:true, bypassCache:true }) and tell me whether the expected signals are present: Non-empty result set with trace evidence of multi-channel contribution; aligned boosted scores across the exposed score aliases; the internal `useGraph:false` option (hybrid-search level, not a memory_search parameter) suppresses both graph and degree contributions even during fallback; lexical fallback only uses still-allowed lexical channels. ``
- Prompt: `Validate hybrid search trace behavior and confirm fusion, score aliases, graph suppression, and lexical fallback stay coherent.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Non-empty result set with trace evidence of multi-channel contribution; aligned boosted scores across the exposed score aliases; the internal `useGraph:false` hybrid-search option suppresses both graph and degree contributions even during fallback (verified at the unit level — `memory_search` does not expose this parameter); lexical fallback only uses still-allowed lexical channels
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if fusion evidence is coherent, explicit channel disables are preserved across fallback, and no contradictory trace signals appear

---

## 3. TEST EXECUTION

### Prompt

`Validate hybrid search trace behavior and confirm fusion, score aliases, graph suppression, and lexical fallback stay coherent.`

### Commands

1. `memory_search({ query:"graph rollout trace check", limit:10, includeTrace:true, bypassCache:true })`
2. From `mcp_server/`, run `npx vitest run tests/hybrid-search.vitest.ts tests/graph-regression-flag-off.vitest.ts` — these cover the internal `useGraph:false` option suppressing graph and degree contributions, including during fallback (`useGraph` is a hybrid-search option, not a `memory_search` parameter)
3. Source-check `collectRawCandidates()` in `mcp_server/lib/search/hybrid-search.ts` if the trace does not make the fallback routing explicit

### Expected

Non-empty result set with trace evidence of multi-channel contribution; aligned boosted scores across exposed score aliases; the channel-suppression vitest targets pass (graph and degree suppressed under the internal `useGraph:false` option, lexical fallback only uses still-allowed lexical channels)

### Evidence

Trace output from the live search plus the passing vitest run for channel suppression

### Pass / Fail

- **Pass**: fusion evidence is coherent, the channel-suppression vitest targets pass, and no contradictory channel trace appears
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `hybrid-search.ts` candidate routing and trace fields if graph or degree signals leak into a `useGraph:false` unit run

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [retrieval/hybrid_search_pipeline.md](../../feature_catalog/retrieval/hybrid_search_pipeline.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: EX-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `retrieval/hybrid_search_pipeline.md`
