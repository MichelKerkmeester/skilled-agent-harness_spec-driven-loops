---
title: "173 -- Query decomposition (SPECKIT_QUERY_DECOMPOSITION)"
description: "This scenario validates query decomposition (SPECKIT_QUERY_DECOMPOSITION) for `173`. It focuses on the default-on graduated rollout and verifying bounded facet detection decomposes multi-faceted queries into max 3 sub-queries."
audited_post_018: true
version: 3.6.0.14
id: query-intelligence-query-decomposition-speckit-query-decomposition
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 173 -- Query decomposition (SPECKIT_QUERY_DECOMPOSITION)

## 1. OVERVIEW

This scenario validates query decomposition (SPECKIT_QUERY_DECOMPOSITION) for `173`. It focuses on the default-on graduated rollout and verifying bounded facet detection decomposes multi-faceted queries into max 3 sub-queries.

---

## 2. SCENARIO CONTRACT


- Objective: Verify bounded facet detection decomposes multi-faceted queries into max 3 sub-queries.
- Real user request: `Please validate Query decomposition (SPECKIT_QUERY_DECOMPOSITION) against SPECKIT_QUERY_DECOMPOSITION and tell me whether the expected signals are present: conjunction splitting on "and"/"or"/"also"/"plus"/"as well as"/"along with"; multiple wh-question word detection; MAX_FACETS=3 cap enforced; no LLM calls; deep-mode only activation; graceful fallback returns original query on error.`
- Operator prompt: `As a query-intelligence validation operator, validate Query decomposition (SPECKIT_QUERY_DECOMPOSITION) against SPECKIT_QUERY_DECOMPOSITION. Verify bounded facet detection decomposes multi-faceted queries into max 3 sub-queries. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: conjunction splitting on "and"/"or"/"also"/"plus"/"as well as"/"along with"; multiple wh-question word detection; MAX_FACETS=3 cap enforced; no LLM calls; deep-mode only activation; graceful fallback returns original query on error
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if multi-faceted query decomposes into <= 3 sub-queries in deep mode with rule-based splitting; FAIL if decomposition exceeds 3 sub-queries, runs outside deep mode, uses LLM, or crashes instead of falling back

---

## 3. TEST EXECUTION

### Prompt

```
As a query-intelligence validation operator, verify bounded facet detection decomposes multi-faceted queries into max 3 sub-queries against SPECKIT_QUERY_DECOMPOSITION. Verify isQueryDecompositionEnabled() returns true; conjunction splitting on coordinating conjunctions; wh-question word detection; MAX_FACETS=3 enforced; no LLM calls; deep-mode only; graceful fallback on error. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Confirm `SPECKIT_QUERY_DECOMPOSITION` is unset or `true`
2. `memory_search({ query: "What is the spec-doc record save workflow and how does query expansion work?", mode: "deep" })`
3. Inspect decomposition output for sub-queries
4. Verify sub-query count <= 3
5. Run same query in non-deep mode, verify no decomposition

### Expected

isQueryDecompositionEnabled() returns true; conjunction splitting on coordinating conjunctions; wh-question word detection; MAX_FACETS=3 enforced; no LLM calls; deep-mode only; graceful fallback on error

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in section 3.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Pass / Fail

- **PASS**: Deep mode produced `d2-query-decomposition` with `facetCount: 2` and facets `["What is the spec-doc record save workflow", "how does query expansion work"]`; non-deep `auto` mode produced no `d2-query-decomposition` stage and reported `deepExpansion: false`; implementation evidence shows default-on flag, rule-based conjunction/wh-question detection, `MAX_FACETS = 3`, skip of standard deep expansion after decomposition, and fallback to the original query on variant-build failure.

### Failure Triage

Verify isQueryDecompositionEnabled() → Confirm flag is not forced off → Check MAX_FACETS=3 constant → Inspect conjunction splitting regex → Verify deep-mode gate in stage1-candidate-gen → Check graceful fallback path

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [query-intelligence/query-decomposition.md](../../feature-catalog/query-intelligence/query-decomposition.md)
- Feature flag reference: [feature-flag-reference/1-search-pipeline-features-speckit.md](../../feature-catalog/feature-flag-reference/1-search-pipeline-features-speckit.md)
- Source file: `mcp-server/lib/search/query-decomposer.ts`

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 173
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `query-intelligence/query-decomposition-speckit-query-decomposition.md`
