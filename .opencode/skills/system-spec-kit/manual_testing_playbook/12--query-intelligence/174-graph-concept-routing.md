---
title: "174 -- Graph concept routing"
description: "Validates the entity-linker concept routing pass and the d2-concept-routing trace metadata it writes on Stage 1 candidate generation."
audited_post_018: true
---

# 174 -- Graph concept routing

## 1. OVERVIEW

This scenario validates the concept-routing pass that runs over natural-language queries during Stage 1. It exercises noun-phrase extraction, alias-table matching, and the `d2-concept-routing` trace metadata that downstream observability consumers depend on.

---

## 2. SCENARIO CONTRACT

- Objective: Verify graph concept routing extracts noun phrases, matches the concept alias table, and writes matchedConcepts plus graphActivated to the Stage 1 trace metadata when `SPECKIT_GRAPH_CONCEPT_ROUTING` is enabled.
- Real user request: `Please validate graph concept routing against a natural-language query that mentions a known concept alias and tell me whether the matchedConcepts trace metadata appears in Stage 1.`
- Prompt: `Validate concept routing and confirm the d2-concept-routing trace entry appears with matchedConcepts and graphActivated for a query that hits a known alias.`
- Expected execution process: Run the documented command sequence, capture transcript and evidence, compare observed output to expected signals, return pass/fail verdict.
- Expected signals: `isGraphConceptRoutingEnabled()` returns true under default flags; the entity-linker extracts noun phrases and matches them to the concept alias table; Stage 1 trace contains a `d2-concept-routing` entry with `matchedConcepts` (non-empty for a known alias) and `graphActivated: true`; disabling the flag suppresses the trace entry.
- Desired user-visible outcome: Pass/fail verdict with cited trace evidence.
- Pass/fail: PASS when matchedConcepts surface on a known-alias query, the trace entry is present, and the flag opt-out drops the entry. FAIL when the entry is missing for a known alias or when the opt-out does not suppress it.

---

## 3. TEST EXECUTION

### Prompt

```
Validate concept routing and confirm the d2-concept-routing trace entry appears with matchedConcepts and graphActivated for a query that hits a known alias.
```

### Commands

1. Pick a query that contains a noun phrase known to appear in the concept alias table, e.g. `memory_search({ query: "<noun phrase from concept aliases>", includeTrace: true, limit: 5 })`.
2. Capture the response and locate the Stage 1 trace section.
3. Assert the trace contains a `d2-concept-routing` entry with `matchedConcepts` (non-empty) and `graphActivated: true`.
4. Re-run with a deliberately concept-less query (`memory_search({ query: "<plain prose with no known aliases>", includeTrace: true, limit: 5 })`) and assert the trace entry either absents `matchedConcepts` or marks `graphActivated: false`.
5. Set `SPECKIT_GRAPH_CONCEPT_ROUTING=false` in the runtime env, restart MCP, repeat step 1, and assert the `d2-concept-routing` trace entry is absent or suppressed.
6. Targeted Vitest: `cd .opencode/skills/system-spec-kit/mcp_server && npm exec -- vitest run tests/concept-routing.vitest.ts`.

### Expected

- Trace contains `d2-concept-routing` entry with `matchedConcepts` non-empty and `graphActivated: true` for the alias-hit query.
- Concept-less query trace does not surface false matches.
- Flag opt-out suppresses the trace entry.
- `tests/concept-routing.vitest.ts` exits 0.

### Evidence

- Two `memory_search` trace envelopes (alias-hit, alias-miss)
- One additional trace envelope from the flag-off run
- Targeted Vitest summary

### Pass / Fail

- **Pass**: alias-hit trace contains matchedConcepts and graphActivated=true, alias-miss trace does not, flag-off suppresses the entry, Vitest exits 0.
- **Fail**: alias-hit trace missing matchedConcepts, alias-miss trace shows false matches, flag-off still emits the entry, or Vitest fails.

### Failure Triage

Inspect `mcp_server/lib/search/entity-linker.ts` for noun-phrase extraction and alias matching. Check `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` for the trace write. Confirm `mcp_server/lib/search/search-flags.ts:isGraphConceptRoutingEnabled` reads `SPECKIT_GRAPH_CONCEPT_ROUTING` at request time.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [12--query-intelligence/132-graph-concept-routing.md](../../feature_catalog/12--query-intelligence/132-graph-concept-routing.md)
- Source: `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-linker.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- Regression tests: `.opencode/skills/system-spec-kit/mcp_server/tests/concept-routing.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Query intelligence
- Playbook ID: 174
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `12--query-intelligence/174-graph-concept-routing.md`
