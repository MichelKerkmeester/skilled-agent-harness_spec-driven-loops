---
title: "406 — Specificity ladder"
description: "Three queries about the same topic at increasing levels of specificity ('local LLM' → 'Q8_0 GGUF quantization' → 'unsloth/bge-base-en-v1.5-GGUF') should each return results matched to that level — not collapse to the most-specific match for every query."
audited_post_018: true
version: 3.6.0.4
id: local-llm-query-intelligence-specificity-ladder
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 406 — Specificity ladder

## 1. OVERVIEW

A common failure mode of semantic search: every query returns the most-specific match in the corpus, even when the operator asks an abstract question. The ranker should respect the query's specificity level — abstract queries return overview docs, specific queries return source code or exact references.

This scenario fires 3 queries about the same topic (BGE local fallback local embeddings) at 3 different specificity levels and verifies each returns level-appropriate top-K.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm specificity-aware ranking.
- Real user request: `Verify that abstract vs specific queries about BGE local fallback return level-appropriate results, not all collapsing to the same most-specific match.`
- Operator prompt: `As a query-intelligence validation operator, fire 3 queries on the same topic at 3 specificity levels, and verify the top-3 of each is calibrated to that level. Return a pass/fail verdict.`
- Expected execution process: fire 3 queries, inspect top-3 of each, classify each result as ABSTRACT / MID / SPECIFIC, verify the top-3 weighted average matches the query level.
- Expected signals: abstract query's top-3 weighted average is more abstract than the specific query's top-3; the specific query's top-3 includes the exact code reference; the abstract query's top-3 does NOT lead with the exact code reference.
- Desired user-visible outcome: `PASS — all 3 levels return level-appropriate top-3; ranking is calibrated by specificity.`
- Pass/fail: PASS only if all 3 levels distinguish correctly; FAIL if any level does not — both the 2-of-3 case and the all-3-collapse case are FAIL.

---

## 3. TEST EXECUTION

### Prompt

```
Fire 3 queries on BGE local fallback at abstract/mid/specific levels and verify each top-3 is level-appropriate.
```

### Commands

**Level 1 — ABSTRACT:**
```
memory_search({ query: "local embeddings for memory and code search", limit: 5 })
```
Expected top-3: high-level overview memories and README-grade docs — not entries pinned to one exact constant.

**Level 2 — MID:**
```
memory_search({ query: "Q8_0 GGUF quantization for sentence embeddings via ollama", limit: 5 })
```
Expected top-3: design/architecture-grade memories (e.g. embedding-resilience or provider-design docs) sitting between overview and exact-reference entries.

**Level 3 — SPECIFIC:**
```
memory_search({ query: "OLLAMA_DEFAULT_MODEL_PATH constant in ollama-availability", limit: 5 })
```
Expected top-3: the memory entry citing `OLLAMA_DEFAULT_MODEL_PATH` / `ollama-availability` ranked #1 with the exact reference cited.

For each level, classify the top-3 results as:
- `A` — Abstract (README, overview doc, high-level reference)
- `M` — Mid (architecture doc, design note, configuration reference)
- `S` — Specific (source file with the exact constant/function/type)

### Expected

```
| Level    | Query                            | Top-3 classes | Match level? |
|----------|----------------------------------|---------------|--------------|
| 1 (ABS)  | "local embeddings for memory..." | A, A, M       | YES          |
| 2 (MID)  | "Q8_0 GGUF quantization..."      | M, S, M       | YES          |
| 3 (SPEC) | "OLLAMA_DEFAULT_MODEL_PATH..."| S, S, S       | YES          |
```

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file the run reads or writes.

### Pass/Fail

- **Pass**: All 3 levels distinguish correctly.
- **Fail**: Any level does not — both the 2-of-3 case and the all-3-collapse case are FAIL.

### Failure Triage

1. Re-run each command on its own and record its exit status; the first non-zero exit names the failing step.
2. Check the active embedding provider with `memory_health` — a degraded or lexical-only lane changes recall and is the most common cause of a rank miss.
3. Confirm indexing finished before the query step; re-run the query after the documented wait if the stored record is absent from every result.
4. Compare the observed output against the Expected block field by field and quote the first field that disagrees.

### Notes
This is the most subjective of the scenarios — A/M/S classification requires judgment. To make the assessment fair:
- Files with a clear narrative introduction count as A even if they're source code.
- Files dominated by code without prose count as S.
- Reference docs (decision-record.md, ADRs) count as M.

If reviewers consistently disagree on classification, that's a signal the corpus content boundaries are fuzzy — not necessarily a ranker failure.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Category overview: [local-llm-query-intelligence/README.md](../../manual-testing-playbook/local-llm-query-intelligence/README.md)
- Mechanical local-LLM suites: `.opencode/skills/system-spec-kit/mcp-server/tests/local-llm-features/`

---

## 5. SOURCE METADATA

- Group: Local LLM Query Intelligence
- Playbook ID: 406
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `local-llm-query-intelligence/specificity-ladder.md`
