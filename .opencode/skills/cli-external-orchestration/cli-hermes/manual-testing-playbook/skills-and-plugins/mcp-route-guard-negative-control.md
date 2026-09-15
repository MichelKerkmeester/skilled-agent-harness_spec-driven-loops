---
title: "HERMES-026 -- MCP route guard stays silent for the Code Mode server"
description: "Confirm the MCP route guard bridge lets a Code Mode server call through untouched, its advisory being reserved for native calls to families Code Mode can route, for `HERMES-026`."
version: 1.0.0.0
---

# HERMES-026 -- MCP route guard stays silent for the Code Mode server

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `HERMES-026`.

---

## 1. OVERVIEW

The `repo-guards` plugin runs the MCP route guard core in `pre_tool_call` for every MCP tool (Hermes registers them as `mcp__<server>__<tool>`, the core's own name form) and appends any advisory to the tool result. The core advises only on a native call to a family Code Mode can route; the Code Mode server itself is never advised against, so on a machine whose only MCP server is `code_mode` the live check is a negative control, and the positive path is the in-process harness with a ClickUp-shaped tool name.

### Why This Matters

The other six runtimes run this guard through their hook adapters; a Hermes session that skipped it would be the one place the rule does not hold. The proof is the guard's own text arriving in the session.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-026` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a Code Mode MCP call through Hermes returns its normal result with no route-guard advisory and no error.
- Real user request: `Prove the MCP guard does not get in the way of our own Code Mode server.`
- Prompt: `Call the code_mode MCP tool that searches tools with the query 'spec', then reply with exactly two lines: line 1 = TOOLS=<count of results>, line 2 = ADVISORY if the tool result contained any text beginning 'mcp-route-guard:' or NO_ADVISORY otherwise.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on the dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0`; line 1 `TOOLS=<n>` with n above zero; line 2 `NO_ADVISORY`; `session_id:` on stderr.
- Evidence: stdout, exit code, elapsed seconds, the stderr session id
- Desired user-visible outcome: a concise verdict naming the observed guard text and the evidence behind it.
- Pass/fail: PASS on a positive count and `NO_ADVISORY`; FAIL on an advisory for the Code Mode server or a tool error; SKIP only on a named blocker (the `code_mode` server not configured).

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including `command -v hermes` and the plugin allowlist entry.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr, exit code and elapsed seconds separately.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
HERMES_ENABLE_PROJECT_PLUGINS=1 perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool \
  --provider llmgateway --model glm-5.3-flash --reasoning none -t file,todo,code_mode --max-turns 2 --run-budget 150 \
  -q "Call the code_mode MCP tool that searches tools with the query 'spec', then reply with exactly two lines: line 1 = TOOLS=<count of results>, line 2 = ADVISORY if the tool result contained any text beginning 'mcp-route-guard:' or NO_ADVISORY otherwise." </dev/null >out.txt 2>err.txt
echo $?
cat out.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-026 | MCP route guard stays silent for the Code Mode server | Confirm a Code Mode MCP call through Hermes returns its normal result with no route-guard advisory and no error. | `Call the code_mode MCP tool that searches tools with the query 'spec', then reply with exactly two lines: line 1 = TOOLS=<count of results>, line 2 = ADVISORY if the tool result contained any text beginning 'mcp-route-guard:' or NO_ADVISORY otherwise.` | the `hermes chat` dispatch in §3 | Exit code `0`; line 1 `TOOLS=<n>` with n above zero; line 2 `NO_ADVISORY`; `session_id:` on stderr. | stdout, exit code, elapsed seconds, the stderr session id | PASS on a positive count and `NO_ADVISORY`; FAIL on an advisory for the Code Mode server or a tool error; SKIP only on a named blocker (the `code_mode` server not configured). | Harness: the plugin did not load. Dependency: `hermes mcp list` lacks `code_mode`. Adapter: an advisory for the Code Mode family, which means the core's manifest normalization changed |

### Recorded Result

**Executed 2026-09-15**: live negative control exit 0 after 35 s, `TOOLS=10` then `NO_ADVISORY`, session `20260915_083406_ca99f7` (the two-turn cap ended the run right after the answer, the expected shape for this prompt). In-process positive path the same day: `mcp__claude_ai_ClickUp__clickup_create_task` received `mcp-route-guard: native call to "claude_ai_ClickUp" -- Code Mode can route this family ...` appended to its result, and `mcp__code_mode__search_tools` received nothing.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `skills-and-plugins/mcp-route-guard-negative-control.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SYNC.md](../../../../../../.hermes/SYNC.md) | What the plugin bridges and how |
| [hook-contract.md](../../references/hook-contract.md) | The plugin hook map |
| `.opencode/hooks/mcp-route-guard/devin/mcp-route-guard.cjs` | The core the bridge runs |

---

## 5. SOURCE METADATA

- Group: Skills And Plugins
- Playbook ID: HERMES-026
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `skills-and-plugins/mcp-route-guard-negative-control.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
