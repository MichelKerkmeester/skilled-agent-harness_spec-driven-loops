---
title: "EX-032 -- 5. Embedding and API"
description: "This scenario validates 5. Embedding and API for `EX-032`. It focuses on Provider selection audit."
audited_post_018: true
---

# EX-032 -- 5. Embedding and API

## 1. OVERVIEW

This scenario validates 5. Embedding and API for `EX-032`. It focuses on Provider selection audit.

---

## 2. SCENARIO CONTRACT


- Objective: Provider selection audit.
- Real user request: `Please validate 5. Embedding and API against memory_search({ query:"EMBEDDINGS_PROVIDER auto provider selection rules ollama hf-local BGE local fallback", limit:20 }) and tell me whether the expected signals are present: provider rules, key precedence, ollama local default, and hf-local fallback shown.`
- Prompt: `Validate 5. Embedding and API against memory_search({ query:"EMBEDDINGS_PROVIDER auto provider selection rules ollama hf-local BGE local fallback", limit:20 }).`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Provider rules show explicit `EMBEDDINGS_PROVIDER` first, then `VOYAGE_API_KEY`, then `OPENAI_API_KEY`, then local `ollama`, then `hf-local`; local defaults name `nomic-embed-text-v1.5` (Ollama) and `nomic-ai/nomic-embed-text-v1.5` (hf-local).
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if provider routing, key precedence, and both local default/fallback model IDs are clear

---

## 3. TEST EXECUTION

### Prompt

```
Validate 5. Embedding and API against memory_search({ query:"EMBEDDINGS_PROVIDER auto provider selection rules ollama hf-local BGE local fallback", limit:20 }).
```

### Commands

1. memory_search({ query:"EMBEDDINGS_PROVIDER auto provider selection rules ollama hf-local BGE local fallback", limit:20 })

### Expected

Provider rules show explicit `EMBEDDINGS_PROVIDER` first, then `VOYAGE_API_KEY`, then `OPENAI_API_KEY`, then local `ollama`, then `hf-local`; local defaults name `nomic-embed-text-v1.5` (Ollama) and `nomic-ai/nomic-embed-text-v1.5` (hf-local).

### Evidence

Search output

### Pass / Fail

- **Pass**: provider routing, key precedence, and both local default/fallback model IDs are clear
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify env in runtime

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [19--feature-flag-reference/277-5-embedding-and-api.md](../../feature_catalog/19--feature-flag-reference/277-5-embedding-and-api.md)

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: EX-032
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `19--feature-flag-reference/308-5-embedding-and-api.md`
