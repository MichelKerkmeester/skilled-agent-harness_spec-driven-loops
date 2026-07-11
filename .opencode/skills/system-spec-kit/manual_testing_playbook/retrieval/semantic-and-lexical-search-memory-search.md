---
title: "EX-002 -- Semantic and lexical search (memory_search)"
description: "This scenario validates Semantic and lexical search (memory_search) for `EX-002`. It focuses on Hybrid precision check."
audited_post_018: true
version: 3.6.0.17
---

# EX-002 -- Semantic and lexical search (memory_search)

## 1. OVERVIEW

This scenario validates Semantic and lexical search (memory_search) for `EX-002`. It focuses on Hybrid precision check.

---

## 2. SCENARIO CONTRACT


- Objective: Hybrid precision check.
- Real user request: `Please validate Semantic and lexical search (memory_search) against memory_search({ query:"checkpoint restore clearExisting transaction rollback", limit:20 }) and tell me whether the expected signals are present: Relevant ranked results with hybrid signals.`
- Prompt: `Validate memory_search hybrid retrieval for checkpoint rollback and confirm ranked results include relevant hybrid signals.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Relevant ranked results with hybrid signals
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if top results match query intent

---

## 3. TEST EXECUTION

### Prompt

`Validate memory_search hybrid retrieval for checkpoint rollback and confirm ranked results include relevant hybrid signals.`

### Commands

1. memory_search({ query:"checkpoint restore clearExisting transaction rollback", limit:20 })
2. memory_search({ query:"checkpoint restore clearExisting transaction rollback", limit:20, bypassCache:true })

### Expected

Relevant ranked results with hybrid signals

### Evidence

Search output snapshot

### Pass / Fail

- **Pass**: top results match query intent
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Lower minState; disable cache and retry

---

### Prompt

```
As a retrieval validation operator, validate the response-policy refusal contract on memory_search. With a deliberately weak query (high lexical noise, no real anchor), verify the response includes responsePolicy with noCanonicalPathClaims:true, a non-empty safeResponse guidance string, and citationPolicy:"do_not_cite_results". Re-run with a high-quality query and assert responsePolicy is absent with citationPolicy:"cite_results". Return a concise pass/fail verdict.
```

### Commands

1. `memory_search({ query:"<gibberish-string-with-no-anchor>", limit:5 })` — assert `responsePolicy.noCanonicalPathClaims:true`, a non-empty `responsePolicy.safeResponse` string, `citationPolicy:"do_not_cite_results"`
2. `memory_search({ query:"<strong-spec-doc-anchor-keyword>", limit:5 })` — assert `responsePolicy` absent (good-quality queries carry no refusal block), `citationPolicy:"cite_results"`

### Expected

Weak query: handler refuses canonical-path claims; `responsePolicy.safeResponse` carries the refusal guidance string; client surface MUST display refusal, not citations.
Strong query: no responsePolicy block; `citationPolicy:"cite_results"` permits citing results.

### Evidence

memory_search responses for both queries showing the responsePolicy / citationPolicy blocks

### Pass / Fail

- **Pass**: weak query enforces refusal contract; strong query disables refusal and exposes citation policy
- **Fail**: refusal absent on weak query, refusal present on strong query, or citationPolicy missing

### Failure Triage

Inspect `mcp_server/formatters/search-results.ts` response-policy and citation-policy derivation (deriveResponsePolicy / deriveCitationPolicy) and confidence/recall thresholds

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [retrieval/semantic-and-lexical-search-memorysearch.md](../../feature_catalog/retrieval/semantic-and-lexical-search-memorysearch.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: EX-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `retrieval/semantic-and-lexical-search-memory-search.md`
