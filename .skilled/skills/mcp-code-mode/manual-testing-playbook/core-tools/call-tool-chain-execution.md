---
title: "CM-004 -- call_tool_chain execution"
description: "This scenario validates call_tool_chain execution for `CM-004`. It focuses on confirming that `call_tool_chain` executes a TypeScript snippet that invokes external tools and returns the result."
version: 1.0.0.6
id: CM-004
category: core_tools
stage: routing
expected_workflow_mode: mcp-code-mode
expected_leaf_resources: []
---

# CM-004 -- call_tool_chain execution

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-004`.

---

## 1. OVERVIEW

This scenario validates `call_tool_chain` execution for `CM-004`. It focuses on confirming that a TypeScript snippet passed via the `code` argument compiles, executes, and can invoke other tools (such as `list_tools()`) — returning a result the operator can consume.

### Why This Matters

`call_tool_chain` is the only way to compose multiple MCP tool calls into a single Code Mode execution. If it can't execute basic snippets or doesn't expose the tool functions, every multi-tool workflow scenario (CM-011..CM-016) is unverifiable.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CM-004` and confirm the expected signals without contradictory evidence.

- Objective: Verify `call_tool_chain({code: "..."})` executes a TypeScript snippet that calls `list_tools()` and returns the count of registered tools.
- Real user request: `"How many MCP tools are registered right now?"`
- Prompt: `Run a small call_tool_chain snippet that counts registered tools and report whether it returns a positive number.`
- Expected execution process: call `call_tool_chain` with a small TypeScript snippet; do not delegate.
- Expected signals: chain returns a number; the number > 0; no compile or runtime error in the response.
- Desired user-visible outcome: A short report stating the tool count and a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if snippet fails to compile, throws at runtime, or returns a non-numeric value.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run a small call_tool_chain snippet that counts registered tools and report whether it returns a positive number.`

### Commands

1. `call_tool_chain({ code: "const tools = await list_tools(); return tools.length;" })`
2. Inspect the returned value

### Expected

- Step 1: chain returns successfully (no compile error, no runtime exception)
- Step 2: returned value is a number
- Step 2: number > 0

### Evidence

Capture the verbatim response including any compile/runtime error text. Capture the numeric return value.

### Pass / Fail

- **Pass**: Numeric tool count > 0 returned; no errors.
- **Fail**: Compile error (TypeScript syntax issue in the snippet), runtime exception, or returned value is not a number / is 0.

### Failure Triage

1. If compile error: simplify the snippet to `return 42` to test whether `call_tool_chain` itself works; if that fails, escalate as a Code Mode runtime bug.
2. If runtime error referencing `list_tools`: confirm the function name is exposed in the chain context; try `tools = await list_tools(); console.log(tools); return tools.length;` to see additional output.
3. If returns 0: cross-check via direct `list_tools()` call (CM-001) — if direct call returns > 0 but chain returns 0, there's a context-isolation bug in chain execution.

### Optional Supplemental Checks

- Test with a longer snippet calling 2 tools sequentially; confirms both are accessible inside the chain (precursor to CM-011).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-code-mode/SKILL.md` | call_tool_chain API spec |

---

## 5. SOURCE METADATA

- Group: CORE TOOLS
- Playbook ID: CM-004
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `core-tools/call-tool-chain-execution.md`
