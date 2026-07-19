---
title: "283 -- Embedder status job and active pointer"
description: "Validates embedder_status reports active pointer state and handles unknown job IDs cleanly."
audited_post_017: true
version: 3.6.0.1
id: tooling-and-scripts-embedder-status-job-and-active-pointer
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 283 -- Embedder status job and active pointer

## 1. OVERVIEW

This scenario covers the polling/readiness side of the embedder swap surface.

---

## 2. SCENARIO CONTRACT

- Objective: Validate embedder_status active pointer and unknown job edge.
- Real user request: `Check embedder_status and prove unknown swap job IDs are handled cleanly.`
- RCAF Prompt: `Run embedder_status without a job ID and with an impossible job ID; verify active state and error guidance.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - Active embedder metadata is visible. - Unknown job ID returns NOT_FOUND-style guidance, not a generic crash. - Response can be cited by operators polling a real swap.
- Desired user-visible outcome: A concise PASS/PARTIAL/FAIL verdict with cited evidence.
- Pass/fail: PASS if all expected signals are present; PARTIAL if the happy path works but an edge signal is missing; FAIL if the tool errors unexpectedly or omits required evidence.

---

## 3. TEST EXECUTION

### Prompt

```
Run embedder_status without a job ID and with an impossible job ID; verify active state and error guidance.
```

### Commands

1. `embedder_status({})`
2. Verify active embedder name, dimension, vector table, and any current job state.
3. `embedder_status({ jobId: "emb-swap-does-not-exist" })`
4. Verify the unknown job response is structured and non-crashing.

### Expected Output / Verification

- Active embedder metadata is visible.
- Unknown job ID returns NOT_FOUND-style guidance, not a generic crash.
- Response can be cited by operators polling a real swap.

### Cleanup

No persistent cleanup is required unless the command writes a temporary fixture path; remove only that temporary path.

### Evidence

Command 1 attempted via native MCP wrapper for the no-job case (`embedder_status({})`), but the wrapper rejected the empty/no-job invocation before the tool could return active pointer state:

```json
{
  "summary": "Error: An unexpected error occurred. Please check logs for details.",
  "data": {
    "error": "An unexpected error occurred. Please check logs for details.",
    "code": "E030",
    "details": {
      "tool": "embedder_status",
      "issues": [
        "jobId: Too small: expected string to have >=1 characters"
      ],
      "unknownParameters": [],
      "expectedParameters": [
        "jobId"
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
    "tool": "embedder_status",
    "isError": true,
    "severity": "low"
  }
}
```

Command 1 then attempted via daemon CLI transport with the exact empty payload (`node .opencode/bin/spec-memory.cjs embedder_status --json '{}' --format json --timeout-ms 3000`), but the CLI transport was blocked by stale built server output:

```text
@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp-server && npm run build
```

Command 3 (`embedder_status({ jobId: "emb-swap-does-not-exist" })`) returned structured non-crashing `not_found` output:

```json
{
  "summary": "Embedder re-index status: not_found",
  "data": {
    "jobId": null,
    "status": "not_found",
    "total": 0,
    "processed": 0,
    "eta": null,
    "embeddings": {
      "provider": {
        "provider": "hf-local",
        "requestedProvider": "ollama",
        "effectiveProvider": "hf-local",
        "fallbackReason": "Ollama backend unreachable at http://127.0.0.1:11434: This operation was aborted",
        "dimensionChanged": false,
        "reason": "Fallback from ollama to hf-local: Ollama backend unreachable at http://127.0.0.1:11434: This operation was aborted",
        "config": {
          "EMBEDDINGS_PROVIDER": "auto",
          "VOYAGE_API_KEY": "not set",
          "VOYAGE_EMBEDDINGS_MODEL": "voyage-code-3",
          "OPENAI_API_KEY": "not set",
          "OPENAI_EMBEDDINGS_MODEL": "text-embedding-3-small",
          "HF_EMBEDDINGS_MODEL": "nomic-ai/nomic-embed-text-v1.5",
          "OLLAMA_BASE_URL": "http://127.0.0.1:11434",
          "OLLAMA_EMBEDDINGS_MODEL": "nomic-embed-text-v1.5"
        }
      },
      "modelServer": {
        "provider": "hf-local",
        "model": "nomic-ai/nomic-embed-text-v1.5",
        "dim": 768,
        "dtype": "q8",
        "serverState": "error",
        "device": null,
        "healthy": false,
        "loaded": false,
        "loadTimeMs": null,
        "loadStartedAt": null,
        "loadProgressAt": null,
        "inferenceP50Ms": null,
        "inferenceP95Ms": null,
        "lastInferenceMs": null,
        "queueDepth": 0,
        "baseUrl": "/tmp/mk-hf-embed/hf-embed.sock",
        "requestCount": 0
      },
      "recallDegradation": {
        "degraded": false,
        "vectorSearchAvailable": true,
        "mode": "hybrid",
        "reason": null,
        "degradedVector": {
          "state": "healthy",
          "degraded": false,
          "sentinelPersisted": true,
          "detections": 0,
          "quarantines": 0,
          "rebuildsStarted": 0,
          "rebuildsCompleted": 0,
          "rebuildsFailed": 0,
          "lastEventAt": null,
          "lastReason": null,
          "lastShard": null,
          "lastQuarantine": null,
          "activeJobId": null
        }
      }
    }
  },
  "hints": [
    "[session] Context quality is degraded. Session may benefit from a `session_resume` call."
  ],
  "meta": {
    "tool": "embedder_status",
    "tokenCount": 618,
    "latencyMs": 14,
    "cacheHit": false,
    "tokenBudget": 1000
  }
}
```

### Pass/Fail

BLOCKED: The unknown-job edge returned structured `not_found` output, but the no-job active-pointer command could not be completed because the native MCP wrapper rejects a missing/empty `jobId` and the CLI fallback is blocked by stale `.opencode/skills/system-spec-kit/mcp-server` dist output.

---

## 4. SOURCE FILES
- `.opencode/skills/system-spec-kit/mcp-server/handlers/embedder-status.ts`

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 283
- Tool: `embedder_status`
