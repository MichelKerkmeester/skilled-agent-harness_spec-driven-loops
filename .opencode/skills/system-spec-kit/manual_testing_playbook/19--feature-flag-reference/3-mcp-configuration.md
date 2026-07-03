---
title: "EX-030 -- 3. MCP Configuration"
description: "This scenario validates 3. MCP Configuration for `EX-030`. It focuses on MCP limits audit."
audited_post_018: true
version: 3.6.0.15
---

# EX-030 -- 3. MCP Configuration

## 1. OVERVIEW

This scenario validates 3. MCP Configuration for `EX-030`. It focuses on MCP limits audit.

---

## 2. SCENARIO CONTRACT


- Objective: MCP limits audit.
- Real user request: `Please validate 3. MCP Configuration against memory_search({ query:"MCP_MAX_MEMORY_TOKENS validation settings defaults", limit:20 }) and tell me whether the expected signals are present: MCP guardrails returned.`
- Prompt: `Validate 3. MCP Configuration against memory_search({ query:"MCP_MAX_MEMORY_TOKENS validation settings defaults", limit:20 }).`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: MCP guardrails returned
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if defaults + keys identified

---

## 3. TEST EXECUTION

### Prompt

```
Validate 3. MCP Configuration against memory_search({ query:"MCP_MAX_MEMORY_TOKENS validation settings defaults", limit:20 }).
```

### Commands

1. memory_search({ query:"MCP_MAX_MEMORY_TOKENS validation settings defaults", limit:20 })

### Expected

MCP guardrails returned

### Evidence

Command run:

```text
memory_search({ query:"MCP_MAX_MEMORY_TOKENS validation settings defaults", limit:20 })
```

Native MCP wrapper attempts observed these transport/parameter outputs before a successful search response was obtained:

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
      ]
    }
  }
}
```

CLI fallback attempt observed:

```text
@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
```

Successful MCP search response observed after satisfying the wrapper's non-empty optional-field validation:

```json
{
  "summary": "Found 5 memories",
  "data": {
    "searchType": "multi-concept",
    "count": 5,
    "constitutionalCount": 0,
    "requestQuality": {
      "label": "gap"
    },
    "recovery": {
      "status": "partial",
      "reason": "knowledge_gap",
      "suggestedQueries": [
        "MCP_MAX_MEMORY_TOKENS validation settings defaults"
      ],
      "recommendedAction": "broaden_or_ask"
    },
    "citationPolicy": "do_not_cite_results",
    "envelopeRender": "requestQuality gap\ncitationPolicy do_not_cite_results",
    "responsePolicy": {
      "requiredAction": "broaden_or_ask",
      "noCanonicalPathClaims": true,
      "citationRequiredForPaths": true,
      "safeResponse": "Retrieval quality is weak. Broaden the query or ask the user for disambiguation before citing any path."
    },
    "evidenceGapWarning": "> **[EVIDENCE GAP DETECTED]: Retrieved context has low mathematical confidence (Z=0.99). Consider first principles.**",
    "evidenceGap": true,
    "progressiveDisclosure": {
      "summaryLayer": {
        "count": 5,
        "digest": "5 weak"
      }
    },
    "results": [
      {
        "id": 3333,
        "specFolder": "system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/004-fix-validation-memory",
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/004-fix-validation-memory/checklist.md",
        "title": "Quality Checklist: 004 Validation And Memory Remediation [template:level_2/checklist.md]",
        "score": 0.40702999999999995,
        "confidence": {
          "label": "low",
          "value": 0.082,
          "drivers": []
        }
      },
      {
        "id": 4872,
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/020-deep-review-p1-p2-remediation/spec.md",
        "title": "Spec: 020 Deep Review P1/P2 Remediation",
        "score": 0.4016232999999999
      },
      {
        "id": 4871,
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/020-deep-review-p1-p2-remediation/plan.md",
        "title": "Implementation Plan: 020 Deep Review P1/P2 Remediation",
        "score": 0.39208415999999996
      },
      {
        "id": 5443,
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention/plan.md",
        "title": "Implementation Plan: Orphan MCP Leak Prevention",
        "score": 0.3661257599999999
      },
      {
        "id": 13450,
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/004-fix-validation-memory/graph-metadata.json",
        "title": "Graph Metadata: system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/004-fix-validation-memory",
        "score": 0.3323221506421316
      }
    ],
    "summary": "> **[EVIDENCE GAP DETECTED]: Retrieved context has low mathematical confidence (Z=0.99). Consider first principles.**\n\nFound 5 memories"
  }
}
```

Observed comparison to Expected: the Expected signal was `MCP guardrails returned`, with pass condition `defaults + keys identified`. The observed search returned `requestQuality.label: "gap"`, `responsePolicy.requiredAction: "broaden_or_ask"`, `evidenceGap: true`, and no `MCP_MAX_MEMORY_TOKENS` defaults or validation setting keys in the result titles or surfaced snippets.

### Pass / Fail

- **FAIL**: The pass condition was not met. The search returned weak/gap results and did not identify `MCP_MAX_MEMORY_TOKENS` defaults or validation setting keys.

### Failure Triage

Verify in config files directly

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [19--feature-flag-reference/3-mcp-configuration.md](../../feature_catalog/19--feature-flag-reference/3-mcp-configuration.md)

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: EX-030
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `19--feature-flag-reference/3-mcp-configuration.md`
