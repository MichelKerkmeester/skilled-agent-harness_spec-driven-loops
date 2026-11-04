---
title: Workflow Examples - Discovery-First MCP Patterns
description: Discovery-first workflow patterns for Code Mode orchestration, validation, error handling, and state persistence.
trigger_phrases:
  - "call_tool_chain patterns"
  - "multi tool orchestration"
  - "code mode workflow examples"
  - "error handling with fallbacks"
  - "sandbox state persistence"
importance_tier: normal
contextType: implementation
version: 1.0.2.0
---

# Workflow Examples - Discovery-First MCP Patterns

Open this reference when a tool result may affect the next call or the success report.

---

## 1. OVERVIEW

### Purpose

This reference provides discovery-first patterns for MCP calls, validation, error handling, and state persistence.

### When to Use

- When a tool result may affect the next call or the success report.
- When planning dependent calls, parallel reads, partial-success handling, or timeouts.

### Core Principle

The configured manuals are fixed in `.utcp_config.json`; callable tools are not. Every workflow therefore discovers the manual and tool schema before calling it.

---

## 2. DISCOVER, INSPECT, CALL

Use the returned schema to replace the placeholder arguments before execution. The exact namespace is part of the discovered contract; do not derive it from an old example.

```typescript
const candidates = await search_tools({
  task_description: "the requested operation",
  limit: 10
});

const toolName = candidates.tools?.[0]?.name;
if (!toolName) {
  throw new Error("No live MCP tool matched the requested operation");
}

const schema = await tool_info({ tool_name: toolName });
const result = await call_tool_chain({
  code: `const output = await ${toolName}({}); return output;`
});
```

---

## 3. ENUMERATE A MANUAL

The configured manual names are listed in [tool-catalog.md](./tool-catalog.md). A zero-result enumeration is an availability or authentication signal, not evidence that a guessed namespace is correct.

```typescript
const allTools = await list_tools();
const manualName = "<configured manual name>";
const manualTools = allTools.tools.filter((tool) => tool.startsWith(`${manualName}.`));

return manualTools.map((tool) => tool.name ?? tool);
```

---

## 4. CONFIRMED MOBBIN SEARCH

The Mobbin packet documents `search_screens`, `search_flows`, and `search_sections`; re-confirm all three with `tool_info()` in a fresh session.

This is the concrete example for the currently confirmed three-tool Mobbin surface:

```typescript
const screenSchema = await tool_info({
  tool_name: "mobbin.mobbin_search_screens"
});

const result = await call_tool_chain({
  code: `
    const screens = await mobbin.mobbin_search_screens({
      query: "iOS banking onboarding",
      platform: "ios",
      limit: 5
    });
    return screens;
  `
});
```

---

## 5. SEQUENTIAL CHAIN WITH VALIDATION

Keep dependent operations in one chain when the second call consumes the first result. Inspect both envelopes before reporting success.

```typescript
const first = await call_tool_chain({
  code: `const result = await <discovered_manual>.<discovered_tool>({}); return result;`
});

if (!first || first.error) {
  throw new Error("The first MCP operation did not return a usable result");
}

const second = await call_tool_chain({
  code: `const result = await <discovered_manual>.<discovered_follow_up>({}); return result;`
});

return { first, second };
```

---

## 6. PARALLEL READ-ONLY WORK

Use parallel execution only for independent reads. Do not parallelize mutations, and do not hide a failed branch inside a successful aggregate.

```typescript
const [left, right] = await Promise.all([
  call_tool_chain({ code: `return await <manual>.<read_tool>({});` }),
  call_tool_chain({ code: `return await <manual>.<other_read_tool>({});` })
]);

return { left, right };
```

---

## 7. ERROR AND PARTIAL-SUCCESS HANDLING

Report partial success explicitly. A successful call does not prove that a sibling call, manual, or authentication path is healthy.

```typescript
const outcomes = await Promise.allSettled([
  call_tool_chain({ code: `return await <manual>.<first_read>({});` }),
  call_tool_chain({ code: `return await <manual>.<second_read>({});` })
]);

return {
  succeeded: outcomes.filter((item) => item.status === "fulfilled"),
  failed: outcomes.filter((item) => item.status === "rejected")
};
```

---

## 8. STATE AND TIMEOUTS

- Keep intermediate data in local variables inside one `call_tool_chain` execution.
- Use a timeout appropriate to the number and size of calls.
- Return a bounded summary rather than dumping large tool responses into logs.

```typescript
await call_tool_chain({
  code: `return await <manual>.<read_tool>({});`,
  timeout: 60000
});
```

For the full manual-testing coverage, use the manifest-routed playbook leaves under `manual-testing-playbook/`.
