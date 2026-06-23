---
title: "287 -- Query-intent classifier"
description: "Validates the heuristic query-intent classifier that routes queries to structural (code graph), semantic (Code Graph), or hybrid backends and emits IntentTelemetry."
audited_post_018: true
version: 3.6.0.6
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

- Four `memory_context` envelopes captured for the three queries plus the paraphrase
- `paraphraseGroup` token comparison

### Pass / Fail

- **Pass**: labels match documented categories, envelope shape is correct, paraphraseGroup is stable across paraphrases.
- **Fail**: wrong labels, envelope missing required fields, paraphraseGroup differs across paraphrases.

### Failure Triage

Inspect `.opencode/skills/system-code-graph/mcp_server/lib/query-intent-classifier.ts` for the keyword dictionary and confidence scoring. Verify `mcp_server/handlers/memory-context.ts` consumes the classifier output and emits the telemetry envelope. Confirm the paraphraseGroup hashing is deterministic across normalized inputs.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation/query-intent-classifier.md](../../feature_catalog/22--context-preservation/query-intent-classifier.md)
- Source: `.opencode/skills/system-code-graph/mcp_server/lib/query-intent-classifier.ts`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`

---

## 5. SOURCE METADATA

- Group: Context preservation
- Playbook ID: 287
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation/query-intent-classifier.md`
