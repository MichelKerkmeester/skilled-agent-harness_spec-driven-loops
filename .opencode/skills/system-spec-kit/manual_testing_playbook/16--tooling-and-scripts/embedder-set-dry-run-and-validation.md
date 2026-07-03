---
title: "282 -- Embedder set dry-run and validation"
description: "Validates embedder_set dry-run planning and invalid-name error handling without starting a reindex."
audited_post_017: true
version: 3.6.0.1
---

# 282 -- Embedder set dry-run and validation

## 1. OVERVIEW

This scenario gives embedder_set deterministic coverage without triggering a real 15-minute corpus reindex.

---

## 2. SCENARIO CONTRACT

- Objective: Validate embedder_set dry-run happy path and invalid embedder edge case.
- Real user request: `Dry-run an embedder switch and prove invalid embedder names fail cleanly.`
- RCAF Prompt: `Run embedder_set in dry-run mode for a known embedder and then with an invalid name; verify plan and error shape.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - Dry-run returns a plan and does not start a job. - Invalid name returns a structured validation error. - Active embedder from `embedder_status({})` is unchanged after both calls.
- Desired user-visible outcome: A concise PASS/PARTIAL/FAIL verdict with cited evidence.
- Pass/fail: PASS if all expected signals are present; PARTIAL if the happy path works but an edge signal is missing; FAIL if the tool errors unexpectedly or omits required evidence.

---

## 3. TEST EXECUTION

### Prompt

```
Run embedder_set in dry-run mode for a known embedder and then with an invalid name; verify plan and error shape.
```

### Commands

1. `embedder_set({ name: "nomic-embed-text-v1.5", dryRun: true })`
2. Confirm the response reports planned table/dimension/reindex action without changing the active pointer.
3. `embedder_set({ name: "definitely-not-a-real-embedder", dryRun: true })`
4. Confirm the error names valid choices or recovery guidance.

### Expected Output / Verification

- Dry-run returns a plan and does not start a job.
- Invalid name returns a structured validation error.
- Active embedder from `embedder_status({})` is unchanged after both calls.

### Cleanup

No persistent cleanup is required unless the command writes a temporary fixture path; remove only that temporary path.

---

## 4. SOURCE FILES
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts`

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 282
- Tools: `embedder_set`, `embedder_status`

---

## 6. EVIDENCE

Scenario command 1 (`embedder_set({ name: "nomic-embed-text-v1.5", dryRun: true })`) was not executed because the current registered tool and handler do not support `dryRun`, and the handler would start a real reindex for a valid embedder.

Registered embedder list before the invalid-name call:

```json
{
  "summary": "Listed 1 embedders",
  "data": [
    {
      "name": "nomic-embed-text-v1.5",
      "dim": 768,
      "backend": "ollama",
      "active": true,
      "ready": true,
      "notes": "Drop-in 768-dim swap candidate. Retrieval-specialist trained on 235M pairs with hard negatives. Requires prefix tokens. Local-first cascade default per ADR-014."
    }
  ],
  "hints": [
    "[session] Context quality is degraded. Session may benefit from a `session_resume` call."
  ],
  "meta": {
    "tool": "embedder_list",
    "tokenCount": 155,
    "latencyMs": 4,
    "cacheHit": false,
    "tokenBudget": 1000
  }
}
```

Handler read confirmed no dry-run argument and unconditional reindex start:

```text
23: export interface EmbedderSetArgs {
24:   readonly name: string;
25: }
...
63:   const manifest = getManifest(name);
64:   if (!manifest) {
65:     throw new UnknownEmbedderError(name);
66:   }
67: 
68:   const db = get_db();
69:   ensureVecTableForDim(db, manifest.dim);
70: 
71:   const jobId = startReindex({ toName: manifest.name }, { db });
```

Schema read confirmed `embedder_set` allows only `name`:

```text
666:   embedder_list: [],
667:   embedder_set: ['name'],
668:   embedder_status: ['jobId'],
```

Registered `embedder_status({})` call via direct MCP wrapper could not be executed because the wrapper requires a non-empty `jobId`; attempted `jobId: ""` returned:

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

CLI attempt to run `embedder_status({})` failed before reaching the tool:

```text
$ node ".opencode/bin/spec-memory.cjs" embedder_status --json '{}' --format json --timeout-ms 3000
@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
```

Scenario command 3 equivalent invalid-name call was executed without `dryRun` because invalid names fail before any reindex can be queued:

```json
{
  "summary": "Error: An unexpected error occurred. Please check logs for details.",
  "data": {
    "error": "An unexpected error occurred. Please check logs for details.",
    "code": "UNKNOWN_EMBEDDER",
    "details": {
      "name": "definitely-not-a-real-embedder"
    }
  },
  "hints": [
    "An unexpected error occurred.",
    "Run memory_health() for diagnostics",
    "Check server logs for detailed error information",
    "Retry the operation after a moment",
    "memory_health()"
  ],
  "meta": {
    "tool": "embedder_set",
    "isError": true,
    "severity": "medium"
  }
}
```

Registered embedder list after the invalid-name call:

```json
{
  "summary": "Listed 1 embedders",
  "data": [
    {
      "name": "nomic-embed-text-v1.5",
      "dim": 768,
      "backend": "ollama",
      "active": true,
      "ready": true,
      "notes": "Drop-in 768-dim swap candidate. Retrieval-specialist trained on 235M pairs with hard negatives. Requires prefix tokens. Local-first cascade default per ADR-014."
    }
  ],
  "hints": [
    "[session] Context quality is degraded. Session may benefit from a `session_resume` call."
  ],
  "meta": {
    "tool": "embedder_list",
    "tokenCount": 155,
    "latencyMs": 2,
    "cacheHit": false,
    "tokenBudget": 1000
  }
}
```

## 7. PASS/FAIL

BLOCKED - The current repo/tooling does not expose or implement `embedder_set({ dryRun: true })`, `embedder_set` would queue a real reindex for the valid known embedder, `embedder_status({})` is rejected by the registered wrapper without a non-empty `jobId`, and the CLI front door is blocked by stale MCP server dist.
