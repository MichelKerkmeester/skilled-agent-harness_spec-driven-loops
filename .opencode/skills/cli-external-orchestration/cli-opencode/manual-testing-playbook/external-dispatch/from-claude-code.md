---
title: "CO-006 -- External dispatch from Claude Code into OpenCode"
description: "This scenario validates use case 1 (external runtime to OpenCode) for `CO-006`. It focuses on confirming Claude Code can dispatch into a fresh OpenCode session via cli-opencode and load the project's full plugin / skill / MCP runtime."
version: 1.3.0.12
---

# CO-006 -- External dispatch from Claude Code into OpenCode

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-006`.

---

## 1. OVERVIEW

This scenario validates External dispatch from Claude Code into OpenCode for `CO-006`. It focuses on confirming the canonical use case 1 path documented in `references/integration-patterns.md` §2: an external Anthropic runtime (Claude Code) dispatches into a fresh OpenCode session that loads the full plugin / skill / MCP runtime in a single one-shot invocation.

### Why This Matters

Use case 1 is the most common cli-opencode dispatch path. It is the bridge that lets Claude Code (and other external runtimes) reach the project's skill advisor, code graph and Code Graph semantic index without forcing the operator to leave their host session. If this path breaks (binary missing, self-invocation guard misfires, plugin runtime fails to load inside the dispatched session), every external-AI workflow that depends on the project runtime regresses. This test proves the canonical use case 1 dispatch shape from Claude Code actually works end-to-end.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-006` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a Claude Code-led dispatch via cli-opencode reaches a fresh OpenCode session that loads the project's full plugin / skill / MCP runtime, with the dispatched session demonstrating access to a project-specific MCP tool (advisor_status) it could not call without the runtime.
- Real user request: `From Claude Code, use cli-opencode to dispatch a question to OpenCode that requires the skill-advisor MCP. Have OpenCode call advisor_status and report the daemon status.`
- RCAF Prompt: `As Claude Code dispatching from a fresh shell into a new OpenCode session via cli-opencode use case 1, dispatch a single one-shot prompt against /tmp/co-006-events.jsonl that asks the dispatched session to load the system-spec-kit skill and call the skill-advisor advisor_status MCP tool to return the daemon status. Verify the JSON event stream contains a tool.call event for advisor_status, the session.completed payload references the daemon health (e.g. OK, healthy, row counts), and runtime stays under 120 seconds. Return a one-line pass/fail verdict naming the daemon health status and confirming the use case 1 path is healthy.`
- Expected execution process: Claude Code (external runtime) confirms self-invocation guard does NOT trip, dispatches via the cli-opencode default invocation shape with a prompt that explicitly calls advisor_status, captures the JSON event stream and verifies a `tool.call` event for advisor_status is present in the stream.
- Expected signals: Dispatch exits 0. JSON event stream contains a `tool.call` event whose payload references `advisor_status`. The session.completed event's summary or a message.delta references the daemon health status. Runtime under 120 seconds.
- Desired user-visible outcome: Verdict naming the daemon health status returned by advisor_status and confirming the use case 1 path is healthy.
- Pass/fail: PASS if exit 0 AND `tool.call` for advisor_status appears AND session.completed references the daemon status. FAIL if dispatch fails, advisor_status is not called or the response does not surface the status.

> **Cross-AI dependency note:** This scenario assumes the operator runs from inside Claude Code OR from a fresh shell. The dispatched OpenCode session is what we are validating. Claude Code itself is just the originator. PASS condition is satisfied by opencode emitting the correct delegation event and tool.call regardless of which external runtime initiated the dispatch.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Confirm the originating runtime is NOT OpenCode (no `OPENCODE_*` env var). Claude Code or a fresh shell both work.
3. Dispatch via the cli-opencode default invocation shape with the explicit advisor_status request.
4. Parse the JSON event stream and look for the advisor_status `tool.call` event.
5. Inspect the session.completed event for the daemon status.
6. Return a verdict naming the status and confirming use case 1 path is healthy.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-006 | External dispatch from Claude Code into OpenCode | Confirm use case 1 dispatch from an external Anthropic runtime reaches a fresh OpenCode session with full MCP runtime | `As Claude Code dispatching from a fresh shell into a new OpenCode session via cli-opencode use case 1, dispatch a single one-shot prompt against /tmp/co-006-events.jsonl that asks the dispatched session to load the system-spec-kit skill and call the skill-advisor advisor_status MCP tool to return the daemon status. Verify the JSON event stream contains a tool.call event for advisor_status, the session.completed payload references the daemon health (e.g. OK, healthy, row counts), and runtime stays under 120 seconds. Return a one-line pass/fail verdict naming the daemon health status and confirming the use case 1 path is healthy.` | 1. `bash: env \| grep -q '^OPENCODE_' && echo "ABORT: in-OpenCode" \|\| echo "OK: external runtime"` -> 2. `bash: REPO_ROOT="$(pwd)"; opencode run --model opencode-go/deepseek-v4-flash --variant max --format json --dir "$REPO_ROOT" "Use the skill-advisor MCP. Call advisor_status and tell me the daemon status in one short sentence." > /tmp/co-006-events.jsonl 2>&1` -> 3. `bash: echo "Exit: $?"` -> 4. `bash: jq -r 'select(.type == "tool.call") \| .payload.name' /tmp/co-006-events.jsonl \| sort -u` -> 5. `bash: jq -r 'select(.type == "tool.call" and (.payload.name \| test("advisor_status"))) \| .payload' /tmp/co-006-events.jsonl \| wc -l` -> 6. `bash: jq -r 'select(.type == "session.completed") \| .payload' /tmp/co-006-events.jsonl` | Step 1: prints `OK: external runtime`; Step 2: events captured; Step 3: exit 0; Step 4: tool.call names include `advisor_status` (or the equivalent MCP tool slug); Step 5: count of advisor_status calls >= 1; Step 6: session.completed payload references daemon health (e.g. `OK`, `healthy`, row counts) | `/tmp/co-006-events.jsonl`, terminal transcript with parent-runtime detection | PASS if exit 0 AND advisor_status `tool.call` appears AND session.completed references the daemon status; FAIL if dispatch fails or advisor_status is not called | 1. If the dispatch is refused with self-invocation message, the originating runtime IS OpenCode — switch to a fresh shell or use a sibling cli-* skill instead; 2. If `tool.call` events are missing, parse the entire stream and look for `error` events; 3. If advisor_status is never called, the session may have skipped the MCP — re-prompt with explicit "use the advisor_status MCP tool" wording; 4. Confirm the system_skill_advisor MCP server is registered in `opencode.json` |

### Optional Supplemental Checks


---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/integration-patterns.md` (§2 USE CASE 1: EXTERNAL RUNTIME TO OPENCODE) | The canonical use case 1 contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §1 activation triggers (full plugin/skill/MCP runtime), §3 default invocation, ALWAYS rule 10 (classify use case before dispatch) |
| `../../references/opencode-tools.md` (§2 Full Plugin, Skill and MCP Runtime) | Documents the unique value prop this test validates |

---

## 5. SOURCE METADATA

- Group: External Dispatch
- Playbook ID: CO-006
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `external-dispatch/from-claude-code.md`
