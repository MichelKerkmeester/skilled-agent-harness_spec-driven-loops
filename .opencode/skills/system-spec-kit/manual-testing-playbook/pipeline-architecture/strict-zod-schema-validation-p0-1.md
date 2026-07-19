---
title: "095 -- Strict Zod schema validation (P0-1)"
description: "This scenario validates Strict Zod schema validation (P0-1) for `095`. It focuses on Confirm schema enforcement rejects hallucinated params."
audited_post_018: true
version: 3.6.0.16
id: pipeline-architecture-strict-zod-schema-validation-p0-1
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 095 -- Strict Zod schema validation (P0-1)

## 1. OVERVIEW

This scenario validates Strict Zod schema validation (P0-1) for `095`. It focuses on Confirm schema enforcement rejects hallucinated params.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm schema enforcement rejects hallucinated params.
- Real user request: `Please validate Strict Zod schema validation (P0-1) against memory_search({query:"test", bogus:1}) and tell me whether the expected signals are present: Zod strict error returned for unknown params in strict mode; extra params pass through in permissive mode; validation occurs per-tool in handler layer.`
- Prompt: `Validate strict Zod schema validation (P0-1) against memory_search({query:"test", bogus:1}) and return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Zod strict error returned for unknown params in strict mode; extra params pass through in permissive mode; validation occurs per-tool in handler layer
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if strict mode rejects unknown params and passthrough mode allows them

---

## 3. TEST EXECUTION

### Prompt

```
Validate strict Zod schema validation (P0-1) against memory_search({query:"test", bogus:1}) and return pass/fail with cited evidence.
```

### Commands

1. call any MCP tool with an extra unknown parameter (e.g., `memory_search({query:"test", bogus:1})`)
2. verify Zod strict error is returned
3. set `SPECKIT_STRICT_SCHEMAS=false` and confirm `.passthrough()` allows the extra param
4. verify validation runs per-tool in handler, not duplicated at server dispatch

### Expected

Zod strict error returned for unknown params in strict mode; extra params pass through in permissive mode; validation occurs per-tool in handler layer

### Evidence

Command: `node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"test","bogus":1}' --format json --timeout-ms 3000`

Output:

```text
[schema-validation] memory_search: Invalid arguments for "memory_search". Unknown parameter(s): bogus. Expected parameter names: cursor, query, concepts, specFolder, tenantId, userId, agentId, limit, sessionId, enableDedup, tier, contextType, useDecay, includeContiguity, includeConstitutional, enableSessionBoost, enableCausalBoost, includeContent, anchors, min_quality_score, minQualityScore, bypassCache, rerank, applyLengthPenalty, applyStateLimits, minState, intent, autoDetectIntent, trackAccess, includeArchived, mode, retrievalLevel, includeTrace, profile. Action: remove unknown keys and fix the listed parameter types/values, then retry the same tool call.
{
  "status": "error",
  "error": "Invalid arguments for \"memory_search\". Unknown parameter(s): bogus. Expected parameter names: cursor, query, concepts, specFolder, tenantId, userId, agentId, limit, sessionId, enableDedup, tier, contextType, useDecay, includeContiguity, includeConstitutional, enableSessionBoost, enableCausalBoost, includeContent, anchors, min_quality_score, minQualityScore, bypassCache, rerank, applyLengthPenalty, applyStateLimits, minState, intent, autoDetectIntent, trackAccess, includeArchived, mode, retrievalLevel, includeTrace, profile. Action: remove unknown keys and fix the listed parameter types/values, then retry the same tool call.",
  "exitCode": 64
}
(node:9529) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

Command: `SPECKIT_STRICT_SCHEMAS=false node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"test","bogus":1}' --format json --timeout-ms 3000`

Output:

```text
(node:10152) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{
  "summary": "Error: An unexpected error occurred. Please check logs for details.",
  "data": {
    "error": "An unexpected error occurred. Please check logs for details.",
    "code": "E030",
    "details": {
      "tool": "memory_search",
      "issues": [],
      "unknownParameters": [
        "bogus"
      ],
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

Source read evidence:

```text
.opencode/skills/system-spec-kit/mcp-server/schemas/tool-input-schemas.ts:28: export const getSchema = <T extends z.ZodRawShape>(shape: T): z.ZodObject<T> => {
.opencode/skills/system-spec-kit/mcp-server/schemas/tool-input-schemas.ts:29:   const strict = process.env.SPECKIT_STRICT_SCHEMAS !== 'false';
.opencode/skills/system-spec-kit/mcp-server/schemas/tool-input-schemas.ts:30:   const base = z.object(shape);
.opencode/skills/system-spec-kit/mcp-server/schemas/tool-input-schemas.ts:31:   return strict ? base.strict() : base.passthrough();
.opencode/skills/system-spec-kit/mcp-server/context-server.ts:1243:     // Validate at the server boundary before metrics, session priming, and
.opencode/skills/system-spec-kit/mcp-server/context-server.ts:1244:     // auto-surface logic can observe malformed raw tool arguments.
.opencode/skills/system-spec-kit/mcp-server/context-server.ts:1245:     const validatedArgs: Record<string, unknown> = KNOWN_TOOL_NAMES.has(name)
.opencode/skills/system-spec-kit/mcp-server/context-server.ts:1246:       ? validateToolArgs(name, args) as Record<string, unknown>
.opencode/skills/system-spec-kit/mcp-server/tools/memory-tools.ts:65: export async function handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
.opencode/skills/system-spec-kit/mcp-server/tools/memory-tools.ts:66:   switch (name) {
.opencode/skills/system-spec-kit/mcp-server/tools/memory-tools.ts:67:     case 'memory_search':         return handleMemorySearch(parseArgs<SearchArgs>(validateToolArgs('memory_search', args)));
.opencode/skills/system-spec-kit/mcp-server/spec-memory-cli.ts:515:   return {
.opencode/skills/system-spec-kit/mcp-server/spec-memory-cli.ts:516:     tool,
.opencode/skills/system-spec-kit/mcp-server/spec-memory-cli.ts:517:     args: validateToolArgs(tool.name, args) as Record<string, unknown>,
.opencode/skills/system-spec-kit/mcp-server/tests/tool-input-schema.vitest.ts:461:   it('runtime rejects unknown memory_search parameters', () => {
.opencode/skills/system-spec-kit/mcp-server/tests/tool-input-schema.vitest.ts:462:     expect(() => {
.opencode/skills/system-spec-kit/mcp-server/tests/tool-input-schema.vitest.ts:463:       validateToolArgs('memory_search', { query: 'valid query', unexpected: true } as Record<string, unknown>);
.opencode/skills/system-spec-kit/mcp-server/tests/tool-input-schema.vitest.ts:464:     }).toThrow(/Unknown parameter/);
```

### Pass / Fail

- **FAIL**: strict mode rejects unknown params, but `SPECKIT_STRICT_SCHEMAS=false` did not allow the extra `bogus` parameter and validation is present both in CLI/server-boundary paths and per-tool dispatch.

### Failure Triage

Inspect `tool-schemas.ts` for `.strict()` vs `.passthrough()` branching

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [pipeline-architecture/strict-zod-schema-validation.md](../../feature-catalog/pipeline-architecture/strict-zod-schema-validation.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 095
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `pipeline-architecture/strict-zod-schema-validation-p0-1.md`
