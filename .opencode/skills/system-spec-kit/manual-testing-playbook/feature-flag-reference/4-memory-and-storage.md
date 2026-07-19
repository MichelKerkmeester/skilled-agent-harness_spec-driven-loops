---
title: "EX-031 -- 4. Memory and Storage"
description: "This scenario validates 4. Memory and Storage for `EX-031`. It focuses on Storage precedence check."
audited_post_018: true
version: 3.6.0.16
id: feature-flag-reference-4-memory-and-storage
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# EX-031 -- 4. Memory and Storage

## 1. OVERVIEW

This scenario validates 4. Memory and Storage for `EX-031`. It focuses on Storage precedence check.

---

## 2. SCENARIO CONTRACT


- Objective: Storage precedence check.
- Real user request: `Please validate 4. Memory and Storage against memory_search({ query: "SPEC_KIT_DB_DIR SPECKIT_DB_DIR MEMORY_DB_PATH database path precedence", limit: 20 }) and tell me whether the expected signals are present: Precedence chain identified.`
- Prompt: `Validate 4. Memory and Storage against memory_search({ query: "SPEC_KIT_DB_DIR SPECKIT_DB_DIR MEMORY_DB_PATH database path precedence", limit: 20 }).`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Precedence chain identified
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if precedence is unambiguous

---

## 3. TEST EXECUTION

### Prompt

```
Validate 4. Memory and Storage against memory_search({ query: "SPEC_KIT_DB_DIR SPECKIT_DB_DIR MEMORY_DB_PATH database path precedence", limit: 20 }).
```

### Commands

1. memory_search({ query: "SPEC_KIT_DB_DIR SPECKIT_DB_DIR MEMORY_DB_PATH database path precedence", limit: 20 })
2. memory_context({ input: "Explain DB path precedence env vars", mode: "focused", sessionId: "ex031" })

### Expected

Precedence chain identified

### Evidence

Command 1 exact MCP attempt:

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

Command 1 MCP retry with usable optional values returned no precedence-chain evidence:

```json
{
  "summary": "Found 5 memories (1 constitutional)",
  "data": {
    "searchType": "multi-concept",
    "count": 5,
    "constitutionalCount": 1,
    "requestQuality": {
      "label": "weak"
    },
    "recovery": {
      "status": "low_confidence",
      "reason": "knowledge_gap",
      "suggestedQueries": [
        "SPEC_KIT_DB_DIR SPECKIT_DB_DIR MEMORY_DB_PATH",
        "SPEC_KIT_DB_DIR SPECKIT_DB_DIR MEMORY_DB_PATH database path precedence",
        "SPEC_KIT_DB_DIR SPECKIT_DB_DIR MEMORY_DB_PATH db path precedence"
      ],
      "recommendedAction": "ask_user"
    },
    "citationPolicy": "cite_with_caveat",
    "responsePolicy": {
      "requiredAction": "broaden_or_ask",
      "noCanonicalPathClaims": true,
      "citationRequiredForPaths": true,
      "safeResponse": "Retrieval quality is weak. Broaden the query or ask the user for disambiguation before citing any path."
    },
    "progressiveDisclosure": {
      "summaryLayer": {
        "count": 5,
        "digest": "5 weak"
      },
      "results": [
        {
          "resultId": "9370",
          "snippet": "---\ntitle: \"Comment Hygiene — No Ephemeral Artifact Pointers in Code Comments\"\nimportanceTier: const..."
        },
        {
          "resultId": "9375",
          "snippet": "---\ntitle: \"MEMORY — Spec-Kit System Only\"\nimportanceTier: constitutional\ncontextType: decision\ntrig..."
        },
        {
          "resultId": "9371",
          "snippet": "---\ntitle: \"GATE ENFORCEMENT - Edge Cases & Cross-Reference\"\nimportanceTier: constitutional\ncontextT..."
        },
        {
          "resultId": "9372",
          "snippet": "---\ntitle: \"TOOL ROUTING - Search & Retrieval Decision Tree\"\nimportanceTier: constitutional\ncontextT..."
        },
        {
          "resultId": "9380",
          "snippet": "---\ntitle: \"Verify Before Completion Claims\"\nimportanceTier: constitutional\ncontextType: decision\ntr..."
        }
      ],
      "continuation": null
    },
    "results": [
      {
        "id": 9370,
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md",
        "title": "Comment Hygiene — No Ephemeral Artifact Pointers in Code Comments",
        "confidence": {
          "label": "low",
          "value": 0.095,
          "drivers": []
        }
      },
      {
        "id": 9375,
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/constitutional/memory-system-spec-kit-only.md",
        "title": "MEMORY — Spec-Kit System Only",
        "compact": true
      },
      {
        "id": 9371,
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/constitutional/gate-enforcement.md",
        "title": "GATE ENFORCEMENT - Edge Cases & Cross-Reference",
        "compact": true
      },
      {
        "id": 9372,
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/constitutional/gate-tool-routing.md",
        "title": "TOOL ROUTING - Search & Retrieval Decision Tree",
        "confidence": {
          "label": "low",
          "value": 0.082,
          "drivers": []
        }
      },
      {
        "id": 9380,
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/constitutional/verify-before-completion-claims.md",
        "title": "Verify Before Completion Claims",
        "compact": true
      }
    ],
    "meta": {
      "tool": "memory_search",
      "tokenCount": 8487,
      "latencyMs": 552,
      "cacheHit": false
    }
  }
}
```

Command 1 daemon-backed CLI fallback:

```text
@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp-server && npm run build
```

Command 2 exact MCP output:

```json
{
  "summary": "Error: sessionId \"ex031\" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.",
  "data": {
    "error": "sessionId \"ex031\" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.",
    "code": "E_SESSION_SCOPE",
    "details": {
      "requestId": "7210756f-ae76-47ba-9625-3fc016eca661",
      "layer": "L1:Orchestration",
      "requestedSessionId": "ex031"
    }
  },
  "hints": [
    "Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId."
  ],
  "meta": {
    "tool": "memory_context",
    "tokenCount": 222,
    "cacheHit": false,
    "isError": true,
    "severity": "error",
    "tokenBudget": 3500
  }
}
```

### Pass / Fail

- **BLOCKED**: The listed `memory_context({ input: "Explain DB path precedence env vars", mode: "focused", sessionId: "ex031" })` command is rejected because `ex031` is not a server-managed session, and the daemon-backed fallback is unavailable because `@spec-kit/mcp-server dist is stale`; the observed search output was weak and did not identify the precedence chain.

### Failure Triage

Cross-check shared config loader and vector-index store override path

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [feature-flag-reference/4-memory-and-storage.md](../../feature-catalog/feature-flag-reference/4-memory-and-storage.md)

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: EX-031
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `feature-flag-reference/4-memory-and-storage.md`
