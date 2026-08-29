---
title: "403 — Code-intent matching (implementation vs docs)"
description: "Question-form queries ('how does X work?') should rank the implementation file higher than its README. Probes whether the embedding distinguishes between explanatory and definitional content."
audited_post_018: true
version: 3.6.0.4
id: local-llm-query-intelligence-code-intent-matching
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 403 — Code-intent matching (implementation vs docs)

## 1. OVERVIEW

When an operator types a question-form query like "how does provider auto-cascade resolution work?", they want the IMPLEMENTATION (factory.ts:resolveProvider) — not the README that describes the implementation in prose. Code Graph semantic search must rank the implementation file higher than the doc, because the operator is looking for code to read/debug, not narrative to read.

The behavior is user-observable: developers asking implementation questions want source files; documentation queries can be a tiebreaker but should not dominate.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm implementation-over-docs ranking for code-intent queries.
- Real user request: `Verify that when I ask "how does X work?" through Code Graph, the implementation file outranks its README.`
- Operator prompt: `As a query-intelligence validation operator, fire 4 question-form code queries through Code Graph and report whether the implementation file ranks above its README in each top-5. Return a pass/fail verdict and a table of rank pairs.`
- Expected execution process: run 4 code-intent queries, identify implementation-file rank and README rank in each top-5, compare.
- Expected signals: implementation rank < README rank in ≥ 3 of 4 queries; both files are present in top-10.
- Desired user-visible outcome: `PASS — 3/4 queries rank implementation above README; the 1 inversion was a tied-content tiebreaker.`
- Pass/fail: PASS only if implementation outranks README in ≥ 3 of 4; FAIL at 2 of 4 or fewer.

---

## 3. TEST EXECUTION

### Prompt

```
For each of 4 code-intent queries, check whether the implementation file ranks above its README in Code Graph top-5.
```

### Commands

**Query A — provider cascade:**
```
  input: "how does embedding provider auto-cascade resolution work when no API keys are set",
  queryMode: "neighborhood",
})
```
Expected: `shared/embeddings/factory.ts` (impl) ranks above `shared/embeddings/README.md` (docs).

**Query B — ollama availability probe:**
```
  input: "how does the system detect whether ollama runtime is installed",
  queryMode: "neighborhood",
})
```
Expected: `shared/embeddings/ollama-availability.ts` (impl) ranks above `shared/embeddings/providers/README.md` (docs).

**Query C — sqlite-vec virtual table creation:**
```
  input: "how is the sqlite-vec virtual table created and queried for embeddings",
  queryMode: "neighborhood",
})
```
Expected: `mcp-server/lib/search/vector-index-store.ts` or `vector-index-impl.ts` (impl) ranks above `references/memory/embedding-resilience.md` (docs).

**Query D — profile-keyed DB filename:**
```
  input: "how is the active profile sqlite filename derived from provider model dim and dtype",
  queryMode: "neighborhood",
})
```
Expected: `shared/embeddings/profile.ts:resolveActiveProfileDbPath` (impl) ranks above `mcp-server/INSTALL-GUIDE.md` (docs).

For each query, capture:
- The rank of the implementation file.
- The rank of the doc/README file that explains the same concept.
- A boolean: implementation ranked above doc?

### Expected

A table like:
```
| Query | Impl file               | Impl rank | Doc file                          | Doc rank | Impl > Doc? |
|-------|-------------------------|----------:|-----------------------------------|---------:|------------|
| A     | factory.ts              | 1         | shared/embeddings/README.md       | 4        | YES         |
| B     | ollama-availability.ts| 2         | providers/README.md               | 6        | YES         |
| C     | vector-index-store.ts   | 1         | embedding-resilience.md           | 5        | YES         |
| D     | profile.ts              | 3         | INSTALL-GUIDE.md                  | 2        | NO          |
```

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file the run reads or writes.

### Pass/Fail

### Failure Triage

1. Re-run each command on its own and record its exit status; the first non-zero exit names the failing step.
2. Check the active embedding provider with `memory_health` — a degraded or lexical-only lane changes recall and is the most common cause of a rank miss.
3. Confirm indexing finished before the query step; re-run the query after the documented wait if the stored record is absent from every result.
4. Compare the observed output against the Expected block field by field and quote the first field that disagrees.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Category overview: [local-llm-query-intelligence/README.md](../../manual-testing-playbook/local-llm-query-intelligence/README.md)
- Mechanical local-LLM suites: `.opencode/skills/system-spec-kit/mcp-server/tests/local-llm-features/`

---

## 5. SOURCE METADATA

- Group: Local LLM Query Intelligence
- Playbook ID: 403
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `local-llm-query-intelligence/code-intent-matching.md`
