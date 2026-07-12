---
title: "EX-032 -- 5. Embedding and API"
description: "This scenario validates 5. Embedding and API for `EX-032`. It focuses on Provider selection audit."
audited_post_018: true
version: 3.6.0.19
---

# EX-032 -- 5. Embedding and API

## 1. OVERVIEW

This scenario validates 5. Embedding and API for `EX-032`. It focuses on Provider selection audit.

---

## 2. SCENARIO CONTRACT


- Objective: Provider selection audit.
- Real user request: `Please validate 5. Embedding and API against memory_search({ query:"EMBEDDINGS_PROVIDER auto provider selection rules ollama hf-local nomic-embed-text-v1.5 local defaults", limit:20 }) and tell me whether the expected signals are present: provider rules, key precedence, ollama local default, and hf-local fallback shown.`
- Prompt: `Validate 5. Embedding and API against memory_search({ query:"EMBEDDINGS_PROVIDER auto provider selection rules ollama hf-local nomic-embed-text-v1.5 local defaults", limit:20 }).`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Provider rules show explicit `EMBEDDINGS_PROVIDER` first, then `VOYAGE_API_KEY`, then `OPENAI_API_KEY`, then local `ollama`, then `hf-local`; local defaults name `nomic-embed-text-v1.5` (Ollama) and `nomic-ai/nomic-embed-text-v1.5` (hf-local).
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if provider routing, key precedence, and both local default/fallback model IDs are clear

---

## 3. TEST EXECUTION

### Prompt

```
Validate 5. Embedding and API against memory_search({ query:"EMBEDDINGS_PROVIDER auto provider selection rules ollama hf-local nomic-embed-text-v1.5 local defaults", limit:20 }).
```

### Commands

1. memory_search({ query:"EMBEDDINGS_PROVIDER auto provider selection rules ollama hf-local nomic-embed-text-v1.5 local defaults", limit:20 })

### Expected

Provider rules show explicit `EMBEDDINGS_PROVIDER` first, then `VOYAGE_API_KEY`, then `OPENAI_API_KEY`, then local `ollama`, then `hf-local`; local defaults name `nomic-embed-text-v1.5` (Ollama) and `nomic-ai/nomic-embed-text-v1.5` (hf-local).

### Evidence

Search output

Native MCP attempt for documented command `memory_search({ query:"EMBEDDINGS_PROVIDER auto provider selection rules ollama hf-local nomic-embed-text-v1.5 local defaults", limit:20 })` was rejected before returning search results because the runtime serialized empty optional fields:

```json
{
  "summary": "Error: An unexpected error occurred. Please check logs for details.",
  "data": {
    "error": "An unexpected error occurred. Please check logs for details.",
    "code": "E030",
    "details": {
      "tool": "memory_search",
      "issues": [
        "cursor: Too small: expected string to have >=1 characters",
        "concepts: Too small: expected array to have >=2 items"
      ],
      "unknownParameters": [],
      "expectedParameters": [
        "cursor",
        "query",
        "concepts",
        "specFolder",
        "tenantId",
        "userId",
        "agentId",
        "limit",
        "sessionId",
        "enableDedup",
        "tier",
        "contextType",
        "useDecay",
        "includeContiguity",
        "includeConstitutional",
        "enableSessionBoost",
        "enableCausalBoost",
        "includeContent",
        "anchors",
        "min_quality_score",
        "minQualityScore",
        "bypassCache",
        "rerank",
        "applyLengthPenalty",
        "applyStateLimits",
        "minState",
        "intent",
        "autoDetectIntent",
        "trackAccess",
        "includeArchived",
        "mode",
        "retrievalLevel",
        "includeTrace",
        "profile"
      ]
    }
  },
  "hints": [
    "Invalid parameter value provided.",
    "Check parameter type matches expected schema",
    "Review tool documentation for valid parameter values",
    "Ensure strings are properly quoted"
  ],
  "meta": {
    "tool": "memory_search",
    "isError": true,
    "severity": "low"
  }
}
```

CLI fallback attempt using the exact JSON payload:

```bash
node ".opencode/bin/spec-memory.cjs" memory_search --json '{"query":"EMBEDDINGS_PROVIDER auto provider selection rules ollama hf-local nomic-embed-text-v1.5 local defaults","limit":20}' --format json --timeout-ms 10000
```

Actual output:

```text
@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
```

Because the documented command did not produce a valid `memory_search` result transcript, the expected provider-order and local-model signals could not be verified from this scenario run.

### Pass / Fail

- **BLOCKED**: The documented `memory_search({ query:"EMBEDDINGS_PROVIDER auto provider selection rules ollama hf-local nomic-embed-text-v1.5 local defaults", limit:20 })` command did not return search results; native MCP rejected serialized optional empty fields and the CLI fallback reported `@spec-kit/mcp-server dist is stale`.

### Failure Triage

Verify env in runtime

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [feature_flag_reference/5_embedding_and_api.md](../../feature_catalog/feature_flag_reference/5_embedding_and_api.md)

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: EX-032
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `feature_flag_reference/5_embedding_and_api.md`
