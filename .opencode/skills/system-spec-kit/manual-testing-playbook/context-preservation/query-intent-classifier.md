---
title: "287 -- Query-intent classifier"
description: "Validates the heuristic query-intent classifier that routes queries to structural (code graph), semantic (Code Graph), or hybrid backends and emits IntentTelemetry."
audited_post_018: true
version: 3.6.0.6
id: context-preservation-query-intent-classifier
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 287 -- Query-intent classifier

## 1. OVERVIEW

This scenario validates the keyword-dictionary classifier that labels queries as structural, semantic, or hybrid. It exercises the classification confidence, matched keywords, the `IntentTelemetry` envelope with `taskIntent.classificationKind` and `backendRouting.classificationKind` markers, and the stable `paraphraseGroup` token.

---

## 2. SCENARIO CONTRACT

- Objective: Verify the classifier returns the correct intent label, surface confidence and matched keywords, and emits the normalized IntentTelemetry envelope with stable paraphraseGroup tokens.
- Real user request: `Please validate the query-intent classifier on three sample queries (one structural, one semantic, one hybrid) and prove the IntentTelemetry envelope returns the expected classificationKind and a paraphraseGroup that holds across paraphrases.`
- Prompt: `Validate query-intent classifier and confirm intent labels, telemetry envelope, and stable paraphraseGroup tokens.`
- Expected execution process: Run memory_context with three category queries plus one paraphrase, capture the IntentTelemetry envelope, compare labels and paraphrase groups.
- Expected signals: structural query routes to code-graph backend with `taskIntent.classificationKind` marker; semantic query routes to Code Graph backend; hybrid query merges both; paraphrased version of the structural query returns the same `paraphraseGroup` token as the original.
- Desired user-visible outcome: Pass/fail verdict with cited classifier output.
- Pass/fail: PASS when labels, telemetry shape, and paraphraseGroup stability hold. FAIL when labels are wrong, telemetry envelope is missing, or paraphraseGroup tokens differ for known paraphrases.

---

## 3. TEST EXECUTION

### Prompt

```
Validate query-intent classifier and confirm intent labels, telemetry envelope, and stable paraphraseGroup tokens.
```

### Commands

1. Pick three sample queries:
   - Structural: `find callers of memory_search`
   - Semantic: `how does the search pipeline handle empty results`
   - Hybrid: `where is the cache invalidation logic and how does it work`
2. Run `memory_context({ input: "<each query>", includeTrace: true })` and capture the IntentTelemetry envelope from each.
3. Assert each envelope contains `taskIntent.classificationKind` and `backendRouting.classificationKind` plus a `paraphraseGroup` token.
4. Assert the structural query routes to code-graph backend, the semantic query routes to Code Graph, and the hybrid query merges both.
5. Issue a paraphrase of the structural query: `who calls memory_search` and capture the envelope.
6. Assert the paraphrase returns the same `paraphraseGroup` token as the original structural query.

### Expected

- Each query returns the expected intent label.
- `IntentTelemetry` envelope contains `classificationKind` for both task-intent and backend-routing sites.
- Paraphrase produces an identical `paraphraseGroup` token.

### Evidence

- Four accepted `memory_context` envelopes captured for the three queries plus the paraphrase with `includeTrace: true`:
  - Structural query `find callers of memory_search` returned `data.searchDecisionEnvelope.requestId: "0a9386ad-8670-45d1-928a-d4216f25ebda"`, `data.searchDecisionEnvelope.queryPlan.selectedChannels: ["vector", "fts", "bm25", "graph", "degree"]`, `data.searchDecisionEnvelope.queryPlan.routingReasons: ["complexity:moderate", "confidence:low", "terms:4", "artifact:memory", "channels:vector+fts+bm25+graph+degree", "graph-preserved-by-entity-density"]`, `meta.intent.taskIntent.classificationKind: "task-intent"`, `meta.intent.backendRouting.classificationKind: "backend-routing"`, `meta.intent.backendRouting.route: "semantic"`, `meta.intent.paraphraseGroup: "callers-find-memory_search"`.
  - Semantic query `how does the search pipeline handle empty results` returned `data.searchDecisionEnvelope.requestId: "035a9202-6b35-4d52-b23f-df2216c65476"`, `data.searchDecisionEnvelope.queryPlan.selectedChannels: ["vector", "fts", "bm25", "graph", "degree"]`, `data.searchDecisionEnvelope.queryPlan.routingReasons: ["complexity:moderate", "confidence:low", "terms:8", "artifact:research", "channels:vector+fts+bm25+graph+degree", "graph-preserved-by-entity-density"]`, `meta.intent.taskIntent.classificationKind: "task-intent"`, `meta.intent.backendRouting.classificationKind: "backend-routing"`, `meta.intent.backendRouting.route: "semantic"`, `meta.intent.paraphraseGroup: "does-empty-handle-pipeline-results-search"`.
  - Hybrid query `where is the cache invalidation logic and how does it work` returned `data.searchDecisionEnvelope.requestId: "a42d12ac-5a24-40ea-8859-4a3116840a95"`, `data.searchDecisionEnvelope.queryPlan.selectedChannels: ["vector", "fts", "bm25", "graph", "degree"]`, `data.searchDecisionEnvelope.queryPlan.routingReasons: ["complexity:complex", "confidence:medium", "terms:11", "artifact:unknown", "channels:vector+fts+bm25+graph+degree"]`, `meta.intent.taskIntent.classificationKind: "task-intent"`, `meta.intent.backendRouting.classificationKind: "backend-routing"`, `meta.intent.backendRouting.route: "semantic"`, `meta.intent.paraphraseGroup: "cache-does-invalidation-logic-where-work"`.
  - Structural paraphrase `who calls memory_search` returned `data.searchDecisionEnvelope.requestId: "36cdc41e-52ba-4563-95b2-dc3f9f686a2e"`, `data.searchDecisionEnvelope.queryPlan.selectedChannels: ["vector", "fts"]`, `data.searchDecisionEnvelope.queryPlan.skippedChannels: [{"channel":"bm25","reason":"Skipped by simple complexity route"},{"channel":"graph","reason":"Skipped by simple complexity route"},{"channel":"degree","reason":"Skipped by simple complexity route"}]`, `meta.intent.taskIntent.classificationKind: "task-intent"`, `meta.intent.backendRouting.classificationKind: "backend-routing"`, `meta.intent.backendRouting.route: "semantic"`, `meta.intent.paraphraseGroup: "calls-memory_search-who"`.
- `paraphraseGroup` token comparison: original structural query returned `"callers-find-memory_search"`; paraphrase returned `"calls-memory_search-who"`; these are not identical.
- Additional observed schema rejection while attempting to omit defaults: `code: "E030"`, `issues: ["limit: Too small: expected number to be >=1"]`.

### Pass / Fail

- **FAIL**: The telemetry envelope included `taskIntent.classificationKind`, `backendRouting.classificationKind`, and `paraphraseGroup`, but the structural query returned `meta.intent.backendRouting.route: "semantic"` instead of a code-graph route, the hybrid query returned `meta.intent.backendRouting.route: "semantic"` instead of an explicit merged route, and the structural paraphrase changed `paraphraseGroup` from `"callers-find-memory_search"` to `"calls-memory_search-who"`.

### Failure Triage

Inspect `.opencode/skills/system-code-graph/mcp-server/lib/query-intent-classifier.ts` for the keyword dictionary and confidence scoring. Verify `mcp-server/handlers/memory-context.ts` consumes the classifier output and emits the telemetry envelope. Confirm the paraphraseGroup hashing is deterministic across normalized inputs.

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [context-preservation/query-intent-classifier.md](../../feature-catalog/context-preservation/query-intent-classifier.md)
- Source: `.opencode/skills/system-code-graph/mcp-server/lib/query-intent-classifier.ts`, `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-context.ts`

---

## 5. SOURCE METADATA

- Group: Context preservation
- Playbook ID: 287
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `context-preservation/query-intent-classifier.md`
