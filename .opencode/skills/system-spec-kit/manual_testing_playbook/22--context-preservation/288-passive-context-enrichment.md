---
title: "288 -- Passive context enrichment"
description: "Validates the server-side auto-enrichment pipeline that appends constitutional memories, triggered memories, and code graph status to every MCP response."
audited_post_018: true
---

# 288 -- Passive context enrichment

## 1. OVERVIEW

This scenario validates the passive enrichment pipeline. It exercises the memory-surface hook that injects constitutional memories and trigger-matched records, the response-hints hook that appends them with token estimation, and the mutation-feedback hook that adds save/update/delete context.

---

## 2. SCENARIO CONTRACT

- Objective: Verify constitutional memories, trigger-matched records, and code graph status appear in MCP response hints without explicit memory_context calls, and that token estimation prevents oversized payloads.
- Real user request: `Please validate passive context enrichment: prove that constitutional memories and triggered memories surface in tool response hints automatically and that code graph status is included when available.`
- Prompt: `Validate passive context enrichment and confirm tool responses carry constitutional memories, triggered memories, and code graph status in hints.`
- Expected execution process: Call a non-memory tool with a prompt that triggers a known memory, inspect the response hints section, check the mutation-feedback path with a save call.
- Expected signals: Constitutional memories surface in the hints section of every tool response; trigger-matched memories appear when the prompt matches known trigger phrases; code graph status is included when available; mutation tools include save/update/delete feedback; token estimation truncates oversized hint payloads rather than exceeding budget.
- Desired user-visible outcome: Pass/fail verdict with cited hint section contents.
- Pass/fail: PASS when hints surface the documented categories and token budget is respected. FAIL when hints are empty for a known trigger, mutation feedback is missing, or token budget is exceeded.

---

## 3. TEST EXECUTION

### Prompt

```
Validate passive context enrichment and confirm tool responses carry constitutional memories, triggered memories, and code graph status in hints.
```

### Commands

1. Identify a known trigger phrase from existing memory entries (look at `memory_match_triggers({ input: "<known phrase>" })` first to confirm).
2. Call any tool with an input containing the trigger phrase (e.g. `memory_stats({ scope: "<known phrase>" })`).
3. Inspect the response envelope's hints section. Assert it contains constitutional memories and the trigger-matched memory.
4. Inspect the hints section for code graph status (graph readiness or staleness marker).
5. Issue a `memory_save` call against a small disposable file and inspect the response hints for mutation feedback.
6. Pick a prompt that would generate an oversized hint payload (many matching triggers). Assert the response hints are truncated to the documented token budget rather than ballooning the response.

### Expected

- Hints section carries constitutional memories on every response.
- Trigger-matched memories appear for prompts that hit known triggers.
- Code graph status is included when available.
- Mutation feedback appears on save/update/delete responses.
- Token estimation prevents oversized hint payloads.

### Evidence

- Three response envelopes (regular tool call, mutation tool call, oversized-hint scenario)
- Hints section content for each

### Pass / Fail

- **Pass**: documented categories surface, mutation feedback present, token budget respected.
- **Fail**: hints empty for known trigger, mutation feedback missing, payload exceeds budget.

### Failure Triage

Inspect `mcp_server/hooks/memory-surface.ts` for the surfacing logic. Check `mcp_server/hooks/response-hints.ts` for token estimation and append step. Verify `mcp_server/hooks/mutation-feedback.ts` is wired into the save/update/delete handlers.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation/20-passive-context-enrichment.md](../../feature_catalog/22--context-preservation/20-passive-context-enrichment.md)
- Source: `.opencode/skills/system-spec-kit/mcp_server/hooks/memory-surface.ts`, `.opencode/skills/system-spec-kit/mcp_server/hooks/response-hints.ts`, `.opencode/skills/system-spec-kit/mcp_server/hooks/mutation-feedback.ts`

---

## 5. SOURCE METADATA

- Group: Context preservation
- Playbook ID: 288
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation/288-passive-context-enrichment.md`
