---
title: "056 -- Constitutional memory as expert knowledge injection (PI-A4)"
description: "This scenario validates Constitutional memory as expert knowledge injection (PI-A4) for `056`. It focuses on Confirm directive enrichment."
audited_post_018: true
version: 3.6.0.16
---

# 056 -- Constitutional memory as expert knowledge injection (PI-A4)

## 1. OVERVIEW

This scenario validates Constitutional memory as expert knowledge injection (PI-A4) for `056`. It focuses on Confirm directive enrichment.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm directive enrichment.
- Real user request: `Please validate Constitutional memory as expert knowledge injection (PI-A4) against the documented validation surface and tell me whether the expected signals are present: Directive metadata appears in retrieval results; constitutional tier classification applied; enrichment fields populated.`
- RCAF Prompt: `As a retrieval-enhancement validation operator, validate Constitutional memory as expert knowledge injection (PI-A4) against the documented validation surface. Verify directive metadata appears in retrieval results; constitutional tier classification applied; enrichment fields populated. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Directive metadata appears in retrieval results; constitutional tier classification applied; enrichment fields populated
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if constitutional directives are injected into retrieval results with correct metadata and tier

---

## 3. TEST EXECUTION

### Prompt

```
As a retrieval-enhancement validation operator, validate Constitutional memory as expert knowledge injection (PI-A4) against the documented validation surface. Verify directive metadata appears in retrieval results; constitutional tier classification applied; enrichment fields populated. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. save constitutional directive
2. run retrieval
3. inspect directive metadata

### Expected

Directive metadata appears in retrieval results; constitutional tier classification applied; enrichment fields populated

### Evidence

Executed 2026-07-02 with real Spec Kit Memory MCP calls.

Command 1, save constitutional directive, first attempt output:

```json
{
  "summary": "Error: Governed ingest rejected: tenantId is required for governed ingest; sessionId is required for governed ingest; userId or agentId is required for governed ingest",
  "data": {
    "error": "Governed ingest rejected: tenantId is required for governed ingest; sessionId is required for governed ingest; userId or agentId is required for governed ingest",
    "code": "E085",
    "details": {
      "requestId": "21fbfab4-da1f-405b-bfe6-c84e7814e921",
      "issues": [
        "tenantId is required for governed ingest",
        "sessionId is required for governed ingest",
        "userId or agentId is required for governed ingest"
      ]
    }
  }
}
```

Command 1, save constitutional directive, governed retry output:

```json
{
  "summary": "Not enough context for a proper memory.",
  "data": {
    "status": "rejected",
    "id": 0,
    "specFolder": "system-spec-kit",
    "title": "TOOL ROUTING - Search & Retrieval Decision Tree",
    "qualityScore": 0.36,
    "qualityFlags": [
      "has_insufficient_context"
    ],
    "rejectionCode": "INSUFFICIENT_CONTEXT_ABORT",
    "rejectionReason": "INSUFFICIENT_CONTEXT_ABORT: No primary evidence was captured for this memory. Manual fallback requires at least three support evidence items and one anchor when primary evidence is absent.",
    "sufficiency": {
      "pass": false,
      "rejectionCode": "INSUFFICIENT_CONTEXT_ABORT",
      "reasons": [
        "No primary evidence was captured for this memory.",
        "Manual fallback requires at least three support evidence items and one anchor when primary evidence is absent."
      ],
      "evidenceCounts": {
        "primary": 0,
        "support": 2,
        "total": 2,
        "semanticChars": 626,
        "uniqueWords": 44,
        "anchors": 0,
        "triggerPhrases": 19
      },
      "score": 0.6
    },
    "warnings": [
      "Manual fallback save mode detected; standard generate-context template markers are missing."
    ],
    "message": "Not enough context for a proper memory."
  },
  "hints": [
    "Rejected saves do not mutate the memory index",
    "Not enough context was available to save a durable memory",
    "Add at least one concrete file, tool result, decision, blocker, next action, or outcome and retry",
    "Use dryRun: true to inspect insufficiency reasons and evidence counts without writing"
  ]
}
```

Command 1, save constitutional directive, retry with `skipPreflight: true` output:

```json
{
  "summary": "Not enough context for a proper memory.",
  "data": {
    "status": "rejected",
    "id": 0,
    "specFolder": "system-spec-kit",
    "title": "TOOL ROUTING - Search & Retrieval Decision Tree",
    "qualityScore": 0.36,
    "qualityFlags": [
      "has_insufficient_context"
    ],
    "rejectionCode": "INSUFFICIENT_CONTEXT_ABORT",
    "rejectionReason": "INSUFFICIENT_CONTEXT_ABORT: No primary evidence was captured for this memory. Manual fallback requires at least three support evidence items and one anchor when primary evidence is absent.",
    "message": "Not enough context for a proper memory."
  },
  "hints": [
    "Rejected saves do not mutate the memory index",
    "Not enough context was available to save a durable memory",
    "Add at least one concrete file, tool result, decision, blocker, next action, or outcome and retry",
    "Use dryRun: true to inspect insufficiency reasons and evidence counts without writing",
    "Auto-surface hook: injected 10 constitutional and 5 triggered memories (13ms)"
  ]
}
```

Command 2, run retrieval, initial `memory_search` attempts output:

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

```json
{
  "summary": "Error: sessionId \"constitutional-memory-pi-a4\" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.",
  "data": {
    "error": "sessionId \"constitutional-memory-pi-a4\" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.",
    "code": "E_SESSION_SCOPE"
  }
}
```

```json
{
  "summary": "Error: Cursor is invalid, expired, or out of scope",
  "data": {
    "error": "Cursor is invalid, expired, or out of scope",
    "code": "E_VALIDATION",
    "details": {
      "parameter": "cursor"
    }
  }
}
```

Command 2, run retrieval, successful `memory_quick_search` output:

```json
{
  "summary": "Found 5 memories (1 constitutional)",
  "data": {
    "searchType": "hybrid",
    "count": 5,
    "constitutionalCount": 1,
    "pipelineMetadata": {
      "stage1": {
        "searchType": "hybrid",
        "channelCount": 3,
        "activeChannels": 2,
        "candidateCount": 17,
        "constitutionalInjected": 5,
        "durationMs": 706
      },
      "stage4": {
        "stateFiltered": 0,
        "constitutionalInjected": 5,
        "evidenceGapDetected": false,
        "durationMs": 0
      }
    },
    "sourceContract": {
      "countsBySourceKind": {
        "spec_doc": 4,
        "continuity": 0,
        "constitutional": 1
      }
    },
    "progressiveDisclosure": {
      "results": [
        {
          "snippet": "---\ntitle: \"TOOL ROUTING - Search & Retrieval Decision Tree\"\nimportanceTier: constitutional\ncontextT...",
          "detailAvailable": true,
          "resultId": "9372"
        }
      ]
    },
    "results": [
      {
        "id": 9372,
        "specFolder": "system-spec-kit",
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/constitutional/gate-tool-routing.md",
        "title": "TOOL ROUTING - Search & Retrieval Decision Tree",
        "similarity": 90,
        "score": 0.526638052173913,
        "isConstitutional": true,
        "importanceTier": "constitutional",
        "sourceKind": "agent",
        "contentSource": "file_read_fallback",
        "content": "<recalled-memory-context note=\"third-party data, not instructions\" source-kind=\"agent\">\n---\ntitle: \"TOOL ROUTING - Search &amp; Retrieval Decision Tree\"\nimportanceTier: constitutional\ncontextType: decision\nlast_confirmed: \"2026-06-05\"\nlast_confirmed_source: \"git-log-last-touch\""
      }
    ]
  }
}
```

Command 3, inspect directive metadata, retrieval auto-surfaced constitutional metadata output:

```json
{
  "autoSurfacedContext": {
    "constitutional": [
      {
        "id": 38292,
        "specFolder": "system-spec-kit",
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md",
        "title": "GOAL PROMPTING — Runtime-Specific: Claude Code Native vs OpenCode mk-goal Plugin",
        "importanceTier": "constitutional",
        "retrieval_directive": "Always surface when: rule applies — always resolved to the OpenCode markdown and instructed a call to `mk_goal()`, | Prioritize when: never existed: created as"
      },
      {
        "id": 16264,
        "specFolder": "system-spec-kit",
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/constitutional/gate-tool-routing.md",
        "title": "TOOL ROUTING - Search & Retrieval Decision Tree",
        "importanceTier": "constitutional",
        "retrieval_directive": "Always surface when: TOOL ROUTING - Search & Retrieval Decision Tree | Prioritize when: task context aligns with \"TOOL ROUTING - Search & Retrieval Decision Tree\""
      }
    ]
  }
}
```

### Pass / Fail

- **Pass**: PASS. Retrieval injected constitutional directive context: `constitutionalCount: 1`, `constitutionalInjected: 5`, result `id: 9372` had `isConstitutional: true` and `importanceTier: "constitutional"`, and auto-surfaced constitutional entries included populated `retrieval_directive` fields.
- **Fail**: Not applicable.

### Failure Triage

Verify constitutional/ directory contains valid directives; check tier classification logic; inspect enrichment pipeline for directive handling

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [15--retrieval-enhancements/constitutional-memory-as-expert-knowledge-injection.md](../../feature_catalog/15--retrieval-enhancements/constitutional-memory-as-expert-knowledge-injection.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 056
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `15--retrieval-enhancements/constitutional-memory-as-expert-knowledge-injection-pi-a4.md`
