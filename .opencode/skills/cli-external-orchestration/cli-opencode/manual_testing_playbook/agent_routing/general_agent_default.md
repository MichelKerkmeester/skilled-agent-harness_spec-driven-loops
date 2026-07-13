---
title: "CO-013 -- Unflagged default-agent route"
description: "This scenario validates the unflagged default-agent route for `CO-013`. It focuses on confirming that OMITTING `--agent` (never passing `--agent general`) produces the expected implementation-style behavior."
version: 1.3.0.12
---

# CO-013 -- Unflagged default-agent route

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-013`.

---

## 1. OVERVIEW

This scenario validates the unflagged default-agent route for `CO-013`. It focuses on confirming that a top-level `opencode run` dispatch with `--agent` OMITTED entirely loads the default agent and produces routine implementation-style behavior (file reads, optional writes, multi-step reasoning).

### Why This Matters

`general` is an OpenCode built-in, not a project-local `.opencode/agents/general.md` file, and the current cli-opencode contract explicitly forbids passing it at the top level: `opencode run --agent general` is rejected by the installed binary (SKILL.md §3 "The `--agent` flag" note; hard rule `no-bare-agent-general`). The default agent already runs whenever `--agent` is omitted, which is what every ordinary dispatch should do. If the unflagged path silently fails or produces degraded behavior, the entire default-routing contract collapses and every other scenario that relies on the unflagged shape inherits the failure.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-013` and confirm the expected signals without contradictory evidence.

- Objective: Confirm an `opencode run` dispatch with `--agent` omitted loads the default agent and the dispatched session demonstrates implementation-style behavior (file reads, multi-step reasoning) without the dispatch being rejected or silently degraded.
- Real user request: `Use opencode run with no --agent flag at all and have it perform a simple multi-step task: read a small project file and write a one-paragraph summary back to the user.`
- RCAF Prompt: `As an external-AI conductor verifying the unflagged default-agent route, dispatch opencode run WITHOUT any --agent flag, with a prompt that requires a Read tool call against a small project file (e.g. .opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md) and a multi-step reasoning summary. Verify the JSON event stream shows a tool.call for Read and the response references content from the file. Return a concise pass/fail verdict naming the file read and the summary's first sentence.`
- Expected execution process: External-AI orchestrator dispatches with no `--agent` flag at all, captures the JSON event stream, validates a `tool.call` for the Read tool appears and validates the response references content from the read file.
- Expected signals: Dispatch exits 0. JSON event stream includes a `tool.call` event whose payload references the Read tool. Response references content from `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md`. Dispatched command line contains NO `--agent` flag. Runtime under 90 seconds.
- Desired user-visible outcome: Verdict naming the file read and the summary's first sentence.
- Pass/fail: PASS if exit 0 AND Read `tool.call` appears AND response references SKILL.md content AND no `--agent` flag was passed. FAIL if any check fails or the dispatch was rejected.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Dispatch with `--agent` omitted entirely and a prompt that requires a Read.
3. Parse the JSON event stream for the Read tool.call event.
4. Validate the response references SKILL.md content.
5. Return a verdict naming the read file and summary first sentence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-013 | Unflagged default-agent route | Confirm omitting `--agent` loads the default agent and produces implementation-style behavior | `As an external-AI conductor verifying the unflagged default-agent route, dispatch opencode run WITHOUT any --agent flag, with a prompt that requires a Read tool call against a small project file (e.g. .opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md) and a multi-step reasoning summary. Verify the JSON event stream shows a tool.call for Read and the response references content from the file. Return a concise pass/fail verdict naming the file read and the summary's first sentence.` | 1. `bash: opencode run --model deepseek/deepseek-v4-pro --variant high --format json --dir "$(pwd)" "Use the Read tool to read .opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md and summarize what the cli-opencode skill does in one short paragraph. Mention the three documented use cases by number." > /tmp/co-013-events.jsonl 2>&1` -> 2. `bash: echo "Exit: $?"` -> 3. `bash: jq -r 'select(.type == "tool.call") \| .payload.name' /tmp/co-013-events.jsonl \| sort -u` -> 4. `bash: jq -r 'select(.type == "tool.call" and (.payload.name \| test("Read";"i"))) \| .payload' /tmp/co-013-events.jsonl \| wc -l` -> 5. `bash: jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-013-events.jsonl \| grep -ciE '(use case 1\|use case 2\|use case 3\|external runtime\|parallel detached\|cross-AI handback)'` | Step 1: events captured non-empty; Step 2: exit 0; Step 3: tool.call names include `Read` (case-insensitive); Step 4: count of Read tool calls >= 1; Step 5: response references at least 2 of the three use cases (count >= 2) | `/tmp/co-013-events.jsonl`, terminal histogram of tool.call names | PASS if exit 0 AND Read tool.call appears AND >= 2 use cases mentioned AND no `--agent` flag in the dispatched command; FAIL if any check fails | 1. If `Read` tool.call is missing, the agent may have answered from cache without reading — re-prompt with stronger "use the Read tool" wording; 2. If response is generic, re-verify the exact dispatched command omitted `--agent` entirely; 3. If exit code is non-zero, check whether an explicit `--agent general` was accidentally reintroduced (opencode rejects it at the top level per hard rule `no-bare-agent-general`) and parse stderr for the specific error |

### Optional Supplemental Checks

For agent-frontmatter introspection of a project-local agent (not the `general` built-in, which has no `.opencode/agents/general.md` file), run `opencode debug agent orchestrate` separately and confirm the resolved frontmatter matches `.opencode/agents/orchestrate.md`. This catches user-level agent fallbacks that might silently shadow a project agent.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/agent_delegation.md` (§3 AGENT ROSTER + §4 routing matrix) | Documents the default route and the primary/subagent split |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 "The `--agent` flag (read this)" note (never pass `--agent general` at the top level) and ALWAYS rule 3 |
| `../../references/agent_delegation.md` | §4 routing matrix (default / unspecified -> omit `--agent`) |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CO-013
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `agent_routing/general_agent_default.md`
