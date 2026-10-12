---
title: "HERMES-019 -- MCP code_mode reach"
description: "Confirm a configured MCP server is reachable only when its name appears in the `-t` list, proving the toolset list gates MCP as well as built-in toolsets for `HERMES-019`."
version: 1.0.0.0
---

# HERMES-019 -- MCP code_mode reach

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `HERMES-019`.

---

## 1. OVERVIEW

MCP servers are configured at the user level, but configuration alone does not make one visible to a dispatch. The server's name is a toolset: a run that does not list it never sees its tools, and never reports an error about it either.

This scenario calls a real tool on the configured `code_mode` server with the name in `-t`, then repeats the request without it as the control.

### Why This Matters

The silent half is the dangerous half. A dispatch that omits the server name gets no error, just a session that quietly lacks the capability, which is easy to misread as the server being down.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-019` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a configured MCP server is reachable only when its name appears in the `-t` list, proving the toolset list gates MCP as well as built-in toolsets.
- Real user request: `Can the Hermes session use our code-mode MCP tools, and what does it see if I forget to enable them?`
- Prompt: `Call the code_mode MCP tool search_tools with the query 'spec' exactly once, then report the tool names it returned. If you have no code_mode tool available, reply exactly NO_CODE_MODE.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on each dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0` for both runs; the enabled run reports a concrete list of tool names returned by `search_tools`; the control answers exactly `NO_CODE_MODE` with no error text about a missing or unreachable server.
- Evidence: Both complete stdout captures, both exit codes, both elapsed times, both session ids, and the returned tool-name list from the enabled run.
- Desired user-visible outcome: a concise verdict naming the observed signal and the evidence behind it.
- Pass/fail: PASS when the enabled run returns real tool names and the control reports the tool is unavailable; FAIL when the enabled run cannot reach the server, or when the control also reaches it, which would mean `-t` does not gate MCP; SKIP only when the server is missing from the user-level config, naming that missing operator step as the blocker.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including `command -v hermes`.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr, exit code and elapsed seconds separately for every dispatch.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none \
  -t file,todo,code_mode --max-turns 8 --run-budget 240 \
  -q "Call the code_mode MCP tool search_tools with the query 'spec' exactly once, then report the tool names it returned. If you have no code_mode tool available, reply exactly NO_CODE_MODE." \
  </dev/null >out.txt 2>err.txt
echo $?
cat out.txt

# negative control: the same request with the server name removed from -t
perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none \
  -t file,todo --max-turns 5 --run-budget 150 \
  -q "Call the code_mode MCP tool search_tools with the query 'spec' exactly once, then report the tool names it returned. If you have no code_mode tool available, reply exactly NO_CODE_MODE." \
  </dev/null >neg.txt 2>neg.err
cat neg.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-019 | MCP code_mode reach | Confirm a configured MCP server is reachable only when its name appears in the `-t` list, proving the toolset list gates MCP as well as built-in toolsets | `Call the code_mode MCP tool search_tools with the query 'spec' exactly once, then report the tool names it returned. If you have no code_mode tool available, reply exactly NO_CODE_MODE.` | 1. `perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none -t file,todo,code_mode --max-turns 8 --run-budget 240 -q "Call the code_mode MCP tool search_tools with the query 'spec' exactly once, then report the tool names it returned. If you have no code_mode tool available, reply exactly NO_CODE_MODE." </dev/null >out.txt 2>err.txt` -> 2. `echo $?` -> 3. `cat out.txt` -> 4. Negative control: repeat step 1 with `-t file,todo`, capturing `neg.txt` -> 5. `cat neg.txt` | Exit code `0` for both runs; the enabled run reports a concrete list of tool names returned by `search_tools`; the control answers exactly `NO_CODE_MODE` with no error text about a missing or unreachable server | Both complete stdout captures, both exit codes, both elapsed times, both session ids, and the returned tool-name list from the enabled run | PASS when the enabled run returns real tool names and the control reports the tool is unavailable; FAIL when the enabled run cannot reach the server, or when the control also reaches it, which would mean `-t` does not gate MCP; SKIP only when the server is missing from the user-level config, naming that missing operator step as the blocker | An enabled run that cannot reach the server points at the operator's `hermes mcp add` step or a per-tool enable, not at the `-t` list. A control that reaches the server anyway would contradict the documented gating and should be escalated with both transcripts. Note that neither failure produces an error message, so absence of output is the only symptom and must be read as such |

### Recorded Result

**Executed 2026-09-14, second pass** (`-t file,todo,code_mode`): enabled run exit 0 in 30 s (session `20260914_230102_cd03b6`), reporting ten tool names from `search_tools`, beginning `magicpath.inspect_component` and `magnific.magnific.flows_list`. Control on `-t file,todo` exit 0 in 25 s with exactly `NO_CODE_MODE` (session `20260914_230136_8b68fb`). Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `integration-patterns/mcp-code-mode-reach.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [mcp-policy.md](../../references/mcp-policy.md) | Operator steps for MCP and the deny-by-default per-tool posture |
| [hermes-tools.md](../../references/hermes-tools.md) | The toolset table row making an MCP server name a toolset |

---

## 5. SOURCE METADATA

- Group: Integration Patterns
- Playbook ID: HERMES-019
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `integration-patterns/mcp-code-mode-reach.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
